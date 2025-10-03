Gmail	James Sevier <sevierjames8@gmail.com>
meep meep
Jj Sevier <jjsevier13@gmail.com>	Thu, Oct 2, 2025 at 6:13 PM
To: sevierjames8@gmail.com
html.index:

<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Fish Clicker</title>
 <link rel="stylesheet" href="style.css">
</head>
<body>
 <h1>🐟 Fish Clicker</h1>
 <p>Fish: <span id="fishCount">0</span></p>
 <p>Coins: <span id="coins">0</span></p>
 <p>Multiplier: <span id="multiplier">1</span>x</p>

 <img src="fish.png" id="fish" alt="Fish">

 <div id="actions">
   <button id="sellFish">Sell 1 Fish</button>
 </div>

 <div id="upgrades">
   <button id="buyAutoClicker">Buy AutoClicker (cost: 10 coins)</button>
   <button id="buyAutoSeller">Buy AutoSeller (cost: 25 coins)</button>
 </div>

 <!-- Rebirth Section -->
 <div id="rebirthSection">
   <button id="rebirthBtn">Rebirth (Cost: 1000 coins)</button>
   <p>Rebirths: <span id="rebirths">0</span></p>
 </div>

 <!-- Traits Section -->
 <h2>Traits</h2>
 <ul id="traitsList"></ul>

 <!-- Notifications -->
 <div id="notifications"></div>

 <script src="script.js"></script>
</body>
</html>

style.css:

body {
 background: white;
 text-align: center;
 font-family: Arial, sans-serif;
}

h1 {
 margin-top: 20px;
}

#fish {
 width: 200px;
 cursor: pointer;
 margin-top: 20px;
 animation: float 3s ease-in-out infinite;
}

@keyframes float {
 0%   { transform: translateY(0) rotate(0deg); }
 50%  { transform: translateY(-20px) rotate(10deg); }
 100% { transform: translateY(0) rotate(0deg); }
}

#upgrades, #rebirthSection {
 margin-top: 20px;
}

button {
 margin: 5px;
 padding: 10px;
 font-size: 16px;
 cursor: pointer;
 border: none;
 border-radius: 6px;
 background: #3498db;
 color: white;
 transition: 0.2s;
}

button:hover {
 background: #2980b9;
}

/* Traits list */
#traitsList {
 list-style: none;
 padding: 0;
 margin: 10px auto;
 max-width: 200px;
}

#traitsList li {
 padding: 5px;
 margin: 3px 0;
 border-radius: 4px;
 font-weight: bold;
 color: white;
}

/* Trait-specific colors */
.trait-Shiny {
 background: silver;
 color: black;
}

.trait-Golden {
 background: gold;
 color: black;
}

.trait-Diamond {
 background: linear-gradient(135deg, #00c3ff, #0072ff);
}

.trait-Rainbow {
 background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
 color: white;
}

/* Notifications */
#notifications {
 position: fixed;
 top: 20px;
 right: 20px;
 z-index: 1000;
}

.notification {
 background: #333;
 color: white;
 padding: 10px 15px;
 margin-top: 10px;
 border-radius: 5px;
 opacity: 0.95;
 transition: opacity 0.5s;
 font-family: Arial, sans-serif;
 font-size: 14px;
}

/* Trait-specific notification styles */
.notification.Shiny {
 background: silver;
 color: black;
}

.notification.Golden {
 background: gold;
 color: black;
}

.notification.Diamond {
 background: linear-gradient(135deg, #00c3ff, #0072ff);
 color: white;
}

.notification.Rainbow {
 background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
 color: white;
}

script.js:

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
   coins += multiplier;
   updateDisplay();
 }
};

// Buy auto clicker
buyAutoClickerBtn.onclick = () => {
 if (coins >= 10) {
   coins -= 10;
   autoClickers++;
   updateDisplay();
 }
};

// Buy auto seller
buyAutoSellerBtn.onclick = () => {
 if (coins >= 25) {
   coins -= 25;
   autoSellers++;
   updateDisplay();
 }
};

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
rebirthBtn.onclick = () => {
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
};

// Check traits
function checkTraits() {
 if (fish % 100 === 0 && fish > 0) {
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