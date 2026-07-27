<template>
  <pec-member-template
    img-src="/my-order.jpg"
    :breadcrumbs="[
      {
        text: '首頁',
        disabled: false,
        to: '/',
      },
      {
        text: '賣貴通報',
        disabled: false,
      },
    ]"
  >
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <template v-if="isProductLoading">
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
    </template>
    <template v-else>
      <v-card elevation="0">
        <!-- <v-tabs
          v-model="tab"
          background-color="white"
          fixed-tabs
          icons-and-text
          centered
          show-arrows
        >
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab
            v-for="(item, i) in tabItems"
            :key="i"
            :href="'#tab-' + i"
            @click="currentTab = i"
          >
            {{ item.text }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="tab-0" style="padding: 1px"> -->
        <v-card class="pa-3 mb-4">
          <v-row>
            <v-col cols="12" md="12">
              <h6
                class="rounded-0 text-h6 pec-title-bl font-weight-bold"
                style="border-color: red"
              >
                賣貴通報
              </h6>
            </v-col>
            <v-col cols="12" sm="6" :class="{ 'col-sm-12': !(days == 0) }">
              <v-select
                class="mb-4"
                v-model="days"
                :items="daysArray"
                filled
                hide-details
              ></v-select>
            </v-col>
            <v-col
              cols="12"
              :class="{ 'col-sm-6': days == 0 }"
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
                  range
                  no-title
                  @input="dialog_dates = dates.length < 2 ? true : false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="mb-4">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  outlined
                  v-model="search"
                  prepend-inner-icon="search"
                  label="搜尋"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="selectArray"
                  v-model="select"
                  outlined
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <!-- .filter(x => x.payment_status != '6') -->
        <v-card
          class="pa-2 mt-4"
          v-for="checkout in filteredCheckoutArray"
          :key="checkout.id"
          :ripple="false"
        >
          <div class="d-flex text-h6">
            通報編號: {{ checkout.id }}
            <v-spacer></v-spacer>
            <v-btn
              icon
              height="32"
              width="32"
              color="primary"
              class="mr-2 ml-3 pb-1"
              @click.stop.prevent="$store.commit('toLine')"
            >
              <v-img src="/support_agent.png" eager max-width="50"></v-img>
            </v-btn>
          </div>
          <v-divider class="my-2"></v-divider>

          <div
            style="position: relative"
            @click="$router.push(checkout.new_product_url)"
          >
            <div class="d-flex mb-1 mb-sm-0">
              <v-img
                aspect-ratio="1"
                class="flex-grow-0 align-self-start"
                width="96px"
                :src="checkout.img_url"
                contain
              ></v-img>
              <div
                class="d-flex flex-column justify-space-between flex-grow-1 px-3 px-md-4 py-1"
              >
                <div>
                  <div
                    class="primary--text mb-4 d-flex justify-space-between align-center"
                  >
                    <span class="pec-card-title font-weight-bold"
                      >通報平台： {{ checkout.ec_platform_name }}</span
                    >
                    <div class="status-chips">
                      <v-chip v-if="checkout.reply" label small color="primary">
                        已回覆
                      </v-chip>
                      <v-chip v-else label small> 未回覆 </v-chip>
                    </div>
                  </div>

                  <div class="text-subtitle-2 font-weight-bold mb-1 pl-2">
                    {{ checkout.product_name }}
                  </div>
                  <div class="text-body-1 pl-2" style="color: #757575">
                    規格： {{ checkout.spec }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="d-flex justify-space-between align-center"
              :class="{ 'mb-1': !checkout.reply }"
            >
              <div class="text-body-1 pec-footer">
                通報金額：
                <span class="primary--text font-weight-bold"
                  >${{ checkout.price.toLocaleString() }}</span
                >
              </div>
              <div style="color: #757575">
                通報日期：
                <span style="white-space: nowrap">{{
                  $dayjs(checkout.notice_date).format('YYYY-MM-DD HH:mm:ss')
                }}</span>
              </div>
            </div>
            <div v-if="checkout.reply" class="mt-3">
              <div
                class="pa-4 text-body-1 font-weight-black"
                style="background-color: #ececec; color: #313131"
              >
                通報回覆：
              </div>
              <div class="px-4 py-3 pb-1" style="width: 100%; overflow: auto">
                <div class="text-body-1 font-weight-black mb-1">
                  {{ checkout.reply }}
                </div>
                <div class="text-body-1 text-end">
                  {{ checkout.reply_date }}
                </div>
              </div>
            </div>
          </div>
        </v-card>
        <v-sheet
          class="mx-auto text-center rounded mt-4 px-2 py-1 red--text font-weight-black"
          style="border: 3px solid #ff0000"
          outlined
          >此佈告欄僅公告調降當時的價格！<span style="white-space: nowrap"
            >消費者訂購以購買時商品網頁價格為主。
          </span>
        </v-sheet>
      </v-card>
    </template>
  </pec-member-template>
</template>
<script>
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
import { apiAxios } from '@/api'

export default {
  components: { PecMemberTemplate },
  props: ['order-id'],
  watch: {
    days: {
      immediate: true,
      handler: function () {
        return this.fetchData()
      },
    },
    dates() {
      if (this.dates.length == 2) {
        return this.fetchData()
      }
    },
  },
  created() {
    this.dates.push(this.$dayjs().format('YYYY-MM-DD'))
    this.getNetAmount()
    // this.fetchGroupData()
  },
  data() {
    return {
      isProductLoading: false,
      checkoutArray: [],
      overlay: false,
      select: '所有通報',
      days: 31,
      search: '',
      selectArray: ['所有通報', '已回覆', '未回覆'],
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
      like: null,
      tab: null,
      tabItems: [
        {
          text: '我的訂單',
          length: 0,
        },
        {
          text: '我的開團',
          length: 0,
        },
        {
          text: '我的跟團',
          length: 0,
        },
      ],
      currentTab: 0,
      myTeamBuy: [],
      myJoinTeamBuy: [],
      amountGpMaster: [],
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
    filteredCheckoutArray() {
      let filteredArray = this.checkoutArray
        .filter(checkout =>
          [checkout].some(
            x =>
              !this.search ||
              x.product_name
                .toUpperCase()
                .includes(this.search.toUpperCase()) ||
              x.id == this.search
          )
        )
        .filter(checkout =>
          [checkout].some(
            x =>
              this.select == '所有通報' ||
              ('已回覆' == this.select ? x.reply : !x.reply)
          )
        )
      return filteredArray
    },
  },
  methods: {
    fetchData() {
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
      return apiAxios({
        method: 'post',
        url: '/ProductNotice/GetProductNotice',
        data: daysData,
      })
        .then(res => {
          this.checkoutArray = res.result
        })
        .finally(() => (this.isProductLoading = false))
    },
    createPayment(id) {
      this.overlay = true
      return apiAxios({
        method: 'post',
        url: '/Checkout/CreatePaymentUrl',
        data: {
          checkout_id: id,
        },
      })
        .then(res => {
          if (res.result) {
            window.location.href = res.result
          }
        })
        .catch(err => {
          this.$snackbar.add(err)
          this.overlay = false
        })
    },
    insert(order) {
      if (order.audit_procedure !== 'Y') {
        let formData = new FormData()
        formData.append('preorder_id', order.id)
        formData.append('reviews', order.reviews)
        formData.append('like_mark', order.like_mark == 0 ? 1 : 0)

        return apiAxios({
          method: 'post',
          url: '/Comment/InsertComment',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(() => {
          order.like_mark = order.like_mark == 0 ? 1 : 0
        })
      }
    },
    commentBtnTitle(order) {
      if (order.audit_procedure == 'Y') {
        switch (order.audit_results) {
          case 'Y':
            return '審核通過'
          case 'N':
            return '審核未通過'
          default:
            return '審核中'
        }
      } else {
        return '評論產品'
      }
    },
    commentBtnColor(order) {
      if (order.audit_procedure == 'Y') {
        switch (order.audit_results) {
          case 'Y':
            return 'primary'
          case 'N':
            return ''
          default:
            return 'warning'
        }
      } else {
        return ''
      }
    },
    fetchGroupData() {
      return Promise.all([
        apiAxios({
          method: 'post',
          url: '/TeamBuy/GetMyTeamBuy',
        }),
        apiAxios({
          method: 'post',
          url: '/TeamBuy/GetMyJoinTeamBuy',
        }),
      ]).then(res => {
        let [myTeamBuy, myJoinTeamBuy] = res.map(e => e.result)
        this.myTeamBuy = myTeamBuy
        this.myJoinTeamBuy = myJoinTeamBuy
      })
    },
    closeTeamBuy(teambuy) {
      return apiAxios({
        method: 'post',
        url: '/TeamBuy/CloseTeamBuy',
        data: {
          id: teambuy.id,
        },
      }).then(res => {
        if (res.status) {
          this.$snackbar.add(res.message, { color: 'success' })
          teambuy.close_mark = 'Y'
        } else {
          this.$snackbar.add(res.message)
        }
      })
    },
    cancelJoinTeamBuy(joinTeambuy) {
      return apiAxios({
        method: 'post',
        url: '/TeamBuy/CancelJoinTeamBuy',
        data: {
          id: joinTeambuy.id,
        },
      }).then(res => {
        if (res.status) {
          this.$snackbar.add(res.message, { color: 'success' })
          joinTeambuy.cancelled = 'Y'
        } else {
          this.$snackbar.add(res.message)
        }
      })
    },
    getNetAmount() {
      return apiAxios({
        method: 'post',
        url: '/GpMaster/GetNetAmount',
      }).then(res => {
        if (res.result) {
          this.amountGpMaster = res.result
        }
      })
    },
  },
}
</script>
<style scoped>
.pec-footer {
  color: #757575;
  padding-left: 120px;
}
table.my-order {
  width: 100%;
  border-collapse: collapse;
}
table.my-order th,
table.my-order td {
  padding: 12px;
  border: 1px solid #dddddd;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.v-expansion-panels >>> .v-expansion-panel-content__wrap {
  padding: 0;
}
.status-chips {
  flex: 0 0 auto;
}
.amountGpMaster-title {
  padding-left: 12px;
}

.step-date {
  font-size: 14px !important;
}
.wrap-step {
  text-align: center;
  width: 120px;
  min-width: 120px;
}
.stepBar {
  width: 100%;
  height: 40px;
  margin-bottom: 41px;
}
.stepBar .step-star {
  background: #fff;
  border: 1px solid #ca1f1d;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
}
.stepBar .step-star::after,
.stepBar .step::after {
  position: absolute;
  content: '';
  display: block;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: #ca1f1d;
  top: 2px;
  left: 2px;
}
.stepBar .step-star.complate::before {
  position: absolute;
  display: block;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: #ca1f1d;
  top: -1px;
  left: -1px;
  font-family: FontAwesome;
  display: inline-block;
  content: '\f00c';
  color: #fff;
  font-size: 15px;
  text-align: center;
  line-height: 18px;
  z-index: 100;
}
.stepBar .step {
  background: #fff;
  width: 24px;
  height: 24px;
  border: 1px solid #ca1f1d;
  border-radius: 50%;
  margin-left: 47px;
  position: relative;
}
.stepBar .step::before {
  position: absolute;
  content: '';
  display: block;
  width: 97px;
  border-top: 3px solid #ca1f1d;
  top: 10px;
  left: -97px;
  z-index: 0;
}
.stepBar .step.active::before {
  border-top: 2px solid #ca1f1d;
}
.stepBar .step.complate::before {
  border-top: 2px solid #ca1f1d;
}
.stepBar .step.active {
  border: 2px solid #ca1f1d;
}
.stepBar .step.active::after {
  position: absolute;
  content: '';
  display: block;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: #ca1f1d;
  top: 2px;
  left: 2px;
}
.stepBar .step.complate {
  border: 2px solid #ca1f1d;
}
.stepBar .step.complate::after {
  position: absolute;
  display: block;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: #ca1f1d;
  top: -1px;
  left: -1px;
  font-family: FontAwesome;
  display: inline-block;
  content: '\f00c';
  color: #fff;
  font-size: 15px;
  text-align: center;
  line-height: 18px;
  z-index: 100;
}
.pec-card-title {
  font-size: 16px;
}

@media (max-width: 1024px) {
  .amountGpMaster-title {
    border-left: 5px solid currentColor;
    padding-left: 8px;
  }
}
@media (max-width: 959px) {
  .stepBar .step-star::after,
  .stepBar .step::after {
    width: 8px;
    height: 8px;
  }
  .stepBar .step-star {
    width: 14px;
    height: 14px;
  }
  .stepBar .step {
    width: 14px;
    height: 14px;
    margin-left: 36px;
  }
  .step-date {
    font-size: 10px !important;
    color: #787878;
  }
  .wrap-step {
    text-align: center;
    width: 85px;
    min-width: 85px;
  }
  .stepBar .step::before {
    width: 71px;
    border-top: 2px solid #ca1f1d;
    top: 5px;
    left: -72px;
  }
  .stepBar .step-star::before {
    width: 14px;
    border-top: 2px solid #ca1f1d;
    top: 5px;
    right: -15px;
  }
  .pec-footer {
    padding-left: 116px;
  }
}
@media (max-width: 520px) {
  .pec-card-title {
    font-size: 14px;
  }
  .pec-footer {
    padding-left: 12px;
  }
}
</style>
