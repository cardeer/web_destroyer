var p5sketch = null
const p5Config = {
  strokeColor: '#000',
  strokeWeight: 1,
}

const sketch = function (p) {
  p.setup = function () {
    const canvas = p.createCanvas(p.windowWidth, document.body.clientHeight)
    canvas.position(0, 0)
  }

  p.draw = function () {
    if (p.mouseIsPressed) {
      p.strokeWeight(p5Config.strokeWeight)
      p.stroke(p5Config.strokeColor)
      p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY)
    }
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
    chrome.storage.local.set({ strokeWeight: request.weight || 1 })
    p5Config.strokeWeight = request.weight || 1
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
