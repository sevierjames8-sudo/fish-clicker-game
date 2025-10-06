
let fish = 0;
let coins = 0;

// Upgrades
let autoClickers = 0;
let autoSellers = 0;

// Traits & multipliers
let traits = [];
let multiplier = 1;
let lastTraitTrigger = 0;

// Rebirth system
let rebirths = 0;
let rebirthCost = 1000;

// Trait definitions
const allTraits = [
 { name: "Shiny", multiplier: 2 },
 { name: "Golden", multiplier: 1.5 },
 { name: "Rainbow", multiplier: 5 },
 { name: "Diamond", multiplier: 3 }
];

// Elements
const fishCountEl = document.getElementById("fishCount");
const coinsEl = document.getElementById("coins");
const fishEl = document.getElementById("fish");
const sellFishBtn = document.getElementById("sellFish");
const buyAutoClickerBtn = document.getElementById("buyAutoClicker");
const buyAutoSellerBtn = document.getElementById("buyAutoSeller");

// Create a rebirth button dynamically
const rebirthBtn = document.createElement("button");
rebirthBtn.id = "rebirthBtn";
rebirthBtn.textContent = `Rebirth (Cost: ${rebirthCost} coins)`;
document.getElementById("actions").appendChild(rebirthBtn);

// Create a trait display
const traitsDiv = document.createElement("div");
traitsDiv.id = "traitsDisplay";
traitsDiv.style.marginTop = "10px";
document.body.appendChild(traitsDiv);

// === LOAD SAVE ===
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
   lastTraitTrigger = save.lastTraitTrigger || 0;

   // 💥 Detect & reward bugged saves
   if (multiplier > 100) {
     multiplier = 20;
     traits = ["Ultimate Glitch Finder Award"];
     showNotification("🏆 Ultimate Glitch Finder Award! — 20× Bonus Applied!", "Diamond");
   }

   updateDisplay();
   updateTraitsDisplay();
 }
};

// === SAVE GAME ===
setInterval(() => {
 localStorage.setItem("fishGameSave", JSON.stringify({
   fish, coins, autoClickers, autoSellers, traits,
   rebirths, rebirthCost, multiplier, lastTraitTrigger
 }));
}, 2000);

// === CLICK TO CATCH FISH ===
fishEl.addEventListener("click", () => {
 fish += 1 * multiplier;
 checkTraits();
 updateDisplay();
});

// === SELL FISH ===
sellFishBtn.onclick = () => {
 if (fish > 0) {
   fish--;
   coins += 1 * multiplier;
   updateDisplay();
 }
};

// === BUY AUTOCLICKER ===
buyAutoClickerBtn.onclick = () => {
 if (coins >= 10) {
   coins -= 10;
   autoClickers++;
   updateDisplay();
 }
};

// === BUY AUTOSELLER ===
buyAutoSellerBtn.onclick = () => {
 if (coins >= 25) {
   coins -= 25;
   autoSellers++;
   updateDisplay();
 }
};

// === AUTOCLICKERS ===
setInterval(() => {
 fish += autoClickers * multiplier;
 checkTraits();
 updateDisplay();
}, 1000);

// === AUTOSELLERS ===
setInterval(() => {
 if (fish >= autoSellers) {
   fish -= autoSellers;
   coins += autoSellers * multiplier;
   updateDisplay();
 }
}, 2000);

// === TRAITS ===
function checkTraits() {
 if (fish >= lastTraitTrigger + 100) {
   lastTraitTrigger = Math.floor(fish / 100) * 100;
   const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
   traits.push(randomTrait.name);
   multiplier *= randomTrait.multiplier;
   showNotification(`✨ New Trait Unlocked: ${randomTrait.name}!`, randomTrait.name);
   updateTraitsDisplay();
   updateDisplay();
 }
}

function updateTraitsDisplay() {
 if (traits.length === 0) {
   traitsDiv.innerHTML = "✨ No traits yet!";
 } else {
   traitsDiv.innerHTML = `<h3>✨ Traits:</h3><ul>` +
     traits.map(t => `<li>${t}</li>`).join("") +
     `</ul><p>Current Multiplier: ${multiplier.toFixed(2)}×</p>`;
 }
}

// === REBIRTHS ===
rebirthBtn.onclick = () => {
 if (coins >= rebirthCost) {
   coins = 0;
   fish = 0;
   autoClickers = 0;
   autoSellers = 0;
   traits = [];
   multiplier = 1 + (rebirths + 1) * 0.5;
   rebirths++;
   rebirthCost *= 5;
   lastTraitTrigger = 0;
   showNotification(`🔥 Rebirth #${rebirths}! Your multiplier is now ${multiplier.toFixed(2)}×`, "Golden");
   updateTraitsDisplay();
   updateDisplay();
 }
};

// === UPDATE DISPLAY ===
function updateDisplay() {
 fishCountEl.textContent = Math.floor(fish);
 coinsEl.textContent = Math.floor(coins);
 rebirthBtn.textContent = `Rebirth (Cost: ${rebirthCost} coins)`;
}

// === NOTIFICATION ===
function showNotification(text, traitType) {
 const note = document.createElement("div");
 note.textContent = text;
 note.style.position = "fixed";
 note.style.top = "20px";
 note.style.left = "50%";
 note.style.transform = "translateX(-50%)";
 note.style.padding = "10px 20px";
 note.style.borderRadius = "10px";
 note.style.color = "white";
 note.style.fontWeight = "bold";
 note.style.zIndex = "1000";
 note.style.fontFamily = "Arial, sans-serif";

 switch (traitType) {
   case "Shiny": note.style.background = "#00bfff"; break;
   case "Golden": note.style.background = "gold"; break;
   case "Rainbow": note.style.background = "linear-gradient(90deg, red, orange, yellow, green, blue, purple)"; break;
   case "Diamond": note.style.background = "lightblue"; break;
   default: note.style.background = "#333";
 }

 document.body.appendChild(note);
 setTimeout(() => note.remove(), 2500);
}