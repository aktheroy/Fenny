// Cache DOM elements and settings
const container = document.getElementById("currencies-container");
const ROW_COUNT = 10;
const REPEAT_COUNT = 20;
const COLORS = ["#00ffcc", "#ff6ec4", "#ffff66", "#66ff66", "#ff0000", "#ff4500", "#ff1493", "#ffa500"];

// Font Awesome icons with appropriate classes
const ICONS = [
  '<i class="fas fa-dollar-sign" title="USD"></i>',
  '<i class="fas fa-euro-sign" title="EUR"></i>',
  '<i class="fas fa-pound-sign" title="GBP"></i>',
  '<i class="fas fa-yen-sign" title="JPY"></i>',
  '<i class="fa-solid fa-bitcoin-sign" title="BTC"></i>',
  '<i class="fas fa-ruble-sign" title="RUB"></i>',
  '<i class="fas fa-won-sign" title="KRW"></i>',
  '<i class="fa-solid fa-indian-rupee-sign"></i>',
  '<i class="fas fa-lira-sign" title="TRY"></i>',
  '<i class="fas fa-shekel-sign" title="ILS"></i>',
];

// Optimized shuffle using Fisher-Yates algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Create document fragment for batch DOM insertion
const fragment = document.createDocumentFragment();

// Generate rows
for (let i = 0; i < ROW_COUNT; i++) {
  const shuffled = shuffleArray(ICONS);
  const row = document.createElement("div");
  row.className = "currency";
  
  // Create sliding content
  const slide = document.createElement("div");
  slide.className = `currency-slide ${i % 2 ? "reverse" : ""}`;
  
  // Join once instead of multiple concatenations
  slide.innerHTML = shuffled.join("").repeat(REPEAT_COUNT);
  row.appendChild(slide);
  fragment.appendChild(row);
}

// Single DOM insertion
container.appendChild(fragment);

// Event delegation for hover effects
container.addEventListener("mouseover", (e) => {
  if (e.target.matches(".currency-slide i")) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    e.target.style.setProperty("--hover-color", color);
  }
});

container.addEventListener("mouseout", (e) => {
  if (e.target.matches(".currency-slide i")) {
    e.target.style.removeProperty("--hover-color");
  }
});