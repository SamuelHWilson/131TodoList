const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const fs = require("fs");

var mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 700
    });
    mainWindow.loadURL(`file://${__dirname}/tasks.html`);
    
    const menu = Menu.buildFromTemplate(menuTemplate);
    mainWindow.setMenu(menu);

    /* Cleanup */
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

const menuTemplate = [
    {label: "File", submenu: [
        {label: "Open...", click: () => {mainWindow.webContents.send("open-file")}},
        {type: "separator"},
        {label: "Save", click: () => {mainWindow.webContents.send("save-last")}},
        {label: "Save As...", click: () => {mainWindow.webContents.send("save-file")}}
    ]},
    {label: "Tasks", submenu: [
        {label: "Clear All Tasks", click: () => {mainWindow.webContents.send("clear-tasks")}}
    ]},
    {label: "Application", submenu: [
        {label: "Close", role: "close"}
    ]},
    {label: "Developer", submenu: [
        {label: "Toggle Developer Tools", role: "toggledevtools"},
        {label: "Reload", role: "reload"}
    ]}
];