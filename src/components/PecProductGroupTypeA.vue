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
