
let fish = 0;
let coins = 0;

// Upgrades
let autoClickers = 0;
let autoSellers = 0;

const fishCountEl = document.getElementById("fishCount");
const coinsEl = document.getElementById("coins");
const fishEl = document.getElementById("fish");

const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
const buyAutoSellerBtn = document.getElementById("buyAutoSeller");

// Load saved game
window.onload = () => {
  const save = JSON.parse(localStorage.getItem("fishGameSave"));
  if (save) {
    fish = save.fish;
    coins = save.coins;
    autoClickers = save.autoClickers;
    autoSellers = save.autoSellers;
    updateDisplay();
  }
};

// Save game every 2 seconds
setInterval(() => {
  localStorage.setItem("fishGameSave", JSON.stringify({
    fish, coins, autoClickers, autoSellers
  }));
}, 2000);

// Fish click
fishEl.onclick = () => {
  fish++;
  updateDisplay();
};

// AutoClicker purchase
buyAutoClickerBtn.onclick = () => {
  if (coins >= 10) {
    coins -= 10;
    autoClickers++;
    updateDisplay();
  }
};

// AutoSeller purchase
buyAutoSellerBtn.onclick = () => {
  if (coins >= 25) {
    coins -= 25;
    autoSellers++;
    updateDisplay();
  }
};

// AutoClicker effect
setInterval(() => {
  fish += autoClickers;
  updateDisplay();
}, 1000);

// AutoSeller effect
setInterval(() => {
  if (fish >= autoSellers) {
    fish -= autoSellers;
    coins += autoSellers;
    updateDisplay();
  }
}, 2000);

function updateDisplay() {
  fishCountEl.textContent = fish;
  coinsEl.textContent = coins;
}
