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
        text: '我的訂單',
        disabled: false,
      },
    ]"
  >
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <template>
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
        <v-card class="pa-2 mb-4">
          <v-row>
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
          <v-row class="mt-0">
            <v-col cols="12" md="6" class="pt-0">
              <h6 class="rounded-0 text-h6 pec-title-bl font-weight-bold mb-2">
                累計訂單金額：<span class="text-no-wrap"
                  >NT$ {{ allOrderTotalPrice.toLocaleString() }}</span
                >
              </h6>
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
                  clearable
                  append-icon="send"
                  @click:append="getMyOrderList()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="selectArray"
                  v-model="select"
                  item-text="title"
                  item-value="value"
                  outlined
                  hide-details
                  return-object
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <!-- .filter(x => x.payment_status != '6') -->
        <v-sheet id="myOrderList" class="myOrderList">
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
          <v-card
            class="pa-2 mt-4"
            v-for="(checkout, orderIndex) in checkoutArray"
            :key="checkout.id"
            :ripple="false"
          >
            <div class="d-flex text-h6">
              結帳編號: {{ checkout.id }}
              <v-spacer></v-spacer>

              <div class="d-flex align-center">
                <v-btn
                  class="ml-4 px-3 mt-1"
                  v-if="
                    new Date(checkout.payment_deadline) > new Date() &&
                    checkout.payment_status === '0' &&
                    checkout.payment_type === '2'
                  "
                  style="height: 24px"
                  depressed
                  small
                  color="secondary"
                  @click="createPayment(checkout.id)"
                >
                  重新付款
                </v-btn>
                <div v-if="checkout.checkout_add_cart_mark == 'Y'">
                  <v-chip
                    color="warning"
                    text-color="white"
                    label
                    small
                    class="px-3 ml-4"
                    @click.stop="addCartItemAgain('checkout_id', checkout.id)"
                  >
                    再買一次
                    <i class="fa-regular fa-hand-point-up ml-1"></i>
                  </v-chip>
                </div>
                <div
                  v-if="checkout.order_array[0].source === 'LINE'"
                  style="width: 57px"
                >
                  <v-img
                    src="https://unilife.pec.com.tw/images/LineOrder.png"
                    width="57"
                  >
                  </v-img>
                </div>
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
            </div>
            <v-divider class="my-2"></v-divider>
            <div
              v-for="(order, index) in expandedIndexes[orderIndex]
                ? checkout.order_array // 展開時顯示全部
                : checkout.order_array.slice(0, 1)"
              :key="order.id"
              @click="$router.push(`my-order/${order.id}`)"
              style="position: relative; cursor: pointer"
            >
              <v-overlay
                absolute
                style="z-index: 2; background-color: rgba(0, 0, 0, 0.8)"
                v-if="
                  select.title != '所有訂單' &&
                  select.title != '未執行轉盤訂單' &&
                  select.title != order.display_status_name
                "
                >同訂單非篩選類別之項目</v-overlay
              >
              <div class="d-flex">
                <v-img
                  aspect-ratio="1"
                  class="flex-grow-0 align-self-start"
                  width="96px"
                  :src="order.img_url"
                  contain
                ></v-img>
                <div
                  class="d-flex flex-column justify-space-between flex-grow-1 px-3 px-md-4 py-1"
                >
                  <div>
                    <div
                      class="pec-card-title primary--text mb-2 d-flex justify-space-between align-center"
                    >
                      <span>訂單編號： {{ order.id }}</span>
                      <div class="status-chips">
                        <v-chip
                          v-if="order.display_status_name"
                          label
                          small
                          color="primary"
                        >
                          {{ order.display_status_name }}
                        </v-chip>
                        <div
                          class="w-100"
                          v-if="order.preorder_add_cart_mark == 'Y'"
                        >
                          <v-chip
                            color="warning"
                            text-color="white"
                            label
                            small
                            class="px-1 mt-1 w-100 justify-center"
                            @click.stop="
                              addCartItemAgain('preorder_id', order.id)
                            "
                          >
                            再買一次
                            <i class="fa-regular fa-hand-point-up ml-1"></i>
                          </v-chip>
                        </div>
                      </div>
                    </div>

                    <div class="text-subtitle-2 mb-3">
                      <v-chip
                        v-if="order.is_spcloff_product == 'Y'"
                        class="mb-1 mt-1 px-3 mr-2"
                        style="font-size: 12px"
                        color="#FFE500"
                        small
                        >加價購</v-chip
                      >
                      {{ order.product_name }}
                    </div>
                    <div
                      class="d-flex justify-end"
                      v-if="order.invo_status === '1'"
                    >
                      <v-btn
                        :color="commentBtnColor(order)"
                        outlined
                        style="min-width: 78.23px"
                        depressed
                        small
                        @click.stop="$router.push(`comment/${order.id}`)"
                      >
                        {{ commentBtnTitle(order) }}
                      </v-btn>
                      <v-btn
                        :color="order.like_mark == 1 ? 'primary' : 'second'"
                        :outlined="order.like_mark == 1"
                        class="ml-3"
                        depressed
                        small
                        @click.stop="insert(order)"
                      >
                        <background-svg
                          backgroungUrl="/thumb_up_off_alt.svg"
                          width="20px"
                          height="20px"
                          color="#000"
                        ></background-svg>
                        讚
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pa-2">
                <div class="d-flex justify-space-between">
                  <div class="order-creation-date">
                    <span>訂單金額:</span>
                    <span class="text-h6 primary--text"
                      >${{ order.order_total.toLocaleString() }}</span
                    >
                    <span class="text-body-2" v-if="order.sale_rewards > 0">
                      (折價券折抵:${{
                        order.sale_rewards.toLocaleString()
                      }}) </span
                    ><span
                      class="d-none d-sm-inline-block"
                      style="white-space: nowrap"
                      :class="{ 'ml-2': !order.sale_rewards }"
                    >
                      結帳金額:
                      <span class="primary--text text-h6"
                        >${{
                          (
                            order.order_total - order.sale_rewards
                          ).toLocaleString()
                        }}</span
                      >
                    </span>
                  </div>
                  <div class="order-creation-date">
                    <span>建立日期:</span>
                    <span
                      class="mt-sm-0"
                      style="
                        display: inline-block;
                        height: 32px;
                        line-height: 32px;
                        white-space: nowrap;
                      "
                      >{{
                        $dayjs(order.creation_date).format(
                          'YYYY-MM-DD HH:mm:ss'
                        )
                      }}</span
                    ><span
                      class="d-inline-block d-sm-none text-body-1"
                      style="white-space: nowrap"
                      >結帳金額:
                      <span class="primary--text text-h6"
                        >${{
                          (
                            order.order_total - order.sale_rewards
                          ).toLocaleString()
                        }}</span
                      ></span
                    >
                  </div>
                </div>
              </div>

              <!-- <div class="pl-2 pb-2">
                <v-chip
                  v-if="order.payment_status_name"
                  label
                  outlined
                  small
                  class="mr-1"
                  color="primary"
                  >{{ order.payment_status_name }}</v-chip
                ><v-chip
                  v-if="order.receive_status_name"
                  label
                  outlined
                  small
                  class="mr-1"
                  color="primary"
                  >{{ order.receive_status_name }}</v-chip
                >
              </div> -->
              <div v-if="order.delivery_status">
                <div
                  class="pa-4 text-h6 font-weight-black d-none d-md-block"
                  style="background-color: #ececec"
                >
                  配送進度/明細
                </div>
                <div
                  class="pt-2 pt-md-5 pb-1"
                  style="width: 100%; overflow-y: auto"
                >
                  <div
                    class="d-flex stepBar clearfix justify-center justify-md-start"
                  >
                    <div
                      class="wrap-step"
                      v-for="(step, index) in order.delivery_status"
                      :key="index"
                    >
                      <div
                        :class="{
                          'step-star': index == 0,
                          step: index != 0,
                          now: step.status == 'now',
                          future: step.status == 'future',
                        }"
                      ></div>
                      <div class="pt-2">
                        <div
                          class="text-caption text-md-body-2"
                          :style="`${
                            step.status == 'pass' ? 'color:#CA1F1D;' : ''
                          }${step.status == 'now' ? 'color:#001AFF;' : ''}${
                            step.status == 'future' ? 'color:#656565;' : ''
                          }`"
                        >
                          {{ step.title }}
                        </div>
                        <div
                          class="text-caption text-md-body-2 text-decoration-underline"
                          :class="{
                            'pec-show-arrow':
                              logisticArray.includes(orderIndex),
                          }"
                          @click.stop="toggleLogistic(orderIndex)"
                          :style="`${
                            step.status == 'pass' ? 'color:#CA1F1D;' : ''
                          }${step.status == 'now' ? 'color:#001AFF;' : ''}${
                            step.status == 'future' ? 'color:#656565;' : ''
                          }cursor: pointer;`"
                          v-if="
                            step.title == '出貨中' &&
                            step.status != 'future' &&
                            order.logistic.length >= 1
                          "
                        >
                          配送詳情
                        </div>
                        <div
                          class="text-caption text-md-body-2"
                          style="letter-spacing: 0.01px !important"
                          :style="`${
                            step.status == 'pass' ? 'color:#CA1F1D;' : ''
                          }${step.status == 'now' ? 'color:#001AFF;' : ''}${
                            step.status == 'future' ? 'color:#656565;' : ''
                          }`"
                          v-else-if="step.status_date.substring(0, 1) != 0"
                        >
                          {{ step.status_date.substring(0, 10) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="pec-box-style"
                    v-if="logisticArray.includes(orderIndex)"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>物流商</th>
                          <th>宅配單號</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="item in order.logistic"
                          :key="item.tracking_number"
                        >
                          <template v-if="item.show_mark == 'Y'">
                            <td>{{ item.logistic_name }}</td>
                            <td>
                              <a
                                @click.prevent.stop="
                                  toLink(item.trace_web_link)
                                "
                                target="_blank"
                                class="text-decoration-underline"
                                style="color: #0038ff"
                                >{{ item.tracking_number }}</a
                              >
                            </td>
                          </template>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                v-else-if="
                  checkout.order_array.length !== index + 1 &&
                  expandedIndexes[orderIndex]
                "
                class="mb-4"
              >
                <v-divider></v-divider>
              </div>
              <v-expansion-panels flat @click.native.stop v-if="order.memo">
                <v-expansion-panel>
                  <v-expansion-panel-header class="px-2"
                    >訂單備註:</v-expansion-panel-header
                  >
                  <v-expansion-panel-content class="pl-2">{{
                    order.memo
                  }}</v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <v-divider></v-divider>
            <div class="py-2">
              <div class="text-end">
                <span>結帳總金額:</span>
                <span class="text-h6 primary--text"
                  >${{
                    checkout.order_array
                      .filter(order => order.delivery_status)
                      .reduce((sum, order) => sum + order.order_total, 0) -
                    checkout.order_array
                      .filter(order => order.delivery_status)
                      .reduce((sum, order) => sum + order.sale_rewards, 0)
                  }}</span
                >
                <span class="text-body-2">
                  (折價券折抵:${{
                    checkout.order_array
                      .filter(order => order.delivery_status)
                      .reduce((sum, order) => sum + order.sale_rewards, 0)
                  }})
                </span>
              </div>
              <div
                v-if="
                  $dayjs(checkout.order_array[0].creation_date).isAfter(
                    '2024-12-25T00:00:00+08:00'
                  )
                "
                class="mt-2"
              >
                <div
                  class="text-decoration-underline primary--text text--lighten-2 mt-1 text-center"
                  style="font-size: 14px"
                >
                  <span
                    @click="activityInfoDialog = true"
                    class="cursor-pointer"
                  >
                    轉盤活動說明
                  </span>
                </div>
                <!-- v-if="
                  checkout.order_array.filter(
                    x => x.order_status == '1'
                  ).length >= 2
                " -->
                <div v-if="+checkout.confirmed_count >= 2">
                  <div v-if="checkout.award_name">
                    <div class="text-center">
                      <span
                        class="activity-border"
                        style="border: 1px solid var(--v-primary-base)"
                      >
                        <span
                          class="activity-linear px-2 py-3"
                          style="
                            border-top-left-radius: 10px;
                            border-bottom-left-radius: 10px;
                          "
                          >轉盤活動</span
                        >
                        <span class="px-2 py-3 primary--text"
                          >恭喜您轉中的獎項為{{ checkout.award_name }}🎆</span
                        >
                      </span>
                    </div>
                  </div>
                  <div v-else>
                    <div class="text-center">
                      <span
                        class="pa-3 activity-linear activity-border cursor-pointer"
                        @click="
                          wheelRouter(
                            checkout.order_array[0].creation_date,
                            checkout.id
                          )
                        "
                      >
                        <span>恭喜您獲得本次活動資格!👆點我立即轉👆</span>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- v-else-if="
                  checkout.order_array.filter(
                    x => x.order_status == '1' || x.order_status == '0'
                  ).length >= 2
                " -->
                <div
                  v-else-if="
                    +checkout.confirmed_count + +checkout.placed_count >= 2
                  "
                >
                  <div class="text-center">
                    <span
                      class="activity-border pa-3"
                      style="border: 1px solid var(--v-primary-base)"
                    >
                      <span class="primary--text"
                        >商品結團中，待成立後即可執行轉盤!</span
                      >
                    </span>
                  </div>
                </div>
                <div v-else>
                  <div class="text-center">
                    <span
                      class="activity-border pa-3"
                      style="border: 1px solid var(--v-primary-base)"
                    >
                      <span class="primary--text"
                        >太可惜了!本次訂單未符合轉盤資格!</span
                      >
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <v-divider v-if="checkout.order_array.length > 1"></v-divider>
            <!-- 展開按鈕 -->
            <v-btn
              v-if="checkout.order_array.length > 1"
              class="mt-1"
              @click="toggleExpand(orderIndex)"
              block
              plain
            >
              {{ expandedIndexes[orderIndex] ? '收回' : '查看更多' }}
              <v-icon
                :style="
                  expandedIndexes[orderIndex]
                    ? 'transform: rotateZ(180deg)'
                    : ''
                "
                >$expand</v-icon
              >
            </v-btn>
          </v-card>
          <div class="d-flex justify-end mt-3">
            <v-pagination
              v-model="page"
              :length="totalPageCount"
              :total-visible="7"
              rounded="0"
            ></v-pagination>
          </div>
        </v-sheet>
      </v-card>
    </template>
    <v-dialog v-model="activityInfoDialog" max-width="480">
      <v-card class="py-2">
        <v-card-text class="black--text pt-2 pb-0">
          <div class="primary--text text-h5 font-weight-bold mb-2">
            活動說明
          </div>
          <div class="text-body-1 font-weight-bold">
            <span class="primary--text">
              任買2件團購網商品，轉盤購物金加碼送
            </span>
            <br />
            每筆結帳訂單中購買二項（含以上）不同規格商品，待
            <span class="primary--text">訂單成立 </span>依每筆結帳編
            號立即獲得轉盤購物金加碼送無門檻的電子折價券活動機會，一筆結帳編號可
            獲得一次轉盤機會，買越多轉越多，轉盤內有0.5%、1%、1.5%、2%購物金，本
            活動人人有獎。（轉盤獲得購物金計算將以單筆結帳編號金額進行計算，採個位
            數以四捨五入方式計算，發放折價券面額將以100元、10元、個位數元進行發
            送。）
          </div>
        </v-card-text>
        <v-card-actions class="mt-2">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            elevation="0"
            @click="activityInfoDialog = false"
          >
            關閉
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </pec-member-template>
</template>
<script>
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { apiAxios } from '@/api'
import { mapState } from 'vuex'

export default {
  components: { PecMemberTemplate, BackgroundSvg },
  props: ['order-id'],
  watch: {
    days: {
      handler: function () {
        this.getMyOrderList()
        this.getTotalPrice()
      },
    },
    dates() {
      if (this.dates.length == 2) {
        this.getMyOrderList()
        this.getTotalPrice()
      }
    },
    page() {
      this.getMyOrderList()
      this.expandedIndexes = {}
    },
    select() {
      this.getMyOrderList()
    },
    totalPageCount() {
      if (this.page > this.totalPageCount) {
        this.page = 1
      }
    },
  },
  activated() {
    if (
      !window.previousUrl.startsWith('/my-order') ||
      JSON.parse(localStorage.getItem('pec_refresh_order_list'))
    ) {
      this.getMyOrderList()
      localStorage.setItem('pec_refresh_order_list', false)
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    window.addEventListener('pageshow', this.handlePageShow)
  },
  beforeDestroy() {
    window.removeEventListener('pageshow', this.handlePageShow)
  },
  data() {
    return {
      expandedIndexes: {},
      isProductLoading: false,
      checkoutArray: [],
      overlay: false,
      select: { title: '所有訂單', value: 'all' },
      days: 93,
      search: '',
      selectArray: [
        { title: '所有訂單', value: 'all' },
        { title: '訂單已接收', value: 'received' },
        { title: '訂單成立', value: 'established' },
        { title: '出貨中', value: 'ship' },
        { title: '取貨點已到貨', value: 'arrived' },
        { title: '訂單已完成', value: 'finish' },
        { title: '訂單未成立', value: 'notEstablished' },
        { title: '訂單已取消', value: 'canceled' },
        { title: '未執行轉盤訂單', value: 'pendingSpin' },
      ],
      daysArray: [
        {
          text: '本月',
          value: -1,
        },
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
      logisticArray: [],
      page: 1,
      totalPageCount: 1,
      allOrderTotalPrice: 0,
      activityInfoDialog: false,
    }
  },
  beforeRouteLeave(to, from, next) {
    this.days = 93
    next()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.days = 93
    })
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
    ...mapState(['isCheckTester']),
  },
  methods: {
    handlePageShow(event) {
      // 如果是從快取恢復頁面(返回上一頁),執行 fetchData
      if (event.persisted) {
        this.overlay = false
        this.fetchData()
      }
    },
    fetchData() {
      // console.log('是否位在白名單內', this.isCheckTester)
      this.getNetAmount()
      // this.fetchGroupData()
      this.url = new URL(location.href)
      if (this.url.searchParams.get('status')) {
        this.select = this.selectArray.find(
          item => item.title === this.url.searchParams.get('status')
        )
        this.dates = [
          this.getThreeMonthsAgo(this.$dayjs().format('YYYY-MM-DD')),
          `${this.$dayjs().format('YYYY-MM-DD')}`,
        ]
        this.days = 0
      } else if (this.url.searchParams.get('dates')) {
        if (this.url.searchParams.get('dates') == 'year') {
          this.dates = [
            `${this.$dayjs().format('YYYY')}-01-01`,
            `${this.$dayjs().format('YYYY')}-12-31`,
          ]
          this.days = 0
        } else {
          this.dates = [
            `${this.$dayjs().format('YYYY')}-${this.$dayjs().format('MM')}-01`,
            `${this.$dayjs().endOf('month').format('YYYY-MM-DD')}`,
          ]
          this.days = 0
        }
      } else {
        this.dates.push(this.$dayjs().format('YYYY-MM-DD'))
      }
    },
    getMyOrderList() {
      this.isProductLoading = true
      this.checkoutArray = []
      this.$vuetify.goTo(0)
      const daysData = {}
      if (this.days == 0) {
        daysData['start_date'] = this.dates[0]
        daysData['end_date'] = this.dates[1]
      } else {
        daysData['days'] = this.days
      }
      if (this.days == -1) {
        daysData['when'] = 'currentMonth'
      }
      if (this.search) {
        daysData['keyword'] = this.search
      } else {
        daysData['keyword'] = -1
      }
      daysData['order_status'] = this.select.value
      return apiAxios({
        method: 'post',
        url: `/MyOrder/GetMyCheckout?pageNo=${this.page}`,
        data: daysData,
      }).then(res => {
        this.checkoutArray = res.result
        this.totalPageCount = res.pagingInfo.totalPageCount
        this.isProductLoading = false
      })
    },
    getTotalPrice() {
      const daysData = {}
      if (this.days == 0) {
        daysData['start_date'] = this.dates[0]
        daysData['end_date'] = this.dates[1]
      } else {
        daysData['days'] = this.days
      }
      if (this.days == -1) {
        daysData['when'] = 'currentMonth'
      }
      return apiAxios({
        method: 'post',
        url: '/MyOrder/GetMyAccumulatedAmount',
        data: daysData,
      }).then(res => {
        this.allOrderTotalPrice = res.result
      })
    },
    createPayment(id) {
      this.overlay = true
      return apiAxios({
        method: 'post',
        url: '/Checkout/CreatePaymentUrlV2',
        data: {
          checkout_id: id,
          is_mobile:
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            ),
        },
        timeout: 20000,
      })
        .then(res => {
          if (res.result) {
            window.location.href = res.result
          }
        })
        .catch(() => {
          this.$snackbar.add('取得付款連結失敗，請稍後再試')
          this.overlay = false
        })
    },
    insert(order) {
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
    },
    commentBtnTitle(order) {
      if (order.reviews !== 'null' && order.reviews !== null) {
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
      if (order.reviews !== 'null' && order.reviews !== null) {
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
    toggleLogistic(index) {
      if (this.logisticArray.includes(index)) {
        let cache = this.logisticArray.indexOf(index)
        this.logisticArray.splice(cache, 1)
      } else {
        this.logisticArray.push(index)
      }
    },
    toLink(link) {
      window.open(link)
    },
    getThreeMonthsAgo(dateString) {
      const date = new Date(dateString)
      date.setMonth(date.getMonth() - 3)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    addCartItemAgain(type, id) {
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id:
          type == 'checkout_id'
            ? 'ga-order-buy-again-checkout'
            : 'ga-order-buy-again-order',
      })
      return apiAxios({
        method: 'post',
        url: '/Cart/AddCartItemAgain',
        data: {
          [type]: id,
        },
      })
        .then(res => {
          this.$snackbar.add(res.message, { color: 'success' })
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Cart/GetCartItemArray',
          })
        )
        .then(res => {
          this.$store.commit('setCartCount', res.result.length)
        })
    },
    toggleExpand(index) {
      // 切換展開狀態
      this.$set(this.expandedIndexes, index, !this.expandedIndexes[index])
    },
    wheelRouter(creation_date, id) {
      return apiAxios({
        method: 'post',
        url: '/Activity/GetActivityArray',
      }).then(res => {
        let wheelId = res.result[0].id ? res.result[0].id : '1526'
        if (this.$dayjs().isAfter('2025-11-01T07:59:59+08:00')) {
          this.$router.push(`/prize-wheel-redesign/${wheelId}/checkout/${id}`)
        } else {
          this.$router.push(`/prize-wheel/${wheelId}/checkout/${id}`)
        }
      })
    },
  },
}
</script>
<style scoped>
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
  display: flex;
  flex-direction: column;
  align-items: end;
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

.stepBar .step.future::after {
  background-color: #656565;
}

.stepBar .step.future::before {
  border-color: #656565;
}

.stepBar .step.future {
  border: 1px solid #656565;
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

.pec-box-style {
  max-width: 563px;
  padding: 12px;
  z-index: 1;
  border-radius: 4px;
  background-color: #ececec;
  position: relative;
}

.pec-box-style table {
  width: 100%;
  border: 1px solid #c6c6c6;
  background-color: #fff;
  border-collapse: collapse;
  text-align: center;
  font-size: 12px;
  color: #4f4f4f;
}

.pec-box-style table th {
  border: 1px solid #c6c6c6;
  padding: 3px;
}

.pec-box-style table td {
  border: 1px solid #c6c6c6;
  padding: 3px;
}

.pec-show-arrow {
  position: relative;
}

.pec-show-arrow::after {
  bottom: -10px;
  margin-left: -10px;
  left: 50%;
  border: 10px solid transparent;
  border-bottom-color: #ececec;
  content: ' ';
  height: 0px;
  width: 0px;
  position: absolute;
  pointer-events: none;
  box-sizing: inherit;
}

.activity-linear {
  background: linear-gradient(
    180deg,
    rgba(234, 112, 104, 0.765625) 0%,
    rgba(250, 16, 0, 0.6) 12.02%,
    #f8685f 49.5%,
    #c93e35 89.91%,
    #b93229 100%
  );
  color: #fff;
}
.activity-border {
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  font-size: 22px;
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
    margin-left: 28px;
  }

  .step-date {
    font-size: 10px !important;
    color: #787878;
  }

  .wrap-step {
    text-align: center;
    width: 67px;
    min-width: 67px;
  }

  .stepBar .step::before {
    width: 55px;
    border-top: 2px solid #ca1f1d;
    top: 5px;
    left: -55px;
  }

  .stepBar .step-star::before {
    width: 14px;
    border-top: 2px solid #ca1f1d;
    top: 5px;
    right: -15px;
  }

  .stepBar {
    width: 100%;
    height: 40px;
    margin-bottom: 32px;
  }
}

@media (max-width: 600px) {
  .order-creation-date {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }
  .activity-border {
    font-size: 16px;
  }
}
</style>
