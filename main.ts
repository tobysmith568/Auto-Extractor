import { app, BrowserWindow, Tray, Menu, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";

let win: BrowserWindow | undefined = undefined;
let trayIcon: Tray | undefined = undefined;
const args = process.argv.slice(1),
  serve = args.some(val => val === "--serve");

function createWindow(): BrowserWindow {
  // Create the browser window.
  win = new BrowserWindow({
    width: 320,
    height: 420,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false
    },
    autoHideMenuBar: true,
    fullscreenable: false,
    maximizable: false,
    frame: false,
    center: true,
    resizable: false
  });

  if (serve) {
    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL("http://localhost:4200");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.on("minimize", function (event: Event) {
    event.preventDefault();
    win.hide();
  });

  return win;
}

function createTrayIcon() {
  trayIcon = new Tray("./src/assets/icons/favicon.png");
  trayIcon.setContextMenu(
    Menu.buildFromTemplate([
      { type: "normal", label: "Open Window", click: () => win?.show() },
      { type: "separator" },
      { type: "normal", label: "Start", click: () => win?.webContents.send("start") },
      { type: "normal", label: "Stop", click: () => win?.webContents.send("stop") },
      { type: "separator" },
      { type: "normal", label: "Exit", click: () => win?.close() }
    ])
  );
  trayIcon.addListener("double-click", () => win?.show());
}

try {
  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", () => {
    setTimeout(createWindow, 400);
    setTimeout(createTrayIcon, 400);
  });

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

ipcMain.handle("app_getPath", (_, args) => {
  return app.getPath(args);
});
