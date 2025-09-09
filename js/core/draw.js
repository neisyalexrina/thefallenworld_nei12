// ========== DRAW (CSP style) ==========
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("draw-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;
  let brushColor = "#000000";
  let brushSize = 5;
  let tool = "brush";

  // Resize canvas
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Draw functions
  function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }

  function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : brushColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }

  function stopDraw() {
    drawing = false;
    ctx.closePath();
  }

  // Events
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);

  // Toolbar
  document.querySelectorAll(".tool-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tool = btn.dataset.tool;
    });
  });

  document.getElementById("color-picker").addEventListener("input", e => {
    brushColor = e.target.value;
    tool = "brush";
  });

  document.getElementById("brush-size").addEventListener("input", e => {
    brushSize = e.target.value;
  });

  document.getElementById("clear-btn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // Layers (basic)
  const layerList = document.getElementById("layer-list");
  let layerCount = 1;

  function addLayer() {
    const li = document.createElement("li");
    li.textContent = "Layer " + layerCount++;
    li.addEventListener("click", () => {
      document.querySelectorAll("#layer-list li").forEach(l => l.classList.remove("active"));
      li.classList.add("active");
    });
    layerList.prepend(li);
    li.click();
  }

  document.getElementById("add-layer-btn").addEventListener("click", addLayer);
  document.getElementById("delete-layer-btn").addEventListener("click", () => {
    const active = layerList.querySelector(".active");
    if (active) active.remove();
  });

  // Init first layer
  addLayer();
});
