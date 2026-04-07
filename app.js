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
    case "instagram":
      return { width: 1080, height: 1350 };
    case "a3":
      return { width: 2480, height: 3508 };
    case "story":
      return { width: 1080, height: 1920 };
  }
}

function generate() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const size = getCanvasSize();

  canvas.width = size.width;
  canvas.height = size.height;

  // Fond blanc
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dégradé jaune bas → milieu
  const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
  gradient.addColorStop(0, "rgba(255, 200, 0, 1)");
  gradient.addColorStop(1, "rgba(255, 200, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  // Image uploadée
  if (uploadedImg) {
    ctx.drawImage(uploadedImg, imgX, imgY);
  }

  // Texte
  const title = document.getElementById("titleInput").value;

  ctx.fillStyle = "#000";
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";

  ctx.fillText(title, canvas.width / 2, 120);
}

// Upload image
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

// Déplacement de l’image
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

// Télécharger
function download() {
  const canvas = document.getElementById("canvas");
  const link = document.createElement("a");
  link.download = "visuel.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Génération initiale
generate();
