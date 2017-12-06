const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

app.on("ready", () => {
    var mainWindow = new BrowserWindow({
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
    {label: "Tasks", submenu: [
        {label: "New Task", click: () => {}},
        {label: "Clear All Tasks", click: () => {}},
        {type: "separator"},
        {label: "Load From File", click: () => {}}
    ]},
    {label: "Application", submenu: [
        {label: "Close", role: "close"}
    ]},
    {label: "Developer", submenu: [
        {label: "Toggle Developer Tools", role: "toggledevtools"},
        {label: "Reload", role: "reload"}
    ]}
];