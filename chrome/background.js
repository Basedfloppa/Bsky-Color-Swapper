function init() {
  chrome.storage.local.get(null, (items) => {
    if (!Object.keys(items).some(key => key.startsWith("ColorMap"))) {
      chrome.storage.local.set({
        "ColorMap--accent-color": '#bb98ff',
        "ColorMap--accent-color-inactive": '#553399',
        "ColorMap--accent-color-inactive-text": '#fff',
        "ColorMap--accent-color-hover": '#8a2be2',
        "ColorMap--butterfly-icon": '#8a2be2',
        "ColorMap--background": '#200d46',
        "ColorMap--content-warnings": '#322d3c',
        "ColorMap--content-warnings-hover": '#4b435b',
        "ColorMap--text-primary": '#fff',
        "ColorMap--text-secondary": '#7f7f7f',
        "ColorMap--border-color": 'rgb(46, 64, 82)',
        "ColorMap--main-button-text": "#fff"
      });
    }
  });
}

async function getMap() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([
      "ColorMap--accent-color",
      "ColorMap--accent-color-inactive",
      "ColorMap--accent-color-inactive-text",
      "ColorMap--accent-color-hover",
      "ColorMap--butterfly-icon",
      "ColorMap--background",
      "ColorMap--content-warnings",
      "ColorMap--content-warnings-hover",
      "ColorMap--text-primary",
      "ColorMap--text-secondary",
      "ColorMap--border-color",
      "ColorMap--main-button-text",
    ], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const colorMap = {
        '--accent-color': result["ColorMap--accent-color"] || '#bb98ff',
        '--accent-color-inactive': result["ColorMap--accent-color-inactive"] || '#553399',
        '--accent-color-inactive-text' : result["ColorMap--accent-color-inactive-text"] || '#fff',
        '--accent-color-hover': result["ColorMap--accent-color-hover"] || '#8a2be2',
        '--butterfly-icon': result["ColorMap--butterfly-icon"] || '#8a2be2',
        '--background': result["ColorMap--background"] || '#200d46',
        '--content-warnings': result["ColorMap--content-warnings"] || '#322d3c',
        '--content-warnings-hover': result["ColorMap--content-warnings-hover"] || '#4b435b',
        '--text-primary': result["ColorMap--text-primary"] || '#fff',
        '--text-secondary': result["ColorMap--text-secondary"] || '#7f7f7f',
        '--border-color': result["ColorMap--border-color"] || 'rgb(46, 64, 82)',
        '--main-button-text': result["ColorMap--main-button-text"] || '#fff'
      };

      resolve(colorMap);
    });
  });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'applyTheme') {
    const map = await getMap();
    const response = { "ColorMap": map };

    // Send message to the content script of the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'applyTheme', response });
      }
    });
  }
  return true; // Keep the message channel open for sendResponse
});

// Initialize theme on load
init();
