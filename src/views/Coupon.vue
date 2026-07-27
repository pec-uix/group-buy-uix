<template>
  <div>
    <v-col cols="12" class="d-flex py-0">
      <v-alert
        color="primary"
        class="mt-5 mb-4 font-weight-black d-flex align-center"
        style="width: 100%; line-height: 1.6; padding: 11px 11px"
        dark
        ><v-btn icon dark to="/reward"
          ><v-icon> arrow_back_ios_new</v-icon></v-btn
        ><v-icon class="pl-2 pr-1">local_activity</v-icon>
        <span
          style="height: 30px; display: inline-block; vertical-align: bottom"
          >折價券適用商品</span
        >
      </v-alert></v-col
    >
    <v-col cols="12" class="d-flex py-0 mb-2">
      <v-card tile outlined elevation="0" class="left-card">
        <v-card-text
          class="white--text"
          style="height: 100%; display: grid; place-items: center"
        >
          <!-- <div> -->
          <div>
            <span class="text-h5">$</span>
            <span class="text-h3">{{ ticket.reward_amount }}</span>
          </div>
          <div class="text-center">
            購物車滿{{ ticket.amount_reached }}元使用
          </div>
          <!-- </div> -->
        </v-card-text>
      </v-card>
      <v-card
        tile
        outlined
        elevation="0"
        class="right-card"
        style="overflow: hidden"
      >
        <v-card-text class="pa-2 overflow-ellipsis">
          <div class="text-h6 black--text">
            {{ ticket.reward_name }}
          </div>
          <div>
            有效期限 :
            {{ $dayjs(ticket.start_date).format('MM/DD') }} ~
            {{ $dayjs(ticket.end_date).format('MM/DD') }}
          </div>
          <!-- <div>
            *一張折價券限用單台購物車商品。詳情見(折價券使用說明)
          </div> -->
          <div>*部分商品適用。</div>
        </v-card-text>
      </v-card>
    </v-col>
    <div class="d-flex justify-end flex-wrap">
      <product-list
        :class-name="'ga-coupon-list'"
        :section-name="'ga-coupon-list'"
        :product-array="productArray"
        :is-loading="isLoading"
        :breadcrumbs="items"
        :brand="brand"
        :category="category"
        :categorySecondary="categorySecondary"
        :categoryMinor="categoryMinor"
        :pagingInfo="pagingInfo"
        @updatedFilterConditions="updatedFilterConditions"
      ></product-list>
    </div>
  </div>
</template>
<script>
import ProductList from '@/components/ProductList.vue'
//import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  components: { ProductList },
  created() {
    this.url = new URL(location.href)
    this.rewardId = this.url.searchParams.get('id')
    this.fetchData()
    window.appShareToWeb = this.shareResult
    if (window.previousUrl == '/share') {
      this.isFromShare = 'Y'
    }
  },
  data() {
    return {
      isLoading: false,
      productArray: [],
      url: '',
      rewardId: '',
      ticket: {},
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '折價券專區',
          to: '/coupon',
        },
      ],
      isFromShare: 'N',
      pagingInfo: {},
      brand: [],
      category: [],
      categorySecondary: [],
      categoryMinor: [],
    }
  },
  computed: {
    ...mapState(['isAndroid']),
    canShare() {
      return window.navigator.canShare && !window.GroupJSInterface
    },
    canShareMobile() {
      return window.GroupJSInterface
    },
  },
  methods: {
    fetchData() {
      this.isLoading = true
      return Promise.resolve()
        .then(() => {
          if (this.$store.getters.isLogin) {
            return apiAxios({
              method: 'post',
              url: '/Users/VerifyToken',
            })
          } else {
            return Promise.resolve()
          }
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Product/GetProductSuitableForRewardV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
              reward_id: this.rewardId,
              filter: {
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
            },
          })
        )
        .then(res => {
          this.productArray = res.result.product
          this.brand = res.result.brand
          this.category = res.result.category
          this.categorySecondary = res.result.categorySecondary
          this.categoryMinor = res.result.categoryMinor
          this.pagingInfo = res.pagingInfo
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Reward/GetRewardInfo',
            data: {
              reward_id: this.rewardId,
            },
          })
        )
        .then(res => (this.ticket = res.result[0]))
        .finally(() => (this.isLoading = false))
    },
    share() {
      if (this.canShare) {
        const shareData = {
          title: '統一團購網',
          text: this.items[1].text,
          url: window.location.href,
        }
        navigator.share(shareData)
      } else if (this.canShareMobile) {
        const shareData = {
          title: '統一團購網',
          text: this.items[1].text,
          url: (this.isAndroid ? ' ' : '') + window.location.href,
        }
        if (window.GroupJSInterface.shareToApp) {
          window.GroupJSInterface.shareToApp(JSON.stringify(shareData))
        } else {
          this.$snackbar.add(`此分享功能需要更新至最新 app 版本`, {
            color: 'success',
          })
        }
      }
    },
    shareResult(servcie) {
      return apiAxios({
        method: 'post',
        url: '/Share/InsertShareLog',
        data: {
          activity_name: `活動專區 ${this.items[1].text}`,
          share_app: servcie,
          share_point: this.isFromShare,
        },
      }).then(() => {
        this.$snackbar.add(`分享成功`, { color: 'success' })
        if (this.isFromShare == 'Y') {
          this.$router.push('/share')
        }
      })
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductSuitableForRewardV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          reward_id: this.rewardId,
          filter: filterConditions,
        },
      }).then(res => {
        this.productArray = res.result.product
        this.brand = res.result.brand
        this.category = res.result.category
        this.categorySecondary = res.result.categorySecondary
        this.categoryMinor = res.result.categoryMinor
        this.pagingInfo = res.pagingInfo
        this.isLoading = false
      })
    },
  },
}
</script>
<style scoped>
.cursor-default {
  cursor: default !important;
}
.v-tabs:not(.v-tabs--vertical) .v-tab {
  white-space: nowrap !important;
}
.point {
  width: 20px;
  height: 20px;
  background-color: var(--v-secondary-base);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
}
.left-card {
  min-width: 200px;
  border-color: var(--v-secondary-lighten1);
  background-color: var(--v-secondary-lighten1);
  border-right: 2px dashed var(--v-secondary-lighten1);
  border-left: 2px dashed #fff;
}
.right-card {
  width: 100%;
  border-color: rgba(0, 0, 0, 0.12);
  border-left: 2px dashed var(--v-secondary-lighten1);
}
.overflow-ellipsis div {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
@media (max-width: 660px) {
  .left-card {
    min-width: 150px;
  }
}
@media (max-width: 435px) {
  .left-card {
    min-width: 120px;
  }
  ::v-deep .v-card__text {
    padding: 12px;
  }
  ::v-deep .text-h3 {
    font-size: 2.8rem !important;
  }
}
</style>
