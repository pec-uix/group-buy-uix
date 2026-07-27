<template>
  <div class="splide pa-2 pb-4" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="product in productArray"
          :key="product.product_id"
        >
          <pec-product-row
            :eager="eager && i < 6"
            :set-border="setBorder"
            :product="product"
            :is-login="isLogin"
            :is-verified="isVerified"
            :to="{
              name: 'Product',
              params: {
                productId: product.product_id,
                breadcrumbs: getBreadcrumbs(product.product_name),
              },
            }"
            :section-name="sectionName"
          ></pec-product-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PecProductRow from '@/components/PecProductRow.vue'
import Splide from '@splidejs/splide'
export default {
  props: [
    'productArray',
    'to',
    'breadcrumbs',
    'color',
    'isLogin',
    'isVerified',
    'setBorder',
    'sectionName',
    'eager',
  ],
  components: {
    PecProductRow,
  },
  mounted() {
    this.splide = new Splide(this.$el, {
      gap: '8px',
      breakpoints: {
        [this.$vuetify.breakpoint.thresholds.xs]: {
          perPage: 1,
        },
        [this.$vuetify.breakpoint.thresholds.sm]: {
          perPage: 2,
        },
        [this.$vuetify.breakpoint.thresholds.lg]: {
          perPage: 3,
        },
      },
      perPage: 3,
    })
    this.splide.mount()
  },
  watch: {
    productArray() {
      this.remount()
    },
  },
  data() {
    return {
      splide: null,
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
    remount() {
      this.$nextTick(() => {
        this.splide.destroy()
        this.splide.mount()
      })
    },
  },
  beforeDestroy() {
    this.splide.destroy()
  },
}
</script>
<style scoped>
.splide >>> .splide__pagination__page.is-active {
  background: var(--v-primary-base);
}

/* .splide >>> .splide__arrow svg {
  fill: var(--v-primary-base);
} */
</style>
