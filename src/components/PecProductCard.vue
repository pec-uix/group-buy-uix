<template>
  <div
    style="
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    "
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
      class="ma-0 pa-0 mb-2"
      hide-details
    ></v-checkbox>
    <v-card
      class="pec-product-card d-flex justify-space-between flex-column pa-1"
      @click.prevent="handleProductClick()"
      :class="to.params?.class"
      height="100%"
      :style="
        setBorder
          ? {
              border: '3px solid #ca1f1d',
            }
          : {}
      "
    >
      <div>
        <div
          v-if="product.subtitle && !showRank"
          class="pec-card-tag primary white--text rounded-0 px-2 py-1"
          :class="setBorder ? 'pec-card-tag-with-border' : ''"
        >
          {{ product.subtitle }}
        </div>
        <div v-if="showRank" class="pec-show-rank">
          <v-img aspect-ratio="1" src="/flag.png" width="100%" contain>{{
            showRank
          }}</v-img>
        </div>
        <div style="position: relative">
          <v-img
            :eager="eager"
            aspect-ratio="1"
            :src="product.img_url"
            width="100%"
            contain
          ></v-img>
        </div>
        <div class="mt-3 text-body-1 pec-product-card-title">
          {{ product.product_name }}
        </div>
      </div>

      <!-- <v-spacer></v-spacer> -->
      <div class="d-flex flex-column mt-4 mb-2">
        <div
          class="d-flex align-center"
          :class="`justify-${
            getPriceDisplay(product) !==
            `$${product.max_list_price.toLocaleString()}`
              ? 'space-between'
              : 'end'
          }`"
        >
          <div class="d-flex flex-grow-1">
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
          <div
            v-if="
              getPriceDisplay(product) !==
              `$${product.max_list_price.toLocaleString()}`
            "
          >
            <span class="text-caption text-decoration-line-through"
              >原價${{ product.max_list_price.toLocaleString() }}</span
            >
          </div>
          <div v-else>
            <span class="text-caption">&emsp;</span>
          </div>
        </div>
        <div class="d-flex justify-start" style="flex-wrap: wrap-reverse">
          <span
            v-if="isLogin && isVerified"
            class="d-flex text-h5 primary--text hide-text align-center ml-auto"
          >
            <span class="hide-text">
              {{ getPriceDisplay(product) }}
            </span>
          </span>
          <router-link
            v-else-if="!isLogin"
            class="text-h5 primary--text"
            :to="{ path: '/login', query: { redirect: $route.fullPath } }"
          >
            請先登入
          </router-link>
          <router-link
            v-else-if="!isVerified"
            class="text-h5 primary--text"
            :to="{ path: '/login/auth', query: { redirect: $route.fullPath } }"
          >
            請先完成認證
          </router-link>
        </div>
      </div>
      <template v-if="!hideDetail">
        <v-btn
          v-if="new Date(product.start_date) > new Date()"
          block
          small
          outlined
          color="primary"
          class="flex-grow-0"
          >尚未開始</v-btn
        >
        <v-btn
          v-else-if="product.inv_num != null && getQuotaNum(product) <= 0"
          block
          small
          disabled
          outlined
          color="primary"
          class="flex-grow-0"
        >
          已完售</v-btn
        >
        <v-alert
          v-else
          dense
          outlined
          class="font-weight-bold text-center pa-1 ma-0 text-caption"
          color="primary"
        >
          {{ relativeTime(product.end_date) }} ({{
            $dayjs(product.end_date).format('YYYY-MM-DD')
          }})
        </v-alert>
        <!-- <v-row
          dense
          v-if="
            !product.purchase_instruction && product.receive_type.includes('1')
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
        </v-row> -->
        <div
          v-if="showGroupBuyNotification"
          class="d-flex align-center mt-1"
          @click.stop.prevent="$store.dispatch(' ', product.product_id)"
        >
          <v-btn
            block
            :outlined="product.noticed == 'Y'"
            small
            color="secondary"
            elevation="0"
            class="mr-0 mr-sm-3"
            @click.stop.prevent="setSaleNotice(product.item_main_id, product)"
          >
            <i
              class="fa-solid mr-1"
              :class="product.noticed == 'Y' ? 'fa-volume-xmark' : 'fa-volume'"
              style="padding-top: 1px"
            ></i
            >{{ product.noticed == 'Y' ? '取消開團提醒' : '開團提醒我' }}
          </v-btn>
        </div>

        <div class="py-2 text-center" v-if="product.hide_order_num == 'Y'">
          熱銷中
        </div>
        <div v-else-if="isLogin">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                block
                class="mt-1 flex-grow-0 pa-0"
                color="white"
                depressed
                v-bind="attrs"
                @click.stop.prevent="getAreaOrderNum(on, $event)"
              >
                累積:{{
                  product.order_num_with_ratio + product.acc_order_num
                }}件 成團:{{ product.goal_num }}
                件
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
        </div>
        <div v-else>
          累積:{{ product.order_num_with_ratio + product.acc_order_num }}件
          成團:{{ product.goal_num }}件
        </div>
      </template>
      <div
        v-if="isLogin"
        class="d-flex"
        :class="`justify-${product.inv_num != null ? 'space-between' : 'end'}`"
      >
        <span v-if="product.inv_num != null">
          (尙餘{{ getQuotaNum(product) }}件)
        </span>
        <div class="d-flex">
          <span v-if="showDelBtn">
            <v-btn
              class="mx-0"
              fab
              x-small
              text
              dark
              color="primary"
              elevation="0"
              @click.stop.prevent="delItem([product.item_main_id])"
            >
              <i class="fa-regular fa-trash-can" style="font-size: 24px"></i>
            </v-btn>
          </span>
          <span v-if="!hideTrack">
            <v-btn
              fab
              x-small
              elevation="0"
              text
              class="d-flex align-center px-1"
              color="primary"
              @click.stop.prevent="setProductTrack(product.item_main_id)"
            >
              <i
                class="fa-heart"
                :class="{
                  'fa-solid': trackProductStatus,
                  'fa-regular': !trackProductStatus,
                }"
                style="font-size: 24px"
              ></i>
            </v-btn>
          </span>
          <v-btn
            v-if="
              product.expired !== 'Y' &&
              !product.purchase_instruction &&
              new Date(product.start_date) <= new Date()
            "
            elevation="0"
            fab
            x-small
            text
            color="primary"
            class="d-flex align-center"
            @click.stop.prevent="handleClick()"
          >
            <i
              class="fa-sharp fa-regular fa-cart-shopping"
              style="font-size: 24px"
            ></i>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { apiAxios } from '@/api'
import { mapState } from 'vuex'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  props: [
    'product',
    'to',
    'isLogin',
    'isVerified',
    'hideDetail',
    'showSaleNotice',
    'showRank',
    'hideTrack',
    'showDelBtn',
    'showDelSelect',
    'showGroupBuyNotification',
    'showExpired',
    'isChoseAll',
    'setBorder',
    'sectionName',
    'eager',
  ],
  created() {
    this.trackProductStatus = this.product.track_status == 'Y' ? true : false
  },
  components: {
    BackgroundSvg,
  },
  data() {
    return {
      isLoading: false,
      areaOrderNumArray: [],
      trackProductStatus: false,
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
  computed: {
    ...mapState(['teamBuyDialog']),
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
    relativeTime(dateString) {
      return this.$dayjs().to(this.$dayjs(dateString))
    },
    getQuotaNum(product) {
      let quotaNum = product.inv_num - product.order_num_with_ratio
      return quotaNum < 0 ? 0 : quotaNum
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
    setProductTrack(item_main_id) {
      apiAxios({
        method: 'post',
        url: '/Track/Track',
        data: { item_main_id: [item_main_id] },
      }).then(res => {
        if (res.message == null) {
          this.$snackbar.add(`此商品未設立追蹤功能`, { color: 'primary' })
        } else {
          this.$snackbar.add(`${res.message}`, { color: 'success' })
          this.trackProductStatus = !this.trackProductStatus
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
.pec-track-btn {
  overflow: visible;
  position: absolute;
  right: 2px;
  bottom: 2px;
}
.pec-product-card {
  position: relative;
}
.pec-product-card-title {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 4.5rem;
}
.pec-card-tag {
  position: absolute;
  left: -6px;
  top: -6px;
  z-index: 1;
}
.pec-card-tag::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 0;
  border-top: 6px solid #760a09;
  border-left: 6px solid transparent;
}
.pec-card-tag-with-border.pec-card-tag::after {
  bottom: -4px;
  border-top: 4px solid #760a09;
  border-left: 4px solid transparent;
}
.pec-show-rank {
  position: absolute;
  width: 40px;
  right: 16px;
  top: -2px;
  z-index: 1;
}
.pec-show-rank .v-image {
  text-align: center;
  color: #fff;
  font-size: 21px;
  line-height: 1.8;
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
</style>
