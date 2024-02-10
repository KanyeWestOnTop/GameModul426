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
    ctx.drawImage(
      this.img,
      this.framesCurrent * (this.img.width / this.framesMax),
      0,
      this.img.width / this.framesMax,
      this.img.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.img.width / this.framesMax) * this.scale,
      this.img.height * this.scale
    );
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
      this.position.y = canvas.height - 96 - this.height;
    } else {
      this.velocity.y += gravity;
    }
    // onsole.log(this.position.y);
    
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
    switch (sprite) {
      case "idle":
        if (this.img !== this.sprites.idle.img) {
          player.img = this.sprites.idle.img;
          player.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.img !== this.sprites.run.img) {
          player.img = this.sprites.run.img;
          player.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.img !== this.sprites.jump.img) {
          player.img = this.sprites.jump.img;
          player.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.img !== this.sprites.fall.img) {
          player.img = this.sprites.fall.img;
          player.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
