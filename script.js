const canvas = document.querySelector("canvas");
context = canvas.getContext("2d");
const btns = document.querySelectorAll(".tool");
const fill = document.querySelector("#fill");
const brushSize = document.querySelector("#brush-size");
const colors = document.querySelectorAll("#colours .option");
const clearBoard = document.querySelector("#clear-board");
const savebtn = document.querySelector("#save-board");

let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let mouseStartPosX, mouseStartPosY, snapshot;
let selectedColor = "black";


window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  canvasDefaults();
});

const canvasDefaults = () => {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = selectedColor;
};

const startDraw = (e) => {
  isDrawing = true;
  context.beginPath();
  context.lineWidth = brushWidth;
  mouseStartPosX = e.offsetX;
  mouseStartPosY = e.offsetY;
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
  context.strokeStyle = selectedColor;
  context.fillStyle = selectedColor;
};

const drawRect = (e) => {
  if (fill.checked) {
    
    context.fillRect(
      e.offsetX,
      e.offsetY,
      mouseStartPosX - e.offsetX,
      mouseStartPosY - e.offsetY
    );
  } else {
    context.strokeRect(
      e.offsetX,
      e.offsetY,
      mouseStartPosX - e.offsetX,
      mouseStartPosY - e.offsetY
    );
  }
};

const drawCirc = (e) => {
  context.beginPath();
  let radius = Math.sqrt(
    Math.pow(mouseStartPosX - e.offsetX, 2) +
      Math.pow(mouseStartPosY - e.offsetY, 2)
  );
  context.arc(mouseStartPosX, mouseStartPosY, radius, 0, 2 * Math.PI);
  fill.checked ? context.fill() : context.stroke();
};

const drawTri = (e) => {
  context.beginPath();
  context.moveTo(mouseStartPosX, mouseStartPosY);
  context.lineTo(e.offsetX, e.offsetY);
  context.lineTo(mouseStartPosX * 2 - e.offsetX, e.offsetY);
  context.closePath();
  fill.checked ? context.fill() : context.stroke();
};

const applyColor = (e) => {

  if (context.isPointInPath(e.offsetX, e.offsetY)) {
    context.fillStyle = "red";
  }
};

const stopDrawing = () => {
  isDrawing = false;
};

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

colors.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("#colours .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = btn.id;
  });
});

const drawing = (e) => {
  if (isDrawing) {
    context.putImageData(snapshot, 0, 0);
    if (selectedTool == "brush" || selectedTool == "eraser") {
      context.strokeStyle = selectedTool == "eraser" ? "white" : selectedColor;
      context.lineTo(e.offsetX, e.offsetY);
      context.stroke();
    } else if (selectedTool == "rectangle") {
      drawRect(e);
    } else if (selectedTool == "circle") {
      drawCirc(e);
    } else if (selectedTool == "triangle") {
      drawTri(e);
    }
  }
};

brushSize.addEventListener("change", () => {
  brushWidth = brushSize.value;
});

clearBoard.addEventListener("click", () =>
  context.clearRect(0, 0, canvas.width, canvas.height)
);

savebtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  canvas.toDataURL();
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", drawing);

canvas.addEventListener("click", (e) => {
  applyColor(e);
});

document.getElementById("color-picker").addEventListener("change", (e) => {
  selectedColor = document.getElementById("color-picker").value;
});
