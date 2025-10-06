
// ==========================
// 🐟 FISH CLICKER - DELUXE BUILD
// ==========================

// Main variables
let fish = 0;
let coins = 0;
let autoClickers = 0;
let autoSellers = 0;

// Progression
let traits = [];
let multiplier = 1;
let rebirths = 0;
let rebirthCost = 1000;
let lastTraitTrigger = 0;

// Elements
const fishCountEl = document.getElementById("fishCount");
const coinsEl = document.getElementById("coins");
const fishEl = document.getElementById("fish");
const sellFishBtn = document.getElementById("sellFish");
const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
const buyAutoSellerBtn = document.getElementById("buyAutoSeller");

// Create trait and rebirth UI dynamically
const traitDisplay = document.createElement("div");
traitDisplay.id = "traits";
traitDisplay.innerHTML = "<h2>⭐ Traits:</h2><p>None</p>";
document.body.appendChild(traitDisplay);

const rebirthBtn = document.createElement("button");
rebirthBtn.id = "rebirthBtn";
rebirthBtn.style.display = "none";
rebirthBtn.textContent = `🔥 Rebirth (Cost: ${rebirthCost} coins)`;
document.body.appendChild(rebirthBtn);

// ==========================
// 🧠 Load saved data safely
// ==========================
window.onload = () => {
  const save = JSON.parse(localStorage.getItem("fishGameSave"));
  if (save) {
    fish = Number(save.fish) || 0;
    coins = Number(save.coins) || 0;
    autoClickers = Number(save.autoClickers) || 0;
    autoSellers = Number(save.autoSellers) || 0;
    traits = Array.isArray(save.traits) ? save.traits : [];
    multiplier = Number(save.multiplier) || 1;
    rebirths = Number(save.rebirths) || 0;
    rebirthCost = Number(save.rebirthCost) || 1000;
    lastTraitTrigger = Number(save.lastTraitTrigger) || 0;

    // 🏆 Fix old bug saves
    if (multiplier > 100) {
      multiplier = 20;
      traits = ["Ultimate Glitch Finder Award"];
      showNotification("🏆 Ultimate Glitch Finder Award! — 20× Bonus Applied!");
    }

    updateDisplay();
    updateTraitsDisplay();
  }
};

// ==========================
// 💾 Save every 2s
// ==========================
setInterval(() => {
  localStorage.setItem(
    "fishGameSave",
    JSON.stringify({
      fish,
      coins,
      autoClickers,
      autoSellers,
      traits,
      multiplier,
      rebirths,
      rebirthCost,
      lastTraitTrigger
    })
  );
}, 2000);

// ==========================
// 🐟 Core Game Logic
// ==========================
fishEl.onclick = () => {
  fish += 1 * multiplier;
  updateDisplay();
  checkTraits();
};

sellFishBtn.onclick = () => {
  if (fish >= 1) {
    fish--;
    coins += 1 * multiplier;
    updateDisplay();
  }
};

buyAutoClickerBtn.onclick = () => {
  if (coins >= 10) {
    coins -= 10;
    autoClickers++;
    updateDisplay();
  }
};

buyAutoSellerBtn.onclick = () => {
  if (coins >= 25) {
    coins -= 25;
    autoSellers++;
    updateDisplay();
  }
};

// Auto systems
setInterval(() => {
  fish += autoClickers * multiplier;
  updateDisplay();
  checkTraits();
}, 1000);

setInterval(() => {
  if (fish >= autoSellers) {
    fish -= autoSellers;
    coins += autoSellers * multiplier;
    updateDisplay();
  }
}, 2000);

// ==========================
// 🧬 Traits
// ==========================
const traitPool = [
  { name: "Shiny", multiplier: 2, color: "#c0c0c0" },
  { name: "Golden", multiplier: 1.5, color: "#FFD700" },
  { name: "Diamond", multiplier: 3, color: "#00bfff" },
  { name: "Rainbow", multiplier: 5, color: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)" },
];

function checkTraits() {
  if (Math.floor(fish) - lastTraitTrigger >= 100) {
    lastTraitTrigger = Math.floor(fish);
    const newTrait = traitPool[Math.floor(Math.random() * traitPool.length)];

    if (!traits.includes(newTrait.name)) {
      traits.push(newTrait.name);
      multiplier *= Number(newTrait.multiplier) || 1;
      showNotification(`✨ New Trait: ${newTrait.name}! (${newTrait.multiplier}×)`);
      updateTraitsDisplay();
    }
  }
}

function traitToHTML(name) {
  if (name === "Ultimate Glitch Finder Award") {
    return `<span style="color: purple; font-weight: bold; text-shadow: 0 0 8px gold;">${name}</span>`;
  }
  const trait = traitPool.find(t => t.name === name);
  if (!trait) return name;

  if (trait.name === "Rainbow") {
    return `<span style="background: ${trait.color}; -webkit-background-clip: text; color: transparent; font-weight: bold;">${name}</span>`;
  }
  return `<span style="color:${trait.color}; font-weight:bold;">${name}</span>`;
}

// ==========================
// 🔥 Rebirth System
// ==========================
function checkRebirthButton() {
  rebirthBtn.style.display = coins >= rebirthCost ? "inline-block" : "none";
  rebirthBtn.textContent = `🔥 Rebirth (Cost: ${rebirthCost} coins)`;
}

rebirthBtn.onclick = () => {
  if (coins >= rebirthCost) {
    coins = 0;
    fish = 0;
    autoClickers = 0;
    autoSellers = 0;
    traits = [];
    multiplier = 1 + rebirths * 0.5;
    rebirths++;
    rebirthCost *= 5;
    showNotification(`🔥 Rebirth #${rebirths}! Base Multiplier: ${multiplier}×`);
    updateTraitsDisplay();
    updateDisplay();
  }
};

// ==========================
// 🖥️ Display
// ==========================
function updateDisplay() {
  fishCountEl.textContent = Math.floor(fish);
  coinsEl.textContent = Math.floor(coins);
  checkRebirthButton();
}

function updateTraitsDisplay() {
  if (traits.length > 0) {
    const html = traits.map(t => traitToHTML(t)).join(", ");
    traitDisplay.innerHTML = `<h2>⭐ Traits:</h2><p>${html}</p>`;
  } else {
    traitDisplay.innerHTML = "<h2>⭐ Traits:</h2><p>None</p>";
  }
}

// ==========================
// 🔔 Notifications
// ==========================
function showNotification(text) {
  const note = document.createElement("div");
  note.textContent = text;
  note.style.position = "fixed";
  note.style.bottom = "20px";
  note.style.left = "50%";
  note.style.transform = "translateX(-50%)";
  note.style.background = "rgba(255,255,255,0.95)";
  note.style.border = "2px solid black";
  note.style.padding = "10px 20px";
  note.style.borderRadius = "10px";
  note.style.fontWeight = "bold";
  note.style.zIndex = 9999;
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 3000);
}