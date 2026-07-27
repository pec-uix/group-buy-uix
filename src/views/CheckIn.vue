<template>
  <div class="mt-7">
    <div
      v-if="
        $dayjs().isBetween(
          '2025-01-01T00:00:00+08:00',
          '2025-06-30T23:59:59+08:00'
        )
      "
    >
      <v-img
        :src="'https://unilife.pec.com.tw/images/check-in-head-pc-2025.jpg'"
        class="d-none d-sm-flex"
        style="cursor: pointer"
      ></v-img>
      <v-img
        :src="'https://unilife.pec.com.tw/images/check-in-head-mobile-2025.jpg'"
        class="d-sm-none"
        style="cursor: pointer"
      ></v-img>
    </div>
    <div v-else>
      <v-img
        :src="'https://unilife.pec.com.tw/images/check-in-head-pc-2025_2.jpg'"
        class="d-none d-sm-flex"
        style="cursor: pointer"
      ></v-img>
      <v-img
        :src="'https://unilife.pec.com.tw/images/check-in-head-mobile-2025_2.jpg'"
        class="d-sm-none"
        style="cursor: pointer"
      ></v-img>
    </div>
    <h6 class="text-h6 primary--text text-center mt-6">
      目前已累計 {{ acc.toFixed(1) }} 元 購物金
    </h6>

    <div class="d-flex justify-center mt-2">
      <v-btn
        @click="checkIn"
        rounded
        depressed
        color="primary"
        :loading="isLoading || isSubmitting"
        :disabled="isComplete"
      >
        {{ isComplete ? $dayjs().format('YYYY-MM-DD') + '已簽到' : '立即簽到' }}
      </v-btn>
      <!-- <v-btn
        v-if="new Date() < new Date('2024-02-01T00:00:00+08:00')"
        color="secondary"
        depressed
        class="ml-2"
        @click="$router.push('/reward?type=available')"
      >
        立即領券
      </v-btn> -->
      <!-- <v-btn v-else color="secondary" depressed class="ml-2" @click="share"> -->
      <v-btn color="secondary" depressed class="ml-2" @click="share">
        <background-svg
          backgroungUrl="/share.svg"
          width="20px"
          height="20px"
          color="#fff"
        ></background-svg>
        分享活動
      </v-btn>
    </div>

    <v-toolbar class="mt-4" flat>
      <v-spacer></v-spacer>
      <v-btn
        fab
        text
        small
        @click="$refs.calendar.prev()"
        :disabled="new Date().getMonth() == month"
      >
        <background-svg
          backgroungUrl="/chevron_left.svg"
          width="14px"
          height="14px"
          :color="new Date().getMonth() == month ? '#bbb' : '#000'"
        ></background-svg>
      </v-btn>
      <v-toolbar-title>
        {{ $refs.calendar ? $refs.calendar.title : '' }}
      </v-toolbar-title>
      <v-btn
        fab
        text
        small
        @click="$refs.calendar.next()"
        :disabled="new Date().getMonth() == month - 1"
      >
        <background-svg
          backgroungUrl="/chevron_right.svg"
          width="14px"
          height="14px"
          :color="new Date().getMonth() == month - 1 ? '#bbb' : '#000'"
        ></background-svg>
      </v-btn>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-skeleton-loader v-show="isLoading" type="paragraph"></v-skeleton-loader>
    <v-calendar
      v-show="!isLoading"
      locale="zhHant"
      @change="dateChange"
      ref="calendar"
      style="height: 600px"
      v-model="value"
      :event-ripple="false"
    >
      <template #day-label> <div></div></template>
      <template v-slot:day="{ day, date }">
        <div class="fill-height d-flex flex-column">
          <div
            class="text-center"
            :class="{
              'secondary--text': date == $dayjs().format('YYYY-MM-DD'),
            }"
          >
            {{ day }}日
          </div>
          <div class="d-flex justify-center align-center flex-grow-1">
            <v-chip
              v-if="
                recordArray.some(x => x.check_in_date.substring(0, 10) == date)
              "
              outlined
              small
              color="primary"
            >
              {{
                recordArray.find(x => x.check_in_date.substring(0, 10) == date)
                  .award
              }}
            </v-chip>
          </div>
        </div>
      </template>
    </v-calendar>
    <div class="my-4 pa-2 primary white--text">
      <h6 class="text-h6">活動說明：</h6>
      <ol>
        <li>
          <span
            v-if="
              $dayjs().isBetween(
                '2025-01-01T00:00:00+08:00',
                '2025-06-30T23:59:59+08:00'
              )
            "
          >
            2025/1/1-2025/06/30
          </span>
          <span v-else> 2025/7/1-2025/12/31 </span>
          每日簽到，連續簽到第1天~第10天每天可獲得1元購物金，連續簽到第11天~第20天每天可獲得2元購物金，連續簽到第21天以後每天可獲得3元購物金。若中斷簽到，則下次重新獲得1元購物金重新計算。
        </li>
        <li>每人/每日限領一次，PC與手機每日限擇一裝置領取。</li>
        <li>
          UNI團購網購物金回饋若有爭議，以UNI團購網後台紀錄作為歸戶標準，恕不接受以截圖、翻拍等方式要求回饋，未遵循活動方式及規則者，恕不予回饋。
        </li>
        <li>天天簽到購物金於簽到後隔天進行發放，每張折價券使用期限為30天。</li>
        <li>UNI團購網購物金回饋視同無折抵上限折價券。</li>
      </ol>
    </div>
    <v-dialog
      v-model="dialog"
      :overlay-opacity="0.8"
      max-width="min(800px, 80vh)"
      persistent
    >
      <v-btn
        absolute
        top
        right
        outlined
        color="white"
        icon
        elevation="0"
        style="z-index: 20"
        @click="dialog = false"
      >
        <background-svg
          backgroungUrl="/close.svg"
          width="21px"
          height="21px"
          color="#fff"
        ></background-svg>
      </v-btn>
      <v-img
        class="white--text text-h4"
        max-width="min(800px, 80vh)"
        :aspect-ratio="1 / 1"
        :src="popUpImgUrl"
        @click="toProfile"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-dialog>
    <v-dialog
      v-model="flashSaleDialog"
      :overlay-opacity="0.8"
      content-class="rounded-xl flash-sale-dialog"
      max-width="1280"
      relative
      persistent
      :transition="false"
    >
      <div style="position: relative">
        <v-btn
          v-if="flashSaleDialog"
          absolute
          outlined
          color="white"
          icon
          elevation="0"
          style="z-index: 20; top: 6px; right: 7px"
          @click="closePopUp()"
        >
          <background-svg
            backgroungUrl="/close.svg"
            width="20px"
            height="20px"
            color="#fff"
          ></background-svg>
        </v-btn>
        <v-card class="rounded-xl" style="overflow: hidden">
          <div class="flash-sale-dialog-head">
            <div class="text-h4 white--text font-weight-bold mt-6 mb-3">
              <i class="fa-solid fa-fire mr-3" style="color: #ffe30e"></i
              >爆品限時購<i
                class="fa-solid fa-fire ml-3"
                style="color: #ffe30e"
              ></i>
            </div>
          </div>

          <div class="py-0 py-md-3">
            <recommend-slide
              :is-check-in="true"
              :product-array="productExplosiveArray"
              :section-name="'ga-check-in-hot-soon'"
            ></recommend-slide>
          </div>
          <div class="d-flex justify-center mb-4">
            <v-btn
              depressed
              color="#e93123"
              active-class="no-active"
              class="rounded-pill white--text text-h6 px-10"
              :to="`/flash-sale`"
              large
              @click="flashSaleDialog = false"
            >
              查看更多
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import { apiAxios } from '@/api'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  components: {
    BackgroundSvg,
  },
  created() {
    return this.getAndSetCheckIn().then(() => {
      this.getAwardSum()
      this.getProductExplosive()
      // if (this.isComplete) {
      //   return this.getAndShowPopUp()
      // }
    })
  },
  data() {
    return {
      value: '',
      recordArray: [],
      start_date: '',
      end_date: '',
      isLoading: false,
      isSubmitting: false,
      month: '',
      dialog: false,
      popUpImgUrl: '',
      popUpRouterTo: '',
      acc: 0,
      flashSaleDialog: false,
      productExplosiveArray: [],
    }
  },
  computed: {
    canShare() {
      return window.navigator.canShare
    },
    // acc() {
    //   return this.recordArray.reduce((acc, cur) => acc + cur.award, 0)
    // },
    isComplete() {
      return this.recordArray.some(
        x =>
          x.check_in_date.substring(0, 10) == this.$dayjs().format('YYYY-MM-DD')
      )
    },
    calendarTitle() {
      return this.$refs.calendar ? this.$refs.calendar.title : ''
    },
  },
  methods: {
    share() {
      const shareData = {
        title: '㊙️祕密活動告訴你天天簽到賺OP點數🏆點數1點=1元',
        text: `㊙️祕密活動告訴你
天天簽到賺OP點數🏆
點數1點=1元💰

⏰2022/07/12-2023/03/31每日到「UNI團購網」簽到，簽到第1天可獲得0.5元OPEN POINT，簽到第2天再獲得0.6元OPEN POINT，簽到第3天再獲得0.7元OPEN POINT，簽到第4天再獲得0.8元OPEN POINT，簽到第5天再獲得0.9元OPEN POINT，簽到第6天再獲得1元OPEN POINT，之後連續簽到，每天簽到皆再可獲得1元OPEN POINT💰💰。若中斷簽到，則下次重新從獲得0.5元OPEN POINT開始計算。

🧧趁現在賺起來👉`,
        url: window.location.href,
      }
      if (typeof this.canShare === 'function') {
        navigator.share(shareData)
      } else {
        this.$copyText(shareData.url)
          .then(() => this.$snackbar.add('網址已複製', { color: 'secondary' }))
          .catch(() => this.$snackbar.add('無法分享'))
      }
    },
    checkIn() {
      this.isSubmitting = true
      return (
        apiAxios({
          method: 'post',
          url: '/CheckIn/InsertCheckIn',
          data: {},
        })
          .then(res =>
            this.$snackbar.add(`${res.result} 簽到成功`, { color: 'success' })
          )
          .then(() => this.getAndSetCheckIn())
          .then(() => this.getAwardSum())
          // .then(() => this.getAndShowPopUp())
          .finally(() => {
            if (this.productExplosiveArray.length > 0) {
              this.flashSaleDialog = true
            }
            this.isSubmitting = false
          })
      )
    },
    toProfile() {
      if (this.popUpRouterTo.startsWith('/')) {
        this.$router.push(this.popUpRouterTo)
      } else {
        if (window.GroupJSInterface) {
          let newUrl = new URL(this.popUpRouterTo)
          newUrl.searchParams.set('external_browser', 2)
          window.location.href = newUrl.href
        } else {
          window.open(this.popUpRouterTo)
        }
      }
    },
    dateChange({ start, end }) {
      this.month = start.month
      this.start_date = this.$refs.calendar.getStartOfWeek(start).date
      this.end_date = this.$refs.calendar.getEndOfWeek(end).date
    },
    getAndShowPopUp() {
      return apiAxios({
        method: 'post',
        url: '/Banner/GetPopUpArray',
        data: { banner_type: '2' },
      }).then(res => {
        if (res.result[0]) {
          this.popUpImgUrl = res.result[0].img_url_pc
          this.popUpRouterTo = res.result[0].router_to
          this.dialog = true
        }
      })
    },
    getAndSetCheckIn() {
      this.isLoading = true
      return apiAxios({
        method: 'post',
        url: '/CheckIn/GetCheckInArrayV2',
        data: {
          start_date: this.start_date,
          end_date: this.end_date,
        },
      })
        .then(res => {
          this.recordArray = res.result
        })
        .finally(() => (this.isLoading = false))
    },
    getAwardSum() {
      return apiAxios({
        method: 'post',
        url: '/CheckIn/GetCheckInAward',
      }).then(res => {
        this.acc = res.result
        // this.recordArray = res.result
      })
    },
    getProductExplosive() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductExplosiveV2',
        params: {
          pageNo: 1,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          storeType: [],
          paymentType: [],
          receiveType: [],
          brand: [],
          category: [],
          categorySecondary: [],
          categoryMinor: [],
          minPrice: '0',
          maxPrice: '0',
          orderBy: { key: 'default_order_seq', asc: true },
        },
      }).then(res => {
        this.productExplosiveArray = res.result.product
        if (this.isComplete && this.productExplosiveArray.length > 0) {
          this.flashSaleDialog = true
        }
      })
    },
    closePopUp() {
      this.flashSaleDialog = false
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id: 'ga-check-in-hot-soon-close',
      })
    },
  },
}
</script>

<style>
.flash-sale-dialog {
  max-width: 1280px !important;
}
.flash-sale-dialog-head {
  background-color: #e93123;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 1024px) {
  .flash-sale-dialog {
    max-width: 378px !important;
  }
}
</style>
