<template>
  <div>
    <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
    <product-list
      :class-name="'ga-recommend-list'"
      :section-name="'ga-recommend-list'"
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
</template>
<script>
import ProductList from '@/components/ProductList.vue'
import { apiAxios } from '@/api'

export default {
  components: { ProductList },
  created() {
    return this.fetchData()
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
          text: '推薦商品',
          to: '/recommend',
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
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Product/GetProductArrayRecommendV2',
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
        .finally(() => (this.isLoading = false))
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductArrayRecommendV2',
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
