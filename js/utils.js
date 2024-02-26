// attack collision detection function
function rectangularCollision(rectangle1, rectangle2) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function attackCalculation(gamePlayer, opponentPlayer) {
  if (
    rectangularCollision(gamePlayer.attackBox, opponentPlayer) &&
    gamePlayer.isAttacking &&
    !opponentPlayer.death &&
    !attackInProgress
  ) {
    attackInProgress = true;

    if (gamePlayer.framesMax > 3) {
      setTimeout(() => {
        showHealthBar(gamePlayer, opponentPlayer);
        attackInProgress = false;
      }, 250);
    }
  }
}

function attack2Calculation(gamePlayer, opponentPlayer) {
  if (
    rectangularCollision(gamePlayer.attack2, opponentPlayer) &&
    gamePlayer.isAttacking2 &&
    !opponentPlayer.death &&
    !attack2inProgress
  ) {
    attack2inProgress = true;

    setTimeout(() => {
      showHealthBar(gamePlayer.attack2, opponentPlayer);
      attack2inProgress = false;
    }, 100);
  }
}

function abilityCalculation(ability, opponentPlayer) {
  if (
    rectangularCollision(ability, opponentPlayer) &&
    ability.isUsingAbility &&
    !opponentPlayer.death &&
    !abilityInProgress
  ) {
    abilityInProgress = true;

    ability.isUsingAbility = false;

    setTimeout(() => {
      showHealthBar(ability, opponentPlayer);
      abilityInProgress = false;
    }, 100);
  }
}

function showHealthBar(attack, opponentPlayer) {
  opponentPlayer.switchSprite("hitTaken");
  const healthBar =
    opponentPlayer.name !== "player" ? "enemyHealth" : "playerHealth";
  const healthBarElement = document.getElementById(healthBar);

  opponentPlayer.health -= attack.damage;

  if (opponentPlayer.health <= 0) {
    opponentPlayer.health = 0;
  }

  // Aktualisiere die Anzeige der Lebensleiste
  healthBarElement.style.width = opponentPlayer.health + "%";
  if (opponentPlayer.health <= 45) {
    healthBarElement.classList.add("currHealth--halfHP");
  }

  if (opponentPlayer.health <= 20) {
    healthBarElement.classList.add("currHealth--criticalHP");
  }
  if (opponentPlayer.health === 0) {
    opponentPlayer.death = true;
    opponentPlayer.switchSprite("death");
  }
}

function cooldownAttacker(cooldown) {
  console.log(cooldown);
  if (cooldown > 0) {
    cooldown--;
  }
  return cooldown;
}

// determine winner
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);

  result.classList.add("result--active");
  if (player.health === enemy.health) {
    result.innerHTML = "It's a tie!";
  } else if (player.health > enemy.health) {
    result.innerHTML = "Player1 wins!";
  } else if (player.health < enemy.health) {
    result.innerHTML = "Player2 wins!";
  }
}

// show cooldowns
function showCooldown() {
  
}

// timer
let time = 30;
let timerId;
function decreaseTime() {
  if (time > 0) {
    time--;
    timerId = setTimeout(decreaseTime, 1000);
    document.querySelector("#timer").innerHTML = time;
  }

  if (time === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
