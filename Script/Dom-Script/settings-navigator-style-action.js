const settings_navigate = ByQueryAll(".settings-navigation-menu-item");
const settings_boxes = [ByID("settings-account"), ByID("settings-security"), ByID("settings-appearance")];
let selected_item = 0;

for (let i = 0; i < settings_navigate.length; i++) {
    const data_number = settings_navigate[i].getAttribute('data');

    settings_navigate[i].addEventListener("click", () => {
        selected_item = i;
        if (i == data_number) {
            settings_boxes[i].style.display = "block";
            settings_navigate[i].classList.add("settings-navigation-menu-item-select");
        }
        unsetNavigate(i, settings_boxes[i].id);
    });
}

function unsetNavigate(VALUE, ELEMENT_ID) {
    for (let j = 0; j < settings_navigate.length; j++) {
        if (j != VALUE) {
            settings_boxes[j].style.display = "none";
            settings_navigate[j].classList.remove("settings-navigation-menu-item-select");
            for (let i = 0; i < ByQueryAll(".settings-navigate-icons-svg").length; i++) {
                if (ELEMENT_ID == ByQueryAll(".settings-navigate-icons-svg")[i].getAttribute('data')) {
                    ByQueryAll(".settings-navigate-icons-svg")[i].style.fill = "#ffffff";
                } else {
                    ByQueryAll(".settings-navigate-icons-svg")[i].style.fill = "var(--white)";
                }
            }
        }
    }
}