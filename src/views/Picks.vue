<template>
  <div v-scroll="onScroll">
    <v-overlay v-if="isLoading" z-index="2000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
    <v-tabs v-model="tab" centered color="primary">
      <!-- style="position: sticky; top: 100px; z-index: 10; background-color: #fff" -->
      <v-tabs-slider color="transparent"></v-tabs-slider>
      <v-tab
        v-for="(item, i) in tabLists.filter(e => !e.hide)"
        :key="item.id"
        :ripple="false"
        @click.prevent="scrollTo(`area-${i}`)"
      >
        <div
          :style="
            $vuetify.breakpoint.mobile
              ? { 'font-size': '16px', 'font-weight': 700 }
              : { 'font-size': '24px', 'font-weight': 400 }
          "
        >
          {{ item.banner_name }}
        </div>
      </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <section v-for="(item, i) in tabLists" :key="item.id">
      <div :id="`area-${i}`" class="mb-8 target-area" v-if="!item.hide">
        <div class="my-4 mx-2">
          <div>
            <div class="d-flex align-center" v-if="$vuetify.breakpoint.mobile">
              <div class="text-h6 secondary--text mr-2">
                {{ item.banner_name }}
              </div>
              <div class="mobile-line"></div>
              <v-btn
                v-if="item.banner_loaded"
                class="more-btn white--text ml-2 elevation-0 rounded px-1 font-weight-bold"
                style="height: 28px; font-size: 12px"
                tonal
                :to="item.router_to"
                color="secondary"
                >查看更多</v-btn
              >
            </div>
            <div
              class="secondary--text tab-item-title d-flex justify-space-between"
              v-else
            >
              <div>
                {{ item.banner_name }}
              </div>
              <v-btn
                v-if="item.banner_loaded"
                class="more-btn white--text ml-2 elevation-0 rounded px-1 font-weight-bold"
                style="height: 32px; font-size: 16px"
                tonal
                :to="item.router_to"
                color="secondary"
                >查看更多</v-btn
              >
            </div>
            <div class="mt-4" v-if="item.banner_loaded">
              <v-img
                v-if="$vuetify.breakpoint.mobile"
                :src="item.img_url_mobile"
                :aspect-ratio="1920 / 1080"
              />
              <v-img v-else :src="item.img_url_pc" :aspect-ratio="2560 / 960" />
            </div>
            <div class="mt-4" v-else>
              <v-skeleton-loader
                type="image"
                :class="
                  $vuetify.breakpoint.mobile
                    ? 'image-skeleton-loader-mobile'
                    : 'image-skeleton-loader'
                "
              ></v-skeleton-loader>
            </div>
            <div
              v-if="item.banner_loaded && item.products && item.products.length"
              class="d-flex pa-2 mt-4"
              style="overflow-y: auto; cursor: drag; height: 500px"
            >
              <div v-for="product in item.products" :key="product.product_id">
                <v-lazy min-width="170" style="height: 100%">
                  <pec-product-card
                    class="elevation-0 mr-3 flex-shrink-0 flex-grow-0"
                    style="width: clamp(170px, 40vw, 200px); height: 100%"
                    :product="product"
                    :to="`/product/${product.product_id}`"
                    :is-login="isLogin"
                    :is-verified="isVerified"
                  ></pec-product-card>
                </v-lazy>
              </div>
            </div>
            <div
              v-else
              class="d-flex pa-2 mt-4"
              style="overflow-y: auto; cursor: drag; height: 500px"
            >
              <div
                v-for="n in 3"
                :key="n"
                style="
                  width: clamp(170px, 40vw, 200px);
                  height: 100%;
                  min-width: 170px;
                "
                class="mr-3"
              >
                <v-skeleton-loader
                  type="image, article, list-item-three-line"
                ></v-skeleton-loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { apiAxios } from '@/api'
import { mapGetters } from 'vuex'
import PecProductCard from '@/components/PecProductCard.vue'

export default {
  components: { PecProductCard },
  data() {
    return {
      isLoading: false,
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '好康推薦',
          to: '/picks',
        },
      ],
      tab: null,
      tabLists: [],
      firstBannerDataLoaded: false,
    }
  },
  computed: {
    ...mapGetters(['userId', 'isLogin', 'isVerified']),
  },
  async mounted() {
    this.firstBannerDataLoaded = false
    await this.getBannerSimplify()

    if (this.$route.query?.id) {
      const tabIndex = this.tabLists.findIndex(
        e => e.id == +this.$route.query.id
      )
      if (tabIndex > 0) {
        this.tab = tabIndex
        this.$nextTick(() => {
          this.scrollTo(`area-${tabIndex}`)
        })
      }
      await this.getBannerPageArray(this.$route.query.id, tabIndex)
      // this.firstBannerDataLoaded = true
    } else {
      await this.getBannerPageArray(this.tabLists[0].id, 0)
    }
  },
  methods: {
    getBannerSimplify() {
      return apiAxios({
        method: 'post',
        url: '/Banner/GetBannerIdArray',
        data: {
          banner_type: 6,
        },
      }).then(res => {
        this.tabLists = res.result.map(e => {
          e.banner_loaded = false
          e.scroll_trigger_count = 0
          e.hide = false
          return e
        })
      })
    },
    getBannerPageArray(id, index) {
      return apiAxios({
        method: 'post',
        url: '/Banner/GetBannerPageArray',
        data: {
          id: id,
        },
      }).then(res => {
        if (res.result.length) {
          Object.assign(this.tabLists[index], ...res.result)
          this.tabLists[index].banner_loaded = true
          // this.tabLists[index].products = []
        } else {
          // 沒商品資料，直接在 dom 上面移除該區塊
          // this.tabLists.splice(index, 1)
        }
        this.firstBannerDataLoaded = true

        return apiAxios({
          method: 'post',
          url: '/Banner/GetBannerProductArray?pageSize=20',
          data: {
            id: id,
            router_to: res.result[0].router_to,
          },
        }).then(response => {
          this.tabLists[index].products = response.result

          if (!this.tabLists[index].products.length) {
            // this.tabLists.splice(index, 1)
            // console.log('index', index)
            this.tabLists[index].hide = true
          }

          this.$forceUpdate()
        })
      })
    },
    scrollTo(target) {
      window.scrollTo({
        top:
          document.getElementById(target).getBoundingClientRect().top +
          window.scrollY -
          20,
        behavior: 'smooth',
      })
    },
    onScroll(e) {
      const scrollPos = window.scrollY
      document.querySelectorAll('.target-area').forEach(areaElement => {
        const areaIdNumber = areaElement.id.match(/\d+/) // 提取 ID 中的數字部分
        this.isScrolledIntoView(areaElement, areaIdNumber)
        const areaTop = areaElement.getBoundingClientRect().top + scrollPos
        const areaBottom = areaTop + areaElement.clientHeight
        if (scrollPos >= areaTop - 300 && scrollPos <= areaBottom - 500) {
          if (areaIdNumber) {
            this.tab = +areaIdNumber[0]
          }
        }
      })
    },
    isScrolledIntoView(el, index) {
      let rect = el.getBoundingClientRect()
      let elemTop = rect.top
      let elemBottom = rect.bottom

      let isVisible = elemTop < window.innerHeight && elemBottom >= 0
      if (isVisible && this.firstBannerDataLoaded) {
        if (!this.tabLists[index[0]].banner_loaded) {
          this.tabLists[index[0]].scroll_trigger_count++
          if (this.tabLists[index[0]].scroll_trigger_count == 1) {
            this.getBannerPageArray(this.tabLists[index[0]].id, index[0])
          }
        }
      }
    },
  },
}
</script>
<style scoped>
.v-tab:not(:last-child)::after {
  content: '';
  position: absolute;
  background-color: black;
  width: 1px;
  height: 18px;
  top: 15px;
  right: -1px;
}
.v-tabs >>> .v-slide-group__prev,
.v-tabs >>> .v-slide-group__next {
  display: none !important;
}
.v-divider {
  border-color: #a8a8ab;
}
.tab-item-title {
  font-size: 24px;
  font-weight: 500;
  border-bottom: 4px solid var(--v-secondary-base);
}
.mobile-line {
  background-color: var(--v-secondary-base);
  height: 3px;
  flex: 1;
}
.image-skeleton-loader >>> .v-skeleton-loader__image {
  aspect-ratio: 2560 / 960;
  height: auto;
}
.image-skeleton-loader-mobile >>> .v-skeleton-loader__image {
  aspect-ratio: 1920 / 1080;
  height: auto;
}
</style>
