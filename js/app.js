let currentFormat = "instagram";

let uploadedImg = null;
let imgX = 0, imgY = 0;
let isDragging = false;
let offsetX = 0, offsetY = 0;

let scale = 1;
let lastScale = 1;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const templateSelect = document.getElementById("templateSelect");
const titleInput = document.getElementById("titleInput");
const subtitleInput = document.getElementById("subtitleInput");
const imageInput = document.getElementById("imageInput");
const btnGenerate = document.getElementById("btn-generate");
const btnDownload = document.getElementById("btn-download");
const formatButtons = document.querySelectorAll(".format-tabs button");

formatButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    formatButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFormat = btn.dataset.format;
    generate();
  });
});

function getCanvasSize() {
  switch (currentFormat) {
    case "instagram": return { width: 1080, height: 1350 };
    case "story": return { width: 1080, height: 1920 };
    case "a3": return { width: 2480, height: 3508 };
  }
}

function generate() {
  const size = getCanvasSize();
  canvas.width = size.width;
  canvas.height = size.height;

  // Fond noir
  ctx.fillStyle = "#050509";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // IMAGE DE FOND
  if (uploadedImg) {
    const w = uploadedImg.width * scale;
    const h = uploadedImg.height * scale;
    ctx.drawImage(uploadedImg, imgX, imgY, w, h);
  }

  // OVERLAY SOMBRE + DÉGRADÉ
  const overlayGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  overlayGrad.addColorStop(0, "rgba(0,0,0,0.55)");
  overlayGrad.addColorStop(0.5, "rgba(0,0,0,0.35)");
  overlayGrad.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = overlayGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // BANDEAU LATERAL
  const bandWidth = canvas.width * 0.12;
  const bandGrad = ctx.createLinearGradient(0, 0, bandWidth, canvas.height);
  bandGrad.addColorStop(0, "#ffcc00");
  bandGrad.addColorStop(1, "#ff7b00");
  ctx.fillStyle = bandGrad;
  ctx.fillRect(0, 0, bandWidth, canvas.height);

  // LIGNES DIAGONALES DÉCO
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 4;
  for (let i = -canvas.height; i < canvas.width; i += 120) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + canvas.height, canvas.height);
    ctx.stroke();
  }

  // TITRE + SOUS-TITRE
  const title = titleInput.value.toUpperCase();
  const subtitle = subtitleInput.value;

  ctx.textAlign = "left";
  ctx.fillStyle = "#f5f5f5";

  const marginX = bandWidth + canvas.width * 0.06;
  let y = canvas.height * 0.18;

  ctx.font = `800 ${canvas.width * 0.06}px Oswald`;
  ctx.fillText(title, marginX, y);

  y += canvas.height * 0.07;
  ctx.font = `500 ${canvas.width * 0.035}px Montserrat`;
  ctx.fillText(subtitle, marginX, y);

  // TAG TEMPLATE
  const template = templateSelect.value;
  let label = "";
  switch (template) {
    case "resultats": label = "RÉSULTATS"; break;
    case "programme": label = "PROGRAMME"; break;
    case "nm2": label = "NM2"; break;
    case "info": label = "INFO CLUB"; break;
  }

  const tagWidth = canvas.width * 0.32;
  const tagHeight = canvas.height * 0.07;
  const tagX = marginX;
  const tagY = canvas.height * 0.78;

  
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  roundRect(ctx, tagX, tagY, tagWidth, tagHeight, tagHeight * 0.4);
  ctx.fill();

  const tagGrad = ctx.createLinearGradient(tagX, tagY, tagX + tagWidth, tagY);
  tagGrad.addColorStop(0, "#ffcc00");
  tagGrad.addColorStop(1, "#ff7b00");
  ctx.strokeStyle = tagGrad;
  ctx.lineWidth = 4;
  roundRect(ctx, tagX, tagY, tagWidth, tagHeight, tagHeight * 0.4);
  ctx.stroke();

  ctx.font = `700 ${canvas.width * 0.028}px Montserrat`;
  ctx.fillStyle = "#f5f5f5";
  ctx.textAlign = "center";
  ctx.fillText(label, tagX + tagWidth / 2, tagY + tagHeight * 0.65);

  // LOGO CLUB (CERCLE)
  const logoR = canvas.width * 0.045;
  const logoX = bandWidth / 2;
  const logoY = canvas.height * 0.12;

  const logoGrad = ctx.createRadialGradient(
    logoX - logoR * 0.4, logoY - logoR * 0.4, logoR * 0.2,
    logoX, logoY, logoR
  );
  logoGrad.addColorStop(0, "#ffffff");
  logoGrad.addColorStop(0.4, "#ffcc00");
  logoGrad.addColorStop(1, "#ff7b00");

  ctx.beginPath();
  ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
  ctx.fillStyle = logoGrad;
  ctx.fill();

  ctx.font = `800 ${logoR * 0.9}px Montserrat`;
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.fillText("BC", logoX, logoY + logoR * 0.3);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Upload image
imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    uploadedImg = new Image();
    uploadedImg.onload = () => {
      const size = getCanvasSize();
      canvas.width = size.width;
      canvas.height = size.height;

      scale = Math.max(
        canvas.width / uploadedImg.width,
        canvas.height / uploadedImg.height
      ) * 1.05;

      const w = uploadedImg.width * scale;
      const h = uploadedImg.height * scale;
      imgX = (canvas.width - w) / 2;
      imgY = (canvas.height - h) / 2;

      generate();
    };
    uploadedImg.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// Drag & drop
canvas.addEventListener("mousedown", e => {
  if (!uploadedImg) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const w = uploadedImg.width * scale;
  const h = uploadedImg.height * scale;

  if (x >= imgX && x <= imgX + w && y >= imgY && y <= imgY + h) {
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

// Zoom molette
canvas.addEventListener("wheel", e => {
  if (!uploadedImg) return;
  e.preventDefault();

  const zoomIntensity = 0.0015;
  const delta = e.deltaY * -zoomIntensity;
  const newScale = Math.min(Math.max(0.3, scale + delta), 5);

  scale = newScale;
  generate();
}, { passive: false });

// Pinch-to-zoom
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
    scale = Math.min(Math.max(0.3, lastScale * pinchScale), 5);
    generate();
  }
}, { passive: false });

// Boutons
btnGenerate.addEventListener("click", generate);

btnDownload.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "visuel-basket.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Première génération
generate();
