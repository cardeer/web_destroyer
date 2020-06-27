var p5sketch = null
const p5Config = {
  strokeColor: '#000',
  strokeWeight: 1,
  imageURL: null,
  imageSize: 100,
  mode: 'line',
}

const cursors = {
  line: chrome.runtime.getURL('assets/cursors/line.cur'),
  image: chrome.runtime.getURL('assets/cursors/image.cur'),
  fire: chrome.runtime.getURL('assets/cursors/fire.cur'),
}

const sketch = function (p) {
  // classes
  class Line {
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

  class Image {
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

    move() { }
  }

  class Fire {
    constructor(fire, x, y) {
      this.canRemove = false
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
        p.noStroke()
        p.fill(this.color)
        p.circle(this.x, this.y, this.size)
      }
    }

    move() {
      if (this.moved >= 100) {
        this.size += 5
        this.size = this.size <= 100 ? this.size : 100
        return
      }
      this.x -= 5
      this.y -= 5
      this.moved += 5
    }
  }
  // end classes

  p.objects = []

  p.setup = function () {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.position(0, window.scrollY)
    canvas.style('z-index', Number.MAX_SAFE_INTEGER)

    if (p5Config.imageURL) {
      p.changeImage()
    }
  }

  p.draw = function () {
    p.clear()
    p.cursor(cursors[p5Config.mode] || '')

    if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
      if (p5Config.mode === 'line') {
        p.objects.push(new Line(p5Config.strokeColor, p5Config.strokeWeight, p.mouseX, p.mouseY, p.pmouseX, p.pmouseY))
      }
      else if (p5Config.mode === 'image' && p.drawImage) {
        p.objects.push(new Image(p.drawImage, p.mouseX, p.mouseY, p5Config.imageSize))
      }
      else if (p5Config.mode === 'fire' && p.drawImage) {
        p.objects.push(new Fire(p.drawImage, p.mouseX, p.mouseY))
      }
    }

    for (let i in p.objects) {
      p.objects[i].create()
      p.objects[i].move()
    }
  }

  p.changeImage = function (url) {
    p.drawImage = p.loadImage(url || p5Config.imageURL)
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, response) {
  if (request.event === 'stupidMode') {
    chrome.storage.local.set({ stupidMode: request.stupidMode })
    document.body.classList[request.stupidMode ? 'add' : 'remove']('stupid-body')
  }
  else if (request.event === 'removeCanvas' && p5sketch) {
    p5sketch.remove()
    p5sketch = null
  }
  else if (request.event === 'changeMode') {
    p5Config.mode = request.mode
    if (!p5sketch) {
      p5sketch = new p5(sketch)
    }

    if (request.mode === 'image' && (p5Config.imageURL === '' || !p5Config.imageURL)) {
      p5Config.mode = 'line'
      alert('Please enter image URL')
    }
    else if (request.mode === 'image') {
      p5sketch.changeImage()
    }
    else if (request.mode === 'fire') {
      p5sketch.changeImage(chrome.runtime.getURL('assets/images/fire.png'))
    }
  }
  else if (request.event === 'changeStrokeColor') {
    p5Config.strokeColor = request.color
    chrome.storage.local.set({ strokeColor: p5Config.strokeColor })
  }
  else if (request.event === 'changeStrokeWeight') {
    p5Config.strokeWeight = request.weight || 1
    chrome.storage.local.set({ strokeWeight: p5Config.strokeWeight })
  }
  else if (request.event === 'changeImage') {
    p5Config.imageURL = request.image
    if (p5sketch) {
      p5sketch.changeImage()
    }
    chrome.storage.local.set({ imageURL: p5Config.imageURL })
  }
  else if (request.event === 'changeImageSize') {
    p5Config.imageSize = request.size || 100
    chrome.storage.local.set({ imageSize: p5Config.imageSize })
  }
})

chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (changes.stupidMode) {
    document.body.classList[changes.stupidMode.newValue ? 'add' : 'remove']('stupid-body')
  }
})

chrome.storage.local.get(['stupidMode', 'strokeColor', 'strokeWeight', 'imageURL', 'imageSize'], function (result) {
  if (result.stupidMode) {
    document.body.classList.add('stupid-body')
  }

  if (result.strokeColor) {
    p5Config.strokeColor = result.strokeColor
  }

  if (result.strokeWeight) {
    p5Config.strokeWeight = result.strokeWeight
  }

  if (result.imageURL) {
    p5Config.imageURL = result.imageURL
  }

  if (result.imageSize) {
    p5Config.imageSize = result.imageSize
  }
})
