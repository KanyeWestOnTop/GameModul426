const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // better naming convention
let newPlayerScale = 1;

canvas.width = 1024;
canvas.height = 576; // 16:9

ctx.fillRect(0, 0, canvas.width, canvas.height); // background

const gravity = 0.5;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "Animation/Background.png",
});

const shop = new Sprite({
  position: {
    x: 625,
    y: 96,
  },
  imgSrc: "Animation/shop.png",
  scale: 3,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: 0,
    y: 0,
  },
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
  },
  name: "player",
});
player.name = "player";

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -60,
    y: 0,
  },
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
  },
});
enemy.name = "enemy";

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
};

decreaseTime();

function animate() {
  // game loop
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // clear canvas doesn't draw over itself

  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else if (keys.Space.pressed && player.lastKey === " ") {
    player.switchSprite("attack1");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "arrowleft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "arrowright") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else if (keys.ArrowDown.pressed && enemy.lastKey === "arrowdown") {
    enemy.switchSprite("attack1");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // collision detection
  attackCalculation(player, enemy);
  attackCalculation(enemy, player);

  // end game by health
  if (enemy.health === 0 || player.health === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();


// event listeners
window.addEventListener("keydown", (event) => {
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
      player.velocity.y = -15;
      break;
    case " ":
      keys.Space.pressed = true;
      player.lastKey = " ";
      player.attack();
      break;
    case "arrowright":
      enemy.scaleX = 1;
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "arrowright";
      break;
    case "arrowleft":
      enemy.scaleX = -1;
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "arrowleft";
      break;
    case "arrowup":
      enemy.velocity.y = -15;
      break;
    case "arrowdown":
      keys.ArrowDown.pressed = true;
      enemy.lastKey = "arrowdown";
      enemy.attack();
      break;
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
  }
});
