const actions = document.querySelectorAll(".action");

const penColor = document.querySelector("#pen-color");
const canvasColor = document.querySelector("#canvas-color");
const newButton = document.querySelector(".new");
const clearButton = document.querySelector(".clear");
const eraserToggle = document.querySelector(".eraser");

const canvas = document.querySelector(".canvas");

let currentCanvasSize = 16;
let drawingMode = false;

// Set active transition for action buttons
actions.forEach((action) => {
  action.addEventListener("click", activate);
  action.addEventListener("transitionend", deactivate);
});

canvasColor.addEventListener("change", setCanvasColor);
newButton.addEventListener("click", createNewCanvas);
clearButton.addEventListener("click", clearCanvas);
eraserToggle.addEventListener("click", toggleActive);

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
  let colorValue;
  if (eraserToggle.classList.contains("active")) {
    colorValue = "";
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
