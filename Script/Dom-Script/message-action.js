// -------------------------------
// Message Box Action Process
// -------------------------------
function Message(MSG, TYPE) {
    // Variables
    var ICON = null;
    var TITLE = null;
    let TIME = 10000;
    const PATH = "./Assets/";

    // Check Message Type (Error/Success)
    if (TYPE == 0) {
        ICON = PATH + "Error-Message-Icon.svg";
        TITLE = "Error";
        TIME = 10000;
        setMSGBackground("var(--error)");
    } else {
        ICON = PATH + "Success-Message-Icon.svg";
        TITLE = "Success";
        setMSGBackground("var(--success)");
    }

    // Set Temp to Message Box
    ByID("box-message-icon").src = ICON;
    ByID("box-message-title").innerText = TITLE;
    ByID("box-message").innerText = MSG;

    // Trigger The Message Box (View Hide Message Box)
    ByID("message-box").classList = "message-box animation-view";
    setTimeout(function () {
        ByID("message-box").classList = "message-box animation-hide";
    }, TIME)
}

// -------------------------------
// Message Boc Background Set
// -------------------------------
function setMSGBackground(COLOR) {
    ByQuery(".message-box-inner").style.backgroundColor = COLOR;
}
