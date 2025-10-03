let fish = 0;
let coins = 0;
let autoClickers = 0;
let autoSellers = 0;
let traits = [];
let rebirths = 0;
let rebirthCost = 1000;
let multiplier = 1;

const fishCountEl = document.getElementById("fishCount");
const coinsEl = document.getElementById("coins");
const fishEl = document.getElementById("fish");
const sellFishBtn = document.getElementById("sellFish");
const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
const buyAutoSellerBtn = document.getElementById("buyAutoSeller");
const traitsListEl = document.getElementById("traitsList");
const rebirthBtn = document.getElementById("rebirthBtn");
const rebirthsEl = document.getElementById("rebirths");
const multiplierEl = document.getElementById("multiplier");
const notificationEl = document.getElementById("notifications");

// Traits
const allTraits = [
  { name: "Shiny", multiplier: 2 },
  { name: "Golden", multiplier: 1.5 },
  { name: "Rainbow", multiplier: 5 },
  { name: "Diamond", multiplier: 3 }
];

// Load saved game
window.onload = () => {
  const save = JSON.parse(localStorage.getItem("fishGameSave"));
  if (save) {
    fish = save.fish;
    coins = save.coins;
    autoClickers = save.autoClickers;
    autoSellers = save.autoSellers;
    traits = save.traits || [];
    rebirths = save.rebirths || 0;
    rebirthCost = save.rebirthCost || 1000;
    multiplier = save.multiplier || 1;
    updateDisplay();
    updateTraitsDisplay();
  }
};

// Save game every 2s
setInterval(() => {
  localStorage.setItem("fishGameSave", JSON.stringify({
    fish, coins, autoClickers, autoSellers, traits, rebirths, rebirthCost, multiplier
  }));
}, 2000);

// ✅ Fixed: Fish click handler
fishEl.addEventListener("click", () => {
  fish++;
  checkTraits();
  updateDisplay();
});

// Sell button
sellFishBtn.addEventListener("click", () => {
  if (fish > 0) {
    fish--;
    coins += multiplier;
    updateDisplay();
  }
});

// Buy auto clicker
buyAutoClickerBtn.addEventListener("click", () => {
  if (coins >= 10) {
    coins -= 10;
    autoClickers++;
    updateDisplay();
  }
});

// Buy auto seller
buyAutoSellerBtn.addEventListener("click", () => {
  if (coins >= 25) {
    coins -= 25;
    autoSellers++;
    updateDisplay();
  }
});

// Auto clickers
setInterval(() => {
  fish += autoClickers;
  checkTraits();
  updateDisplay();
}, 1000);

// Auto sellers
setInterval(() => {
  if (fish >= autoSellers) {
    fish -= autoSellers;
    coins += autoSellers * multiplier;
    updateDisplay();
  }
}, 2000);

// Rebirth button
rebirthBtn.addEventListener("click", () => {
  if (coins >= rebirthCost) {
    coins = 0;
    fish = 0;
    autoClickers = 0;
    autoSellers = 0;
    traits = [];
    rebirths++;
    multiplier += 0.5;
    rebirthCost *= 5;
    showNotification(`🔥 Rebirth successful! Multiplier is now x${multiplier}`, "Golden");
    updateDisplay();
    updateTraitsDisplay();
  } else {
    showNotification(`Not enough coins to rebirth! Need ${rebirthCost}.`, "Shiny");
  }
});

// Check traits
function checkTraits() {
  if (fish > 0 && fish % 100 === 0) {
    const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
    traits.push(randomTrait.name);
    multiplier *= randomTrait.multiplier;
    showNotification(`✨ New Trait Unlocked: ${randomTrait.name}!`, randomTrait.name);
    updateTraitsDisplay();
    updateDisplay();
  }
}

// Update traits UI
function updateTraitsDisplay() {
  traitsListEl.innerHTML = "";
  traits.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    li.classList.add("trait-" + t);
    traitsListEl.appendChild(li);
  });
}

// Update display
function updateDisplay() {
  fishCountEl.textContent = fish;
  coinsEl.textContent = Math.floor(coins);
  rebirthsEl.textContent = rebirths;
  multiplierEl.textContent = multiplier.toFixed(1);
  rebirthBtn.textContent = `Rebirth (Cost: ${rebirthCost} coins)`;
}

// Notifications
function showNotification(message, type = null) {
  const note = document.createElement("div");
  note.className = "notification";
  if (type) note.classList.add(type);
  note.textContent = message;
  notificationEl.appendChild(note);

  setTimeout(() => {
    note.style.opacity = "0";
    setTimeout(() => note.remove(), 500);
  }, 2500);
}