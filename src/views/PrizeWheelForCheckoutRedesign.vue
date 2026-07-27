<template>
  <div id="app">
    <div class="container pa-0" style="position: relative">
      <div class="pa-0 ma-0">
        <v-img
          class="pa-0 ma-0"
          style="vertical-align: top; font-size: 0px"
          width="100%"
          :src="headerImgUrl"
          alt="上方"
        />
      </div>
      <template v-if="isLoading">
        <v-skeleton-loader
          class="mx-auto"
          max-width="360"
          type="card"
        ></v-skeleton-loader>
      </template>
      <template v-else>
        <div
          class="wrap-main-bg"
          :style="`
            background-image: url(${background2ImgUrl});
            background-repeat: repeat;
            background-size: cover;
            `"
        >
          <div class="wrap-turntable">
            <section class="turntable">
              <div
                class="background-wheel"
                :style="{
                  transform:
                    'translate(-50%, -50%) rotate(' + currentRotation + 'deg)',
                  transition: isSpinning
                    ? 'transform 4.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
                    : 'none',
                }"
              >
                <img :src="`${wheelImgUrl}`" alt="輪盤" />
              </div>

              <div class="turntable_wrap">
                <img
                  class="turntable_btn"
                  width="100%"
                  :src="`${goImgUrl}`"
                  alt="指針-按鈕"
                  @click="go"
                />

                <img
                  class="turntable_pointer"
                  :src="`${pointerImgUrl}`"
                  alt="指針-指針"
                />
              </div>

              <div style="width: 100%; height: 100%"></div>
            </section>
            <div class="turntable-base">
              <img :src="`${baseImgUrl}`" width="100%" alt="底座" />
            </div>
          </div>

          <div class="wrap-main-bottom-img">
            <div class="main-bottom-img">
              <img :src="`${bannerImgUrl}`" alt="下方" />
            </div>
          </div>
        </div>
        <section>
          <div
            :style="`
              background-image: url(${background1ImgUrl});
              background-repeat: repeat;
              padding: 20px;
              background-size: contain;`"
          >
            <div style="display: flex; justify-content: center">
              <v-dialog v-model="dialogForLog" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="mx-auto mt-3 mb-6"
                    style="max-width: 250px"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <img width="100%" :src="`${buttonImgUrl}`" alt="按鈕" />
                  </div>
                </template>
                <v-card>
                  <v-card-title> 執行紀錄 </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            log?.award_name
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            log?.execution_date
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
            <div
              v-html="activity_description"
              style="
                background: white;
                padding: 20px;
                border-radius: 20px;
                line-height: 1.5;
                text-align: justify;
              "
            ></div>
          </div>
        </section>
      </template>
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
          this.activity_description = res.result.activity_description
          this.execution_quota_type = res.result.execution_quota_type
          this.isSpinning = false
          this.headerImgUrl = res.result.header_img_url
          this.background1ImgUrl = res.result.background1_img_url
          this.background2ImgUrl = res.result.background2_img_url
          this.wheelImgUrl = res.result.wheel_img_url
          this.pointerImgUrl = res.result.pointer_img_url
          this.buttonImgUrl = res.result.button_img_url
          this.bannerImgUrl = res.result.banner_img_url
          this.goImgUrl = res.result.go_img_url
          this.baseImgUrl = res.result.base_img_url
          return Promise.all([
            apiAxios({
              method: 'post',
              url: '/Activity/GetActivityAwardArrayV2',
              data: {
                activity_id: this.id,
                checkout_id: this.$route.params.ckeckoutId,
              },
            }).then(res => {
              this.gifts = res.result
            }),
            apiAxios({
              method: 'post',
              url: '/Activity/GetActivityLog',
              data: {
                activity_id: this.id,
                checkout_id: this.$route.params.ckeckoutId,
              },
            }).then(res => {
              this.log = res.result
            }),
          ]).then(() => {
            this.isLoading = false
            this.activityLogUpdated = true
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
      log: {},
      start_date: '',
      end_date: '',
      pop_up_img_url: '',
      promote_router_to: '',
      isLoading: true,
      execution_date: '',
      dialog: false,
      dialogForLog: false,
      deg: 0,
      gifts: [],
      activityLogUpdated: false,
      currentRotation: 0, // 新增：用於記錄當前旋轉角度
      isSpinning: false,
      background1ImgUrl: '',
      background2ImgUrl: '',
      wheelImgUrl: '',
      buttonImgUrl: '',
      pointerImgUrl: '',
      bannerImgUrl: '',
      goImgUrl: '',
      baseImgUrl: '',
    }
  },
  computed: {
    anglePerPrize() {
      return 360 / this.gifts.length
    },
    bottomOffsetAngle() {
      const n = this.gifts.length
      return n % 4 === 0 ? 0 : this.anglePerPrize / 2
    },
    selectedPrizeName() {
      const rawDeg = this.currentRotation % 360
      const correctedDeg = (360 - rawDeg + this.anglePerPrize / 2) % 360
      const index =
        Math.floor(correctedDeg / this.anglePerPrize) % this.gifts.length
      return this.gifts[index]?.award_name.replace(/<br\/?>/g, '') || ''
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
      if (!this.activityLogUpdated || this.id == '' || this.isSpinning) {
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
      } else {
        this.triggerTurntable()
      }
    },
    async triggerTurntable() {
      if (this.isSpinning) return
      this.isSpinning = true
      this.activityLogUpdated = false

      try {
        const res = await apiAxios({
          method: 'post',
          url: '/Activity/CreateActivityLogV3',
          data: {
            activity_id: this.id,
            checkout_id: this.$route.params.ckeckoutId,
          },
        })
        this.award_id = res.result

        let index = this.gifts.findIndex(x => this.award_id == x.award_id)
        if (index === -1) {
          throw new Error('咦～好像出了點小狀況，請重新整理頁面或稍後再試。')
        }

        // 定義重抽函式
        const tryDraw = () => {
          const baseSpins = 4
          // 隨機選一個 index
          this.selectedIndex = Math.floor(Math.random() * this.gifts.length)
          const targetDeg = this.selectedIndex * this.anglePerPrize
          const finalRotation =
            this.currentRotation + baseSpins * 360 + targetDeg

          // 推回實際獎項 index
          const rawDeg = finalRotation % 360
          const correctedDeg = (360 - rawDeg + this.anglePerPrize / 2) % 360
          const resultIndex =
            Math.floor(correctedDeg / this.anglePerPrize) % this.gifts.length
          const resultPrize = this.gifts[resultIndex].award_id
          this.award_name = this.gifts[resultIndex].award_name.replace(
            /<br\/?>/g,
            ''
          )
          // 比對獎品 award_id
          if (resultPrize === this.award_id) {
            // 符合則執行旋轉動畫
            this.currentRotation = finalRotation
            setTimeout(() => {
              this.isSpinning = false
              this.activityLogUpdated = true
              this.$dialog.show(`恭喜您轉中的獎項為${this.award_name}🎆`, {
                title: '訊息',
              })
              this.updateActivityLog()
            }, 4500)
          } else {
            // 不符合，重抽（用 setTimeout 避免阻塞）
            setTimeout(tryDraw, 4)
          }
        }
        // 開始抽獎
        tryDraw()
      } catch (error) {
        console.error('抽獎失敗', error)
        this.$dialog.show(error.message || '抽獎失敗，請稍後再試', {
          title: '訊息',
        })
        this.isSpinning = false
        this.activityLogUpdated = true
      }
    },
    updateActivityLog() {
      return Promise.all([
        apiAxios({
          method: 'post',
          url: '/Activity/GetActivityLog',
          data: {
            activity_id: this.id,
            checkout_id: this.$route.params.ckeckoutId,
          },
        }).then(res => {
          this.log = res.result
        }),
      ])
    },
    generateSectorPoints(index) {
      const angle = this.anglePerPrize
      const startRad = ((angle * index - angle / 2) * Math.PI) / 180
      const endRad = ((angle * index + angle / 2) * Math.PI) / 180
      const radius = 40
      const x1 = Math.cos(startRad) * radius
      const y1 = Math.sin(startRad) * radius
      const x2 = Math.cos(endRad) * radius
      const y2 = Math.sin(endRad) * radius
      return `0,0 ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(
        1
      )},${y2.toFixed(1)}`
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  background-size: contain;
  background-repeat: no-repeat;
}

.wrap-main-bg {
  position: relative;
  width: 100%;
  padding-bottom: 110%;
}

.wrap-main-top-img {
  position: absolute;
  top: 0%;
  left: 5%;
  width: 90%;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.main-top-img {
  width: 100%;
  padding-bottom: 42.8571%;
  max-width: 700px;
}

.main-top-img img {
  position: absolute;
  width: 100%;
  max-width: 700px;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.wrap-main-bottom-img {
  position: absolute;
  bottom: 2%;
  left: 10%;
  width: 80%;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.main-bottom-img {
  width: 100%;
  padding-bottom: 28.5714%;
  max-width: 700px;
}

.main-bottom-img img {
  position: absolute;
  width: 100%;
  max-width: 700px;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.main-bg-img {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.turntable-base {
  z-index: 1;
  position: absolute;
  right: 8%;
  left: auto;
  bottom: -7%;
  width: 86%;
}

.wrap-turntable {
  position: absolute;
  width: 100%;
  z-index: 1;
  top: -8%;
  right: 0px;
  box-sizing: border-box;
}

section.turntable {
  position: relative;
  width: 100%;
  max-width: 800px;
  padding-bottom: 100%;
  z-index: 2;
}

.background-wheel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%;
  height: 75%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  z-index: 0;
}
.background-wheel img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.turntable_wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
}

.turntable_btn {
  position: absolute;
  z-index: 2;
}

.turntable_pointer {
  position: absolute;
  left: 50%;
  top: -20%;
  transform: translate(-50%, 0%) translateX(3px);
  z-index: 1;
}

/* 響應式調整圖片大小 */
@media screen and (max-width: 767px) {
  .background-wheel {
    width: 80%;
    height: 80%;
  }

  section.turntable div.list ul li {
    font-size: 14px;
  }
  section.turntable div.list ul li img {
    width: 40px;
  }
  section.turntable button.turntable_btn {
    font-size: 42px;
  }
  .turntable-base {
    bottom: -9%;
  }
}

@media screen and (max-width: 540px) {
  .wrap-main-bottom-img {
    left: 5%;
    width: 90%;
    bottom: 3%;
  }
  .turntable_wrap {
    width: 25%;
    height: 25%;
  }
  .wrap-main-bg {
    position: relative;
    width: 100%;
    padding-bottom: 135%;
  }
  .wrap-turntable {
    position: absolute;
    width: 100%;
    z-index: 1;
    top: -2%;
    right: 0px;
    box-sizing: border-box;
  }
  .turntable-base {
    bottom: -50px;
  }
}

@media screen and (max-width: 414px) {
  .background-wheel {
    width: 90%;
    height: 90%;
  }
  section.turntable div.list ul li img {
    display: none;
  }
  .turntable-base {
    bottom: -60px;
  }
}
</style>
