<template>
  <div class="splide" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="recommend in recommendArray"
          :key="recommend.id"
        >
          <v-card
            class="d-flex flex-column pa-3 justify-end"
            height="100%"
            width="100%"
            outlined
          >
            <div class="d-flex flex-grow-1 align-start">
              <v-img
                :src="recommend.img_url_array[0].img_url"
                aspect-ratio="1"
                class="flex-grow-0 mr-3"
                width="120px"
                contain
              >
              </v-img>
              <div>
                <h6 class="text-h6 primary--text">
                  {{ recommend.product_name }}
                </h6>
                <div class="grey--text">
                  許願日期：{{
                    $dayjs(recommend.creation_date).format('YYYY-MM-DD HH:mm')
                  }}
                </div>
                <div v-if="recommend.closed_date" class="grey--text">
                  結案日期：{{
                    recommend.closed_date
                      ? $dayjs(recommend.closed_date).format('YYYY-MM-DD HH:mm')
                      : ''
                  }}
                </div>
                <div class="mt-2" style="overflow-wrap: anywhere">
                  {{ recommend.product_desc }}
                </div>
              </div>
            </div>
            <div class="d-flex mt-2 align-center">
              <v-chip
                v-if="recommend.product_id"
                class="pr-4"
                color="primary"
                :to="`/product/${recommend.product_id}`"
              >
                前往購買
                <background-svg
                  class="mt-1 ml-2"
                  backgroungUrl="/touch_app.svg"
                  width="20px"
                  height="20px"
                  color="#fff"
                ></background-svg>
              </v-chip>
              <v-chip
                v-else
                :outlined="recommend.recommend_status != '2'"
                color="primary"
              >
                {{ recommend.recommend_status_name }}
              </v-chip>
              <v-spacer></v-spacer>
              <div class="d-flex align-center">
                <v-chip
                  :outlined="recommend.push_delete_mark != 'N'"
                  color="rgba(235, 111, 20, 1)"
                  class="mr-3"
                  :class="{ 'white--text': recommend.push_delete_mark == 'N' }"
                  @click="togglePush(recommend)"
                >
                  <i class="fa-regular fa-thumbs-up mr-1"></i>
                  {{
                    !recommend.push_delete_mark != 'N' ? '我也推薦' : '已推薦'
                  }}
                </v-chip>
                <span
                  class="text-body-1"
                  style="height: 23px; color: rgba(235, 111, 20, 1)"
                >
                  {{ recommend.push_count }}人推薦
                </span>
              </div>
              <!-- <v-btn
                color="primary"
                depressed
                :outlined="recommend.push_delete_mark !== 'N'"
                small
                @click="togglePush(recommend)"
              >
                <v-img
                  class="mr-2"
                  v-if="recommend.push_delete_mark !== 'N'"
                  src="/plus_one.svg"
                  eager
                  max-width="18"
                ></v-img>
                <background-svg
                  backgroungUrl="/thumb_up_off_alt.svg"
                  width="20px"
                  height="20px"
                  :color="
                    recommend.push_delete_mark == 'N' ? '#fff' : '#ca1f1d'
                  "
                ></background-svg>

                {{ recommend.push_count }}</v-btn
              > -->
            </div>
            <template v-if="recommend.recommend_status == '3'">
              <v-divider class="my-2"></v-divider>
              <v-alert dense type="warning" border="left" text class="mb-0">
                團購網回應: {{ recommend.supplement }}
              </v-alert>
            </template>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Splide from '@splidejs/splide'

export default {
  props: [
    'product',
    'to',
    'isLogin',
    'isVerified',
    'showGroupBuyNotification',
    'showSaleNotice',
    'showDelBtn',
    'showDelSelect',
    'isChoseAll',
    'hideTrack',
    'showExpired',
    'recommendArray',
    'userId',
  ],
  mounted() {
    this.splide = new Splide(this.$el, {
      perPage: 2,
      gap: '8px',
      pagination: false,
      breakpoints: {
        [this.$vuetify.breakpoint.thresholds.sm]: {
          perPage: 1,
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
    togglePush(recommend) {
      this.$emit('togglePush', recommend)
    },
  },
  beforeDestroy() {
    this.splide.destroy()
  },
}
</script>
