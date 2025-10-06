// ==========================
// 🐟 FISH CLICKER - FINAL FIXED BUILD (UGFA PERMANENT)
// ==========================

let fish = 0;
let coins = 0;
let autoClickers = 0;
let autoSellers = 0;
let traits = [];
let multiplier = 1;
let rebirths = 0;
let rebirthCost = 1000;
let lastTraitTrigger = 0;

const fishCountEl = document.getElementById("fishCount");
const coinsEl = document.getElementById("coins");
const fishEl = document.getElementById("fish");
const sellFishBtn = document.getElementById("sellFish");
const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
const buyAutoSellerBtn = document.getElementById("buyAutoSeller");
const rebirthsEl = document.getElementById("rebirths");
const multiplierEl = document.getElementById("multiplier");

// Create trait & rebirth elements dynamically
const traitDisplay = document.createElement("p");
traitDisplay.id = "traits";
traitDisplay.textContent = "Traits: None";
document.body.appendChild(traitDisplay);

const rebirthBtn = document.createElement("button");
rebirthBtn.id = "rebirthBtn";
rebirthBtn.style.display = "none";
rebirthBtn.textContent = `🔥 Rebirth (Cost: ${rebirthCost} coins)`;
document.body.appendChild(rebirthBtn);

// ==========================
// 💾 LOAD SAVE DATA
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

    // 🏆 Fix for old glitchers — award UGFA once
    if (multiplier > 100 && !traits.includes("Ultimate Glitch Finder Award")) {
      multiplier = 20;
      traits = ["Ultimate Glitch Finder Award"];
      showNotification("🏆 Ultimate Glitch Finder Award! — 20× Bonus Applied!");
    }

    updateDisplay();
    updateTraitsDisplay();
  }
};

// ==========================
// 💾 AUTO-SAVE
// ==========================
setInterval(() => {
  localStorage.setItem("fishGameSave", JSON.stringify({
    fish, coins, autoClickers, autoSellers,
    traits, multiplier, rebirths, rebirthCost, lastTraitTrigger
  }));
}, 2000);

// ==========================
// 🎮 GAME LOGIC
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

// AutoClickers
setInterval(() => {
  fish += autoClickers * multiplier;
  updateDisplay();
  checkTraits();
}, 1000);

// AutoSellers
setInterval(() => {
  if (fish >= autoSellers) {
    fish -= autoSellers;
    coins += autoSellers * multiplier;
    updateDisplay();
  }
}, 2000);

// ==========================
// 🧬 TRAITS SYSTEM
// ==========================
const traitPool = [
  { name: "Shiny", multiplier: 2, class: "trait-shiny" },
  { name: "Golden", multiplier: 1.5, class: "trait-golden" },
  { name: "Rainbow", multiplier: 5, class: "trait-rainbow" },
  { name: "Diamond", multiplier: 3, class: "trait-diamond" },
];

function checkTraits() {
  if (Math.floor(fish) - lastTraitTrigger >= 100) {
    lastTraitTrigger = Math.floor(fish);
    const newTrait = traitPool[Math.floor(Math.random() * traitPool.length)];

    if (!traits.includes(newTrait.name)) {
      traits.push(newTrait.name);
      multiplier *= newTrait.multiplier;
      showNotification(`✨ New Trait: ${newTrait.name}! (${newTrait.multiplier}×)`);
      updateTraitsDisplay();
    }
  }
}

// ==========================
// 🔥 REBIRTH SYSTEM (UGFA SAFE)
// ==========================
function checkRebirthButton() {
  if (coins >= rebirthCost) {
    rebirthBtn.style.display = "inline-block";
    rebirthBtn.textContent = `🔥 Rebirth (Cost: ${rebirthCost} coins)`;
  } else {
    rebirthBtn.style.display = "none";
  }
}

rebirthBtn.onclick = () => {
  if (coins >= rebirthCost) {
    coins = 0;
    fish = 0;
    autoClickers = 0;
    autoSellers = 0;

    // ✅ Keep UGFA permanently
    const hasUGFA = traits.includes("Ultimate Glitch Finder Award");
    traits = hasUGFA ? ["Ultimate Glitch Finder Award"] : [];

    // Base multiplier (keep UGFA’s 20x once)
    multiplier = (hasUGFA ? 20 : 1) + rebirths * 0.5;

    rebirths++;
    rebirthCost *= 5;

    showNotification(`🔥 Rebirth #${rebirths}! Base Multiplier: ${multiplier}×`);
    updateDisplay();
    updateTraitsDisplay();
  }
};

// ==========================
// 🖥 DISPLAY
// ==========================
function updateDisplay() {
  if (isNaN(fish)) fish = 1;
  fishCountEl.textContent = Math.floor(fish);
  coinsEl.textContent = Math.floor(coins);
  multiplierEl.textContent = `${multiplier.toFixed(2)}x`;
  rebirthsEl.textContent = `Rebirths: ${rebirths}`;
  checkRebirthButton();
}

function updateTraitsDisplay() {
  if (traits.length > 0) {
    traitDisplay.innerHTML = "Traits: " + traits.map(t => {
      const traitObj = traitPool.find(tp => tp.name === t);
      if (t === "Ultimate Glitch Finder Award") return `<span class="trait-ultimate">${t}</span>`;
      return `<span class="${traitObj ? traitObj.class : ""}">${t}</span>`;
    }).join(", ");
  } else {
    traitDisplay.textContent = "Traits: None";
  }
}

// ==========================
// 🔔 NOTIFICATIONS
// ==========================
function showNotification(text) {
  const note = document.createElement("div");
  note.textContent = text;
  note.className = "notification";
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}