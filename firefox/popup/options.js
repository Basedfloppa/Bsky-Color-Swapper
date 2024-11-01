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
    elements.colorId.innerHTML = svgElement.id;
    if (svgElement) setColor(svgElement.id);
  });
});

// Initializations of color values
function init() {
  // Get options from id values of svg nodes
  const options = Array.from(document.querySelectorAll("div svg")).map(x => x.id);

  options.forEach(id => {
    if (id) document.getElementById(id).style.fill = localStorage.getItem(id) ?? "rgb(0,0,0)";
  });

  setColor(elements.colorId.innerHTML);
}

//Update input values
function updateColor() {
  //Get input tab
  const activeTab = document.querySelector("#colorTab .nav-item .active")?.id.split("-")[0];
  let color = "";

  //Depending on tab value change color values
  switch (activeTab) {
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

  document.getElementById(elements.colorId.innerHTML).style["fill"] = color;
  elements.swatch.style["background-color"] = color;
  localStorage.setItem(elements.colorId.innerHTML, color);

  window.browser.runtime.sendMessage({ type: 'applyTheme' });
}

//Change input values and color
function setColor(id) {
  id = id ?? elements.colorId.innerHTML
  let color = localStorage.getItem(id) ?? "rgb(0,0,0)";
  color = convertToRgb(color) ?? { 'r': '0', 'g': '0', 'b': '0' };

  elements.colorLabel.innerHTML = "Picked: " + id.replace('ColorMap--', ' ').replaceAll('-', ' ');

  elements.swatch.style["background-color"] = "rgb(" + color['r'] + "," + color['g'] + "," + color['b'] + ")";

  elements.sliders.red.value = color['r'];
  elements.sliders.green.value = color['g'];
  elements.sliders.blue.value = color['b'];
  updateRgbVal();

  let hslColor = rgbToHsl(color['r'], color['g'], color['b']);
  elements.sliders.hue.value = hslColor['h'];
  elements.sliders.saturation.value = hslColor['s'];
  elements.sliders.lightness.value = hslColor['l'];
  updateHslVal();

  elements.hex.value = rgbToHex(color['r'], color['g'], color['b']);
}

function reset() {
  let options = Array.from(document.querySelectorAll("div svg")).map(x => x.id);

  for (let option of options) {
    elements.colorId.innerHTML = option;

    setColor();
    updateColor();
    init();
  }
}

function updateRgbVal() {
  elements.values.redVal.innerHTML = red.value;
  elements.values.greenVal.innerHTML = green.value;
  elements.values.blueVal.innerHTML = blue.value;
}

function updateHslVal() {
  elements.values.hueVal.innerHTML = hue.value;
  elements.values.saturationVal.innerHTML = saturation.value;
  elements.values.lightnessVal.innerHTML = lightness.value;
}

init();

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
purpleLight.addEventListener("click", PurpleLight)
function PurpleLight() {
  localStorage.setItem("ColorMap--accent-color", '#a375e4');
  localStorage.setItem("ColorMap--accent-color-hover", '#8a2be2');
  localStorage.setItem("ColorMap--butterfly-icon", '#8a2be2');
  localStorage.setItem("ColorMap--background", '#ffffff');
  localStorage.setItem("ColorMap--content-warnings", '#dfcfff');
  localStorage.setItem("ColorMap--content-warnings-hover", '#baa3e7');
  localStorage.setItem("ColorMap--text-primary", '#000000');
  localStorage.setItem("ColorMap--text-secondary", '#535353');
  localStorage.setItem("ColorMap--border-color", '#000000');
  localStorage.setItem("ColorMap--main-button-text", '#000000');
  reset();
}

const purpleDim = document.getElementById("PurpleDim");
purpleDim.addEventListener("click", PurpleDim)
function PurpleDim() {
  localStorage.setItem("ColorMap--accent-color", '#bb98ff');
  localStorage.setItem("ColorMap--accent-color-hover", '#8a2be2');
  localStorage.setItem("ColorMap--butterfly-icon", '#8a2be2');
  localStorage.setItem("ColorMap--background", '#200d46');
  localStorage.setItem("ColorMap--content-warnings", '#322d3c');
  localStorage.setItem("ColorMap--content-warnings-hover", '#4b435b');
  localStorage.setItem("ColorMap--text-primary", '#fff');
  localStorage.setItem("ColorMap--text-secondary", '#7f7f7f');
  localStorage.setItem("ColorMap--border-color", 'rgb(46, 64, 82)');
  localStorage.setItem("ColorMap--main-button-text", '#fff');
  reset();
}

const purpleDark = document.getElementById("PurpleDark");
purpleDark.addEventListener("click", PurpleDark)
function PurpleDark() {
  localStorage.setItem("ColorMap--accent-color", '#7636c5');
  localStorage.setItem("ColorMap--accent-color-hover", '#8b2be2');
  localStorage.setItem("ColorMap--butterfly-icon", '#8a2be2');
  localStorage.setItem("ColorMap--background", '#0e000e');
  localStorage.setItem("ColorMap--content-warnings", '#3c1157');
  localStorage.setItem("ColorMap--content-warnings-hover", '#3c2c57');
  localStorage.setItem("ColorMap--text-primary", '#fff');
  localStorage.setItem("ColorMap--text-secondary", '#8f9eb7');
  localStorage.setItem("ColorMap--border-color", '#ffffff');
  localStorage.setItem("ColorMap--main-button-text", '#fff');
  reset();
}
// #endregion
// #endregion