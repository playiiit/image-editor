const fs = require("fs");
// -------------------------------
// Night/Light Theme Change Action
// -------------------------------
async function toggleTheme() {
  const checkTheme = await readTheme();

  if (checkTheme === "dark") {
    document.documentElement.setAttribute("theme", "light");
    document.getElementById("toggleAppearance").checked = true;
  } else if (checkTheme === "light") {
    document.documentElement.setAttribute("theme", "dark");
    document.getElementById("toggleAppearance").checked = false;
  }
}
toggleTheme();

/**
 * Read theme config file
 *
 * @returns null
 */
function readTheme() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.readFile(
        __dirname + "\\Temp\\Config\\settings.json",
        "utf8",
        (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(JSON.parse(data)[0].theme);
        }
      );
    }, 0);
  });
}

/**
 * Set theme
 *
 * @param {*} theme
 */
document
  .getElementById("toggleAppearance")
  .addEventListener("change", async (e) => {
    if (e.target.checked) {
      writeTheme("dark");
      toggleTheme();
    } else {
      writeTheme("light");
      toggleTheme();
    }
  });

function writeTheme(theme) {
  fs.writeFileSync(
    __dirname + "\\Temp\\Config\\settings.json",
    JSON.stringify([{ theme: theme }])
  );
}
