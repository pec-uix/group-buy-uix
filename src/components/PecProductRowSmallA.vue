<template>
  <div
    class="d-flex justify-end align-center d-black"
    style="position: relative"
  >
    <v-overlay
      v-if="showExpired && product.expired == 'Y'"
      absolute
      style="z-index: 2"
      >已過期
    </v-overlay>
    <v-checkbox
      v-if="showDelSelect"
      v-model="checkbox"
      @click.stop.prevent="choseItem(product.item_main_id, checkbox)"
      class="ma-0 pa-0"
      hide-details
    ></v-checkbox>
    <v-card
      class="d-flex flex-column pa-2 justify-end rounded-0"
      style="border-top: none; border-left: none; border-right: none"
      @click.prevent="handleProductClick()"
      width="100%"
      outlined
    >
      <div class="d-flex flex-grow-1 align-start">
        <v-img
          :src="product.img_url"
          aspect-ratio="1"
          class="flex-grow-0"
          width="70px"
          contain
        >
        </v-img>
        <div class="d-flex flex-column justify-space-between flex-grow-1 px-4">
          <v-btn
            elevation="0"
            fab
            dark
            color="primary"
            width="20"
            height="20"
            style="position: absolute; right: 8px; top: 5px; z-index: 1"
            v-if="showDelBtn == 0"
            @click.stop.prevent="delHistoryItem(product.product_id)"
            ><i class="fa-solid fa-xmark"></i
          ></v-btn>
          <v-alert
            v-if="product.subtitle"
            class="primary--text mb-1 text-caption"
            dense
            tile
            colored-border
            color="primary"
            elevation="0"
            style="
              line-height: 1.2;
              padding: 1px 4px;
              border-left: 4px solid rgb(202 31 29);
            "
          >
            {{ product.subtitle }}
          </v-alert>
          <div
            class="text-body-1 pec-product-card-title text-caption"
            style="line-height: 1.2"
          >
            {{ product.product_name }}
          </div>
          <div
            class="primary--text"
            style="font-size: 1.7rem !important; font-weight: 400"
          >
            {{ getPriceDisplay(product) }}
          </div>
        </div>
      </div>
      <v-row no-gutters class="pt-1">
        <v-col cols="12">
          <template v-if="isLogin && isVerified">
            <div class="text-h6 d-flex justify-space-between align-center">
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
              <div class="d-flex">
                <div
                  v-if="!hideTrack"
                  class="d-flex align-center"
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
                      class="fa-heart fa-sm"
                      :class="{
                        'fa-solid': product.track_status == 'Y',
                        'fa-regular': product.track_status !== 'Y',
                      }"
                      style="font-size: 24px"
                    ></i>
                  </v-btn>
                </div>
                <v-btn
                  v-if="product.expired !== 'Y'"
                  elevation="0"
                  fab
                  x-small
                  text
                  color="primary"
                  class="d-flex align-center mr-1"
                  @click.stop.prevent="handleClick(product.product_id)"
                >
                  <i
                    class="fa-sharp fa-regular fa-cart-shopping"
                    style="font-size: 24px"
                  ></i>
                </v-btn>
              </div>
            </div>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { apiAxios } from '@/api'

export default {
  props: [
    'product',
    'to',
    'isLogin',
    'isVerified',
    'showGroupBuyNotification',
    'showSaleNotice',
    'showDelSelect',
    'isChoseAll',
    'hideTrack',
    'showExpired',
    'showDelBtn',
    'sectionName',
  ],
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
          section_name: this.sectionName,
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
    handleClick(product_id) {
      this.$store.dispatch('setCartProduct', product_id)
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id: 'add-to-cart-icon',
      })
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: product_id,
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
      return product.inv_num - product.order_num_with_ratio
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
    delHistoryItem(item_main_id) {
      this.$emit('delHistoryItem', item_main_id)
    },
    choseItem(item_main_id, status) {
      this.$emit('choseItem', item_main_id, status)
    },
  },
}
</script>
<style scoped>
.v-alert--dense .v-alert__border {
  border-width: 2px;
}
.pec-product-card-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
