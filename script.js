import { showToast, hideToast } from 'mark42';

let health = 100;
let food = 100;
let happiness = 100;
let coins = 0;
let level = 1;
let experience = 0;
let stepCount = 0;

const elements = {
    healthBar: document.querySelector('.health-bar'),
    foodBar: document.querySelector('.food-bar'),
    happinessBar: document.querySelector('.happiness-bar'),
    levelBar: document.querySelector('.level-bar'),
    feedButton: document.getElementById('feed-button'),
    playButton: document.getElementById('play-button'),
    medButton: document.getElementById('med-button'),
    reviveButton: document.getElementById('revive-button'),
    buyFoodButton: document.getElementById('buy-food'),
    buyToyButton: document.getElementById('buy-toy'),
    buyMedButton: document.getElementById('buy-med'),
    currencyAmount: document.getElementById('currency-amount'),
    levelDisplay: document.getElementById('level'),
    coinsToLevelUp: document.getElementById('coins-to-level-up'),
    menuButtons: document.querySelectorAll('.menu-button'),
    pages: document.querySelectorAll('.page')
};

function updateBars() {
    elements.healthBar.style.width = `${health}%`;
    elements.foodBar.style.width = `${food}%`;
    elements.happinessBar.style.width = `${happiness}%`;
}

function updateCurrency() {
    elements.currencyAmount.textContent = coins.toLocaleString();
}

function updateLevel() {
    elements.levelDisplay.textContent = level;
    elements.coinsToLevelUp.textContent = (level * 100000).toLocaleString();
    elements.levelBar.style.width = `${(experience / (level * 100)) * 100}%`;
}

function showPage(pageId) {
    elements.pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
}

elements.menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        showPage(button.getAttribute('data-page'));
    });
});

function decreaseFood() {
    if (food > 0) food -= 1;
    if (food < 50 && health > 0) health -= 0.2;
    if (food === 0 && health > 0) health -= 1;
    if (health <= 0) {
        health = 0;
        document.querySelector('.actions').style.display = 'none';
        elements.reviveButton.style.display = 'block';
    }
    updateBars();
}

function decreaseHappiness() {
    if (happiness > 0) happiness -= 5;
    if (happiness < 0) happiness = 0;
    if (health <= 0) {
        health = 0;
        document.querySelector('.actions').style.display = 'none';
        elements.reviveButton.style.display = 'block';
    }
    updateBars();
}

function feedPet() {
    if (health > 0) {
        food = Math.min(food + 10, 100);
        updateBars();
    }
}

function playWithPet() {
    if (health > 0) {
        happiness = Math.min(happiness + 10, 100);
        updateBars();
    }
}

function medPet() {
    if (health > 0) {
        health = Math.min(health + 10, 100);
        updateBars();
    }
}

function revivePet() {
    health = 60;
    food = 60;
    happiness = 60;
    document.querySelector('.actions').style.display = 'flex';
    elements.reviveButton.style.display = 'none';
    updateBars();
}

function earnCoins() {
    coins += 1; // Treat each step as a coin
    experience += 1;
    if (experience >= level * 100) {
        level++;
        experience = 0;
    }
    updateCurrency();
    updateLevel();
    showToast("Coins earned!", { duration: 2000 });
}

// Step detection and coin update
const handleMotion = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (acceleration) {
        const x = acceleration.x ?? 0;
        const y = acceleration.y ?? 0;
        const z = acceleration.z ?? 0;

        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > 12) { // Adjust threshold based on your testing
            stepCount += 1;
            earnCoins();
        }
    }
};

window.addEventListener('devicemotion', handleMotion);

// Cleanup event listener on page unload
window.addEventListener('beforeunload', () => {
    window.removeEventListener('devicemotion', handleMotion);
});

// Retrieve and display the user's Telegram username
window.Telegram.WebApp.ready(function() {
    const username = window.Telegram.WebApp.initDataUnsafe.user.username;
    document.getElementById('username').innerText = `${username} (CEO)`;
});

// Periodically decrease food and happiness
setInterval(decreaseFood, 1000);
setInterval(decreaseHappiness, 1000);

// Initial updates
updateBars();
updateCurrency();
updateLevel();
