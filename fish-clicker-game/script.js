let score = 0;

const fish = document.getElementById("fish");
const scoreDisplay = document.getElementById("score");

fish.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = "Score: " + score;
});
