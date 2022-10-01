const {ipcRenderer} = require("electron");
const ipc = ipcRenderer;
const fs = require("fs");

const close = ByID("close");
const mini = ByID("minimize");
const maximize = ByID("maximize");

close.addEventListener("click", function () {
    // Clear the save states
    ipc.send("closeApp");
});

mini.addEventListener("click", function () {
    ipc.send("minimizeApp");
});

maximize.addEventListener("click", function () {
    ipc.send("maximizeApp");
});

window.addEventListener("load", () => {
    // Clear the save states
});