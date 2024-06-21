window.addEventListener('DOMContentLoaded', (event) => {
    window.TelegramLoginWidget = {
        onLogin: function(user) {
            // User is authenticated, hide the login button and show the game UI
            document.getElementById('telegram-login-button').style.display = 'none';
            document.querySelector('.stats').style.display = 'flex';
            document.querySelector('.currency').style.display = 'block';
            document.querySelector('.pet').style.display = 'block';
            document.querySelector('.bars').style.display = 'block';
            document.querySelector('.actions').style.display = 'flex';
            
            // Display the user's Telegram username
            document.getElementById('username').innerText = `${user.username} (CEO)`;
        }
    };

    // Initialize the game UI components
    let health = 100;
    let food = 100;
    let happiness = 100;

    const healthBar = document.querySelector('.health-bar');
    const foodBar = document.querySelector('.food-bar');
    const happinessBar = document.querySelector('.happiness-bar');
    const feedButton = document.getElementById('feed-button');
    const playButton = document.getElementById('play-button');
    const medButton = document.getElementById('med-button');
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
        if (food < 50 && health > 0) {
            health -= 0.2;
        }
        if (food === 0 && health > 0) {
            health -= 1;
        }
        if (health <= 0) {
            health = 0;
            document.querySelector('.actions').style.display = 'none';
            reviveButton.style.display = 'block';
        }
        updateBars();
    }

    function decreaseHappiness() {
        if (happiness > 0) {
            happiness -= 5;
        }
        if (happiness < 0) {
            happiness = 0;
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
        reviveButton.style.display = 'none';
        updateBars();
    }

    feedButton.addEventListener('click', feedPet);
    playButton.addEventListener('click', playWithPet);
    medButton.addEventListener('click', medPet);
    reviveButton.addEventListener('click', revivePet);

    setInterval(decreaseFood, 1000);
    setInterval(decreaseHappiness, 1000);
    updateBars();
});
