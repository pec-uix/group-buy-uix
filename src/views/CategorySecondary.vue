<template>
  <div>
    <div class="d-flex justify-end flex-wrap">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn class="mt-3 mr-3 secondary pec-share-btn" @click="share">
        <background-svg
          class="mt-1"
          backgroungUrl="/share.svg"
          width="16px"
          height="16px"
          color="#fff"
        ></background-svg>
        立即分享
      </v-btn>
      <pec-category-group-type-a
        :category-img-array="categoryImgArray"
        :className="'ga-category-sub-minormenu'"
      >
      </pec-category-group-type-a>
      <product-list
        :class-name="'ga-category-sub-list'"
        :section-name="'ga-category-sub-list'"
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
      <!-- <product-list
        :product-array="productArray"
        :is-loading="isLoading"
        :breadcrumbs="items"
      ></product-list> -->

      <v-col cols="12" v-if="isLogin">
        <v-card>
          <pec-product-group-header-type-c
            name="專屬推薦"
            background-image="linear-gradient(180deg, rgba(207, 54, 44, 0.765625) 0%, rgba(250, 16, 0, 0.6) 24.48%, #B93229 83.21%, rgba(185, 50, 41, 0) 100%)"
            to="/personalized-recommendation"
          ></pec-product-group-header-type-c>
          <pec-product-group-type-c
            color="secondary"
            :className="`ga-category-sub-recommend`"
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
            :section-name="'ga-category-sub-minormenu'"
          >
          </pec-product-group-type-c>
        </v-card>
      </v-col>
    </div>
  </div>
</template>
<script>
import ProductList from '@/components/ProductList.vue'
// import ProductList from '@/components/ProductList.vue'
import PecCategoryGroupTypeA from '@/components/PecCategoryGroupTypeA.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapGetters, mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  props: {
    categorySecondaryId: [String, Number],
    breadcrumbs: { type: Array, default: () => [] },
  },
  components: { ProductList, PecCategoryGroupTypeA, BackgroundSvg },
  watch: {
    categorySecondaryId: {
      immediate: true,
      handler: function () {
        return this.fetchData().then(() => {
          if (this.breadcrumbs.length) {
            this.items = this.breadcrumbs
          } else {
            return apiAxios({
              method: 'post',
              url: '/Profile/GetCategorySecondary',
              data: {
                value: this.categorySecondaryId,
              },
            }).then(
              res =>
                (this.items = [
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
                ])
            )
          }
        })
      },
    },
  },
  created() {
    window.appShareToWeb = this.shareResult
    if (window.previousUrl == '/share') {
      this.isFromShare = 'Y'
    }
    this.getSubCategoryImg()
    this.getProductRecommendPurchase()
  },
  data() {
    return {
      isLoading: false,
      productArray: [],
      categoryImgArray: [],
      items: [],
      isFromShare: 'N',
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
            url: '/Product/GetProductCategorySecondaryV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
              category_id: this.categorySecondaryId,
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
    getSubCategoryImg() {
      apiAxios({
        method: 'post',
        url: '/Category/GetSubCategoryImg',
        data: {
          profile_name: 'CATEGORY_MINOR',
          profile_value: this.categorySecondaryId,
        },
      }).then(res => {
        this.categoryImgArray = res.result
      })
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
        url: '/Product/GetProductCategorySecondaryV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          category_id: this.categorySecondaryId,
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
</style>
