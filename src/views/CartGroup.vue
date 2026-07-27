<template>
  <div>
    <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
    <product-list
      :class-name="'ga-freeshipping-list'"
      :section-name="'ga-freeshipping-list'"
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
    this.groupId = this.$route.params.groupId
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
          text: '免運專區',
          to: '/cart_group',
        },
      ],
      groupId: 0,
      freeShipping: 0,
      groupName: '',
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
          return apiAxios({
            method: 'post',
            url: '/Product/GetProductCartGroupV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
              cart_group_id: this.groupId,
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
        })
        .then(res => {
          this.productArray = res.result.product
          this.brand = res.result.brand
          this.category = res.result.category
          this.categorySecondary = res.result.categorySecondary
          this.categoryMinor = res.result.categoryMinor
          this.pagingInfo = res.pagingInfo
          return apiAxios({
            method: 'post',
            url: '/Cart/GetCartKindInfo',
            data: {
              id: this.groupId,
            },
          })
        })
        .then(res => {
          this.groupName = res.result[0].group_name
          this.freeShipping = res.result[0].free_shipping
          this.$nextTick(() => {
            if (this.freeShipping == 999999999) {
              this.items[1].text = `${this.groupName}專區`
            } else if (this.freeShipping == 0) {
              this.items[1].text = `${this.groupName}-免運專區`
            } else {
              this.items[1].text = `${this.groupName}-滿${this.freeShipping}元免運專區`
            }
          })
        })
        .finally(() => (this.isLoading = false))
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductCartGroupV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          cart_group_id: this.groupId,
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
