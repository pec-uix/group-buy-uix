<template>
  <v-container fluid>
    <v-row>
      <v-navigation-drawer
        fixed
        v-model="filterDrawer"
        right
        touchless
        temporary
      >
        <div
          v-if="!filterCategoryDrawer"
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          "
        >
          <div>
            <div class="d-flex pa-4 pr-1 pb-1 primary--text align-center">
              條件篩選
              <v-spacer></v-spacer>
              <v-btn
                fab
                plain
                text
                color="primary"
                class="flex-column primary--text pec-close-fiter"
                @click="filterDrawer = false"
              >
                <background-svg
                  backgroungUrl="/close.svg"
                  width="20px"
                  height="20px"
                  color="#ca1f1d"
                ></background-svg>
                <span class="text-caption"> 關閉 </span>
              </v-btn>
            </div>
            <v-divider></v-divider>
            <v-container>
              <div class="text-subtitle-1 black--text">價格區間</div>
              <v-chip-group column multiple active-class="selected">
                <v-row dense>
                  <v-col cols="6">
                    <v-text-field
                      dense
                      label="最低價"
                      outlined
                      hide-details
                      type="number"
                      v-model="sortArrayTemplate.minPrice"
                    ></v-text-field> </v-col
                  ><v-col cols="6">
                    <v-text-field
                      dense
                      label="最高價"
                      outlined
                      hide-details
                      type="number"
                      v-model="sortArrayTemplate.maxPrice"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-chip-group>
              <div class="text-subtitle-1 black--text mt-4">付款方式</div>
              <v-chip-group
                column
                multiple
                active-class="selected"
                v-model="sortArrayTemplate.paymentType"
              >
                <v-row dense>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="1"
                      >取貨點繳費</v-chip
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="2"
                      >線上支付</v-chip
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="3"
                      >匯款</v-chip
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="5"
                      >貨到付款</v-chip
                    >
                  </v-col>
                </v-row>
              </v-chip-group>
              <div class="text-subtitle-1 black--text mt-4">配送方式</div>
              <v-chip-group
                column
                multiple
                active-class="selected"
                v-model="sortArrayTemplate.receiveType"
              >
                <v-row dense>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="1"
                      >取貨點取貨</v-chip
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="2"
                      >宅配</v-chip
                    >
                  </v-col>
                </v-row>
              </v-chip-group>
              <div class="text-subtitle-1 black--text mt-4">溫層</div>
              <v-chip-group
                column
                multiple
                active-class="selected"
                v-model="sortArrayTemplate.storeType"
              >
                <v-row dense>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="NORMAL"
                      >常溫</v-chip
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="COOL"
                      >冷藏</v-chip
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-chip filter class="block" label outlined value="FREEZING"
                      >冷凍</v-chip
                    >
                  </v-col>
                </v-row>
              </v-chip-group>
            </v-container>
          </div>
          <v-sheet class="d-flex pa-3 pec-filter-action">
            <v-btn
              outlined
              class="mr-2 flex-grow-1"
              color="warning"
              @click="
                sortArrayTemplate.storeType = ''
                sortArrayTemplate.paymentType = []
                sortArrayTemplate.receiveType = []
                sortArrayTemplate.maxPrice = 0
                sortArrayTemplate.minPrice = 0
                categoryFilter.forEach(item => {
                  item.select = []
                })
              "
            >
              清除</v-btn
            >
            <v-btn
              depressed
              class="flex-grow-1"
              color="primary"
              @click="toApply()"
            >
              套用</v-btn
            >
          </v-sheet>
        </div>
        <div
          v-else
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          "
        >
          <div>
            <div class="d-flex pa-4 pr-1 pb-1 primary--text align-center">
              <v-btn
                fab
                text
                icon
                color="primary"
                class="flex-column primary--text pec-close-fiter ml-2"
                @click="filterCategoryDrawer = false"
              >
                <i class="fa-solid fa-chevron-left" style="font-size: 16px"></i>
                <span class="ml-1" style="font-size: 16px; padding-bottom: 2px"
                  >回篩選</span
                ></v-btn
              >
            </div>
            <v-divider></v-divider>
            <v-container>
              <div class="d-flex justify-space-between align-end">
                <div class="text-subtitle-1 font-weight-bold mt-4">
                  {{ categoryFilter[categoryFilterActive].title }}
                </div>
                <!-- <div style="font-size: 12px">
                  依數量排序<span class="ml-4">依字母排序</span>
                </div> -->
              </div>
              <v-text-field
                v-if="categoryFilter[categoryFilterActive].title == '品牌'"
                label="請輸入要搜尋品牌"
                icon-size="10px"
                class="search-icon mb-6"
                append-icon="fa-solid fa-search"
                v-model="searchQuery"
                hide-details
              ></v-text-field>
              <v-checkbox
                v-for="(item, index) in filteredItems"
                :key="index"
                v-model="tempSelect"
                color="primary"
                :label="`${item.name} (${item.count})`"
                :value="item.id"
                hide-details
              ></v-checkbox>
              <!-- <v-checkbox
                v-model="ex4"
                color="primary"
                label="Applw 蘋果(10)"
                value="Applw 蘋果(10)"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="ex4"
                color="primary"
                label="OPPO 歐珀 (10)"
                value="OPPO 歐珀 (10)"
                hide-details
              ></v-checkbox> -->
            </v-container>
          </div>
          <v-sheet class="d-flex pa-3 pec-filter-action">
            <v-btn
              outlined
              class="mr-2 flex-grow-1"
              color="warning"
              @click="cancelSelection()"
            >
              清除</v-btn
            >
            <v-btn
              depressed
              class="flex-grow-1"
              color="primary"
              @click="applySelection()"
            >
              套用</v-btn
            >
          </v-sheet>
        </div>
      </v-navigation-drawer>
      <v-col cols="12" class="d-none">
        <v-card>
          <v-card-title>
            條件篩選
            <v-spacer></v-spacer>
            <v-btn small outlined color="primary"> 清空 </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-1 black--text">商品狀態</div>
            <v-checkbox hide-details label="即將開團"></v-checkbox>
            <v-checkbox hide-details label="開團中"></v-checkbox>
            <v-checkbox hide-details label="已成團"></v-checkbox>
            <div class="text-subtitle-1 black--text mt-8">定價方式</div>
            <v-checkbox hide-details label="分檻定價"></v-checkbox>
            <v-checkbox hide-details label="單一定價"></v-checkbox>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="12">
        <v-card class="d-none d-md-block mb-4">
          <div class="d-flex justify-space-between py-3 px-4">
            <div class="d-flex align-center">
              排序：
              <v-btn
                v-for="option in sortOptionArray"
                :key="option.value"
                text
                @click="sort(option.value)"
              >
                {{ option.text }}
                <background-svg
                  v-if="sortBy.key !== option.value"
                  backgroungUrl="/import_export.svg"
                  width="16px"
                  height="16px"
                  color="#000"
                  class="mt-1"
                ></background-svg>
                <background-svg
                  v-else-if="sortBy.asc"
                  backgroungUrl="/arrow_upward.svg"
                  width="16px"
                  height="16px"
                  color="#ca1f1d"
                  class="mt-1"
                ></background-svg>
                <background-svg
                  v-else
                  backgroungUrl="/arrow_downward.svg"
                  width="16px"
                  height="16px"
                  color="#ca1f1d"
                  class="mt-1"
                ></background-svg>
              </v-btn>
              <v-btn
                text
                @click="sortBy = { key: 'default_order_seq', asc: true }"
              >
                預設
                <background-svg
                  v-if="sortBy.key == 'default_order_seq'"
                  backgroungUrl="/arrow_downward.svg"
                  width="16px"
                  height="16px"
                  color="#ca1f1d"
                  class="mt-1"
                ></background-svg>
              </v-btn>
              <div
                class="ml-1"
                style="width: 2px; background-color: #b0b0b0; height: 55%"
              ></div>
              <v-btn
                elevation="0"
                small
                text
                class="ml-1"
                @click="filterDrawer = true"
                :color="`${
                  sortArray.paymentType.length +
                    sortArray.receiveType.length +
                    sortArray.maxPrice +
                    sortArray.minPrice !==
                    0 || sortArray.storeType !== ''
                    ? 'primary'
                    : ''
                }`"
              >
                <span class="text-subtitle-2" style="padding-top: 1px"
                  >篩選更多</span
                >
                <i
                  class="fa-sharp fa-solid fa-caret-down ml-1"
                  style="font-size: 1.3em"
                ></i>
              </v-btn>
            </div>
            <div class="d-flex align-center">
              <div v-if="!hideGridView" class="d-flex align-center">
                呈現方式：
                <v-btn-toggle class="ml-1" v-model="gridView" borderless>
                  <v-btn small :value="true">
                    <background-svg
                      class="mt-1 mr-1"
                      backgroungUrl="/view_list.svg"
                      width="18px"
                      height="18px"
                      color="#000"
                    ></background-svg>
                    列表
                  </v-btn>
                  <v-btn small :value="false">
                    <background-svg
                      class="mt-1 mr-1"
                      backgroungUrl="/grid_view.svg"
                      width="18px"
                      height="18px"
                      color="#000"
                    ></background-svg>
                    圖表
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </div>
        </v-card>
        <!-- <pre>{{ productArrayfilter }}</pre> -->
        <v-card class="d-md-none">
          <div class="d-flex align-center justify-space-between py-3 px-4 mb-4">
            <div class="d-flex">
              <v-btn
                class="font-weight-black px-0 py-2 mr-2"
                elevation="0"
                text
                :color="`${
                  sortArray.paymentType.length +
                    sortArray.receiveType.length +
                    sortArray.maxPrice +
                    sortArray.minPrice !==
                    0 || sortArray.storeType !== ''
                    ? 'primary'
                    : '#626262'
                }`"
                @click="filterDrawer = true"
                style="height: 48px; line-height: 1.2; letter-spacing: 1.5px"
              >
                <!-- <v-img
                class="mr-1"
                src="/filter_alt.svg"
                eager
                max-width="16"
                max-height="16"
              ></v-img> -->
                <i
                  class="fa-sharp fa-solid fa-arrow-up-right-from-square mr-2"
                ></i
                >篩選<br />更多
              </v-btn>
              <v-divider
                vertical
                class="my-1"
                style="border-color: rgba(0, 0, 0, 0.12); border-width: 1px"
              ></v-divider>
              <v-select
                style="max-width: 200px"
                flat
                solo-inverted
                v-model="sortBy"
                hide-details
                :items="selectItemsArray"
                label="排序"
                class="ml-2"
                @change="sortProduct()"
              ></v-select>
            </div>

            <!-- <v-btn-toggle
              class="ml-2"
              v-model="gridView"
              borderless
              v-if="!showGroupBuyNotification"
            > -->
            <v-btn
              v-if="!gridView"
              class="ml-2"
              elevation="0"
              style="height: 48px"
              @click="gridView = !gridView"
            >
              <background-svg
                backgroungUrl="/view_list.svg"
                width="20px"
                height="20px"
                color="#000"
              ></background-svg>
            </v-btn>
            <v-btn
              v-else
              elevation="0"
              class="ml-2"
              style="height: 48px"
              @click="gridView = !gridView"
            >
              <background-svg
                backgroungUrl="/grid_view.svg"
                width="20px"
                height="20px"
                color="#000"
              ></background-svg>
            </v-btn>
            <!-- </v-btn-toggle> -->
            <!-- | -->
          </div>
        </v-card>
        <!-- <div class="mb-4 text-h6 text-right">共計 888件商品</div> -->
        <v-col
          cols="12"
          lg="12"
          class="d-flex justify-end d-black pb-1 mb-2 pt-0"
          v-if="showDelSelect"
          ><v-btn class="primary mr-3" dark @click="dialog = true">
            刪除
          </v-btn>
          <v-btn
            color="#F88233"
            dark
            @click="
              if (delItemArray.length < productArrayfilter.length) {
                isChoseAll = [true, Date.now()]
              } else {
                isChoseAll = [false, Date.now()]
                delItemArray = []
              }
            "
          >
            全選
          </v-btn>
        </v-col>
        <template
          v-if="
            isLoading &&
            ((!gridView && showGroupBuyNotification) ||
              (gridView && showGroupBuyNotification) ||
              (!gridView && !showGroupBuyNotification))
          "
        >
          <v-skeleton-loader
            v-for="index in 4"
            :key="index"
            type="list-item-avatar-three-line"
          ></v-skeleton-loader>
        </template>
        <v-row v-if="isLoading && gridView">
          <v-col cols="6" sm="4" md="3" v-for="index in 4" :key="index">
            <v-skeleton-loader type="card"></v-skeleton-loader>
          </v-col>
        </v-row>
        <div class="my-4 text-center">
          <v-btn
            text
            color="primary"
            v-if="showExpired && violationArray.length > 0"
            @click="removeInvalidCartItem"
          >
            移除所有失效商品
          </v-btn>
        </div>

        <v-row dense v-if="!isLoading && gridView">
          <v-col
            cols="12"
            v-for="product in productArrayfilter"
            :key="product.id"
          >
            <pec-product-row
              :section-name="sectionName"
              :showGroupBuyNotification="showGroupBuyNotification"
              :product="product"
              :show-sale-notice="showSaleNotice"
              :show-del-btn="showDelBtn"
              :show-del-select="showDelSelect"
              :show-expired="showExpired"
              :to="{
                name: 'Product',
                params: {
                  productId: product.product_id,
                  breadcrumbs: breadcrumbs.slice(0).concat([
                    {
                      text: product.product_name,
                      disabled: false,
                    },
                  ]),
                  class: className,
                },
              }"
              :is-login="$store.getters['isLogin']"
              :is-verified="$store.getters['isVerified']"
              :isChoseAll="isChoseAll"
              :hide-track="hideTrack"
              @delItem="delItem"
              @choseItem="choseItem"
            ></pec-product-row>
          </v-col>
          <v-col cols="12"
            ><div class="d-flex justify-end mt-3">
              <v-pagination
                v-model="page"
                :length="pagingInfo.totalPageCount"
                :total-visible="7"
                rounded="0"
              ></v-pagination></div
          ></v-col>
        </v-row>
        <v-row dense v-if="!isLoading && !gridView">
          <v-col
            cols="6"
            sm="4"
            md="3"
            v-for="product in productArrayfilter"
            :key="product.id"
            class="pa-md-3"
          >
            <pec-product-card
              :section-name="sectionName"
              :showGroupBuyNotification="showGroupBuyNotification"
              :show-expired="showExpired"
              :product="product"
              :show-del-btn="showDelBtn"
              :show-del-select="showDelSelect"
              :to="{
                name: 'Product',
                params: {
                  productId: product.product_id,
                  breadcrumbs: breadcrumbs.slice(0).concat([
                    {
                      text: product.product_name,
                      disabled: false,
                    },
                  ]),
                  class: className,
                },
              }"
              :hide-track="hideTrack"
              :is-login="$store.getters['isLogin']"
              :is-verified="$store.getters['isVerified']"
              :isChoseAll="isChoseAll"
              @delItem="delItem"
              @choseItem="choseItem"
            ></pec-product-card>
          </v-col>
          <v-col cols="12"
            ><div class="d-flex justify-end mt-3">
              <v-pagination
                v-model="page"
                :length="pagingInfo.totalPageCount"
                :total-visible="7"
                rounded="0"
              ></v-pagination></div
          ></v-col>
        </v-row>
        <!-- <div class="text-center my-5">
          <v-pagination
            color="primary"
            :length="20"
            :total-visible="7"
          ></v-pagination>
        </div> -->
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5" v-if="delItemArray.length == 0">
          請選擇欲刪除的商品
        </v-card-title>
        <v-card-title class="text-h5" v-else>
          確定刪除這 {{ delItemArray.length }} 支商品?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" text @click="dialog = false"> 取消 </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            dark
            @click="
              delItem(delItemArray)
              delItemArray = []
              isChoseAll = [false, Date.now()]
              dialog = false
            "
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import PecProductRow from '@/components/PecProductRow.vue'
import PecProductCard from '@/components/PecProductCard.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
export default {
  components: {
    PecProductRow,
    PecProductCard,
    BackgroundSvg,
  },
  props: {
    isLoading: Boolean,
    className: { type: String, default: '' },
    sectionName: { type: String, default: '' },
    productArray: { type: Array, default: () => [] },
    breadcrumbs: { type: Array, default: () => [] },
    defaultSortBy: {
      type: Object,
      default: () => ({ key: 'default_order_seq', asc: true }),
    },
    showGroupBuyNotification: { type: Boolean, default: false },
    showSaleNotice: { type: Boolean, default: false },
    showDelBtn: { type: Boolean, default: false },
    showDelSelect: { type: Boolean, default: false },
    showExpired: { type: Boolean, default: false },
    hideTrack: { type: Boolean, default: false },
    hideGridView: { type: Boolean, default: false },
    isShowSelect: { type: Boolean, default: false },
    brand: { type: Array, default: () => [] },
    category: { type: Array, default: () => [] },
    categorySecondary: { type: Array, default: () => [] },
    categoryMinor: { type: Array, default: () => [] },
    pagingInfo: {
      type: Object,
      default: () => ({
        currentPage: 1,
        totalPageCount: 1,
        totalRows: 2,
        firstPageLink: null,
        prevPageLink: null,
        nextPageLink: null,
        lastPageLink: null,
      }),
    },
  },
  created() {
    try {
      this.gridView =
        JSON.parse(localStorage.getItem('unilife_product_list_grid_view')) ||
        false
    } catch (error) {
      null
    }
  },
  watch: {
    gridView(value) {
      try {
        localStorage.setItem('unilife_product_list_grid_view', value)
      } catch (error) {
        null
      }
    },
    productArray() {
      this.productArraySorted = this.productArray
        .map(x => x)
        .sort((a, b) => {
          let modifier = this.sortBy.asc ? 1 : -1
          if (a[this.sortBy.key] < b[this.sortBy.key]) return -1 * modifier
          if (a[this.sortBy.key] > b[this.sortBy.key]) return 1 * modifier
          return 0
        })
      this.productArrayfilter = this.productArraySorted
    },
    filterDrawer() {
      if (this.filterDrawer == true) {
        this.productArrayfilterCache = this.productArrayfilter
        this.productArrayfilter = this.productArrayfilter.slice(0, 8)
      } else {
        this.productArrayfilter = this.productArrayfilterCache
      }
    },
    brand() {
      this.categoryFilter[0].value = this.brand
    },
    category() {
      this.categoryFilter[1].value = this.category
    },
    categorySecondary() {
      this.categoryFilter[2].value = this.categorySecondary
    },
    categoryMinor() {
      this.categoryFilter[3].value = this.categoryMinor
    },
    defaultSortBy: {
      handler: 'toApply',
      deep: true,
    },
    pagingInfo: {
      handler: 'handlePageChange',
      deep: true,
    },
    page() {
      this.toApply()
      window.scrollTo(0, 0)
    },
  },
  data() {
    return {
      page: 1,
      searchQuery: '',
      categoryFilter: [
        {
          title: '品牌',
          value: [],
          select: [],
        },
        {
          title: '大分類',
          value: [],
          select: [],
        },
        {
          title: '中分類',
          value: [],
          select: [],
        },
        {
          title: '小分類',
          value: [],
          select: [],
        },
      ],
      categoryFilterActive: null,
      tempSelect: [],
      sortOptionArray: [
        { value: 'end_date', text: '截止日' },
        { value: 'max_discount_price', text: '價格' },
        { value: 'order_num_with_ratio', text: '累積件數' },
      ],
      selectItemsArray: [
        { text: '預設', value: { key: 'default_order_seq', asc: true } },
        { text: '最新上架', value: { key: 'end_date', asc: false } },
        { text: '即將結團', value: { key: 'end_date', asc: true } },
        {
          text: '價格(低到高)',
          value: { key: 'max_discount_price', asc: true },
        },
        {
          text: '價格(高到低)',
          value: { key: 'max_discount_price', asc: false },
        },
        {
          text: '最熱門',
          value: { key: 'order_num_with_ratio_recent', asc: false },
        },
      ],
      sortBy: this.defaultSortBy,
      filterDrawer: false,
      filterCategoryDrawer: false,
      gridView: false,
      dialog: false,
      delItemArray: [],
      isChoseAll: [],
      selected: [],
      sortArray: {
        storeType: '',
        paymentType: [],
        receiveType: [],
        maxPrice: 0,
        minPrice: 0,
      },
      sortArrayTemplate: {
        storeType: [],
        paymentType: [],
        receiveType: [],
        maxPrice: 0,
        minPrice: 0,
      },
      productArraySorted: [],
      productArrayfilter: [],
      productArrayfilterCache: [],
      filterConditions: {
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
    }
  },
  computed: {
    violationArray() {
      return this.productArraySorted.filter(product => {
        return product.expired == 'Y'
      })
    },
    filteredItems() {
      const activeCategory = this.categoryFilter[this.categoryFilterActive]
      if (activeCategory.title === '品牌') {
        const searchQueryLower = this.searchQuery.toLowerCase()
        return activeCategory.value.filter(
          item =>
            item.name && item.name.toLowerCase().includes(searchQueryLower)
        )
      }
      return activeCategory.value
    },
  },
  methods: {
    selectCategory(index) {
      this.categoryFilterActive = index
      this.tempSelect = [...this.categoryFilter[index].select] // 複製當前選擇到臨時變數
    },
    applySelection() {
      if (this.categoryFilterActive !== null) {
        this.categoryFilter[this.categoryFilterActive].select = [
          ...this.tempSelect,
        ] // 更新選擇
        this.filterCategoryDrawer = false
        this.searchQuery = ''
        // this.categoryFilterActive = null
        // this.tempSelect = [] // 重置臨時選擇
      }
    },
    cancelSelection() {
      this.tempSelect = [] // 重置臨時選擇
      this.categoryFilter.forEach(item => {
        item.select = []
      })
      this.filterCategoryDrawer = false
    },
    handlePageChange() {
      if (this.page > this.pagingInfo.totalPageCount) {
        this.page = 1
      }
    },
    sort(key) {
      if (key === this.sortBy.key) {
        this.sortBy.asc = !this.sortBy.asc
      } else {
        this.sortBy.key = key
        this.sortBy.asc = true
      }
      this.sortProduct()
    },
    sortProduct() {
      this.productArrayfilter = this.productArrayfilter
        .map(x => x)
        .sort((a, b) => {
          let modifier = this.sortBy.asc ? 1 : -1
          if (a[this.sortBy.key] < b[this.sortBy.key]) return -1 * modifier
          if (a[this.sortBy.key] > b[this.sortBy.key]) return 1 * modifier
          return 0
        })
    },
    delItem(item_main_id) {
      this.$emit('delItem', item_main_id)
    },
    choseItem(item_main_id, status) {
      if (status) {
        if (!this.delItemArray.includes(item_main_id)) {
          this.delItemArray.push(item_main_id)
        }
      } else {
        this.delItemArray = this.remove(this.delItemArray, item_main_id)
      }
    },
    remove(arr, item) {
      let index = arr.indexOf(item)
      return [...arr.slice(0, index), ...arr.slice(index + 1)]
    },
    removeInvalidCartItem() {
      let ary = this.violationArray.map(item => {
        return item.item_main_id
      })
      this.delItem(ary)
    },
    toApply() {
      if (
        !this.sortArrayTemplate.maxPrice ||
        isNaN(this.sortArrayTemplate.maxPrice)
      ) {
        this.sortArrayTemplate.maxPrice = 0
      }
      if (
        !this.sortArrayTemplate.minPrice ||
        isNaN(this.sortArrayTemplate.minPrice)
      ) {
        this.sortArrayTemplate.minPrice = 0
      }
      if (
        parseInt(this.sortArrayTemplate.maxPrice) <
        parseInt(this.sortArrayTemplate.minPrice)
      ) {
        [this.sortArrayTemplate.maxPrice, this.sortArrayTemplate.minPrice] = [
          this.sortArrayTemplate.minPrice,
          this.sortArrayTemplate.maxPrice,
        ]
      }

      this.sortArray = Object.assign({}, this.sortArrayTemplate)

      this.filterConditions = {
        storeType: this.sortArray.storeType,
        paymentType: this.sortArray.paymentType,
        receiveType: this.sortArray.receiveType,
        brand: this.categoryFilter[0].select,
        category: this.categoryFilter[1].select,
        categorySecondary: this.categoryFilter[2].select,
        categoryMinor: this.categoryFilter[3].select,
        minPrice: `${this.sortArray.minPrice}`,
        maxPrice: `${this.sortArray.maxPrice}`,
        orderBy: this.defaultSortBy,
        currentPage: this.page,
      }

      this.$emit('updatedFilterConditions', this.filterConditions)

      // this.$emit('pushFilterItem', this.sortArray)

      // this.sortBy = { key: 'default_order_seq', asc: true }
      // this.isChoseAll = [false, Date.now()]
      // this.delItemArray = []
      this.filterDrawer = false
    },
  },
}
</script>
<style scoped>
@media (max-width: 600px) {
  .pec-multiple-del-card {
    width: calc(100% - 36px);
  }
}
</style>
