// collision detection function
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
    gamePlayer.isAttacking
  ) {
    opponentPlayer.switchSprite("hitTaken");
    const healthBar =
      gamePlayer.name === "player" ? "enemyHealth" : "playerHealth";
    const healthBarElement = document.getElementById(healthBar);
    gamePlayer.isAttacking = false;
    opponentPlayer.health -= 10;
    healthBarElement.style.width = opponentPlayer.health + "%";

    if (opponentPlayer.health <= 0) {
      opponentPlayer.death = true;
      opponentPlayer.switchSprite("death");
    }
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
