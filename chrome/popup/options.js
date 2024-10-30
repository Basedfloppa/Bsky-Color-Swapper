let red = document.getElementById("red");
let blue = document.getElementById("blue");
let green = document.getElementById("green");

let redVal = document.getElementById("redValue");
let blueVal = document.getElementById("blueValue");
let greenVal = document.getElementById("greenValue");

let hue = document.getElementById("hue");
let saturation = document.getElementById("saturation");
let lightness = document.getElementById("lightness");

let hueVal = document.getElementById("hueValue");
let saturationVal = document.getElementById("saturationValue");
let lightnessVal = document.getElementById("lightnessValue");

let hex = document.getElementById("hex");

let swatch = document.getElementById("colorSwatch");

let colorName = document.getElementById("colorName");

colorName.addEventListener("input", setColor);

red.addEventListener("input", updateColor);
green.addEventListener("input", updateColor);
blue.addEventListener("input", updateColor);

hue.addEventListener("input", updateColor);
saturation.addEventListener("input", updateColor);
lightness.addEventListener("input", updateColor);

hex.addEventListener("input", updateColor);

async function init() {
  const options = Array.from(colorName.options);
  const colors = await Promise.all(
    options.map(option => getStorageValue(option.value) ?? "rgb(0,0,0)")
  );
  colors.forEach((color, i) => {
    document.getElementById(options[i].value).style["background-color"] = color;
  });
  setColor();
}
function getStorageValue(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}
function updateColor() {
  let tab = Array.from(document.getElementById("colorTab").childNodes).filter(x => x.type != undefined && Array.from(x.firstElementChild.classList).includes("active"))[0].firstElementChild.id.split("-")[0];
  let color = "";

  switch (tab) {
    case "rgb":
      color = "rgb(" + red.value + "," + green.value + "," + blue.value + ")";
      updateRgbVal();
      break;
    case "hsl":
      color = convertToRgb("hsl(" + hue.value + "," + saturation.value + "%," + lightness.value + "%)");
      color = "rgb(" + color['r'] + "," + color['g'] + "," + color['b'] + ")";
      updateHslVal();
      break;
    case "hex":
      color = hexToRgb(hex.value);
      color = "rgb(" + color['r'] + "," + color['g'] + "," + color['b'] + ")";
      break;
  }

  swatch.style["background-color"] = color;
  document.getElementById(colorName.value).style["background-color"] = color;

  let variable = { Name: colorName.value, Value: color };
  chrome.storage.local.set({ [variable.Name]: variable.Value });

  chrome.runtime.sendMessage({ type: 'applyTheme' });
}
async function setColor() {
  let color = await getStorageValue(colorName.value) ?? "rgb(0,0,0)";
  color = convertToRgb(color) ?? { 'r': '0', 'g': '0', 'b': '0' };

  swatch.style["background-color"] = "rgb(" + color['r'] + "," + color['g'] + "," + color['b'] + ")";

  red.value = color['r'];
  green.value = color['g'];
  blue.value = color['b'];
  updateRgbVal();

  let hslColor = rgbToHsl(color['r'], color['g'], color['b']);
  hue.value = hslColor['h'];
  saturation.value = hslColor['s'];
  lightness.value = hslColor['l'];
  updateHslVal();

  hex.value = rgbToHex(color['r'], color['g'], color['b']);
}
async function reset() {
  const options = Array.from(colorName.options).map(x => x.value);

  for (let option of options) {
    colorName.value = option;

    await setColor(); 
    await updateColor();
    await init(); 
  }
}


function updateRgbVal() {
  redVal.innerHTML = red.value;
  greenVal.innerHTML = green.value;
  blueVal.innerHTML = blue.value;
}
function updateHslVal() {
  hueVal.innerHTML = hue.value;
  saturationVal.innerHTML = saturation.value;
  lightnessVal.innerHTML = lightness.value;
}

document.addEventListener("DOMContentLoaded", init);

// #region Colors
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}
// Convert RGB to Hex
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
// Convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255)
  };
}
// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
// Convert Hex to HSL
function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}
// Parse an RGB string to RGB object
function parseRgbString(rgbString) {
  const match = rgbString.match(/\d+/g);
  if (!match) return null;
  return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
}
// Convert color string to RGB
function convertToRgb(color) {
  if (color.startsWith("hsl")) {
    const match = color.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
    if (!match) return null;
    return hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
  } else if (color.startsWith("#")) {
    return hexToRgb(color);
  } else if (color.startsWith("rgb")) {
    return parseRgbString(color);
  }
  return null;
}

// #region PreMadeThemes
const purpleLight = document.getElementById("PurpleLight");
if (purpleLight) {
    purpleLight.addEventListener("click", PurpleLight);
}
function PurpleLight() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#bb98ff',
    "ColorMap--accent-color-hover": '#8a2be2',
    "ColorMap--butterfly-icon": '#8a2be2',
    "ColorMap--background": '#ffffff',
    "ColorMap--content-warnings": '#dfcfff',
    "ColorMap--content-warnings-hover": '#baa3e7',
    "ColorMap--text-primary": '#000000',
    "ColorMap--text-secondary": '#535353',
    "ColorMap--border-color": '#000000'
  }, reset);
}
const purpleDim = document.getElementById("PurpleDim");
if (purpleDim) {
  purpleDim.addEventListener("click", PurpleDim);
}
function PurpleDim() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#bb98ff',
    "ColorMap--accent-color-hover": '#8a2be2',
    "ColorMap--butterfly-icon": '#8a2be2',
    "ColorMap--background": '#200d46',
    "ColorMap--content-warnings": '#322d3c',
    "ColorMap--content-warnings-hover": '#4b435b',
    "ColorMap--text-primary": '#fff',
    "ColorMap--text-secondary": '#7f7f7f',
    "ColorMap--border-color": 'rgb(46, 64, 82)'
  }, reset);
}
const purpleDark = document.getElementById("PurpleDark");
if (purpleDark) {
  purpleDark.addEventListener("click", PurpleDark);
}
function PurpleDark() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#7636c5',
    "ColorMap--accent-color-hover": '#8b2be2',
    "ColorMap--butterfly-icon": '#8a2be2',
    "ColorMap--background": '#0e000e',
    "ColorMap--content-warnings": '#3c1157',
    "ColorMap--content-warnings-hover": '#3c2c57',
    "ColorMap--text-primary": '#fff',
    "ColorMap--text-secondary": '#8f9eb7',
    "ColorMap--border-color": '#ffffff'
  }, reset);
}
// #endregion
// #endregions