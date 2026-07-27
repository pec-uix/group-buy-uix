<template>
  <div class="splide" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="(product, index) in productArray"
          :key="product.id"
        >
          <pec-product-card
            class="elevation-0 py-2 mx-1 mr-3"
            style="min-width: 170px; max-width: 200px"
            :product="product"
            :is-login="$store.getters['isLogin']"
            :is-verified="$store.getters['isVerified']"
            :to="{
              name: 'Product',
              params: {
                productId: product.product_id,
                breadcrumbs: getBreadcrumbs(product.product_name),
                class: className,
              },
            }"
            :hide-detail="true"
            :show-rank="index + 1"
            :section-name="sectionName"
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
  components: {
    PecProductCard,
  },
  props: ['productArray', 'className', 'sectionName'],
  mounted() {
    this.splide = new Splide(this.$el, {
      pagination: false,
      // gap: '18px',
      trimSpace: 'move',
      fixedWidth: '72px',
      autoWidth: true,
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
