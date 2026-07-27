<template>
  <div class="splide" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="item in brandBannerArray"
          :key="item.id"
        >
          <div class="w-100">
            <v-img
              class="cursor-pointer"
              @click="clickBannerTo(item.router_to)"
              :src="item.img_url_pc"
              aspect-ratio=".705"
              max-width="180px"
            >
            </v-img>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Splide from '@splidejs/splide'

export default {
  props: ['brandBannerArray'],
  mounted() {
    this.splide = new Splide(this.$el, {
      perPage: 6,
      gap: '8px',
      pagination: false,
      padding: { right: '4rem' },
      breakpoints: {
        [this.$vuetify.breakpoint.thresholds.xs]: {
          perPage: 3,
          padding: { right: '3rem' },
          pagination: true,
          arrows: false,
          classes: {
            pagination: 'splide__pagination brand-group-pagination',
          },
        },
        [this.$vuetify.breakpoint.thresholds.sm]: {
          perPage: 4,
        },
        [this.$vuetify.breakpoint.thresholds.lg]: {
          perPage: 5,
        },
      },
    })
    this.splide.mount()
  },
  watch: {
    recommendArray() {
      this.remount()
    },
  },
  data() {
    return {
      splide: null,
      isLoading: false,
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
    clickBannerTo(url) {
      if (url.startsWith('/')) {
        this.$router.push(url)
      } else {
        if (window.GroupJSInterface) {
          let newUrl = new URL(url)
          newUrl.searchParams.set('external_browser', 2)
          window.location.href = newUrl.href
        } else {
          window.location.href = url
        }
      }
    },
  },
  beforeDestroy() {
    this.splide.destroy()
  },
}
</script>
<style scoped>
:deep(.brand-group-pagination) {
  bottom: -1.5em;
}
</style>
