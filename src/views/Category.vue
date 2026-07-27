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
        :className="'ga-category-main-submenu'"
      >
      </pec-category-group-type-a>
      <product-list
        :class-name="'ga-category-main-list'"
        :section-name="'ga-category-main-list'"
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
    </div>
  </div>
</template>
<script>
import ProductList from '@/components/ProductList.vue'
// import ProductList from '@/components/ProductList.vue'
import PecCategoryGroupTypeA from '@/components/PecCategoryGroupTypeA.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  props: {
    categoryId: [String, Number],
    breadcrumbs: { type: Array, default: () => [] },
  },
  components: { ProductList, PecCategoryGroupTypeA, BackgroundSvg },
  watch: {
    categoryId: {
      immediate: true,
      handler: function () {
        return this.fetchData().then(() => {
          if (this.breadcrumbs.length) {
            this.items = this.breadcrumbs
          } else {
            return apiAxios({
              method: 'post',
              url: '/Profile/GetCategory',
              data: {
                value: this.categoryId,
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
                    text: res.result.profile_comments,
                    disabled: false,
                    to: `/category/${this.categoryId}`,
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
  },
  data() {
    return {
      isLoading: false,
      productArray: [],
      categoryImgArray: [],
      items: [],
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
            url: '/Product/GetProductCategoryV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
              category_id: this.categoryId,
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
          profile_name: 'CATEGORY_SECONDARY',
          profile_value: this.categoryId,
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
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductCategoryV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          category_id: this.categoryId,
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
