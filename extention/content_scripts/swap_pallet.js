const dimTheme = {
  "--accent-color-val1": "rgb(15, 115, 255)",
  "--accent-color-val2": "#0085ff",
  "--accent-color-val3": "rgb(76, 162, 254)",
  "--accent-color-val4": "hsl(211, 99%, 56%)",
  "--accent-color-val5": "rgb(0, 133, 255)",
  "--accent-color-val6": "hsl(211, 99%, 64.8%)",
  "--accent-color-val7": "rgb(121, 185, 254)", // Notification popup text color
  "--accent-color-val8": "hsl(211, 99%, 73.6%)", // Notification popup svg color
  "--accent-color-inactive-val1": "rgb(10, 95, 186)",
  "--accent-color-inactive-val2": "rgb(14, 73, 137)",
  "--accent-color-inactive-val3": "rgb(14, 73, 137)",
  "--accent-color-inactive-text": "rgb(241, 243, 245)",
  "--accent-color-hover-val1": "rgb(76, 162, 254)",
  "--accent-color-hover-val2": "rgb(19, 63, 109)",
  "--accent-color-gradient-val1": "rgb(0, 133, 255)",
  "--accent-color-gradient-val2": "rgb(90, 113, 250)",
  "--content-warnings-val1": "rgb(34, 46, 63)",
  "--content-warnings-val2": "rgb(18, 41, 73)", // Background on Up arrow
  "--content-warnings-hover-val": "rgb(28, 39, 54)",
  "--background-change-val1": "rgb(21, 29, 40)",
  "--background-change-val2": "rgb(35, 46, 63)", // Notification popup background
  "--text-primary-val1": "rgb(255, 255, 255)",
  "--text-primary-val2": "hsl(211, 20%, 95.3%)",
  "--text-secondary-val1": "rgb(111, 131, 159)", // Usernames
  "--text-secondary-val2": "#FFFFFF", // Control nodes, like, share, comment etc..
  "--text-secondary-val3": "rgb(20, 27, 35)",
  "--text-secondary-val4": "rgb(215, 221, 228)", // control popup text (3 dots under posts)
  "--text-secondary-val5": "hsl(211, 20%, 62.4%)",
  "--text-secondary-val6": "#ABB8C9", // up arrow svg color when inactive
  "--text-secondary-val7": "rgb(84, 110, 138)", // Secondary text in profile dropdown
  "--border-color-val1": "rgb(44, 58, 78)",
  "--border-color-val2": "rgb(46, 64, 82)",
  "--border-color-val3": "rgb(14, 73, 137)", // Notification popup border
};
const darkTheme = {
  "--accent-color-val1": "rgb(0, 106, 255)",
  "--accent-color-val2": "#0085ff",
  "--accent-color-val3": "rgb(52, 150, 254)",
  "--accent-color-val4": "hsl(211, 99%, 53%)",
  "--accent-color-val5": "hsl(211, 99%, 56%)",
  "--accent-color-val6": "hsl(211, 99%, 60%)",
  "--accent-color-val7": "rgb(103, 176, 254)", // Notification popup text color
  "--accent-color-val8": "hsl(211, 99%, 70%)", // Notification popup svg color
  "--accent-color-inactive-val1": "rgb(1, 84, 173)",
  "--accent-color-inactive-val2": "rgb(1, 64, 132)",
  "--accent-color-inactive-val3": "rgb(0, 44, 91)",
  "--accent-color-inactive-text": "rgb(241, 243, 245)",
  "--accent-color-hover-val1": "rgb(52, 150, 254)",
  "--accent-color-hover-val2": "rgb(19, 63, 109)",
  "--accent-color-gradient-val1": "rgb(0, 133, 255)",
  "--accent-color-gradient-val2": "rgb(90, 113, 250)",
  "--content-warnings-val1": "rgb(25, 34, 46)",
  "--content-warnings-val2": "rgb(0, 30, 71)", // Background on Up arrow
  "--content-warnings-hover-val": "rgb(17, 24, 34)",
  "--background-change-val1": "rgb(0, 0, 0)",
  "--background-change-val2": "rgb(0, 17, 36)", // Notification popup background
  "--text-primary-val1": "rgb(255, 255, 255)",
  "--text-primary-val2": "hsl(211, 20%, 95.3%)",
  "--text-secondary-val1": "rgb(102, 123, 153)", // Usernames
  "--text-secondary-val2": "#FFFFFF", // Control nodes, like, share, comment etc..
  "--text-secondary-val3": "rgb(20, 27, 35)",
  "--text-secondary-val4": "rgb(212, 219, 226)", // control popup text (3 dots under posts)
  "--text-secondary-val5": "hsl(211, 20%, 62.4%)",
  "--text-secondary-val6": "hsl(211, 20%, 62.4%)", // up arrow svg color when inactive
  "--text-secondary-val7": "rgb(84, 110, 138)", // Secondary text in profile dropdown
  "--border-color-val1": "rgb(35, 46, 62)",
  "--border-color-val2": "rgb(46, 63, 81)",
  "--border-color-val3": "rgb(0, 44, 91)", // Notification popup border
};
const lightTheme = {
  "--accent-color-val1": "rgb(0, 106, 255)",
  "--accent-color-val2": "#0085ff",
  "--accent-color-val3": "rgb(1, 104, 213)",
  "--accent-color-val4": "hsl(211, 99%, 53%)",
  "--accent-color-val5": "hsl(211, 28%, 6%)",
  "--accent-color-val6": "hsl(211, 99%, 42%)",
  "--accent-color-val7": "rgb(1, 104, 213)", // Notification popup text color
  "--accent-color-val8": "hsl(211, 99%, 42%)", // Notification popup svg color
  "--accent-color-inactive-val1": "rgb(154, 202, 254)",
  "--accent-color-inactive-val2": "rgb(1, 84, 173)",
  "--accent-color-inactive-val3": "rgb(204, 229, 255)",
  "--accent-color-inactive-text": "rgb(255, 255, 255)",
  "--accent-color-hover-val1": "rgb(1, 104, 213)",
  "--accent-color-hover-val2": "rgb(19, 63, 109)",
  "--accent-color-gradient-val1": "rgb(0, 133, 255)",
  "--accent-color-gradient-val2": "rgb(90, 113, 250)",
  "--content-warnings-val1": "rgb(239, 242, 246)",
  "--content-warnings-val2": "rgb(230, 242, 255)", // Background on Up arrow
  "--content-warnings-hover-val": "rgb(249, 250, 251)",
  "--background-change-val1": "rgb(255, 255, 255)",
  "--background-change-val2": "rgb(240, 247, 255)", // Notification popup background
  "--text-primary-val1": "rgb(0, 0, 0)",
  "--text-primary-val2": "#000000",
  "--text-secondary-val1": "rgb(64, 81, 104)", // Usernames
  "--text-secondary-val2": "hsl(211, 20%, 53%)", // Control nodes, like, share, comment etc..
  "--text-secondary-val3": "rgb(11, 15, 20)",
  "--text-secondary-val4": "rgb(35, 46, 62)", // control popup text (3 dots under posts)
  "--text-secondary-val5": "hsl(211, 24%, 34.2%)",
  "--text-secondary-val6": "hsl(211, 24%, 34.2%)", // up arrow svg color when inactive
  "--text-secondary-val7": "rgb(140, 158, 178)", // Secondary text in profile dropdown
  "--border-color-val1": "rgb(220, 226, 234)",
  "--border-color-val2": "rgb(197, 207, 217)",
  "--border-color-val3": "rgb(103, 176, 254)", // Notification popup border
};

try {
  var browserApi = browser;
} catch {
  var browserApi = chrome;
}

async function applyTheme(colorMap) {
  let pickedTheme = {};
  const themeClass = document.documentElement.classList[0];

  switch (themeClass) {
    case "theme--dim":
      pickedTheme = dimTheme;
      break;
    case "theme--dark":
      pickedTheme = darkTheme;
      break;
    case "theme--light":
      pickedTheme = lightTheme;
      break;
    default:
      console.warn("No matching theme class found");
      return;
  }

  const innerStyle = `
      :root {
          --accent-color: ${colorMap["--accent-color"]};
          --accent-color-inactive: ${colorMap["--accent-color-inactive"]};
          --accent-color-inactive-text: ${colorMap["--accent-color-inactive-text"]};
          --accent-color-hover: ${colorMap["--accent-color-hover"]};
          --butterfly-icon: ${colorMap["--butterfly-icon"]};
          --background-change: ${colorMap["--background"]};
          --content-warnings: ${colorMap["--content-warnings"]};
          --content-warnings-hover: ${colorMap["--content-warnings-hover"]};
          --text-primary-change: ${colorMap["--text-primary"]};
          --text-secondary-change: ${colorMap["--text-secondary"]};
          --border-color-change: ${colorMap["--border-color"]};
          --main-button-text: ${colorMap["--main-button-text"]}
      }
  
      *[style*="background-color: ${pickedTheme["--accent-color-val1"]}"],
      *[style*="background-color: ${pickedTheme["--accent-color-val2"]}"],
      *[style*="background-color: ${pickedTheme["--text-secondary-val3"]}"] {
          background-color: var(--accent-color) !important;
      }
  
      /*Background of inactive accent color element*/
      *[style*="background-color: ${pickedTheme["--accent-color-inactive-val1"]}"] {
          background-color: var(--accent-color-inactive) !important;
      }
  
      /*Background of inactive chat message element*/
      *[style*="background-color: ${pickedTheme["--accent-color-inactive-val2"]}"],
      *[style*="background-color: ${pickedTheme["--accent-color-inactive-val3"]}"] {
          background-color: var(--accent-color-inactive) !important;
      }
  
      /*Background of post button that appears on mobile and less wide displays*/
      div[style*="background-image: linear-gradient(135deg, ${pickedTheme["--accent-color-gradient-val2"]}, ${pickedTheme["--accent-color-gradient-val1"]})"] {
        background-image: linear-gradient(135deg, var(--accent-color), var(--accent-color)) !important;
      }
  
      .r-wzwllv {
        background-color: var(--accent-color) !important;
      }
        
      *[style*="color: ${pickedTheme["--accent-color-val1"]}"],
      *[style*="color: ${pickedTheme["--accent-color-val2"]}"] {
          color: var(--accent-color) !important;
      }
      *[style*="border-bottom-color: ${pickedTheme["--accent-color-val1"]}"],
      *[style*="border-bottom-color: ${pickedTheme["--accent-color-val2"]}"] {
          border-bottom-color: var(--accent-color) !important;
      }
      *[style*="color: ${pickedTheme["--accent-color-val3"]}"] {
          color: var(--accent-color) !important;
      }
      path[fill="${pickedTheme["--accent-color-val1"]}"],
      path[fill="${pickedTheme["--accent-color-val2"]}"],
      path[fill="${pickedTheme["--accent-color-val4"]}"],
      path[fill="${pickedTheme["--accent-color-val6"]}"],
      path[fill="${pickedTheme["--accent-color-val8"]}"] {
          fill: var(--accent-color) !important;
      }
      svg[stroke="${pickedTheme["--accent-color-val4"]}"] {
          stroke: var(--accent-color) !important;
      }
  
      *[style*="background-color: ${pickedTheme["--accent-color-hover-val1"]}"],
      *[style*="background-color: ${pickedTheme["--accent-color-hover-val2"]}"] {
          background-color: var(--accent-color-hover) !important;
      }
  
      *[style*="background-color: ${pickedTheme["--content-warnings-val1"]}"],
      *[style*="background-color: ${pickedTheme["--content-warnings-val2"]}"] {
          background-color: var(--content-warnings) !important;
      }
      *[style*="background-color: ${pickedTheme["--content-warnings-hover-val"]}"] {
          background-color: var(--content-warnings-hover) !important;
      }
  
      *[style*="background-color: ${pickedTheme["--background-change-val1"]}"],
      *[style*="background-color: ${pickedTheme["--background-change-val2"]}"],
      .theme--dim, .theme--dark, .theme--light {
          background-color: var(--background-change) !important;
      }
          
      *[style*="color: ${pickedTheme["--text-primary-val1"]}"],
      *[style*="color: ${pickedTheme["--text-secondary-val3"]}"] {
          color: var(--text-primary-change) !important;
      }
      *[style*="color: ${pickedTheme["--text-secondary-val1"]}"],
      *[style*="color: ${pickedTheme["--text-secondary-val4"]}"],
      *[style*="color: ${pickedTheme["--text-secondary-val7"]}"] {
          color: var(--text-secondary-change) !important;
      }
      path[fill="${pickedTheme["--text-primary-val2"]}"] {
          fill: var(--text-primary-change) !important;
      }
      path[fill="${pickedTheme["--text-secondary-val2"]}"],
      path[fill="${pickedTheme["--text-secondary-val5"]}"],
      path[fill="${pickedTheme["--text-secondary-val6"]}"] {
          fill: var(--text-secondary-change) !important;
      }
  
      /*Circle indicator for amount of characters left in the post text-box*/
      path[stroke="${pickedTheme["--accent-color-val4"]}"] {
          stroke: var(--accent-color) !important;
      }
    
      button div[style*="color: ${pickedTheme["--text-primary-val1"]}"] {
          color: var(--main-button-text) !important;
      }
      button div div svg path[fill="${pickedTheme["--text-primary-val2"]}"] {
          fill: var(--main-button-text) !important;
      } 
  
      /*Border color around active input elements*/
      *[style*="border-color: ${pickedTheme["--accent-color-val1"]}"] {
          border-color: var(--accent-color) !important;
      }
  
      *[style*="border-color: ${pickedTheme["--border-color-val1"]}"],
      *[style*="border-color: ${pickedTheme["--border-color-val2"]}"],
      *[style*="border-color: ${pickedTheme["--border-color-val3"]}"] { /*Border around notification popup*/
          border-color: var(--border-color-change) !important;
      }
      
      *[style*="background-color: ${pickedTheme["--border-color-val1"]}"] { /*Separator in profile dropdown*/
          background-color: var(--border-color-change) !important;
      }

      /*Text in notification popup*/
      *[style*="color: ${pickedTheme["--accent-color-val7"]}"] {
          color: var(--accent-color) !important;
      }
    `;

  if (document.getElementById("style-inject-bsky")) {
    document.getElementById("style-inject-bsky").innerHTML = innerStyle;
  } else {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = innerStyle;
    styleElement.id = "style-inject-bsky";
    document.head.appendChild(styleElement);
  }
}

async function removeProseMirror() {
  for (let sheet of document.styleSheets) {
    try {
      for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
        if (
          sheet.cssRules[i].selectorText === ".ProseMirror-light" ||
          sheet.cssRules[i].selectorText === ".ProseMirror-dark"
        ) {
          sheet.deleteRule(i);
        }
      }
    } catch (e) {
      console.warn("Unable to access stylesheet:", sheet);
    }
  }
}

// Get colors from storage
function getColor() {
  return new Promise((resolve) => {
    browserApi.storage.local.get(
      [
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
      ],
      (result) => {
        const colorMap = {
          "--accent-color": result["ColorMap--accent-color"],
          "--accent-color-inactive": result["ColorMap--accent-color-inactive"],
          "--accent-color-inactive-text":
            result["ColorMap--accent-color-inactive-text"],
          "--accent-color-hover": result["ColorMap--accent-color-hover"],
          "--butterfly-icon": result["ColorMap--butterfly-icon"],
          "--background": result["ColorMap--background"],
          "--content-warnings": result["ColorMap--content-warnings"],
          "--content-warnings-hover":
            result["ColorMap--content-warnings-hover"],
          "--text-primary": result["ColorMap--text-primary"],
          "--text-secondary": result["ColorMap--text-secondary"],
          "--border-color": result["ColorMap--border-color"],
          "--main-button-text": result["ColorMap--main-button-text"],
        };
        resolve(colorMap);
      }
    );
  });
}

// Set colors into storage from background script (Potentially redundant bc of unified storage)
function setColor(colorMap) {
  chrome.storage.local.set({
    "ColorMap--accent-color": colorMap["--accent-color"],
    "ColorMap--accent-color-inactive": colorMap["--accent-color-inactive"],
    "ColorMap--accent-color-inactive-text":
      colorMap["--accent-color-inactive-text"],
    "ColorMap--accent-color-hover": colorMap["--accent-color-hover"],
    "ColorMap--butterfly-icon": colorMap["--butterfly-icon"],
    "ColorMap--background": colorMap["--background"],
    "ColorMap--content-warnings": colorMap["--content-warnings"],
    "ColorMap--content-warnings-hover": colorMap["--content-warnings-hover"],
    "ColorMap--text-primary": colorMap["--text-primary"],
    "ColorMap--text-secondary": colorMap["--text-secondary"],
    "ColorMap--border-color": colorMap["--border-color"],
    "ColorMap--main-button-text": colorMap["--main-button-text"],
  });
}

// Listen for messages from background script
browserApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "applyTheme") {
    applyTheme(message.response["ColorMap"]);
    setColor(message.response["ColorMap"]);
  }
});

// Use MutationObserver to wait for class changes
function observeThemeChanges() {
  const observer = new MutationObserver(async (mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.attributeName === "class" &&
        document.documentElement.classList.length > 0
      ) {
        const colorMap = await getColor(); // Await to ensure resolved value
        await applyTheme(colorMap);
        await removeProseMirror();
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

// Init if root element contains theme
(async function initTheme() {
  if (document.documentElement.classList.length > 0) {
    const colorMap = await getColor();
    await applyTheme(colorMap);
  }
  observeThemeChanges();
})();
