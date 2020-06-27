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
    constructor(x, y) {
      this.x = x
      this.y = y
      this.moved = 10
      this.size = 0
      this.color = 'rgba(0, 0, 0, .5)'
      this.ratio = p.fireImage.height / p.fireImage.width
      this.burnSize = p.random(100, 200)
    }

    create() {
      if (this.moved < 100) {
        p.image(p.fireImage, this.x - 50, this.y - 70, 50, 50 * this.ratio)
      }
      else {
        p.image(p.burnImage, this.x - 50, this.y - 70, this.burnSize, this.burnSize)
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

  class MilkTea {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.life = 0
      this.velocity = p.random(0.5, 1.5)
    }

    create() {
      p.strokeWeight(100)
      p.stroke('#f0dfc5')
      p.line(this.x, this.y, this.x, this.y + (this.life * this.velocity))
      if (this.y + (this.life * this.velocity) < p.windowHeight) this.life++
    }
  }

  class HammerTool {
    constructor(x, y) {
      this.x = x
      this.y = y
    }

    create() {
      p.image(p.breakImage, this.x, this.y)
    }
  }

  let diff = function (milliseconds) {
    const result = new Date().getTime() - p.lastTime > milliseconds
    if (result) p.lastTime = new Date().getTime()
    return result
  }

  p.preload = function () {
    p.objects = []
    p.lastTime = new Date()
    p.soundFormats('mp3', 'wav')
    p.fireImage = p.loadImage(chrome.runtime.getURL('assets/images/fire.png'))
    p.burnImage = p.loadImage(chrome.runtime.getURL('assets/images/burn.png'))
    p.breakImage = p.loadImage(chrome.runtime.getURL('assets/images/break.png'))

    p.fireSound = p.loadSound(chrome.runtime.getURL('assets/audios/fire.wav'))
    p.hammerSound = p.loadSound(chrome.runtime.getURL('assets/audios/hammer.wav'))
    p.milkteaSound = p.loadSound(chrome.runtime.getURL('assets/audios/milktea.wav'))
  }

  p.setup = function () {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.position(0, window.scrollY)
    canvas.style('z-index', Number.MAX_SAFE_INTEGER)

    p.sealImage = p.loadImage(chrome.runtime.getURL('assets/images/seal.png'));
    p5Config.system = new ParticleSystem();

    if (p5Config.imageURL) {
      p.changeImage()
    }

    p.fireSound.setVolume(.2)
    p.hammerSound.setVolume(.2)
    p.milkteaSound.setVolume(.2)
  }

  p.draw = function () {
    p.clear()
    p.cursor(cursors[p5Config.mode] || '')

    if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
      if (p5Config.mode === 'line') {
        p.objects.push(new LineTool(p5Config.strokeColor, p5Config.strokeWeight, p.mouseX, p.mouseY, p.pmouseX, p.pmouseY))
      }
      else if (p5Config.mode === 'image' && p.drawImage && diff(500)) {
        p.objects.push(new ImageTool(p.drawImage, p.mouseX, p.mouseY, p5Config.imageSize))
        p.lastTime = new Date()
      }
      else if (p5Config.mode === 'fire') {
        p.objects.push(new FireTool(p.mouseX, p.mouseY))
        p.fireSound.stop()
        p.fireSound.play()
      }
      else if (p5Config.mode === 'milktea' && diff(500)) {
        p.objects.push(new MilkTea(p.mouseX, p.mouseY, 10))
        p.milkteaSound.stop()
        p.milkteaSound.play()
      }
      else if (p5Config.mode === 'hammer' && diff(500)) {
        p.objects.push(new HammerTool(p.mouseX - p.breakImage.width / 2, p.mouseY - p.breakImage.height / 2))
        p.lastTime = new Date()
        p.hammerSound.stop()
        p.hammerSound.play()
      }
    }

    for (let i in p.objects) {
      p.objects[i].create()
    }

    for (let i in p.objects) {
      if (p.objects[i].remove) {
        p.objects.splice(i, 1)
      }
    }

    p5Config.system.addParticle(p.createVector(p.mouseX, p.mouseY));
    p5Config.system.run();
  }

  p.changeImage = function (url) {
    p.drawImage = p.loadImage(url || p5Config.imageURL)
  }

  p.windowResized = function(){
    resizeCanvas(p.windowWidth, p.windowHeight)
  }
}
