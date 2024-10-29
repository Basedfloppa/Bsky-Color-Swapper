let red = document.getElementById("red");
let blue = document.getElementById("blue");
let green = document.getElementById("green");

let swatch = document.getElementById("colorSwatch");

let colorName = document.getElementById("colorName");

colorName.addEventListener("input", setColor);

red.addEventListener("input", updateColor);
green.addEventListener("input", updateColor);
blue.addEventListener("input", updateColor);

function init() {
  for (let i = 0; i <= colorName.options.length; i++) {
    if (!colorName.options[i])
      continue;
    document.getElementById(colorName.options[i].value).style["background-color"] = localStorage.getItem(colorName.options[i].value) ?? "rgb(0,0,0)";
  }
  setColor();
}
function updateColor() {
  let color = "rgb(" + red.value + "," + green.value + "," + blue.value + ")";
  swatch.style["background-color"] = color;
  document.getElementById(colorName.value).style["background-color"] = color;

  document.getElementById("redValue").innerHTML = red.value;
  document.getElementById("greenValue").innerHTML = green.value;
  document.getElementById("blueValue").innerHTML = blue.value;

  localStorage.setItem(colorName.value, color);

  window.browser.runtime.sendMessage({ type: 'applyTheme' });
}
function setColor() {
  let colors = convertToRgb(localStorage.getItem(colorName.value) ?? "rgb(0,0,0)");

  document.getElementById("red").value = colors[0];
  document.getElementById("green").value = colors[1];
  document.getElementById("blue").value = colors[2];

  swatch.style["background-color"] = localStorage.getItem(colorName.value);

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
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const bigint = parseInt(hex, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
}
function parseRgbString(rgbString) {
  const match = rgbString.match(/\d+/g);
  if (!match) return null;
  return match.map(Number);
}
function convertToRgb(color) {
  if (color.startsWith('hsl')) {
    const match = color.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
    if (!match) return null;
    return hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
  } else if (color.startsWith('#')) {
    return hexToRgb(color);
  } else if (color.startsWith('rgb')) {
    return parseRgbString(color);
  }
  return null;
}

init();