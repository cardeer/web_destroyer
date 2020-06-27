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
  milktea: chrome.runtime.getURL('assets/cursors/milktea.cur'),
  hammer: chrome.runtime.getURL('assets/cursors/hammer.cur'),
}

var stupidAudio = null

chrome.runtime.onMessage.addListener(function (request, sender, response) {
  if (request.event === 'stupidMode') {
    chrome.storage.local.set({ stupidMode: request.stupidMode })
    document.body.classList[request.stupidMode ? 'add' : 'remove']('stupid-body')

    if (stupidAudio) {
      stupidAudio.pause()
      stupidAudio.remove()
      stupidAudio = null
    }

    if (request.stupidMode) {
      stupidAudio = new Audio(chrome.runtime.getURL('assets/audios/stupid.mp3'))
      stupidAudio.loop = true
      stupidAudio.volume = .5
      stupidAudio.play()
    }
  }
  else if (request.event === 'removeCanvas' && p5sketch) {
    p5sketch.remove()
    p5sketch = null
    document.body.classList.remove('disable-scroll')
  }
  else if (request.event === 'changeMode') {
    p5Config.mode = request.mode
    if (!p5sketch) {
      p5sketch = new p5(sketch)
      document.body.classList.add('disable-scroll')
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

chrome.storage.local.get(['stupidMode', 'strokeColor', 'strokeWeight', 'imageURL', 'imageSize'], function (result) {
  if (result.stupidMode) {
    chrome.storage.local.set({ stupidMode: false })
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
