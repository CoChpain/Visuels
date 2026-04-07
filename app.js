let currentFormat = "instagram";

let uploadedImg = null;
let imgX = 0, imgY = 0;
let isDragging = false;
let offsetX = 0, offsetY = 0;

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

  // --- IMAGE DE FOND ---
  if (uploadedImg) {
    ctx.drawImage(uploadedImg, imgX, imgY);
  }

  // --- DÉGRADÉ JAUNE ---
  const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
  gradient.addColorStop(0, "rgba(255, 200, 0, 1)");
  gradient.addColorStop(1, "rgba(255, 200, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  // --- TEXTE ---
  const title = document.getElementById("titleInput").value;
  const subtitle = document.getElementById("subtitleInput").value;

  ctx.textAlign = "center";
  ctx.fillStyle = "#000";

  // Titre (gros)
  ctx.font = "800 120px Montserrat";
  ctx.fillText(title, canvas.width / 2, 150);

  // Sous‑titre (plus petit)
  ctx.font = "600 80px Montserrat";
  ctx.fillText(subtitle, canvas.width / 2, 260);

  // --- TEMPLATE (résultats, programme, etc.) ---
  const template = document.getElementById("templateSelect").value;

  ctx.font = "800 100px Montserrat";
  ctx.fillStyle = "#111";

  if (template === "resultats") {
    ctx.fillText("RÉSULTATS", canvas.width / 2, canvas.height - 150);
  }
  if (template === "programme") {
    ctx.fillText("PROGRAMME", canvas.width / 2, canvas.height - 150);
  }
  if (template === "nm2") {
    ctx.fillText("NM2", canvas.width / 2, canvas.height - 150);
  }
  if (template === "info") {
    ctx.fillText("INFO", canvas.width / 2, canvas.height - 150);
  }
}

// --- UPLOAD IMAGE ---
document.getElementById("imageInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    uploadedImg = new Image();
    uploadedImg.onload = () => {
      const canvas = document.getElementById("canvas");
      imgX = (canvas.width - uploadedImg.width) / 2;
      imgY = (canvas.height - uploadedImg.height) / 2;
      generate();
    };
    uploadedImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// --- DRAG & DROP IMAGE ---
const canvas = document.getElementById("canvas");

canvas.addEventListener("mousedown", e => {
  if (!uploadedImg) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x >= imgX && x <= imgX + uploadedImg.width &&
      y >= imgY && y <= imgY + uploadedImg.height) {
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

// --- DOWNLOAD ---
function download() {
  const canvas = document.getElementById("canvas");
  const link = document.createElement("a");
  link.download = "visuel.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

generate();
