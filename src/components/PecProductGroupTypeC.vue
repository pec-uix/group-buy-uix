<template>
  <div>
    <div class="d-flex d-md-none pa-2" style="overflow-y: auto">
      <div v-for="product in filteredProductArray" :key="product.product_id">
        <v-lazy style="height: 100%">
          <pec-product-card
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
        </v-lazy>
      </div>
    </div>
    <div class="d-none d-md-flex pa-2">
      <v-container fluid>
        <v-row dense>
          <v-col
            cols="2"
            class="mb-2"
            v-for="product in filteredProductArray"
            :key="product.product_id"
          >
            <v-lazy style="height: 100%">
              <pec-product-card
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
            </v-lazy>
          </v-col>
        </v-row>
        <!-- <v-row class="mt-2" no-gutters v-if="to && productArray.length > 6">
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
        </v-row> -->
      </v-container>
    </div>
  </div>
</template>
<script>
import PecProductCard from '@/components/PecProductCard.vue'
export default {
  props: [
    'productArray',
    'to',
    'breadcrumbs',
    'color',
    'isLogin',
    'isVerified',
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
