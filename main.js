const buttonsContainer = document.querySelector('#buttons-container');
const display = document.querySelector('#display');

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const OPERATORS = ['/', 'x', '-', '+'];

let displayIsClear = true;
let storedNumber = 0;
let currentOperator;
let clickedButton;
let previousClickedButton;

let buttons = document.querySelectorAll('.button');
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    previousClickedButton = clickedButton;
    clickedButton = event.target;
  })
})

let numberButtons = document.querySelectorAll('.number-button');
numberButtons.forEach((button) => {
  console.log(button.id)
  button.addEventListener('click', (event) => {
    if (displayIsClear && event.target.textContent === '.') {
      display.textContent = '0.';
      displayIsClear = false;
      return;
    }
    
    if (displayIsClear) {
      display.textContent = event.target.textContent;
      displayIsClear = false;
      return;
    }
    
    if (event.target.textContent === '.' && display.textContent.includes('.')) {
      return;
    }
  
    

    display.textContent += event.target.textContent
  })
})

let operatorButtons = document.querySelectorAll('.operator-button');
operatorButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    let numberOnDisplay = +display.textContent;

    operatorButtons.forEach((operatorButton) => operatorButton.classList.remove('focused'));
    button.classList.add('focused');

    if (OPERATORS.includes(previousClickedButton.textContent)) {
      currentOperator = event.target.textContent;
      return;
    }

    if (currentOperator) {
      numberOnDisplay = calculate(currentOperator, storedNumber, numberOnDisplay);
    }
    

    display.textContent = numberOnDisplay;
    storedNumber = numberOnDisplay;
    currentOperator = event.target.textContent !== '=' ? event.target.textContent : null;
    displayIsClear = true;
  })
})


function clearDisplay() {
  display.textContent = 0;
  storedNumber = 0;
  displayIsClear = true;
  currentOperator = null;
}

function calculate(operator, operandOne, operandTwo) {
  switch (operator) {
    case '+':
      return operandOne + operandTwo;
      break;
    case '-':
      return operandOne - operandTwo;
      break;
    case 'x':
      return operandOne * operandTwo;
      break;
    case '/':
      return operandOne / operandTwo
      break;
    case '=':
      return operandOne
  }
}