<template>
  <div
    class="d-flex justify-end align-center d-black pb-1"
    style="position: relative; height: 100%"
  >
    <v-overlay
      v-if="showExpired && product.expired == 'Y'"
      absolute
      style="z-index: 2"
    >
    </v-overlay>
    <v-checkbox
      v-if="showDelSelect"
      v-model="checkbox"
      @click.stop.prevent="choseItem(product.item_main_id, checkbox)"
      class="ma-0 pa-0"
      hide-details
    ></v-checkbox>
    <v-card
      class="d-flex flex-column pa-2 justify-end"
      @click.prevent="handleProductClick()"
      height="100%"
      width="100%"
      outlined
      :class="[to.params?.class, { 'pec-multiple-del-card': showDelSelect }]"
      :style="
        setBorder
          ? {
              border: '3px solid #ca1f1d',
            }
          : {}
      "
    >
      <div class="d-flex flex-grow-1 align-start">
        <v-img
          :eager="eager"
          :src="product.img_url"
          aspect-ratio="1"
          class="flex-grow-0"
          width="120px"
          :max-width="`${!showDelBtn ? '40%' : '35%'}`"
          contain
        >
        </v-img>
        <div
          class="d-flex flex-column justify-space-between flex-grow-1 px-4 pec-product-row-ellipsis"
        >
          <v-alert
            v-if="product.subtitle"
            border="left"
            class="primary--text py-0 mb-0"
            dense
            tile
            colored-border
            color="primary"
            elevation="0"
          >
            {{ product.subtitle }}
          </v-alert>
          <div v-else style="height: 1.5rem"></div>
          <div class="mt-2 text-body-1 pec-product-card-title">
            {{ product.product_name }}
          </div>
          <div class="hide-text text-h5 primary--text mt-2 ml-auto">
            {{ getPriceDisplay(product) }}
          </div>
          <div
            class="d-flex justify-space-between align-center flex-row-reverse"
            v-if="
              getPriceDisplay(product) !==
              `$${product.max_list_price.toLocaleString()}`
            "
          >
            <span class="text-decoration-line-through"
              >原價${{ product.max_list_price.toLocaleString() }}</span
            >
            <span v-if="product.inv_num != null">
              (尙餘{{ getQuotaNum(product) }}件)
            </span>
          </div>
          <div v-else>&emsp;</div>

          <!-- <div class="my-3">
            <v-row
              style="width: 165px; max-width: 165px"
              dense
              v-if="
                !product.purchase_instruction &&
                product.receive_type.includes('1')
              "
            >
              <v-col :cols="product.teambuy == 'Y' ? 6 : 12">
                <v-alert
                  dense
                  outlined
                  class="font-weight-bold text-center pa-1 ma-0 mt-1 text-caption"
                  color="deep-purple accent-1"
                  @click.stop.prevent="insertTeamBuy"
                >
                  我要開團
                </v-alert>
              </v-col>
              <v-col cols="6" v-if="product.teambuy == 'Y'">
                <v-alert
                  dense
                  outlined
                  class="font-weight-bold text-center pa-1 ma-0 mt-1 text-caption"
                  color="deep-purple accent-1"
                  @click.stop.prevent="joinTeamBuy"
                >
                  我要跟團
                </v-alert>
              </v-col>
            </v-row>
          </div> -->
        </div>
      </div>
      <v-row>
        <v-col cols="12" sm="6" class="pb-1 d-flex align-end">
          <div class="text-body-2 accent--text flex-grow-1">
            <div>
              <div class="d-flex">
                <span
                  v-for="item in getReceiveTypeTW"
                  :key="item"
                  :style="
                    item === '取貨點'
                      ? {
                          'background-color': '#cf131a',
                        }
                      : {
                          'background-color': '#02835E',
                        }
                  "
                  style="
                    color: white;
                    border-radius: 10px;
                    display: grid;
                    place-items: center;
                  "
                  class="text-caption px-1 mr-1"
                >
                  {{ item }}
                </span>
              </div>
            </div>
            <div class="py-2 text-center" v-if="product.hide_order_num == 'Y'">
              熱銷中
            </div>
            <v-menu offset-y v-else-if="isLogin">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="px-2"
                  color="white"
                  depressed
                  v-bind="attrs"
                  @click.prevent="getAreaOrderNum(on, $event)"
                >
                  累積:{{
                    product.order_num_with_ratio + product.acc_order_num
                  }}件 成團:{{ product.goal_num }}件
                  <background-svg
                    class="mt-1"
                    backgroungUrl="/expand_more.svg"
                    width="12px"
                    height="12px"
                    color="#000"
                  ></background-svg>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="item in areaOrderNumArray"
                  :key="item.receive_area"
                  :disabled="
                    !$dayjs().isBetween(
                      $dayjs(product.start_date),
                      $dayjs(product.end_date)
                    ) || product.tb_status != null
                  "
                >
                  <v-list-item-title
                    >{{ item.receive_area_name }}
                  </v-list-item-title>
                  <v-list-item-action>
                    {{ item.order_num_with_ratio }}
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="product.acc_order_num">
                  <v-list-item-title>已售出</v-list-item-title>
                  <v-list-item-action>
                    {{ product.acc_order_num }}
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-menu>
            <span v-else>
              累積:{{ product.order_num_with_ratio + product.acc_order_num }}件
              成團:{{ product.goal_num }}件
            </span>

            <div class="mb-1">
              <v-chip
                v-if="new Date(product.start_date) > new Date()"
                label
                color="primary"
                outlined
                >尚未開始</v-chip
              >
              <v-chip
                v-else-if="product.inv_num != null && getQuotaNum(product) <= 0"
                label
                color="primary"
                outlined
              >
                已完售</v-chip
              >
              <v-chip v-else label outlined color="primary">
                {{ relativeTime(product.end_date) }} ({{
                  $dayjs(product.end_date).format('YYYY-MM-DD')
                }})
              </v-chip>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="pt-0 price_place">
          <div class="d-flex align-center primary--text hide-text">
            <template v-if="isLogin && isVerified">
              <span
                class="text-h5 d-flex hide-text"
                style="flex-wrap: wrap-reverse; justify-content: end"
              >
                <div
                  v-if="showGroupBuyNotification"
                  class="d-flex align-center mr-2"
                  style="flex-wrap: wrap-reverse; justify-content: end"
                  @click.stop.prevent="$store.dispatch(' ', product.product_id)"
                >
                  <div
                    v-if="!hideTrack"
                    class="d-flex align-center px-1 pr-2"
                    @click.stop.prevent="
                      setProductTrack(product.item_main_id, product)
                    "
                  >
                    <v-btn
                      class="mx-0"
                      fab
                      text
                      x-small
                      color="primary"
                      elevation="0"
                    >
                      <i
                        class="fa-heart fa-lg"
                        :class="{
                          'fa-solid': product.track_status == 'Y',
                          'fa-regular': product.track_status !== 'Y',
                        }"
                        style="font-size: 30px"
                      ></i>
                    </v-btn>
                  </div>
                  <v-btn
                    fab
                    x-small
                    text
                    color="primary"
                    elevation="0"
                    @click.stop.prevent="
                      setSaleNotice(product.item_main_id, product)
                    "
                  >
                    <i
                      class="fa-solid"
                      :class="
                        product.noticed == 'Y' ? 'fa-volume-xmark' : 'fa-volume'
                      "
                      style="font-size: 28px"
                    ></i>
                  </v-btn>
                </div>

                <div
                  v-if="!hideTrack"
                  class="d-flex align-center px-1 pr-2"
                  @click.stop.prevent="
                    setProductTrack(product.item_main_id, product)
                  "
                >
                  <v-btn
                    class="mx-0"
                    fab
                    text
                    x-small
                    color="primary"
                    elevation="0"
                  >
                    <i
                      class="fa-heart fa-lg"
                      :class="{
                        'fa-solid': product.track_status == 'Y',
                        'fa-regular': product.track_status !== 'Y',
                      }"
                      style="font-size: 30px"
                    ></i>
                  </v-btn>
                </div>
                <div v-if="showDelBtn" class="d-flex align-center mr-2">
                  <v-btn
                    class="mx-0"
                    fab
                    dark
                    x-small
                    text
                    color="primary"
                    elevation="0"
                    @click.stop.prevent="delItem([product.item_main_id])"
                  >
                    <i
                      class="fa-regular fa-trash-can"
                      style="font-size: 28px"
                    ></i>
                  </v-btn>
                </div>
                <v-btn
                  elevation="0"
                  fab
                  x-small
                  text
                  color="primary"
                  v-if="
                    product.expired !== 'Y' &&
                    !product.purchase_instruction &&
                    new Date(product.start_date) <= new Date()
                  "
                  class="d-flex align-center"
                  @click.stop.prevent="handleClick()"
                >
                  <i
                    class="fa-sharp fa-regular fa-cart-shopping"
                    style="font-size: 28px"
                  ></i>
                </v-btn>
              </span>
            </template>
            <router-link
              v-else-if="!isLogin"
              :to="{ path: '/login', query: { redirect: $route.fullPath } }"
              >請先登入</router-link
            >
            <router-link
              v-else-if="!isVerified"
              :to="{
                path: '/login/auth',
                query: { redirect: $route.fullPath },
              }"
              >請先完成認證</router-link
            >
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { apiAxios } from '@/api'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  props: [
    'product',
    'to',
    'isLogin',
    'isVerified',
    'showGroupBuyNotification',
    'showSaleNotice',
    'showDelBtn',
    'showDelSelect',
    'isChoseAll',
    'hideTrack',
    'showExpired',
    'setBorder',
    'sectionName',
    'eager',
  ],
  components: {
    BackgroundSvg,
  },
  data() {
    return {
      isLoading: false,
      areaOrderNumArray: [],
      // noticedStatus: false,
      // trackProductStatus: false,
      checkbox: false,
    }
  },
  watch: {
    isChoseAll() {
      if (this.isChoseAll[0] == true) {
        this.checkbox = true
        this.choseItem(this.product.item_main_id, this.checkbox)
      } else {
        this.checkbox = false
        this.choseItem(this.product.item_main_id, this.checkbox)
      }
    },
  },
  created() {
    // this.trackProductStatus = this.product.track_status == 'Y' ? true : false
    // this.noticedStatus = this.product.noticed == 'Y' ? true : false
  },
  computed: {
    hasReceiveType2() {
      return this.product.receive_type.split(':').includes('2')
    },
    getReceiveTypeTW() {
      let receive_type = this.product.receive_type.split(':')
      return receive_type.map(e => {
        if (e == 1) {
          e = '取貨點'
        }
        if (e == 2) {
          e = '宅配'
        }
        return e
      })
    },
  },
  methods: {
    handleProductClick() {
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: this.product.product_id,
          current_path: this.$route.path,
          previous_path: window.previousUrl,
          section_name: this.sectionName ? this.sectionName : '',
          add_from: '',
        })
      )
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id: this.sectionName ? this.sectionName : '',
      })
      this.$router.push(this.to)
    },
    handleClick() {
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id: 'add-to-cart-icon',
      })
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: this.product.product_id,
          current_path: this.$route.path,
          previous_path: window.previousUrl,
          section_name: this.sectionName ? this.sectionName : '',
          add_from: 'add-to-cart-icon',
        })
      )
      this.$store.dispatch('setCartProduct', this.product.product_id)
      this.$emit('handleClick')
    },
    getPriceDisplay(product) {
      let output = ''
      if (!product.min_discount_price || !product.max_discount_price) {
        output = '無法顯示價格'
      } else if (product.hide_price == 'Y') {
        output = '驚喜價'
      } else {
        output = `$${product.min_discount_price.toLocaleString()}`

        if (product.min_discount_price !== product.max_discount_price) {
          output += `~$${product.max_discount_price.toLocaleString()}`
        }
      }
      return output
    },
    getQuotaNum(product) {
      let quotaNum = product.inv_num - product.order_num_with_ratio
      return quotaNum < 0 ? 0 : quotaNum
    },
    relativeTime(dateString) {
      return this.$dayjs().to(this.$dayjs(dateString))
    },
    getAreaOrderNum(on, $event) {
      this.isLoading = true
      on.click($event)
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductAreaOrderNum',
        data: { product_id: this.product.product_id },
      })
        .then(res => {
          this.areaOrderNumArray = res.result
        })
        .finally(() => (this.isLoading = false))
    },
    insertTeamBuy() {
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductV2',
        params: { v: '2' },
        data: {
          product_id: this.product.product_id,
        },
      }).then(res => {
        this.$store.commit('setTeamBuyDialog', {
          dialog: true,
          data: Object.assign(res.result[0], { teambuy: this.product.teambuy }),
          status: 'start',
        })
      })
    },
    joinTeamBuy() {
      return apiAxios({
        method: 'post',
        url: '/TeamBuy/GetTeamBuy',
        params: { v: '2' },
        data: {
          product_id: this.product.product_id,
        },
      }).then(res => {
        this.$store.commit('setTeamBuyDrawer', {
          drawer: true,
          data: res.result,
        })
      })
    },
    setProductTrack(item_main_id, product) {
      apiAxios({
        method: 'post',
        url: '/Track/Track',
        data: { item_main_id: [item_main_id] },
      }).then(res => {
        if (res.message == null) {
          this.$snackbar.add(`此商品未設立追蹤功能`, { color: 'primary' })
        } else {
          this.$snackbar.add(`${res.message}`, { color: 'success' })
          if (res.message == '已取消追蹤') {
            product.track_status = 'N'
          } else product.track_status = 'Y'
        }
      })
    },
    setSaleNotice(item_main_id, product) {
      apiAxios({
        method: 'post',
        url: '/SaleNotice/SaleNotice',
        data: { item_main_id: [item_main_id] },
      }).then(res => {
        this.$snackbar.add(`${res.message}`, { color: 'success' })
        if (res.message == '已取消開團通知') {
          product.noticed = 'N'
        } else product.noticed = 'Y'
      })
    },
    delItem(item_main_id) {
      this.$emit('delItem', item_main_id)
    },
    choseItem(item_main_id, status) {
      this.$emit('choseItem', item_main_id, status)
    },
  },
}
</script>
<style scoped>
.pec-product-card-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3rem;
}
.shipping-bg {
  width: 23px;
  height: 23px;
  background-color: #d86816;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.hide-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.pec-product-row-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  /* white-space: nowrap; */
  max-width: 100%;
}
.position {
  position: absolute;
  bottom: 2px;
  right: -2px;
}
.price_place {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.price_place .pt-1 {
  text-align: right;
}
@media (max-width: 600px) {
  .pec-multiple-del-card {
    width: calc(100% - 36px) !important;
  }
}
</style>
