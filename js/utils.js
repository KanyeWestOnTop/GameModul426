// attack collision detection function
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function attack2Collision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attack2.position.x + rectangle1.attack2.width >=
      rectangle2.position.x &&
    rectangle1.attack2.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attack2.position.y + rectangle1.attack2.height >=
      rectangle2.position.y &&
    rectangle1.attack2.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function abilityCollision(rectangle1, rectangle2) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function attackCalculation(gamePlayer, opponentPlayer) {
  if (
    rectangularCollision({
      rectangle1: gamePlayer,
      rectangle2: opponentPlayer,
    }) &&
    gamePlayer.isAttacking &&
    !opponentPlayer.death &&
    !attackInProgress
  ) {
    attackInProgress = true;

    if (gamePlayer.framesMax > 3) {
      setTimeout(() => {
        attackAction(gamePlayer, opponentPlayer);
        attackInProgress = false;
      }, 250);
    } else {
      attackAction(gamePlayer, opponentPlayer);
      attackInProgress = false;
    }
  }
}

function attack2Calculation(gamePlayer, opponentPlayer) {
  if (
    attack2Collision({
      rectangle1: gamePlayer,
      rectangle2: opponentPlayer,
    }) &&
    gamePlayer.isAttacking2 &&
    !opponentPlayer.death &&
    !attack2inProgress
  ) {
    attack2inProgress = true;

    setTimeout(() => {
      attack2Result(gamePlayer.attack2, opponentPlayer);
      attack2inProgress = false;
    }, 100);
  }
}

function abilityCalculation(ability, opponentPlayer) {
  if (
    abilityCollision(ability, opponentPlayer) &&
    ability.isUsingAbility &&
    !opponentPlayer.death &&
    !abilityInProgress
  ) {
    abilityInProgress = true;

    ability.isUsingAbility = false;

    setTimeout(() => {
      abilityResult(ability, opponentPlayer);
      abilityInProgress = false;
    }, 100);
  }
}
function attackAction(gamePlayer, opponentPlayer) {
  showHealthBar(gamePlayer, opponentPlayer);
}

function attack2Result(gamePlayer, opponentPlayer) {
  showHealthBar(gamePlayer, opponentPlayer);
}

function abilityResult(ability, opponentPlayer) {
  showHealthBar(ability, opponentPlayer);
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
    healthBarElement.style.backgroundColor = "rgb(245 245 24)";
  }

  if (opponentPlayer.health <= 20) {
    healthBarElement.style.backgroundColor = "rgb(245 24 24)";
  }
  if (opponentPlayer.health === 0) {
    opponentPlayer.death = true;
    opponentPlayer.switchSprite("death");
  }
}





function attack2Cooldown(player) {
  if (player.cooldownattack2 > 0) {
    player.cooldownattack2--;
  }
}

function abilityCooldown(player) {
  if (player.cooldown > 0) {
    player.cooldown--;
  }
}

// determine winner
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#result").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#result").innerHTML = "It's a tie!";
  } else if (player.health > enemy.health) {
    document.querySelector("#result").innerHTML = "Player1 wins!";
  } else if (player.health < enemy.health) {
    document.querySelector("#result").innerHTML = "Player2 wins!";
  }
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
