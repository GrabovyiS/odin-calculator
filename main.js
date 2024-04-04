const buttonsContainer = document.querySelector('#buttons-container');
const display = document.querySelector('#display');

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const OPERATORS = ['/', 'x', '*', '-', '+'];

const errorAudio = new Audio('./error.wav');

const backspaceButton = document.querySelector('#backspace-button');
let displayIsClear = true;
disableBackspaceButton();
let storedNumber = null;
let currentOperator;
let clickedButton;
let previousClickedButton;
let justClearedDisplay;

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
      display.dispatchEvent(displayFilled);
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
      storedNumber = +display.textContent;
      currentOperator = event.target.textContent;
      display.dispatchEvent(displayFilled);
      return;
    }
    
    if (currentOperator) {
      display.textContent = calculate(currentOperator, storedNumber, +display.textContent);
    }
    
    if (display.textContent === 'Error') {
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
      display.dispatchEvent(displayCleared);
      return;
    }
    
    storedNumber = +display.textContent;
    currentOperator = event.target.textContent;
    displayIsClear = true;
    disableBackspaceButton();
  })
})

const displayFilled = new Event("displayFilled");
const displayCleared = new Event("displayCleared");

const clearButton = document.querySelector('#clear-button');
clearButton.addEventListener('click', (event) => {
  if (event.target.textContent === 'AC') {
    display.textContent = '0';
    storedNumber = 0;
    displayIsClear = true;
    disableBackspaceButton();
    currentOperator = null;
    document.querySelectorAll('.operator-button').forEach((operatorButton) => operatorButton.classList.remove('focused'));
    display.dispatchEvent(displayCleared);
    return;
  }
  
  if (event.target.textContent === 'C') {
    // On the first number or after =
    if ((!displayIsClear && !currentOperator) || (displayIsClear && !currentOperator)) {
      display.textContent = '0';
      displayIsClear = true;
      display.dispatchEvent(displayCleared);
      disableBackspaceButton();
    }
    
    // Right after pressing an operator
    if (displayIsClear && currentOperator) {
      if (justClearedDisplay) {
        displayIsClear = false;
        justClearedDisplay = false;
        display.textContent = storedNumber;
        display.dispatchEvent(displayCleared);
      } else {
        displayIsClear = false;
      }

      enableBackspaceButton();
      currentOperator = null;
      operatorButtons.forEach((operatorButton) => operatorButton.classList.remove('focused'));
      return;
    }
    
    // After pressing an operator and typing a new number
    if (!displayIsClear && currentOperator) {
      justClearedDisplay = true;
      display.textContent = '0';
      displayIsClear = true;
      disableBackspaceButton();
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
});


numberButtons.forEach((numberButton) => {
  numberButton.addEventListener('mousedown', (event) => {
    event.target.classList.add('number-pressed');
  });

  numberButton.addEventListener('mouseup', (event) => {
    event.target.classList.remove('number-pressed');
  });
});

operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener('mousedown', (event) => {
    event.target.classList.add('operator-pressed');
  });

  operatorButton.addEventListener('mouseup', (event) => {
    event.target.classList.remove('operator-pressed');
  });
});

const actionButtons = [clearButton, signButton, percentButton, backspaceButton];
actionButtons.forEach((actionButton) => {
  actionButton.addEventListener('mousedown', (event) => {
    event.target.classList.add('action-pressed');
  });

  actionButton.addEventListener('mouseup', (event) => {
    event.target.classList.remove('action-pressed');
  });
});

const body = document.querySelector('body');
const artificialClickEvent = new Event('click');
const buttonsTextContents = [...buttons].map((button) => (button.textContent));

body.addEventListener('keydown', (event) => {
  document.activeElement.blur();

  let keyPressed = event.key;
  if (keyPressed === '*') {
    keyPressed = 'x';
  }

  let correspondingButton = getCorrespondingButton(keyPressed);

  if (correspondingButton) {
    correspondingButton.dispatchEvent(artificialClickEvent);

    if (correspondingButton.classList.contains('number-button')) {
      correspondingButton.classList.add('number-pressed');
    }
    else if (correspondingButton.classList.contains('operator-button')) {
      correspondingButton.classList.add('operator-pressed');
    }
    else if (correspondingButton.classList.contains('action-button')) {
      correspondingButton.classList.add('action-pressed');
    }
  }
})

body.addEventListener('keyup', (event) => {
  let keyPressed = event.key;
  if (keyPressed === '*') {
    keyPressed = 'x';
  }

  let correspondingButton = getCorrespondingButton(keyPressed);

  if (correspondingButton) {
    if (correspondingButton.classList.contains('number-button')) {
      correspondingButton.classList.remove('number-pressed');
    }
    else if (correspondingButton.classList.contains('operator-button')) {
      correspondingButton.classList.remove('operator-pressed');
    }
    else if (correspondingButton.classList.contains('action-button')) {
      correspondingButton.classList.remove('action-pressed');
    }
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

function getCorrespondingButton(keyPressed) {
  let correspondingButton = null;

  if (buttonsTextContents.includes(keyPressed)) {
    correspondingButton = [...buttons].find((button) => (button.textContent === keyPressed));
  }

  switch (keyPressed) {
    case 'Backspace':
      correspondingButton = document.querySelector('#backspace-button');
      break;
    
    case 'Escape':
      correspondingButton = document.querySelector('#clear-button');
      break;

    case 'Enter':
      correspondingButton = document.querySelector('#equals-button');
      break;

    case '=':
      correspondingButton = document.querySelector('#equals-button');
      break;
  }

  return correspondingButton;
}