<template>
  <div class="wrapper-bg">
    <v-img src="/sc/activity-scratch.png"></v-img>
    <div class="d-flex justify-center">
      <div id="wrap-canvas" @mouseup="eventUp">
        <canvas id="bottom" :width="w" :height="h"></canvas>
        <canvas id="middle" :width="w" :height="h"></canvas>
        <canvas id="top" :width="w" :height="h"></canvas>
      </div>
    </div>
    <div class="py-4 d-flex justify-center">
      <v-img class="flex-grow-0" src="/sc/footer.png" width="300px"></v-img>
    </div>
  </div>
</template>

<script>
export default {
  mounted: function () {
    this.draw()
    this.$nextTick(() => {
      this.topCanvas.addEventListener('touchstart', this.eventDown)
      this.topCanvas.addEventListener('touchend', this.eventUp)
      this.topCanvas.addEventListener('touchmove', this.eventMove)
      this.topCanvas.addEventListener('mousedown', this.eventDown)
      this.topCanvas.addEventListener('mousemove', this.eventMove)
    })
  },
  data() {
    return {
      isLoading: false,
      mousedown: false,
      w: 300,
      h: 300,
      bottomCanvas: null,
      middleCanvas: null,
      topCanvas: null,
      wrapCanvas: null,
      ctxBot: null,
      ctxTop: null,
      ctxMid: null,
      triggered: false,
      imgObjectBottom: null,
      imgObjectTop: null,
      ev: null,
      offsetLeft: null,
      offsetTop: null,
      percentage: 0.8, // 被刮掉多少%
      strokeWidth: 20, // 筆畫寬度
      bottomImg: '/sc/bottom.png', // 下層圖片
      topImg: '/sc/top.png', //上層圖片
    }
  },
  methods: {
    draw() {
      let vm = this
      this.bottomCanvas = document.querySelector('#bottom')
      this.middleCanvas = document.querySelector('#middle')
      this.topCanvas = document.querySelector('#top')
      this.wrapCanvas = document.querySelector('#wrap-canvas')
      this.wrapCanvas.style['width'] = `${this.w}px`
      this.wrapCanvas.style['height'] = `${this.h}px`

      this.ctxBot = this.bottomCanvas.getContext('2d')
      this.ctxTop = this.middleCanvas.getContext('2d')
      this.ctxMid = this.topCanvas.getContext('2d')

      this.imgObjectTop = new Image()
      this.imgObjectTop.src = this.topImg
      this.imgObjectTop.onload = function () {
        function draw() {
          vm.ctxTop.drawImage(vm.imgObjectTop, 0, 0, vm.w, vm.h)
        }
        draw()
      }
      this.imgObjectBottom = new Image()
      this.imgObjectBottom.src = this.bottomImg
      this.imgObjectBottom.onload = function () {
        function draw() {
          vm.ctxBot.drawImage(vm.imgObjectBottom, 0, 0, vm.w, vm.h)
        }
        draw()
      }
      this.drawBot()
      this.drawMid()
      this.drawTop()
    },
    drawTop() {
      this.ctxTop.canvas.style.opacity = 1
      this.ctxTop.drawImage(this.imgObjectBottom, 0, 0, this.w, this.h)
    },
    drawBot() {
      this.ctxBot.clearRect(0, 0, this.w, this.h)
      this.ctxBot.drawImage(this.imgObjectTop, 0, 0, this.w, this.h)
    },
    drawMid() {
      this.ctxMid.canvas.style.opacity = 0
      this.ctxMid.fillStyle = 'purple'
      this.ctxMid.fillRect(0, 0, this.w, this.h)

      // 判斷當前是否為第一次刮開，不是則清除上一次區域
      if (this.ctxMid.globalCompositeOperation != 'destination-out') {
        this.ctxMid.globalCompositeOperation = 'destination-out'
      } else {
        this.ctxMid.clearRect(0, 0, this.w, this.h)
      }
    },

    eventDown(ev) {
      ev = ev || event
      ev.preventDefault()
      this.mousedown = true
    },
    eventUp(ev) {
      ev = ev || event
      ev.preventDefault()
      this.mousedown = false
    },
    eventMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (this.mousedown) {
        if (ev.changedTouches) {
          ev = ev.changedTouches[ev.changedTouches.length - 1]
        }

        let { top, left } = this.wrapCanvas.getBoundingClientRect()
        let x = ev.pageX - left
        let y = ev.pageY - top
        this.ctxTop.save()
        this.ctxTop.globalCompositeOperation = 'destination-out'
        this.ctxTop.beginPath()
        this.ctxTop.arc(x, y, this.strokeWidth, 0, 2 * Math.PI, false)
        this.ctxTop.fill()
        this.ctxTop.restore()

        this.ctxMid.beginPath()
        this.ctxMid.arc(x, y, this.strokeWidth, 0, Math.PI * 2)
        this.ctxMid.fill()

        this.alertInfo()
      }
    },
    alertInfo() {
      let data = this.ctxMid.getImageData(0, 0, this.w, this.h).data
      let n = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i] == 0) {
          n++
        }
      }
      if (n >= data.length * this.percentage && !this.triggered) {
        this.triggered = true
        this.ctxMid.globalCompositeOperation = 'destination-over'
        this.ctxMid.canvas.style.opacity = 0
        this.ctxTop.globalCompositeOperation = 'destination-over'
        this.ctxTop.canvas.style.opacity = 0
        document.querySelector('button').style.display = 'block'
        alert('恭喜獲得')
      }
    },
  },
}
</script>
<style scoped>
canvas {
  position: absolute;
  top: 0px;
  left: 0px;
  cursor: pointer;
}
#wrap-canvas {
  position: relative;
}
.wrapper-bg {
  background-color: #98c4e0;
  background-image: linear-gradient(
    0deg,
    #98c4e0 0%,
    #597dbe 50%,
    #9399c8 100%
  );
  max-width: 600px;
  margin: 0 auto;
}
</style>
