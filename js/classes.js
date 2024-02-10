const canvasBorderLeft = -60;
const canvasBorderRight = 925;

const idleAction = (fighter) => {
  if (fighter.img !== fighter.sprites.idle.img) {
    fighter.img = fighter.sprites.idle.img;
    fighter.framesMax = fighter.sprites.idle.framesMax;
    fighter.framesCurrent = 0;
  }
};

const runAction = (fighter) => {
  if (fighter.img !== fighter.sprites.run.img) {
    fighter.img = fighter.sprites.run.img;
    fighter.framesMax = fighter.sprites.run.framesMax;
    fighter.framesCurrent = 0;
  }
};

const jumpAction = (fighter) => {
  if (fighter.img !== fighter.sprites.jump.img) {
    fighter.img = fighter.sprites.jump.img;
    fighter.framesMax = fighter.sprites.jump.framesMax;
    fighter.framesCurrent = 0;
  }
};

const fallAction = (fighter) => {
  if (fighter.img !== fighter.sprites.fall.img) {
    fighter.img = fighter.sprites.fall.img;
    fighter.framesMax = fighter.sprites.fall.framesMax;
    fighter.framesCurrent = 0;
  }
};

const attack1Action = (fighter) => {
  if (fighter.img !== fighter.sprites.attack1.img) {
    fighter.img = fighter.sprites.attack1.img;
    fighter.framesMax = fighter.sprites.attack1.framesMax;
    fighter.framesCurrent = 0;
  }
};

const actionMapping = {
  idle: idleAction,
  run: runAction,
  jump: jumpAction,
  fall: fallAction,
  attack1: attack1Action,
};

class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 40;
    this.height = 120;
    this.img = new Image();
    this.img.src = imgSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }

  draw() {
    ctx.save();
    let posX = this.position.x - this.offset.x;
    let posY = this.position.y - this.offset.y;
    const playerWidth = this.img.width / this.framesMax;
    if (this instanceof Fighter) {
      ctx.scale(this.scaleX, 1);
      if (this.scaleX === -1) {
        posX = -posX - playerWidth * this.scale;
      }
    }
    ctx.drawImage(
      this.img,
      this.framesCurrent * playerWidth,
      0,
      this.img.width / this.framesMax,
      this.img.height,
      posX,
      posY,
      playerWidth * this.scale,
      this.img.height * this.scale
    );
    ctx.restore();
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imgSrc,
      scale,
      framesMax,
      offset,
    });
    this.scaleX = 1;
    this.scaleY = 1;
    this.name;
    this.velocity = velocity;
    this.width = 40;
    this.height = 120;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 30,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].img = new Image();
      sprites[sprite].img.src = sprites[sprite].imgSrc;
    }
  }

  update() {
    if (
      (this.position.x < canvasBorderLeft &&
        (this.lastKey == "a" || this.lastKey == "arrowleft")) ||
      (this.position.x > canvasBorderRight &&
        (this.lastKey == "d" || this.lastKey == "arrowright"))
    ) {
      this.velocity.x = 0;
    }

    this.draw();

    this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      // prevent from going off screen
      this.velocity.y = 0;
      this.position.y = canvas.height - 96 - this.height; // what is 96? magic number
    } else {
      this.velocity.y += this.img.src.includes("Jump")
        ? gravity
        : gravity * 0.4;
    }

    // prevent from going off screen on top
    if (this.position.y <= 0) {
      this.position.y = 0;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  switchSprite(sprite) {
    actionMapping[sprite](this);
  }
}
