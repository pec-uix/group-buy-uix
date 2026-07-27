<template>
  <div>
    <div class="d-flex justify-end flex-wrap">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <!-- <v-btn
        class="mt-3 mr-3 secondary pec-share-btn"
        @click="share"
      >
        <background-svg
          class="mt-1"
          backgroungUrl="/share.svg"
          width="16px"
          height="16px"
          color="#fff"
        ></background-svg>
        立即分享
      </v-btn> -->
      <v-container class="pb-1" fluid>
        <v-row>
          <v-col cols="12" lg="12">
            <pec-category-group-type-d
              :category-img-array="hotList"
              :color="'#FA983A'"
              :is-mobile-push-item="true"
              @pushItem="getItem"
              :class-name="'ga-groupbuy-maincategory'"
              :section-name="'ga-groupbuy-maincategory'"
            >
            </pec-category-group-type-d>
          </v-col>
        </v-row>
        <div
          v-if="selectedHot.product && selectedHot.product.length > 0"
          class="font-weight-bold my-4 pec-title"
        >
          分類排行
        </div>
        <pec-category-group-type-b
          :product-array="selectedHot.product"
          v-if="selectedHot.product && selectedHot.product.length > 0"
          :className="'ga-groupbuy-maincategory-topsales'"
          :section-name="'ga-groupbuy-maincategory-topsales'"
        >
        </pec-category-group-type-b>
      </v-container>
      <product-list
        :class-name="'ga-groupbuy-list'"
        :section-name="'ga-groupbuy-list'"
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
// import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  components: { ProductList },
  created() {
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
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '熱門團購',
          to: '/hot',
        },
      ],
      isFromShare: 'N',
      hotList: [],
      selectedHot: { product: [] },
      hotIndex: 0,
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
            url: '/Product/GetProductArrayHotV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
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
            url: '/Product/GetProductCategoryHot',
          }).then(res => {
            this.hotList = res.result
          })
        )
        .finally(() => {
          this.selectedHot = this.hotList[0]
          this.isLoading = false
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
    getItem(item, index) {
      this.selectedHot = item
      this.hotIndex = index
      apiAxios({
        method: 'post',
        url: '/Product/GetCategoryHot',
        data: {
          id: item.id,
        },
      }).then(res => {
        this.selectedHot.product = res.result
      })
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductArrayHotV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: filterConditions,
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

.pec-title {
  color: #c02220;
  padding-left: 20px;
  line-height: 1.2;
  position: relative;
  font-size: 22px;
}

.pec-title::before {
  position: absolute;
  content: '';
  display: block;
  top: 0px;
  left: 3px;
  width: 5px;
  height: 100%;
  border-radius: 50px;
  background-color: #c02220;
}
</style>
