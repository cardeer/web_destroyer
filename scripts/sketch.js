const sketch = function (p) {
  // A simple Particle class
  let Particle = function (position) {
    this.acceleration = p.createVector(p.random(-0.05, 0.05), p.random(-0.05, 0.05));
    this.velocity = p.createVector(p.random(-0.05, 0.05), p.random(-0.05, 0.05));
    this.position = position.copy();
    this.lifespan = p.random(155, 255);
  };

  Particle.prototype.run = function () {
    this.update();
    this.display();
  };

  // Method to update position
  Particle.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  };

  // Method to display
  Particle.prototype.display = function () {
    // p.ellipse(this.position.x, this.position.y, 50, 50);
    // p.tint(255, this.lifespan);
    p.image(p.sealImage, this.position.x, this.position.y, 50, 50)
  };

  // Is the particle still useful?
  Particle.prototype.isDead = function () {
    return this.lifespan < 0;
  };

  let ParticleSystem = function () {
    this.particles = [];
    this.delay = 0;
  };

  ParticleSystem.prototype.addParticle = function (position) {
    if (this.delay < 2) this.delay++;
    else {
      this.delay = 0;
      this.particles.push(new Particle(position));
    }
  };

  ParticleSystem.prototype.run = function () {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];
      particle.run();
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };

  class LineTool {
    constructor(strokeColor, strokeWeight, x, y, px, py) {
      this.x = x
      this.y = y
      this.px = px
      this.py = py
      this.strokeColor = strokeColor
      this.strokeWeight = strokeWeight
    }

    create() {
      p.strokeWeight(this.strokeWeight)
      p.stroke(this.strokeColor)
      p.line(this.x, this.y, this.px, this.py)
    }

    move() { }
  }

  class ImageTool {
    constructor(image, x, y, size) {
      this.image = image
      const ratio = image.height / image.width
      this.width = size
      this.height = this.width * ratio

      this.x = x - this.width / 2
      this.y = y - this.height / 2
    }

    create() {
      p.image(this.image, this.x, this.y, this.width, this.height)
    }
  }

  class FireTool {
    constructor(fire, x, y) {
      this.x = x
      this.y = y
      this.moved = 10
      this.size = 0
      this.color = 'rgba(0, 0, 0, .5)'
      this.fire = fire
      this.ratio = fire.height / fire.width
    }

    create() {
      if (this.moved < 100) {
        p.image(this.fire, this.x - 50, this.y - 70, 50, 50 * this.ratio)
      }
      else {
        p.image(p.burnImage, this.x - 50, this.y - 70, 100, 100)
      }

      if (this.moved < 100) {
        this.move()
      }
    }

    move() {
      this.x -= 5
      this.y -= 5
      this.moved += 5
    }
  }

  class BombTool {
    constructor(x, y) {
      this.x = x
      this.y = y
    }

    create() {

    }
  }

  p.objects = []
  p.burnImage = p.loadImage(chrome.runtime.getURL('assets/images/burn.png'))

  p.setup = function () {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.position(0, window.scrollY)
    canvas.style('z-index', Number.MAX_SAFE_INTEGER)

    p.sealImage = p.loadImage(chrome.runtime.getURL('assets/images/seal.png'));
    p5Config.system = new ParticleSystem();

    if (p5Config.imageURL) {
      p.changeImage()
    }
  }

  p.draw = function () {
    p.clear()
    p.cursor(cursors[p5Config.mode] || '')

    p5Config.system.addParticle(p.createVector(p.mouseX, p.mouseY));
    p5Config.system.run();

    if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
      if (p5Config.mode === 'line') {
        p.objects.push(new LineTool(p5Config.strokeColor, p5Config.strokeWeight, p.mouseX, p.mouseY, p.pmouseX, p.pmouseY))
      }
      else if (p5Config.mode === 'image' && p.drawImage) {
        p.objects.push(new ImageTool(p.drawImage, p.mouseX, p.mouseY, p5Config.imageSize))
      }
      else if (p5Config.mode === 'fire' && p.drawImage) {
        p.objects.push(new FireTool(p.drawImage, p.mouseX, p.mouseY))
      }
      else if (p5Config.mode === 'bomb') {

      }
    }

    for (let i in p.objects) {
      p.objects[i].create()
    }
  }

  p.changeImage = function (url) {
    p.drawImage = p.loadImage(url || p5Config.imageURL)
  }
}
