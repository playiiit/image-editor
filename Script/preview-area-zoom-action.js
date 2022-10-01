const getArtBoard = ByID("preview-area");
let count = 1;

window.addEventListener("wheel", function (event) {
    if (event.ctrlKey && event.deltaY < 0) {
        zoomIn();
    }
    if (event.ctrlKey && event.deltaY >= 0) {
        zoomOut();
    }
});

function zoomIn() {
    count += 0.1;
    getArtBoard.style.transform = "scale(" + count + ")";
}

function zoomOut() {
    if (count > 0.2) {
        count -= 0.1;
    }
    getArtBoard.style.transform = "scale(" + count + ")";
}