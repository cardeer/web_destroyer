var p5sketch = null
const p5Config = {
  strokeColor: '#000',
  strokeWeight: 1
}

chrome.storage.local.set({ stupidAction: 'LINE' })

const sketch = function(p) {
  // A simple Particle class
  let Particle = function(position) {
    this.acceleration = p.createVector(p.random(-0.05, 0.05), p.random(-0.05, 0.05));
    this.velocity = p.createVector(p.random(-0.05, 0.05), p.random(-0.05, 0.05));
    this.position = position.copy();
    this.lifespan = p.random(155, 255);
  };

  Particle.prototype.run = function() {
    this.update();
    this.display();
  };

  // Method to update position
  Particle.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  };

  // Method to display
  Particle.prototype.display = function() {
    // p.ellipse(this.position.x, this.position.y, 50, 50);
    // p.tint(255, this.lifespan);
    p.image(p5Config.img, this.position.x, this.position.y, 50, 50)
  };

  // Is the particle still useful?
  Particle.prototype.isDead = function() {
    return this.lifespan < 0;
  };

  let ParticleSystem = function() {
    this.particles = [];
    this.delay = 0;
  };

  ParticleSystem.prototype.addParticle = function(position) {
    if(this.delay < 2) this.delay++;
    else {
      this.delay = 0;
      this.particles.push(new Particle(position));
    }
  };

  ParticleSystem.prototype.run = function() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];
      particle.run();
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };

  p.setup = function () {
    const canvas = p.createCanvas(p.windowWidth, document.body.clientHeight)
    canvas.position(0, 0)
    p5Config.img = p.loadImage('https://w7.pngwing.com/pngs/704/52/png-transparent-know-your-meme-internet-meme-mobile-phones-meme.png');
    p5Config.system = new ParticleSystem();
  }

  p.draw = function () {
    p.clear();
    p5Config.system.addParticle(p.createVector(p.mouseX, p.mouseY));
    p5Config.system.run();
    /*
    chrome.storage.local.get(['stupidAction'], function(result) {
      switch (result.stupidAction) {
        case 'LINE':
          if (p.mouseIsPressed) {
            p.image(p5Config.img, p.mouseX, p.mouseY, 50, 50)
          }
          break
      }
    });
    */
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, document.body.clientHeight)
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, response) {
  if (request.event === 'stupidMode') {
    chrome.storage.local.set({ stupidMode: request.stupidMode })
    document.body.classList[request.stupidMode ? 'add' : 'remove']('stupid-body')
  }
  else if (request.event === 'removeCanvas' && p5sketch) {
    p5sketch.remove()
  }
  else if (request.event === 'enableCanvas') {
    if (p5sketch) {
      p5sketch.remove()
    }
    p5sketch = new p5(sketch)
  }
  else if (request.event === 'changeStrokeColor') {
    chrome.storage.local.set({ strokeColor: request.color })
    p5Config.strokeColor = request.color
  }
  else if (request.event === 'changeStrokeWeight') {
    chrome.storage.local.set({ strokeWeight: request.weight })
    p5Config.strokeWeight = request.weight
  }
  else if (request.event === 'capture') {
    // html2canvas(document.body).then(function (canvas) {
    //   const image = canvas.toDataURL()
    //   const newImageTab = window.open()
    //   newImageTab.document.title = 'Capture - Web Destroyer'
    //   newImageTab.document.body.style.margin = 0
    //   newImageTab.document.body.style.backgroundColor = '#0e0e0e'
    //   newImageTab.document.body.innerHTML = `<img src="${image}" style="margin: auto;" />`
    // })
  }
})

chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (changes.stupidMode) {
    document.body.classList[changes.stupidMode.newValue ? 'add' : 'remove']('stupid-body')
  }
})

chrome.storage.local.get(['stupidMode', 'strokeColor', 'strokeWeight'], function (result) {
  if (result.stupidMode) {
    document.body.classList.add('stupid-body')
  }

  if (result.strokeColor) {
    p5Config.strokeColor = result.strokeColor
  }

  if (result.strokeWeight) {
    p5Config.strokeWeight = result.strokeWeight
  }
})
