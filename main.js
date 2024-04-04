const buttonsContainer = document.querySelector('#buttons-container');
const display = document.querySelector('#display');

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const OPERATORS = ['/', 'x', '-', '+'];

let displayIsClear = true;
let storedNumber = null;
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
  button.addEventListener('click', (event) => {
    if (displayIsClear && event.target.textContent === '0') {
      return;
    }
    
    if (displayIsClear && event.target.textContent === '.') {
      display.dispatchEvent(displayFilled);
      display.textContent = '0.';
      displayIsClear = false;
      return;
    }
    
    if (displayIsClear) {
      display.dispatchEvent(displayFilled);
      display.textContent = event.target.textContent;
      displayIsClear = false;
      return;
    }
    
    if (event.target.textContent === '.' && display.textContent.includes('.')) {
      return;
    }
    
    display.textContent += event.target.textContent;
  })
})

let operatorButtons = document.querySelectorAll('.operator-button');
operatorButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    if (display.textContent === 'Error') {
      return;
    }

    operatorButtons.forEach((operatorButton) => operatorButton.classList.remove('focused'));
    if (button.textContent !== '=') {
      button.classList.add('focused');
    }
    
    if (OPERATORS.includes(previousClickedButton?.textContent) || displayIsClear) {
      currentOperator = event.target.textContent;
      return;
    }
    
    let numberOnDisplay = +display.textContent;

    if (currentOperator) {
      numberOnDisplay = calculate(currentOperator, storedNumber, numberOnDisplay);
      display.textContent = numberOnDisplay;
    }
    
    if (numberOnDisplay === 'Error') {
      currentOperator = null;
      storedNumber = null;
      displayIsClear = true;
      return;
    }

    if (event.target.textContent === '=') {
      storedNumber = null;
      currentOperator = null;
      displayIsClear = true;
      return;
    }
    
    storedNumber = numberOnDisplay;
    currentOperator = event.target.textContent;
    displayIsClear = true;
  })
})

const displayFilled = new Event("displayFilled");
const displayCleared = new Event("displayCleared");

const clearButton = document.querySelector('#c-button');
clearButton.addEventListener('click', (event) => {
  if (event.target.textContent === 'AC') {
    display.textContent = 0;
    storedNumber = 0;
    displayIsClear = true;
    currentOperator = null;
    document.querySelectorAll('.operator-button').forEach((operatorButton) => operatorButton.classList.remove('focused'));
    display.dispatchEvent(displayCleared);
  } else if (event.target.textContent === 'C') {
    if (displayIsClear && currentOperator) {
      currentOperator = null;
      operatorButtons.forEach((operatorButton) => operatorButton.classList.remove('focused'));
    } else {
      display.textContent = 0;
      displayIsClear = true;
      display.dispatchEvent(displayCleared);
    }
  }

})

display.addEventListener('displayFilled', () => {
  clearButton.textContent = 'C';

})

display.addEventListener('displayCleared', () => {
  clearButton.textContent = 'AC';
})


const signButton = document.querySelector('#sign-button');
signButton.addEventListener('click', () => {
  if (currentOperator) {
    displayIsClear = false;
  }

  display.textContent = -display.textContent;
})

function calculate(operator, operandOne, operandTwo) {
  switch (operator) {
    case '+':
      return decimalPrecision(operandOne + operandTwo);
      break;
    case '-':
      return decimalPrecision(operandOne - operandTwo);
      break;
    case 'x':
      return decimalPrecision(operandOne * operandTwo);
      break;
    case '/':
      if (operandTwo === 0) {
        operatorButtons.forEach((operatorButton) => operatorButton.classList.remove('focused'));
        currentOperator = null;
        return 'Error';
      }
      return decimalPrecision(operandOne / operandTwo);
      break;
    case '=':
      return operandOne;
      break;
  }
}

function decimalPrecision(number) {
  return Number(number.toFixed(6));
}