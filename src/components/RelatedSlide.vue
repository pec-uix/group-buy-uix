<template>
  <div>
    <div
      class="splide"
      role="group"
      v-show="$vuetify.breakpoint.mobile"
      ref="splideMobile"
    >
      <div class="splide__track">
        <ul class="splide__list">
          <li
            class="splide__slide"
            v-for="(chunk, index) in productMobileChunks"
            :key="index"
          >
            <div class="d-flex flex-column gap-4">
              <div
                v-for="product in chunk"
                :key="product.product_id"
                class="pa-2 rounded white text-decoration-none cursor-pointer"
                @click="
                  clickTo(product.product_id, `/product/${product.product_id}`)
                "
              >
                <v-img
                  aspect-ratio="1"
                  :src="product.img_url"
                  width="100%"
                  class="w-100"
                  cover
                ></v-img>
                <!-- <div
                  class="mt-3 text-body-1 pec-product-card-title"
                  style="min-height: 48px"
                >
                  {{ product.product_name }}
                </div> -->
                <div>
                  <div
                    class="d-flex justify-center mt-3"
                    style="flex-wrap: wrap-reverse"
                  >
                    <span
                      v-if="
                        $store.getters['isLogin'] &&
                        $store.getters['isVerified']
                      "
                      class="d-flex text-h6 primary--text hide-text align-center"
                    >
                      <span class="hide-text">
                        {{ getPriceDisplay(product) }}
                      </span>
                    </span>
                    <router-link
                      v-else-if="!$store.getters['isLogin']"
                      class="text-h6 primary--text"
                      :to="{
                        path: '/login',
                        query: { redirect: $route.fullPath },
                      }"
                    >
                      請先登入
                    </router-link>
                    <router-link
                      v-else-if="!$store.getters['isVerified']"
                      class="text-h6 primary--text"
                      :to="{
                        path: '/login/auth',
                        query: { redirect: $route.fullPath },
                      }"
                    >
                      請先完成認證
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Splide from '@splidejs/splide'

export default {
  props: {
    productArray: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.splideMobile = new Splide(this.$refs.splideMobile, {
      gap: '8px',
      pagination: false,
      autoWidth: true,
      autoplay: true,
      interval: 3500,
      rewind: true,
      pauseOnHover: true,
      arrows: false,
    })
    this.splideMobile.mount()
  },
  created() {},
  data() {
    return {
      splide: null,
      splideMobile: null,
      splideMobileRow: null,
      expansionPanels: null,
      breadcrumbs: [],
    }
  },
  watch: {
    productArray() {
      this.remount()
    },
  },
  beforeDestroy() {
    if (this.splide) {
      this.splide.destroy()
    }
    if (this.splideMobile) {
      this.splideMobile.destroy()
    }
  },
  methods: {
    clickTo(productId, url) {
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: productId,
          current_path: this.$route.path,
          previous_path: window.previousUrl,
          section_name: 'ga-product-related',
          add_from: '',
        })
      )
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id: 'ga-product-related',
      })
      this.$router.push({ path: url })
    },
    getPriceDisplay(product) {
      let output = ''
      if (!product.min_discount_price || !product.max_discount_price) {
        output = '無法顯示價格'
      } else if (product.hide_price == 'Y') {
        output = '驚喜價'
      } else {
        output = `$${product.min_discount_price.toLocaleString()}`

        if (product.min_discount_price !== product.max_discount_price) {
          output += `~$${product.max_discount_price.toLocaleString()}`
        }
      }
      return output
    },
    remount() {
      this.$nextTick(() => {
        if (this.splide) {
          this.splide.destroy()
        }
        this.splide.mount()
        if (this.splideMobile) {
          this.splideMobile.destroy()
        }
        this.splideMobile.mount()
        if (this.splideMobileRow) {
          this.splideMobileRow.destroy()
        }
        this.splideMobileRow.mount()
      })
    },
    handleClick() {
      this.$emit('handleClick')
    },
  },
  computed: {
    productMobileChunks() {
      const chunkSize = 1
      const result = []
      for (let i = 0; i < this.productArray.length; i += chunkSize) {
        result.push(this.productArray.slice(i, i + chunkSize))
      }
      return result
    },
  },
}
</script>
<style scoped>
.hide-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.splide__slide {
  width: 100%;
  max-width: 105px !important;
}
.wrap {
  width: 200px;
  max-width: 200px;
  display: block;
}
.category-image-block {
  width: 64px;
  height: 64px;
  border: 1px solid #e1e1e1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
}
.panel-header-overflow {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  height: 36px;
  font-size: 16px;
}
.category-item {
  border: 2px solid var(--v-primary-base);
  border-radius: 20px;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pec-product-card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
:deep(.v-expansion-panel-content__wrap) {
  display: flex;
  flex-wrap: wrap;
}
@media (max-width: 360px) {
  .col-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>
