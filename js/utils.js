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

function attackAction(gamePlayer, opponentPlayer) {
  opponentPlayer.switchSprite("hitTaken");
  const healthBar =
    gamePlayer.name === "player" ? "enemyHealth" : "playerHealth";
  const healthBarElement = document.getElementById(healthBar);
  gamePlayer.isAttacking = false;
  opponentPlayer.health -= player.damage;
  console.log(opponentPlayer.health);
  if (opponentPlayer.health <= 0) {
    opponentPlayer.health = 0;
  }

  healthBarElement.style.width = opponentPlayer.health + "%";
  if (opponentPlayer.health <= 45) {
    healthBarElement.style.backgroundColor = "rgb(245 245 24)";
  }

  if (opponentPlayer.health <= 20) {
    healthBarElement.style.backgroundColor = "rgb(245 24 24)";
  }
  if (opponentPlayer.health <= 0) {
    opponentPlayer.death = true;
    opponentPlayer.switchSprite("death");
  }
}

function abilityCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.ability.position.x + rectangle1.ability.width >=
      rectangle2.position.x &&
    rectangle1.ability.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.ability.position.y + rectangle1.ability.height >=
      rectangle2.position.y &&
    rectangle1.ability.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function abilityCalculation(gamePlayer, opponentPlayer) {
  if (
    abilityCollision({
      rectangle1: gamePlayer,
      rectangle2: opponentPlayer,
    }) &&
    gamePlayer.isAbilitying &&
    !opponentPlayer.death &&
    !abilityInProgress
  ) {
    abilityInProgress = true;

    setTimeout(() => {
      abilityResult(gamePlayer, opponentPlayer);
      abilityInProgress = false;
    }, 250);
  }
}

function abilityResult(gamePlayer, opponentPlayer) {
  opponentPlayer.switchSprite("hitTaken");
  const healthBar =
    gamePlayer.name === "player" ? "enemyHealth" : "playerHealth";
  const healthBarElement = document.getElementById(healthBar);

  // Berechne den Schaden
  opponentPlayer.health -= gamePlayer.damage * 2;
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
  if (opponentPlayer.health <= 0) {
    opponentPlayer.death = true;
    opponentPlayer.switchSprite("death");
  }

  // Setze isAbilitying auf false
  gamePlayer.isAbilitying = false;
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
