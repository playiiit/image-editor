// -------------------------------
// Style Script Field Focus/Blur
// -------------------------------
const field_box = ByQueryAll('.field-box');
const field = ByQueryAll('.field');

for (let i = 0; i < field.length; i++) {
    field[i].addEventListener('focus', function () {
        field_box[i].style.border = "1.5px solid var(--highlightBorder)";
    });
    field[i].addEventListener('blur', function () {
        field_box[i].style.border = "1.5px solid var(--border)";
    });
}

// -------------------------------
// Style Script Checkbox/Focus
// -------------------------------
const checkBoxes = ByQueryAll(".checkbox-input-op");
const checkBorder = ByQueryAll(".optional-data-check-box-holder");

if (checkBorder.length > 0) {
    for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].addEventListener('click', function () {
            if (checkBoxes[i].checked == true) {
                checkBorder[i].style.border = "1.5px solid var(--highlightBorder)";
            } else {
                checkBorder[i].style.border = "1.5px solid var(--border)";
            }
        });
    }
}

// ------------------------------------
// Quality input range changing event 
// ------------------------------------
const rangeInputs = document.querySelectorAll('input[type="range"]')
const numberInput = document.querySelector('input[type="number"]')

function handleInputChange(e) {
  let target = e.target
  if (e.target.type !== 'range') {
    target = document.getElementById('range')
  } 
  const min = target.min
  const max = target.max
  const val = target.value
  
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange)
})

numberInput.addEventListener('input', handleInputChange)