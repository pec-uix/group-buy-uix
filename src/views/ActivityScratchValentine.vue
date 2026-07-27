<template>
  <div class="wrapper-bg" @pointerup.prevent="eventUp">
    <v-img
      class="mx-auto mb-4"
      src="/sc/activity-scratch-valentine.png"
    ></v-img>
    <template v-if="isLoading">
      <v-skeleton-loader class="mx-auto" type="paragraph"></v-skeleton-loader>
    </template>
    <v-alert v-else-if="!id" text type="warning"> 現在非活動期間 </v-alert>
    <template v-else-if="activity_log_id">
      <div class="d-flex justify-center">
        <div id="wrap-canvas">
          <canvas id="bottom" :width="w" :height="h"></canvas>
          <canvas id="middle" :width="w" :height="h"></canvas>
          <canvas
            id="top"
            :width="w"
            :height="h"
            @pointerdown.prevent="eventDown"
            @pointermove.prevent="eventMove"
            @touchmove.prevent
          ></canvas>
        </div>
      </div>
      <div class="py-4 d-flex justify-center">
        <v-img class="flex-grow-0" :src="footerImg" width="300px"></v-img>
      </div>
    </template>
    <div class="pa-2" v-else-if="hasQualification">
      <v-img @click="get" src="/sc/get-one.png"> </v-img>
    </div>
    <div class="pa-2" v-else>
      <v-img src="/sc/not-qualified.png"> </v-img>
    </div>
    <v-img src="/sc/scratch-memo-valentine.png"> </v-img>
    <v-dialog
      v-model="dialog"
      :overlay-opacity="0.8"
      max-width="min(800px, 80vh)"
      persistent
    >
      <v-img
        class="white--text text-h4"
        style="cursor: pointer"
        max-width="min(800px, 80vh)"
        :aspect-ratio="1 / 1"
        :src="pop_up_img_url"
        @click="to"
      >
      </v-img>
    </v-dialog>
  </div>
</template>
<script>
import { apiAxios } from '@/api'

export default {
  mounted() {
    this.isLoading = true
    return apiAxios({
      method: 'post',
      url: '/Activity/GetActivity',
      data: {
        activity_kind: '2',
      },
    })
      .then(res => {
        if (res.result) {
          this.id = res.result.id
          this.start_date = new Date(res.result.start_date)
          this.end_date = new Date(res.result.end_date)
          this.pop_up_img_url = res.result.pop_up_img_url
          this.promote_router_to = res.result.promote_router_to
          return Promise.all([
            apiAxios({
              method: 'post',
              url: '/Activity/GetActivityLog',
              data: { activity_id: this.id },
            }).then(res => {
              this.activity_log_id = res.result?.id
              this.award_id = res.result?.award_id
              this.award_name = res.result?.award_name
              this.execution_date = res.result?.execution_date
            }),
            apiAxios({
              method: 'post',
              url: '/Activity/GetActivityQualification',
              data: {
                activity_id: this.id,
              },
            }).then(res => {
              this.hasQualification = res.result
            }),
          ]).then(() => {
            this.isLoading = false
            if (this.activity_log_id) {
              this.$nextTick(() => {
                this.draw()
                this.imgObjectBottom = new Image()
                this.imgObjectBottom.src = this.bottomImg
                this.imgObjectBottom.onload = () => {
                  this.ctxBot.drawImage(
                    this.imgObjectBottom,
                    0,
                    0,
                    this.w,
                    this.h
                  )
                  if (this.execution_date) {
                    this.triggered = true
                    this.ctxMid.globalCompositeOperation = 'destination-over'
                    this.ctxMid.canvas.style.opacity = 0
                    this.ctxTop.globalCompositeOperation = 'destination-over'
                    this.ctxTop.canvas.style.opacity = 0
                  }
                }
              })
            }
          })
        }
      })
      .finally(() => (this.isLoading = false))
  },
  data() {
    return {
      id: '',
      start_date: '',
      end_date: '',
      award_id: undefined,
      award_name: undefined,
      isLoading: false,
      isLoadingForButton: false,
      isQuestionLoading: false,
      dialog: false,
      question_desc: '',
      src: '',
      pop_up_img_url: '',
      promote_router_to: '',
      question_id: '',
      option_array: [],
      answer: '',
      hasQualification: false,
      execution_date: '',
      activity_log_id: '',

      isDrawing: false,
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
      percentage: 0.7, // 被刮掉多少%
      strokeWidth: 20, // 筆畫寬度

      topImg: '/sc/top.png', //上層圖片
    }
  },
  computed: {
    bottomImg() {
      return `/sc/bottom-${this.award_id}.png` // 下層圖片
    },
    footerImg() {
      return this.execution_date
        ? `/sc/footer-${this.award_id}.png`
        : `/sc/footer.png`
    },
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
        vm.ctxTop.drawImage(vm.imgObjectTop, 0, 0, vm.w, vm.h)
      }

      this.drawMid()
    },

    drawMid() {
      this.ctxMid.canvas.style.opacity = 0
      this.ctxMid.fillStyle = 'purple'
      this.ctxMid.fillRect(0, 0, this.w, this.h)
      this.ctxMid.globalCompositeOperation = 'destination-out'
    },

    eventDown() {
      this.isDrawing = true
    },
    eventUp() {
      this.isDrawing = false
    },
    eventMove(ev) {
      if (this.isDrawing) {
        if (ev.changedTouches) {
          ev = ev.changedTouches[ev.changedTouches.length - 1]
        }

        let { top, left } = this.wrapCanvas.getBoundingClientRect()

        let x = ev.clientX - left
        let y = ev.clientY - top
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
        this.isDrawing = false
        this.ctxMid.globalCompositeOperation = 'destination-over'
        this.ctxMid.canvas.style.opacity = 0
        this.ctxTop.globalCompositeOperation = 'destination-over'
        this.ctxTop.canvas.style.opacity = 0

        return apiAxios({
          method: 'post',
          url: '/Activity/UpdateActivityLog',
          data: {
            id: this.activity_log_id,
          },
        })
          .then(() => {
            this.execution_date = new Date()
            return this.$dialog.show(`恭喜獲得${this.award_name}`, {
              title: '訊息',
            })
          })
          .then(() => {
            this.dialog = true
          })
      }
    },
    to() {
      if (this.promote_router_to.startsWith('/')) {
        this.$router.push(this.promote_router_to)
      } else {
        if (window.GroupJSInterface) {
          window.location.href = `${this.popUpRouterTo}&external_browser=2`
        } else {
          window.open(this.popUpRouterTo)
        }
      }
    },
    get() {
      this.isLoadingForButton = true
      if (new Date(this.start_date) > new Date()) {
        this.$dialog.show(
          `活動尚未開始，裝置系統時間為 ${new Date().toLocaleString()}`,
          {
            title: '訊息',
          }
        )
      } else if (new Date(this.end_date) < new Date()) {
        this.$dialog.show(`活動已經結束`, {
          title: '訊息',
        })
      } else {
        return apiAxios({
          method: 'post',
          url: '/Activity/CreateActivityLog',
          data: {
            activity_id: this.id,
          },
        })
          .then(() => {
            return apiAxios({
              method: 'post',
              url: '/Activity/GetActivityLog',
              data: { activity_id: this.id },
            })
          })
          .then(res => {
            this.activity_log_id = res.result.id
            this.award_id = res.result.award_id
            this.award_name = res.result.award_name
            this.execution_date = res.result.execution_date

            this.isLoadingForButton = false

            this.$nextTick(() => {
              this.draw()
              this.imgObjectBottom = new Image()
              this.imgObjectBottom.src = this.bottomImg
              this.imgObjectBottom.onload = () => {
                this.ctxBot.drawImage(
                  this.imgObjectBottom,
                  0,
                  0,
                  this.w,
                  this.h
                )
              }
            })
          })
          .finally(() => {
            this.isLoadingForButton = false
          })
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
  background-color: #f8d1dc;
  background-image: linear-gradient(179deg, #f8d1dc 0%, #f771af 100%);
  max-width: 600px;
  margin: 0 auto;
}
</style>