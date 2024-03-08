const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // better naming convention

const result = document.getElementById("result");
const gameOver = document.getElementById("gameOver");

const attack2CooldownBox = document.querySelector(".playerCooldownAttack2");
const abilityCooldownBox = document.querySelector(".playerCooldownAbility");

const attack2CooldownBoxEnemy = document.querySelector(".enemyCooldownAttack2");
const abilityCooldownBoxEnemy = document.querySelector(".enemyCooldownAbility");

canvas.width = window.innerWidth * 0.8;
canvas.height = 576; // 16:9

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
    damage: 25,
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
    damage: 20,
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
  imgSrc: "Animation/samuraiMack/zed-shuriken.png",
  framesMax: 4,
  scale: 1,
  sprites: {
    abilityidle: {
      imgSrc: "Animation/samuraiMack/FireBall.png",
      framesMax: 1,
    },
    shuriken: {
      imgSrc: "Animation/samuraiMack/zed-shuriken.png",
      framesMax: 4,
    },
  },
  offset: {
    x: 0,
    y: 30,
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
  damage: 40,
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
  imgSrc: "Animation/kenji/zed-shuriken.png",
  framesMax: 4,
  scale: 1,
  sprites: {
    abilityidle: {
      imgSrc: "Animation/kenji/FireBall.png",
      framesMax: 1,
    },
    shuriken: {
      imgSrc: "Animation/kenji/zed-shuriken.png",
      framesMax: 4,
    },
  },
  offset: {
    x: 0,
    y: 30,
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
  damage: 30,
  cooldown: 0,
});
