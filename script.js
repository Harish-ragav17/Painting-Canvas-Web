const canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
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
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

const startDraw = (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  mouseStartPosX = e.offsetX;
  mouseStartPosY = e.offsetY;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
};

const drawRect = (e) => {
  if (fill.checked) {
    ctx.fillRect(
      e.offsetX,
      e.offsetY,
      mouseStartPosX - e.offsetX,
      mouseStartPosY - e.offsetY
    );
  } else {
    ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      mouseStartPosX - e.offsetX,
      mouseStartPosY - e.offsetY
    );
  }
};

const drawCirc = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(mouseStartPosX - e.offsetX, 2) +
      Math.pow(mouseStartPosY - e.offsetY, 2)
  );
  ctx.arc(mouseStartPosX, mouseStartPosY, radius, 0, 2 * Math.PI);
  fill.checked ? ctx.fill() : ctx.stroke();
};

const drawTri = (e) => {
  ctx.beginPath();
  ctx.moveTo(mouseStartPosX, mouseStartPosY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(mouseStartPosX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fill.checked ? ctx.fill() : ctx.stroke();
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
    document.querySelector("#colours .selected").classList.remove("selected")
    btn.classList.add("selected");
    selectedColor = btn.id;
  });
});

const drawing = (e) => {
  if (isDrawing) {
    ctx.putImageData(snapshot, 0, 0);
    if (selectedTool == "brush" || selectedTool == "eraser") {
      ctx.strokeStyle = selectedTool == "eraser" ? "white" : selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
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
  ctx.clearRect(0, 0, canvas.width, canvas.height)
);

savebtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", drawing);
