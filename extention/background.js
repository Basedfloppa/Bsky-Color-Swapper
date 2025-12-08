try {
  var browserApi = browser;
} catch {
  var browserApi = chrome;
}

const COLOR_KEYS = [
  "ColorMap--accent-color",
  "ColorMap--accent-color-hover",
  "ColorMap--butterfly-icon",
  "ColorMap--background",
  "ColorMap--content-warnings",
  "ColorMap--content-warnings-hover",
  "ColorMap--text-primary",
  "ColorMap--text-secondary",
  "ColorMap--border-color",
  "ColorMap--main-button-text",
];

//#region Helpers

function getStorageValue(key) {
  return new Promise((resolve) => {
    browserApi.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

function setStorageValue(obj) {
  return new Promise((resolve) => {
    browserApi.storage.local.set(obj, () => resolve());
  });
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

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

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

function parseRgbString(rgbString) {
  const match = rgbString && rgbString.match(/\d+/g);
  if (!match) return null;
  return {
    r: parseInt(match[0]),
    g: parseInt(match[1]),
    b: parseInt(match[2]),
  };
}

function parseHslString(hslString) {
  const match =
    hslString &&
    hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return null;
  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3]),
  };
}

function convertToRgb(color) {
  if (!color || typeof color !== "string") return null;

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

//#endregion

//#region Rainbow theme

async function advanceRainbow() {
  const rainbow = await getStorageValue("rainbow");
  if (rainbow !== true) {
    const timerId = await getStorageValue("rainbowTimerId");
    if (timerId) {
      clearInterval(timerId);
    }
    return;
  }

  for (const key of COLOR_KEYS) {
    let color = (await getStorageValue(key)) || "hsl(0, 0%, 0%)";
    let hsl;

    if (typeof color === "string" && color.startsWith("hsl")) {
      hsl = parseHslString(color) || { h: 0, s: 0, l: 0 };
    } else {
      const rgb = convertToRgb(color) || { r: 0, g: 0, b: 0 };
      hsl = rgbToHsl(rgb.r, rgb.g, rgb.b) || { h: 0, s: 0, l: 0 };
    }

    hsl.h = (hsl.h + 2) % 360;
    const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    await setStorageValue({ [key]: hslString });
  }

  // After updating colors, push theme to content scripts
  broadcastApplyTheme();
}

async function startRainbow() {
  await setStorageValue({ rainbow: true });

  let baseRainbowTheme = (await getStorageValue("baseRainbowTheme")) || {};
  if (!baseRainbowTheme || Object.keys(baseRainbowTheme).length === 0) {
    baseRainbowTheme = {};
    for (const key of COLOR_KEYS) {
      let color = (await getStorageValue(key)) || "#000000";
      baseRainbowTheme[key] = color;

      const rgb = convertToRgb(color) || { r: 0, g: 0, b: 0 };
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      await setStorageValue({
        [key]: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      });
    }
    await setStorageValue({ baseRainbowTheme });
  }

  const timerId = setInterval(advanceRainbow, 120);
  await setStorageValue({ rainbowTimerId: timerId });
}

async function stopRainbow() {
  await setStorageValue({ rainbow: false });

  const timerId = await getStorageValue("rainbowTimerId");
  if (timerId) {
    clearInterval(timerId);
  }

  let baseRainbowTheme = await getStorageValue("baseRainbowTheme");
  await setStorageValue({ baseRainbowTheme: {} });

  if (baseRainbowTheme && typeof baseRainbowTheme === "object") {
    for (const [id, color] of Object.entries(baseRainbowTheme)) {
      await setStorageValue({ [id]: color });
    }
    broadcastApplyTheme();
  }
}

async function toggleRainbow() {
  const rainbow = await getStorageValue("rainbow");
  console.log("toggle  ", rainbow)
  if (rainbow == true) {
    await stopRainbow();
  } else {
    await startRainbow();
  }
}

//#endregion

function init() {
  browserApi.storage.local.get(null, (items) => {
    if (!Object.keys(items).some((key) => key.startsWith("ColorMap"))) {
      browserApi.storage.local.set({
        "ColorMap--accent-color": "#c920ff",
        "ColorMap--accent-color-hover": "#d45bf8",
        "ColorMap--butterfly-icon": "#ca21ff",
        "ColorMap--background": "#211428",
        "ColorMap--content-warnings": "#291936",
        "ColorMap--content-warnings-hover": "#2b1b36",
        "ColorMap--text-primary": "#f6f6f8",
        "ColorMap--text-secondary": "#c7b3cf",
        "ColorMap--border-color": "#452f55",
        "ColorMap--main-button-text": "#f6f6f8",
        "rainbow": false,
        "rainbowTimerId": 0,
        "baseRainbowTheme": {},
      });
    }
  });
}

async function getMap() {
  return new Promise((resolve, reject) => {
    browserApi.storage.local.get(
      [
        "ColorMap--accent-color",
        "ColorMap--accent-color-hover",
        "ColorMap--butterfly-icon",
        "ColorMap--background",
        "ColorMap--content-warnings",
        "ColorMap--content-warnings-hover",
        "ColorMap--text-primary",
        "ColorMap--text-secondary",
        "ColorMap--border-color",
        "ColorMap--main-button-text",
      ],
      (result) => {
        if (browserApi.runtime.lastError) {
          reject(browserApi.runtime.lastError);
          return;
        }

        const colorMap = {
          "--accent-color": result["ColorMap--accent-color"] || "#c920ff",
          "--accent-color-hover": result["ColorMap--accent-color-hover"] || "#d45bf8",
          "--butterfly-icon": result["ColorMap--butterfly-icon"] || "#ca21ff",
          "--background": result["ColorMap--background"] || "#211428",
          "--content-warnings": result["ColorMap--content-warnings"] || "#291936",
          "--content-warnings-hover": result["ColorMap--content-warnings-hover"] || "#2b1b36",
          "--text-primary": result["ColorMap--text-primary"] || "#f6f6f8",
          "--text-secondary": result["ColorMap--text-secondary"] || "#c7b3cf",
          "--border-color": result["ColorMap--border-color"] || "#452f55",
          "--main-button-text": result["ColorMap--main-button-text"] || "#f6f6f8",
        };

        resolve(colorMap);
      }
    );
  });
}

browserApi.runtime.onMessage.addListener(
  async (message, sender, sendResponse) => {
    if (message.type === "applyTheme") {
      getMap().then((map) => {
        const response = { ColorMap: map };
        browserApi.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            browserApi.tabs.sendMessage(tabs[0].id, {
              type: "applyTheme",
              response,
            });
          }
        });
      });
    }

    if (message.type === "toggleRainbow") {
      toggleRainbow().then(() => {
        sendResponse({ ok: true });
      });
      return true;
    }

    if (message.type === "getRainbowState") {
      getStorageValue("rainbow").then((val) => {
        sendResponse({ rainbow: val === true });
      });
      return true;
    }

    return true;
  }
);

// Initialize theme on load
init();
