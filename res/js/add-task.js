const electron = require("electron");
const ipc = electron.ipcRenderer;

MainVue = new Vue({
    el: "#main",
    data: {

    },
    methods: {
        RemoteAddTask() {
            var task = new TaskObj(document.getElementById("taskbox-new-input").value);
            ipc.send("remote-add", task);
            window.close();
        }
    },
    mounted() {
        document.getElementById("taskbox-new-input").focus();
    }
});