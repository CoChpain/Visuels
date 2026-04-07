let currentFormat = "instagram";

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
      return { width: 2480, height: 3508 }; // 300dpi print
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

  // Texte
  const title = document.getElementById("titleInput").value;

  ctx.fillStyle = "#000";
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";

  ctx.fillText(title, canvas.width / 2, 120);
}

function download() {
  const canvas = document.getElementById("canvas");
  const link = document.createElement("a");
  link.download = "visuel.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Génération initiale
generate();
