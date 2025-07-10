// Configuration constants
const CONFIG = {
  ROW_COUNT: 10,
  REPEAT_COUNT: 20,
  COLORS: ["#00ffcc", "#ff6ec4", "#ffff66", "#66ff66", "#ff0000", "#ff4500", "#ff1493", "#ffa500"]
};

// Simplified icons without unused title attributes
const ICONS = [
  '<i class="fas fa-dollar-sign"></i>',
  '<i class="fas fa-euro-sign"></i>',
  '<i class="fas fa-pound-sign"></i>',
  '<i class="fas fa-yen-sign"></i>',
  '<i class="fa-solid fa-bitcoin-sign"></i>',
  '<i class="fas fa-ruble-sign"></i>',
  '<i class="fas fa-won-sign"></i>',
  '<i class="fa-solid fa-indian-rupee-sign"></i>',
  '<i class="fas fa-lira-sign"></i>',
  '<i class="fas fa-shekel-sign"></i>'
];

// Optimized shuffle using modern array methods
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Generate and insert currency rows
function generateCurrencyRows() {
  const container = document.getElementById("currencies-container");
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < CONFIG.ROW_COUNT; i++) {
    const row = document.createElement("div");
    row.className = "currency";
    
    const slide = document.createElement("div");
    slide.className = `currency-slide ${i % 2 ? "reverse" : ""}`;
    slide.innerHTML = shuffleArray(ICONS).join("").repeat(CONFIG.REPEAT_COUNT);
    
    row.appendChild(slide);
    fragment.appendChild(row);
  }
  
  container.appendChild(fragment);
}

// Optimized hover effect with CSS custom properties
function initializeHoverEffects() {
  const container = document.getElementById("currencies-container");
  
  // Use event delegation for better performance
  container.addEventListener("mouseover", (e) => {
    if (e.target.matches(".currency-slide i")) {
      const randomColor = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
      e.target.style.setProperty("--hover-color", randomColor);
    }
  });
  
  container.addEventListener("mouseout", (e) => {
    if (e.target.matches(".currency-slide i")) {
      e.target.style.removeProperty("--hover-color");
    }
  });
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  generateCurrencyRows();
  initializeHoverEffects();
});