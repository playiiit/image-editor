// -------------------------------
// Loader Script
// -------------------------------
function AddLoader(id) {
    document.getElementById(id).innerHTML = getLoader();
}

function RemoveLoader(id, value) {
    ByID(id).innerHTML = value;
}

function Loader(TYPE) {
    const loader = getLoader();

    const generate_button = ByID("generate_button");
    const button_txt = createEle('p');
    button_txt.id = "generate-button-txt";
    button_txt.style.marginLeft = "-10px";
    button_txt.innerText = TYPE;

    return [loader, generate_button, button_txt];
}

function getLoader() {
    const loader = `<div class="spinner-border"></div>`;

    return loader;
}

function loadProgress(CURRENT, TOTAL) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            CURRENT++;
            const progress_bar = ByID('progress-bar');
            const progess_value = ByID('progress-bar-value');

            progress_bar.style.width = `${CURRENT / TOTAL * 100}%`;
            progess_value.innerText = CURRENT + " Completed";
            resolve();
        }, 0);
    });
}