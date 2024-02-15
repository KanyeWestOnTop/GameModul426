const canvasBorderLeft = 0;
const canvasBorderRight = window.innerWidth * 0.8 - 40;

const jumpStates = {
  firstJump: 1,
  secondJump: 2,
};

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

const hitTakenAction = (fighter) => {
  if (fighter.img !== fighter.sprites.hitTaken.img) {
    fighter.img = fighter.sprites.hitTaken.img;
    fighter.framesMax = fighter.sprites.hitTaken.framesMax;
    fighter.framesCurrent = 0;
  }
};

const deathAction = (fighter) => {
  if (fighter.img !== fighter.sprites.death.img) {
    fighter.img = fighter.sprites.death.img;
    fighter.framesMax = fighter.sprites.death.framesMax;
    fighter.framesCurrent = 0;
  }
};

const attack2Action = (fighter) => {
  if (fighter.img !== fighter.sprites.attack2.img) {
    fighter.img = fighter.sprites.attack2.img;
    fighter.framesMax = fighter.sprites.attack2.framesMax;
    fighter.framesCurrent = 0;
  }
};

const actionMapping = {
  idle: idleAction,
  run: runAction,
  jump: jumpAction,
  fall: fallAction,
  attack1: attack1Action,
  attack2: attack2Action,
  hitTaken: hitTakenAction,
  death: deathAction,
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
      } else if (this.img.src.includes("Death")) {
        this.framesCurrent = this.framesMax - 1;
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
    cooldownattack2,
    initialcooldownattack2,
    color,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset,
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
    damage = 0,
    attack2 = {
      offset: {},
      width: undefined,
      height: undefined,
    },
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
      offset: { x: attackBox.offset.x, y: attackBox.offset.y },
      width: attackBox.width,
      height: attackBox.height,
    };
    this.attack2 = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: { x: attack2.offset.x, y: attack2.offset.y },
      width: attack2.width,
      height: attack2.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.damage = damage;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;
    this.death = false;
    this.doubleJump = null;
    this.isAttacking2 = false;
    this.cooldownattack2 = cooldownattack2;
    this.initialcooldownattack2 = initialcooldownattack2;

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

    // attackBox position
    if (this.scaleX === 1) {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    } else {
      this.attackBox.position.x =
        this.position.x +
        this.width -
        this.attackBox.offset.x -
        this.attackBox.width;
    }
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // attack2 position
    if (this.scaleX === 1) {
      this.attack2.position.x = this.position.x + this.attack2.offset.x;
    } else {
      this.attack2.position.x =
        this.position.x +
        this.width -
        this.attack2.offset.x -
        this.attack2.width;
    }

    this.attack2.position.y = this.position.y + this.attack2.offset.y;

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
        : gravity * 0.2;
    }

    // prevent from going off screen on top
    if (this.position.y <= 0) {
      this.position.y = 0;
    }

    // this.drawAttackBox();
  }

  drawAttackBox() {
    // Stelle sicher, dass die attackBox existiert
    if (this.attackBox) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Halbtransparentes Rot für Sichtbarkeit

      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );

      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Halbtransparentes Rot für Sichtbarkeit
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

      ctx.fillStyle = "rgba(0, 0, 255, 0.5)"; // Halbtransparentes blue für Sichtbarkeit
      ctx.fillRect(
        this.attack2.position.x,
        this.attack2.position.y,
        this.attack2.width,
        this.attack2.height
      );
      const backgroundImg = new Image();
      backgroundImg.src = "Animation/Background.png";
      backgroundImg.onload = function () {
        // Erstelle das Muster, nachdem das Bild geladen wurde
        const pattern = ctx.createPattern(backgroundImg, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  attackTwo() {
    this.isAttacking2 = true;
    setTimeout(() => {
      this.isAttacking2 = false;
    }, 100);
  }

  switchSprite(sprite) {
    if (
      (this.img === this.sprites.attack1.img &&
        this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
      (this.img === this.sprites.attack2.img &&
        this.framesCurrent < this.sprites.attack2.framesMax - 1)
    ) {
      return;
    }

    if (
      this.img === this.sprites.hitTaken.img &&
      this.framesCurrent < this.sprites.hitTaken.framesMax - 1
    ) {
      return;
    }

    actionMapping[sprite](this);
  }
}

class Abilities extends Sprite {
  constructor({
    position,
    velocity,
    cooldown,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset,
    sprites,
    abilityBox = {
      // Corrected typo here
      offset: {},
      width: undefined,
      height: undefined,
    },
    damage = 0,
  }) {
    super({
      position,
      imgSrc,
      scale,
      framesMax,
      offset,
    });
    this.scaleX = 1;
    this.name;
    this.velocity = velocity;
    this.width = 40;
    this.height = 40;
    this.lastKey;
    this.imgSrc = imgSrc;
    this.abilityBox = {
      // Corrected typo here
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: { x: abilityBox.offset.x, y: abilityBox.offset.y }, // Corrected typo here
      width: abilityBox.width,
      height: abilityBox.height,
    };
    this.isUsingAbility; // Corrected typo here
    this.damage = damage;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;
    this.death = false;
    this.cooldown = cooldown;

    for (const sprite in this.sprites) {
      sprites[sprite].img = new Image();
      sprites[sprite].img.src = sprites[sprite].imgSrc;
    }
  }

  update() {
    // Update the position of the fireball to match the player's position
    this.position.x = player.position.x;
    this.position.y = player.position.y;

    this.draw();
    this.animateFrames();
    this.drawAbilitesBox();
  }

  drawAbilitesBox() {
    // Ensure that the ability box exists
    if (this.abilityBox) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red for visibility

      ctx.fillRect(
        this.position.x + this.abilityBox.offset.x,
        this.position.y + this.abilityBox.offset.y,
        this.abilityBox.width,
        this.abilityBox.height
      );
      console.log(this.abilityBox);
    }
  }
}
