const electron = require("electron");
const ipc = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const fs = require("fs");

const DATA_LOCATION = `${__dirname}/res/data/tasks.json`;

var currentFile = "";

var MainVue = new Vue({
    el: "#main",
    data: {
        tasks: [],
        makingNew: false,
    },
    methods: {
        CompleteTask(toRemove) {
            var index = this.tasks.indexOf(toRemove);
            this.tasks.splice(index, 1);
        },
        StartAddingTask() {
            this.makingNew = true;
            Vue.nextTick(() => {
                document.getElementById("taskbox-new-input").focus();
            });
        },
        CompleteAddingTask() {
            this.makingNew = false;
            this.AddTaskFromTaskObj(new TaskObj(document.getElementById("taskbox-new-input").value));
            document.getElementById("taskbox-new-input").value = "";
        },
        AddTaskFromTaskObj(task) {
            this.tasks.push(task);
        }
    }
});

/* Remote functions */
ipc.on("remote-add", (event, task) => {
    MainVue.AddTaskFromTaskObj(task);
});

/* Top Menu Functions */

ipc.on("open-file", (event) => {
    dialog.showOpenDialog((selectedFiles) => {
        if (selectedFiles === undefined) {
            console.log("File not selected.");
        } else if (selectedFiles.length > 1) {
            console.log("Only one file can be selected");
        } else {
            filePath = selectedFiles[0];

            MainVue.tasks = JSON.parse(fs.readFileSync(filePath));
            currentFile = filePath;
        }
    })
});

ipc.on("save-file", (event) => {
    dialog.showSaveDialog((filePath) => {
        if (filePath === undefined) {
            console.log("File not selected.");
        } else {
            fs.writeFileSync(filePath, JSON.stringify(MainVue.tasks));
            currentFile = filePath;
        }
    })
});

ipc.on("clear-tasks", (event) => {
    MainVue.tasks = [];
});

ipc.on("save-last", (event) => {
    if (currentFile != "") {
        fs.writeFileSync(currentFile, JSON.stringify(MainVue.tasks));
    }
});

    