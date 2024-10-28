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
    '--border-color': localStorage.getItem("ColorMap--border-color")
  };

  return colorMap;
}
const themes = {
  'dimTheme': {
    '--accent-color-val1': 'rgb(32, 139, 254)',
    '--accent-color-val2': '#0085ff',
    '--accent-color-val3': 'rgb(76, 162, 254)',
    '--accent-color-val4': 'hsl(211, 20%, 95.3%)',
    '--accent-color-val5': 'rgb(0, 133, 255)',
    '--accent-color-hover-val1': 'rgb(76, 162, 254)',
    '--accent-color-hover-val2': 'rgb(19, 63, 109)',
    '--content-warnings-val': 'rgb(30, 41, 54)',
    '--content-warnings-hover-val': 'rgb(38, 53, 68)',
    '--background-change-val': 'rgb(22, 30, 39)',
    '--text-primary-val1': 'rgb(241, 243, 245)',
    '--text-primary-val2': 'hsl(211, 20%, 95.3%)',
    '--text-secondary-val1': 'rgb(140, 158, 178)',
    '--text-secondary-val2': 'hsl(211, 20%, 53%)',
    '--text-secondary-val3': 'rgb(20, 27, 35)',
    '--text-secondary-val4': 'rgb(212, 219, 226)',
    '--text-secondary-val5': 'hsl(211, 20%, 62.4%)',
    '--border-color-val': 'rgb(46, 64, 82)',
  },
  'darkTheme': {
    '--accent-color-val1': 'rgb(16, 131, 254)',
    '--accent-color-val2': '#0085ff',
    '--accent-color-val3': 'rgb(52, 150, 254)',
    '--accent-color-val4': 'hsl(211, 99%, 53%)',
    '--accent-color-val4': 'hsl(211, 99%, 56%)',
    '--accent-color-hover-val1': 'rgb(52, 150, 254)',
    '--accent-color-hover-val2': 'rgb(19, 63, 109)',
    '--content-warnings-val': 'rgb(20, 27, 35)',
    '--content-warnings-hover-val': 'rgb(28, 39, 50)',
    '--background-change-val': 'rgb(0, 0, 0)',
    '--text-primary-val1': 'rgb(241, 243, 245)',
    '--text-primary-val2': 'hsl(211, 20%, 95.3%)',
    '--text-secondary-val1': 'rgb(140, 158, 178)',
    '--text-secondary-val2': 'hsl(211, 20%, 53%)',
    '--text-secondary-val3': 'rgb(20, 27, 35)',
    '--text-secondary-val4': 'rgb(212, 219, 226)',
    '--text-secondary-val5': 'hsl(211, 20%, 62.4%)',
    '--border-color-val': 'rgb(37, 51, 66)',
  },
  'lightTheme': {
    '--accent-color-val1': 'rgb(16, 131, 254)',
    '--accent-color-val2': '#0085ff',
    '--accent-color-val3': 'rgb(1, 104, 213)',
    '--accent-color-val4': 'hsl(211, 99%, 53%)',
    '--accent-color-val5': 'hsl(211, 28%, 6%)',
    '--accent-color-hover-val1': 'rgb(1, 104, 213)',
    '--accent-color-hover-val2': 'rgb(19, 63, 109)',
    '--content-warnings-val': 'rgb(241, 243, 245)',
    '--content-warnings-hover-val': 'rgb(226, 231, 236)',
    '--background-change-val': 'rgb(255, 255, 255)',
    '--text-primary-val1': 'rgb(11, 15, 20)',
    '--text-primary-val2': 'hsl(211, 28%, 6%)',
    '--text-secondary-val1': 'rgb(66, 87, 108)',
    '--text-secondary-val2': 'hsl(211, 20%, 53%)',
    '--text-secondary-val3': 'rgb(11, 15, 20)',
    '--text-secondary-val4': 'rgb(37, 51, 66)',
    '--text-secondary-val5': 'hsl(211, 24%, 34.2%)',
    '--border-color-val': 'rgb(212, 219, 226)'
  }
};

let BrowserApi = window.browser || window.chrome;

BrowserApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'applyTheme') {
    let map = getMap();
    let theme = themes[message.themeName];
    let response = { "ColorMap": map, 'Theme': theme };

    // Send message to the content script of the active tab
    BrowserApi.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        BrowserApi.tabs.sendMessage(tabs[0].id, { type: 'applyTheme', response });
      }
    });
  }
  return true; // Keep the message channel open for sendResponse
});

// Initialize theme on load
init();
