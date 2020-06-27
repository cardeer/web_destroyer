var stupidMode = false

function sendMessage(data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, data)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(['stupidMode', 'strokeColor', 'strokeWeight', 'imageURL', 'imageSize'], function (result) {
    if (result.stupidMode) {
      stupidMode = result.stupidMode
    }

    if (result.strokeColor) {
      document.querySelector('#stroke-color').value = result.strokeColor
    }

    if (result.strokeWeight) {
      document.querySelector('#stroke-weight').value = result.strokeWeight
    }

    if (result.imageURL) {
      document.querySelector('#image-url').value = result.imageURL
    }

    if (result.imageSize) {
      document.querySelector('#image-size').value = result.imageSize
    }
  })

  document.querySelector('#stupid').addEventListener('click', function () {
    stupidMode = !stupidMode
    sendMessage({ event: 'stupidMode', stupidMode })
  })

  document.querySelector('#remove').addEventListener('click', function () {
    sendMessage({ event: 'removeCanvas' })
  })

  // change mode
  document.querySelector('#line-mode').addEventListener('click', function (e) {
    sendMessage({ event: 'changeMode', mode: 'line' })
  })

  document.querySelector('#image-mode').addEventListener('click', function (e) {
    sendMessage({ event: 'changeMode', mode: 'image' })
  })

  document.querySelector('#bomb-mode').addEventListener('click', function (e) {
    sendMessage({ event: 'changeMode', mode: 'bomb' })
  })

  document.querySelector('#fire-mode').addEventListener('click', function (e) {
    sendMessage({ event: 'changeMode', mode: 'fire' })
  })
  // end change mode

  // stroke settings
  document.querySelector('#stroke-color').addEventListener('change', function (e) {
    sendMessage({ event: 'changeStrokeColor', color: e.target.value })
  })

  document.querySelector('#stroke-weight').addEventListener('change', function (e) {
    sendMessage({ event: 'changeStrokeWeight', weight: e.target.value })
  })
  // end stroke settings

  document.querySelector('#image-url').addEventListener('change', function (e) {
    sendMessage({ event: 'changeImage', image: e.target.value })
  })

  document.querySelector('#image-size').addEventListener('change', function (e) {
    sendMessage({ event: 'changeImageSize', size: e.target.value })
  })

  // document.querySelector('#capture').addEventListener('click', function (e) {
  //   sendMessage({ event: 'capture' })
  // })
})
