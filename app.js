let currentFormat = "instagram";

let uploadedImg = null;
let imgX = 0, imgY = 0;
let isDragging = false;
let offsetX = 0, offsetY = 0;

let scale = 1;
let lastScale = 1;

function switchTab(format, cssFile) {
  currentFormat = format;
  document.getElementById("theme-style").href = cssFile;
  generate();
}

function getCanvasSize() {
  switch (currentFormat) {
    case "instagram": return { width: 1080, height: 1350 };
    case "a3": return { width: 2480, height: 3508 };
    case "story": return { width: 1080, height: 1920 };
  }
}

function generate() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const size = getCanvasSize();

  canvas.width = size.width;
  canvas.height = size.height;

  // IMAGE DE FOND (avec zoom)
  if (uploadedImg) {
    const w = uploadedImg.width * scale;
    const h = uploadedImg.height * scale;
    ctx.drawImage(uploadedImg, imgX, imgY, w, h);
  }

  // DÉGRADÉ JAUNE
  const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
  gradient.addColorStop(0, "rgba(255, 200, 0, 1)");
  gradient.addColorStop(1, "rgba(255, 200, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  // TEXTES
  const title = document.getElementById("titleInput").value;
  const subtitle = document.getElementById("subtitleInput").value;

  ctx.textAlign = "center";
  ctx.fillStyle = "#000";

  ctx.font = "800 120px Montserrat";
  ctx.fillText(title, canvas.width / 2, 150);

  ctx.font = "600 80px Montserrat";
  ctx.fillText(subtitle, canvas.width / 2, 260);

  // TEMPLATE
  const template = document.getElementById("templateSelect").value;
  ctx.font = "800 100px Montserrat";
  ctx.fillStyle = "#111";

  if (template === "resultats") {
    ctx.fillText("RÉSULTATS", canvas.width / 2, canvas.height - 150);
  } else if (template === "programme") {
    ctx.fillText("PROGRAMME", canvas.width / 2, canvas.height - 150);
  } else if (template === "nm2") {
    ctx.fillText("NM2", canvas.width / 2, canvas.height - 150);
  } else if (template === "info") {
    ctx.fillText("INFO", canvas.width / 2, canvas.height - 150);
  }
}

// UPLOAD IMAGE
document.getElementById("imageInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    uploadedImg = new Image();
    uploadedImg.onload = () => {
      const canvas = document.getElementById("canvas");
      const size = getCanvasSize();
      canvas.width = size.width;
      canvas.height = size.height;

      scale = 1;
      imgX = (canvas.width - uploadedImg.width * scale) / 2;
      imgY = (canvas.height - uploadedImg.height * scale) / 2;

      generate();
    };
    uploadedImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

const canvas = document.getElementById("canvas");

// DRAG & DROP
canvas.addEventListener("mousedown", e => {
  if (!uploadedImg) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const w = uploadedImg.width * scale;
  const h = uploadedImg.height * scale;

  if (x >= imgX && x <= imgX + w &&
      y >= imgY && y <= imgY + h) {
    isDragging = true;
    offsetX = x - imgX;
    offsetY = y - imgY;
  }
});

canvas.addEventListener("mousemove", e => {
  if (!isDragging) return;

  const rect = canvas.getBoundingClientRect();
  imgX = e.clientX - rect.left - offsetX;
  imgY = e.clientY - rect.top - offsetY;

  generate();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

// ZOOM MOLETTE (PC)
canvas.addEventListener("wheel", e => {
  if (!uploadedImg) return;

  e.preventDefault();

  const zoomIntensity = 0.001;
  scale += e.deltaY * -zoomIntensity;
  scale = Math.min(Math.max(0.2, scale), 5);

  generate();
}, { passive: false });

// PINCH-TO-ZOOM (MOBILE)
let touchStartDistance = 0;

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

canvas.addEventListener("touchstart", e => {
  if (e.touches.length === 2) {
    touchStartDistance = getDistance(e.touches);
    lastScale = scale;
  }
}, { passive: false });

canvas.addEventListener("touchmove", e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const newDistance = getDistance(e.touches);
    const pinchScale = newDistance / touchStartDistance;

    scale = Math.min(Math.max(0.2, lastScale * pinchScale), 5);

    generate();
  }
}, { passive: false });

// DOWNLOAD
function download() {
  const canvas = document.getElementById("canvas");
  const link = document.createElement("a");
  link.download = "visuel.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Génération initiale
generate();
