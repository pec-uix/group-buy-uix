<template>
  <div>
    <v-breadcrumbs
      large
      :items="breadcrumbs"
      class="primary--text"
    ></v-breadcrumbs>
    <product-list
      :class-name="'ga-search-product-list'"
      :section-name="'ga-search-product-list'"
      :product-array="productArray"
      :is-loading="isLoading"
      :breadcrumbs="breadcrumbs"
      :brand="brand"
      :category="category"
      :categorySecondary="categorySecondary"
      :categoryMinor="categoryMinor"
      :pagingInfo="pagingInfo"
      @updatedFilterConditions="updatedFilterConditions"
    ></product-list>
  </div>
</template>
<script>
import ProductList from '@/components/ProductList.vue'
import { apiAxios } from '@/api'

export default {
  props: ['q', 'type', 'brandId'],
  components: { ProductList },
  watch: {
    q: {
      immediate: true,
      handler: function () {
        return this.fetchData()
      },
    },
  },
  data() {
    return {
      isLoading: false,
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
      isAiSearch: true,
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
          const meiliParams = {
            q: this.q,
            pageNo: 1,
            pageSize: '20',
            totalPageSize: '200',
            v: '2',
          }
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
            url: this.isAiSearch
              ? '/ProductSearch/GetProductSearchByAiV2'
              : '/Product/SyncToMeilisearch',
            params: this.isAiSearch ? aiParams : meiliParams,
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
          this.productArray = this.isAiSearch
            ? res.result.product
            : res.result.meilisearchProduct
          this.brand = res.result.brand
          this.category = res.result.category
          this.categorySecondary = res.result.categorySecondary
          this.categoryMinor = res.result.categoryMinor
          this.pagingInfo = res.pagingInfo
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    updatedFilterConditions(filterConditions) {
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
          const meiliParams = {
            q: this.q,
            pageNo: filterConditions.currentPage,
            pageSize: '20',
            totalPageSize: '200',
            v: '2',
          }
          return apiAxios({
            method: 'post',
            url: this.isAiSearch
              ? '/ProductSearch/GetProductSearchByAiV2'
              : '/Product/SyncToMeilisearch',
            params: this.isAiSearch ? aiParams : meiliParams,
            data: filterConditions,
          })
        })
        .then(res => {
          this.productArray = this.isAiSearch
            ? res.result.product
            : res.result.meilisearchProduct
          this.brand = res.result.brand
          this.category = res.result.category
          this.categorySecondary = res.result.categorySecondary
          this.categoryMinor = res.result.categoryMinor
          this.pagingInfo = res.pagingInfo
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>
