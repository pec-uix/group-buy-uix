<template>
  <div>
    <v-img class="mx-auto mb-4" max-width="800px" :src="headerImgUrl"></v-img>
    <template v-if="isLoading">
      <v-skeleton-loader
        class="mx-auto"
        max-width="360"
        type="card"
      ></v-skeleton-loader>
    </template>
    <template v-else>
      <v-responsive
        class="mx-auto mt-4 pt-2"
        :aspect-ratio="1"
        max-width="400px"
      >
        <div style="position: relative">
          <div class="turnTable">
            <div class="turnTable__body">
              <canvas
                class="turnTable__canvas"
                :style="{ transform: `rotate(${rotateDegCompute}deg)` }"
              ></canvas>
            </div>
            <div class="turnTable__button" @click="go">
              <div class="turnTable__arrow"></div>
              <div class="turnTable__button__content">
                <span class="turnTable__button__text">GO</span>
              </div>
            </div>
          </div>
        </div>
      </v-responsive>

      <div class="mx-auto px-2" style="max-width: 400px">
        <div class="text-center" v-if="execution_quota_type == 'AMOUT'">
          再消費
          <span class="primary--text">
            {{ gap }}
          </span>
          元即可增加一次執行次數
        </div>
        <v-dialog v-model="dialogForLog" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <div class="d-flex justify-center">
              <v-btn
                depressed
                color="secondary"
                block
                v-bind="attrs"
                v-on="on"
                style="height: auto; white-space: unset !important"
                class="w-100 py-1 record-btn"
              >
                <div>
                  <div>
                    瀏覽執行紀錄(剩餘{{
                      Math.max(checkoutCount - logArray.length, 0)
                    }}次)
                  </div>
                  <div style="font-size: 10px !important">
                    {{ btnExtraText }}
                  </div>
                </div>
              </v-btn>
            </div>
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
    </template>

    <div class="mx-auto my-4 pa-2 primary white--text" style="max-width: 800px">
      <h6 class="text-h6">活動說明：</h6>
      <div v-html="activity_description"></div>
    </div>
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
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
export default {
  props: ['id'],
  created() {
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
          this.color1 = res.result.color1
          this.color2 = res.result.color2
          this.activity_description = res.result.activity_description
          this.execution_quota_type = res.result.execution_quota_type

          return Promise.all([
            apiAxios({
              method: 'post',
              url: '/Activity/GetActivityAwardArray',
              data: { activity_id: this.id },
            }).then(res => {
              let chance = Math.floor(100 / res.result.length)
              this.gifts = res.result.map(x => ({
                award_id: x.award_id,
                chance,
                text: x.award_wheel_name || x.award_name,
                textColor: x.text_color,
                backgroundColor: x.background_color,
              }))
            }),
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
              data: { activity_id: this.id },
            }).then(res => {
              this.checkoutCount = res.result.quota
              this.gap = res.result.gap
            }),
          ]).then(() => {
            this.isLoading = false
            this.activityLogUpdated = true
            this.$nextTick(function () {
              if (document.querySelector('.turnTable__canvas')) {
                this.drawCanvas()
              }
            })
          })
        }
      })
      .finally(() => (this.isLoading = false))
  },
  data() {
    return {
      headerImgUrl: '',
      activity_description: '',
      execution_quota_type: 'COUNT',
      logArray: [],
      checkoutCount: 0,
      gap: 0,

      award_id: '',
      award_name: '',
      start_date: '',
      end_date: '',
      pop_up_img_url: '',
      promote_router_to: '',
      isLoading: true,
      execution_date: '',
      dialog: false,
      dialogForLog: false,
      deg: 0,
      config: {
        baseSize: 600,
        borderWidth: 0,
        borderColor: '#ff0000',
      },
      giftDegs: [],
      gifts: [],
      color1: '#f298b7',
      color2: '#ac8aff',
      activityLogUpdated: false,
      rotateDeg: 0,
    }
  },
  computed: {
    pixelRatio() {
      return window.devicePixelRatio * 1 || 2
    },
    countDataChance() {
      let totalChance = 0
      this.gifts.forEach(data => {
        totalChance += data.chance
      })
      return totalChance
    },
    rotateDegCompute() {
      return (this.rotateDeg * 360 + this.deg) * -1
    },
    btnExtraText() {
      if (
        this.$dayjs().isBetween(
          this.$dayjs('2024-02-01 00:00:00'),
          this.$dayjs('2024-02-07 23:59:59')
        )
      ) {
        return '2/1-2/7期間消費所累積資格次數至2/7，逾期則自動取消資格。'
      } else if (
        this.$dayjs().isBetween(
          this.$dayjs('2024-02-08 00:00:00'),
          this.$dayjs('2024-02-14 23:59:59')
        )
      ) {
        return '2/8-2/14新春限定活動，消費所累積資格次數至2/14，逾期則自動取消資格。'
      } else if (
        this.$dayjs().isBetween(
          this.$dayjs('2024-02-15 00:00:00'),
          this.$dayjs('2024-02-29 23:59:59')
        )
      ) {
        return '2/15-2/29期間消費所累積資格次數至2/29，逾期則自動取消資格。'
      } else {
        return ''
      }
    },
  },
  methods: {
    to() {
      if (this.promote_router_to.startsWith('/')) {
        this.$router.push(this.promote_router_to)
      } else {
        if (window.GroupJSInterface) {
          window.location.href = `${this.promote_router_to}&external_browser=2`
        } else {
          window.open(this.promote_router_to)
        }
      }
    },
    go() {
      if (!this.activityLogUpdated || this.id == '') {
        return
      } else if (new Date(this.start_date) > new Date()) {
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
      } else if (this.checkoutCount <= this.logArray.length) {
        this.$dialog.show(`可執行次數不足`, {
          title: '訊息',
        })
      } else {
        this.triggerTurntable()
      }
    },
    async triggerTurntable() {
      this.activityLogUpdated = false
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
          this.award_id = res.result[0].award_id
          this.award_name = res.result[0].award_name

          let index = this.gifts.findIndex(x => this.award_id == x.award_id)
          let multiple = index === -1 ? 0 : index
          this.deg = getRandomInt(
            (360 / this.gifts.length) * multiple + 5,
            (360 / this.gifts.length) * (multiple + 1) - 5
          )

          this.rotateDeg = this.rotateDeg + 4

          setTimeout(() => {
            this.$dialog
              .show(`恭喜你抽中的獎項為${this.award_name}`, {
                title: '訊息',
              })
              .then(() => {
                this.activityLogUpdated = true
              })
          }, 4200)

          return this.updateActivityLog()
        })
    },
    updateActivityLog() {
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
          data: { activity_id: this.id },
        }).then(res => {
          this.checkoutCount = res.result.quota
          this.gap = res.result.gap
        }),
      ])
    },
    drawCanvas() {
      const centerPoint = this.config.baseSize * (this.pixelRatio / 2)
      const turnTable = document.querySelector('.turnTable__canvas')
      const ctx = turnTable.getContext('2d')
      turnTable.setAttribute('width', this.config.baseSize * this.pixelRatio)
      turnTable.setAttribute('height', this.config.baseSize * this.pixelRatio)
      this.giftDegs = []
      let lastAngle = 0
      // 內部區塊繪製
      this.gifts.forEach((gift, index) => {
        // 計算角度(全部資料機率 / 單片機率 * 360)
        const deg = (gift.chance / this.countDataChance) * 360
        // 計算弧度(角度 * PI / 180)，
        const angle = deg * (Math.PI / 180)
        // 儲存角度範圍
        this.giftDegs[index] = {
          from: index === 0 ? 0 : this.giftDegs[index - 1].to,
          to: index === 0 ? deg : this.giftDegs[index - 1].to + deg,
          name: gift.text,
        }
        // 開始繪製
        ctx.save()
        ctx.beginPath()
        ctx.translate(centerPoint, centerPoint)
        ctx.moveTo(0, 0)
        // 旋轉弧度 = 上次的區塊弧度(初始0)
        ctx.rotate(lastAngle)
        // 繪製區塊，半徑-外框線 避免 框線擠到canvas邊框
        ctx.arc(0, 0, centerPoint - this.config.borderWidth, 0, angle, false)
        // 更新最後一次的結束角度
        lastAngle += angle
        // 區塊底色填充
        ctx.fillStyle = gift.backgroundColor
        ctx.fill()
        /** 邊框繪製 */
        // ctx.lineWidth = this.config.borderWidth * this.pixelRatio
        // ctx.strokeStyle = this.config.borderColor
        // ctx.closePath()
        // ctx.stroke()
        // 內容文字繪製
        ctx.rotate(angle / 2)
        ctx.fillStyle = gift.textColor
        ctx.font = `${
          (this.config.baseSize / gift.text.length) * (this.pixelRatio / 4)
        }px Microsoft JhengHei`
        ctx.textBaseline = 'middle'
        ctx.fillText(gift.text, centerPoint / 2.25, 0)
        //
        ctx.restore()
      })
    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
  },
}
</script>
<style scoped>
.turnTable {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  width: 316px;
  height: 316px;
  border-radius: 50%;
  -webkit-box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: v-bind(color1);
}
.turnTable__body {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-size: 0px;
}
.turnTable__canvas {
  width: 300px;
  height: 300px;
  transition: transform 4s cubic-bezier(0.1, 0, 0, 1);
}
/* .turnTable__canvas--autoTrun { */
/* transform: rotate(4662deg); */
/* -webkit-animation: AutoTrun 4s forwards cubic-bezier(0.1, 0, 0, 1); */
/* animation: AutoTrun 4s forwards cubic-bezier(0.1, 0, 0, 1); */
/* } */

.turnTable__button {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  padding: 8px;
  border-radius: 50%;
  background-color: v-bind(color1);
  -webkit-box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5);
  color: v-bind(color1);
  cursor: pointer;
}
.turnTable__button__content {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background-color: v-bind(color2);
}
.turnTable__button__text {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  /* color: #fff; */
  color: #000;
  font-weight: 900;
  font-size: var(--buttonFontSize);
}
.turnTable__arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) rotate(270deg);
  transform: translate(-50%, -50%) rotate(270deg);
  left: 100%;
  border: 30px solid transparent;
  border-top: 54px solid v-bind(color2);
}
/* @keyframes AutoTrun {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(4662deg);
  }
} */
.record-btn >>> .v-btn__content {
  width: 100%;
}
</style>
