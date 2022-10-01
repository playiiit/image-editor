

// -------------------------------
// Section Navigation Action (Right Side Section Navigation Button)
// -------------------------------
function actionSecNavBtn() {
    const sec_nav_btn = ByQueryAll('.section-navigation-btn');
    const sec_nav_boxes = [ByID("project_meta_data_section"), ByID("main_meta_customize_section")];
    for (let i = 0; i < sec_nav_btn.length; i++) {

        sec_nav_btn[i].addEventListener("click", () => {
            if (i == 0) {
                ByID("customize_section_title").innerHTML = "Customize";
                sec_nav_btn[0].classList.add("section-navigation-btn-select");
                sec_nav_btn[1].classList.remove("section-navigation-btn-select");

                sec_nav_boxes[0].style.display = 'none';
                sec_nav_boxes[1].style.display = 'block';
            } else {
                ByID("customize_section_title").innerHTML = "Export";
                sec_nav_btn[1].classList.add("section-navigation-btn-select");
                sec_nav_btn[0].classList.remove("section-navigation-btn-select");

                sec_nav_boxes[0].style.display = 'block';
                sec_nav_boxes[1].style.display = 'none';
            }
        });
    }
}

actionSecNavBtn();