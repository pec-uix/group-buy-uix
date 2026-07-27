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
          <i :class="item.icon"></i>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item v-for="(item, key) in tabItems" :key="key">
          <v-card color="basil" flat>
            <div v-if="key == 0">
              <product-list-Pagination
                :class-name="'ga-follow-list-product'"
                :section-name="'ga-follow-list-product'"
                :product-array="productArray"
                :is-loading="isLoading"
                :breadcrumbs="items"
                :showGroupBuyNotification="true"
                :show-del-btn="true"
                :show-del-select="showDelSelect"
                :show-expired="true"
                :hide-track="true"
                :brand="brand"
                :category="category"
                :categorySecondary="categorySecondary"
                :categoryMinor="categoryMinor"
                :pagingInfo="pagingInfo"
                @updatedFilterConditions="updatedFilterConditions"
                @pushFilterItem="getFilterItem"
                @delItem="delItem"
              ></product-list-Pagination>
              <!-- <div class="d-flex justify-end mb-3">
                <v-pagination
                  v-model="productPage"
                  :length="totalProductPageCount"
                  :total-visible="7"
                  rounded="0"
                ></v-pagination>
              </div> -->
            </div>

            <div v-else-if="key == 1">
              <v-col
                v-if="showDelSelect"
                cols="12"
                lg="12"
                class="d-flex justify-end pb-1"
                ><v-btn dark class="primary mr-3" @click="dialog = true">
                  刪除
                </v-btn>
                <v-btn color="#F88233" dark @click="choseAll"> 全選 </v-btn>
              </v-col>
              <template v-if="isLoadingBrand">
                <v-skeleton-loader
                  v-for="index in 4"
                  :key="index"
                  type="list-item-avatar-three-line"
                ></v-skeleton-loader> </template
              ><template v-if="isLoadingBrand">
                <v-row class="pa-4">
                  <v-col cols="6" sm="4" md="3" v-for="index in 4" :key="index">
                    <v-skeleton-loader type="card"></v-skeleton-loader>
                  </v-col> </v-row
              ></template>
              <v-col cols="12" lg="12" v-else>
                <div
                  class="d-flex align-center mb-3"
                  v-for="(item, index) in brandArray"
                  :key="index"
                >
                  <v-card
                    class="mx-auto pec-multiple-del-card"
                    elevation="0"
                    outlined
                  >
                    <v-list-item three-line class="px-1 pa-sm-3"
                      ><v-checkbox
                        v-if="showDelSelect"
                        class="ma-0 pa-0"
                        hide-details
                        v-model="delItemArray"
                        :value="item.id"
                      ></v-checkbox>
                      <v-img
                        :src="item.img_url_list"
                        class="my-2 mr-2"
                        style="max-width: 100px; cursor: pointer"
                        cover
                        @click="toBrand(item.id)"
                      ></v-img>
                      <v-list-item-content
                        class="flex-nowrap justify-space-between"
                        style="cursor: initial"
                      >
                        <v-list-item-title
                          class="text-h5 ma-0"
                          style="
                            flex: 0 1 auto;
                            cursor: pointer;
                            font-weight: bold;
                          "
                          @click="toBrand(item.id)"
                        >
                          {{ item.brand_name }} </v-list-item-title
                        ><v-list-item-title
                          class="text-h5 d-flex align-center"
                          style="flex: 0 0 auto"
                        >
                          <v-btn
                            color="#FC6500"
                            class="mr-3 mb-0 d-none d-sm-block"
                            elevation="0"
                            dark
                            @click="toBrand(item.id)"
                          >
                            看更多商品
                          </v-btn>
                          <v-btn
                            fab
                            text
                            small
                            class="pec-del-btn"
                            elevation="0"
                            @click="delBrandTrack([item.id])"
                          >
                            <i
                              class="d-none d-sm-block fa-sharp fa-solid fa-circle-trash"
                            ></i>
                            <i
                              class="d-block d-sm-none fa-regular fa-trash-can"
                            ></i>
                          </v-btn>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-card-actions
                      style="border-top: 1px solid #d9d9d9"
                      v-if="item.product.length > 0"
                    >
                      <v-card class="my-0" elevation="0">
                        <brand-product-slide
                          :product-array="item.product"
                        ></brand-product-slide
                        ><v-btn
                          class="mx-2 mt-2 rounded-0 d-sm-none"
                          width="calc(100% - 16px)"
                          outlined
                          color="#FC6500"
                          @click="toBrand(item.id)"
                        >
                          查看更多商品<i
                            class="fa-solid fa-angle-down ml-2 pt-1"
                          ></i>
                        </v-btn>
                      </v-card>
                    </v-card-actions>
                  </v-card>
                </div>
              </v-col>
              <div class="d-flex justify-end mb-3">
                <v-pagination
                  v-model="brandPage"
                  :length="totalBrandPageCount"
                  :total-visible="7"
                  rounded="0"
                ></v-pagination>
              </div>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5" v-if="delItemArray.length == 0">
          請選擇欲刪除的品牌
        </v-card-title>
        <v-card-title class="text-h5" v-else>
          確定刪除這 {{ delItemArray.length }} 項品牌?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" text @click="dialog = false"> 取消 </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            dark
            @click="
              delBrandTrack(delItemArray)
              delItemArray = []
              dialog = false
            "
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ProductListPagination from '@/components/ProductListPagination.vue'
import { apiAxios } from '@/api'

export default {
  components: { ProductListPagination },
  created() {
    this.isLoading = true
    this.fetchData()
    this.getMyTrackBrandList()
  },
  data() {
    return {
      isLoading: false,
      isLoadingBrand: false,
      showDelSelect: false,
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '追蹤清單',
          to: '/my-follow',
        },
      ],
      tab: 0,
      tabItems: [
        {
          text: '追蹤商品',
          icon: 'fa-solid fa-basket-shopping',
          badge: false,
        },
        {
          text: '追蹤品牌',
          icon: 'fa-solid fa-store',
          badge: false,
        },
      ],
      daysDefaultArray: [7, 31, 7],
      unreadCount: 0,
      currentTab: 0,
      productArray: [],
      brandArray: [],
      delItemArray: [],
      dialog: false,
      productPage: 1,
      totalProductPageCount: 1,
      brandPage: 1,
      totalBrandPageCount: 1,
      sortArray: {
        storeType: [],
        paymentType: [],
        receiveType: [],
        maxPrice: 0,
        minPrice: 0,
      },
      pagingInfo: {},
      brand: [],
      category: [],
      categorySecondary: [],
      categoryMinor: [],
    }
  },
  watch: {
    productPage() {
      this.getMyTrackProductList()
    },
    brandPage() {
      this.getMyTrackBrandList()
    },
    sortArray() {
      this.getMyTrackProductList()
    },
    totalProductPageCount() {
      if (this.productPage > this.totalProductPageCount) {
        this.productPage = 1
      }
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
            url: `/Product/GetTrackProductV2`,
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
    getFilterItem(sortArray) {
      this.sortArray = sortArray
    },
    getMyTrackProductList() {
      this.isLoading = true
      let filterItem = {
        storeType: [this.sortArray.storeType],
        paymentType: this.sortArray.paymentType,
        receiveType: this.sortArray.receiveType,
        storeTypeFilter: this.sortArray.storeType ? 'Y' : 'N',
        paymentTypeFilter: this.sortArray.paymentType.length > 0 ? 'Y' : 'N',
        receiveTypeFilter: this.sortArray.receiveType.length > 0 ? 'Y' : 'N',
        minPrice: this.sortArray.minPrice,
        maxPrice: this.sortArray.maxPrice,
      }
      apiAxios({
        method: 'post',
        url: `/Product/GetTrackProduct?v=2&pageNo=${this.productPage}`,
        data: filterItem,
      }).then(res => {
        this.productArray = res.result
        this.totalProductPageCount = res.pagingInfo.totalPageCount
        this.isLoading = false
      })
    },
    getMyTrackBrandList() {
      this.isLoadingBrand = true
      apiAxios({
        method: 'post',
        url: `/Product/GetTrackBrand?pageNo=${this.brandPage}`,
        data: {},
      }).then(res => {
        this.brandArray = res.result
        this.isLoadingBrand = false
      })
    },
    delItem(item_main_id_ary) {
      if (item_main_id_ary.length > 0) {
        apiAxios({
          method: 'post',
          url: '/Track/Track',
          data: { item_main_id: item_main_id_ary },
        }).then(() => {
          this.$snackbar.add(`商品取消追蹤成功`, { color: 'success' })
          apiAxios({
            method: 'post',
            url: `/Product/GetTrackProduct?v=2&pageNo=${this.productPage}`,
            data: {
              storeType: [],
              paymentType: [],
              receiveType: [],
              storeTypeFilter: 'N',
              paymentTypeFilter: 'N',
              receiveTypeFilter: 'N',
              minPrice: '0',
              maxPrice: '0',
            },
          }).then(res => (this.productArray = res.result))
        })
      }
    },
    toBrand(brand_id) {
      this.$router.push(`/brand-group/${brand_id}`)
    },
    delBrandTrack(brand_id_ary) {
      if (brand_id_ary.length > 0) {
        apiAxios({
          method: 'post',
          url: '/Track/Track',
          data: { brand_id: brand_id_ary },
        }).then(res => {
          this.$snackbar.add(`${res.message}`, { color: 'success' })
          apiAxios({
            method: 'post',
            url: '/Product/GetTrackBrand',
            data: {},
          }).then(res => {
            this.brandArray = res.result
          })
        })
      }
    },
    choseItem(brand_id, status) {
      if (status) {
        this.delItemArray.push(brand_id)
      } else {
        this.delItemArray = this.remove(this.delItemArray, brand_id)
      }
    },
    remove(arr, item) {
      let index = arr.indexOf(item)
      return [...arr.slice(0, index), ...arr.slice(index + 1)]
    },
    choseAll() {
      if (this.delItemArray.length < this.brandArray.length) {
        this.delItemArray = this.brandArray.map(function (item) {
          return item.id
        })
      } else {
        this.delItemArray = []
      }
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: `/Product/GetTrackProductV2`,
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
    ...mapState(['categoryArray', 'memberNavArray']),
    ...mapGetters(['isLogin']),
  },
}
</script>
<style scoped>
.pec-share-btn {
  position: sticky;
  top: 83px;
  z-index: 2;
}
.pec-del-btn {
  color: #ca1f1d;
}
.pec-del-btn i {
  font-size: 37px;
}
.pec-multiple-del-card {
  width: 100%;
}
.pec-multiple-del-card .v-card {
  width: 100%;
}
@media (max-width: 600px) {
  .pec-del-btn {
    color: #595757;
    background-color: initial !important;
  }
  .pec-del-btn i {
    font-size: 20px;
  }
}
</style>
