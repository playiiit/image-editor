const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const ipc = ipcMain;
const PowerShell = require("powershell");
const path = require("path");
const log = require("electron-log");

log.transports.file.getFile().path = __dirname + "\\main.log";
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, "Assets/Logo.png"),
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");

  ipc.on("closeApp", () => {
    win.close();
  });

  ipc.on("minimizeApp", () => {
    win.minimize();
  });

  ipc.on("maximizeApp", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });

  /*
   * Get output folder path
   * */
  ipc.on("open-output-dialog", (event, json) => {
    dialog
      .showOpenDialog({ properties: ["openDirectory"] })
      .then((data) => {
        if (data.canceled) {
          event.returnValue = {
            state: false,
            pathGet: null,
            error: "Canceled",
          };
        } else {
          event.returnValue = {
            state: true,
            pathGet: data.filePaths,
            error: null,
          };
        }
      })
      .catch((err) => {
        log.error(err);
        event.returnValue = { state: false, pathGet: null, error: err };
      });
  });

  /*
   * Set Envirament Variable
   * */
  try {
    if (!process.env.CwebpPath) {
      let ps = new PowerShell("$env:CwebpPath=" + __dirname + "\\Webp");
      log.info(__dirname + "\\Webp" + " Variable Added");

      ps.on("end", (code) => {
        log.info(code);
      });
    } else {
      log.info("Already set " + process.env.CwebpPath);
    }
  } catch (error) {
    log.error(error);
  }
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    app.allowRendererProcessReuse = false;
  });
});
