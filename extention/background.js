try {
  var browserApi = browser;
} catch {
  var browserApi = chrome;
}

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
        "baseRainbowTheme": {}
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
      const map = await getMap();
      const response = { ColorMap: map };

      // Send message to the content script of the active tab
      browserApi.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          browserApi.tabs.sendMessage(tabs[0].id, {
            type: "applyTheme",
            response,
          });
        }
      });
    }
    return true; // Keep the message channel open for sendResponse
  }
);

// Initialize theme on load
init();
