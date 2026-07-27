<template>
  <div class="wrapper-bg" @pointerup.prevent="eventUp">
    <v-img class="mx-auto mb-4" :src="headerImgUrl"></v-img>
    <template v-if="isLoading">
      <v-skeleton-loader class="mx-auto" type="paragraph"></v-skeleton-loader>
    </template>
    <template v-else>
      <div class="d-flex justify-center">
        <div id="wrap-canvas" v-show="isVisible">
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
      <!-- <div class="py-4 d-flex justify-center">
        <v-img class="flex-grow-0" :src="footerImg" width="300px"></v-img>
      </div> -->
      <div class="pa-2" v-show="!isVisible">
        <v-img
          v-if="quota > logArray.length"
          @click="get"
          src="/sc/get-one.png"
        >
        </v-img>
        <v-img v-else src="/sc/not-qualified-20240103.png"> </v-img>
      </div>
    </template>
    <div class="px-2 mt-4">
      <v-dialog v-model="dialogForLog" max-width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            x-large
            depressed
            style="font-size: 18px"
            color="secondary"
            class="font-weight-bold"
            block
            v-bind="attrs"
            v-on="on"
          >
            瀏覽執行紀錄(剩餘{{ Math.max(quota - logArray.length, 0) }}次)
          </v-btn>
        </template>
        <v-card>
          <v-card-title> 執行紀錄 </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item two-line v-for="log in logArray" :key="log.id">
                <v-list-item-content>
                  <v-list-item-title>{{ log.award_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    log.execution_date
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogForLog = false">
              關閉
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="mx-auto my-4 pa-2" style="max-width: 800px">
      <h6 class="text-h6">活動說明：</h6>
      <div v-html="activity_description"></div>
    </div>
    <!-- <v-img src="/sc/scratch-memo-cosmetic.png"> </v-img> -->
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
  props: ['id'],
  mounted() {
    this.isLoading = true
    return apiAxios({
      method: 'post',
      url: '/Activity/GetActivity',
      data: {
        id: this.id,
      },
    })
      .then(res => {
        if (res.result) {
          this.start_date = new Date(res.result.start_date)
          this.end_date = new Date(res.result.end_date)
          this.pop_up_img_url = res.result.pop_up_img_url
          this.promote_router_to = res.result.promote_router_to
          this.headerImgUrl = res.result.header_img_url
          this.activity_description = res.result.activity_description
          return Promise.all([
            apiAxios({
              method: 'post',
              url: '/Activity/GetActivityLogArray',
              data: { activity_id: this.id },
            }).then(res => {
              this.logArray = res.result
            }),
            apiAxios({
              method: 'post',
              url: '/Activity/GetExecutionQuota',
              data: {
                activity_id: this.id,
              },
            }).then(res => {
              this.quota = res.result.quota
            }),
          ])
        }
      })
      .finally(() => (this.isLoading = false))
  },
  data() {
    return {
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
      logArray: [],
      quota: 0,
      headerImgUrl: '',
      activity_description: '',
      isVisible: false,
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

      bottomImg: '', //下層圖片

      dialogForLog: false,
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
        }).then(() => {
          this.execution_date = new Date()
          return this.$dialog
            .show(`恭喜獲得${this.award_name}`, {
              title: '訊息',
            })
            .then(() => {
              this.isVisible = false
            })
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
      this.isLoading = true
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
              url: '/Activity/GetActivityLogArray',
              data: { activity_id: this.id },
            })
          })
          .then(res => {
            this.logArray = res.result
            this.activity_log_id = res.result[0].id
            this.award_id = res.result[0].award_id
            this.award_name = res.result[0].award_name
            this.bottomImg = res.result[0].bottom_img_url

            this.isLoading = false

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
              this.ctxTop.canvas.style.opacity = 1
              this.triggered = false
              this.isVisible = true
            })
          })
          .finally(() => {
            this.isLoading = false
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
  background-color: #ffb9ec;
  /* background-image: linear-gradient(179deg, #f8d1dc 0%, #f771af 100%); */
  max-width: 600px;
  margin: 0 auto;
}
</style>
