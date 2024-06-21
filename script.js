let health = 100;
let food = 100;
let happiness = 100;
let isReviveVisible = false;

const healthBar = document.getElementById('health-bar');
const foodBar = document.getElementById('food-bar');
const happinessBar = document.getElementById('happiness-bar');
const notification = document.getElementById('notification');
const reviveButton = document.getElementById('revive-button');

function updateBars() {
    healthBar.style.width = `${health}%`;
    foodBar.style.width = `${food}%`;
    happinessBar.style.width = `${happiness}%`;
}

function decreaseFood() {
    if (food > 0) {
        food -= 1;
    }
}

function decreaseHealth() {
    if (food < 50 && food > 0) {
        health -= 0.2;
    } else if (food === 0) {
        health -= 1;
    }
    if (health <= 0 && !isReviveVisible) {
        notification.innerText = "I'm dying";
        reviveButton.classList.remove('hidden');
        isReviveVisible = true;
    }
}

function revivePet() {
    health = 60;
    food = 60;
    happiness = 60;
    notification.innerText = "Yayy!!";
    reviveButton.classList.add('hidden');
    isReviveVisible = false;
    updateBars();
}

setInterval(() => {
    decreaseFood();
    if (food < 50) {
        decreaseHealth();
    }
    updateBars();
}, 1000);

reviveButton.addEventListener('click', revivePet);

updateBars();
