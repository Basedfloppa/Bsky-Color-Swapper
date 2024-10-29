let red = document.getElementById("red");
let blue = document.getElementById("blue");
let green = document.getElementById("green");

let swatch = document.getElementById("colorSwatch");

let colorName = document.getElementById("colorName");

colorName.addEventListener("input", setColor);

red.addEventListener("input", updateColor);
green.addEventListener("input", updateColor);
blue.addEventListener("input", updateColor);

async function init() {
  for (let i = 0; i < colorName.options.length; i++) {
    const option = colorName.options[i];
    if (option) {
      const color = await getStorageValue(option.value) ?? "rgb(0,0,0)";
      document.getElementById(option.value).style["background-color"] = color;
    }
  }
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
  let color = "rgb(" + red.value + "," + green.value + "," + blue.value + ")";
  swatch.style["background-color"] = color;
  document.getElementById(colorName.value).style["background-color"] = color;

  document.getElementById("redValue").innerHTML = red.value;
  document.getElementById("greenValue").innerHTML = green.value;
  document.getElementById("blueValue").innerHTML = blue.value;

  let variable = { Name: colorName.value, Value: color };
  chrome.storage.local.set({ [variable.Name]: variable.Value });

  chrome.runtime.sendMessage({ type: 'applyTheme' });
}
async function setColor() {
  const color = await getStorageValue(colorName.value);
  const colors = convertToRgb(color) ?? { 'r':0,'g':0,'b':0};

  document.getElementById("log").innerHTML = JSON.stringify(colors);

  red.value = colors['r'];
  green.value = colors['g'];
  blue.value = colors['b'];

  swatch.style["background-color"] = color;

  document.getElementById("redValue").innerHTML = red.value;
  document.getElementById("greenValue").innerHTML = green.value;
  document.getElementById("blueValue").innerHTML = blue.value;
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}
function parseRgbString(rgbString) {
  const match = rgbString.match(/\d+/g);
  if (!match) return null;
  return match.map(Number);
}
function convertToRgb(color) {
  try {
    if (String(color).startsWith('hsl')) {
      const match = color.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
      if (!match) throw new Error("Invalid HSL format");
      return hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
    } else if (String(color).startsWith('#')) {
      return hexToRgb(color);
    } else if (String(color).startsWith('rgb')) {
      return parseRgbString(color);
    }
    throw new Error("Unsupported color format");
  } catch (error) {
    console.error("Failed to convert color:", error);
    return [0, 0, 0]; // Default color
  }
}

document.addEventListener("DOMContentLoaded", init);