let health = 100;
let food = 100;
let happiness = 100;

const healthBar = document.querySelector('.health-bar');
const foodBar = document.querySelector('.food-bar');
const happinessBar = document.querySelector('.happiness-bar');
const reviveButton = document.getElementById('revive-button');
const feedButton = document.getElementById('feed-button');

function updateBars() {
    healthBar.style.width = `${health}%`;
    foodBar.style.width = `${food}%`;
    happinessBar.style.width = `${happiness}%`;
}

function decreaseFood() {
    if (food > 0) {
        food -= 1;
    }
    if (food < 50 && health > 0) {
        health -= 0.2;
    }
    if (food === 0 && health > 0) {
        health -= 1;
    }
    if (health <= 0) {
        health = 0;
        document.getElementById('revive-button').style.display = 'block';
    }
    updateBars();
}

function feedPet() {
    food = 100;
    updateBars();
}

function revivePet() {
    health = 60;
    food = 60;
    happiness = 60;
    document.getElementById('revive-button').style.display = 'none';
    updateBars();
}

feedButton.addEventListener('click', feedPet);
reviveButton.addEventListener('click', revivePet);

setInterval(decreaseFood, 1000);
updateBars();
