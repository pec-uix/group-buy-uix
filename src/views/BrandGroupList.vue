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
      <v-container class="pt-0 pb-1" fluid>
        <v-row>
          <v-col cols="12" lg="12">
            <pec-category-group-type-d
              :category-img-array="brandList"
              :color="'#FFD400'"
              @pushItem="getItem"
              :class-name="'ga-brand-hall'"
              :section-name="'ga-brand-hall'"
            >
            </pec-category-group-type-d>
            <v-card
              class="d-none d-md-block"
              width="100%"
              elevation="1"
              outlined
            >
              <v-list-item three-line>
                <router-link
                  :to="`/brand-group/${selectedBrand.id}`"
                  style="text-decoration: none"
                >
                  <v-img
                    :src="selectedBrand.img_url"
                    class="my-2 mr-2"
                    width="100"
                    height="100"
                    contain
                  ></v-img>
                </router-link>
                <v-list-item-content
                  class="flex-nowrap justify-space-between"
                  style="cursor: initial"
                  ><router-link
                    class="d-flex"
                    :to="`/brand-group/${selectedBrand.id}`"
                    style="
                      text-decoration: none;
                      flex: 0 1 auto;
                      font-weight: bold;
                    "
                  >
                    <v-list-item-title class="text-h5 font-weight-medium">
                      {{ selectedBrand.title }}
                    </v-list-item-title></router-link
                  ><v-list-item-title
                    class="text-h5 d-flex align-center flex-column"
                    style="flex: 0 0 auto"
                  >
                    <v-btn
                      v-if="isLogin && isVerified"
                      fab
                      small
                      text
                      class="text-subtitle-1"
                      color="primary"
                      elevation="0"
                      @click.stop.prevent="setTrackBrand()"
                    >
                      <i
                        class="fa-heart fa-2xl pb-1"
                        :class="{
                          'fa-solid': selectedBrand.track_status == 'Y',
                          'fa-regular': !(selectedBrand.track_status == 'Y'),
                        }"
                      ></i>
                    </v-btn>
                    <router-link
                      v-else-if="!isLogin"
                      class="text-h5 primary--text"
                      :to="{
                        path: '/login',
                        query: { redirect: $route.fullPath },
                      }"
                      >請先登入</router-link
                    >
                    <router-link
                      v-else-if="!isVerified"
                      class="text-h5 primary--text"
                      :to="{
                        path: '/login/auth',
                        query: { redirect: $route.fullPath },
                      }"
                      >請先完成認證</router-link
                    >
                    <span
                      v-if="isLogin && isVerified"
                      class="text-subtitle-2 font-weight-bold"
                      :style="`${
                        selectedBrand.track_status == 'Y'
                          ? 'color:#CA1F1D'
                          : 'color:#000'
                      }`"
                      >{{
                        selectedBrand.track_status == 'Y' ? '已追蹤' : '追蹤'
                      }}</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item></v-card
            >
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container class="d-block d-md-none pt-0">
      <div class="text-h5 font-weight-bold mt-3 mb-2 pec-title">推薦品牌</div>
      <pec-product-group-type-d
        :product-array="brandList"
        :breadcrumbs="[
          {
            text: '首頁',
            disabled: false,
            to: '/',
          },
          {
            text: '瘋露營',
            to: `/activity/camping`,
          },
        ]"
        :is-login="isLogin"
        :is-verified="isVerified"
      >
      </pec-product-group-type-d>
    </v-container>

    <product-list
      class="d-none d-md-block"
      :class-name="'ga-brand-hall-list'"
      :section-name="'ga-brand-hall-list'"
      :product-array="productArray"
      :is-loading="isLoading"
      :breadcrumbs="items"
      :brand="brand"
      :category="category"
      :categorySecondary="categorySecondary"
      :categoryMinor="categoryMinor"
      :pagingInfo="pagingInfo"
      :tab="tab"
      @updatedFilterConditions="updatedFilterConditions"
    ></product-list>
  </div>
</template>
<script>
// import ProductList from '@/components/ProductList.vue'
import PecCategoryGroupTypeD from '@/components/PecCategoryGroupTypeD.vue'
// import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapGetters, mapState } from 'vuex'
import { apiAxios } from '@/api'
import PecProductGroupTypeD from '@/components/PecProductGroupTypeD.vue'

export default {
  components: {
    PecCategoryGroupTypeD,
    PecProductGroupTypeD,
  },
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
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '品牌專館',
          to: '/brand-group',
        },
      ],
      isFromShare: 'N',
      selectedBrand: {
        id: 0,
      },
      brandIndex: 0,
      brandList: [],
      pagingInfo: {},
      brand: [],
      category: [],
      categorySecondary: [],
      categoryMinor: [],
      productArray: [],
      tab: 0,
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'isVerified']),
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
            url: '/Product/GetProductAllBrandV2',
            params: { v: '2' },
          }).then(res => {
            // console.log(res)
            this.brandList = res.result
            apiAxios({
              method: 'post',
              url: '/Product/GetProductBrandV2',
              params: {
                pageNo: 1,
                pageSize: '20',
                totalPageSize: '200',
                v: '2',
              },
              data: {
                brand_id: this.brandList[0].id,
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
            }).then(res => {
              // console.log(res)
              this.category = res.result[0].category
              this.categorySecondary = res.result[0].categorySecondary
              this.categoryMinor = res.result[0].categoryMinor
              this.pagingInfo = res.pagingInfo
              this.productArray = res.result[0].product
            })
          })
        )
        .finally(() => {
          this.selectedBrand = this.brandList[0]
          this.isLoading = false
        })
    },
    toBrandGroup(brand) {
      if (brand.router_to) {
        this.$router.push(brand.router_to)
      } else {
        this.$snackbar.add(brand.brand_name + ' 品牌專館建置中')
      }
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
      this.selectedBrand = item
      this.brandIndex = index
      this.isLoading = true
      const timestamp = Date.now()
      this.tab = timestamp
    },
    setTrackBrand() {
      apiAxios({
        method: 'post',
        url: '/Track/Track',
        data: { brand_id: [this.selectedBrand.id] },
      })
        .then(res => {
          this.$snackbar.add(`${res.message}`, { color: 'success' })
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Product/GetProductAllBrand',
            params: { v: '2' },
          }).then(res => {
            this.brandList = res.result
          })
        )
        .finally(() => {
          this.selectedBrand = this.brandList[this.brandIndex]
        })
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductBrandV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          brand_id: this.selectedBrand.id,
          filter: filterConditions,
        },
      }).then(res => {
        // console.log(res)
        this.category = res.result[0].category
        this.categorySecondary = res.result[0].categorySecondary
        this.categoryMinor = res.result[0].categoryMinor
        this.pagingInfo = res.pagingInfo
        this.productArray = res.result[0].product
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
  line-height: 1.4;
  position: relative;
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
