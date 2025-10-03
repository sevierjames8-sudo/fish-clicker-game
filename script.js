
let fish = 0;
let coins = 0;

// Upgrades
let autoClickers = 0;
let autoSellers = 0;

// Prestige (rebirths)
let rebirths = 0;
let rebirthCost = 1000;
let multiplier = 1;

// Traits
let traits = [];
const traitOptions = [
  { name: "Shiny", bonus: 2 },
  { name: "Golden", bonus: 1.5 },
  { name: "Rainbow", bonus: 5 },
  { name: "Diamond", bonus: 3 }
];

// Elements
const fishCountEl = document.getElementById("fishCount");
const coinsEl = document.getElementById("coins");
const fishEl = document.getElementById("fish");

const sellFishBtn = document.getElementById("sellFish");
const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
const buyAutoSellerBtn = document.getElementById("buyAutoSeller");

const rebirthsEl = document.getElementById("rebirths");
const multiplierEl = document.getElementById("multiplier");
const rebirthBtn = document.getElementById("rebirthBtn");
const rebirthCostEl = document.getElementById("rebirthCost");

const traitsListEl = document.getElementById("traitsList");

// Notification container
const notificationEl = document.createElement("div");
notificationEl.id = "notifications";
document.body.appendChild(notificationEl);

// Load saved game
window.onload = () => {
  const save = JSON.parse(localStorage.getItem("fishGameSave"));
  if (save) {
    fish = save.fish;
    coins = save.coins;
    autoClickers = save.autoClickers;
    autoSellers = save.autoSellers;
    rebirths = save.rebirths || 0;
    rebirthCost = save.rebirthCost || 1000;
    traits = save.traits || [];
    multiplier = 1 + rebirths * 0.5;
    updateDisplay();
  }
};

// Save game every 2 seconds
setInterval(() => {
  localStorage.setItem("fishGameSave", JSON.stringify({
    fish, coins, autoClickers, autoSellers,
    rebirths, rebirthCost, traits
  }));
}, 2000);

// Fish click
fishEl.onclick = () => {
  fish++;
  checkTraits();
  updateDisplay();
};

// Sell button
sellFishBtn.onclick = () => {
  if (fish > 0) {
    fish--;
    coins += 1 * multiplier * traitMultiplier();
    updateDisplay();
  }
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
  checkTraits();
  updateDisplay();
}, 1000);

// AutoSeller effect
setInterval(() => {
  if (fish >= autoSellers) {
    fish -= autoSellers;
    coins += autoSellers * multiplier * traitMultiplier();
    updateDisplay();
  }
}, 2000);

// Rebirth button
rebirthBtn.onclick = () => {
  if (coins >= rebirthCost) {
    rebirths++;
    multiplier = 1 + rebirths * 0.5;

    // Reset progress
    fish = 0;
    coins = 0;
    autoClickers = 0;
    autoSellers = 0;
    traits = [];

    // Increase rebirth cost
    rebirthCost *= 5;

    showNotification(`🔥 Rebirth Complete! Multiplier is now x${multiplier.toFixed(1)}!`);
    updateDisplay();
  }
};

// Check traits (every 100 fish caught)
function checkTraits() {
  if (fish % 100 === 0 && fish > 0) {
    const randomTrait = traitOptions[Math.floor(Math.random() * traitOptions.length)];
    traits.push(randomTrait.name);
    showNotification(`✨ New Trait Unlocked: ${randomTrait.name}!`, randomTrait.name);
    updateTraitsDisplay();
  }
}

// Calculate trait multiplier
function traitMultiplier() {
  return traits.reduce((total, t) => {
    const trait = traitOptions.find(x => x.name === t);
    return total * (trait ? trait.bonus : 1);
  }, 1);
}

// Update display
function updateDisplay() {
  fishCountEl.textContent = fish;
  coinsEl.textContent = Math.floor(coins);
  rebirthsEl.textContent = rebirths;
  multiplierEl.textContent = multiplier.toFixed(1);
  rebirthCostEl.textContent = rebirthCost;
  updateTraitsDisplay();

  // Show/hide rebirth button
  if (coins >= rebirthCost) {
    rebirthBtn.style.display = "inline-block";
  } else {
    rebirthBtn.style.display = "none";
  }
}

// Update trait list UI
function updateTraitsDisplay() {
  traitsListEl.innerHTML = "";
  traits.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    li.classList.add("trait-" + t);
    traitsListEl.appendChild(li);
  });
}

// Notification system
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

