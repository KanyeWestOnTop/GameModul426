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

function attack2Calculation(gamePlayer, opponentPlayer) {
  if (
    attack2Collision({
      rectangle1: gamePlayer,
      rectangle2: opponentPlayer,
    }) &&
    gamePlayer.isAttacking2 &&
    !opponentPlayer.death &&
    !attack2inProgress &&
    gamePlayer.name === "player" &&
    gamePlayer.framesCurrent === 4

  ) {
    attack2inProgress = true;

    setTimeout(() => {
      attack2Result(gamePlayer, opponentPlayer);
      attack2inProgress = false;
    }, 250);
  } else if ( 
    attack2Collision({
      rectangle1: gamePlayer,
      rectangle2: opponentPlayer,
    }) &&
    gamePlayer.isAttacking2 &&
    !opponentPlayer.death &&
    !attack2inProgress &&
    gamePlayer.name === "enemy" &&
    gamePlayer.framesCurrent === 0
  ) {
    attack2inProgress = true;

    setTimeout(() => {
      attack2Result(gamePlayer, opponentPlayer);
      attack2inProgress = false;
    }, 250);
  }

}

function attack2Result(gamePlayer, opponentPlayer) {
  opponentPlayer.switchSprite("hitTaken");
  const healthBar =
    gamePlayer.name === "player" ? "enemyHealth" : "playerHealth";
  const healthBarElement = document.getElementById(healthBar);

  // Berechne den Schaden
  if (gamePlayer.name === "player") {
    opponentPlayer.health -= gamePlayer.damage * 3;
  } else {
  opponentPlayer.health -= gamePlayer.damage * 2;
  }
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

  // Setze isAttacking2 auf false
  gamePlayer.isAttacking2 = false;
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
