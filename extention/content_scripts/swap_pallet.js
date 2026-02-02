const theme = {
  light: {
    accent: ["#006AFF", "rgb(0, 106, 255)", "#0059D6"],
    accent_hover: ["rgb(0, 89, 214)", "rgb(117, 175, 255)"],

    background: ["rgb(255, 255, 255)", "rgb(229, 240, 255)"],

    border: ["rgb(220, 226, 234)", "rgb(192, 202, 216)", "rgb(168, 204, 255)", "#DCE2EA", "rgb(204, 225, 255)"],

    text_primary: ["#000000", "rgb(0, 0, 0)", "rgb(35, 46, 62)", "rgb(255, 255, 255)", "#FFFFFF"],
    text_secondary: ["rgb(64, 81, 104)", "hsl(211, 24%, 34.2%)", "rgb(102, 123, 153)", "rgb(0, 89, 214)", "#405168", "#667B99", "#526580"],
    
    content_warning: ["rgb(239, 242, 246)", "rgb(230, 242, 255)", "rgb(249, 250, 251)", "rgb(245, 249, 255)", "rgb(35, 46, 62)"],
    content_warning_hover: ["rgb(220, 226, 234)", "rgb(17, 24, 34)"],

    butterfly: ["#0085ff"],
  },
  dark: {
    accent: ["#006AFF","rgb(0, 106, 255)", "#75AFFF"],
    accent_hover: ["rgb(66, 145, 255)", "rgb(0, 72, 173)"],

    background: ["rgb(0, 0, 0)"],

    border: ["rgb(35, 46, 62)", "rgb(0, 40, 97)", "rgb(49, 63, 84)", "rgb(0, 57, 138)", "#232E3E"],

    text_primary: ["#FFFFFF", "rgb(255, 255, 255)", "rgb(220, 226, 234)"],
    text_secondary: ["rgb(102, 123, 153)", "hsla(212, 20%, 62%, 1.00)", "rgb(165, 178, 197)", "rgb(117, 175, 255)", "#667B99", "#A5B2C5"],
    
    content_warning: ["rgb(25, 34, 46)", "rgb(0, 30, 71)", "rgb(17, 24, 34)", "rgb(0, 21, 51)"],
    content_warning_hover: ["rgb(35, 46, 62)"],

    butterfly: ["#0085ff"],
  },
  dim: {
    accent: ["#0F73FF", "rgb(15, 115, 255)", "rgb(25, 118, 210)", "#80B5FF"],
    accent_hover: ["rgb(77, 151, 255)", "rgb(10, 82, 184)"],

    background: ["rgb(21, 29, 40)"],

    border: ["rgb(44, 58, 78)", "rgb(14, 68, 144)", "rgb(57, 73, 96)", "rgb(18, 52, 100)", "#2C3A4E"],

    text_primary: ["#FFFFFF", "rgb(255, 255, 255)", "rgb(226, 231, 238)"],
    text_secondary: ["rgb(171, 184, 201)", "rgb(111, 131, 159)", "rgb(128, 181, 255)", "#6F839F", "#ABB8C9", "#8D9DB4"],
    
    content_warning: ["rgb(18, 33, 54)", "rgb(34, 46, 63)", "rgb(28, 39, 54)", "rgb(18, 41, 73)"],
    content_warning_hover: ["rgb(44, 58, 78)"],

    butterfly: ["#0085ff"],
  }
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
      pickedTheme = theme.dim;
      break;
    case "theme--dark":
      pickedTheme = theme.dark;
      break;
    case "theme--light":
      pickedTheme = theme.light;
      break;
    default:
      console.warn("No matching theme class found");
      return;
  }

  const root = `
      :root {
          --accent-color: ${sanitizeColor(colorMap["--accent-color"])};
          --accent-color-hover: ${sanitizeColor(colorMap["--accent-color-hover"])};
          --butterfly-icon: ${sanitizeColor(colorMap["--butterfly-icon"])};
          --background-change: ${sanitizeColor(colorMap["--background"])};
          --content-warnings: ${sanitizeColor(colorMap["--content-warnings"])};
          --content-warnings-hover: ${sanitizeColor(colorMap["--content-warnings-hover"])};
          --text-primary-change: ${sanitizeColor(colorMap["--text-primary"])};
          --text-secondary-change: ${sanitizeColor(colorMap["--text-secondary"])};
          --border-color-change: ${sanitizeColor(colorMap["--border-color"])};
          --main-button-text: ${sanitizeColor(colorMap["--main-button-text"])}
      }
    `;

  const blocks = [
    `.${themeClass} { background-color: var(--background-change) !important; }`,

    cssMatch("background-color", pickedTheme.background, "background-color: var(--background-change) !important;"),
    cssMatch("border-color", pickedTheme.background, "border-color: var(--background-change) !important;"),

    cssMatch("background-color", pickedTheme.content_warning, "background-color: var(--content-warnings) !important;"),

    cssMatch("background-color", pickedTheme.content_warning_hover, "background-color: var(--content-warnings-hover) !important;"),

    cssMatch("border-color", pickedTheme.border, "border-color: var(--border-color-change) !important;"),
    cssMatch("background-color", pickedTheme.border, "background-color: var(--border-color-change) !important;"),
    strokeFill(pickedTheme.border, "stroke: var(--border-color-change) !important;"),

    pathFill(pickedTheme.accent, "fill: var(--accent-color) !important;"),
    strokeFill(pickedTheme.accent, "stroke: var(--accent-color) !important;"),
    cssMatch("color", pickedTheme.accent, "color: var(--accent-color) !important;"),
    cssMatch("stroke", pickedTheme.accent, "stroke: var(--accent-color) !important;"),
    cssMatch("background-color", pickedTheme.accent, "background-color: var(--accent-color) !important;"),
    cssMatch("text-decoration-color", pickedTheme.accent, "text-decoration-color: var(--accent-color) !important;"),
    cssMatch("border-color", pickedTheme.accent, "border-color: var(--accent-color) !important;"),

    cssMatch("background-color", pickedTheme.accent_hover, "background-color: var(--accent-color-hover) !important;"),
    cssMatch("color", pickedTheme.accent_hover, "color: var(--accent-color-hover) !important;"),

    cssMatch("color", pickedTheme.text_primary, "color: var(--text-primary-change) !important;"),
    pathFill(pickedTheme.text_primary, "fill: var(--text-primary-change) !important;"),

    cssMatch("color", pickedTheme.text_secondary, "color: var(--text-secondary-change) !important;"),
    cssMatch("--placeholderTextColor", pickedTheme.text_secondary, "--placeholderTextColor: var(--text-secondary-change) !important;"),
    pathFill(pickedTheme.text_secondary, "fill: var(--text-secondary-change) !important;"),

    pathFill(pickedTheme.butterfly, "fill: var(--butterfly-icon) !important;"),

    pickedTheme.text_primary.map(v => `div > button > div > div > svg > path[fill="${v}"]`).join(",\n") + `{ fill: var(--main-button-text) !important; }`,
    pickedTheme.text_primary.map(v => `div > button > div[style*="color: ${v}"]`).join(",\n") + `{ color: var(--main-button-text) !important; }`,

    'div[style*="background-image: linear-gradient(135deg, rgb(90, 113, 250), rgb(0, 133, 255))"] { background-image: linear-gradient(0deg, var(--accent-color), var(--accent-color)) !important;}',
    'div.r-kemksi { background: var(--background-change) !important; }', // Specific override for alt text background
  ];
  
  const innerStyle = root + "\n" + blocks.join("\n\n");

  if (document.getElementById("style-inject-bsky")) {
    document.getElementById("style-inject-bsky").textContent = innerStyle;
  } else {
    const styleElement = document.createElement("style");
    styleElement.textContent = innerStyle;
    styleElement.id = "style-inject-bsky";
    document.head.appendChild(styleElement);
  }
}

function cssMatch(prop, values, decl) {
  return values.map(v => `*[style*="${prop}: ${v}"]`).join(",\n") + ` { ${decl} }`;
}

function pathFill(values, decl) {
  return values.map(v => `path[fill="${v}"]`).join(",\n") + ` { ${decl} }`;
}

function strokeFill(values, decl) {
  return values.map(v => `path[stroke="${v}"]`).join(",\n") + ` { ${decl} }`;
}

function sanitizeColor(value) {
  const cssColorRe = /^(?:#[0-9a-fA-F]{3,8}|rgb[a]?\([^)]*\)|hsl[a]?\([^)]*\)|[a-zA-Z]+)$/; // hex + rgb(a) + hsl(a)
  return cssColorRe.test(value) ? value : "transparent";
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
          "--accent-color-hover": result["ColorMap--accent-color-hover"],
          "--butterfly-icon": result["ColorMap--butterfly-icon"],
          "--background": result["ColorMap--background"],
          "--content-warnings": result["ColorMap--content-warnings"],
          "--content-warnings-hover": result["ColorMap--content-warnings-hover"],
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
  browserApi.storage.local.set({
    "ColorMap--accent-color": colorMap["--accent-color"],
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
