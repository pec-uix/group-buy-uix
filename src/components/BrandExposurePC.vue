<template>
  <div class="splide py-2" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="product in productArray"
          :key="product.product_id"
          :data-splide-interval="1000 * carouselTime"
        >
          <pec-product-card
            :product="product"
            :hide-detail="true"
            :to="`/product/${product.product_id}`"
            :is-login="isLogin"
            :is-verified="isVerified"
          ></pec-product-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PecProductCard from '@/components/PecProductCard.vue'
import Splide from '@splidejs/splide'
export default {
  props: [
    'productArray',
    'carouselTime',
    'to',
    'breadcrumbs',
    'isLogin',
    'isVerified',
  ],
  components: {
    PecProductCard,
  },
  mounted() {
    this.splide = new Splide(this.$el, {
      gap: '8px',
      breakpoints: {},
      perPage: 3,
      perMove: 1,
      rewind: true,
      autoplay: true,
      // interval: 3000,
      pauseOnHover: true,
      arrows: false,
      pagination: false,
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
