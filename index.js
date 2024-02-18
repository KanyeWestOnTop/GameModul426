const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // better naming convention
let newPlayerScale = 1;

let attackInProgress = false;
let attack2inProgress = false;
let abilityInProgress = false;

canvas.width = window.innerWidth * 0.8;
canvas.height = 576; // 16:9

const backgroundImg = new Image();
backgroundImg.src = "Animation/Background.png";
backgroundImg.onload = function () {
  // Erstelle das Muster, nachdem das Bild geladen wurde
  const pattern = ctx.createPattern(backgroundImg, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const gravity = 0.6;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "Animation/Background.png",
});

const shop = new Sprite({
  position: {
    x: canvas.width * 0.7,
    y: 96,
  },
  imgSrc: "Animation/shop.png",
  scale: 3,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: canvas.width * 0.1,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  imgSrc: "Animation/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2,
  offset: {
    x: 180,
    y: 125,
  },
  sprites: {
    idle: {
      imgSrc: "Animation/samuraiMack/idle.png",
      framesMax: 8,
    },
    run: {
      imgSrc: "Animation/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "Animation/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "Animation/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "Animation/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    hitTaken: {
      imgSrc: "Animation/samuraiMack/HitTakenCum.png",
      framesMax: 4,
    },
    death: {
      imgSrc: "Animation/samuraiMack/Death.png",
      framesMax: 6,
    },
    attack2: {
      imgSrc: "Animation/samuraiMack/Attack2.png",
      framesMax: 6,
    },
  },
  name: "player",
  attackBox: {
    width: 150,
    height: 50,
    offset: {
      x: 40,
      y: 40,
    },
  },
  damage: 7.5,
  attack2: {
    width: 190,
    height: 50,
    offset: {
      x: 0,
      y: 40,
    },
    damage: 40,
  },
  cooldownattack2: 0,
  initialcooldownattack2: 500,
});

const enemy = new Fighter({
  position: {
    x: canvas.width * 0.9,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  imgSrc: "Animation/kenji/idle.png",
  framesMax: 4,
  scale: 2,
  scaleX1: 1,
  offset: {
    x: 180,
    y: 137,
  },
  sprites: {
    idle: {
      imgSrc: "Animation/kenji/idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "Animation/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "Animation/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "Animation/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "Animation/kenji/Attack1.png",
      framesMax: 4,
    },
    hitTaken: {
      imgSrc: "Animation/kenji/HitTaken.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "Animation/kenji/Death.png",
      framesMax: 7,
    },
    attack2: {
      imgSrc: "Animation/kenji/Attack2.png",
      framesMax: 4,
    },
  },
  name: "enemy",
  attackBox: {
    width: 150,
    height: 50,
    offset: {
      x: -150,
      y: 40,
    },
  },
  damage: 5,
  attack2: {
    width: 150,
    height: 50,
    offset: {
      x: -150,
      y: 40,
    },
    damage: 40,
  },
  cooldownattack2: 0,
  initialcooldownattack2: 500,
});


const abilityFireBall = new Abilities({
  position: {
    x: player.position.x,
    y: player.position.y,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imgSrc: "Animation/samuraiMack/FireBall.png",
  framesMax: 1,
  scale: 1,
  sprites: {
    idle: {
      imgSrc: "Animation/samuraiMack/FireBall.png",
      framesMax: 1,
    },
  },
  name: "fireball",
  abilityBox: {
    offset: {
      x: player.height / 3,
      y: player.width,
    },
    width: 50,
    height: 50,
  },
  damage: 50,
  cooldown: 0,
});

const abilityFireBalle = new Abilities({
  position: {
    x: enemy.position.x,
    y: enemy.position.y,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imgSrc: "Animation/samuraiMack/FireBall.png",
  framesMax: 1,
  scale: 1,
  sprites: {
    idle: {
      imgSrc: "Animation/samuraiMack/FireBall.png",
      framesMax: 1,
    },
  },
  name: "waterball",
  abilityBox: {
    offset: {
      x: enemy.height / 3,
      y: enemy.width,
    },
    width: 50,
    height: 50,
  },
  damage: 50,
  cooldown: 0,
});

player.name = "player";
enemy.name = "enemy";

abilityFireBall.name = "player";
abilityFireBalle.name = "enemy";


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
        player.velocity.x = -5;
        player.switchSprite("run");
      } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
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
    if (enemy.death) {
      enemy.switchSprite("death");
    } else {
      // enemy movement
      if (keys.ArrowLeft.pressed && enemy.lastKey === "arrowleft") {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
      } else if (keys.ArrowRight.pressed && enemy.lastKey === "arrowright") {
        enemy.velocity.x = 5;
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

    // collision detection
    attackCalculation(player, enemy);
    attackCalculation(enemy, player);

    attack2Calculation(player, enemy);
    attack2Calculation(enemy, player);

    abilityCalculation(abilityFireBall, enemy);
    abilityCalculation(abilityFireBalle, player);

    // cooldowns
    attack2Cooldown(player);
    attack2Cooldown(enemy);
    abilityCooldown(abilityFireBall);
    abilityCooldown(abilityFireBalle);

    // end game by health
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
    }
  }

  animate();

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
          keys.Space.pressed = true;
          player.lastKey = " ";
          player.attack();
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
              abilityFireBall.velocity.x = 9;
            } else if (player.scaleX === -1) {
              abilityFireBall.velocity.x = -9;
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
          keys.ArrowDown.pressed = true;
          enemy.lastKey = "arrowdown";
          enemy.attack();
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
              abilityFireBalle.velocity.x = -9;
            } else if (enemy.scaleX === -1) {
              abilityFireBalle.velocity.x = 9;
            }
            abilityFireBalle.cooldown = 1000;
          }
          break;
      }
    }
  });

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
}, 0);
