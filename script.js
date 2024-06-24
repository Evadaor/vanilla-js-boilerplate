import { showToast, hideToast } from 'mark42';

let health = 100;
let food = 100;
let happiness = 100;
let coins = 46644;
let level = 1;
let experience = 0;

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
        page.classList.toggle('active', page.id === pageId);
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
    coins += 3;
    experience += 3;
    if (experience >= level * 100) {
        level++;
        experience = 0;
    }
    updateCurrency();
    updateLevel();
    showToast("Coins earned!", { duration: 2000 });
}

// Shake detection
let lastShakeTime = new Date().getTime();
const shakeThreshold = 15;
const shakeTimeout = 1000;

function handleMotionEvent(event) {
    const { acceleration } = event;
    if (!acceleration) return;

    const currentTime = new Date().getTime();
    if (currentTime - lastShakeTime > shakeTimeout) {
        const shakeMagnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
        if (shakeMagnitude > shakeThreshold) {
            lastShakeTime = currentTime;
            earnCoins();
        }
    }
}

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', handleMotionEvent, false);
} else {
    alert('DeviceMotionEvent is not supported on your device.');
}

function initEventListeners() {
    elements.feedButton.addEventListener('click', feedPet);
    elements.playButton.addEventListener('click', playWithPet);
    elements.medButton.addEventListener('click', medPet);
    elements.reviveButton.addEventListener('click', revivePet);

    elements.buyFoodButton.addEventListener('click', () => {
        if (coins >= 10) {
            coins -= 10;
            food = Math.min(food + 10, 100);
            updateCurrency();
            updateBars();
        }
    });

    elements.buyToyButton.addEventListener('click', () => {
        if (coins >= 15) {
            coins -= 15;
            happiness = Math.min(happiness + 10, 100);
            updateCurrency();
            updateBars();
        }
    });

    elements.buyMedButton.addEventListener('click', () => {
        if (coins >= 20) {
            coins -= 20;
            health = Math.min(health + 10, 100);
            updateCurrency();
            updateBars();
        }
    });

    // Retrieve and display the user's Telegram username
    window.Telegram.WebApp.ready(function() {
        const username = window.Telegram.WebApp.initDataUnsafe.user.username;
        document.getElementById('username').innerText = `${username} (CEO)`;
    });

    // Periodically decrease food and happiness
    setInterval(decreaseFood, 1000);
    setInterval(decreaseHappiness, 1000);
}

// Initial updates
function init() {
    updateBars();
    updateCurrency();
    updateLevel();
    initEventListeners();
}

// Run initial setup
init();
