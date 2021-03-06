const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const fs = require("fs");

var mainWindow;
var addTaskWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 700
    });
    mainWindow.loadURL(`file://${__dirname}/tasks.html`);
    mainWindow.setResizable(false);
    
    const menu = Menu.buildFromTemplate(menuTemplate);
    mainWindow.setMenu(menu);

    /* Cleanup */
    mainWindow.on("closed", () => {
        mainWindow = null;
        app.quit();
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
        {label: "Add Task...", click: () => {OpenAddTaskWindow()}},
        {label: "Clear All Tasks", click: () => {mainWindow.webContents.send("clear-tasks")}}
    ]},
    {label: "Application", submenu: [
        {label: "Close", role: "close"}
    ]},
    {label: "Developer", submenu: [
        {label: "Toggle Developer Tools...", role: "toggledevtools"},
        {label: "Reload", role: "reload"}
    ]}
];

function OpenAddTaskWindow() {
    addTaskWindow = new BrowserWindow({
        width: 400,
        height: 300
    });
    addTaskWindow.loadURL(`file://${__dirname}/add-task.html`);
}

/* Remote Links */
ipc.on("remote-add", (event, task) => {
    mainWindow.webContents.send("remote-add", task);
});