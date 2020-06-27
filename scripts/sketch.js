const sketch = function (p) {
  // classes
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
      this.move()
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

  class BombTool {
    constructor(x, y) {
      this.x = x
      this.y = y
    }

    create() {

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
        p.objects.push(new LineTool(p5Config.strokeColor, p5Config.strokeWeight, p.mouseX, p.mouseY, p.pmouseX, p.pmouseY))
      }
      else if (p5Config.mode === 'image' && p.drawImage) {
        p.objects.push(new ImageTool(p.drawImage, p.mouseX, p.mouseY, p5Config.imageSize))
      }
      else if (p5Config.mode === 'fire' && p.drawImage) {
        p.objects.push(new FireTool(p.drawImage, p.mouseX, p.mouseY))
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
