const dimTheme = {
  '--accent-color-val1': 'rgb(32, 139, 254)',
  '--accent-color-val2': '#0085ff',
  '--accent-color-val3': 'rgb(76, 162, 254)',
  '--accent-color-val4': 'hsl(211, 99%, 56%)',
  '--accent-color-val5': 'rgb(0, 133, 255)',
  '--accent-color-hover-val1': 'rgb(76, 162, 254)',
  '--accent-color-hover-val2': 'rgb(19, 63, 109)',
  '--accent-color-hover-val3': `rgb(240, 247, 255)`,
  '--content-warnings-val': 'rgb(30, 41, 54)',
  '--content-warnings-hover-val': 'rgb(38, 53, 68)',
  '--background-change-val': 'rgb(22, 30, 39)',
  '--text-primary-val1': 'rgb(241, 243, 245)',
  '--text-primary-val2': 'hsl(211, 20%, 95.3%)',
  '--text-secondary-val1': 'rgb(174, 187, 201)',
  '--text-secondary-val2': 'hsl(211, 20%, 53%)',
  '--text-secondary-val3': 'rgb(20, 27, 35)',
  '--text-secondary-val4': 'rgb(212, 219, 226)',
  '--text-secondary-val5': 'hsl(211, 20%, 62.4%)',
  '--border-color-val1': 'rgb(46, 64, 82)',
  '--border-color-val2': 'rgb(54, 75, 97)',
  '--notification-color': '',
};
const darkTheme = {
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
  '--border-color-val1': 'rgb(37, 51, 66)',
  '--border-color-val2': 'rgb(46, 63, 81)',
  '--notification-color': '',
};
const lightTheme = {
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
  '--border-color-val1': 'rgb(212, 219, 226)',
  '--border-color-val2': 'rgb(197, 207, 217)',
  '--notification-color': 'rgb(240, 247, 255)'
}

async function applyTheme(colorMap) {
  let pickedTheme = {};
  const themeClass = document.documentElement.classList[0];

  switch (themeClass) {
    case 'theme--dim':
      pickedTheme = dimTheme;
      break;
    case 'theme--dark':
      pickedTheme = darkTheme;
      break;
    case 'theme--light':
      pickedTheme = lightTheme;
      break;
    default:
      console.warn('No matching theme class found');
      return;
  }

  const innerStyle = `
    :root {
        --accent-color: ${colorMap['--accent-color']};
        --accent-color-hover: ${colorMap['--accent-color-hover']};
        --butterfly-icon: ${colorMap['--butterfly-icon']};
        --background-change: ${colorMap['--background']};
        --content-warnings: ${colorMap['--content-warnings']};
        --content-warnings-hover: ${colorMap['--content-warnings-hover']};
        --text-primary-change: ${colorMap['--text-primary']};
        --text-secondary-change: ${colorMap['--text-secondary']};
        --border-color-change: ${colorMap['--border-color']};
        --main-button-text: ${colorMap['--main-button-text']}
    }

    *[style*="background-color: ${pickedTheme['--accent-color-val1']}"],
    *[style*="background-color: ${pickedTheme['--accent-color-val2']}"] {
        background-color: var(--accent-color) !important;
    }

    .r-wzwllv {
      background-color: var(--accent-color) !important;
    }
      
    *[style*="color: ${pickedTheme['--accent-color-val1']}"],
    *[style*="color: ${pickedTheme['--accent-color-val2']}"] {
        color: var(--accent-color) !important;
    }
    *[style*="border-bottom-color: ${pickedTheme['--accent-color-val1']}"],
    *[style*="border-bottom-color: ${pickedTheme['--accent-color-val2']}"] {
        border-bottom-color: var(--accent-color) !important;
    }
    *[style*="color: ${pickedTheme['--accent-color-val3']}"] {
        color: var(--accent-color) !important;
    }
    path[fill="${pickedTheme['--accent-color-val1']}"],
    path[fill="${pickedTheme['--accent-color-val2']}"],
    path[fill="${pickedTheme['--accent-color-val4']}"] {
        fill: var(--accent-color) !important;
    }
    svg[stroke="${pickedTheme['--accent-color-val4']}"] {
        stroke: var(--accent-color) !important;
    }

    *[style*="background-color: ${pickedTheme['--accent-color-hover-val1']}"] {
        background-color: var(--accent-color-hover) !important;
    }
    *[style*="background-color: ${pickedTheme['--accent-color-hover-val2']}"] {
        background-color: var(--accent-color-hover) !important;
    }

    *[style*="background-color: ${pickedTheme['--content-warnings-val']}"] {
        background-color: var(--content-warnings) !important;
    }
    *[style*="background-color: ${pickedTheme['--content-warnings-hover-val']}"] {
        background-color: var(--content-warnings-hover) !important;
    }

    *[style*="background-color: ${pickedTheme['--background-change-val']}"] {
        background-color: var(--background-change) !important;
    }

    .theme--dim, .theme--dark, .theme--light {
        background-color: var(--background-change) !important;
    }
        
    *[style*="color: ${pickedTheme['--text-primary-val1']}"] {
        color: var(--text-primary-change) !important;
    }
    *[style*="color: ${pickedTheme['--text-secondary-val3']}"] {
        color: var(--text-primary-change) !important;
    }
    *[style*="color: ${pickedTheme['--text-secondary-val1']}"] {
        color: var(--text-secondary-change) !important;
    }
    *[style*="color: ${pickedTheme['--text-secondary-val4']}"] {
        color: var(--text-secondary-change) !important;
    }
    path[fill="${pickedTheme['--text-primary-val2']}"] {
        fill: var(--text-primary-change) !important;
    }
    path[fill="${pickedTheme['--text-secondary-val2']}"] {
        fill: var(--text-secondary-change) !important;
    }
    path[fill="${pickedTheme['--text-secondary-val5']}"] {
        fill: var(--text-secondary-change) !important;
    }

    *[style*="border-color: ${pickedTheme['--border-color-val1']}"],
    *[style*="border-color: ${pickedTheme['--border-color-val2']}"] {
        border-color: var(--border-color-change) !important;
    }

    button div[style*="color: ${pickedTheme['--text-primary-val1']}"] {
        color: var(--main-button-text) !important;
    }
    button div div svg path[fill="${pickedTheme['--text-primary-val2']}"] {
        fill: var(--main-button-text) !important;
    } 

    *[style*="border-color: ${pickedTheme['--border-color-val1']}"],
    *[style*="border-color: ${pickedTheme['--border-color-val2']}"] {
        border-color: var(--border-color-change) !important;
    }
`;

  if (document.getElementById('style-inject-bsky')) {
    document.getElementById('style-inject-bsky').innerHTML = innerStyle;
  }
  else {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = innerStyle;
    styleElement.id = 'style-inject-bsky';
    document.head.appendChild(styleElement);
  }
}

// Get colors from storage
function getColor() {
  return new Promise((resolve) => {
    chrome.storage.local.get([
      "ColorMap--accent-color",
      "ColorMap--accent-color-hover",
      "ColorMap--butterfly-icon",
      "ColorMap--background",
      "ColorMap--content-warnings",
      "ColorMap--content-warnings-hover",
      "ColorMap--text-primary",
      "ColorMap--text-secondary",
      "ColorMap--border-color",
      "ColorMap--main-button-text"
    ], (result) => {
      const colorMap = {
        '--accent-color': result["ColorMap--accent-color"],
        '--accent-color-hover': result["ColorMap--accent-color-hover"],
        '--butterfly-icon': result["ColorMap--butterfly-icon"],
        '--background': result["ColorMap--background"],
        '--content-warnings': result["ColorMap--content-warnings"],
        '--content-warnings-hover': result["ColorMap--content-warnings-hover"],
        '--text-primary': result["ColorMap--text-primary"],
        '--text-secondary': result["ColorMap--text-secondary"],
        '--border-color': result["ColorMap--border-color"],
        '--main-button-text': result["ColorMap--main-button-text"]
      };
      resolve(colorMap);
    });
  });
}

// Set colors into storage from background script (Potentially redundant bc of unified storage)
function setColor(colorMap) {
  chrome.storage.local.set({
    "ColorMap--accent-color": colorMap["--accent-color"],
    "ColorMap--accent-color-hover": colorMap["--accent-color-hover"],
    "ColorMap--butterfly-icon": colorMap["--butterfly-icon"],
    "ColorMap--background": colorMap["--background"],
    "ColorMap--content-warnings": colorMap["--content-warnings"],
    "ColorMap--content-warnings-hover": colorMap["--content-warnings-hover"],
    "ColorMap--text-primary": colorMap["--text-primary"],
    "ColorMap--text-secondary": colorMap["--text-secondary"],
    "ColorMap--border-color": colorMap["--border-color"],
    "ColorMap--main-button-text": colorMap["--main-button-text"]
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'applyTheme') {
    applyTheme(message.response['ColorMap']);
    setColor(message.response['ColorMap'])
  }
});

// Use MutationObserver to wait for class changes
function observeThemeChanges() {
  const observer = new MutationObserver(async (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'class' && document.documentElement.classList.length > 0) {
        const colorMap = await getColor();  // Await to ensure resolved value
        applyTheme(colorMap);
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

// Init if root element contains theme
(async function initTheme() {
  if (document.documentElement.classList.length > 0) {
    const colorMap = await getColor();
    await applyTheme(colorMap);
  }
  observeThemeChanges();
})();