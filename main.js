const buttonsContainer = document.querySelector('#buttons-container');
const display = document.querySelector('#display');

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const OPERATORS = ['/', 'x', '-', '+'];

const errorAudio = new Audio('./error.wav');

const backspaceButton = document.querySelector('#backspace-button');
let displayIsClear = true;
disableBackspaceButton();
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
    // allow to enter a zero after an operator  
    if (displayIsClear && event.target.textContent === '0') {
      display.textContent = '0';
      displayIsClear = false;
      display.dispatchEvent(displayFilled);
      return;
    }

    // prevent stacking leading zeroes
    if (display.textContent === '0' && event.target.textContent === '0') {
      return;
    } 
    
    if (display.textContent === '0' && event.target.textContent !== '0') {
      display.textContent = event.target.textContent === '.' ? '0.' : event.target.textContent;
      displayIsClear = false;
      enableBackspaceButton();
      return;
    }
    
    if (displayIsClear && event.target.textContent === '.') {
      display.dispatchEvent(displayFilled);
      display.textContent = '0.';
      displayIsClear = false;
      enableBackspaceButton();
      return;
    }
    
    if (displayIsClear) {
      display.dispatchEvent(displayFilled);
      display.textContent = event.target.textContent;
      displayIsClear = false;
      enableBackspaceButton();
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
      disableBackspaceButton();
      return;
    }

    if (event.target.textContent === '=') {
      storedNumber = null;
      currentOperator = null;
      displayIsClear = true;
      disableBackspaceButton();
      return;
    }
    
    storedNumber = numberOnDisplay;
    currentOperator = event.target.textContent;
    displayIsClear = true;
    disableBackspaceButton();
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
    disableBackspaceButton();
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
      disableBackspaceButton();
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
    enableBackspaceButton();
  }
  
  display.textContent = -display.textContent;
})


const percentButton = document.querySelector('#percent-button');
percentButton.addEventListener('click', (event) => {
  if (currentOperator) {
    displayIsClear = false;
    enableBackspaceButton();
  }

  if (currentOperator === '+' || currentOperator === '-') {
    display.textContent = decimalPrecision(storedNumber * display.textContent / 100);
  } else {
    display.textContent = decimalPrecision(display.textContent / 100);
  }
})

backspaceButton.addEventListener('click', (event) => {
  if (event.target.inactive) {
    errorAudio.play();
    return;
  }

  if (display.textContent.length === 1) {
    display.textContent = 0;
  } else {
    display.textContent = display.textContent.slice(0, -1);
  }
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

function disableBackspaceButton() {
  backspaceButton.inactive = true;
  backspaceButton.classList.add('action-inactive');
}

function enableBackspaceButton() {
  backspaceButton.inactive = false;
  backspaceButton.classList.remove('action-inactive');
}