<template>
  <div class="splide" ref="splide">
    <div class="splide__track">
      <div class="splide__list ma-1" style="align-items: center">
        <div
          class="splide__slide"
          v-for="(item, index) in productArray"
          :key="item.product_id"
        >
          <v-card
            class="d-flex pa-2"
            :style="
              !$vuetify.breakpoint.mobile
                ? {
                    width: '410px',
                  }
                : {
                    width: '280px',
                  }
            "
          >
            <v-img
              :width="$vuetify.breakpoint.mobile ? 90 : 157"
              :max-width="$vuetify.breakpoint.mobile ? 90 : 157"
              :aspect-ratio="1"
              contain
              :src="item.img_url"
            ></v-img>
            <div class="ml-2 flex-grow-1">
              <div class="line-clamp" :ref="'card_' + index">
                <v-chip
                  v-if="addOn"
                  color="rgba(255, 229, 0, 1)"
                  class="flex-shrink-0"
                  small
                  style="white-space: nowrap; line-height: 24px"
                >
                  加價購
                </v-chip>
                <span class="font-weight-bold">
                  {{ item.product_name }}
                </span>
              </div>
              <div
                v-if="!$vuetify.breakpoint.mobile"
                class="mt-2 text-subtitle-2 d-flex justify-space-between align-end"
                style="white-space: nowrap"
                :ref="'criterion_' + index"
              >
                <div>
                  <span>
                    {{ addOn ? '團購價' : '原價' }}
                  </span>
                  <span>${{ item.max_list_price.toLocaleString() }}</span>
                </div>
                <div class="ml-2">
                  <span :class="addOn ? '' : 'primary--text'">
                    {{ addOn ? '加購價' : '下殺價格' }}
                  </span>
                  <span
                    class="primary--text text-h6"
                    style="line-height: 1.375rem !important"
                    >${{ item.min_discount_price.toLocaleString() }}</span
                  >
                </div>
              </div>
              <a
                class="text-decoration-none"
                :class="addOn ? 'cart-deals' : 'cart-picks'"
              >
                <v-btn
                  small
                  color="secondary"
                  elevation="0"
                  class="mt-1"
                  @click.stop="
                    () => {
                      $emit('moreSpcloff', index)
                    }
                  "
                >
                  {{ addOn ? '更多加購商品' : '推薦商品資訊' }}
                </v-btn>
              </a>
              <a
                class="text-decoration-none"
                :class="addOn ? 'cart-deals' : 'cart-picks'"
              >
                <v-btn
                  v-if="!$vuetify.breakpoint.mobile"
                  color="primary"
                  elevation="0"
                  class="mt-1"
                  block
                  @click="handleAddToCart(item)"
                >
                  放入購物車
                  <v-icon size="18">
                    fa-sharp fa-regular fa-cart-shopping
                  </v-icon>
                </v-btn>
              </a>
              <div
                v-if="$vuetify.breakpoint.mobile"
                class="mt-2 text-subtitle-2 d-flex justify-space-between align-center"
              >
                <div class="d-flex align-baseline">
                  {{ addOn ? '加購價' : '下殺價格' }}
                  <span
                    class="primary--text text-h6 ml-1"
                    style="line-height: unset !important"
                    >${{ item.min_discount_price.toLocaleString() }}</span
                  >
                </div>
                <a
                  class="text-decoration-none"
                  :class="addOn ? 'cart-deals' : 'cart-picks'"
                >
                  <v-icon
                    size="18"
                    color="primary"
                    class="cursor-pointer"
                    @click="handleAddToCart(item)"
                  >
                    fa-sharp fa-regular fa-cart-shopping
                  </v-icon>
                </a>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Splide from '@splidejs/splide'
export default {
  props: ['productArray', 'addOn', 'extraPurchaseTab'],
  mounted() {
    this.splide = new Splide(this.$el, {
      drag: 'free',
      pagination: false,
      autoWidth: true,
      gap: '12px',
      autoplay: true,
      interval: 3500,
      rewind: true,
      pauseOnHover: true,
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
    remount() {
      this.$nextTick(() => {
        this.splide.destroy()
        this.splide.mount()
      })
    },
    handleAddToCart(item) {
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type:
          this.extraPurchaseTab == 0
            ? 'ga-cart-recommend-upsell-entry'
            : 'ga-cart-recommend-product-entry',
        content_id: item.product_id,
      })
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: item.product_id,
          current_path: this.$route.path,
          previous_path: window.previousUrl,
          section_name:
            this.extraPurchaseTab == 0
              ? 'ga-cart-recommend-upsell-entry'
              : 'ga-cart-recommend-product-entry',
          add_from: 'cart-page-btn',
        })
      )
      this.$emit('showSheet', item)
    },
  },
  beforeDestroy() {
    this.splide.destroy()
  },
}
</script>
<style scoped>
.line-clamp {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.1rem;
}
</style>
