document.addEventListener('DOMContentLoaded', () => {
    const healthBar = document.getElementById('health-bar');
    const foodBar = document.getElementById('food-bar');
    const happinessBar = document.getElementById('happiness-bar');
    const notification = document.getElementById('notification');
    const reviveBtn = document.getElementById('revive-btn');
  
    let health = 100;
    let food = 100;
    let happiness = 100;
  
    function updateBars() {
      healthBar.style.width = health + '%';
      foodBar.style.width = food + '%';
      happinessBar.style.width = happiness + '%';
  
      if (food < 50 && health > 0) {
        health -= 0.2;
      }
      if (food <= 0 && health > 0) {
        health -= 1;
      }
  
      if (food > 0) {
        food -= 1;
      }
  
      if (health <= 0) {
        notification.innerText = "I'm dying";
        notification.style.display = 'block';
        reviveBtn.classList.remove('hidden');
      } else {
        notification.style.display = 'none';
      }
    }
  
    setInterval(updateBars, 1000);
  
    reviveBtn.addEventListener('click', () => {
      health = 60;
      food = 60;
      happiness = 60;
      notification.innerText = 'Yayy!!';
      setTimeout(() => notification.style.display = 'none', 2000);
      reviveBtn.classList.add('hidden');
    });
  });
  