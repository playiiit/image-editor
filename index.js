const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const ipc = ipcMain;
const PowerShell = require("powershell");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    // icon: path.join(__dirname, "Assets/Playgen-Logo-Task-Bar.png"),
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
        console.log(err);
        event.returnValue = { state: false, pathGet: null, error: err };
      });
  });

  /*
   * Set Envirament Variable
   * */
  try {
    let ps = new PowerShell("$env:CwebpPath=" + __dirname + "\\Webp");

    ps.on("end", (code) => {
      console.log(code);
    });
  } catch (error) {
    console.log(error);
  }

  // trigger autoupdate check
  autoUpdater.checkForUpdates();
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

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = (text) => {
  try {
    writeLog(text);
    log.info(text);
    if (mainWindow) {
      mainWindow.webContents.send("message", text);
    }
  } catch (error) {
    writeLog(error);
  }
};

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on("download-progress", (progressObj) => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
  );
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded; will install now");
});

autoUpdater.on("update-downloaded", (info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 500 ms.
  // You could call autoUpdater.quitAndInstall(); immediately
  autoUpdater.quitAndInstall();
});


function writeLog(data) {
  try {
    fs.writeFile(
      "C:UsersTigEr_MPimage-editorlog.txt",
      data,
      (err) => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      }
    );
  } catch (err) {
    console.error(err);
  }
}