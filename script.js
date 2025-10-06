
// ==========================
// 🐟 FISH CLICKER - CODES UPDATE
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
let ownerUnlocked = false;

// Elements
const fishCountEl = document.getElementById("fishCount");
const coinsEl = document.getElementById("coins");
const fishEl = document.getElementById("fish");
const sellFishBtn = document.getElementById("sellFish");
const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
const buyAutoSellerBtn = document.getElementById("buyAutoSeller");
const codesBtn = document.getElementById("codesBtn");

// Create dynamic UI
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
// 💾 Load Saved Game
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
    ownerUnlocked = Boolean(save.ownerUnlocked);

    // Restore UGFA fix
    if (multiplier > 100 && !traits.includes("Ultimate Glitch Finder Award")) {
      multiplier = 20;
      traits = ["Ultimate Glitch Finder Award"];
      showNotification("🏆 Ultimate Glitch Finder Award! — 20× Bonus Applied!");
    }

    // Reapply owner tag multiplier
    if (ownerUnlocked) {
      multiplier *= 100;
      showNotification("👑 Owner powers restored (100×)");
    }

    updateDisplay();
    updateTraitsDisplay();
  }
};

// ==========================
// 💾 Auto Save
// ==========================
setInterval(() => {
  localStorage.setItem("fishGameSave", JSON.stringify({
    fish, coins, autoClickers, autoSellers,
    traits, multiplier, rebirths, rebirthCost,
    lastTraitTrigger, ownerUnlocked
  }));
}, 2000);

// ==========================
// 🐟 Game Logic
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
  { name: "Shiny", multiplier: 2 },
  { name: "Golden", multiplier: 1.5 },
  { name: "Rainbow", multiplier: 5 },
  { name: "Diamond", multiplier: 3 },
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
// 🔥 Rebirth
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
// 💬 Codes System
// ==========================
codesBtn.onclick = () => {
  const code = prompt("Enter a code:");
  if (!code) return;

  switch (code.toUpperCase()) {
    case "UGFA_RESTORE":
      if (!traits.includes("Ultimate Glitch Finder Award")) {
        traits.push("Ultimate Glitch Finder Award");
        multiplier *= 20;
        showNotification("🏆 UGFA restored! (20× bonus)");
      } else showNotification("You already have UGFA!");
      break;

    case "IAMTHEOWNER":
      if (!ownerUnlocked) {
        ownerUnlocked = true;
        multiplier *= 100;
        showNotification("👑 Owner tag unlocked! (100× bonus)");
      } else showNotification("👑 Owner tag already unlocked!");
      break;

    case "FISHPOWER":
      fish += 500;
      coins += 500;
      showNotification("💥 You gained 500 fish and 500 coins!");
      break;

    default:
      showNotification("❌ Invalid code.");
      break;
  }

  updateDisplay();
  updateTraitsDisplay();
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
    traitDisplay.textContent = "Traits: " + traits.join(", ");
  } else {
    traitDisplay.textContent = "Traits: None";
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