<template>
  <div>
    <v-dialog
      v-model="dialog"
      :overlay-opacity="0.8"
      content-class="overflow-unset dialog-content-overflow-visible"
      max-width="min(800px, 80vh)"
      persistent
      eager
      :transition="false"
    >
      <!-- <v-btn
        v-if="dialog"
        outlined
        color="white"
        icon
        elevation="0"
        style="z-index: 20"
        id="pop-up-close"
        class="pop-up-close"
        @click="closePopUp"
      >
        <background-svg
          backgroungUrl="/close.svg"
          width="20px"
          height="20px"
          color="#fff"
        ></background-svg>
      </v-btn> -->
      <!-- <v-img
        class="white--text text-h4 pop-up-content"
        style="cursor: pointer"
        max-width="min(800px, 80vh)"
        id="pop-up-content"
        :aspect-ratio="1 / 1"
        :src="popUpImgUrl"
        :data-pop-up-id="popUpId"
        :data-pop-up-name="popUpName"
        @click="popUpClickHandler"
        @load="onImageLoad"
      >
      </v-img> -->
      <v-carousel
        v-if="popup_banner_array.length"
        height="auto"
        hide-delimiter-background
        v-model="popup_carousel"
        :cycle="true"
        :interval="popupInterval"
      >
        <v-carousel-item
          class="carousell"
          v-for="banner in popup_banner_array"
          :key="banner.id"
          eager
        >
          <v-img
            max-width="min(800px, 80vh)"
            :aspect-ratio="1 / 1"
            :src="banner.img_url_mobile"
            @load="onImageLoad()"
            @click="popUpClickHandler(banner.router_to)"
            eager
            class="d-md-none"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-img
            max-width="min(800px, 80vh)"
            :aspect-ratio="1 / 1"
            :src="banner.img_url_pc"
            @load="onImageLoad()"
            @click="popUpClickHandler(banner.router_to)"
            eager
            class="d-none d-md-flex"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-carousel-item>
      </v-carousel>
      <v-btn
        v-if="popup_banner_array.length"
        class="flex-grow-1 mt-4"
        color="primary"
        height="48"
        variant="tonal"
        @click="closePopUp"
      >
        關閉
      </v-btn>
    </v-dialog>
    <v-overlay v-if="isLoading" z-index="2000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <template v-else>
      <div v-if="isLogin">
        <div
          v-if="
            Object.entries(membershipInfo).length &&
            Object.entries(userInfo).length
          "
        >
          <pec-info-dashbord
            :isLogin="isLogin"
            :userInfo="userInfo"
            :memberShipInfo="membershipInfo"
          ></pec-info-dashbord>
        </div>
        <v-row v-else dense class="mx-2 mt-2 mt-md-9 mb-0 mb-md-3 mb-md-4">
          <v-col
            cols="6"
            v-for="(item, i) in 4"
            :key="`mobile-${i}`"
            class="d-flex d-md-none"
          >
            <v-skeleton-loader
              type="image"
              width="100%"
              height="98"
            ></v-skeleton-loader>
          </v-col>

          <v-col
            cols="3"
            v-for="(item, i) in 4"
            :key="`pc-${i}`"
            class="d-none d-md-flex"
          >
            <v-skeleton-loader
              type="image"
              width="100%"
              height="130"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </div>

      <v-card
        class="mb-4 mt-4 d-none d-md-block"
        v-if="
          product_array_24hr.length &&
          $dayjs().isSameOrAfter('2025-05-27', 'day')
        "
      >
        <pec-product-group-header-type-a
          name="24小時出貨專區"
          color="secondary"
          to="/activity/24HRDelivery"
        ></pec-product-group-header-type-a>
        <pec-product-group-type-a
          color="secondary"
          :product-array="product_array_24hr"
          :breadcrumbs="[
            {
              text: '首頁',
              disabled: false,
              to: '/',
            },
            {
              text: '24小時出貨專區',
              to: `/activity/24HRDelivery`,
            },
          ]"
          to="/activity/24HRDelivery"
          :is-login="isLogin"
          :is-verified="isVerified"
          :className="'ga-home-24-go'"
          :section-name="'ga-home-24-go'"
        >
        </pec-product-group-type-a>
      </v-card>

      <v-card
        class="mb-4 d-none d-md-block"
        :class="!isLogin ? 'mt-4' : ''"
        v-if="product_array_flash_sale.length"
      >
        <div v-if="product_array_flash_sale.length >= 4">
          <pec-product-group-header-type-b
            :show-emoji="true"
            name="爆品限時購"
            background-image="linear-gradient(90deg, #ff0000 0%, #ff6868 70%)"
            to="/flash-sale"
          ></pec-product-group-header-type-b>
          <pec-product-group-type-a
            :className="'ga-home-hot-soon'"
            :eager="true"
            :set-border="false"
            color="primary"
            :product-array="product_array_flash_sale"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '爆品限時購',
                to: `/flash-sale`,
              },
            ]"
            to="/flash-sale"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-hot-soon'"
          >
          </pec-product-group-type-a>
        </div>
        <div v-else>
          <pec-product-group-header-type-b
            :show-emoji="true"
            name="爆品限時購"
            background-image="linear-gradient(90deg, #ff0000 0%, #ff6868 70%)"
            to="/flash-sale"
          ></pec-product-group-header-type-b>
          <pec-product-group-type-b
            :className="'ga-home-hot-soon'"
            :eager="true"
            :set-border="false"
            :product-array="product_array_flash_sale"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '爆品限時購',
                to: `/flash-sale`,
              },
            ]"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-hot-soon'"
          >
          </pec-product-group-type-b>
        </div>
      </v-card>

      <v-card
        class="mt-4 elevation-0 d-none d-md-block"
        v-if="
          isLogin &&
          productRecommendPurchaseArray.length > 0 &&
          ($dayjs().isSameOrAfter('2025-09-08', 'day') ||
            $dayjs().isSameOrBefore('2025-08-10', 'day'))
        "
      >
        <div class="d-flex px-2 pt-4 pb-4">
          <div class="d-flex align-center" style="flex: 1">
            <div
              class="d-none d-md-block"
              style="background-color: #c6c6c6; height: 3px; flex: 1"
            ></div>
            <h6
              class="text-h6 font-weight-bold text-left text-md-center personalized-recommendation-title"
            >
              專屬推薦
            </h6>
            <div class="personalized-recommendation-line"></div>
          </div>

          <v-btn
            class="more-btn white--text ml-2 elevation-0 rounded px-1 font-weight-bold"
            style="height: 32px; font-size: 16px; padding-bottom: 2px"
            tonal
            :to="'/personalized-recommendation?type=home'"
            color="#ea7d08"
            >查看更多</v-btn
          >
        </div>
        <pec-product-group-type-c
          color="secondary"
          :className="`ga-home-recommend`"
          :product-array="productRecommendPurchaseArray"
          :breadcrumbs="[
            {
              text: '首頁',
              disabled: false,
              to: '/',
            },
            {
              text: '專屬推薦',
              to: `/personalized-recommendation?type=home`,
            },
          ]"
          to="/personalized-recommendation"
          :is-login="isLogin"
          :is-verified="isVerified"
          :section-name="`ga-home-recommend`"
        >
        </pec-product-group-type-c>
      </v-card>

      <v-card
        class="mb-4 d-none d-md-block"
        v-if="
          product_array_pudu.length &&
          $dayjs().isSameOrAfter('2025-08-11', 'day') &&
          $dayjs().isSameOrBefore('2025-09-07', 'day')
        "
      >
        <pec-product-group-header-type-a
          name="中元普渡找UNI"
          color="secondary"
          to="/activity/2022-0513-1"
        ></pec-product-group-header-type-a>
        <pec-product-group-type-a
          :className="'ga-home-ghost'"
          color="secondary"
          :product-array="product_array_pudu"
          :breadcrumbs="[
            {
              text: '首頁',
              disabled: false,
              to: '/',
            },
            {
              text: '中元普渡找UNI',
              to: `/activity/2022-0513-1`,
            },
          ]"
          to="/activity/2022-0513-1"
          :is-login="isLogin"
          :is-verified="isVerified"
          :section-name="'ga-home-ghost'"
        >
        </pec-product-group-type-a>
      </v-card>

      <v-card class="elevation-0" style="border: 0">
        <category-slide></category-slide>
      </v-card>
      <div class="banner" :style="{ color: bannerColor }">
        <v-carousel
          v-if="banner_array.length"
          height="auto"
          :hide-delimiters="!!banner_array[carousel].youtube_id"
          hide-delimiter-background
          v-model="carousel"
          :cycle="cycle"
          :interval="interval"
        >
          <v-carousel-item
            class="carousell"
            v-for="(banner, i) in banner_array"
            :key="banner.id"
            :eager="i < 3"
          >
            <div
              @click.stop.prevent="
                clickBannerTo(
                  banner.picks ? banner.picks : banner.router_to,
                  banner
                )
              "
            >
              <v-img
                :eager="i < 3"
                class="d-md-none white--text text-h4"
                :aspect-ratio="16 / 9"
                width="100%"
                :src="banner.img_url_mobile"
              >
              </v-img>
              <v-img
                :eager="i < 3"
                class="d-none d-md-flex white--text text-h4"
                :aspect-ratio="24 / 9"
                width="100%"
                :src="banner.img_url_pc"
              >
              </v-img>
            </div>
          </v-carousel-item>
        </v-carousel>
      </div>

      <v-card
        class="mb-4 mt-4 d-block d-md-none"
        v-if="
          product_array_24hr.length &&
          $dayjs().isSameOrAfter('2025-05-27', 'day')
        "
      >
        <pec-product-group-header-type-a
          name="24小時出貨專區"
          color="secondary"
          to="/activity/24HRDelivery"
        ></pec-product-group-header-type-a>
        <pec-product-group-type-a
          color="secondary"
          :product-array="product_array_24hr"
          :breadcrumbs="[
            {
              text: '首頁',
              disabled: false,
              to: '/',
            },
            {
              text: '24小時出貨專區',
              to: `/activity/24HRDelivery`,
            },
          ]"
          to="/activity/24HRDelivery"
          :is-login="isLogin"
          :is-verified="isVerified"
          :className="'ga-home-24-go'"
          :section-name="'ga-home-24-go'"
        >
        </pec-product-group-type-a>
      </v-card>

      <v-card
        class="mb-4 d-block d-md-none mt-4"
        v-if="product_array_flash_sale.length"
      >
        <div v-if="product_array_flash_sale.length > 1">
          <pec-product-group-header-type-b
            :show-emoji="true"
            name="爆品限時購"
            background-image="linear-gradient(90deg, #ff0000 0%, #ff6868 70%)"
            to="/flash-sale"
          ></pec-product-group-header-type-b>
          <pec-product-group-type-a
            :className="'ga-home-hot-soon'"
            :eager="true"
            :set-border="false"
            color="primary"
            :product-array="product_array_flash_sale"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '爆品限時購',
                to: `/flash-sale`,
              },
            ]"
            to="/flash-sale"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-hot-soon'"
          >
          </pec-product-group-type-a>
        </div>
        <div v-else class="mt-4">
          <pec-product-group-header-type-b
            :show-emoji="true"
            name="爆品限時購"
            background-image="linear-gradient(90deg, #ff0000 0%, #ff6868 70%)"
            to="/flash-sale"
          ></pec-product-group-header-type-b>
          <pec-product-group-type-b
            :className="'ga-home-hot-soon'"
            :eager="true"
            :set-border="false"
            :product-array="product_array_flash_sale"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '爆品限時購',
                to: `/flash-sale`,
              },
            ]"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-hot-soon'"
          >
          </pec-product-group-type-b>
        </div>
      </v-card>

      <v-card
        class="mt-4 elevation-0 d-block d-md-none"
        v-if="
          isLogin &&
          productRecommendPurchaseArray.length > 0 &&
          ($dayjs().isSameOrAfter('2025-09-08', 'day') ||
            $dayjs().isSameOrBefore('2025-08-10', 'day'))
        "
      >
        <div class="d-flex px-2 pt-4 pb-4">
          <div class="d-flex align-center" style="flex: 1">
            <div
              class="d-none d-md-block"
              style="background-color: #c6c6c6; height: 3px; flex: 1"
            ></div>
            <h6
              class="text-h6 font-weight-bold text-left text-md-center personalized-recommendation-title"
            >
              專屬推薦
            </h6>
            <div class="personalized-recommendation-line"></div>
          </div>

          <v-btn
            class="more-btn white--text ml-2 elevation-0 rounded px-2 font-weight-bold"
            style="height: 28px; font-size: 12px"
            tonal
            :to="'/personalized-recommendation?type=home'"
            color="#ea7d08"
            >查看更多</v-btn
          >
        </div>
        <pec-product-group-type-c
          color="secondary"
          :className="`ga-home-recommend`"
          :product-array="productRecommendPurchaseArray"
          :breadcrumbs="[
            {
              text: '首頁',
              disabled: false,
              to: '/',
            },
            {
              text: '專屬推薦',
              to: `/personalized-recommendation?type=home`,
            },
          ]"
          to="/personalized-recommendation"
          :is-login="isLogin"
          :is-verified="isVerified"
          :section-name="'ga-home-recommend'"
        >
        </pec-product-group-type-c>
      </v-card>

      <v-card
        class="mb-4 d-block d-md-none"
        v-if="
          product_array_pudu.length &&
          $dayjs().isSameOrAfter('2025-08-11', 'day') &&
          $dayjs().isSameOrBefore('2025-09-07', 'day')
        "
      >
        <pec-product-group-header-type-a
          name="中元普渡找UNI"
          color="secondary"
          to="/activity/2022-0513-1"
        ></pec-product-group-header-type-a>
        <pec-product-group-type-a
          :className="'ga-home-ghost'"
          color="secondary"
          :product-array="product_array_pudu"
          :breadcrumbs="[
            {
              text: '首頁',
              disabled: false,
              to: '/',
            },
            {
              text: '中元普渡找UNI',
              to: `/activity/2022-0513-1`,
            },
          ]"
          to="/activity/2022-0513-1"
          :is-login="isLogin"
          :is-verified="isVerified"
          :section-name="'ga-home-ghost'"
        >
        </pec-product-group-type-a>
      </v-card>

      <div
        v-intersect.once="fetchProduct"
        class="menu-list mt-6 d-flex justify-space-between"
        style="overflow-y: auto"
      >
        <router-link
          v-for="link in linkArray"
          class="d-flex flex-column align-center text-decoration-none primary--text px-2 ga-home-function"
          :key="link.id"
          :to="link.to"
        >
          <img class="mb-1 text-caption" width="70px" :src="link.src" />
          {{ link.name }}
        </router-link>
        <a
          class="d-flex flex-column align-center text-decoration-none primary--text px-2"
          @click="toggle"
        >
          <img
            class="mb-1 text-caption"
            width="70px"
            src="https://unilife.pec.com.tw/images/category-icon.png"
          />
          商品分類
        </a>
      </div>

      <section v-if="isFetchingProduct" class="mt-4">
        <div class="d-none d-lg-flex">
          <div class="flex-shrink-0 flex-grow-1">
            <div class="d-flex justify-space-between pt-1 pb-3 px-2">
              <v-skeleton-loader
                type="image"
                min-width="180"
                height="30"
              ></v-skeleton-loader>
              <v-skeleton-loader
                type="image"
                min-width="80"
                height="30"
              ></v-skeleton-loader>
            </div>
            <div
              class="d-flex justify-space-between py-1 px-2 type-a-skeleton"
              style="gap: 8px; overflow: auto"
            >
              <v-skeleton-loader
                v-for="(item, i) in 6"
                :key="i"
                type="image, list-item-three-line, heading, list-item"
                min-width="200"
                height="360"
              ></v-skeleton-loader>
            </div>
            <div class="d-flex justify-space-between mb-4 px-2">
              <v-skeleton-loader
                type="image"
                height="30"
                width="100%"
              ></v-skeleton-loader>
            </div>
          </div>
        </div>
        <div class="d-flex d-lg-none">
          <div class="mb-4" style="overflow-x: auto">
            <div class="d-flex justify-space-between pt-1 pb-3 px-2">
              <v-skeleton-loader
                type="image"
                min-width="180"
                height="30"
              ></v-skeleton-loader>
              <v-skeleton-loader
                type="image"
                min-width="80"
                height="30"
              ></v-skeleton-loader>
            </div>
            <div
              class="d-flex py-1 px-2 type-a-skeleton"
              style="overflow-x: auto; gap: 8px"
            >
              <v-skeleton-loader
                v-for="n in 6"
                :key="n"
                type="image, list-item-three-line, heading, list-item"
                min-width="200"
                height="360"
              />
            </div>
          </div>
        </div>
      </section>

      <div v-else>
        <!-- carousel 與活動圖片中間的連結列表(電腦版) 結束 -->
        <!-- 活動版塊 開始 -->
        <div
          v-if="homeBannerBGI"
          class="ma-2 mt-4 pa-2 rounded-lg"
          :style="{
            backgroundColor: homeBannerBGC,
          }"
        >
          <router-link :to="homeBannerRoute">
            <v-img :src="homeBannerBGI"></v-img>
          </router-link>
        </div>

        <!-- <div class="d-flex px-2 py-4">
          <h6 class="text-h6 pec-title-bl font-weight-bold secondary--text">
            推薦品牌
          </h6>
          <v-spacer></v-spacer>
          <v-btn
            class="more-btn ga-home-brand-group"
            color="secondary"
            depressed
            small
            to="/brand-group"
            >更多商品</v-btn
          >
        </div>
        <div
          v-if="brandArray.length"
          class="d-flex justify-space-between pa-1"
          style="overflow-y: auto"
        >
          <router-link
            v-for="link in brandArray"
            :key="link.id"
            class="d-flex flex-column align-center text-decoration-none primary--text ga-home-brand-group"
            :to="`${link.router_to ? link.router_to : '/'}`"
            :class="link.ga_class"
          >
            <img class="mb-1" width="110px" eager :src="link.img_url_home" />
          </router-link>
        </div>

        <div
          v-else
          class="d-flex justify-space-between py-1 px-2"
          style="overflow-y: auto; gap: 8px"
        >
          <v-skeleton-loader
            v-for="(item, i) in 6"
            :key="i"
            type="image"
            min-width="105"
            height="145"
          ></v-skeleton-loader>
        </div> -->

        <!-- <section v-if="product_trending_array.length" class="my-4">
          <div class="d-flex">
            <div
              style="
                font-size: 20px;
                font-weight: 700;
                color: #fff;
                background-color: #ea7d08;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding-left: 14px;
                padding-right: 14px;
                border-radius: 10px 0px 0px 10px;
              "
            >
              <v-icon color="white" size="28" class="mb-3 mt-6"
                >fa-regular fa-chess-queen</v-icon
              >
              <span style="writing-mode: vertical-lr; margin-left: -4px">
                熱 門 追 蹤
              </span>
            </div>
            <div
              class="py-5 pr-5 pl-9 d-flex"
              style="
                background-color: #feead5;
                gap: 14px;
                overflow-x: auto;
                border-radius: 0px 10px 10px 0px;
                flex-grow: 1;
              "
            >
              <router-link
                v-for="(item, index) in product_trending_array"
                :key="index"
                class="trending-tracker text-decoration-none cursor-pointer ga-home-hot-follow"
                :to="`/product/${item.product_id}`"
              >
                <div style="position: relative">
                  <div class="pec-show-rank">
                    <v-img
                      aspect-ratio="1"
                      :src="index < 5 ? '/flag-pink.png' : '/flag-gray.png'"
                      width="100%"
                      contain
                    >
                      {{ index + 1 }}
                    </v-img>
                  </div>
                  <v-img
                    aspect-ratio="1"
                    :src="item.img_url"
                    width="105px"
                    contain
                  ></v-img>
                </div>
                <div v-if="!isLogin" class="text-center mt-3">
                  <router-link
                    class="text-h5 primary--text"
                    :to="{
                      path: '/login',
                      query: { redirect: $route.fullPath },
                    }"
                  >
                    請先登入
                  </router-link>
                </div>
                <div v-else>
                  <div
                    class="text-center primary--text mt-3"
                    style="font-size: 24px; font-weight: 400"
                  >
                    ${{ item.max_discount_price?.toLocaleString() }}
                  </div>
                  <div
                    class="text-decoration-line-through text-center"
                    style="font-weight: 400"
                  >
                    原價${{ item.max_list_price?.toLocaleString() }}
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </section> -->

        <div v-if="$dayjs().isSameOrAfter('2025-08-26', 'day')">
          <v-card class="my-4" v-if="product_array_moon.length">
            <pec-product-group-header-type-a
              name="超人氣中秋禮盒"
              color="secondary"
              to="/activity/2022-0112-2"
            ></pec-product-group-header-type-a>
            <pec-product-group-type-a
              :eager="true"
              :className="`ga-home-moon`"
              color="secondary"
              :product-array="product_array_moon"
              :breadcrumbs="[
                {
                  text: '首頁',
                  disabled: false,
                  to: '/',
                },
                {
                  text: '超人氣中秋禮盒',
                  to: `/activity/2022-0112-2`,
                },
              ]"
              to="/activity/2022-0112-2"
              :is-login="isLogin"
              :is-verified="isVerified"
              :section-name="'ga-home-moon'"
            >
            </pec-product-group-type-a>
          </v-card>
        </div>
        <div v-else>
          <v-card class="my-4" v-if="product_array_uni.length">
            <pec-product-group-header-type-a
              name="統一生活麵專區"
              color="secondary"
              to="/activity/uni"
            ></pec-product-group-header-type-a>
            <pec-product-group-type-a
              :eager="true"
              :className="`ga-home-noodles`"
              color="secondary"
              :product-array="product_array_uni"
              :breadcrumbs="[
                {
                  text: '首頁',
                  disabled: false,
                  to: '/',
                },
                {
                  text: '統一生活麵專區',
                  to: `/activity/uni`,
                },
              ]"
              to="/activity/uni"
              :is-login="isLogin"
              :is-verified="isVerified"
              :section-name="'ga-home-noodles'"
            >
            </pec-product-group-type-a>
          </v-card>
        </div>

        <v-card class="mb-4" v-if="product_array_new.length">
          <pec-product-group-header-type-a
            name="新品上架"
            color="secondary"
            to="/new"
          ></pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-home-new-product'"
            color="secondary"
            :product-array="product_array_new"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '新品上架',
                to: `/new`,
              },
            ]"
            to="/new"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-new-product'"
          >
          </pec-product-group-type-a>
        </v-card>

        <v-card class="mb-4" v-if="product_array_special.length">
          <pec-product-group-header-type-a
            name="週週好給利"
            color="primary"
            to="/activity/special"
          ></pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-home-weekly-deals'"
            color="primary"
            :product-array="product_array_special"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '週週好給利',
                to: `/activity/special`,
              },
            ]"
            to="/activity/special"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-weekly-deals'"
          >
          </pec-product-group-type-a>
        </v-card>

        <v-card
          class="mb-4"
          v-if="
            product_array_iphone17.length &&
            $dayjs().isSameOrAfter('2025-09-12', 'day')
          "
        >
          <pec-product-group-header-type-a
            name="iPhone17"
            color="primary"
            to="/activity/iPhone17"
          ></pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-home-iphone17'"
            color="primary"
            :product-array="product_array_iphone17"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: 'iPhone17',
                to: `/activity/iPhone17`,
              },
            ]"
            to="/activity/iPhone17"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-iphone17'"
          >
          </pec-product-group-type-a>
        </v-card>

        <v-card class="mb-4" v-if="product_array_iphone16.length">
          <pec-product-group-header-type-a
            name="iPhone16"
            color="primary"
            to="/activity/iPhone16"
          ></pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-home-iphone'"
            color="primary"
            :product-array="product_array_iphone16"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: 'iPhone16',
                to: `/activity/iPhone16`,
              },
            ]"
            to="/activity/iPhone16"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-iphone'"
          >
          </pec-product-group-type-a>
        </v-card>
        <v-card class="mb-4" v-if="product_array_wine.length">
          <pec-product-group-header-type-a
            name="大人的飲品"
            color="primary"
            to="/activity/wine"
          ></pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-home-wine'"
            color="primary"
            :product-array="product_array_wine"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '酒品專區',
                to: `/activity/wine`,
              },
            ]"
            to="/activity/wine"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-wine'"
          >
          </pec-product-group-type-a>
        </v-card>

        <v-card class="mb-4" v-if="product_array_end_soon.length">
          <pec-product-group-header-type-a
            name="限時搶跟團"
            color="primary"
            to="/end-soon"
          ></pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-home-product-soon'"
            color="primary"
            :product-array="product_array_end_soon"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '限時搶跟團',
                to: `/end-soon`,
              },
            ]"
            to="/end-soon"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-product-soon'"
          >
          </pec-product-group-type-a>
        </v-card>

        <div v-intersect.once="fetchProductArrayAllCategory"></div>

        <v-card class="mb-4" v-if="product_array_399.length">
          <pec-product-group-header-type-a
            name="統一冷藏乳飲$399免運"
            color="primary"
            to="/activity/1110719"
          ></pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-home-uni-399'"
            color="primary"
            :product-array="product_array_399"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '統一冷藏乳飲$399免運',
                to: `/activity/1110719`,
              },
            ]"
            to="/activity/1110719"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-home-uni-399'"
          >
          </pec-product-group-type-a>
        </v-card>
      </div>

      <section class="mb-9 mt-9" v-if="isFetchingAllCategory">
        <div class="d-none d-sm-flex">
          <div class="d-flex" style="overflow-x: auto">
            <v-skeleton-loader
              type="image"
              min-width="200"
              height="390"
              class="category-skeleton-image"
            />
            <div
              class="d-flex py-1 px-2 ml-2 category-skeleton"
              style="overflow-x: auto; gap: 8px"
            >
              <v-skeleton-loader
                v-for="n in 6"
                :key="n"
                type="image, list-item-three-line, heading, list-item"
                min-width="200"
                height="360"
              />
            </div>
          </div>
        </div>
        <div class="d-flex d-sm-none">
          <div style="overflow-x: auto">
            <div class="d-flex justify-space-between mb-2">
              <v-skeleton-loader
                type="image"
                height="50"
                width="100%"
              ></v-skeleton-loader>
            </div>
            <div
              class="d-flex py-1 px-2 ml-2 category-skeleton"
              style="overflow-x: auto; gap: 8px"
            >
              <v-skeleton-loader
                v-for="n in 6"
                :key="n"
                type="image, list-item-three-line, heading, list-item"
                min-width="200"
                height="360"
              />
            </div>
            <div class="d-flex justify-space-between mt-2 px-2">
              <v-skeleton-loader
                type="image"
                height="30"
                width="100%"
              ></v-skeleton-loader>
            </div>
          </div>
        </div>
      </section>
      <div v-else>
        <div
          class="mb-9 mt-9"
          v-for="category in productArrayFilteredCategory"
          :key="category.category_id"
        >
          <div
            class="mb-2 white--text d-sm-none d-flex justify-space-between"
            :style="{ 'background-color': category.color }"
          >
            <div class="pa-4">{{ category.category_name }}</div>
            <img :src="category.img_url_home_small" height="56px" />
          </div>
          <div class="elevation-2">
            <div class="d-flex">
              <v-card
                :color="category.color"
                class="flex-shrink-0 d-none d-sm-flex flex-column"
                dark
                width="192px"
              >
                <div>
                  <h5
                    class="text-h5 pt-14 pl-6 pb-3"
                    style="width: 184px; border-bottom: white 2px solid"
                  >
                    {{ category.category_name }}
                  </h5>
                  <v-btn
                    depressed
                    color="white"
                    class="more-btn ml-6 mt-4"
                    :class="`${category.section_name}-more`"
                    :style="{ color: category.color }"
                    :to="{
                      name: 'Category',
                      params: {
                        categoryId: category.category_id,
                        categoryName: category.category_name,
                      },
                    }"
                    >更多商品</v-btn
                  >
                </div>
                <img :src="category.img_url_home_large" width="192px" />
              </v-card>
              <div
                class="d-flex pa-2 category-products"
                style="overflow-y: auto; cursor: drag"
              >
                <div class="scroller-container">
                  <RecycleScroller
                    class="scroller"
                    :items="category?.product_array || []"
                    :item-size="212"
                    key-field="product_id"
                    v-slot="{ item }"
                    direction="horizontal"
                  >
                    <div class="scroller-item">
                      <pec-product-card
                        class="elevation-0 mr-3 flex-shrink-0 flex-grow-0"
                        style="width: clamp(170px, 40vw, 200px); height: 100%"
                        :product="item"
                        :to="`/product/${item.product_id}`"
                        :is-login="isLogin"
                        :is-verified="isVerified"
                        :section-name="category.section_name"
                      ></pec-product-card>
                    </div>
                  </RecycleScroller>
                </div>
              </div>
            </div>
            <div class="pa-2 d-sm-none">
              <v-btn
                block
                outlined
                :color="category.color"
                dark
                class="more-btn button-more"
                :class="`${category.section_name}-more`"
                :to="{
                  name: 'Category',
                  params: {
                    categoryId: category.category_id,
                    categoryName: category.category_name,
                  },
                }"
                >更多商品</v-btn
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiAxios } from '@/api'
import PecProductCard from '@/components/PecProductCard.vue'
import PecProductGroupTypeA from '@/components/PecProductGroupTypeA.vue'
import PecProductGroupTypeB from '@/components/PecProductGroupTypeB.vue'
import PecProductGroupHeaderTypeA from '@/components/PecProductGroupHeaderTypeA.vue'
import PecProductGroupHeaderTypeB from '@/components/PecProductGroupHeaderTypeB.vue'
import CategorySlide from '@/components/CategorySlide.vue'
// import BackgroundSvg from '@/components/BackgroundSvg.vue'
import PecInfoDashbord from '@/components/PecInfoDashbord.vue'
import { nanoid } from 'nanoid'

// import BrandExposureMobile from '@/components/BrandExposureMobile.vue'
// import BrandExposurePC from '@/components/BrandExposurePC.vue'
// import Splide from '@splidejs/splide'

export default {
  components: {
    PecProductCard,
    // BackgroundSvg,
    PecProductGroupTypeA,
    PecProductGroupTypeB,
    PecProductGroupHeaderTypeA,
    PecProductGroupHeaderTypeB,
    CategorySlide,
    PecInfoDashbord,
    // BrandExposureMobile,
    // BrandExposurePC,
  },
  activated() {
    if (!this.last || new Date() - this.last > 1000 * 60 * 30) {
      this.fetchCritical()
        .then(() => {
          this.last = new Date()
        })
        .then(() => {
          this.fetchBannerAndPopUp()
          // setTimeout(() => {
          //   this.fetchProduct()
          // }, 200)
        })
    }
  },
  data() {
    return {
      isFetchingProduct: true,
      isFetchingAllCategory: false,
      isLoading: false,
      dialog: false,
      carousel: 0,
      cycle: true,
      popUpId: '',
      popUpImgUrl: '',
      popUpName: '',
      popUpRouterTo: '',
      popUpIdViewed: sessionStorage.pec_pop_up_id_viewed,
      banner_array: [
        {
          // id: 364,
          // img_url_pc: '/pc.jpg',
          // img_url_mobile: '/mobile.jpg',
          // background_color: '#020532',
          // pop_up_mark: 'N',
          // youtube_id: null,
          // router_to: '/wish',
        },
      ],
      linkArray: [
        {
          id: 0,
          to: '/brand-group',
          src: 'https://unilife.pec.com.tw/images/brand-group-icon.png',
          name: '品牌專館',
        },
        {
          id: 1,
          to: '/my-follow',
          src: 'https://unilife.pec.com.tw/images/track-icon.png',
          name: '追蹤清單',
        },
        {
          id: 2,
          to: '/activity/13ALL',
          src: 'https://unilife.pec.com.tw/images/light-icon.png',
          name: '熱銷3C',
        },
        {
          id: 3,
          to: '/hot',
          src: 'https://unilife.pec.com.tw/images/hot-icon.png',
          name: '熱門團購',
        },
        {
          id: 4,
          to: '/new',
          src: 'https://unilife.pec.com.tw/images/new-icon.png',
          name: '新品上架',
        },
        {
          id: 5,
          to: '/wish',
          src: 'https://unilife.pec.com.tw/images/wish-icon.png',
          name: '許願開團',
        },
        {
          id: 6,
          to: '/rebate',
          src: 'https://unilife.pec.com.tw/images/rebate-icon.png',
          name: '活動攻略',
        },
        {
          id: 7,
          to: '/profile',
          src: 'https://unilife.pec.com.tw/images/profile-icon.png',
          name: '會員資料',
        },
        {
          id: 8,
          to: '/my-order',
          src: 'https://unilife.pec.com.tw/images/my-order-icon.png',
          name: '我的訂單',
        },
      ],
      product_array_2025_new_year: [],
      product_array_new: [],
      product_array_hot: [],
      product_array_end_soon: [],
      product_array_wine: [],
      product_array_all_category: [],
      product_array_399: [],
      product_array_special: [],
      product_array_flash_sale: [],
      product_array_24hr: [],
      product_array_pudu: [],
      brandArray: [],
      productRecommendPurchaseArray: [],
      splide: null,
      product_trending_array: [],
      product_array_iphone16: [],
      product_array_iphone17: [],
      product_array_uni: [],
      product_array_moon: [],
      loadedImages: 0,
      popup_banner_array: [],
      popup_carousel: 0,
      sessionId: nanoid(20),
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('pec_bio_psw_wrong'))) {
      if (
        window.GroupJSInterface &&
        window.GroupJSInterface.showUpdateBiometricDialogInApp
      ) {
        window.GroupJSInterface.showUpdateBiometricDialogInApp()
        localStorage.setItem('pec_bio_psw_wrong', false)
      }
    }
  },
  computed: {
    ...mapState(['categoryArray', 'drawer', 'menu', 'userInfo']),
    ...mapGetters(['userId', 'isLogin', 'isVerified', 'membershipInfo']),
    bannerColor() {
      return this.banner_array[this.carousel]
        ? this.banner_array[this.carousel].background_color
        : 'grey'
    },
    interval() {
      return (this.banner_array[this.carousel].banner_duration || 1) * 1000
    },
    popupInterval() {
      return (
        (this.popup_banner_array[this.popup_carousel].banner_duration || 1) *
        1000
      )
    },
    productArrayFilteredCategory() {
      return this.product_array_all_category.filter(
        x => x.product_array.length > 0
      )
    },
    homeBannerBGI() {
      // if (
      //   this.$dayjs().isBetween(
      //     this.$dayjs('2024-04-30 00:00:00'),
      //     this.$dayjs('2024-05-31 23:59:59')
      //   )
      // ) {
      //   return 'https://unilife.pec.com.tw/images/2024-05-activity-special.png'
      // } else {
      //   return ''
      // }

      return ''
    },
    // homeBannerRoute() {
    //   if (this.product_array_special.length) {
    //     return '/activity/special'
    //   } else if (this.product_array_flash_sale.length) {
    //     return '/flash-sale'
    //   } else {
    //     return ''
    //   }
    // },
  },
  methods: {
    productRecommendPurchase() {
      if (
        this.$dayjs().isSameOrAfter('2025-09-08', 'day') ||
        this.$dayjs().isSameOrBefore('2025-08-10', 'day')
      ) {
        // 專屬推薦
        apiAxios({
          method: 'post',
          url: '/Product/GetProductRecommendPurchase?pageNo=1&pageSize=20&v=2&type=home',
          data: {
            storeType: [],
            paymentType: [],
            receiveType: [],
            brand: [],
            category: [],
            categorySecondary: [],
            categoryMinor: [],
            storeTypeFilter: '',
            paymentTypeFilter: '',
            receiveTypeFilter: '',
            minPrice: 0,
            maxPrice: 0,
            orderBy: {
              key: 'end_date',
              asc: true,
            },
          },
        }).then(res => {
          this.productRecommendPurchaseArray = res.result
          performance.mark('fetch-critical-end')
        })
      }
    },
    fetchCritical() {
      this.isLoading = true
      performance.mark('fetch-critical-start')

      return Promise.all([
        this.fetchBannerArray(),

        apiAxios({
          method: 'post',
          url: '/Product/GetProductArrayByActivityTypes?pageSize=20',
          params: { v: '2' },
          data: {
            activity_types: ['24HRDelivery', '2022-0513-1'],
          },
        }).then(res => {
          this.product_array_24hr = res.result['24HRDelivery']
          this.product_array_pudu = res.result['2022-0513-1']
        }),
        apiAxios({
          method: 'post',
          url: '/Product/GetProductExplosive',
          params: {
            pageNo: 1,
            pageSize: '20',
            totalPageSize: '200',
            v: '2',
          },
          data: {
            storeType: [],
            paymentType: [],
            receiveType: [],
            brand: [],
            category: [],
            categorySecondary: [],
            categoryMinor: [],
            minPrice: '0',
            maxPrice: '0',
            orderBy: { key: 'default_order_seq', asc: true },
          },
        }).then(res => {
          this.product_array_flash_sale = res.result
        }),
        this.productRecommendPurchase(),
      ]).finally(() => {
        this.isLoading = false
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            performance.mark('render-critical-end')
            this.sendMetricsToServer()
          })
        })
      })
    },
    fetchProductArrayAllCategory() {
      performance.mark('fetch-category-start')
      this.isFetchingAllCategory = true
      apiAxios({
        method: 'post',
        // 宅配以外所有專區
        url: '/Product/GetProductArrayAllCategory',
        params: { v: '2' },
      })
        .then(res => {
          performance.mark('fetch-category-end')
          this.product_array_all_category = res.result
        })
        .finally(() => {
          this.isFetchingAllCategory = false
          this.$nextTick(() => {
            requestAnimationFrame(() => {
              performance.mark('render-category-end')
              this.sendMetricsToServer()
            })
          })
        })
    },
    fetchProduct() {
      performance.mark('fetch-product-start')

      Promise.all([
        apiAxios({
          method: 'post',
          // 推薦品牌
          url: '/Brand/GetBrand',
        }).then(res => {
          this.brandArray = res.result
        }),

        // 熱門追蹤
        // apiAxios({
        //   method: 'post',
        //   url: '/Product/GetProductTrending?pageSize=20&v=2',
        //   data: {
        //     storeType: [],
        //     paymentType: [],
        //     receiveType: [],
        //     brand: [],
        //     category: [],
        //     categorySecondary: [],
        //     categoryMinor: [],
        //     minPrice: '0',
        //     maxPrice: '0',
        //     orderBy: {
        //       key: 'default_order_seq',
        //       asc: true,
        //     },
        //   },
        // }).then(res => {
        //   this.product_trending_array = res.result.product.sort(
        //     (a, b) => b.track_count - a.track_count
        //   )
        // }),

        apiAxios({
          method: 'post',
          // 新品上架
          url: '/Product/GetProductArrayNew?pageSize=20',
          params: { v: '2' },
        }).then(res => (this.product_array_new = res.result)),

        apiAxios({
          method: 'post',
          // 熱門團購
          url: '/Product/GetProductArrayHot?pageSize=20',
          params: { v: '2' },
        }).then(res => {
          this.product_array_hot = res.result
        }),

        apiAxios({
          method: 'post',
          // 限時搶跟團
          url: '/Product/GetProductArrayEndSoon?pageSize=20',
          params: { v: '2' },
          data: {},
        }).then(res => {
          this.product_array_end_soon = res.result
        }),

        apiAxios({
          method: 'post',
          url: '/Product/GetProductArrayByActivityTypes?pageSize=20',
          params: { v: '2' },
          data: {
            activity_types: [
              'uni',
              '2022-0112-2',
              'wine',
              '1110719',
              'special',
              'iPhone16',
              'iPhone17',
            ],
          },
        }).then(res => {
          performance.mark('fetch-product-end')
          this.product_array_uni = res.result.uni
          this.product_array_moon = res.result['2022-0112-2']
          this.product_array_wine = res.result.wine
          this.product_array_399 = res.result['1110719']
          this.product_array_special = res.result.special
          this.product_array_iphone16 = res.result.iPhone16
          this.product_array_iphone17 = res.result.iPhone17
        }),
      ])
        .then(() => {
          this.isFetchingProduct = false
        })
        .finally(() => {
          this.$nextTick(() => {
            requestAnimationFrame(() => {
              performance.mark('render-product-end')
              this.sendMetricsToServer()
            })
          })
        })
    },
    sendMetricsToServer() {
      const navigationEntry = performance.getEntriesByType('navigation')[0]

      const data = {
        user_agent: navigator.userAgent,
        emp_no: this.isLogin ? this.userId : '',
        session_id: this.sessionId,

        navigation_start_at: new Date(performance.timeOrigin),
        domain_lookup_start: navigationEntry.domainLookupStart,
        domain_lookup_end: navigationEntry.domainLookupEnd,
        connect_start: navigationEntry.connectStart,
        connect_end: navigationEntry.connectEnd,
        response_start: navigationEntry.responseStart,
        response_end: navigationEntry.responseEnd,
        dom_content_loaded_event_end: navigationEntry.domContentLoadedEventEnd,
        dom_complete: navigationEntry.domComplete,
        load_event_end: navigationEntry.loadEventEnd,

        fetch_critical_start:
          performance.getEntriesByName('fetch-critical-start')[0]?.startTime ||
          0,
        fetch_critical_end:
          performance.getEntriesByName('fetch-critical-end')[0]?.startTime || 0,
        render_critical_end:
          performance.getEntriesByName('render-critical-end')[0]?.startTime ||
          0,
        fetch_product_start:
          performance.getEntriesByName('fetch-product-start')[0]?.startTime ||
          0,
        fetch_product_end:
          performance.getEntriesByName('fetch-product-end')[0]?.startTime || 0,
        render_product_end:
          performance.getEntriesByName('render-product-end')[0]?.startTime || 0,
        fetch_category_start:
          performance.getEntriesByName('fetch-category-start')[0]?.startTime ||
          0,
        fetch_category_end:
          performance.getEntriesByName('fetch-category-end')[0]?.startTime || 0,
        render_category_end:
          performance.getEntriesByName('render-category-end')[0]?.startTime ||
          0,
      }

      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json',
      })
      navigator.sendBeacon(
        `${
          location.hostname === 'localhost'
            ? 'http://localhost:5000/api'
            : import.meta.env.VITE_ROOT_API
        }/Event/RecordPerformanceMetrics`,
        blob
      )
    },
    fetchBannerAndPopUp() {
      return Promise.all([this.fetchPopUpArray()])
    },
    onImageLoad() {
      this.$nextTick(() => {
        this.loadedImages++

        if (this.popUpId != this.popUpIdViewed) {
          this.dialog = true
        }
      })
    },
    popUpClickHandler(router_to) {
      this.popUpId = this.$dayjs().format('YYYYMMDD')
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'ga-home-overlay-click',
        content_id: router_to,
      })
      sessionStorage.pec_pop_up_id_viewed = this.popUpId
      this.popUpIdViewed = this.popUpId
      // 比對第一字是否為 /
      let regex = new RegExp('^/.*?')
      if (regex.test(router_to)) {
        this.$router.push(router_to)
      } else if (router_to) {
        if (window.GroupJSInterface) {
          let url = new URL(router_to)
          url.searchParams.set('external_browser', 2)
          window.location.href = url.href
        } else {
          window.open(router_to)
        }
      } else {
        // 避免 popUpRouterTo 不存在之情形
        this.closePopUp(false)
      }
    },
    closePopUp(isManual = true) {
      if (isManual) {
        this.popUpId = this.$dayjs().format('YYYYMMDD')
        this.$gtm.trackEvent({
          event: 'select_content',
          content_type: 'section-click',
          content_id: 'ga-home-overlay-close',
        })
        sessionStorage.pec_pop_up_id_viewed = this.popUpId
        this.popUpIdViewed = this.popUpId
      }
      this.dialog = false
    },
    fetchBannerArray() {
      return apiAxios({
        method: 'post',
        url: '/Banner/GetBannerArray',
        data: { banner_type: '6' },
      }).then(res => (this.banner_array = res.result))
    },
    fetchPopUpArray() {
      return apiAxios({
        method: 'post',
        // url: '/Banner/GetPopUpArray',
        url: '/Banner/GetBannerArray',
        data: { banner_type: '1' },
      }).then(res => {
        // if (res.result[0]) {
        //   this.popUpId = res.result[0].id
        //   this.popUpImgUrl = res.result[0].img_url_pc
        //   this.popUpName = res.result[0].banner_name || ''
        //   this.popUpRouterTo = res.result[0].router_to
        // }
        this.popUpId = this.$dayjs().format('YYYYMMDD')
        this.popup_banner_array = res.result
      })
    },
    toggle() {
      if (this.$vuetify.breakpoint.mobile) {
        this.$store.commit('setDrawer', !this.drawer)
      } else {
        this.$store.commit('setMenu', !this.menu)
      }
    },
    clickBannerTo(url, banner) {
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'ga-home-banner',
        content_id: banner.router_to,
      })
      // console.log(banner.router_to)
      if (url.startsWith('/')) {
        this.$router.push(url)
      } else {
        if (window.GroupJSInterface) {
          let newUrl = new URL(url)
          newUrl.searchParams.set('external_browser', 2)
          window.location.href = newUrl.href
        } else {
          window.open(url)
        }
      }
    },
  },
}
</script>
<style>
.dialog-content-overflow-visible {
  overflow: visible !important;
}
.overflow-unset {
  overflow: unset;
}
.type-a-skeleton .theme--light.v-skeleton-loader .v-skeleton-loader__heading,
.category-skeleton .theme--light.v-skeleton-loader .v-skeleton-loader__heading {
  width: 94% !important;
  border-radius: 5px;
  margin: 0 12px;
}
.category-skeleton-image .v-skeleton-loader__image {
  height: 100%;
}
.cursor-pointer {
  cursor: pointer;
}
.product-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pec-title-bl {
  border-left: 5px solid currentColor;
  padding-left: 8px;
}
.banner {
  position: relative;
}
.banner::before {
  content: '';
  background-color: currentColor;
  transition: color 300ms linear;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100vw;
  left: calc(50% - 50vw);
}
.pec-threshold {
  background-color: #38ada9;
}
.pec-youtube-container > div {
  position: absolute;
  width: 100%;
  /* height: calc(100% - 50px); */
  height: 100%;
}
.button-more {
  transition: all 1s ease-in-out;
}
.pec-page .brand .nb {
  background-color: #fff !important;
  background: #fff !important;
}
.pec-page .brand .nn {
  background-color: #fff !important;
  background: #fff !important;
}

.personalized-recommendation-line {
  background-color: #c6c6c6;
  height: 3px;
  flex: 1;
}
.personalized-recommendation-title {
  color: #ea7d08;
  font-size: 24px;
  flex: 0 0 177px;
}

.pec-show-rank {
  position: absolute;
  width: 27px;
  right: 4px;
  top: -3px;
  z-index: 1;
}
.pec-show-rank .v-image {
  text-align: center;
  color: #fff;
  font-size: 20px;
  line-height: 1.6;
}
.pec-show-rank .v-responsive__content {
  margin-top: -3px;
}

.category-products .scroller-container {
  height: 490px;
  overflow: hidden;
}
.category-products .scroller {
  height: 100%;
}
.category-products .scroller-item {
  height: 465px;
}
.category-products
  .vue-recycle-scroller.ready
  .vue-recycle-scroller__item-view {
  top: 6px;
  left: 6px;
}

@media (max-width: 960px) {
  .personalized-recommendation-line {
    background-color: #ea7d08;
  }
  .personalized-recommendation-title {
    color: #ea7d08;
    font-size: 24px;
    flex: 0 0 90px;
  }
  .info-dashboard-item-content {
    min-width: 80%;
  }
}
</style>
