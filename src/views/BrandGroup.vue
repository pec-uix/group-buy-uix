<template>
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
    <v-card class="ma-3 my-1" width="100%" elevation="1" outlined>
      <v-list-item three-line>
        <v-img
          v-if="productArray[0].img_url_list"
          :src="productArray[0].img_url_list"
          class="my-2 mr-2"
          style="max-width: 100px"
          cover
        ></v-img>
        <div
          v-else
          class="my-2 mr-2"
          style="
            width: 100px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bolder;
            position: relative;
            padding: 7px;
          "
        >
          <div class="brand-name">
            {{ productArray[0].brand_name }}
          </div>
          <v-img
            src="/brand-group-icon-bg.png"
            style="position: absolute; z-index: 0"
            cover
          ></v-img>
        </div>
        <v-list-item-content
          class="flex-nowrap justify-space-between"
          style="cursor: initial; width: 0px"
        >
          <v-list-item-title
            class="text-h5"
            style="flex: 0 1 auto; font-weight: bold"
          >
            <span>{{ productArray[0].brand_name }}</span> </v-list-item-title
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
                  'fa-solid': productArray[0].track_status == 'Y',
                  'fa-regular': !(productArray[0].track_status == 'Y'),
                }"
              ></i>
            </v-btn>
            <router-link
              v-else-if="!isLogin"
              class="text-h5 primary--text"
              :to="{ path: '/login', query: { redirect: $route.fullPath } }"
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
                productArray[0].track_status == 'Y'
                  ? 'color:#CA1F1D'
                  : 'color:#000'
              }`"
              >{{
                productArray[0].track_status == 'Y' ? '已追蹤' : '追蹤'
              }}</span
            >
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item></v-card
    >
    <product-list
      :class-name="'ga-brand-product-list'"
      :section-name="'ga-brand-product-list'"
      :product-array="productArray[0].product"
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
import { mapGetters } from 'vuex'
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
      productArray: [{ img_url_list: '', brand_name: '' }],
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '品牌專區',
        },
      ],
      groupId: 0,
      freeShipping: 0,
      groupName: '',
      trackBrandStatus: false,
      pagingInfo: {},
      brand: [],
      category: [],
      categorySecondary: [],
      categoryMinor: [],
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'isVerified']),
  },
  methods: {
    fetchData() {
      this.isLoading = true
      return (
        Promise.resolve()
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
              url: '/Product/GetProductBrandV2',
              params: {
                pageNo: 1,
                pageSize: '20',
                totalPageSize: '200',
                v: '2',
              },
              data: {
                brand_id: this.groupId,
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
            this.brand = res.result[0].brand
            this.category = res.result[0].category
            this.categorySecondary = res.result[0].categorySecondary
            this.categoryMinor = res.result[0].categoryMinor
            this.pagingInfo = res.pagingInfo
            this.productArray = res.result
            this.items[1].text = this.productArray[0].brand_name
            // return apiAxios({
            //   method: 'post',
            //   url: '/Cart/GetCartKindInfo',
            //   data: {
            //     id: this.groupId,
            //   },
            // })
          })
          // .then(res => {
          //   this.groupName = res.result[0].group_name
          //   this.freeShipping = res.result[0].free_shipping
          //   this.$nextTick(() => {
          //     if (this.freeShipping == 999999999) {
          //       this.items[1].text = `${this.groupName}專區`
          //     } else if (this.freeShipping == 0) {
          //       this.items[1].text = `${this.groupName}-免運專區`
          //     } else {
          //       this.items[1].text = `${this.groupName}-滿${this.freeShipping}元免運專區`
          //     }
          //   })
          // })
          .finally(() => (this.isLoading = false))
      )
    },
    getProductBrand() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductBrand',
        data: {
          brand_id: this.groupId,
        },
        params: {
          v: 2,
        },
      }).then(res => {
        this.productArray = res.result
      })
    },
    setTrackBrand() {
      apiAxios({
        method: 'post',
        url: '/Track/Track',
        data: { brand_id: [this.groupId] },
      }).then(res => {
        this.$snackbar.add(`${res.message}`, { color: 'success' })
        this.getProductBrand()
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
          brand_id: this.groupId,
          filter: filterConditions,
        },
      }).then(res => {
        this.brand = res.result[0].brand
        this.category = res.result[0].category
        this.categorySecondary = res.result[0].categorySecondary
        this.categoryMinor = res.result[0].categoryMinor
        this.pagingInfo = res.pagingInfo
        this.productArray = res.result
        this.items[1].text = this.productArray[0].brand_name
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
.brand-name {
  font-size: 20px;
  color: rgb(255, 255, 255);
  text-shadow: rgba(34, 62, 66, 0.25) 0px 3px 5px;
  position: absolute;
  z-index: 1;
  padding: 0 7px;
  line-height: 1.2;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
