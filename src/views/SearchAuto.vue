<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <v-breadcrumbs
        large
        :items="breadcrumbs"
        class="primary--text"
      ></v-breadcrumbs>
      <div class="pa-4 pr-7 grey--text text--lighten-1">
        {{ isAiSearch == 'N' ? 'Test Search' : 'AI Search' }}
      </div>
    </div>

    <product-list-auto-page
      :class-name="'ga-search-product-list'"
      :section-name="'ga-search-product-list'"
      :product-array="productArray"
      :is-loading="isLoading"
      :is-text-loading="isTextLoading"
      :breadcrumbs="breadcrumbs"
      :brand="brand"
      :category="category"
      :categorySecondary="categorySecondary"
      :categoryMinor="categoryMinor"
      :pagingInfo="pagingInfo"
      @updatedFilterConditions="updatedFilterConditions"
    ></product-list-auto-page>
  </div>
</template>
<script>
import ProductListAutoPage from '@/components/ProductListAutoPage.vue'
import { apiAxios } from '@/api'

export default {
  props: ['q', 'type', 'brandId', 'isAiSearch'],
  components: { ProductListAutoPage },
  watch: {
    q: {
      immediate: true,
      handler: function () {
        return this.fetchData()
      },
    },
    isAiSearch: {
      handler: function () {
        return this.fetchData()
      },
    },
  },
  data() {
    return {
      isLoading: false,
      isTextLoading: false,
      productArray: [],
      breadcrumbs: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '搜尋結果',
          // disabled: true,
        },
      ],
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
        .then(() => {
          const aiParams = {
            q: this.q,
            pageNo: 1,
            pageSize: '20',
            v: '2',
          }
          // const meiliParams = {
          //   q: this.q,
          //   pageNo: 1,
          //   pageSize: '20',
          //   totalPageSize: '200',
          //   v: '2',
          // }
          apiAxios({
            method: 'post',
            url: '/KeyWords/InsertKeyWordsLog',
            data: {
              keywords: this.q,
              source_type: this.type,
            },
          })
          return apiAxios({
            method: 'post',
            url:
              this.isAiSearch == 'Y'
                ? '/ProductSearch/GetProductSearchByAiV5'
                : '/ProductSearch/GetProductSearchByAiV4',
            params:  aiParams ,
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
        })
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
    updatedFilterConditions(filterConditions, isNewFilter = false) {
      if (isNewFilter) {
        this.isLoading = true; // 新篩選條件，顯示全面載入動畫
        this.productArray = []; // 重置商品列表
      } else {
        this.isTextLoading = true; // 無限滾動，顯示文字載入動畫
      }

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
        .then(() => {
          apiAxios({
            method: 'post',
            url: '/KeyWords/InsertKeyWordsLog',
            data: {
              keywords: this.q,
              source_type: this.type,
            },
          })

          const aiParams = {
            q: this.q,
            pageNo: filterConditions.currentPage,
            pageSize: '20',
            v: '2',
          }
          // const meiliParams = {
          //   q: this.q,
          //   pageNo: filterConditions.currentPage,
          //   pageSize: '20',
          //   totalPageSize: '200',
          //   v: '2',
          // }
          return apiAxios({
            method: 'post',
            url:
              this.isAiSearch == 'Y'
                ? '/ProductSearch/GetProductSearchByAiV5'
                : '/ProductSearch/GetProductSearchByAiV4',
            // params: this.isAiSearch == 'Y' ? aiParams : meiliParams,
            params: aiParams,
            data: filterConditions,
          })
        })
        .then(res => {
          const newProducts = res.result.product
          
          if (isNewFilter) {
            this.productArray = newProducts;
          } else {
            this.productArray = this.productArray.concat(newProducts);
          }
          
          this.brand = res.result.brand
          this.category = res.result.category
          this.categorySecondary = res.result.categorySecondary
          this.categoryMinor = res.result.categoryMinor
          this.pagingInfo = res.pagingInfo
        })
        .finally(() => {
          this.isTextLoading = false
          this.isLoading = false
        })
    },
  },
}
</script>