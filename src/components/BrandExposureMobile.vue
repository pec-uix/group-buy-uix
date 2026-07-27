<template>
  <div class="splide pa-2 pb-4 mt-3" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="(brandExposure, i) in brandExposureArray"
          :key="i"
          :data-splide-interval="1000 * brandExposure.carousel_time"
        >
          <div class="w-100 d-flex">
            <div @click="$router.push(brandExposure.router_to)">
              <v-img
                :src="brandExposure.img_url_mobile"
                style="cursor: pointer"
              ></v-img>
            </div>
            <div
              class="d-flex flex-column ml-3 ml-sm-4 mr-1 mr-sm-2 flex-grow-1"
              style="height: 303px; overflow-y: auto"
            >
              <div class="splide" :class="`splide_vertical_${i + 1}`">
                <div class="splide__track">
                  <div class="splide__list">
                    <div
                      class="splide__slide"
                      v-for="product in brandExposure.product"
                      :key="product.product_id"
                    >
                      <div
                        class="d-flex py-1 pr-1"
                        @click="$router.push(`/product/${product.product_id}`)"
                      >
                        <v-img
                          :width="66"
                          :max-width="66"
                          aspect-ratio="1"
                          cover
                          :src="product.img_url"
                        />
                        <div class="ml-4 flex-grow-1 d-flex flex-column">
                          <div class="text-body-2 title">
                            {{ product.product_name }}
                          </div>
                          <div class="primary--text text-end mt-auto">
                            ${{ product.min_discount_price.toLocaleString() }}
                          </div>
                        </div>
                      </div>
                      <v-divider style="border-top-width: 2px"></v-divider>
                    </div>
                  </div>
                </div>
              </div>
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
  props: ['brandExposureArray'],
  mounted() {
    this.splide = new Splide(this.$el, {
      gap: '8px',
      breakpoints: {},
      perPage: 1,
      arrows: false,
    })
    this.splide.mount()

    this.$nextTick(() => {
      if (this.brandExposureArray.length) {
        this.verticalSplide = new Splide('.splide_vertical_1', {
          direction: 'ttb',
          height: '303px',
          perPage: 4,
          arrows: false,
          pagination: false,
          perMove: 1,
          rewind: true,
          autoplay: true,
          // interval: 3000,
          pauseOnHover: true,
        })
        this.verticalSplide.mount()
      }

      if (this.brandExposureArray.length > 1) {
        this.verticalSplide2 = new Splide('.splide_vertical_2', {
          direction: 'ttb',
          height: '303px',
          perPage: 4,
          arrows: false,
          pagination: false,
          perMove: 1,
          rewind: true,
          autoplay: true,
          // interval: 3000,
          pauseOnHover: true,
        })
        this.verticalSplide2.mount()
      }
    })
  },
  watch: {
    brandExposureArray() {
      this.remount()
    },
  },
  data() {
    return {
      splide: null,
      verticalSplide: null,
      verticalSplide2: null,
    }
  },
  methods: {
    remount() {
      this.$nextTick(() => {
        this.splide.destroy()
        this.splide.mount()
        if (this.brandExposureArray.length) {
          this.verticalSplide.destroy()
          this.verticalSplide.mount()
        }
        if (this.brandExposureArray.length > 1) {
          this.verticalSplide2.destroy()
          this.verticalSplide2.mount()
        }
      })
    },
  },
  beforeDestroy() {
    this.splide.destroy()
    if (this.brandExposureArray.length) {
      this.verticalSplide.destroy()
    }
    if (this.brandExposureArray.length > 1) {
      this.verticalSplide2.destroy()
    }
  },
}
</script>
<style scoped>
.splide >>> .splide__pagination__page.is-active {
  background: var(--v-accent-lighten2) !important;
}
.splide >>> .splide__pagination {
  bottom: -5px;
}
/* .splide >>> .splide__arrow svg {
  fill: var(--v-primary-base);
} */
.title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.5rem;
}
</style>
