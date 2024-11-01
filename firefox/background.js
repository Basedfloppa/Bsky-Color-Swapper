// Initialize default theme if not set
function init() {
  if (!JSON.stringify(localStorage).includes("ColorMap")) {
    localStorage.setItem("ColorMap--accent-color", '#bb98ff');
    localStorage.setItem("ColorMap--accent-color-hover", '#8a2be2');
    localStorage.setItem("ColorMap--butterfly-icon", '#8a2be2');
    localStorage.setItem("ColorMap--background", '#200d46');
    localStorage.setItem("ColorMap--content-warnings", '#322d3c');
    localStorage.setItem("ColorMap--content-warnings-hover", '#4b435b');
    localStorage.setItem("ColorMap--text-primary", '#fff');
    localStorage.setItem("ColorMap--text-secondary", '#7f7f7f');
    localStorage.setItem("ColorMap--border-color", 'rgb(46, 64, 82)');
    localStorage.setItem("ColorMap--main-button-text", "#fff");
  }
}

function getMap() {
  const colorMap = {
    '--accent-color': localStorage.getItem("ColorMap--accent-color"),
    '--accent-color-hover': localStorage.getItem("ColorMap--accent-color-hover"),
    '--butterfly-icon': localStorage.getItem("ColorMap--butterfly-icon"),
    '--background': localStorage.getItem("ColorMap--background"),
    '--content-warnings': localStorage.getItem("ColorMap--content-warnings"),
    '--content-warnings-hover': localStorage.getItem("ColorMap--content-warnings-hover"),
    '--text-primary': localStorage.getItem("ColorMap--text-primary"),
    '--text-secondary': localStorage.getItem("ColorMap--text-secondary"),
    '--border-color': localStorage.getItem("ColorMap--border-color"),
    '--main-button-text': localStorage.getItem("ColorMap--main-button-text")
  };

  return colorMap;
}

window.browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'applyTheme') {
    let map = getMap();
    let response = { "ColorMap": map };

    // Send message to the content script of the active tab
    window.browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        window.browser.tabs.sendMessage(tabs[0].id, { type: 'applyTheme', response });
      }
    });
  }
  return true; // Keep the message channel open for sendResponse
});

// Initialize theme on load
init();
