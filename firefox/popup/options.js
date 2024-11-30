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
  buttons: document.querySelectorAll('.table button'),
  exportButton: document.getElementById("export-button"),
  exportText: document.getElementById("export-text-area"),
  importButton: document.getElementById("import-button"),
  importText: document.getElementById("import-text-area")
};

// Event Listeners on input sliders
Object.values(elements.sliders).forEach(slider => slider.addEventListener("input", updateColor));
elements.hex.addEventListener("input", updateColor);

// Event listeners on Import/Export
elements.exportButton.addEventListener("click", exportTheme);
elements.importButton.addEventListener("click", importTheme);

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
  await setColor(elements.colorId.innerHTML);
}

// Export current theme
async function exportTheme() {
  let result = [];

  for (const button of elements.buttons) {
    const svgElement = button.querySelector('svg').getAttribute("id");
    let color = await getStorageValue(svgElement);
    result = result.concat(svgElement + ":" + color);
  }

  elements.exportText.value = result.join(';');
}

// Import theme
async function importTheme() {
  let colors = elements.importText.value.split(';');

  for (const color of colors) {
    await browser.storage.local.set({ [color.split(":")[0]]: color.split(":")[1] });
  }

  reset();
}

// Wrapper for getting values from extention storage
function getStorageValue(key) {
  return new Promise((resolve) => {
    browser.storage.local.get([key], (result) => {
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

  calcInactive();

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
    calcInactive();
    await setColor(option);
    await updateColor();
    await init();
  }
}

// Update rgb input values
function updateRgbVal() {
  elements.values.redVal.innerHTML = red.value;
  elements.values.greenVal.innerHTML = green.value;
  elements.values.blueVal.innerHTML = blue.value;
}

// Update hsl input values
function updateHslVal() {
  elements.values.hueVal.innerHTML = hue.value;
  elements.values.saturationVal.innerHTML = saturation.value;
  elements.values.lightnessVal.innerHTML = lightness.value;
}

//Calculate accent-color-inactive and accent-color-inactive-text
function calcInactive() {
  elements.buttons.forEach(button => {
    if (button.name == "ColorMap--accent-color") {
      let svgColor = button.querySelector('svg').style.fill;
      var color = convertToRgb(svgColor);
      color = rgbToHsl(color.r, color.g, color.b)
      color.s = color.s / 2;
      color = "hsl(" + color.h + "," + color.s + "%," + color.l + "%)";
      browser.storage.local.set({ 'ColorMap--accent-color-inactive': color });
    }
    else if (button.name == "ColorMap--text-primary") {
      let svgColor = button.querySelector('svg').style.fill;
      var color = convertToRgb(svgColor);
      color = rgbToHsl(color.r, color.g, color.b)
      color.s = color.s / 2;
      color = "hsl(" + color.h + "," + color.s + "%," + color.l + "%)";
      browser.storage.local.set({ 'ColorMap--accent-color-inactive-text': color });
    }
  });
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
  browser.storage.local.set({
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
  browser.storage.local.set({
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
  browser.storage.local.set({
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
  browser.storage.local.set({
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
  browser.storage.local.set({
    "ColorMap--accent-color": '#f60494',
    "ColorMap--accent-color-hover": '#ff42a6',
    "ColorMap--butterfly-icon": '#ff0090',
    "ColorMap--background": '#27121b',
    "ColorMap--content-warnings": '#39162a',
    "ColorMap--content-warnings-hover": '#381929',
    "ColorMap--text-primary": '#f8f4f5',
    "ColorMap--text-secondary": '#d1b2c2',
    "ColorMap--border-color": '#562a41',
    "ColorMap--main-button-text": '#f6f4f5'
  }, reset);
}

const pinkDark = document.getElementById("PinkDark");
pinkDark.addEventListener("click", PinkDark)
async function PinkDark() {
  browser.storage.local.set({
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

const fuchsiaLight = document.getElementById("FuchsiaLight");
fuchsiaLight.addEventListener("click", FuchsiaLight)
async function FuchsiaLight() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#f900f4',
    "ColorMap--accent-color-hover": '#cf01c6',
    "ColorMap--butterfly-icon": '#f901f5',
    "ColorMap--background": '#ffffff',
    "ColorMap--content-warnings": '#f5f5f7',
    "ColorMap--content-warnings-hover": '#eee4ed',
    "ColorMap--text-primary": '#0e070f',
    "ColorMap--text-secondary": '#694068',
    "ColorMap--border-color": '#e4d6e3',
    "ColorMap--main-button-text": '#10060f'
  }, reset);
}

const fuchsiaDim = document.getElementById("FuchsiaDim");
fuchsiaDim.addEventListener("click", FuchsiaDim)
async function FuchsiaDim() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#fa01f3',
    "ColorMap--accent-color-hover": '#ff45f4',
    "ColorMap--butterfly-icon": '#f900f2',
    "ColorMap--background": '#231222',
    "ColorMap--content-warnings": '#321a32',
    "ColorMap--content-warnings-hover": '#321a34',
    "ColorMap--text-primary": '#f7f5f8',
    "ColorMap--text-secondary": '#cbb1cc',
    "ColorMap--border-color": '#4f2c4d',
    "ColorMap--main-button-text": '#f6f4f7'
  }, reset);
}

const fuchsiaDark = document.getElementById("FuchsiaDark");
fuchsiaDark.addEventListener("click", FuchsiaDark)
async function FuchsiaDark() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#f900f4',
    "ColorMap--accent-color-hover": '#fb1ff1',
    "ColorMap--butterfly-icon": '#f800f7',
    "ColorMap--background": '#000000',
    "ColorMap--content-warnings": '#1e101d',
    "ColorMap--content-warnings-hover": '#2f1a2d',
    "ColorMap--text-primary": '#f4f4f6',
    "ColorMap--text-secondary": '#b689b2',
    "ColorMap--border-color": '#401d3d',
    "ColorMap--main-button-text": '#f5f3f6'
  }, reset);
}

const purpleLight = document.getElementById("PurpleLight");
purpleLight.addEventListener("click", PurpleLight)
async function PurpleLight() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#c100fe',
    "ColorMap--accent-color-hover": '#a003ea',
    "ColorMap--butterfly-icon": '#bf00fe',
    "ColorMap--background": '#ffffff',
    "ColorMap--content-warnings": '#f6f6f8',
    "ColorMap--content-warnings-hover": '#eae2ed',
    "ColorMap--text-primary": '#0e070f',
    "ColorMap--text-secondary": '#604373',
    "ColorMap--border-color": '#e2d7e7',
    "ColorMap--main-button-text": '#0e070f'
  }, reset);
}

const purpleDim = document.getElementById("PurpleDim");
purpleDim.addEventListener("click", PurpleDim)
async function PurpleDim() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#c920ff',
    "ColorMap--accent-color-hover": '#d45bf8',
    "ColorMap--butterfly-icon": '#ca21ff',
    "ColorMap--background": '#211428',
    "ColorMap--content-warnings": '#291936',
    "ColorMap--content-warnings-hover": '#2b1b36',
    "ColorMap--text-primary": '#f6f6f8',
    "ColorMap--text-secondary": '#c7b3cf',
    "ColorMap--border-color": '#452f55',
    "ColorMap--main-button-text": '#f6f6f8'
  }, reset);
}

const purpleDark = document.getElementById("PurpleDark");
purpleDark.addEventListener("click", PurpleDark)
async function PurpleDark() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#c401fd',
    "ColorMap--accent-color-hover": '#d23cff',
    "ColorMap--butterfly-icon": '#bf00fe',
    "ColorMap--background": '#000000',
    "ColorMap--content-warnings": '#1c1121',
    "ColorMap--content-warnings-hover": '#281930',
    "ColorMap--text-primary": '#f5f5f7',
    "ColorMap--text-secondary": '#a98cba',
    "ColorMap--border-color": '#3b2343',
    "ColorMap--main-button-text": '#f4f4f6'
  }, reset);
}

const coldGreenLight = document.getElementById("ColdGreenLight");
coldGreenLight.addEventListener("click", ColdGreenLight)
async function ColdGreenLight() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#02bc71',
    "ColorMap--accent-color-hover": '#009764',
    "ColorMap--butterfly-icon": '#00bb6f',
    "ColorMap--background": '#ffffff',
    "ColorMap--content-warnings": '#f3f7f6',
    "ColorMap--content-warnings-hover": '#e0ece8',
    "ColorMap--text-primary": '#000c0a',
    "ColorMap--text-secondary": '#265e51',
    "ColorMap--border-color": '#d2dedc',
    "ColorMap--main-button-text": '#000c0a'
  }, reset);
}

const coldGreenDim = document.getElementById("ColdGreenDim");
coldGreenDim.addEventListener("click", ColdGreenDim)
async function ColdGreenDim() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#01be84',
    "ColorMap--accent-color-hover": '#01caa0',
    "ColorMap--butterfly-icon": '#02bf7f',
    "ColorMap--background": '#081e1b',
    "ColorMap--content-warnings": '#022b23',
    "ColorMap--content-warnings-hover": '#012c23',
    "ColorMap--text-primary": '#f4f8f7',
    "ColorMap--text-secondary": '#a3c2bd',
    "ColorMap--border-color": '#11463c',
    "ColorMap--main-button-text": '#f3f7f6'
  }, reset);
}

const coldGreenDark = document.getElementById("ColdGreenDark");
coldGreenDark.addEventListener("click", ColdGreenDark)
async function ColdGreenDark() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#00ba71',
    "ColorMap--accent-color-hover": '#08c195',
    "ColorMap--butterfly-icon": '#00ba6f',
    "ColorMap--background": '#000000',
    "ColorMap--content-warnings": '#061616',
    "ColorMap--content-warnings-hover": '#062923',
    "ColorMap--text-primary": '#f1f3f2',
    "ColorMap--text-secondary": '#75a79e',
    "ColorMap--border-color": '#0d3630',
    "ColorMap--main-button-text": '#f1f3f2'
  }, reset);
}

const greenLight = document.getElementById("GreenLight");
greenLight.addEventListener("click", GreenLight)
async function GreenLight() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#00a201',
    "ColorMap--accent-color-hover": '#008601',
    "ColorMap--butterfly-icon": '#090c01',
    "ColorMap--background": '#fff',
    "ColorMap--content-warnings": '#e7eae1',
    "ColorMap--content-warnings-hover": '#e7eae1',
    "ColorMap--text-primary": '#090c01',
    "ColorMap--text-secondary": '#475b28',
    "ColorMap--border-color": '#dbddd0',
    "ColorMap--main-button-text": '#090c01'
  }, reset);
}

const greenDim = document.getElementById("GreenDim");
greenDim.addEventListener("click", GreenDim)
async function GreenDim() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#2ea20d',
    "ColorMap--accent-color-hover": '#5fbf00',
    "ColorMap--butterfly-icon": '#2caa00',
    "ColorMap--background": '#161e09',
    "ColorMap--content-warnings": '#1f280b',
    "ColorMap--content-warnings-hover": '#1f280d',
    "ColorMap--text-primary": '#f4f6f3',
    "ColorMap--text-secondary": '#b7c0a5',
    "ColorMap--border-color": '#324116',
    "ColorMap--main-button-text": '#f4f6f3'
  }, reset);
}

const greenDark = document.getElementById("GreenDark");
greenDark.addEventListener("click", GreenDark)
async function GreenDark() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#01a100',
    "ColorMap--accent-color-hover": '#47b401',
    "ColorMap--butterfly-icon": '#01a602',
    "ColorMap--background": '#030000',
    "ColorMap--content-warnings": '#111709',
    "ColorMap--content-warnings-hover": '#1b250d',
    "ColorMap--text-primary": '#f3f5f2',
    "ColorMap--text-secondary": '#90a376',
    "ColorMap--border-color": '#263410',
    "ColorMap--main-button-text": '#f1f6f2'
  }, reset);
}

const khakiLight = document.getElementById("KhakiLight");
khakiLight.addEventListener("click", KhakiLight)
async function KhakiLight() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#898001',
    "ColorMap--accent-color-hover": '#696700',
    "ColorMap--butterfly-icon": '#897e00',
    "ColorMap--background": '#fff',
    "ColorMap--content-warnings": '#f5f5f3',
    "ColorMap--content-warnings-hover": '#e9e4de',
    "ColorMap--text-primary": '#0a0a02',
    "ColorMap--text-secondary": '#575429',
    "ColorMap--border-color": '#dbdcce',
    "ColorMap--main-button-text": '#0b0b03'
  }, reset);
}

const khakiDim = document.getElementById("KhakiDim");
khakiDim.addEventListener("click", KhakiDim)
async function KhakiDim() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#918900',
    "ColorMap--accent-color-hover": '#a5a301',
    "ColorMap--butterfly-icon": '#908a00',
    "ColorMap--background": '#1c1b07',
    "ColorMap--content-warnings": '#27250e',
    "ColorMap--content-warnings-hover": '#29250a',
    "ColorMap--text-primary": '#f6f6f4',
    "ColorMap--text-secondary": '#bfbea2',
    "ColorMap--border-color": '#3e3c16',
    "ColorMap--main-button-text": '#f6f6f4'
  }, reset);
}

const khakiDark = document.getElementById("KhakiDark");
khakiDark.addEventListener("click", KhakiDark)
async function KhakiDark() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#8c7e01',
    "ColorMap--accent-color-hover": '#9c9600',
    "ColorMap--butterfly-icon": '#877d01',
    "ColorMap--background": '#000000',
    "ColorMap--content-warnings": '#171806',
    "ColorMap--content-warnings-hover": '#24220d',
    "ColorMap--text-primary": '#f4f4f2',
    "ColorMap--text-secondary": '#9c9d75',
    "ColorMap--border-color": '#323113',
    "ColorMap--main-button-text": '#f5f5f3'
  }, reset);
}

const taroccoLight = document.getElementById("TaroccoLight");
taroccoLight.addEventListener("click", TaroccoLight)
async function TaroccoLight() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#e64300',
    "ColorMap--accent-color-hover": '#b93706',
    "ColorMap--butterfly-icon": '#e74200',
    "ColorMap--background": '#ffffff',
    "ColorMap--content-warnings": '#f4f4f2',
    "ColorMap--content-warnings-hover": '#b93706',
    "ColorMap--text-primary": '#0e0906',
    "ColorMap--text-secondary": '#664a34',
    "ColorMap--border-color": '#e3dad1',
    "ColorMap--main-button-text": '#0e0906'
  }, reset);
}

const taroccoDim = document.getElementById("TaroccoDim");
taroccoDim.addEventListener("click", TaroccoDim)
async function TaroccoDim() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#e75700',
    "ColorMap--accent-color-hover": '#eb7e00',
    "ColorMap--butterfly-icon": '#e65700',
    "ColorMap--background": '#21170d',
    "ColorMap--content-warnings": '#311f11',
    "ColorMap--content-warnings-hover": '#2f1f12',
    "ColorMap--text-primary": '#f5f4f2',
    "ColorMap--text-secondary": '#c9b7a9',
    "ColorMap--border-color": '#4d351d',
    "ColorMap--main-button-text": '#f7f3f2'
  }, reset);
}

const taroccoDark = document.getElementById("TaroccoDark");
taroccoDark.addEventListener("click", TaroccoDark)
async function TaroccoDark() {
  browser.storage.local.set({
    "ColorMap--accent-color": '#e74200',
    "ColorMap--accent-color-hover": '#e76c02',
    "ColorMap--butterfly-icon": '#e64300',
    "ColorMap--background": '#000000',
    "ColorMap--content-warnings": '#1c150b',
    "ColorMap--content-warnings-hover": '#2d1f16',
    "ColorMap--text-primary": '#f4f3f1',
    "ColorMap--text-secondary": '#ad957d',
    "ColorMap--border-color": '#3c291a',
    "ColorMap--main-button-text": '#f6f5f3'
  }, reset);
}

// #endregion
// #endregion