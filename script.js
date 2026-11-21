const display = document.getElementById("display");
const keys = document.querySelector(".keys");
let expression = "0";
let justCalculated = false;

function updateDisplay() {
  display.value = expression;
}

function appendValue(value) {
  if (justCalculated) {
    expression = "0";
    justCalculated = false;
  }

  if (value === "%") {
    if (expression !== "0") {
      expression = String(Number(expression) / 100);
    }
  } else if (["+", "-", "*", "/"].includes(value)) {
    if (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
  } else if (value === ".") {
    const currentNumber = expression.split(/[+\-*/]/).pop();
    if (!currentNumber.includes(".")) {
      expression += ".";
    }
  } else {
    if (expression === "0") {
      expression = value;
    } else {
      expression += value;
    }
  }

  updateDisplay();
}

function calculate() {
  if (!expression || /[+\-*/]$/.test(expression)) {
    return;
  }

  try {
    if (!/^[0-9+\-*/.%\s]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }

    const result = Function(`"use strict"; return (${expression.replace(/%/g, "/100")})`)();
    if (!Number.isFinite(result)) {
      throw new Error("Cannot calculate");
    }

    expression = String(Number.parseFloat(result.toFixed(10)));
    justCalculated = true;
  } catch {
    expression = "Error";
  }

  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const key = event.target.closest("button");
  if (!key) return;

  const action = key.dataset.action;
  const value = key.dataset.value;

  if (action === "clear") {
    expression = "0";
    justCalculated = false;
  } else if (action === "backspace") {
    if (justCalculated || expression === "Error") {
      expression = "0";
      justCalculated = false;
    } else {
      expression = expression.slice(0, -1) || "0";
    }
  } else if (action === "calculate") {
    calculate();
  } else if (value) {
    appendValue(value);
  }

  if (!action) {
    updateDisplay();
  } else if (action !== "calculate") {
    updateDisplay();
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key) || ["+", "-", "*", "/", ".", "%"].includes(event.key)) {
    appendValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    calculate();
  } else if (event.key === "Backspace") {
    expression = expression.slice(0, -1) || "0";
    updateDisplay();
  } else if (event.key === "Escape") {
    expression = "0";
    justCalculated = false;
    updateDisplay();
  }
});
