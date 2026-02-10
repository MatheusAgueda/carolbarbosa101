(function () {
  'use strict';

  /* ========================================
   *  STATE
   * ======================================== */
  var state = {
    currentValue: '0',
    previousValue: '',
    operator: null,
    waitingForOperand: false,
    expression: '',
    lastEquals: false,
    lastOperand: '',
    lastOperator: null
  };

  /* ========================================
   *  DOM REFERENCES
   * ======================================== */
  var resultEl = document.getElementById('result');
  var expressionEl = document.getElementById('expression');
  var keysContainer = document.getElementById('keys');

  /* ========================================
   *  NUMBER FORMATTING (pt-BR)
   * ======================================== */
  function formatNumber(value) {
    if (value === 'Error') return 'Erro';
    if (value === '' || value === undefined || value === null) return '0';

    var str = String(value);
    var num = parseFloat(str);
    if (isNaN(num)) return '0';

    // Handle numbers being typed (preserve trailing dot and zeros)
    if (str.indexOf('.') !== -1 && str.charAt(str.length - 1) === '.') {
      return formatInteger(str.slice(0, -1)) + ',';
    }

    if (str.indexOf('.') !== -1) {
      var parts = str.split('.');
      var intPart = parts[0];
      var decPart = parts[1];
      return formatInteger(intPart) + ',' + decPart;
    }

    return formatInteger(str);
  }

  function formatInteger(str) {
    var isNeg = str.charAt(0) === '-';
    var digits = isNeg ? str.slice(1) : str;
    var result = '';
    var count = 0;
    for (var i = digits.length - 1; i >= 0; i--) {
      if (count > 0 && count % 3 === 0) {
        result = '.' + result;
      }
      result = digits.charAt(i) + result;
      count++;
    }
    return isNeg ? '-' + result : result;
  }

  /* ========================================
   *  DISPLAY UPDATE
   * ======================================== */
  function updateDisplay() {
    var displayText = formatNumber(state.currentValue);
    resultEl.textContent = displayText;
    expressionEl.textContent = state.expression;

    // Shrink text for long results
    if (displayText.length > 13) {
      resultEl.classList.add('shrink');
    } else {
      resultEl.classList.remove('shrink');
    }

    // Error styling
    if (state.currentValue === 'Error') {
      resultEl.classList.add('error');
    } else {
      resultEl.classList.remove('error');
    }
  }

  /* ========================================
   *  CALCULATION ENGINE
   * ======================================== */
  function calculate(a, b, op) {
    var numA = parseFloat(a);
    var numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) return 'Error';

    var result;
    switch (op) {
      case 'add':
        result = numA + numB;
        break;
      case 'subtract':
        result = numA - numB;
        break;
      case 'multiply':
        result = numA * numB;
        break;
      case 'divide':
        if (numB === 0) return 'Error';
        result = numA / numB;
        break;
      default:
        return 'Error';
    }

    // Fix floating-point precision (e.g. 0.1 + 0.2)
    return parseFloat(result.toPrecision(12)).toString();
  }

  function getSymbol(op) {
    var map = {
      add: '+',
      subtract: '\u2212',
      multiply: '\u00D7',
      divide: '\u00F7'
    };
    return map[op] || '';
  }

  /* ========================================
   *  OPERATOR HIGHLIGHT
   * ======================================== */
  function setActiveOperator(action) {
    var buttons = keysContainer.querySelectorAll('.key--operator');
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute('data-action') === action) {
        buttons[i].classList.add('active');
      } else {
        buttons[i].classList.remove('active');
      }
    }
  }

  function clearActiveOperator() {
    var buttons = keysContainer.querySelectorAll('.key--operator');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active');
    }
  }

  /* ========================================
   *  INPUT: DIGIT
   * ======================================== */
  function inputDigit(digit) {
    if (state.currentValue === 'Error') {
      handleClear();
    }

    if (state.lastEquals) {
      // Start a brand new calculation
      state.currentValue = digit;
      state.expression = '';
      state.previousValue = '';
      state.operator = null;
      state.lastEquals = false;
    } else if (state.waitingForOperand) {
      state.currentValue = digit;
      state.waitingForOperand = false;
    } else {
      if (state.currentValue === '0') {
        state.currentValue = digit;
      } else if (state.currentValue === '-0') {
        state.currentValue = '-' + digit;
      } else if (state.currentValue.replace(/[^0-9]/g, '').length < 15) {
        state.currentValue += digit;
      }
    }
    clearActiveOperator();
  }

  /* ========================================
   *  INPUT: DECIMAL
   * ======================================== */
  function inputDecimal() {
    if (state.currentValue === 'Error') {
      handleClear();
    }

    if (state.lastEquals) {
      state.currentValue = '0.';
      state.expression = '';
      state.previousValue = '';
      state.operator = null;
      state.lastEquals = false;
      return;
    }

    if (state.waitingForOperand) {
      state.currentValue = '0.';
      state.waitingForOperand = false;
      clearActiveOperator();
      return;
    }

    if (state.currentValue.indexOf('.') === -1) {
      state.currentValue += '.';
    }
    clearActiveOperator();
  }

  /* ========================================
   *  OPERATOR
   * ======================================== */
  function handleOperator(nextOp) {
    if (state.currentValue === 'Error') {
      handleClear();
    }

    state.lastEquals = false;

    var currentNum = state.currentValue;

    if (state.operator && !state.waitingForOperand) {
      // Chain calculation: e.g. 5 + 3 * ...
      var result = calculate(state.previousValue, currentNum, state.operator);
      if (result === 'Error') {
        state.currentValue = 'Error';
        state.expression = '';
        state.previousValue = '';
        state.operator = null;
        updateDisplay();
        return;
      }
      state.currentValue = result;
      state.previousValue = result;
      state.expression = formatNumber(result) + ' ' + getSymbol(nextOp);
    } else {
      state.previousValue = currentNum;
      state.expression = formatNumber(currentNum) + ' ' + getSymbol(nextOp);
    }

    state.operator = nextOp;
    state.waitingForOperand = true;
    setActiveOperator(nextOp);
  }

  /* ========================================
   *  EQUALS
   * ======================================== */
  function handleEquals() {
    if (state.currentValue === 'Error') {
      handleClear();
      return;
    }

    // Repeat last operation (e.g. press = = = to keep adding)
    if (state.lastEquals && state.lastOperator) {
      var repeatResult = calculate(state.currentValue, state.lastOperand, state.lastOperator);
      state.expression =
        formatNumber(state.currentValue) +
        ' ' + getSymbol(state.lastOperator) +
        ' ' + formatNumber(state.lastOperand) +
        ' =';
      state.currentValue = repeatResult;
      clearActiveOperator();
      updateDisplay();
      return;
    }

    if (!state.operator || state.waitingForOperand) return;

    var operand = state.currentValue;
    var result = calculate(state.previousValue, operand, state.operator);

    state.expression =
      formatNumber(state.previousValue) +
      ' ' + getSymbol(state.operator) +
      ' ' + formatNumber(operand) +
      ' =';

    // Save for repeat
    state.lastOperand = operand;
    state.lastOperator = state.operator;

    state.currentValue = result;
    state.previousValue = '';
    state.operator = null;
    state.waitingForOperand = false;
    state.lastEquals = true;
    clearActiveOperator();
  }

  /* ========================================
   *  CLEAR (AC)
   * ======================================== */
  function handleClear() {
    state.currentValue = '0';
    state.previousValue = '';
    state.operator = null;
    state.waitingForOperand = false;
    state.expression = '';
    state.lastEquals = false;
    state.lastOperand = '';
    state.lastOperator = null;
    clearActiveOperator();
  }

  /* ========================================
   *  BACKSPACE
   * ======================================== */
  function handleBackspace() {
    if (state.currentValue === 'Error') {
      handleClear();
      return;
    }
    if (state.lastEquals || state.waitingForOperand) return;

    if (state.currentValue.length > 1) {
      // Handle negative single digit: -5 -> 0
      if (state.currentValue.length === 2 && state.currentValue.charAt(0) === '-') {
        state.currentValue = '0';
      } else {
        state.currentValue = state.currentValue.slice(0, -1);
      }
    } else {
      state.currentValue = '0';
    }
  }

  /* ========================================
   *  PERCENTAGE
   * ======================================== */
  function handlePercent() {
    if (state.currentValue === 'Error') return;

    var num = parseFloat(state.currentValue);
    if (isNaN(num)) return;

    if (state.operator && state.previousValue !== '') {
      // Context-aware: 200 + 10% means 200 + (200 * 10 / 100) = 220
      var base = parseFloat(state.previousValue);
      var percentValue = (base * num) / 100;
      state.currentValue = parseFloat(percentValue.toPrecision(12)).toString();
    } else {
      // Simple: 50% = 0.5
      state.currentValue = parseFloat((num / 100).toPrecision(12)).toString();
      state.lastEquals = false;
    }
    clearActiveOperator();
  }

  /* ========================================
   *  TOGGLE SIGN (+/-)
   * ======================================== */
  function handleToggleSign() {
    if (state.currentValue === 'Error') return;
    if (state.currentValue === '0') return;

    if (state.currentValue.charAt(0) === '-') {
      state.currentValue = state.currentValue.slice(1);
    } else {
      state.currentValue = '-' + state.currentValue;
    }
  }

  /* ========================================
   *  BUTTON PRESS VISUAL FEEDBACK
   * ======================================== */
  function flashKey(button) {
    button.classList.remove('pressed');
    // Force reflow for re-trigger
    void button.offsetWidth;
    button.classList.add('pressed');
    setTimeout(function () {
      button.classList.remove('pressed');
    }, 250);
  }

  /* ========================================
   *  EVENT: CLICK
   * ======================================== */
  keysContainer.addEventListener('click', function (e) {
    var key = e.target.closest('.key');
    if (!key) return;

    flashKey(key);

    var action = key.getAttribute('data-action');
    var value = key.getAttribute('data-value');

    if (value !== null) {
      inputDigit(value);
    } else if (action) {
      switch (action) {
        case 'clear':       handleClear(); break;
        case 'backspace':   handleBackspace(); break;
        case 'percent':     handlePercent(); break;
        case 'toggle-sign': handleToggleSign(); break;
        case 'decimal':     inputDecimal(); break;
        case 'equals':      handleEquals(); break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          handleOperator(action);
          break;
      }
    }

    updateDisplay();
  });

  /* ========================================
   *  EVENT: KEYBOARD
   * ======================================== */
  function findKeyButton(dataAction, dataValue) {
    if (dataValue !== undefined) {
      return keysContainer.querySelector('[data-value="' + dataValue + '"]');
    }
    return keysContainer.querySelector('[data-action="' + dataAction + '"]');
  }

  document.addEventListener('keydown', function (e) {
    var key = e.key;
    var btn = null;

    if (key >= '0' && key <= '9') {
      inputDigit(key);
      btn = findKeyButton(null, key);
    } else if (key === '.' || key === ',') {
      inputDecimal();
      btn = findKeyButton('decimal');
    } else if (key === '+') {
      handleOperator('add');
      btn = findKeyButton('add');
    } else if (key === '-') {
      handleOperator('subtract');
      btn = findKeyButton('subtract');
    } else if (key === '*') {
      handleOperator('multiply');
      btn = findKeyButton('multiply');
    } else if (key === '/') {
      e.preventDefault();
      handleOperator('divide');
      btn = findKeyButton('divide');
    } else if (key === '%') {
      handlePercent();
      btn = findKeyButton('percent');
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleEquals();
      btn = findKeyButton('equals');
    } else if (key === 'Backspace') {
      handleBackspace();
    } else if (key === 'Escape') {
      handleClear();
      btn = findKeyButton('clear');
    } else {
      return; // Ignore other keys
    }

    if (btn) flashKey(btn);
    updateDisplay();
  });

  /* ========================================
   *  INITIAL RENDER
   * ======================================== */
  updateDisplay();

})();
