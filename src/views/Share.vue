<template>
  <div class="mt-7">
    <v-img
      :src="'https://unilife.pec.com.tw/images/comment-head-pc-2024-H1-ver2.jpg'"
      class="d-none d-sm-flex"
      style="cursor: pointer"
    ></v-img>
    <v-img
      :src="'https://unilife.pec.com.tw/images/comment-head-mobile-2024-H1-ver2.jpg'"
      class="d-sm-none"
      style="cursor: pointer"
    ></v-img>
    <h6 class="text-h6 primary--text text-center mt-6">
      目前已累計 {{ accAll.toFixed(1) }} 點 OPEN POINT
    </h6>
    <div
      class="share-btn-area"
      v-if="new Date() < new Date('2024-02-01T00:00:00+08:00')"
    >
      <div
        class="share-btn share-btn-left"
        v-if="new Date() < new Date('2023-04-01T00:00:00+08:00')"
      >
        <button @click="share" class="d-none d-sm-flex" v-if="canShareMobile">
          <img src="/share-btn-share.jpg" width="170" />
        </button>
        <button @click="share" class="d-sm-none" v-if="canShareMobile">
          <img src="/share-btn-share.jpg" width="140" />
        </button>
        <div
          class="text-subtitle-2 text-center mt-2"
          style="color: #ff330d; letter-spacing: 1.5px !important"
        >
          分享商品/活動
          <span style="white-space: nowrap"
            >已累計 {{ accShare.toFixed(1) }} 點</span
          >
        </div>
      </div>
      <div
        class="share-btn share-btn-right"
        v-if="new Date() < new Date('2024-07-01T00:00:00+08:00')"
      >
        <button
          @click="showCommentOrder"
          class="d-none d-sm-flex"
          v-if="canShareMobile"
        >
          <img src="/share-btn-comment.png" width="170" />
        </button>
        <button
          @click="showCommentOrder"
          class="d-sm-none"
          v-if="canShareMobile"
        >
          <img src="/share-btn-comment.png" width="140" />
        </button>
        <!--{{
            commentArray.length == 0 ? '尚無可分享產品評論' : '立即分享產品評論'
          }}-->
        <div
          class="text-subtitle-2 text-center mt-2"
          style="color: #a66633; letter-spacing: 1.5px !important"
        >
          分享產品評論
          <span style="white-space: nowrap"
            >已累計 {{ accComment.toFixed(1) }} 點</span
          >
        </div>
      </div>
    </div>

    <v-toolbar class="mt-4" flat>
      <v-spacer></v-spacer>
      <v-btn
        fab
        text
        small
        color="grey darken-2"
        :disabled="end_date <= '2022-05-10'"
        @click="$refs.calendar.prev()"
      >
        <background-svg
          backgroungUrl="/chevron_left.svg"
          width="12px"
          height="12px"
          color="#000"
        ></background-svg>
      </v-btn>
      <v-toolbar-title>
        {{ $refs.calendar ? $refs.calendar.title : '' }}
      </v-toolbar-title>
      <v-btn
        fab
        text
        small
        color="grey darken-2"
        :disabled="end_date >= '2023-12-31'"
        @click="$refs.calendar.next()"
      >
        <background-svg
          backgroungUrl="/chevron_right.svg"
          width="12px"
          height="12px"
          color="#000"
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
      style="height: 700px"
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
            <div class="d-none d-md-block">
              <v-badge
                color="red"
                :content="dailyShare(date)"
                offset-x="13"
                offset-y="13"
                v-if="
                  shareArray.some(x => x.share_date.substring(0, 10) == date)
                "
              >
                <v-img
                  eager
                  max-width="48"
                  class="font-weight-black text-center white--text"
                  src="/share-point-share-pc.png"
                  style="font-size: 23px"
                >
                </v-img>
              </v-badge>
              <v-badge
                color="red"
                :content="dailyComment(date)"
                offset-x="13"
                offset-y="13"
                v-if="
                  commentArray.some(x => x.share_date.substring(0, 10) == date)
                "
              >
                <v-img
                  eager
                  max-width="48"
                  class="font-weight-black text-center white--text ml-3"
                  src="/share-point-comment-pc.png"
                  style="font-size: 23px"
                >
                </v-img>
              </v-badge>
            </div>
            <div
              class="d-md-none d-flex justify-center align-center flex-grow-1 flex-wrap flex-column"
            >
              <v-badge
                color="red"
                :content="dailyShare(date)"
                offset-x="13"
                offset-y="13"
                v-if="
                  shareArray.some(x => x.share_date.substring(0, 10) == date)
                "
              >
                <v-img
                  eager
                  max-width="40"
                  class="font-weight-black text-center white--text mb-1"
                  src="/share-point-share-mobile.png"
                  style="font-size: 23px"
                >
                </v-img>
              </v-badge>
              <v-badge
                color="red"
                :content="dailyComment(date)"
                offset-x="13"
                offset-y="13"
                v-if="
                  commentArray.some(x => x.share_date.substring(0, 10) == date)
                "
              >
                <v-img
                  eager
                  max-width="40"
                  class="font-weight-black text-center white--text mb-1"
                  src="/share-point-comment-mobile.png"
                  style="font-size: 23px"
                >
                </v-img>
              </v-badge>
            </div>
          </div>
        </div>
      </template>
    </v-calendar>
    <div class="my-4 pa-2 primary white--text">
      <h6 class="text-h6">活動說明：</h6>
      <h5 class="text-h6"></h5>
      <span> </span>
      <h5 class="text-h6"></h5>
      <ol>
        <li>
          活動時間： 2023/01/01-2024/01/31
          於好評分享活動頁面內推薦2022/5/10起成立的訂單，並寫下推薦文字(限10字以上)，經管理員1-2天審核，審核通過後，即可獲得2元OPEN
          POINT點數，每日評論次數無上限※「成立訂單」查詢方式：從「我的訂單」內點選商品，即可查詢訂單狀態，當訂單已成立即會顯
          示在「好評推薦」商品內。
        </li>
        <li>每人/每日限領一次，此活動僅限手機裝置使用。</li>
        <li>
          OPEN
          POINT回饋若有爭議，以團購網後台紀錄作為歸戶標準，恕不接受以截圖、翻拍等方式要求回饋，未遵循活動方式及規則者，恕不予回饋。
        </li>
        <li>
          除上述活動說明，若有於活動網頁說明之未盡事宜，UNI團購網擁有保留修改活動內容之權利。
        </li>
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
          width="20px"
          height="20px"
          color="#fff"
        ></background-svg>
      </v-btn>
      <v-toolbar
        class="primary darken-2 font-weight-bold cursor-pointer"
        dark
        @click="toProfile"
      >
        <background-svg
          class="mt-2"
          backgroungUrl="/ads_click.svg"
          width="20px"
          height="20px"
          color="#fff"
        ></background-svg>
        <span class="text-h6 mt-1 font-weight-bold"
          >點擊圖片 分享</span
        ></v-toolbar
      >
      <v-img
        class="white--text text-h4 row-pointer cursor-pointer"
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
      <!--<div
        class="primary darken-2 text-center pa-2 row-pointer cursor-pointer"
        @click="toProfile"
      >
        <span class="white--text">分享給好友賺取 OPEN POINT</span>
      </div>-->
    </v-dialog>
    <v-dialog v-model="dialog_showOrder" width="800">
      <v-card>
        <v-toolbar color="primary" dark>好評推薦賺 OPEN POINT</v-toolbar>
        <v-card style="border-radius: 0">
          <v-container>
            <v-row>
              <v-col cols="12" sm="4" :class="{ 'col-sm-6': !(days == 0) }">
                <v-text-field
                  outlined
                  v-model="search"
                  prepend-inner-icon="search"
                  label="搜尋"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" :class="{ 'col-sm-6': !(days == 0) }">
                <v-select
                  v-model="days"
                  :items="daysArray"
                  outlined
                  hide-details
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                :class="{ 'col-sm-4': days == 0 }"
                v-if="days == 0"
              >
                <v-menu
                  v-model="dialog_dates"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      v-on="on"
                      v-bind="attrs"
                      v-model="dateRangeText"
                      label="日期區間"
                      readonly
                      class="share-dates"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="zh"
                    color="secondary"
                    v-model="dates"
                    min="2022-05-10"
                    range
                    no-title
                    @input="dialog_dates = dates.length < 2 ? true : false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <div
          style="
            height: calc(90vh - 349px);
            overflow: auto;
            padding-bottom: 14px;
            overflow-x: hidden;
          "
        >
          <template v-if="isProductLoading">
            <v-skeleton-loader
              type="list-item-avatar-three-line"
            ></v-skeleton-loader>
            <v-skeleton-loader
              type="list-item-avatar-three-line"
            ></v-skeleton-loader>
            <v-skeleton-loader
              type="list-item-avatar-three-line"
            ></v-skeleton-loader>
            <v-skeleton-loader
              type="list-item-avatar-three-line"
            ></v-skeleton-loader>
          </template>
          <template v-else>
            <v-card
              class="pa-2 mx-2 mt-4"
              v-for="checkout in filteredCheckoutArray"
              :key="checkout.id"
              :ripple="false"
            >
              <div class="d-flex subtitle-1 grey--text text--darken-4">
                結帳編號: {{ checkout.id }}
                <v-spacer></v-spacer>
              </div>
              <v-divider class="my-2"></v-divider>

              <div v-for="order in checkout.order_array" :key="order.id">
                <div class="d-flex mb-4">
                  <v-img
                    aspect-ratio="1"
                    class="flex-grow-0 align-self-start my-1"
                    width="96px"
                    :src="order.img_url"
                  ></v-img>
                  <div
                    class="d-flex flex-column justify-space-between flex-grow-1 px-4 py-1"
                  >
                    <div>
                      <div
                        class="pec-card-title primary--text mb-2 d-flex justify-space-between align-top flex-wrap"
                      >
                        <span
                          class="grey--text text--darken-2 body-2 px-2 py-1 text-center grey lighten-3 rounded"
                          >訂單編號： {{ order.id }}</span
                        >
                        <span class="text-body-2 grey--text text--darken-1">
                          建立日期:{{
                            $dayjs(order.creation_date).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )
                          }}
                        </span>
                        <!--<v-chip
                          v-if="order.display_status_name"
                          label
                          small
                          color="primary"
                          >{{ order.display_status_name }}</v-chip
                        >-->
                      </div>
                      <div class="text-subtitle-2 mb-1">
                        {{ order.product_name }}
                      </div>
                      <div
                        class="d-flex justify-space-between align-end flex-wrap"
                      >
                        <div class="text-subtitle-2">
                          訂單金額：
                          <span class="text-h6 primary--text"
                            >${{ order.order_total.toLocaleString() }}</span
                          >
                        </div>
                        <div class="mb-1">
                          <v-btn
                            color="primary"
                            depressed
                            @click.stop="showComment(order.id)"
                          >
                            推薦商品
                          </v-btn>
                        </div>
                        <!--<v-btn
                          :color="order.like_mark == 1 ? 'primary' : 'second'"
                          :outlined="order.like_mark == 1"
                          class="ml-3"
                          depressed
                          small
                          @click.stop="insert(order)"
                        >
                          <v-icon>thumb_up_off_alt</v-icon>
                          讚
                        </v-btn>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </template>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="justify-space-between">
          <div class="text-subtitle-2 primary--text">*請挑選商品進行評價</div>
          <v-btn color="blue darken-1" text @click="dialog_showOrder = false">
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_showComment" width="800">
      <v-toolbar color="primary" dark
        >好評推薦賺 OPEN POINT - 產品評論</v-toolbar
      >
      <Comment
        :orderId="orderId"
        @update="hideAndUpdateComment"
        v-if="dialog_showComment"
      ></Comment>
    </v-dialog>
  </div>
</template>
<script>
import Comment from '@/components/Comment.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { apiAxios } from '@/api'

export default {
  components: {
    Comment,
    BackgroundSvg,
  },
  watch: {
    days() {
      this.getAndSetCommentOrderArray()
    },
    dates() {
      if (this.dates.length == 2) {
        this.getAndSetCommentOrderArray()
      }
    },
  },
  created() {
    this.getAndSetShare()
    this.getAndSetComment()
    this.dates.push(this.$dayjs().format('YYYY-MM-DD'))
  },
  data() {
    return {
      value: '', //月曆當前
      shareArray: [], //分享點數陣列
      commentArray: [], //評論點數陣列
      commentOrderArray: [], //可評論訂單陣列
      start_date: '', //起始
      end_date: '', //結束
      isLoading: false,
      isSubmitting: false, //按鈕讀取
      month: '', //月份
      dialog: false,
      dialog_showOrder: false,
      dialog_showComment: false,
      popUpImgUrl:
        'https://unilife.pec.com.tw/images/EIWY20fuVoA9oc9vUoA9l.png',
      popUpRouterTo: '/product/20686',
      search: '',
      isProductLoading: false,
      days: 185, //訂單區間
      orderId: '',
      daysArray: [
        {
          text: '最近1個月',
          value: 31,
        },
        {
          text: '最近3個月',
          value: 93,
        },
        {
          text: '最近半年',
          value: 185,
        },
        {
          text: '自訂區間',
          value: 0,
        },
      ],
      dates: ['2022-05-10'],
      dialog_dates: false,
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
    accShare() {
      return this.shareArray.reduce((acc, cur) => acc + cur.award, 0)
    },
    accComment() {
      return this.commentArray.reduce((acc, cur) => acc + cur.award, 0)
    },
    accAll() {
      return (
        this.shareArray.reduce((acc, cur) => acc + cur.award, 0) +
        this.commentArray.reduce((acc, cur) => acc + cur.award, 0)
      )
    },
    isComplete() {
      return this.shareArray.some(
        x => x.share_date.substring(0, 10) == this.$dayjs().format('YYYY-MM-DD')
      )
    },
    calendarTitle() {
      return this.$refs.calendar ? this.$refs.calendar.title : ''
    },
    filteredCheckoutArray() {
      return this.commentOrderArray.filter(checkout =>
        checkout.order_array.some(
          x =>
            !this.search ||
            x.product_name.toUpperCase().includes(this.search.toUpperCase()) ||
            x.id == this.search
        )
      )
    },
    canShare() {
      return window.navigator.canShare && !window.GroupJSInterface
    },
    canShareMobile() {
      return window.GroupJSInterface
    },
  },
  methods: {
    share() {
      this.getAndShowPopUp()
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
        data: { banner_type: '3' },
      }).then(res => {
        if (res.result[0]) {
          this.popUpImgUrl = res.result[0].img_url_pc
          this.popUpRouterTo = res.result[0].router_to
          this.dialog = true
        } else if (res.message == '成功') {
          this.dialog = true
        }
      })
    },
    getAndSetShare() {
      this.isLoading = true
      return apiAxios({
        method: 'post',
        url: '/Share/GetPoint',
        data: {},
      })
        .then(res => {
          this.shareArray = res.result
        })
        .finally(() => (this.isLoading = false))
    },
    getAndSetComment() {
      this.isLoading = true
      return apiAxios({
        method: 'post',
        url: '/Comment/GetCommentPoint',
        data: {},
      })
        .then(res => {
          this.commentArray = res.result
        })
        .finally(() => (this.isLoading = false))
    },
    showCommentOrder() {
      this.dialog_showOrder = true
    },
    showComment(orderId) {
      this.orderId = orderId
      this.dialog_showComment = true
    },
    hideAndUpdateComment(isUpdate) {
      if (isUpdate == true) {
        this.getAndSetCommentOrderArray()
      }
      this.dialog_showComment = false
    },
    getAndSetCommentOrderArray() {
      const daysData = {}
      let [start_date, end_date] = this.dates
      if (
        new Date(this.dates[0]).getTime() > new Date(this.dates[1]).getTime()
      ) {
        // prettier-ignore
        [start_date, end_date] = [end_date, start_date]
        this.dates[0] = start_date
        this.dates[1] = end_date
      }
      if (this.days == 0) {
        daysData['start_date'] = this.dates[0]
        daysData['end_date'] = this.dates[1]
      } else {
        daysData['days'] = this.days
      }
      this.isProductLoading = true
      apiAxios({
        method: 'post',
        url: '/MyOrder/GetCommentOrder',
        data: daysData,
      })
        .then(res => (this.commentOrderArray = res.result))
        .finally(() => (this.isProductLoading = false))
    },
    dailyShare(date) {
      return this.shareArray.find(x => x.share_date.substring(0, 10) == date)
        .award
    },
    dailyComment(date) {
      return this.commentArray.find(x => x.share_date.substring(0, 10) == date)
        .award
    },
  },
}
</script>
<style>
.cursor-pointer {
  cursor: pointer;
}
.share-btn-area {
  display: flex;
  margin-top: 8px;
  justify-content: center;
}
.share-btn-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}
.share-btn-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 16px;
}
.share-dates .v-input__control .v-text-field__details {
  display: none;
}
.share-dates .v-input__control .v-input__slot {
  margin-bottom: 0;
}
.v-calendar-weekly__week {
  min-height: auto !important;
}
@media (max-width: 767px) {
  .share-btn-left {
    max-width: 190px;
    align-items: center;
    margin-right: 0px;
    margin-left: 8px;
  }
  .share-btn-right {
    max-width: 190px;
    align-items: center;
    margin-left: 0px;
    margin-right: 8px;
  }
}
@media (max-width: 380px) {
  .v-btn:not(.v-btn--round).v-size--default {
    padding: 0 12px;
  }
}
</style>
