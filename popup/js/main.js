var stupidMode = false

function sendMessage(data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, data)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(['stupidMode', 'strokeColor', 'strokeWeight'], function (result) {
    if (result.stupidMode) {
      stupidMode = result.stupidMode
    }
  
    if (result.strokeColor){
      document.querySelector('#color').value = result.strokeColor
    }

    if (result.strokeWeight){
      document.querySelector('#weight').value = result.strokeWeight
    }
  })

  document.querySelector('#click').addEventListener('click', function () {
    stupidMode = !stupidMode
    sendMessage({ event: 'stupidMode', stupidMode })
  })

  document.querySelector('#remove').addEventListener('click', function () {
    sendMessage({ event: 'removeCanvas' })
  })

  document.querySelector('#enable').addEventListener('click', function () {
    sendMessage({ event: 'enableCanvas' })
  })

  document.querySelector('#color').addEventListener('change', function (e) {
    sendMessage({ event: 'changeStrokeColor', color: e.target.value })
  })

  document.querySelector('#weight').addEventListener('change', function (e) {
    sendMessage({ event: 'changeStrokeWeight', weight: e.target.value })
  })

  document.querySelector('#capture').addEventListener('click', function (e) {
    sendMessage({ event: 'capture' })
  })
})
