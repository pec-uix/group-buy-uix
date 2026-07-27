<template>
  <div class="splide pa-2 pb-4" role="group">
    <div class="splide__track mb-4">
      <div class="splide__list">
        <div class="splide__slide" v-for="(brand, i) in productArray" :key="i">
          <v-card class="pa-3" elevation="0"
            ><div class="d-flex mb-2 align-center" style="height: 60px">
              <router-link
                :to="`/brand-group/${brand.id}`"
                style="text-decoration: none"
              >
                <v-img
                  :src="brand.img_url"
                  class="my-2 mx-2 pec-brand-img"
                  cover
                ></v-img></router-link
              ><router-link
                :to="`/brand-group/${brand.id}`"
                style="text-decoration: none"
              >
                <div class="font-weight-bold ml-1" style="font-size: 18px">
                  {{ brand.title }}
                </div></router-link
              >
            </div>
            <div v-if="brand.product.length > 0">
              <div v-for="(product, j) in brand.product.slice(0, 5)" :key="j">
                <pec-product-row-small-b
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
                ></pec-product-row-small-b>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PecProductRowSmallB from '@/components/PecProductRowSmallB.vue'
import Splide from '@splidejs/splide'
export default {
  props: [
    'productArray',
    'to',
    'breadcrumbs',
    'color',
    'isLogin',
    'isVerified',
    'sectionName',
  ],
  components: {
    PecProductRowSmallB,
  },
  mounted() {
    this.splide = new Splide(this.$el, {
      gap: '8px',
      arrows: false,
      padding: { left: 0, right: '4rem' },
      breakpoints: {
        [this.$vuetify.breakpoint.thresholds.xs]: {
          perPage: 1,
        },
        [this.$vuetify.breakpoint.thresholds.sm]: {
          perPage: 1,
        },
        [this.$vuetify.breakpoint.thresholds.lg]: {
          perPage: 1,
        },
      },
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
.pec-brand-img {
  max-width: 60px;
}
.splide >>> .splide__pagination__page.is-active {
  background: var(--v-primary-base);
}

.splide__list .splide__slide {
  position: relative;
}

.splide__list .splide__slide::after {
  position: absolute;
  content: '';
  height: 100%;
  display: block;
  z-index: 1;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  top: 0%;
  left: 0px;
  right: -8px;
  pointer-events: none;
}

.splide__list .splide__slide:first-child:after {
  border-radius: 8px 0 0 8px;
  border-left: 1px solid #d9d9d9;
}

.splide__list .splide__slide:last-child:after {
  border-radius: 0 8px 8px 0;
  border-right: 1px solid #d9d9d9;
}

.splide .splide__pagination {
  bottom: -0.5em;
}
/* .splide >>> .splide__arrow svg {
  fill: var(--v-primary-base);
} */
</style>
