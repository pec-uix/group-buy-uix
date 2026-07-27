<template>
  <div class="splide" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div class="splide__slide">
          <div style="width: fit-content">
            <div class="text-center d-flex">
              <v-chip
                class="ma-2 text-subtitle-1 font-weight-bold cursor-pointer"
                color="white"
                text-color="primary"
                v-for="(item, index) in recommendHotArray"
                :key="index"
                @click="clickTagTo(item.product_id)"
              >
                {{ item.product_name }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Splide from '@splidejs/splide'

export default {
  props: {
    recommendHotArray: [],
  },
  mounted() {
    this.splide = new Splide(this.$el, {
      type: 'loop',
      drag: 'free',
      arrows: false,
      autoWidth: true,
      pagination: false,
    })
    this.splide.mount()
  },
  watch: {
    recommendHotArray() {
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
    clickTagTo(url) {
      this.$router.push(`/product/${url}`)
    },
  },
  beforeDestroy() {
    this.splide.destroy()
  },
}
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
