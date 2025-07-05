// Utility: Shuffle an array
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

const container = document.getElementById("currencies-container");

const icons = [
  '<i class="bx bx-dollar" title="USD"></i>',
  '<i class="bx bx-euro" title="EUR"></i>',
  '<i class="bx bx-pound" title="GBP"></i>',
  '<i class="bx bx-yen" title="JPY"></i>',
  '<i class="bx bx-bitcoin" title="BTC"></i>',
  '<i class="bx bx-ruble" title="RUB"></i>',
  '<i class="bx bx-won" title="KRW"></i>',
  '<i class="bx bx-rupee" title="INR"></i>',
  '<i class="bx bx-lira" title="TRY"></i>',
  '<i class="bx bx-shekel" title="ILS"></i>',
];

// Generate 10 rows of sliding icons
for (let i = 0; i < 10; i++) {
  const shuffled = shuffle([...icons]);
  const row = document.createElement("div");
  row.className = "currency";

  // Repeat enough times to simulate "infinite"
  const longString = shuffled.join("").repeat(20);

  row.innerHTML = `
    <div class="currency-slide ${i % 2 ? "reverse" : ""}">
      ${longString}
    </div>
  `;
  container.appendChild(row);
}

// Random hover colors (optional)
const colors = [
  "#00ffcc",
  "#ff6ec4",
  "#ffff66",
  "#66ff66",
  "#ff0000",
  "#ff4500",
  "#ff1493",
  "#ffa500",
];
document.querySelectorAll(".currency-slide i").forEach((icon) => {
  icon.addEventListener("mouseover", () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    icon.style.setProperty("--hover-color", color);
  });
  icon.addEventListener("mouseout", () => {
    icon.style.removeProperty("--hover-color");
  });
});
