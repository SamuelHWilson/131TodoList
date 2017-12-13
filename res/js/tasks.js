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
        if (selectedFiles === undefined) { // If user didn't pick a file.
            console.log("File not selected.");
            var fileName = filePath.split("/")

            HelperVue.QueueAdvice(new AdviceObj("Woah, slow down. You forgot to pick a file!", 2));
        } else if (selectedFiles.length > 1) { //If user picked more than one file.
            var fileName = filePath.split("/")

            HelperVue.QueueAdvice(new AdviceObj("Hmm... Looks like you tried to open more than one file boss. I'm good, but not that good. Just open one.", 2));
        } else {
            // Grab filepath from returned array.
            var filePath = selectedFiles[0];

            // Attempt to load JSON file into tasks
            try {
                MainVue.tasks = JSON.parse(fs.readFileSync(filePath));
                currentFile = filePath;
            } catch(e) {
                HelperVue.QueueAdvice(new AdviceObj("Boss, somethings wrong with that file: I can't open it. Are you sure you picked the right one?", 2));
                return;
            }
            
            HelperVue.QueueAdvice(new AdviceObj("Ready to go boss! Found that file and got it opened up for you.", 0, true));
        }
    })
});

ipc.on("save-file", (event) => {
    dialog.showSaveDialog((filePath) => {
        if (filePath === undefined) {
            HelperVue.QueueAdvice(new AdviceObj("Woah, slow down boss! You forgot to pick a file.", 2));
        } else {
            fs.writeFileSync(filePath, JSON.stringify(MainVue.tasks));
            currentFile = filePath;

            HelperVue.QueueAdvice(new AdviceObj("Done! Got everything saved for later.", 0, true));
        }
    })
});

ipc.on("clear-tasks", (event) => {
    HelperVue.QueueQuestion(new QuestionObj("Are you sure you want to do that boss?", () => {
        MainVue.tasks = [];
    }));
});

ipc.on("save-last", (event) => {
    if (currentFile != "") {
        fs.writeFileSync(currentFile, JSON.stringify(MainVue.tasks));
    }
});

    
