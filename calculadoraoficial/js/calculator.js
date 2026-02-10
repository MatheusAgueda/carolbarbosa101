(function () {
  'use strict';

  // ===== State =====
  const state = {
    currentValue: '0',
    previousValue: '',
    operator: null,
    waitingForOperand: false,
    expression: '',
    lastEquals: false,
  };

  // ===== DOM Elements =====
  const resultEl = document.getElementById('result');
  const expressionEl = document.getElementById('expression');
  const keysContainer = document.querySelector('.calculator__keys');

  // ===== Display Helpers =====
  function formatDisplay(value) {
    if (value === 'Error') return 'Error';

    const num = parseFloat(value);
    if (isNaN(num)) return '0';

    if (value.includes('.') && value.endsWith('.')) {
      return num.toLocaleString('pt-BR') + ',';
    }

    const trailingZeros = value.includes('.')
      ? value.length - value.indexOf('.') - 1
      : 0;

    if (value.includes('.') && value.endsWith('0')) {
      const parts = num.toLocaleString('pt-BR', {
        minimumFractionDigits: trailingZeros,
        maximumFractionDigits: trailingZeros,
      });
      return parts;
    }

    if (Number.isInteger(num) && !value.includes('.')) {
      return num.toLocaleString('pt-BR');
    }

    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: trailingZeros,
      maximumFractionDigits: 12,
    });
  }

  function updateDisplay() {
    resultEl.textContent = formatDisplay(state.currentValue);
    expressionEl.textContent = state.expression;

    if (resultEl.textContent.length > 12) {
      resultEl.classList.add('shrink');
    } else {
      resultEl.classList.remove('shrink');
    }
  }

  // ===== Calculation =====
  function calculate(a, b, op) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) return 'Error';

    let result;
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

    // Avoid floating-point display issues
    return parseFloat(result.toPrecision(12)).toString();
  }

  function getOperatorSymbol(op) {
    const symbols = {
      add: '+',
      subtract: '\u2212',
      multiply: '\u00D7',
      divide: '\u00F7',
    };
    return symbols[op] || '';
  }

  // ===== Highlight Active Operator =====
  function highlightOperator(action) {
    keysContainer.querySelectorAll('.key--operator').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.action === action);
    });
  }

  function clearOperatorHighlight() {
    keysContainer.querySelectorAll('.key--operator').forEach(function (btn) {
      btn.classList.remove('active');
    });
  }

  // ===== Input Handlers =====
  function inputDigit(digit) {
    if (state.lastEquals) {
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
      } else if (state.currentValue.length < 15) {
        state.currentValue += digit;
      }
    }
    clearOperatorHighlight();
  }

  function inputDecimal() {
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
      return;
    }

    if (!state.currentValue.includes('.')) {
      state.currentValue += '.';
    }
  }

  function handleOperator(nextOperator) {
    state.lastEquals = false;

    if (state.operator && !state.waitingForOperand) {
      var result = calculate(state.previousValue, state.currentValue, state.operator);
      state.currentValue = result;
      state.expression =
        formatDisplay(result) + ' ' + getOperatorSymbol(nextOperator);
      state.previousValue = result;
    } else {
      state.previousValue = state.currentValue;
      state.expression =
        formatDisplay(state.currentValue) + ' ' + getOperatorSymbol(nextOperator);
    }

    state.operator = nextOperator;
    state.waitingForOperand = true;
    highlightOperator(nextOperator);
  }

  function handleEquals() {
    if (!state.operator || state.waitingForOperand) return;

    var result = calculate(state.previousValue, state.currentValue, state.operator);

    state.expression =
      formatDisplay(state.previousValue) +
      ' ' +
      getOperatorSymbol(state.operator) +
      ' ' +
      formatDisplay(state.currentValue) +
      ' =';

    state.currentValue = result;
    state.previousValue = '';
    state.operator = null;
    state.waitingForOperand = false;
    state.lastEquals = true;
    clearOperatorHighlight();
  }

  function handleClear() {
    state.currentValue = '0';
    state.previousValue = '';
    state.operator = null;
    state.waitingForOperand = false;
    state.expression = '';
    state.lastEquals = false;
    clearOperatorHighlight();
  }

  function handleBackspace() {
    if (state.lastEquals || state.waitingForOperand) return;

    if (state.currentValue.length > 1) {
      state.currentValue = state.currentValue.slice(0, -1);
    } else {
      state.currentValue = '0';
    }
  }

  function handlePercent() {
    var num = parseFloat(state.currentValue);
    if (isNaN(num)) return;

    if (state.operator && state.previousValue) {
      // Percentage of the previous value (e.g. 200 + 10% = 200 + 20)
      var base = parseFloat(state.previousValue);
      state.currentValue = ((base * num) / 100).toString();
    } else {
      state.currentValue = (num / 100).toString();
    }
    state.lastEquals = false;
  }

  // ===== Event Delegation =====
  keysContainer.addEventListener('click', function (e) {
    var key = e.target.closest('.key');
    if (!key) return;

    var action = key.dataset.action;
    var value = key.dataset.value;

    if (value !== undefined) {
      inputDigit(value);
    } else if (action) {
      switch (action) {
        case 'clear':
          handleClear();
          break;
        case 'backspace':
          handleBackspace();
          break;
        case 'percent':
          handlePercent();
          break;
        case 'decimal':
          inputDecimal();
          break;
        case 'equals':
          handleEquals();
          break;
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

  // ===== Keyboard Support =====
  document.addEventListener('keydown', function (e) {
    var key = e.key;

    if (key >= '0' && key <= '9') {
      inputDigit(key);
    } else if (key === '.' || key === ',') {
      inputDecimal();
    } else if (key === '+') {
      handleOperator('add');
    } else if (key === '-') {
      handleOperator('subtract');
    } else if (key === '*') {
      handleOperator('multiply');
    } else if (key === '/') {
      e.preventDefault();
      handleOperator('divide');
    } else if (key === '%') {
      handlePercent();
    } else if (key === 'Enter' || key === '=') {
      handleEquals();
    } else if (key === 'Backspace') {
      handleBackspace();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      handleClear();
    } else {
      return;
    }

    updateDisplay();
  });

  // ===== Initial Render =====
  updateDisplay();
})();
