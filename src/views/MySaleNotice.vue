<template>
  <div>
    <div class="d-flex" style="position: relative">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <!-- <v-btn
        class="mt-3 mr-3 secondary pec-share-btn"
      >
        立即分享
      </v-btn> -->
      <v-btn
        class="mt-3 mr-3"
        :class="{
          secondary: !showDelSelect,
          accent: showDelSelect,
          'lighten-3': showDelSelect,
        }"
        @click="showDelSelect = !showDelSelect"
      >
        {{ showDelSelect ? '取消' : '選取' }}
      </v-btn>
    </div>
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="white"
        fixed-tabs
        icons-and-text
        show-arrows
      >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab v-for="(item, i) in tabItems" :key="i">
          {{ item.text }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item v-for="(item, key) in tabItems" :key="key">
          <v-card color="basil" flat>
            <div>
              <product-list
                :class-name="'ga-groupbuy-alert-list'"
                :section-name="'ga-groupbuy-alert-list'"
                :product-array="productArray"
                :is-loading="isLoading"
                :breadcrumbs="items"
                :show-sale-notice="true"
                :show-del-btn="true"
                :show-del-select="showDelSelect"
                :brand="brand"
                :category="category"
                :categorySecondary="categorySecondary"
                :categoryMinor="categoryMinor"
                :pagingInfo="pagingInfo"
                :tab="tab"
                @updatedFilterConditions="updatedFilterConditions"
                @delItem="delItem"
              ></product-list>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ProductList from '@/components/ProductList.vue'
import { apiAxios } from '@/api'

export default {
  components: { ProductList },
  created() {
    this.isLoading = true
    this.fetchData()
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
          text: '開團通知',
          to: '/my-follow',
        },
      ],
      tab: 0,
      tabItems: [
        {
          text: '已開團',
          icon: 'fa-solid fa-basket-shopping',
          badge: false,
        },
        {
          text: '尚未開團',
          icon: 'fa-solid fa-store',
          badge: false,
        },
      ],
      pageCount: 1,
      pageSize: 30,
      daysDefaultArray: [7, 31, 7],
      unreadCount: 0,
      currentTab: 0,
      productArray: [],
      multipleDeletions: [],
      maxPrice: 0,
      minPrice: 0,
      showDelSelect: false,
      pagingInfo: {},
      brand: [],
      category: [],
      categorySecondary: [],
      categoryMinor: [],
    }
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
            url: '/Product/GetSaleNoticeProductV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
              expired: 'N',
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
        .finally(() => (this.isLoading = false))
    },
    // getSaleNoticeProduct() {
    //   apiAxios({
    //     method: 'post',
    //     url: '/Product/GetSaleNoticeProduct',
    //     data: {},
    //   }).then(res => (this.productArray = res.result))
    // },
    delItem(item_main_id, filterConditions) {
      apiAxios({
        method: 'post',
        url: '/SaleNotice/SaleNotice',
        data: { item_main_id: item_main_id },
      }).then(() => {
        this.$snackbar.add(`商品已取消開團通知`, { color: 'success' })
        this.updatedFilterConditions(filterConditions)
      })
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      filterConditions.expired = this.tab !== 0 ? 'Y' : 'N'
      apiAxios({
        method: 'post',
        url: '/Product/GetSaleNoticeProductV2',
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
  computed: {
    ...mapGetters(['isLogin']),
    // filterProductArray() {
    //   if (this.tab !== 0) {
    //     return this.productArray.filter(function (item) {
    //       return item.noticed === 'Y' && item.expired === 'Y'
    //     })
    //   } else {
    //     return this.productArray.filter(function (item) {
    //       return item.noticed === 'Y' && item.expired === 'N'
    //     })
    //   }
    // },
  },
  // watch: {
  //   tab() {
  //     this.updatedFilterConditions()
  //   },
  // },
}
</script>
<style scoped>
.pec-share-btn {
  position: sticky;
  top: 83px;
  z-index: 2;
}
</style>
