const container = document.getElementById("currencies-container");
const icons = [
  '<i class="bx bx-dollar"></i>',
  '<i class="bx bx-euro"></i>',
  '<i class="bx bx-pound"></i>',
  '<i class="bx bx-yen"></i>',
  '<i class="bx bx-bitcoin"></i>',
  '<i class="bx bx-ruble"></i>',
  '<i class="bx bx-won"></i>',
  '<i class="bx bx-rupee"></i>',
  '<i class="bx bx-lira"></i>',
  '<i class="bx bx-shekel"></i>',
];

// Function to shuffle the icons array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

for (let i = 0; i < 10; i++) {
  const shuffledIcons = shuffle([...icons]); // Shuffle a copy of the icons array
  const currencyRow = document.createElement("div");
  currencyRow.className = "currency";

  // Repeat the shuffled icons enough times to fill the row
  currencyRow.innerHTML = `
        <div class="currency-slide ${i % 2 === 1 ? "reverse" : ""}">
            ${shuffledIcons.join("").repeat(5)}
        </div>
    `;
  container.appendChild(currencyRow);
}
