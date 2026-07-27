function NoneIE() {
  if (window.document.documentMode) {
    document.getElementById('no-ie').style.display = 'block'

    let time_minutes = 0 // Value in minutes
    let time_seconds = 6 // Value in seconds

    let duration = time_minutes * 60 + time_seconds

    let element = document.getElementById('count-down-timer')
    element.style.display = 'block'
    element.innerText =
      '倒數 ' +
      paddedFormat(time_minutes) +
      ':' +
      paddedFormat(time_seconds) +
      ' 自動跳轉下載頁面'

    startCountDown(--duration, element)
  }
}

function paddedFormat(num) {
  return num < 10 ? '0' + num : num
}

function startCountDown(duration, element) {
  let secondsRemaining = duration
  let min = 0
  let sec = 0

  let countInterval = setInterval(function () {
    min = parseInt(secondsRemaining / 60)
    sec = parseInt(secondsRemaining % 60)

    element = document.getElementById('count-down-timer')
    element.innerText =
      '倒數 ' +
      paddedFormat(min) +
      ':' +
      paddedFormat(sec) +
      ' 自動跳轉下載頁面'

    secondsRemaining = secondsRemaining - 1
    if (secondsRemaining < 0) {
      element.style.display = 'none'
      clearInterval(countInterval)
      window.location.href = 'https://www.google.com/intl/zh-TW/chrome/'
    }
  }, 1000)
}

window.onload = function () {
  NoneIE()
}

let urlParams = new URLSearchParams(window.location.search)
let os = urlParams.get('os')

if (os === 'Android' && !('noModule' in HTMLScriptElement.prototype)) {
  alert('請至Play商店更新Google Chrome瀏覽器')
  window.location.href = 'market://details?id=com.android.chrome&hl=zh_TW&gl=US'
}
