<template>
  <div>
    <div
      class="splide pa-2"
      role="group"
      v-show="!$vuetify.breakpoint.mobile"
      ref="splide"
    >
      <div class="splide__track">
        <ul class="splide__list">
          <li
            class="splide__slide"
            v-for="product in productArray"
            :key="product.product_id"
          >
            <div class="wrap ma-1">
              <pec-product-card
                :section-name="sectionName"
                :product="product"
                :to="{
                  name: 'Product',
                  params: {
                    productId: product.product_id,
                    breadcrumbs: breadcrumbs.slice(0).concat([
                      {
                        text: product.product_name,
                        disabled: false,
                      },
                    ]),
                  },
                }"
                :is-login="$store.getters['isLogin']"
                :is-verified="$store.getters['isVerified']"
                @handleClick="handleClick"
              ></pec-product-card>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="splide pa-2"
      role="group"
      v-show="$vuetify.breakpoint.mobile && !isCheckIn"
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
                class="pa-2 mb-2 rounded white text-decoration-none crusor-pointer"
                @click="splideHandleClick(product)"
              >
                <v-img
                  aspect-ratio="1"
                  :src="product.img_url"
                  width="100%"
                  class="w-100"
                  cover
                ></v-img>
                <div
                  class="mt-3 text-body-1 pec-product-card-title"
                  style="min-height: 48px"
                >
                  {{ product.product_name }}
                </div>
                <div>
                  <div
                    class="d-flex justify-end"
                    style="flex-wrap: wrap-reverse"
                  >
                    <span
                      v-if="
                        $store.getters['isLogin'] &&
                        $store.getters['isVerified']
                      "
                      class="d-flex text-h6 primary--text hide-text align-center ml-auto"
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
    <div
      class="splide pa-2"
      role="group"
      v-show="$vuetify.breakpoint.mobile && isCheckIn"
      ref="splideMobileRow"
    >
      <div class="splide__track">
        <ul class="splide__list">
          <li
            class="splide__slide"
            v-for="(chunk, index) in productMobileRowChunks"
            :key="index"
          >
            <div class="d-flex flex-column gap-4">
              <div
                v-for="product in chunk"
                :key="product.product_id"
                class="pa-2 mb-2 rounded white text-decoration-none crusor-pointer"
                @click="splideHandleClick(product)"
              >
                <div class="w-100 d-flex">
                  <v-img
                    aspect-ratio="1"
                    :src="product.img_url"
                    white="75"
                    max-width="75"
                    cover
                  ></v-img>
                  <div class="pl-4" style="flex: 1">
                    <div
                      class="pec-product-card-title"
                      style="font-size: 16px; min-height: 48px"
                    >
                      {{ product.product_name }}
                    </div>
                    <div>
                      <div
                        class="d-flex justify-end"
                        style="flex-wrap: wrap-reverse"
                      >
                        <span
                          v-if="
                            $store.getters['isLogin'] &&
                            $store.getters['isVerified']
                          "
                          class="d-flex text-h6 primary--text hide-text align-center ml-auto"
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
import PecProductCard from '@/components/PecProductCard.vue'
// import { create } from 'lodash'

export default {
  props: {
    isCheckIn: {
      type: Boolean,
      default: false,
    },
    productArray: {
      type: Array,
      default: () => [],
    },
    sectionName: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.splide = new Splide(this.$refs.splide, {
      gap: '8px',
      pagination: false,
      autoWidth: true,
      autoplay: true,
      interval: 3500,
      rewind: true,
      pauseOnHover: true,
    })
    this.splide.mount()

    if (!this.isCheckIn) {
      this.splideMobile = new Splide(this.$refs.splideMobile, {
        perPage: 2,
        gap: '8px',
        pagination: false,
        autoWidth: false,
        autoplay: true,
        interval: 3500,
        rewind: true,
        pauseOnHover: true,
      })
      this.splideMobile.mount()
    } else {
      this.splideMobileRow = new Splide(this.$refs.splideMobileRow, {
        perPage: 1, // 每頁顯示一個
        gap: '8px', // 每頁之間的間距（可選）
        pagination: false,
        autoWidth: false, // 關閉自動寬度，強制每頁固定一張
        autoplay: true, // 啟用自動播放
        interval: 3500,
        rewind: true,
        pauseOnHover: true,
      })
      this.splideMobileRow.mount()
    }
  },
  components: {
    PecProductCard,
  },
  created() {
    // if (this.isCheckIn) {
    //   this.getProductExplosive()
    // } else {
    //   this.getProductRecommendPurchase()
    // }
  },
  data() {
    return {
      splide: null,
      splideMobile: null,
      splideMobileRow: null,
      expansionPanels: null,
      // productArray: [],
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
    if (!this.isCheckIn) {
      if (this.splideMobile) {
        this.splideMobile.destroy()
      }
    } else {
      if (this.splideMobileRow) {
        this.splideMobileRow.destroy()
      }
    }
  },
  methods: {
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
    splideHandleClick(product) {
      console.log(product)
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id: this.sectionName,
      })
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: product.product_id,
          current_path: this.$route.path,
          previous_path: window.previousUrl,
          section_name: this.sectionName ? this.sectionName : '',
          add_from: '',
        })
      )
      this.$router.push(`/product/${product.product_id}`)
    },
  },
  computed: {
    productMobileChunks() {
      const chunkSize = 2
      const result = []
      for (let i = 0; i < this.productArray.length; i += chunkSize) {
        result.push(this.productArray.slice(i, i + chunkSize))
      }
      return result
    },
    productMobileRowChunks() {
      const chunkSize = 6
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
.wrap {
  width: 200px;
  max-width: 200px;
  display: block;
}
.crusor-pointer{
  cursor: pointer;
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
