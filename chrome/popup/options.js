const elements = {
  sliders: {
    red: document.getElementById("red"),
    blue: document.getElementById("blue"),
    green: document.getElementById("green"),
    hue: document.getElementById("hue"),
    saturation: document.getElementById("saturation"),
    lightness: document.getElementById("lightness")
  },
  values: {
    redVal: document.getElementById("redValue"),
    blueVal: document.getElementById("blueValue"),
    greenVal: document.getElementById("greenValue"),
    hueVal: document.getElementById("hueValue"),
    saturationVal: document.getElementById("saturationValue"),
    lightnessVal: document.getElementById("lightnessValue")
  },
  hex: document.getElementById("hex"),
  swatch: document.getElementById("colorSwatch"),
  colorId: document.getElementById("colorId"),
  colorLabel: document.getElementById("colorLabel"),
  buttons: document.querySelectorAll('.table button')
};

// Event Listeners on input sliders
Object.values(elements.sliders).forEach(slider => slider.addEventListener("input", updateColor));
elements.hex.addEventListener("input", updateColor);

// Event Listeners on color group button click
elements.buttons.forEach(button => {
  button.addEventListener('click', () => {
    const svgElement = button.querySelector('svg');
    if (svgElement) {
      elements.colorId.innerHTML = svgElement.id;
      setColor(svgElement.id);
    }
  });
});

// Initializations of color values
async function init() {
  const options = Array.from(document.querySelectorAll("div svg")).map(x => x.id);
  for (let option of options) {
    document.getElementById(option).style.fill = await getStorageValue(option) ?? "rgb(0,0,0)";
  }
  setColor(elements.colorId.innerHTML);
}

// Wrapper for getting values from extention storage
function getStorageValue(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

// Update input values
function updateColor() {
  const activeTab = document.querySelector("#colorTab .nav-item .active")?.id.split("-")[0];
  let color = "";

  switch (activeTab) {
    case "rgb":
      color = `rgb(${elements.sliders.red.value}, ${elements.sliders.green.value}, ${elements.sliders.blue.value})`;
      updateRgbVal();
      break;
    case "hsl":
      const hslRgb = convertToRgb(`hsl(${elements.sliders.hue.value}, ${elements.sliders.saturation.value}%, ${elements.sliders.lightness.value}%)`);
      color = `rgb(${hslRgb.r}, ${hslRgb.g}, ${hslRgb.b})`;
      updateHslVal();
      break;
    case "hex":
      const hexRgb = hexToRgb(elements.hex.value);
      color = `rgb(${hexRgb.r}, ${hexRgb.g}, ${hexRgb.b})`;
      break;
  }

  document.getElementById(elements.colorId.innerHTML).style.fill = color;
  elements.swatch.style.backgroundColor = color;
  chrome.storage.local.set({ [elements.colorId.innerHTML]: color });
  chrome.runtime.sendMessage({ type: 'applyTheme' });
}

// Change input values and color
async function setColor(id) {
  id = id ?? elements.colorId.innerHTML;
  let color = await getStorageValue(id) || "rgb(0,0,0)";
  const colorRgb = convertToRgb(color) || { r: '0', g: '0', b: '0' };

  elements.colorLabel.innerHTML = `Picked: ${id.replace('ColorMap--', ' ').replaceAll('-', ' ')}`;
  elements.swatch.style.backgroundColor = `rgb(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b})`;

  elements.sliders.red.value = colorRgb.r;
  elements.sliders.green.value = colorRgb.g;
  elements.sliders.blue.value = colorRgb.b;
  updateRgbVal();

  const hslColor = rgbToHsl(colorRgb.r, colorRgb.g, colorRgb.b);
  elements.sliders.hue.value = hslColor.h;
  elements.sliders.saturation.value = hslColor.s;
  elements.sliders.lightness.value = hslColor.l;
  updateHslVal();

  elements.hex.value = rgbToHex(colorRgb.r, colorRgb.g, colorRgb.b);
}

// Resets option menu
async function reset() {
  const options = Array.from(document.querySelectorAll("div svg")).map(x => x.id);
  for (let option of options) {
    elements.colorId.innerHTML = option;
    await setColor(option);
    await updateColor();
    await init();
  }
}

// Update rgb input values
function updateRgbVal() {
  elements.values.redVal.innerHTML = elements.sliders.red.value;
  elements.values.greenVal.innerHTML = elements.sliders.green.value;
  elements.values.blueVal.innerHTML = elements.sliders.blue.value;
}

// Update hsl input values
function updateHslVal() {
  elements.values.hueVal.innerHTML = elements.sliders.hue.value;
  elements.values.saturationVal.innerHTML = elements.sliders.saturation.value;
  elements.values.lightnessVal.innerHTML = elements.sliders.lightness.value;
}

document.addEventListener("DOMContentLoaded", init);

// #region Colors

// Convert Hex to RGB
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
const defaultLight = document.getElementById("DefaultLight");
defaultLight.addEventListener("click", DefaultLight)
function DefaultLight() {
  chrome.storage.local.set({
    "ColorMap--accent-color": 'rgb(16, 131, 254)',
    "ColorMap--accent-color-hover": 'rgb(1, 104, 213)',
    "ColorMap--butterfly-icon": 'rgb(16, 131, 254)',
    "ColorMap--background": 'rgb(255, 255, 255)',
    "ColorMap--content-warnings": 'rgb(241, 243, 245)',
    "ColorMap--content-warnings-hover": 'rgb(226, 231, 236)',
    "ColorMap--text-primary": 'rgb(11, 15, 20)',
    "ColorMap--text-secondary": 'rgb(66, 87, 108)',
    "ColorMap--border-color": 'rgb(212, 219, 226)',
    "ColorMap--main-button-text": 'rgb(11, 15, 20)',
  }, reset);
}

const defaultDim = document.getElementById("DefaultDim");
defaultDim.addEventListener("click", DefaultDim)
function DefaultDim() {
  chrome.storage.local.set({
    "ColorMap--accent-color": 'rgb(32, 139, 254)',
    "ColorMap--accent-color-hover": 'rgb(76, 162, 254)',
    "ColorMap--butterfly-icon": 'rgb(32, 139, 254)',
    "ColorMap--background": 'rgb(22, 30, 39)',
    "ColorMap--content-warnings": 'rgb(30, 41, 54)',
    "ColorMap--content-warnings-hover": 'rgb(30, 41, 54)',
    "ColorMap--text-primary": 'rgb(241, 243, 245)',
    "ColorMap--text-secondary": 'rgb(174, 187, 201)',
    "ColorMap--border-color": 'rgb(46, 64, 82)',
    "ColorMap--main-button-text": 'rgb(241, 243, 245)',
  }, reset);
}

const defaultDark = document.getElementById("DefaultDark");
defaultDark.addEventListener("click", DefaultDark)
function DefaultDark() {
  chrome.storage.local.set({
    "ColorMap--accent-color": 'rgb(16, 131, 254)',
    "ColorMap--accent-color-hover": 'rgb(52, 150, 254)',
    "ColorMap--butterfly-icon": 'rgb(16, 131, 254)',
    "ColorMap--background": 'rgb(0, 0, 0)',
    "ColorMap--content-warnings": 'rgb(20, 27, 35)',
    "ColorMap--content-warnings-hover": 'rgb(28, 39, 50)',
    "ColorMap--text-primary": 'rgb(241, 243, 245)',
    "ColorMap--text-secondary": 'rgb(140, 158, 178)',
    "ColorMap--border-color": 'rgb(37, 51, 66)',
    "ColorMap--main-button-text": 'rgb(241, 243, 245)'
  }, reset);
}

const pinkLight = document.getElementById("PinkLight");
pinkLight.addEventListener("click", PinkLight)
async function PinkLight() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#ff008e',
    "ColorMap--accent-color-hover": '#ef006a',
    "ColorMap--butterfly-icon": '#fd0093',
    "ColorMap--background": '#ffffff',
    "ColorMap--content-warnings": '#fbf7f8',
    "ColorMap--content-warnings-hover": '#eee3e9',
    "ColorMap--text-primary": '#0f0609',
    "ColorMap--text-secondary": '#733c59',
    "ColorMap--border-color": '#e6d5dd',
    "ColorMap--main-button-text": '#11060a'
  }, reset);
}

const pinkDim = document.getElementById("PinkDim");
pinkDim.addEventListener("click", PinkDim)
async function PinkDim() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#f60494',
    "ColorMap--accent-color-hover": '#ff42a6',
    "ColorMap--butterfly-icon": '#ff0090',
    "ColorMap--background": '#27121b',
    "ColorMap--content-warnings": '#39162a',
    "ColorMap--content-warnings-hover": '#381929',
    "ColorMap--text-primary": '#f8f4f5',
    "ColorMap--text-secondary": '#d1b2c2',
    "ColorMap--border-color": '562a41',
    "ColorMap--main-button-text": '#f6f4f5'
  }, reset);
}

const pinkDark = document.getElementById("PinkDark");
pinkDark.addEventListener("click", PinkDark)
async function PinkDark() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#ff008a',
    "ColorMap--accent-color-hover": '#ff169d',
    "ColorMap--butterfly-icon": '#ff0188',
    "ColorMap--background": '#000000',
    "ColorMap--content-warnings": '#231016',
    "ColorMap--content-warnings-hover": '#2f1822',
    "ColorMap--text-primary": '#f7f1f3',
    "ColorMap--text-secondary": '#bb8a9d',
    "ColorMap--border-color": '#461f32',
    "ColorMap--main-button-text": '#f5f3f4'
  }, reset);
}

const purpleLight = document.getElementById("PurpleLight");
purpleLight.addEventListener("click", PurpleLight)
async function PurpleLight() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#a375e4',
    "ColorMap--accent-color-hover": '#8a2be2',
    "ColorMap--butterfly-icon": '#8a2be2',
    "ColorMap--background": '#ffffff',
    "ColorMap--content-warnings": '#dfcfff',
    "ColorMap--content-warnings-hover": '#baa3e7',
    "ColorMap--text-primary": '#000000',
    "ColorMap--text-secondary": '#535353',
    "ColorMap--border-color": '#000000',
    "ColorMap--main-button-text": '#000000'
  }, reset);
}

const purpleDim = document.getElementById("PurpleDim");
purpleDim.addEventListener("click", PurpleDim)
async function PurpleDim() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#bb98ff',
    "ColorMap--accent-color-hover": '#8a2be2',
    "ColorMap--butterfly-icon": '#8a2be2',
    "ColorMap--background": '#200d46',
    "ColorMap--content-warnings": '#322d3c',
    "ColorMap--content-warnings-hover": '#4b435b',
    "ColorMap--text-primary": '#fff',
    "ColorMap--text-secondary": '#7f7f7f',
    "ColorMap--border-color": 'rgb(46, 64, 82)',
    "ColorMap--main-button-text": '#fff'
  }, reset);
}

const purpleDark = document.getElementById("PurpleDark");
purpleDark.addEventListener("click", PurpleDark)
async function PurpleDark() {
  chrome.storage.local.set({
    "ColorMap--accent-color": '#7636c5',
    "ColorMap--accent-color-hover": '#8b2be2',
    "ColorMap--butterfly-icon": '#8a2be2',
    "ColorMap--background": '#0e000e',
    "ColorMap--content-warnings": '#3c1157',
    "ColorMap--content-warnings-hover": '#3c2c57',
    "ColorMap--text-primary": '#fff',
    "ColorMap--text-secondary": '#8f9eb7',
    "ColorMap--border-color": '#ffffff',
    "ColorMap--main-button-text": '#fff'
  }, reset);
}
// #endregion
// #endregion