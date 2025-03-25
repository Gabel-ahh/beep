// Game state variables
let score = 0;              // Player's current score (cookies)
let autoClickers = 0;       // Number of auto clickers owned
let multiplier = 1;         // Click multiplier value
let autoClickerCost = 10;   // Base cost of auto clicker
let multiplierCost = 50;    // Base cost of multiplier
let megaClickerCost = 200;
let goldenChanceCost = 150;
let goldenChance = 1;
let achievements = new Set();

// Get DOM elements
const scoreElement = document.getElementById('score');
const cpsElement = document.getElementById('cps');
const clickerButton = document.getElementById('clickerButton');
const autoClickerButton = document.getElementById('autoClickerUpgrade');
const multiplierButton = document.getElementById('multiplierUpgrade');
const autoClickerCostElement = document.getElementById('autoClickerCost');
const multiplierCostElement = document.getElementById('multiplierCost');
const megaClickerButton = document.getElementById('megaClickerUpgrade');
const goldenChanceButton = document.getElementById('goldenChanceUpgrade');
const clickEffects = document.getElementById('clickEffects');
const achievementsDiv = document.getElementById('achievements');

// Enhanced click function with effects
clickerButton.addEventListener('click', (e) => {
    score += multiplier;
    createClickEffect(e);
    checkAchievements();
    updateDisplay();
});

// Create floating number effect
function createClickEffect(e) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.innerHTML = `+${multiplier}`;
    effect.style.left = `${e.clientX}px`;
    effect.style.top = `${e.clientY}px`;
    clickEffects.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

// Auto Clicker upgrade
autoClickerButton.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickers++;
        autoClickerCost = Math.floor(autoClickerCost * 1.5); // Increase cost for next purchase
        autoClickerCostElement.textContent = autoClickerCost;
        updateDisplay();
    }
});

// Multiplier upgrade
multiplierButton.addEventListener('click', () => {
    if (score >= multiplierCost) {
        score -= multiplierCost;
        multiplier++;
        multiplierCost = Math.floor(multiplierCost * 2); // Increase cost for next purchase
        multiplierCostElement.textContent = multiplierCost;
        updateDisplay();
    }
});

// New upgrade: Mega Clicker
megaClickerButton.addEventListener('click', () => {
    if (score >= megaClickerCost) {
        score -= megaClickerCost;
        multiplier *= 2;
        megaClickerCost *= 3;
        updateDisplay();
    }
});

// New upgrade: Golden Cookie Chance
goldenChanceButton.addEventListener('click', () => {
    if (score >= goldenChanceCost) {
        score -= goldenChanceCost;
        goldenChance += 1;
        goldenChanceCost *= 2;
        updateDisplay();
    }
});

// Auto clicker function - runs every second
setInterval(() => {
    score += autoClickers * multiplier;
    updateDisplay();
}, 1000);

// Golden Cookie spawning
setInterval(() => {
    if (Math.random() * 100 < goldenChance) {
        spawnGoldenCookie();
    }
}, 10000);

function spawnGoldenCookie() {
    const cookie = document.createElement('div');
    cookie.className = 'golden-cookie';
    cookie.innerHTML = '🍪';
    cookie.style.filter = 'brightness(200%) hue-rotate(45deg)';
    cookie.style.left = `${Math.random() * 80}vw`;
    cookie.style.top = `${Math.random() * 80}vh`;
    
    cookie.onclick = () => {
        score += multiplier * 100;
        cookie.remove();
        addAchievement('Lucky!', 'Clicked a golden cookie');
        updateDisplay();
    };
    
    document.body.appendChild(cookie);
    setTimeout(() => cookie.remove(), 5000);
}

// Achievement system
function addAchievement(title, description) {
    const achievementKey = `${title}-${description}`;
    if (!achievements.has(achievementKey)) {
        achievements.add(achievementKey);
        const achievement = document.createElement('div');
        achievement.className = 'achievement';
        achievement.innerHTML = `🏆 ${title}: ${description}`;
        achievementsDiv.appendChild(achievement);
        setTimeout(() => achievement.remove(), 5000);
    }
}

function checkAchievements() {
    if (score >= 1000) addAchievement('Cookie Master', 'Reach 1,000 cookies');
    if (score >= 10000) addAchievement('Cookie God', 'Reach 10,000 cookies');
    if (autoClickers >= 10) addAchievement('Automated', 'Own 10 auto clickers');
    if (multiplier >= 10) addAchievement('Multiplier Master', 'Reach 10x multiplier');
}

// Enhanced update display function
function updateDisplay() {
    scoreElement.textContent = Math.floor(score);
    cpsElement.textContent = autoClickers * multiplier;
    
    // Update button states based on affordability
    autoClickerButton.disabled = score < autoClickerCost;
    multiplierButton.disabled = score < multiplierCost;
    document.getElementById('goldenChance').textContent = goldenChance;
    megaClickerButton.disabled = score < megaClickerCost;
    goldenChanceButton.disabled = score < goldenChanceCost;
}

// Save game progress every 30 seconds
setInterval(() => {
    localStorage.setItem('cookieClickerSave', JSON.stringify({
        score,
        autoClickers,
        multiplier,
        autoClickerCost,
        multiplierCost,
        goldenChance,
        achievements: Array.from(achievements)
    }));
}, 30000);

// Load saved game on start
window.onload = () => {
    const savedGame = localStorage.getItem('cookieClickerSave');
    if (savedGame) {
        const gameData = JSON.parse(savedGame);
        score = gameData.score;
        autoClickers = gameData.autoClickers;
        multiplier = gameData.multiplier;
        autoClickerCost = gameData.autoClickerCost;
        multiplierCost = gameData.multiplierCost;
        goldenChance = gameData.goldenChance || 1;
        if (gameData.achievements) {
            achievements = new Set(gameData.achievements);
        }
        updateDisplay();
    }
};
