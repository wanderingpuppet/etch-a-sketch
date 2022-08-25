const actions = document.querySelectorAll(".action");
const toggles = document.querySelectorAll(".toggle");

const penColor = document.querySelector("#pen-color");
const canvasColor = document.querySelector("#canvas-color");
const newButton = document.querySelector(".new");
const clearButton = document.querySelector(".clear");
const eraserToggle = document.querySelector(".eraser");
const randomToggle = document.querySelector(".random");
const lightenToggle = document.querySelector(".lighten");
const darkenToggle = document.querySelector(".darken");

const canvas = document.querySelector(".canvas");

let currentCanvasSize = 16;
let drawingMode = false;

// Set active transition for action buttons
actions.forEach((action) => {
  action.addEventListener("click", activate);
  action.addEventListener("transitionend", deactivate);
});
toggles.forEach((toggle) => toggle.addEventListener("click", toggleActive));

canvasColor.addEventListener("change", setCanvasColor);
newButton.addEventListener("click", createNewCanvas);
clearButton.addEventListener("click", clearCanvas);

/*
  Start drawing after the mouse main button is pressed inside canvas and stop
  drawing after the button is released.
*/
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseover", colorCell);
window.addEventListener("mouseup", stopDrawing);

canvasColor.value = "#ffffff";
createCells(currentCanvasSize);

function colorCell(event) {
  if (!drawingMode) return;
  if (!event.target.classList.contains("cell")) return;

  // Get color for the cell
  const currCellColor = event.target.style.backgroundColor;
  const activeToggle = getActiveToggle();
  let colorValue;

  if (activeToggle === eraserToggle) {
    colorValue = "";
  } else if (activeToggle === randomToggle) {
    colorValue = getRandomColor();
  } else if (activeToggle === lightenToggle) {
    colorValue = currCellColor ? lightenRGB(currCellColor, 10) : "";
  } else if (activeToggle === darkenToggle) {
    colorValue = currCellColor ? darkenRGB(currCellColor, 10) : "";
  } else {
    colorValue = penColor.value;
  }

  event.target.style.backgroundColor = colorValue;
}

function startDrawing(event) {
  if (event.button != 0) return;
  if (!event.target.classList.contains("cell")) return;

  drawingMode = true;
  colorCell(event); // Immediately color the current cell
}

function stopDrawing(event) {
  if (event.button != 0) return;
  drawingMode = false;
}

function createNewCanvas() {
  const canvasSize = askCanvasSize();
  if (canvasSize === null) return;

  createCells(canvasSize);
  currentCanvasSize = canvasSize;
}

function clearCanvas() {
  const cells = canvas.querySelectorAll(".cell");
  for (const cell of cells) {
    cell.style.backgroundColor = "";
  }
}

function setCanvasColor() {
  canvas.style.backgroundColor = canvasColor.value;
}

function activate() {
  this.classList.add("active");
}

function deactivate() {
  this.classList.remove("active");
}

function toggleActive() {
  // Deactivate other previously activated toggle
  const activeToggle = getActiveToggle();
  if (activeToggle && activeToggle !== this) {
    activeToggle.classList.remove("active");
  }

  this.classList.toggle("active");
}

function askCanvasSize() {
  let canvasSize;

  // Keep asking until the user enters a valid value or cancels the prompt
  do {
    canvasSize = prompt(
      "Please enter the size of canvas (1-100)",
      currentCanvasSize
    );
    if (canvasSize === null) return null;
  } while (isNaN(canvasSize) || canvasSize < 1 || canvasSize > 100);

  return +canvasSize;
}

function createCells(canvasSize) {
  const cellSize = `${100 / canvasSize}%`;
  const cellCount = canvasSize * canvasSize;

  canvas.innerHTML = "";
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.width = cellSize;
    cell.draggable = false;
    canvas.appendChild(cell);
  }
}

function getActiveToggle() {
  return document.querySelector(".toggle.active");
}

function lightenRGB(rgbValue, increment) {
  let [r, g, b] = rgbValue.match(/\d+/g);
  r = addUpTo(+r, increment, 255);
  g = addUpTo(+g, increment, 255);
  b = addUpTo(+b, increment, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenRGB(rgbValue, decrement) {
  let [r, g, b] = rgbValue.match(/\d+/g);
  r = subtractDownTo(+r, decrement, 0);
  g = subtractDownTo(+g, decrement, 0);
  b = subtractDownTo(+b, decrement, 0);
  return `rgb(${r}, ${g}, ${b})`;
}

function getRandomColor() {
  const r = randInt(255);
  const g = randInt(255);
  const b = randInt(255);

  return `rgb(${r}, ${g}, ${b})`;
}

function randInt(n) {
  return Math.floor(Math.random() * (n + 1));
}

function addUpTo(a, b, max) {
  const result = a + b;
  return result > max ? max : result;
}

function subtractDownTo(a, b, min) {
  const result = a - b;
  return result < min ? min : result;
}
