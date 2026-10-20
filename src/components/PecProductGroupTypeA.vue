<template>
  <div>
    <div class="d-flex d-lg-none pa-2" style="overflow-y: auto">
      <div class="scroller-container">
        <RecycleScroller
          class="scroller"
          :items="filteredProductArray"
          :item-size="212"
          key-field="product_id"
          v-slot="{ item }"
          direction="horizontal"
        >
          <div class="scroller-item">
            <pec-product-card
              :set-border="setBorder"
              class="elevation-0 mr-3 flex-shrink-0 flex-grow-1"
              style="min-width: 170px; max-width: 200px"
              :product="item"
              :is-login="isLogin"
              :is-verified="isVerified"
              :to="{
                name: 'Product',
                params: {
                  productId: item.product_id,
                  breadcrumbs,
                  class: className,
                },
              }"
              :section-name="sectionName"
            ></pec-product-card>
          </div>
        </RecycleScroller>
      </div>
      <!-- <div
        v-for="(product, i) in filteredProductArray"
        :key="product.product_id"
      >
        <pec-product-card
          :eager="eager && i < 6"
          :set-border="setBorder"
          class="elevation-0 mr-3 flex-shrink-0 flex-grow-1"
          style="min-width: 170px; max-width: 200px"
          :product="product"
          :is-login="isLogin"
          :is-verified="isVerified"
          :to="{
            name: 'Product',
            params: {
              productId: product.product_id,
              breadcrumbs,
              class: className,
            },
          }"
          :section-name="sectionName"
        ></pec-product-card>
      </div> -->
    </div>
    <div class="d-none d-lg-flex pa-2">
      <v-container fluid>
        <!-- [MOCK] 折價券樣式預覽 A/B/C/D -->
        <div class="text-caption grey--text mb-1">↓ 折價券樣式預覽（A / B / C / D）</div>
        <v-row dense class="mb-4" style="border-bottom: 2px dashed #ccc; padding-bottom: 16px">
          <v-col cols="2" class="mb-2" v-for="variant in mockVariants" :key="variant._variant">
            <pec-product-card
              :product="variant"
              :is-login="true"
              :is-verified="true"
              :to="{ name: 'Product', params: { productId: 'mock' } }"
            ></pec-product-card>
          </v-col>
        </v-row>
        <!-- [MOCK END] -->
        <v-row dense>
          <v-col
            cols="2"
            class="mb-2"
            v-for="(product, i) in filteredProductArray"
            :key="product.product_id"
          >
            <!-- <v-lazy style="height: 100%"> -->
            <pec-product-card
              :eager="eager && i < 6"
              :set-border="setBorder"
              class="elevation-0"
              :product="product"
              :is-login="isLogin"
              :is-verified="isVerified"
              :to="{
                name: 'Product',
                params: {
                  productId: product.product_id,
                  breadcrumbs: getBreadcrumbs(product.product_name),
                  class: className,
                },
              }"
              :section-name="sectionName"
              style="min-width: 170px; max-width: 200px"
            ></pec-product-card>
            <!-- </v-lazy> -->
          </v-col>
        </v-row>
        <v-row class="mt-2" no-gutters v-if="to && productArray.length > 6">
          <v-col cols="12">
            <v-btn
              v-if="!IsExpanded"
              block
              depressed
              @click="IsExpanded = true"
              :color="`${color} lighten-2`"
            >
              展開
            </v-btn>
            <v-btn v-else block outlined :to="to" :color="color">
              前往產品清單
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
import PecProductCard from '@/components/PecProductCard.vue'
export default {
  props: [
    'productArray',
    'eager',
    'to',
    'breadcrumbs',
    'color',
    'isLogin',
    'isVerified',
    'setBorder',
    'className',
    'sectionName',
  ],
  components: {
    PecProductCard,
  },
  computed: {
    // [MOCK] 四種折價券 UI 方案預覽卡（真實資料優先，無資料時用 fallback）
    mockVariants() {
      const base = this.productArray[0] || {
        product_id: 'mock', product_name: '商品名稱範例文字範例文字範例',
        img_url: '', max_list_price: 500, discount_price: 399,
        min_discount_price: 399, max_discount_price: 399,
        start_date: '2020-01-01', end_date: '2099-12-31',
        receive_type: '2', teambuy: 'N', inv_num: null,
        reward_exclude: 'Y', subtitle: '',
        order_num: 0, order_num_with_ratio: 0, acc_order_num: 0,
        goal_num: 1, hide_order_num: 'N', noticed: 'N', track_status: 'N',
      }
      return [
        { ...base, _variant: 'A', reward_exclude: 'Y', receive_type: '1:2' },
        { ...base, _variant: 'B', reward_exclude: 'Y' },
        { ...base, _variant: 'C', reward_exclude: 'Y' },
        { ...base, _variant: 'D0', reward_exclude: 'Y', inv_num: 10, order_num_with_ratio: 3 },
        { ...base, _variant: 'D1', reward_exclude: 'Y' },
        { ...base, _variant: 'D2', reward_exclude: 'Y' },
        { ...base, _variant: 'D3', reward_exclude: 'Y' },
        { ...base, _variant: 'E1', reward_exclude: 'Y' },
        { ...base, _variant: 'E2', reward_exclude: 'Y' },
      ]
    },
    // [MOCK END]
    filteredProductArray() {
      return this.productArray.filter(
        (_, i) => this.$vuetify.breakpoint.mobile || this.IsExpanded || i < 6
      )
      // .filter(
      //   (_, i) => i < (Math.floor(this.productArray.length / 6) || 1) * 6
      // )
    },
  },
  data() {
    return {
      IsExpanded: false,
    }
  },
  methods: {
    getBreadcrumbs(productName) {
      return this.breadcrumbs?.length
        ? [
            ...this.breadcrumbs,
            {
              text: productName,
            },
          ]
        : []
    },
  },
}
</script>
<style scoped>
.scroller-container {
  height: 490px;
  /* border: 1px solid #ccc; */
  overflow: hidden;
}

.scroller {
  height: 100%;
}

.scroller-item {
  height: 465px;
  /* display: flex;
  align-items: center; */
  /* padding: 0 12px; */
  /* border-bottom: 1px solid #eee; */
}
:deep(.vue-recycle-scroller.ready .vue-recycle-scroller__item-view) {
  top: 6px;
  left: 6px;
}
</style>
