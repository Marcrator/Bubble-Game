// --- GLOBAL VARIABLES ---
const playground = document.getElementById("playground");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const finalScore = document.getElementById("finalScore");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const popSound = document.getElementById("popSound");

let score = 0;
let timeLeft = 30;
let bubbleLife;
let spawnRate;
let bubbleInterval;

// --- MOUSE CONTROL ---
playground.addEventListener("mousemove", function(e) {
    const rect = playground.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    ball.style.left = mouseX - 20 + "px";
    ball.style.top = mouseY - 20 + "px";

    checkCollision();
});

// --- CREATE BUBBLES ---
function createBubble() {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    let bx = Math.random() * (playground.clientWidth - 30);
    let by = Math.random() * (playground.clientHeight - 30);

    bubble.style.left = bx + "px";
    bubble.style.top = by + "px";

    playground.appendChild(bubble);

    // Auto remove bubble
    setTimeout(() => {
        bubble.remove();
        if (difficultySelect.value === "extreme") spawnBubblesExtreme();
    }, bubbleLife);

    // Pop on click
    bubble.addEventListener("click", function(event) {
        event.stopPropagation();
        bubble.remove();
        score++;
        scoreDisplay.textContent = score;
        popSound.currentTime = 0;
        popSound.play();

        if (difficultySelect.value === "extreme") spawnBubblesExtreme();
    });
}

// --- EXTREME MODE HELPER ---
function spawnBubblesExtreme() {
    const existingBubbles = document.querySelectorAll(".bubble").length;
    const maxBubbles = 3;
    for (let i = existingBubbles; i < maxBubbles; i++) {
        createBubble();
    }
}

// --- CHECK COLLISION (optional, for ball hitting bubbles) ---
function checkCollision() {
    const bubbles = document.querySelectorAll(".bubble");
    const ballRect = ball.getBoundingClientRect();

    bubbles.forEach(bubble => {
        const bRect = bubble.getBoundingClientRect();
        if (
            ballRect.left < bRect.right &&
            ballRect.right > bRect.left &&
            ballRect.top < bRect.bottom &&
            ballRect.bottom > bRect.top
        ) {
            bubble.remove();
            score++;
            scoreDisplay.textContent = score;

            if (difficultySelect.value === "extreme") spawnBubblesExtreme();
        }
    });
}

// --- TIMER ---
function startTimer() {
    const timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// --- START GAME ---
function startGame() {
    const difficulty = difficultySelect.value;

    if (difficulty === "easy") { spawnRate = 1300; bubbleLife = 6000; }
    else if (difficulty === "medium") { spawnRate = 900; bubbleLife = 4500; }
    else if (difficulty === "hard") { spawnRate = 600; bubbleLife = 3500; }
    else if (difficulty === "extreme") { bubbleLife = 2500; }

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameInfo").style.display = "block";
    playground.style.display = "block";

    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    if (difficulty === "extreme") spawnBubblesExtreme();
    else bubbleInterval = setInterval(createBubble, spawnRate);

    startTimer();
}

// --- END GAME ---
function endGame() {
    clearInterval(bubbleInterval);
    playground.style.display = "none";
    document.getElementById("gameInfo").style.display = "none";
    document.getElementById("gameOver").style.display = "block";
    finalScore.textContent = score;
}

// --- RESTART GAME ---
function restartGame() {
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("startScreen").style.display = "block";
}

// --- BUTTON EVENTS ---
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);