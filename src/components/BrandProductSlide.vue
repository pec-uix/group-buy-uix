<template>
  <div class="splide pa-2" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="(item, index) in productArray"
          :key="index"
          style="position: relative"
        >
          <v-overlay v-if="item.expired == 'Y'" absolute style="z-index: 2">
          </v-overlay>
          <div
            class="d-flex flex-column align-center text-decoration-none cursor-pointer"
            @click.prevent="handleProductClick(item)"
          >
            <img width="150px" :src="item.img_url" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Splide from '@splidejs/splide'

export default {
  props: ['productArray'],
  mounted() {
    this.splide = new Splide(this.$el, {
      pagination: false,
      gap: '25px',
      trimSpace: 'move',
      fixedWidth: '190px',
      // autoWidth: true,
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
    handleProductClick(product) {
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: product.product_id,
          current_path: this.$route.path,
          previous_path: window.previousUrl,
          section_name: 'ga-follow-list-brand',
          add_from: '',
        })
      )
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'ga-follow-list-brand',
        content_id: product.product_id,
      })
      this.$router.push(`/product/${product.product_id}`)
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
