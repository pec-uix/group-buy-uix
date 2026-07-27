<template>
  <div>
    <div class="d-flex justify-end flex-wrap">
      <v-breadcrumbs
        large
        :items="items"
        class="pec-category-breadcrumbs primary--text"
      ></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn class="mt-3 mr-3 secondary mb-4 pec-share-btn" @click="share">
        <background-svg
          class="mt-1"
          backgroungUrl="/share.svg"
          width="16px"
          height="16px"
          color="#fff"
        ></background-svg>
        立即分享
      </v-btn>
      <div class="px-3 pb-2" style="width: 100%">
        <v-sheet outlined rounded style="border-color: #ca1f1d">
          <v-toolbar
            class="elevation-0 rounded-t-md"
            height="50px"
            style="
              background-color: #ca1f1d !important;
              color: #fff !important;
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);
              font-weight: bold;
            "
          >
            <v-toolbar-title>銷售排行</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <div class="px-3">
            <v-chip-group
              v-model="rankingDays"
              class="pec-ranking-days"
              column
              mandatory
            >
              <v-chip outlined filter color="primary" value="1"
                >今日銷售</v-chip
              >
              <v-chip outlined filter color="primary" value="7">7日銷售</v-chip>
              <v-chip outlined filter color="primary" value="30"
                >30日銷售</v-chip
              >
            </v-chip-group>
          </div>
        </v-sheet>
      </div>

      <div class="px-3" style="width: 100%">
        <v-card class="elevation-0">
          <pec-category-group-type-b
            :product-array="rankingProductArray"
            :className="'ga-category-minor-top-sales'"
            :sectionName="'ga-category-minor-top-sales'"
          >
          </pec-category-group-type-b>
        </v-card>
      </div>

      <product-list
        :class-name="'ga-category-minor-list'"
        :section-name="'ga-category-minor-list'"
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

      <v-col cols="12" v-if="isLogin">
        <v-card>
          <pec-product-group-header-type-c
            name="專屬推薦"
            background-image="linear-gradient(180deg, rgba(207, 54, 44, 0.765625) 0%, rgba(250, 16, 0, 0.6) 24.48%, #B93229 83.21%, rgba(185, 50, 41, 0) 100%)"
            to="/personalized-recommendation"
          ></pec-product-group-header-type-c>
          <pec-product-group-type-c
            color="secondary"
            :className="`ga-category-minor-recommend`"
            :product-array="productRecommendPurchaseArray"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '專屬推薦',
                to: `/personalized-recommendation`,
              },
            ]"
            to="/personalized-recommendation"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-category-minor-recommend'"
          >
          </pec-product-group-type-c>
        </v-card>
      </v-col>
    </div>
  </div>
</template>
<script>
import ProductList from '@/components/ProductList.vue'
import PecCategoryGroupTypeB from '@/components/PecCategoryGroupTypeB.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapGetters, mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  props: {
    categoryMinorId: [String, Number],
    breadcrumbs: { type: Array, default: () => [] },
  },
  components: { ProductList, PecCategoryGroupTypeB, BackgroundSvg },
  watch: {
    categoryMinorId: {
      immediate: true,
      handler: function () {
        return this.fetchData().then(() => {
          if (this.breadcrumbs.length) {
            this.items = this.breadcrumbs
          } else {
            return apiAxios({
              method: 'post',
              url: '/Profile/GetCategoryMinor',
              data: {
                value: this.categoryMinorId,
              },
            }).then(res => {
              this.items = [
                {
                  text: '首頁',
                  disabled: false,
                  to: '/',
                },
                {
                  text: res.result[0].profile_comments,
                  disabled: false,
                  to: `${res.result[0].router_to}`,
                },
                {
                  text: res.result[1].profile_comments,
                  disabled: false,
                  to: `${res.result[1].router_to}`,
                },
                {
                  text: res.result[2].profile_comments,
                  disabled: false,
                  to: `${res.result[2].router_to}`,
                },
              ]
            })
          }
        })
      },
    },
    rankingDays() {
      this.getProductCategoryMinorRanking()
    },
  },
  created() {
    window.appShareToWeb = this.shareResult
    if (window.previousUrl == '/share') {
      this.isFromShare = 'Y'
    }
    this.getProductCategoryMinorRanking()
    this.getProductRecommendPurchase()
  },
  data() {
    return {
      isLoading: false,
      productArray: [],
      rankingProductArray: [],
      items: [],
      isFromShare: 'N',
      rankingDays: '7',
      productRecommendPurchaseArray: [],
      pagingInfo: {},
      brand: [],
      category: [],
      categorySecondary: [],
      categoryMinor: [],
    }
  },
  computed: {
    ...mapState(['isAndroid']),
    ...mapGetters(['isLogin', 'isVerified']),
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
            url: '/Product/GetProductCategoryMinorV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
              category_id: this.categoryMinorId,
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
        .finally(() => (this.isLoading = false))
    },
    getProductCategoryMinorRanking() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductCategoryMinorRanking',
        params: { v: '2' },
        data: {
          category_id: this.categoryMinorId,
          days: this.rankingDays,
        },
      }).then(res => (this.rankingProductArray = res.result))
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
    getProductRecommendPurchase() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductRecommendPurchase?v=2',
        data: {},
      }).then(res => {
        this.productRecommendPurchaseArray = res.result
      })
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductCategoryMinorV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          category_id: this.categoryMinorId,
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
.pec-share-btn {
  position: sticky;
  top: 83px;
  z-index: 2;
}

.pec-ranking-days.v-chip-group i {
  display: none;
}

.pec-ranking-days.v-chip-group .v-chip.v-chip--outlined.v-chip--active {
  border-color: #ca1f1d;
  color: #fcf2f2 !important;
  background-color: #ca1f1d !important;
}

::v-deep .v-breadcrumbs li:nth-child(even) {
  padding: 0 8px;
}

@media (max-width: 599px) {
  .pec-share-btn {
    position: fixed;
    top: 127px;
    right: 8px;
  }
  .v-breadcrumbs li:last-child a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    max-width: 152px;
  }
}
</style>
