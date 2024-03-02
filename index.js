let attackInProgress = false;
let attack2inProgress = false;
let abilityInProgress = false;

player.name = "player";
enemy.name = "enemy";

abilityFireBall.name = "player";
abilityFireBalle.name = "enemy";

const backgroundImg = new Image();

backgroundImg.src = "Animation/Background.png";
backgroundImg.onload = function () {
  // Erstelle das Muster, nachdem das Bild geladen wurde
  const pattern = ctx.createPattern(backgroundImg, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const gravity = 1;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
  Space: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
  minus: {
    pressed: false,
  },
  y: {
    pressed: false,
  },
  m: {
    pressed: false,
  },
};

setTimeout(() => {
  decreaseTime();

  function animate() {
    // game loop
    window.requestAnimationFrame(animate);
    ctx.fillRect(0, 0, canvas.width, canvas.height); // clear canvas doesn't draw over itself

    // draw here
    background.update();
    shop.update();
    player.update();
    abilityFireBall.update();
    enemy.update();
    abilityFireBalle.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (player.death) {
      player.switchSprite("death");
    } else {
      // player movement
      if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -10;
        player.switchSprite("run");
      } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 10;
        player.switchSprite("run");
      } else if (keys.Space.pressed && player.lastKey === " ") {
        player.switchSprite("attack1");
      } else if (keys.q.pressed && player.lastKey === "q") {
        player.switchSprite("attack2");
      } else {
        player.switchSprite("idle");
      }

      if (player.velocity.y < 0) {
        player.switchSprite("jump");
      } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
      }
    }

    if (player.cooldownattack2 < 500 && player.cooldownattack2 !== 0) {
      console.log(player.cooldownattack2 + " " + player.initialcooldownattack2);
      const colldownTimeLeft =
        player.cooldownattack2 / player.initialcooldownattack2;
      const colldownTimeLeftInDegrees = 360 * colldownTimeLeft;
      attack2CooldownBox.style.setProperty(
        "--cooldown",
        colldownTimeLeftInDegrees + "deg"
      );
    } else if (player.cooldownattack2 === 0 || player.cooldownattack2 === 500) {
      attack2CooldownBox.style.setProperty("--cooldown", "360deg");
    }

    if (abilityFireBall.cooldown < 1000 && abilityFireBall.cooldown !== 0) {
      const colldownTimeLeft = abilityFireBall.cooldown / 1000;
      const colldownTimeLeftInDegrees = 360 * colldownTimeLeft;
      abilityCooldownBox.style.setProperty(
        "--cooldown",
        colldownTimeLeftInDegrees + "deg"
      );
    } else if (abilityFireBall.cooldown === 0 || abilityFireBall.cooldown === 1000) {
      abilityCooldownBox.style.setProperty("--cooldown", "360deg");
    }

    if (enemy.death) {
      enemy.switchSprite("death");
    } else {
      // enemy movement
      if (keys.ArrowLeft.pressed && enemy.lastKey === "arrowleft") {
        enemy.velocity.x = -10;
        enemy.switchSprite("run");
      } else if (keys.ArrowRight.pressed && enemy.lastKey === "arrowright") {
        enemy.velocity.x = 10;
        enemy.switchSprite("run");
      } else if (keys.ArrowDown.pressed && enemy.lastKey === "arrowdown") {
        enemy.switchSprite("attack1");
      } else if (keys.minus.pressed && enemy.lastKey === "-") {
        enemy.switchSprite("attack2");
      } else {
        enemy.switchSprite("idle");
      }
    }

    if (enemy.velocity.y < 0) {
      enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite("fall");
    }

    if (enemy.cooldownattack2 < 500 && enemy.cooldownattack2 !== 0) {
      const colldownTimeLeft =
        enemy.cooldownattack2 / enemy.initialcooldownattack2;
      const colldownTimeLeftInDegrees = 360 * colldownTimeLeft;
      attack2CooldownBoxEnemy.style.setProperty(
        "--cooldown",
        colldownTimeLeftInDegrees + "deg"
      );
    } else if (enemy.cooldownattack2 === 0 || enemy.cooldownattack2 === 500) {
      attack2CooldownBoxEnemy.style.setProperty("--cooldown", "360deg");
    }

    if (abilityFireBalle.cooldown < 1000 && abilityFireBalle.cooldown !== 0) {
      const colldownTimeLeft = abilityFireBalle.cooldown / 1000;
      const colldownTimeLeftInDegrees = 360 * colldownTimeLeft;
      abilityCooldownBoxEnemy.style.setProperty(
        "--cooldown",
        colldownTimeLeftInDegrees + "deg"
      );
    } else if (abilityFireBalle.cooldown === 0 || abilityFireBalle.cooldown === 1000) {
      abilityCooldownBoxEnemy.style.setProperty("--cooldown", "360deg");
    }

    // collision detection and attack calculations
    attackCalculation(player, enemy);
    attackCalculation(enemy, player);

    attack2Calculation(player, enemy);
    attack2Calculation(enemy, player);

    abilityCalculation(abilityFireBall, enemy);
    abilityCalculation(abilityFireBalle, player);

    // cooldowns
    player.cooldownattack2 = cooldownAttacker(player.cooldownattack2);
    enemy.cooldownattack2 = cooldownAttacker(enemy.cooldownattack2);
    abilityFireBall.cooldown = cooldownAttacker(abilityFireBall.cooldown);
    abilityFireBalle.cooldown = cooldownAttacker(abilityFireBalle.cooldown);

    // end game by health
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
    }
  }

  animate();

  function doubleJumpCalculation(player) {
    if (player.position.y === 360) {
      player.doubleJump = null;
    }
    if (
      player.doubleJump === jumpStates.firstJump ||
      player.doubleJump === null
    ) {
      player.velocity.y = -15;
      player.doubleJump =
        player.doubleJump === jumpStates.firstJump
          ? jumpStates.secondJump
          : player.doubleJump === null
          ? jumpStates.firstJump
          : null;
    }
  }

  // event listeners
  window.addEventListener("keydown", (event) => {
    if (!player.death) {
      switch (event.key.toLowerCase()) {
        case "d":
          player.scaleX = 1;
          keys.d.pressed = true;
          player.lastKey = "d";
          break;
        case "a":
          player.scaleX = -1;
          keys.a.pressed = true;
          player.lastKey = "a";
          break;
        case "w":
          doubleJumpCalculation(player);
          break;
        case " ":
          if (
            !player.img.src.includes("Attack1.png") &&
            !player.attackInProgress
          ) {
            keys.Space.pressed = true;
            player.lastKey = " ";
            player.attack();
            setTimeout(() => {
              keys.Space.pressed = false;
            }, 300);
          }
          break;
        case "q":
          if (player.cooldownattack2 === 0 && !player.attack2inProgress) {
            keys.q.pressed = true;
            player.lastKey = "q";
            player.attackTwo();
            player.cooldownattack2 = player.initialcooldownattack2;
            setTimeout(() => {
              keys.q.pressed = false;
            }, 100);
          }
          break;
        case "y":
          if (abilityFireBall.cooldown === 0 && !abilityInProgress) {
            keys.y.pressed = true;
            abilityFireBall.cooldown = 0;
            abilityFireBall.ability();
            if (player.scaleX === 1) {
              abilityFireBall.velocity.x = 15;
            } else if (player.scaleX === -1) {
              abilityFireBall.velocity.x = -15;
            }
            abilityFireBall.cooldown = 1000;
          }
          break;
      }
    }

    if (!enemy.death) {
      switch (event.key.toLowerCase()) {
        case "arrowright":
          enemy.scaleX = -1;
          keys.ArrowRight.pressed = true;
          enemy.lastKey = "arrowright";
          break;
        case "arrowleft":
          enemy.scaleX = 1;
          keys.ArrowLeft.pressed = true;
          enemy.lastKey = "arrowleft";
          break;
        case "arrowup":
          doubleJumpCalculation(enemy);
          break;
        case "arrowdown":
          if (
            !enemy.img.src.includes("Attack1.png") &&
            !enemy.attackInProgress
          ) {
            keys.ArrowDown.pressed = true;
            enemy.lastKey = "arrowdown";
            enemy.attack();
            setTimeout(() => {
              keys.ArrowDown.pressed = false;
            }, 100);
          }
          break;
        case "-":
          if (enemy.cooldownattack2 === 0 && !enemy.attack2inProgress) {
            keys.minus.pressed = true;
            enemy.lastKey = "-";
            enemy.attackTwo();
            enemy.cooldownattack2 = enemy.initialcooldownattack2;
            setTimeout(() => {
              keys.minus.pressed = false;
            }, 100);
          }
          break;
        case "m":
          if (abilityFireBalle.cooldown === 0 && !abilityInProgress) {
            keys.m.pressed = true;
            abilityFireBalle.cooldown = 0;
            abilityFireBalle.ability();
            if (enemy.scaleX === 1) {
              abilityFireBalle.velocity.x = -15;
            } else if (enemy.scaleX === -1) {
              abilityFireBalle.velocity.x = 15;
            }
            abilityFireBalle.cooldown = 1000;
          }
          break;
      }
    }
  });

  window.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
      case "d":
        keys.d.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "arrowright":
        keys.ArrowRight.pressed = false;
        break;
      case "arrowleft":
        keys.ArrowLeft.pressed = false;
        break;
      case " ":
        keys.Space.pressed = false;
        break;
      case "arrowdown":
        keys.ArrowDown.pressed = false;
        break;
      case "q":
        keys.q.pressed = false;
        break;
      case "-":
        keys.minus.pressed = false;
        break;
      case "y":
        keys.y.pressed = false;
        break;
      case "m":
        keys.m.pressed = false;
        break;
    }
  });
});
