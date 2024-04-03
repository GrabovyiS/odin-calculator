const buttonsContainer = document.querySelector('#buttons-container');
const display = document.querySelector('#display');

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const OPERATORS = ['÷', '×', '-', '+'];

let numberOnDisplay = 0;
let displayIsClear = true;
let storedNumber;
let currentOperator;

let numberButtons = document.querySelectorAll('.number-button');
numberButtons.forEach((button) => {
  console.log(button.id)
  button.addEventListener('click', (event) => {
    if (displayIsClear) {
      display.textContent = event.target.textContent;
      displayIsClear = false;
    } else {
      display.textContent += event.target.textContent
    }
  })
})

let operatorButtons = document.querySelectorAll('.operator-button');
operatorButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    displayIsClear = true;
  })
})

function clear() {
  display.textContent = 0;
  numberOnDisplay = 0;
  displayIsClear = true;
  currentOperator = null;
}