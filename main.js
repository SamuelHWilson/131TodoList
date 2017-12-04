const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on("ready", () => {
    var mainWindow = new BrowserWindow();
    mainWindow.loadURL(`file://${__dirname}/tasks.html`);

    /* Cleanup */
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});