<template>
  <v-container fluid class="mb-16">
    <!-- <pre>{{ product }}</pre> -->
    <v-row>
      <v-col cols="12" v-if="isProductLoading">
        <v-skeleton-loader
          class="mx-auto"
          max-width="600"
          type="card"
        ></v-skeleton-loader>
      </v-col>
      <template v-else>
        <v-col cols="12" class="pa-0">
          <v-breadcrumbs
            large
            :items="items"
            class="primary--text"
          ></v-breadcrumbs>
        </v-col>
        <v-col cols="12" md="4">
          <pec-image-gallery :items="product.img_url_array"></pec-image-gallery>
          <div class="d-none d-md-block mt-2">
            <div
              class="text-h6"
              v-if="
                product.activity_raiders_array &&
                product.activity_raiders_array.length
              "
            >
              <div
                v-for="(activity, index) in product.activity_raiders_array"
                :key="index"
              >
                <span class="primary--text red lighten-5 rounded px-2"
                  >活動</span
                >
                {{ activity.activity_name }}
                <router-link
                  :to="activity.releated_link"
                  class="text-decoration-none"
                >
                  <span class="text-button blue--text text--darken-2"
                    >前往查看</span
                  >
                </router-link>
              </div>
            </div>
          </div>
          <v-card
            class="mt-4 rounded-0 d-none d-md-block"
            v-if="isLogin && productCategoryMinorRanking.length > 0"
          >
            <pec-product-group-header-type-c
              name="相關商品"
              background-image="linear-gradient(180deg, #D86816 0%, rgba(216, 104, 22, 0.6) 24.48%, #CC5D0C 83.21%, rgba(204, 93, 12, 0) 100%)"
            ></pec-product-group-header-type-c>

            <div class="pt-1 pb-1">
              <div
                v-for="(item, index) in productCategoryMinorRanking"
                :key="index"
                class="text-decoration-none cursor-pointer"
                @click="clickTo(item.product_id, `/product/${item.product_id}`)"
              >
                <div class="d-flex py-1 px-2 mb-1" style="position: relative">
                  <div class="flag">
                    <svg
                      width="27"
                      height="28"
                      viewBox="0 0 27 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0H26.6966V21.7476L13.0146 28L0 21.7476V0Z"
                        fill="#CA1F1D"
                      />
                      <text
                        x="50%"
                        y="52%"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        font-size="16"
                        fill="white"
                        font-family="Arial, sans-serif"
                        font-weight="bold"
                      >
                        {{ index + 1 }}
                      </text>
                    </svg>
                  </div>
                  <div
                    class="mr-2"
                    style="flex: 1 0 80px; height: 80px; max-width: 80px"
                  >
                    <v-img
                      :src="item.img_url"
                      max-height="80"
                      max-width="80"
                    ></v-img>
                  </div>
                  <div
                    class="d-flex flex-column justify-space-between"
                    style="flex: 0 1 auto"
                  >
                    <div class="font-weight-bold" style="font-size: 12px">
                      {{ item.product_name }}
                    </div>
                    <div class="primary--text font-weight-bold">
                      ${{ item.min_discount_price }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card class="pa-2 pa-md-8 pb-11 rounded-0">
            <h6 class="text-h6 mb-3 pec-title-bl primary--text">
              {{ product.subtitle }}
            </h6>
            <h6 class="text-h6 mb-5">
              <v-chip
                v-if="product.is_spcloff_product == 'Y'"
                class="mb-2 mt-1 px-3 mr-2"
                style="font-size: 14px"
                color="#FFE500"
                small
                >加價購</v-chip
              >
              <a
                class="font-weight-bold"
                style="color: #bf2220"
                @click="toBrandGroup(product.brand_id)"
                >{{ product.brand_name }}</a
              >{{ product.product_name }}
            </h6>
            <!-- <div class="mt-5">
            <v-chip label color="primary">集氣拚成團</v-chip>
          </div> -->
            <div class="d-md-none">
              <!-- 原價與折扣相同時，僅顯示原價 -->
              <div
                v-if="
                  product.spec_array[0] &&
                  product.spec_array[0].list_price ==
                    product.spec_array[0].discount_price
                "
              >
                <p class="d-flex align-center justify-space-between flex-wrap">
                  <span class="d-flex align-center mt-4"
                    ><span class="text-h5">
                      原價${{
                        product.spec_array[0] &&
                        product.spec_array[0].list_price.toLocaleString()
                      }}
                    </span>
                    <v-btn
                      v-if="isLogin && isVerified"
                      depressed
                      class="ml-4 share-btn-mobile"
                      :class="{ 'tour-step-backdrop': isOpenTour }"
                      @click="share"
                    >
                      <background-svg
                        class="mt-1"
                        backgroungUrl="/share.svg"
                        width="18px"
                        height="18px"
                        color="#000"
                      ></background-svg>
                      分享 </v-btn
                    ><span
                      class="ml-4 thumb_up d-flex primary--text"
                      v-if="likeMark > 0 && isLogin && isVerified"
                      @click="scrollToComment"
                    >
                      <background-svg
                        class="mr-1"
                        backgroungUrl="/thumb_up_off_alt.svg"
                        width="20px"
                        height="20px"
                        color="#ca1f1d"
                      ></background-svg>
                      {{ likeMark }}
                    </span></span
                  >
                  <span class="d-flex align-center mt-4">
                    <span
                      v-if="isLogin && isVerified && product.expired == 'N'"
                      class="text-end"
                      style="
                        text-decoration: underline;
                        color: #001aff;
                        cursor: pointer;
                      "
                      @click="
                        dialogForProductNotice = true
                        productNoticeSuccess = null
                      "
                    >
                      賣貴通報
                    </span>
                  </span>
                </p>
                <p
                  v-if="product.gifts && isLogin && isVerified"
                  class="primary--text d-flex align-center mb-0"
                >
                  <span class="whitespace-nowrap">限定加贈：</span>
                  <span>{{ product.gifts }}</span>
                </p>
                <h6
                  class="text-h6 primary--text mb-3"
                  v-if="product.reward_exclude == 'Y'"
                >
                  ※本商品不可折抵折價券
                </h6>
                <!-- <h6
                  class="text-h6 primary--text mb-3"
                  v-if="!product.reward_amount_limit_ratio"
                >
                  ※特惠商品，不適用折價券
                </h6> -->
                <!-- <h6
                  v-else-if="product.reward_amount_limit_ratio != 1"
                  class="text-h6 primary--text mb-3"
                >
                  ※折價券折抵上限金額：{{
                    getRewardAmountLimitDisplay(product)
                  }}元
                </h6> -->
                <div class="d-flex align-center mb-3">
                  <span
                    v-if="isLogin && isVerified"
                    class="d-flex text-h5 primary--text hide-text align-center mr-2"
                  >
                    <v-btn
                      text
                      small
                      :color="`${trackProductStatus ? 'primary' : 'black'}`"
                      class="d-flex align-center px-1 text-subtitle-1"
                      @click.stop.prevent="
                        setProductTrack(product.item_main_id)
                      "
                    >
                      <i
                        class="fa-heart fa-xl mr-1"
                        :class="{
                          'fa-solid': trackProductStatus,
                          'fa-regular': !trackProductStatus,
                        }"
                      ></i
                      >{{ trackProductStatus ? '已追蹤' : '追蹤' }}
                    </v-btn>
                  </span>

                  <span class="pt-1 mr-2">{{ trackCount }}人追蹤此商品</span
                  ><v-btn
                    class="ml-1"
                    :outlined="!noticedStatus"
                    elevation="0"
                    small
                    color="secondary"
                    @click.stop.prevent="setSaleNotice(product.item_main_id)"
                  >
                    <i
                      class="fa-solid fa-volume mr-1"
                      style="padding-top: 1px"
                    ></i
                    >{{ noticedStatus ? '取消開團提醒' : '開團提醒我' }}
                  </v-btn>
                </div>
              </div>
              <!-- 原價與折扣不相同時，維持原來的 UI -->
              <div v-else>
                <div class="d-flex justify-space-between align-center mb-1">
                  <p class="text-body-2 text-decoration-line-through">
                    原價${{
                      product.spec_array[0] &&
                      product.spec_array[0].list_price.toLocaleString()
                    }}
                  </p>
                  <p
                    v-if="isLogin && isVerified && product.expired == 'N'"
                    class="mb-0"
                    style="
                      text-decoration: underline;
                      color: #001aff;
                      cursor: pointer;
                    "
                    @click="
                      dialogForProductNotice = true
                      productNoticeSuccess = null
                    "
                  >
                    賣貴通報
                  </p>
                </div>

                <template v-if="isLogin && isVerified">
                  <p class="primary--text d-flex align-center">
                    <span>下殺價格：</span>
                    <span v-if="product.hide_price == 'Y'" class="text-h5">
                      驚喜價
                    </span>
                    <span v-else class="text-h5">
                      {{ getPriceDisplay(product) }}
                    </span>
                    <v-btn
                      depressed
                      class="ml-4 share-btn-mobile"
                      :class="{ 'tour-step-backdrop': isOpenTour }"
                      @click="share"
                    >
                      <background-svg
                        class="mt-1"
                        backgroungUrl="/share.svg"
                        width="18px"
                        height="18px"
                        color="#000"
                      ></background-svg>
                      分享
                    </v-btn>
                    <span
                      class="ml-4 thumb_up d-flex"
                      v-if="likeMark > 0"
                      @click="scrollToComment"
                    >
                      <background-svg
                        class="mr-1"
                        backgroungUrl="/thumb_up_off_alt.svg"
                        width="20px"
                        height="20px"
                        color="#ca1f1d"
                      ></background-svg>
                      {{ likeMark }}
                    </span>
                  </p>

                  <p
                    v-if="product.gifts"
                    class="primary--text d-flex align-center mb-0"
                  >
                    <span class="whitespace-nowrap">限定加贈：</span>
                    <span>{{ product.gifts }}</span>
                  </p>
                  <h6
                    class="text-h6 primary--text mb-3"
                    v-if="product.reward_exclude == 'Y'"
                  >
                    ※本商品不可折抵折價券
                  </h6>
                  <!-- <h6
                    class="text-h6 primary--text mb-3"
                    v-if="!product.reward_amount_limit_ratio"
                  >
                    ※特惠商品，不適用折價券
                  </h6> -->
                  <!-- <h6
                    v-else-if="product.reward_amount_limit_ratio != 1"
                    class="text-h6 primary--text mb-3"
                  >
                    ※折價券折抵上限金額：{{
                      getRewardAmountLimitDisplay(product)
                    }}元
                  </h6> -->
                  <div class="d-flex align-center mb-3">
                    <span
                      v-if="isLogin && isVerified"
                      class="d-flex text-h5 primary--text hide-text align-center mr-2"
                    >
                      <v-btn
                        text
                        small
                        :color="`${trackProductStatus ? 'primary' : 'black'}`"
                        class="d-flex align-center px-1 text-subtitle-1"
                        @click.stop.prevent="
                          setProductTrack(product.item_main_id)
                        "
                      >
                        <i
                          class="fa-heart fa-xl mr-1"
                          :class="{
                            'fa-solid': trackProductStatus,
                            'fa-regular': !trackProductStatus,
                          }"
                        ></i
                        >{{ trackProductStatus ? '已追蹤' : '追蹤' }}
                      </v-btn> </span
                    ><span class="pt-1 mr-2">{{ trackCount }}人追蹤此商品</span
                    ><v-btn
                      class="ml-1"
                      :outlined="!noticedStatus"
                      elevation="0"
                      small
                      color="secondary"
                      @click.stop.prevent="setSaleNotice(product.item_main_id)"
                    >
                      <i
                        class="fa-solid fa-volume mr-1"
                        style="padding-top: 1px"
                      ></i
                      >{{ noticedStatus ? '取消開團提醒' : '開團提醒我' }}
                    </v-btn>
                  </div>
                  <!--<v-alert dense type="success">
                  請點擊上方分享按鈕分享商品賺取 OPEN POINT
                </v-alert>-->
                </template>
                <router-link
                  v-else-if="!isLogin"
                  class="text-h5 primary--text"
                  :to="{ path: '/login', query: { redirect: $route.fullPath } }"
                  >請先登入</router-link
                >
                <router-link
                  v-else-if="!isVerified"
                  class="text-h5 primary--text"
                  :to="{
                    path: '/login/auth',
                    query: { redirect: $route.fullPath },
                  }"
                  >請先完成認證</router-link
                >
              </div>

              <template
                v-if="product.num_price_array && product.num_price_array.length"
              >
                <v-divider class="mb-5"></v-divider>
                <div>
                  <div class="mb-2">分檻定價</div>
                  <table class="threshold">
                    <tbody>
                      <tr
                        v-for="record in product.num_price_array"
                        :key="record.num_price_id"
                      >
                        <td class="bl b">成團</td>
                        <td class="b">{{ record.num }}件</td>
                        <td class="b primary--text">下殺</td>
                        <td class="b br">
                          ${{ record.price.toLocaleString() }}
                        </td>
                        <td class="primary--text"></td>
                        <!-- 差2件解鎖更低價 -->
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>

              <v-divider
                class="my-5"
                v-if="
                  product.activity_raiders_array &&
                  product.activity_raiders_array.length
                "
              ></v-divider>
              <div
                class="text-h6"
                v-if="
                  product.activity_raiders_array &&
                  product.activity_raiders_array.length
                "
              >
                <div
                  v-for="(activity, index) in product.activity_raiders_array"
                  :key="index"
                >
                  <span class="primary--text red lighten-5 rounded px-2"
                    >活動</span
                  >
                  {{ activity.activity_name }}
                  <router-link
                    :to="activity.releated_link"
                    class="text-decoration-none"
                  >
                    <span class="text-button blue--text text--darken-2"
                      >前往查看</span
                    >
                  </router-link>
                </div>
              </div>
              <v-divider class="my-5"></v-divider>
            </div>
            <div class="primary--text text-body-2">
              <p>商品編號：{{ product.product_id }}</p>
              <!--<p>廠商名稱：{{ product.supplier }}</p>-->
              <p v-if="product.brand_id">
                品牌專區：<a
                  style="color: #000"
                  @click="toBrandGroup(product.brand_id)"
                  >{{ product.brand_name }}</a
                >
                <v-btn
                  v-if="isLogin && isVerified"
                  class="ml-1 pb-1 font-weight-bold"
                  text
                  :color="`${trackBrandStatus ? '#5C5B5B' : '#001AFF'}`"
                  @click.stop.prevent="setBrandTrack(product.brand_id)"
                >
                  {{ trackBrandStatus ? '已追蹤' : '追蹤' }}
                </v-btn>
              </p>
              <p>
                配送方式：{{
                  product.receive_type_array.map(x => x.text).join('、')
                }}
              </p>
              <p
                v-if="
                  product.receive_type_array.filter(x => x.value == '2').length
                "
              >
                運費資訊：{{ product.shipping_type }}
              </p>
              <div
                class="d-flex align-center"
                v-if="product.cart_group_id"
                @click="toCartGroup(product.cart_group_id)"
              >
                <span class="black--text">{{ product.group_name }}</span>
                <v-chip label link color="primary" class="ml-2"
                  >活動專區</v-chip
                >
                <background-svg
                  class="mt-1 ml-1"
                  backgroungUrl="/touch_app.svg"
                  width="30px"
                  height="30px"
                  color="#000"
                ></background-svg>
              </div>
            </div>
            <v-divider
              class="mt-5 mb-5 d-block d-md-none"
              v-if="isLogin && productCategoryMinorRanking.length > 0"
            ></v-divider>
            <div
              class="d-block d-md-none"
              v-if="isLogin && productCategoryMinorRanking.length > 0"
            >
              <div class="mb-2">相關商品：</div>
              <related-slide
                :product-array="productCategoryMinorRanking"
              ></related-slide>
              <!-- <router-link
                :to="`/product/${item.product_id}`"
                v-for="(item, index) in productCategoryMinorRanking"
                :key="index"
                class="d-flex justify-apsce-between text-decoration-none"
              >
                <div class="mb-2 ranking-mobile-title">
                  {{ item.product_name }}
                </div>
                <div class="primary--text ml-3">
                  ${{ item.min_discount_price.toLocaleString() }}
                </div>
              </router-link> -->
            </div>
            <v-divider class="my-5"></v-divider>
            <div class="pec-rich-content" v-html="product.content_clob"></div>
            <v-chip-group active-class="primary--text" column>
              <v-chip
                v-for="(tag, index) in product.tag_array"
                :key="index"
                @click="toTagGroup(tag)"
              >
                #{{ tag.tag_name }}
              </v-chip>
            </v-chip-group>
            <v-divider class="my-7"></v-divider>
            <div class="d-none d-md-block">
              <!-- 原價與折扣相同時，僅顯示原價 -->
              <div
                v-if="
                  product.spec_array[0] &&
                  product.spec_array[0].list_price ==
                    product.spec_array[0].discount_price
                "
              >
                <p class="d-flex align-center justify-space-between">
                  <span class="d-flex align-center">
                    <span class="text-h5">
                      原價${{
                        product.spec_array[0] &&
                        product.spec_array[0].list_price.toLocaleString()
                      }}
                    </span>
                    <v-btn
                      v-if="isLogin && isVerified"
                      depressed
                      class="ml-4 share-btn-pc"
                      :class="{ 'tour-step-backdrop': isOpenTour }"
                      @click="share"
                    >
                      <background-svg
                        class="mt-1"
                        backgroungUrl="/share.svg"
                        width="18px"
                        height="18px"
                        color="#000"
                      ></background-svg>
                      分享 </v-btn
                    ><span
                      class="ml-4 thumb_up d-flex primary--text"
                      v-if="likeMark > 0 && isLogin && isVerified"
                      @click="scrollToComment"
                    >
                      <background-svg
                        class="mr-1"
                        backgroungUrl="/thumb_up_off_alt.svg"
                        width="20px"
                        height="20px"
                        color="#ca1f1d"
                      ></background-svg>
                      {{ likeMark }}
                    </span>
                  </span>
                  <span class="d-flex">
                    <span
                      v-if="isLogin && isVerified && product.expired == 'N'"
                      class="text-end"
                      style="
                        text-decoration: underline;
                        color: #001aff;
                        cursor: pointer;
                      "
                      @click="
                        dialogForProductNotice = true
                        productNoticeSuccess = null
                      "
                    >
                      賣貴通報
                    </span>
                  </span>
                </p>
                <p
                  v-if="product.gifts && isLogin && isVerified"
                  class="primary--text d-flex align-center mb-0"
                >
                  <span class="whitespace-nowrap">限定加贈：</span>
                  <span>{{ product.gifts }}</span>
                </p>
                <h6
                  class="text-h6 primary--text mb-3"
                  v-if="product.reward_exclude == 'Y'"
                >
                  ※本商品不可折抵折價券
                </h6>
                <!-- <h6
                  class="text-h6 primary--text mb-3"
                  v-if="!product.reward_amount_limit_ratio"
                >
                  ※特惠商品，不適用折價券
                </h6> -->
                <!-- <h6
                  v-else-if="product.reward_amount_limit_ratio != 1"
                  class="text-h6 primary--text mb-3"
                >
                  ※折價券折抵上限金額：{{
                    getRewardAmountLimitDisplay(product)
                  }}元
                </h6> -->
              </div>
              <!-- 原價與折扣不相同時，維持原來的 UI -->
              <div v-else>
                <div class="d-flex justify-space-between mb-4">
                  <p class="text-body-2 text-decoration-line-through mb-0">
                    原價${{
                      product.spec_array[0] &&
                      product.spec_array[0].list_price.toLocaleString()
                    }}
                  </p>
                  <p
                    v-if="isLogin && isVerified && product.expired == 'N'"
                    class="mb-0"
                    style="
                      text-decoration: underline;
                      color: #001aff;
                      cursor: pointer;
                    "
                    @click="
                      dialogForProductNotice = true
                      productNoticeSuccess = null
                    "
                  >
                    賣貴通報
                  </p>
                </div>

                <template v-if="isLogin && isVerified">
                  <p class="primary--text d-flex align-center flex-wrap">
                    <span>下殺價格：</span>
                    <span v-if="product.hide_price == 'Y'" class="text-h5">
                      驚喜價
                    </span>
                    <span v-else class="text-h5">
                      {{ getPriceDisplay(product) }}
                    </span>
                    <v-btn
                      depressed
                      class="ml-4 share-btn-pc"
                      :class="{ 'tour-step-backdrop': isOpenTour }"
                      @click="share"
                    >
                      <background-svg
                        class="mt-1"
                        backgroungUrl="/share.svg"
                        width="18px"
                        height="18px"
                        color="#000"
                      ></background-svg>
                      分享
                    </v-btn>
                    <span
                      class="d-inline-block text-h6 primary--text pt-3"
                      v-if="product.reward_exclude == 'Y'"
                      style="width: 100%"
                    >
                      ※本商品不可折抵折價券
                    </span>
                    <!-- <span
                      class="d-inline-block text-h6 primary--text pt-3"
                      v-if="!product.reward_amount_limit_ratio"
                      style="width: 100%"
                    >
                      ※特惠商品，不適用折價券
                    </span> -->
                    <!-- <span
                      v-else-if="product.reward_amount_limit_ratio != 1"
                      class="d-inline-block text-h6 primary--text pt-3"
                      style="width: 100%"
                    >
                      ※折價券折抵上限金額：{{
                        getRewardAmountLimitDisplay(product)
                      }}元
                    </span> -->
                    <span
                      class="ml-4 thumb_up d-flex"
                      v-if="likeMark > 0"
                      @click="scrollToComment"
                    >
                      <background-svg
                        class="mr-1"
                        backgroungUrl="/thumb_up_off_alt.svg"
                        width="20px"
                        height="20px"
                        color="#ca1f1d"
                      ></background-svg>
                      {{ likeMark }}
                    </span>
                  </p>
                  <p
                    v-if="product.gifts"
                    class="primary--text d-flex align-center mb-0"
                  >
                    <span class="whitespace-nowrap">限定加贈：</span>
                    <span>{{ product.gifts }}</span>
                  </p>
                  <!--<v-alert dense type="success">
                  請點擊上方分享按鈕分享商品賺取 OPEN POINT
                </v-alert>-->
                </template>
                <router-link
                  v-else-if="!isLogin"
                  class="text-h5 primary--text"
                  :to="{ path: '/login', query: { redirect: $route.fullPath } }"
                  >請先登入</router-link
                >
                <router-link
                  v-else-if="!isVerified"
                  class="text-h5 primary--text"
                  :to="{
                    path: '/login/auth',
                    query: { redirect: $route.fullPath },
                  }"
                  >請先完成認證</router-link
                >
              </div>
              <div class="d-flex align-center mb-3">
                <span
                  v-if="isLogin && isVerified"
                  class="d-flex text-h5 primary--text hide-text align-center"
                >
                  <v-btn
                    text
                    small
                    :color="`${trackProductStatus ? 'primary' : 'black'}`"
                    class="d-flex align-center px-1 text-subtitle-1"
                    @click.stop.prevent="setProductTrack(product.item_main_id)"
                  >
                    <i
                      class="fa-heart fa-xl mr-1"
                      :class="{
                        'fa-solid': trackProductStatus,
                        'fa-regular': !trackProductStatus,
                      }"
                    ></i
                    >{{ trackProductStatus ? '已追蹤' : '追蹤' }}
                  </v-btn> </span
                ><span v-if="isLogin && isVerified" class="ml-2 pt-1"
                  >{{ trackCount }}人追蹤此商品</span
                ><v-btn
                  v-if="isLogin && isVerified"
                  class="ml-3"
                  :outlined="!noticedStatus"
                  elevation="0"
                  small
                  color="secondary"
                  @click.stop.prevent="setSaleNotice(product.item_main_id)"
                >
                  <i
                    class="fa-solid fa-volume mr-1"
                    style="padding-top: 1px"
                  ></i
                  >{{ noticedStatus ? '取消開團提醒' : '開團提醒我' }}
                </v-btn>
              </div>
              <div>
                <table class="threshold">
                  <tbody>
                    <tr
                      v-for="record in product.num_price_array"
                      :key="record.num_price_id"
                    >
                      <td class="bl b">成團</td>
                      <td class="b">{{ record.num }}件</td>
                      <td class="b primary--text">下殺</td>
                      <td class="b br">${{ record.price.toLocaleString() }}</td>
                      <td class="primary--text"></td>
                      <!-- 差2件解鎖更低價 -->
                    </tr>
                  </tbody>
                </table>
              </div>
              <v-divider class="my-7"></v-divider>
            </div>
            <table>
              <tbody>
                <tr>
                  <td class="pb-9">累積 / 成團件數：</td>
                  <td class="pl-5 pb-9">
                    <div v-if="product.hide_order_num == 'Y'">熱銷中</div>
                    <div v-else-if="!isLogin || !isVerified">
                      累積:{{
                        product.order_num_with_ratio + product.acc_order_num
                      }}件 成團:{{ product.goal_num }}件
                    </div>
                    <v-menu offset-y v-else>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          block
                          class="px-2"
                          color="white"
                          depressed
                          v-bind="attrs"
                          v-on="on"
                        >
                          累積:{{
                            product.order_num_with_ratio +
                            product.acc_order_num
                          }}件 成團:{{ product.goal_num }}
                          件
                          <background-svg
                            class="ml-1 mt-1"
                            backgroungUrl="/expand_more.svg"
                            width="14px"
                            height="14px"
                            color="#000"
                          ></background-svg>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="item in product.product_area_order_num"
                          :key="item.receive_area"
                          :disabled="
                            !$dayjs().isBetween(
                              $dayjs(product.start_date),
                              $dayjs(product.end_date)
                            ) || product.tb_status != null
                          "
                        >
                          <v-list-item-title
                            >{{ item.receive_area_name }}
                          </v-list-item-title>
                          <v-list-item-action>
                            {{ item.order_num_with_ratio }}
                          </v-list-item-action>
                        </v-list-item>
                        <v-list-item v-if="product.acc_order_num">
                          <v-list-item-title>已售出</v-list-item-title>
                          <v-list-item-action>
                            {{ product.acc_order_num }}
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                </tr>
                <tr v-if="showQuota">
                  <td class="pb-9">剩餘數量：</td>
                  <td class="pl-5 pb-9">尙餘{{ quota }}件</td>
                </tr>
                <tr v-if="hasReceiveType1">
                  <td class="pb-9">團購規則：</td>
                  <td class="pl-5 pb-9">
                    取貨廠區滿{{ product.goal_num }}件成團
                  </td>
                </tr>
                <tr>
                  <td class="pb-9" v-if="hasReceiveType2">促銷期間：</td>
                  <td class="pb-9" v-else>截止日：</td>
                  <td class="pl-5 pb-9">
                    <v-chip
                      v-if="new Date(product.start_date) > new Date()"
                      label
                      small
                      color="primary"
                      >即將開團</v-chip
                    >
                    <countdown
                      v-else-if="
                        $dayjs(product.end_date).diff($dayjs(), 'second') <
                          60 * 60 * 24 &&
                        0 < $dayjs(product.end_date).diff($dayjs(), 'second')
                      "
                      :end-date="product.end_date"
                    ></countdown>
                    <v-chip v-else label color="primary">
                      {{ relativeTime(product.end_date) }} ({{
                        $dayjs(product.end_date).format('YYYY-MM-DD HH:mm:ss')
                      }})
                    </v-chip>
                  </td>
                </tr>
                <tr
                  v-if="
                    product.estimate_arrival_date && !product.arrival_time_memo
                  "
                >
                  <td class="pb-9">預計到貨日：</td>
                  <td class="pl-5 pb-9 primary--text">
                    {{ product.estimate_arrival_date.substring(0, 10) }}
                  </td>
                </tr>
                <tr v-else-if="hasReceiveType2 && product.arrival_time_memo">
                  <td class="pb-9">到貨時間：</td>
                  <td class="pl-5 pb-9 primary--text">
                    {{ product.arrival_time_memo }}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="color: rgba(5, 42, 226, 1)">
                    本產品之製造日期、有效期限、商品成分與適用注意事項皆標示於包裝或產品中，圖片及產品文案僅供參考，若有變動敬請以實際商品為準。
                    ※ 促銷優惠僅限收到者使用，商品售價請依實際結帳價格為主
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="mt-15 d-none d-md-block">
              <div class="d-flex">
                <template v-if="product.tb_status != null">
                  <v-btn depressed tile large disabled class="flex-grow-1">
                    無法購買
                  </v-btn>
                </template>
                <template v-else-if="product.is_spcloff_product == 'Y'">
                  <v-btn depressed tile large disabled class="flex-grow-1">
                    僅供加購，不可單獨購買
                  </v-btn>
                </template>
                <v-btn
                  v-else-if="!isLogin"
                  color="primary"
                  depressed
                  tile
                  large
                  class="flex-grow-1"
                  :to="{ path: '/login', query: { redirect: $route.fullPath } }"
                >
                  請先登入
                </v-btn>
                <v-btn
                  v-else-if="!isVerified"
                  color="primary"
                  depressed
                  tile
                  large
                  class="flex-grow-1"
                  :to="{
                    path: '/login/auth',
                    query: { redirect: $route.fullPath },
                  }"
                >
                  請先完成認證
                </v-btn>
                <v-btn
                  v-else-if="isCtaLoading"
                  :loading="true"
                  depressed
                  tile
                  large
                  class="flex-grow-1"
                ></v-btn>
                <template v-else>
                  <v-btn
                    v-if="product.delivered_in_person !== 'Y'"
                    color="secondary"
                    tile
                    large
                    outlined
                    class="flex-grow-1"
                    @click="cta('cart')"
                  >
                    加入購物車
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    tile
                    large
                    class="flex-grow-1"
                    @click="cta('buy')"
                  >
                    直接購買
                  </v-btn>
                </template>
              </div>
            </div>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <v-row>
      <v-col cols="12" v-if="!isProductLoading">
        <v-skeleton-loader
          v-if="isOrderLoading"
          type="paragraph"
        ></v-skeleton-loader>
        <v-card
          class="mb-16 pa-8 d-none d-md-block"
          v-else-if="orderArray.length"
        >
          <h6 class="text-h6 mb-4">我已訂購此商品</h6>
          <div>
            <table class="my-order">
              <thead>
                <tr>
                  <th class="text-left">訂單編號</th>
                  <th class="text-left">選擇規格</th>
                  <th class="text-right">單價</th>
                  <th class="text-right">訂購數量</th>
                  <th class="text-right">金額</th>
                  <th>管理訂單</th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="order in orderArray.filter(
                    x => x.order_status !== '2' || x.order_status !== '3'
                  )"
                >
                  <tr
                    v-for="(detail, i) in order.detail_array"
                    :key="order.id + '' + i"
                  >
                    <td
                      v-if="i === 0"
                      class="va-middle"
                      :rowspan="order.detail_array.length"
                    >
                      {{ order.id }}
                    </td>
                    <td>{{ detail.spec_name }}</td>
                    <td class="text-right">{{ detail.discount_price }}</td>
                    <td class="text-right">{{ detail.order_num }}</td>
                    <td class="text-right">
                      {{ detail.discount_price * detail.order_num }}
                    </td>
                    <td
                      v-if="i === 0"
                      class="va-middle text-center"
                      :rowspan="order.detail_array.length"
                    >
                      <router-link :to="`/my-order/${order.id}`"
                        >檢視</router-link
                      >
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </v-card>
        <!-- 暢銷排行 -->
        <v-card class="mb-4" v-if="productCategoryRanking.length > 0">
          <pec-product-group-header-type-a :name="`暢銷排行`" color="secondary">
          </pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-product-hot'"
            color="secondary"
            :product-array="productCategoryRanking"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-product-hot'"
          >
          </pec-product-group-type-a>
        </v-card>
        <!-- 爆品限時購商品 -->
        <v-card
          class="mb-4"
          v-if="
            isCurrentProductInFlashSale && filteredFlashSaleProducts.length > 0
          "
        >
          <pec-product-group-header-type-a
            :name="`爆品限時購`"
            color="secondary"
            to="/flash-sale"
          >
          </pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-product-limited'"
            color="secondary"
            :product-array="filteredFlashSaleProducts.slice(0, 6)"
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
            :section-name="'ga-product-limited'"
          >
          </pec-product-group-type-a>
        </v-card>
        <!-- 週週好給利商品 -->
        <v-card
          class="mb-4"
          v-if="isCurrentProductInSpecial && filteredSpecialProducts.length > 0"
        >
          <pec-product-group-header-type-a
            :name="`週週好給利`"
            color="secondary"
            to="/activity/special"
          >
          </pec-product-group-header-type-a>
          <pec-product-group-type-a
            :className="'ga-product-in-special'"
            color="secondary"
            :product-array="filteredSpecialProducts.slice(0, 6)"
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
            :section-name="'ga-product-in-special'"
          >
          </pec-product-group-type-a>
        </v-card>
        <!-- 同購物車商品 -->
        <v-card
          class="mb-4"
          v-if="product.cart_group_list && product.cart_group_list.length > 0"
        >
          <pec-product-group-header-type-a
            :name="`${product.group_name}專區`"
            color="secondary"
            :to="{
              name: 'CartGroup',
              params: {
                groupId: product.cart_group_id,
              },
            }"
          >
          </pec-product-group-header-type-a>
          <pec-product-group-type-a
            color="secondary"
            :className="`ga-product-brand`"
            :product-array="product.cart_group_list"
            :breadcrumbs="[]"
            :to="{
              name: 'CartGroup',
              params: {
                groupId: product.cart_group_id,
              },
            }"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-product-brand'"
          >
          </pec-product-group-type-a>
        </v-card>
        <v-card class="mt-4 px-4 py-10" ref="card">
          <v-tabs color="primary" v-model="tab">
            <v-tab>商品介紹</v-tab>
            <v-tab>商品規格</v-tab>
            <v-tab v-if="product.teambuy_price_desc">團購條件規則</v-tab>
            <v-tab>產品評論</v-tab>
          </v-tabs>
          <v-tabs-items class="pt-4" v-model="tab">
            <v-tab-item>
              <v-card flat>
                <div
                  class="pec-rich-content"
                  v-html="product.content_clob_full"
                ></div>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <div class="pa-2">
                <table class="kv-table">
                  <tr v-if="product.origin">
                    <td>產地</td>
                    <td>{{ product.origin }}</td>
                  </tr>
                  <tr v-if="product.store_type_name">
                    <td>進貨溫層</td>
                    <td>{{ product.store_type_name }}</td>
                  </tr>
                  <tr v-for="record in product.kv_array" :key="record.id">
                    <td>{{ record.name }}</td>
                    <td>{{ record.value }}</td>
                  </tr>
                </table>

                <div class="mt-2" style="color: rgba(5, 42, 226, 1)">
                  本產品之製造日期、有效期限、商品成分與適用注意事項皆標示於包裝或產品中，圖片及產品文案僅供參考，若有變動敬請以實際商品為準。
                  <br />
                  ※ 促銷優惠僅限收到者使用，商品售價請依實際結帳價格為主
                </div>
              </div>
            </v-tab-item>
            <v-tab-item v-if="product.teambuy_price_desc">
              <div class="pa-2">
                {{ product.teambuy_price_desc }}
              </div>
            </v-tab-item>
            <!-- <v-tab-item>
              <v-card-text>內容3</v-card-text>
            </v-tab-item> -->
            <v-tab-item>
              <div class="pa-2" v-if="commentArray.length === 0">
                尚未有評論
              </div>
              <div v-else>
                <v-card
                  v-for="(content, index) in showCommentArray"
                  :key="index"
                >
                  <div class="pa-2">
                    <div class="d-flex align-center pt-2 pl-2">
                      {{ content.emp_no }}
                      <div
                        class="pl-2 primary--text"
                        v-if="content.like_mark == 1"
                      >
                        <v-chip label class="pa-2 d-flex" color="primary">
                          <background-svg
                            class="mr-1"
                            backgroungUrl="/thumb_up_off_alt.svg"
                            width="20px"
                            height="20px"
                            color="#fff"
                          ></background-svg>
                          讚
                        </v-chip>
                      </div>
                    </div>
                    <div class="pt-2 pl-2 grey--text text--lighten-1">
                      <h5>規格：{{ content.spec_list }}</h5>
                    </div>
                    <div class="pt-2 pl-2" v-if="content.reviews">
                      {{ content.reviews }}
                    </div>
                    <v-dialog
                      max-width="min(800px, 80vh)"
                      v-if="content.img_url"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          v-bind="attrs"
                          v-on="on"
                          class="image-comment pt-2 pl-2"
                          :src="content.img_url"
                        />
                      </template>
                      <template v-slot:default="dialog">
                        <img
                          :src="content.img_url"
                          @click="dialog.value = false"
                        />
                      </template>
                    </v-dialog>
                    <div class="pt-2 pl-2 grey--text">
                      <h6>{{ content.creation_date }}</h6>
                    </div>
                  </div>
                </v-card>
                <v-pagination
                  class="mt-5"
                  color="primary"
                  v-model="page"
                  :length="
                    commentArray.length % pageSize > 0
                      ? Math.floor(commentArray.length / pageSize) + 1
                      : commentArray.length / pageSize
                  "
                  :total-visible="7"
                  @input="updatePage"
                ></v-pagination>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
        <!-- 關聯性商品 -->
        <v-card
          class="mt-4"
          v-if="product.relevance_list && product.relevance_list.length > 0"
        >
          <pec-product-group-header-type-c
            name="關聯性商品"
            background-image="linear-gradient(180deg, rgba(207, 54, 44, 0.765625) 0%, rgba(250, 16, 0, 0.6) 24.48%, #B93229 83.21%, rgba(185, 50, 41, 0) 100%)"
            :to="{
              name: 'Relevance',
              params: {
                productId: productId,
              },
            }"
          ></pec-product-group-header-type-c>
          <pec-product-group-type-a
            color="secondary"
            :className="`ga-product-similar`"
            :product-array="product.relevance_list"
            :breadcrumbs="[]"
            :to="{
              name: 'Relevance',
              params: {
                productId: productId,
              },
            }"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-product-similar'"
          >
          </pec-product-group-type-a>
        </v-card>
        <v-card
          class="my-4"
          v-if="isLogin && productRecommendPurchaseArray.length > 0"
        >
          <pec-product-group-header-type-c
            name="專屬推薦"
            background-image="linear-gradient(180deg, rgba(207, 54, 44, 0.765625) 0%, rgba(250, 16, 0, 0.6) 24.48%, #B93229 83.21%, rgba(185, 50, 41, 0) 100%)"
            :to="`/personalized-recommendation?type=product&productId=${productId}`"
          ></pec-product-group-header-type-c>
          <pec-product-group-type-c
            color="secondary"
            :className="`ga-product-recommend`"
            :product-array="productRecommendPurchaseArray"
            :breadcrumbs="[
              {
                text: '首頁',
                disabled: false,
                to: '/',
              },
              {
                text: '專屬推薦',
                to: `/personalized-recommendation?type=product&productId=${productId}`,
              },
            ]"
            :to="`/personalized-recommendation?type=product&productId=${productId}`"
            :is-login="isLogin"
            :is-verified="isVerified"
            :section-name="'ga-product-recommend'"
          >
          </pec-product-group-type-c>
        </v-card>
      </v-col>

      <v-footer app fixed class="d-md-none d-flex pa-0 elevation-4">
        <v-btn tile large depressed @click="share">
          <background-svg
            class="mt-1"
            backgroungUrl="/share.svg"
            width="18px"
            height="18px"
            color="#000"
          ></background-svg>
          分享
        </v-btn>
        <template v-if="product.tb_status != null">
          <v-btn depressed tile large disabled class="flex-grow-1">
            無法購買
          </v-btn>
        </template>
        <template v-else-if="product.is_spcloff_product == 'Y'">
          <v-btn depressed tile large disabled class="flex-grow-1">
            僅供加購，不可單獨購買
          </v-btn>
        </template>
        <v-btn
          v-else-if="!isLogin"
          color="primary"
          depressed
          tile
          large
          class="flex-grow-1"
          :to="{ path: '/login', query: { redirect: $route.fullPath } }"
        >
          請先登入
        </v-btn>
        <v-btn
          v-else-if="!isVerified"
          color="primary"
          depressed
          tile
          large
          class="flex-grow-1"
          :to="{
            path: '/login/auth',
            query: { redirect: $route.fullPath },
          }"
        >
          請先完成認證
        </v-btn>
        <v-btn
          v-else-if="isCtaLoading"
          :loading="true"
          depressed
          tile
          large
          class="flex-grow-1"
        >
        </v-btn>
        <template v-else>
          <v-btn
            v-if="product.delivered_in_person !== 'Y'"
            color="secondary"
            depressed
            tile
            outlined
            large
            class="flex-grow-1"
            @click="cta('cart')"
          >
            加入購物車
          </v-btn>
          <v-btn
            color="primary"
            depressed
            tile
            large
            class="flex-grow-1"
            @click="cta('buy')"
          >
            直接購買
          </v-btn>
        </template>
      </v-footer>
      <v-bottom-sheet v-model="sheet">
        <product-form
          :product="product"
          :is-loading="isFormLoading"
          :button-text="buttonText"
          :area-order-num-array="product.product_area_order_num"
          :receive-area="receiveAreaInProfile"
          @submit="submit"
          order-num="1"
          :key="product.product_id"
        ></product-form>
      </v-bottom-sheet>
      <v-dialog v-model="dialog" max-width="min(800px, 80vh)">
        <v-sheet>
          <v-img
            max-width="min(800px, 80vh)"
            contain
            :aspect-ratio="1 / 1"
            src="https://unilife.pec.com.tw/images/not_qualified.jpg"
          >
          </v-img>
          <v-btn depressed block color="white" tile @click="dialog = false">
            返回
          </v-btn>
        </v-sheet>
      </v-dialog>
      <v-dialog
        v-model="dialogForProductNotice"
        class="rounded-0"
        persistent
        max-width="min(620px, 80vh)"
      >
        <v-sheet
          v-if="product.spec_array.some(x => x.notice == 'Y')"
          class="py-6 px-8"
          ><div class="d-flex justify-space-between mb-4">
            <div class="pec-title-bl primary--text">
              <span class="black--text text-h5 font-weight-bold">買貴通報</span>
            </div>
            <v-btn
              color="#000"
              icon
              elevation="0"
              style="z-index: 20"
              class="pt-1 font-weight-bold"
              small
              @click="dialogForProductNotice = false"
            >
              <background-svg
                backgroungUrl="/close.svg"
                width="13px"
                height="13px"
                color="#000"
              ></background-svg>
            </v-btn>
          </div>
          <v-divider class="mb-4"></v-divider>
          <div class="text-h5 primary--text mb-8">Thank You!</div>
          <div class="text-body-1 font-weight-black mb-8">
            感謝您使用賣貴通報功能，目前我們已接獲商品賣貴通報，正在積極處理中。
          </div>
          <div class="text-body-1 font-weight-black">
            您可在商品頁面點選【<span
              style="color: #001aff; cursor: pointer"
              @click.stop.prevent="setProductTrack(product.item_main_id)"
              >追蹤</span
            >】了解商品最新狀況。
          </div>
        </v-sheet>

        <v-sheet
          v-else-if="productNoticeSuccess !== 0 && productNoticeSuccess !== 1"
          class="py-6 px-8"
        >
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="d-flex justify-space-between mb-4">
              <div
                v-if="isLogin && isVerified && product.expired == 'N'"
                class="pec-title-bl primary--text font-weight-bold"
                style="font-size: 24px"
                @click="
                  dialogForProductNotice = true
                  productNoticeSuccess = null
                "
              >
                <span class="black--text text-h5 font-weight-bold"
                  >賣貴通報</span
                >
              </div>
              <v-btn
                color="#000"
                icon
                elevation="0"
                style="z-index: 20"
                class="pt-1 font-weight-bold"
                small
                @click="dialogForProductNotice = false"
              >
                <background-svg
                  backgroungUrl="/close.svg"
                  width="13px"
                  height="13px"
                  color="#000"
                ></background-svg>
              </v-btn>
            </div>
            <v-row>
              <v-col cols="4" sm="3" md="3" class="pa-0 pt-4 pa-md-4 pt-md-4">
                <v-img
                  max-height="150"
                  max-width="150"
                  :src="product.img_url_array[0].img_url"
                ></v-img>
              </v-col>
              <v-col cols="8" sm="9" md="9" class="pb-0">
                <div
                  class="d-flex"
                  style="
                    height: 100%;
                    flex-direction: column;
                    align-items: baseline;
                    justify-content: space-between;
                  "
                >
                  <div>
                    <h6 class="text-subtitle-1 font-weight-bold">
                      {{ product.product_name }}
                    </h6>
                  </div>
                  <div style="width: 100%">
                    <v-select
                      v-model="productNotice_spec_id"
                      label="規格"
                      :items="product.spec_array"
                      item-text="spec_name"
                      item-value="spec_id"
                      variant="underlined"
                      :rules="[v => !!v || '請選擇商品規格']"
                      required
                    ></v-select>
                    <div class="primary--text">
                      <span>下殺價格：</span>
                      <span class="text-h5">
                        {{ getPriceDisplay(product) }}
                      </span>
                    </div>
                  </div>
                </div> </v-col
              ><v-col cols="0" md="3" class="pt-0 d-none d-md-block"> </v-col
              ><v-col cols="12" md="9">
                <v-select
                  v-model="productNotice_ec_platform"
                  label="商店名稱："
                  item-text="ec_platform_name"
                  item-value="ec_platform"
                  :items="ecPlatformItems"
                  variant="underlined"
                  :rules="[v => !!v || '請選擇商店名稱']"
                  required
                ></v-select>
                <v-text-field
                  label="商品網址："
                  v-model="productNotice_url"
                  :rules="[v => !!v || '請填寫商品網址']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="productNotice_price"
                  type="number"
                  label="商品售價：（僅限填寫阿拉伯數字）"
                  :rules="[v => !!v || '請填寫商品售價']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="productNotice_email"
                  label="聯絡信箱："
                  :rules="emailRules"
                  required
                ></v-text-field>
                <div class="text-body-2 mb-4">
                  1.請針對單品或相同組合進行比價。<br />
                  2.我們將依您提供的通報內容進行評估並適時調整，評估結果將會以信件與推播回覆。
                </div>
                <v-btn color="primary" block @click="insertProductNotice()">
                  確認送出
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-sheet>

        <v-sheet v-else-if="productNoticeSuccess == '1'" class="py-6 px-8"
          ><div class="d-flex justify-space-between mb-4">
            <div class="pec-title-bl primary--text">
              <span class="black--text text-h5 font-weight-bold">賣貴通報</span>
            </div>
            <v-btn
              color="#000"
              icon
              elevation="0"
              style="z-index: 20"
              class="pt-1 font-weight-bold"
              small
              @click="dialogForProductNotice = false"
            >
              <background-svg
                backgroungUrl="/close.svg"
                width="13px"
                height="13px"
                color="#000"
              ></background-svg>
            </v-btn>
          </div>
          <v-divider class="mb-4"></v-divider>
          <div class="text-h5 primary--text mb-8">Thank You!</div>
          <div class="text-body-1 font-weight-black mb-8">
            非常感謝您使用賣貴通報功能，讓UNI團購網有成長進步的空間。
          </div>
          <div class="text-body-1 font-weight-black">
            通報結果將會Email通知您，也歡迎使用 【<router-link
              :to="`/price-report`"
              style="color: #2400ff"
              >會員中心-賣貴通報 </router-link
            >】 查詢!
          </div>
        </v-sheet>

        <v-sheet v-else-if="productNoticeSuccess == '0'" class="py-6 px-8"
          ><div class="d-flex justify-space-between mb-4">
            <div class="pec-title-bl primary--text">
              <span class="black--text text-h5 font-weight-bold">賣貴通報</span>
            </div>
            <v-btn
              color="#000"
              icon
              elevation="0"
              style="z-index: 20"
              class="pt-1 font-weight-bold"
              small
              @click="dialogForProductNotice = false"
            >
              <background-svg
                backgroungUrl="/close.svg"
                width="13px"
                height="13px"
                color="#000"
              ></background-svg>
            </v-btn>
          </div>
          <v-divider class="mb-4"></v-divider>
          <div class="text-h5 primary--text mb-8">
            本次通報沒有成功，請稍後再試。
          </div>
          <div class="text-body-1 font-weight-black mb-8">
            非常感謝您使用賣貴通報功能，讓UNI團購網有成長進步的空間。
          </div>
          <div class="text-body-1 font-weight-black">
            通報結果將會Email通知您，也歡迎使用 【<router-link
              :to="`/brand-group`"
              style="color: #2400ff"
              >會員中心-賣貴通報 </router-link
            >】 查詢!
          </div>
        </v-sheet>
      </v-dialog>
      <v-dialog
        v-model="dialogAddOn"
        content-class="add-on-dialog"
        max-width="995px"
        persistent
      >
        <div style="position: relative">
          <add-on-product
            :props-add-on-product-array="addOnProductArray"
            :props-recommend-product-array="recommendProductArray"
            :recommend-id="recommendIndex"
            :add-on-id="spcloffIndex"
            @closeAddOnDialog="closeAddOnDialog"
            @fetchAddOnData="fetchAddOnData"
            @update:recommendId="updateRecommendId"
            @update:spcloffId="updateSpcloffId"
            from="product"
          ></add-on-product>
          <v-overlay :absolute="true" :value="isAddOnLoading">
            <div style="width: 64px; overflow: hidden; margin: 0 auto">
              <v-progress-circular
                indeterminate
                color="white"
                size="64"
              ></v-progress-circular>
            </div>
          </v-overlay>
        </div>
      </v-dialog>
      <v-overlay :value="dialogAddOn"
        ><div style="width: 64px; overflow: hidden; margin: 0 auto">
          <v-progress-circular
            indeterminate
            size="64"
            color="white"
          ></v-progress-circular></div
      ></v-overlay>
      <div
        class="tour-backdrop"
        v-if="isOpenTour"
        @click="isOpenTour = !isOpenTour"
      ></div>
    </v-row>
  </v-container>
</template>
<script>
// import PecProductGroupTypeA from '@/components/PecProductGroupTypeA.vue'
import PecImageGallery from '@/components/PecImageGallery.vue'
import ProductForm from '@/components/ProductForm.vue'
import Countdown from '@/components/Countdown.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapGetters, mapState } from 'vuex'
import { apiAxios } from '@/api'
import PecProductGroupTypeA from '@/components/PecProductGroupTypeA.vue'
import PecProductGroupHeaderTypeA from '@/components/PecProductGroupHeaderTypeA.vue'

export default {
  components: {
    PecImageGallery,
    ProductForm,
    Countdown,
    BackgroundSvg,
    PecProductGroupTypeA,
    PecProductGroupHeaderTypeA,
  },
  props: {
    productId: [String, Number],
    isPreview: { type: Boolean, default: false },
    breadcrumbs: { type: Array, default: () => [] },
    prefix: { type: String, default: 'asd' },
  },
  created() {
    if (this.$store.state.profile.email) {
      this.productNotice_email = this.$store.state.profile.email
    }
    window.appShareToWeb = this.shareResult
    return Promise.all([
      this.fetchProduct(),
      this.fetchOrder(),
      this.getCommentAndLike(),
      this.getProductRecommendPurchase(),
      this.getEcPlatform(),
      this.insertBrowsHistory(),
      this.getProductExplosiveV2(),
      this.getProductArrayActivity(),
      this.getProductCategoryMinorRanking(),
      this.getProductCategoryRanking(),
    ]).then(() => {
      this.GA4_view_item()
      if (window.previousUrl == '/share') {
        // this.$snackbar.add(`請分享此商品賺取 OPEN POINT`, {
        //   color: 'success',
        // })
        this.isFromShare = 'Y'
        this.isOpenTour = true
        let anchor =
          document.querySelector('.share-btn-pc').offsetTop == 0
            ? document.querySelector('.share-btn-mobile')
            : document.querySelector('.share-btn-pc')
        if (document.querySelector('.share-btn-pc').offsetTop == 0) {
          document.documentElement.scrollTop = `${anchor.offsetTop + 380}`
        } else {
          document.documentElement.scrollTop = `${anchor.offsetTop - 400}`
        }
      }
    })
  },
  data() {
    return {
      valid: true,
      dialogForProductNotice: false,
      isInsertProductNotice: false,
      productNotice_spec_id: '',
      productNotice_ec_platform: '',
      productNotice_url: '',
      productNotice_email: '',
      productNotice_price: '',
      productNoticeSuccess: null,
      ecPlatformItems: [],
      items: this.breadcrumbs,
      dialog: false,
      dialogAddOn: false,
      isAddOnLoading: false,
      addOnProductArray: [],
      isRecommendLoading: false,
      recommendProductArray: [],
      flashSaleProductArray: [],
      specialProductArray: [],
      productCategoryRanking: [],
      productCategoryMinorRanking: [],
      addOnProductActive: 0,
      tempCartId: {},
      isProductLoading: true,
      isOrderLoading: false,
      isFormLoading: false,
      isCtaLoading: false,
      isFromShare: 'N',
      isOpenTour: false,
      slideGroup: 0,
      product: {
        content_clob: '',
        end_date: '',
        estimate_arrival_date: '',
        goal_num: 0,
        img_url_array: [{}],
        num_price_array: [],
        order_num: 0,
        order_num_with_ratio: 0,
        product_id: null,
        product_name: '',
        spec_array: [],
        start_date: '',
        supplier: '',
        limit_num: 0,
        origin: '',
        teambuy_price_desc: '',
        receive_type_array: [],
      },
      tab: 0,
      orderArray: [],
      page: 1,
      pageSize: 6,
      commentArray: [],
      showCommentArray: [],
      likeMark: 0,
      sheet: this.isPreview,
      actionType: '',
      noticedStatus: false,
      trackProductStatus: false,
      trackBrandStatus: false,
      trackCount: 0,
      productRecommendPurchaseArray: [],
      emailRules: [
        v => !!v || '信箱為必填項目',
        v => /.+@.+\..+/.test(v) || '請輸入有效信箱',
      ],
      recommendIndex: 0,
      spcloffIndex: 0,
    }
  },
  watch: {
    page: {
      // immediate: true,
      handler: function () {
        this.$vuetify.goTo(this.$refs.card.$el)
      },
    },
  },
  computed: {
    ...mapState(['isAndroid']),
    ...mapGetters(['isLogin', 'isVerified']),
    showQuota() {
      return (
        this.product.inv_num != null ||
        this.product.spec_array.some(x => x.inv_num != null)
      )
    },
    quota() {
      if (this.product.inv_num != null) {
        return (
          this.product.inv_num -
          (this.prefix === 'asd' ? this.product.order_num_with_ratio : 0)
        )
      } else if (this.product.spec_array.some(x => x.inv_num != null)) {
        return (
          this.product.spec_array.reduce((acc, cur) => acc + cur.inv_num, 0) -
          (this.prefix === 'asd' ? this.product.order_num_with_ratio : 0)
        )
      } else {
        return null
      }
    },
    buttonText() {
      return this.actionType == 'buy' ? '直接購買' : '加入購物車'
    },
    canShare() {
      return window.navigator.canShare && !window.GroupJSInterface
    },
    canShareMobile() {
      return window.GroupJSInterface
    },
    openWithApp() {
      return !window.GroupJSInterface
    },
    hasReceiveType1() {
      return this.product.receive_type_array.some(x => x.value == '1')
    },
    hasReceiveType2() {
      return this.product.receive_type_array.some(x => x.value == '2')
    },
    receiveAreaInProfile() {
      if (this.$store.state.profile.receive_area) {
        return this.$store.state.profile.receive_area
      } else if (this.$store.state.profile.recent_receive_area) {
        return this.$store.state.profile.recent_receive_area
      } else {
        return ''
      }
    },
    isCurrentProductInFlashSale() {
      return this.flashSaleProductArray.some(
        product => product.product_id === this.product.product_id
      )
    },
    filteredFlashSaleProducts() {
      return this.flashSaleProductArray.filter(
        product => product.product_id !== this.product.product_id
      )
    },
    isCurrentProductInSpecial() {
      return this.specialProductArray.some(
        product => product.product_id === this.product.product_id
      )
    },
    filteredSpecialProducts() {
      return this.specialProductArray.filter(
        product => product.product_id !== this.product.product_id
      )
    },
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
    fetchAddOnData(cartId) {
      const getAddOnProductArray = apiAxios({
        method: 'post',
        url: '/Product/GetProductSpcloff',
        data: {
          spcloffType: 'A',
          filterDto: {
            storeType: [],
            paymentType: [],
            receiveType: [],
            brand: [],
            category: [],
            categorySecondary: [],
            categoryMinor: [],
            minPrice: '0',
            maxPrice: '0',
            orderBy: {
              key: 'default_order_seq',
              asc: true,
            },
          },
        },
      })
      const getRecommendProductArray = apiAxios({
        method: 'post',
        url: '/Product/GetProductRecommendByAiV2',
        params: {
          pageNo: '1',
          pageSize: '20',
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
          orderBy: {
            key: 'default_order_seq',
            asc: true,
          },
          productId: this.productId,
          type: 'product',
        },
      })
      Promise.all([getAddOnProductArray, getRecommendProductArray])
        .then(([addOnProductArray, recommendProductArray]) => {
          this.addOnProductArray = addOnProductArray.result.product
          this.recommendProductArray = recommendProductArray.result.product
          if (
            this.addOnProductArray.length == 0 &&
            this.recommendProductArray.length == 0
          ) {
            this.$router.push({
              name: 'Checkout',
              params: {
                cartIdArray: [this.tempCartId],
                deliveredInPerson: this.product.delivered_in_person == 'Y',
              },
            })
          } else {
            if (cartId) {
              this.dialogAddOn = true
            } else {
              this.$snackbar.add(`已加入購物車`, {
                color: 'success',
              })
            }
          }
        })
        .catch(error => {
          // 處理其中一個或兩個 API 錯誤
          console.error('Error with API requests:', error)
        })
    },
    closeAddOnDialog(cartIdArray) {
      this.dialogAddOn = false
      this.$router.push({
        name: 'Checkout',
        params: {
          cartIdArray: [this.tempCartId, ...cartIdArray],
          deliveredInPerson: this.product.delivered_in_person == 'Y',
        },
      })
    },
    submit(spec) {
      this.actionType == 'buy' ? this.buyNow(spec) : this.addToCart(spec)
    },
    addToCart(payload) {
      let gaInfo = JSON.parse(sessionStorage.getItem('pec_ga_info')) || {}
      // console.log(gaInfo)
      let utmInfo = JSON.parse(sessionStorage.getItem('pec_utm_info')) || {}
      // console.log(utmInfo)

      // 檢查 UTM 是否超過 1 小時
      const recordedAt = utmInfo.utm_recorded_at
      if (recordedAt) {
        const recordedTime = Date.parse(recordedAt)
        const now = Date.now()
        const ONE_HOUR = 60 * 60 * 1000

        // 確保 recordedTime 有效，才做比對
        if (!isNaN(recordedTime) && now - recordedTime > ONE_HOUR) {
          sessionStorage.removeItem('pec_utm_info')
          utmInfo = {}
        }
      }

      this.isFormLoading = true

      return apiAxios({
        method: 'post',
        url: '/Cart/AddCartItemV2',
        data: {
          spec_id: payload.specId,
          receive_type: payload.receiveType,
          receive_area: payload.receiveType === '1' ? payload.receiveArea : '',
          order_num: payload.orderNum,
          section_name: gaInfo.section_name || 'direct',
          target_product_id: gaInfo.target_product_id || 0,
          current_path: gaInfo.current_path || '',
          previous_path: gaInfo.previous_path || '',
          add_from: gaInfo.add_from || '',
          utm_campaign: utmInfo.utm_campaign || '',
          utm_content: utmInfo.utm_content || '',
        },
      })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Cart/GetCartItemArray',
          })
        )
        .then(res => {
          this.$store.commit('setCartCount', res.result.length)
        })
        .finally(() => {
          this.sheet = false
          this.isFormLoading = false
        })
    },
    buyNow(payload) {
      let gaInfo = JSON.parse(sessionStorage.getItem('pec_ga_info')) || {}
      // console.log(gaInfo)
      let utmInfo = JSON.parse(sessionStorage.getItem('pec_utm_info')) || {}
      // console.log(utmInfo)

      // 檢查 UTM 是否超過 1 小時
      const recordedAt = utmInfo.utm_recorded_at
      if (recordedAt) {
        const recordedTime = Date.parse(recordedAt)
        const now = Date.now()
        const ONE_HOUR = 60 * 60 * 1000

        // 確保 recordedTime 有效，才做比對
        if (!isNaN(recordedTime) && now - recordedTime > ONE_HOUR) {
          sessionStorage.removeItem('pec_utm_info')
          utmInfo = {}
        }
      }

      this.isFormLoading = true

      apiAxios({
        method: 'post',
        url: '/Cart/RemoveSpcloffHiddenfCartItem',
      }).then(() => {
        apiAxios({
          method: 'post',
          url: '/Cart/InsertCartItemV2',
          data: {
            spec_id: payload.specId,
            receive_type: payload.receiveType,
            receive_area:
              payload.receiveType === '1' ? payload.receiveArea : '',
            order_num: payload.orderNum,
            section_name: gaInfo.section_name || 'direct',
            target_product_id: gaInfo.target_product_id || 0,
            current_path: gaInfo.current_path || '',
            previous_path: gaInfo.previous_path || '',
            add_from: 'purchase-now',
            utm_campaign: utmInfo.utm_campaign || '',
            utm_content: utmInfo.utm_content || '',
          },
        })
          .then(res => {
            this.tempCartId = res.result
            this.fetchAddOnData(this.tempCartId)
          })
          .finally(() => {
            this.sheet = false
            this.isFormLoading = false
          })
      })
    },
    share() {
      this.isOpenTour = false
      if (this.canShare) {
        const shareData = {
          title: '統一團購網',
          text: this.product.product_name,
          url: window.location.href,
        }
        navigator.share(shareData)
      } else if (this.canShareMobile) {
        const shareData = {
          title: '統一團購網',
          text: this.product.product_name,
          url: (this.isAndroid ? ' ' : '') + window.location.href,
        }
        if (window.GroupJSInterface.shareToApp) {
          window.GroupJSInterface.shareToApp(JSON.stringify(shareData))
        } else {
          this.$snackbar.add(`此分享功能需要更新至最新 app 版本`, {
            color: 'success',
          })
        }
      }
    },
    async fetchProduct() {
      this.isProductLoading = true
      await apiAxios({
        method: 'post',
        url: '/Product/GetProductV2',
        params: { v: '2' },
        data: {
          product_id: this.productId,
          prefix: this.prefix,
        },
      }).then(res => {
        this.product = res.result[0]
        this.trackCount = res.result[0].product_track_count
        this.trackProductStatus =
          this.product.product_track_status == 'Y' ? true : false
        this.trackBrandStatus =
          this.product.brand_track_status == 'Y' ? true : false
        this.noticedStatus = this.product.noticed == 'Y' ? true : false
        if (this.breadcrumbs.length === 0) {
          this.items = [
            {
              text: '首頁',
              disabled: false,
              to: '/',
            },
            {
              text: this.product.category_array[0].category_name,
              disabled: false,
              to: `/category/${this.product.category_array[0].category_id}`,
            },
            {
              text: this.product.product_name,
              disabled: false,
            },
          ]
        }
      })
      if (this.product.cart_group_id) {
        await apiAxios({
          method: 'post',
          url: '/Product/GetProductCartGroup',
          data: {
            cart_group_id: this.product.cart_group_id,
          },
        }).then(res => {
          this.product.cart_group_list = res.result
        })
      } else {
        this.product.cart_group_list = []
      }
      await apiAxios({
        method: 'post',
        url: '/Product/GetProductRelevanceV3?v=2',
        data: {
          product_id: this.product.product_id,
          filter: {
            storeType: [],
            paymentType: [],
            receiveType: [],
            brand: [],
            category: [],
            categorySecondary: [],
            categoryMinor: [],
            minPrice: '0',
            maxPrice: '0',
            orderBy: {
              key: 'default_order_seq',
              asc: true,
            },
          },
        },
      }).then(res => {
        this.product.relevance_list = res.result.product
      })
      this.isProductLoading = false
    },
    fetchOrder() {
      if (this.$store.getters['isLogin']) {
        this.isOrderLoading = true

        return apiAxios({
          method: 'post',
          url: '/MyOrder/GetMyOrder',
          data: { product_id: this.productId, days: 31 },
        })
          .then(
            res =>
              (this.orderArray = res.result.filter(
                x => x.order_status == '0' || x.order_status == '1'
              ))
          )
          .finally(() => (this.isOrderLoading = false))
      }
    },
    getProductExplosiveV2() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductExplosiveV2',
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
        this.flashSaleProductArray = res.result.product
      })
    },
    getProductArrayActivity() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductArrayActivity?pageSize=20',
        params: { v: '2' },
        data: {
          activity_type: 'special',
        },
      }).then(res => {
        this.specialProductArray = res.result
      })
    },
    getProductCategoryMinorRanking() {
      apiAxios({
        method: 'post',
        url: 'Product/GetProductCategoryRanking?v=2&pageSize=5',
        data: {
          product_id: this.productId,
          days: 30,
          category: 'categroyMinor',
        },
      }).then(res => {
        this.productCategoryMinorRanking = res.result
      })
    },
    getProductCategoryRanking() {
      apiAxios({
        method: 'post',
        url: 'Product/GetProductCategoryRanking?v=2&pageSize=20',
        data: {
          product_id: this.productId,
          days: 30,
          category: 'categroy',
        },
      }).then(res => {
        this.productCategoryRanking = res.result
      })
    },
    getPriceDisplay(product) {
      let sorted = product.spec_array
        .map(x => x.discount_price)
        .sort((a, b) => a - b)

      let output = `$${sorted[0] && sorted[0].toLocaleString()}`

      if (sorted[0] !== sorted[sorted.length - 1]) {
        output += `~$${sorted[sorted.length - 1].toLocaleString()}`
      }
      return output
    },
    getRewardAmountLimitDisplay(product) {
      let sorted = product.spec_array
        .map(x =>
          Math.floor(
            x.discount_price *
              product.reward_amount_limit_ratio *
              (product.reward_amount_ratio / 100)
          )
        )
        .sort((a, b) => a - b)

      let output = `$${sorted[0] && sorted[0].toLocaleString()}`

      if (sorted[0] !== sorted[sorted.length - 1]) {
        output += `~$${sorted[sorted.length - 1].toLocaleString()}`
      }
      return output
    },
    relativeTime(dateString) {
      return this.$dayjs().to(this.$dayjs(dateString))
    },
    cta(actionType) {
      if (this.product.purchase_instruction) {
        this.$dialog.show(this.product.purchase_instruction, {
          title: '系統訊息',
        })
      } else if (
        !this.$dayjs().isBetween(
          this.$dayjs(this.product.start_date),
          this.$dayjs(this.product.end_date)
        )
      ) {
        this.$dialog.show('商品尚未或是已經結束販售', {
          title: '系統訊息',
        })
      } else {
        let gaInfo = JSON.parse(sessionStorage.getItem('pec_ga_info')) || {}

        // 2. 更新特定欄位
        gaInfo.target_product_id = this.product.product_id
        gaInfo.current_path = this.$route.path
        gaInfo.previous_path = window.previousUrl
        if (actionType === 'buy') {
          gaInfo.add_from = 'buy-now-btn'
          this.$gtm.trackEvent({
            event: 'select_content',
            content_type: 'section-click',
            content_id: 'buy-now-btn',
          })
        } else {
          gaInfo.add_from = 'add-to-cart-btn'
          this.$gtm.trackEvent({
            event: 'select_content',
            content_type: 'section-click',
            content_id: 'add-to-cart-btn',
          })
        }

        // 3. 存回 sessionStorage
        sessionStorage.setItem('pec_ga_info', JSON.stringify(gaInfo))

        this.isCtaLoading = true
        return apiAxios({
          method: 'post',
          url: '/Product/GetProductV2',
          params: { v: '2' },
          data: {
            product_id: this.productId,
          },
        })
          .then(res => {
            let cart_group_list = this.product.cart_group_list
            this.product = res.result[0]
            this.product.cart_group_list = cart_group_list
            this.sheet = true
            this.actionType = actionType
          })
          .finally(() => (this.isCtaLoading = false))
      }
    },
    getCommentAndLike() {
      let urlParams = new URLSearchParams(window.location.search)
      let prefix = urlParams.get('prefix')

      return apiAxios({
        method: 'post',
        url: '/Comment/GetProductPageInfo',
        data: { product_id: this.productId, prefix: prefix ? prefix : 'asd' },
      })
        .then(res => {
          this.commentArray = res.result.comment.map(e => {
            e.reviews = e.reviews === 'null' ? '' : e.reviews
            return e
          })
          this.likeMark = res.result.likeMark
        })
        .then(
          () =>
            (this.showCommentArray = this.commentArray.slice(
              this.pageSize * (this.page - 1),
              this.pageSize * this.page
            ))
        )
    },
    updatePage() {
      this.showCommentArray = this.commentArray.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      )
    },
    scrollToComment() {
      this.$vuetify.goTo(this.$refs.card)
      this.tab = this.product.teambuy_price_desc ? 3 : 2
    },
    shareResult(servcie) {
      return apiAxios({
        method: 'post',
        url: '/Share/InsertShareLog',
        data: {
          product_id: this.productId,
          share_app: servcie,
          share_point: this.isFromShare,
        },
      }).then(() => {
        this.$snackbar.add(`分享成功`, { color: 'success' })
        if (this.isFromShare == 'Y') {
          this.$router.push('/share')
        }
      })
    },
    toCartGroup(cart_group_id) {
      this.$router.push({
        name: 'CartGroup',
        params: {
          groupId: cart_group_id,
        },
      })
    },
    toBrandGroup(brand_id) {
      this.$router.push({
        name: 'BrandGroup',
        params: {
          groupId: brand_id,
        },
      })
    },
    toTagGroup(tag) {
      if (tag.router_to) {
        this.$router.push(tag.router_to)
      } else {
        this.$snackbar.add(tag.tag_name + ' 專區建置中')
      }
    },
    setBrandTrack(brand_id) {
      apiAxios({
        method: 'post',
        url: '/Track/Track',
        data: { brand_id: [brand_id] },
      }).then(res => {
        this.$snackbar.add(`${res.message}`, { color: 'success' })
        this.trackBrandStatus = !this.trackBrandStatus
      })
    },
    setProductTrack(item_main_id) {
      apiAxios({
        method: 'post',
        url: '/Track/Track',
        data: { item_main_id: [item_main_id] },
      }).then(res => {
        if (res.message == null) {
          this.$snackbar.add(`此商品未設立追蹤功能`, { color: 'primary' })
        } else {
          this.$snackbar.add(`${res.message}`, { color: 'success' })
          this.trackProductStatus = !this.trackProductStatus
          this.trackCount = res.result
        }
      })
    },
    setSaleNotice(item_main_id) {
      apiAxios({
        method: 'post',
        url: '/SaleNotice/SaleNotice',
        data: { item_main_id: [item_main_id] },
      }).then(res => {
        this.$snackbar.add(`${res.message}`, { color: 'success' })
        this.noticedStatus = !this.noticedStatus
      })
    },
    insertBrowsHistory() {
      if (this.isLogin) {
        apiAxios({
          method: 'post',
          url: '/History/InsertBrowsHistory',
          data: { product_id: this.productId },
        }).then(() => this.$store.commit('setUpdateBrowsHistoryPageNo', true))
      }
    },
    getProductRecommendPurchase() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductRecommendByAiV2',
        params: {
          pageNo: 1,
          pageSize: 20,
          v: 2,
        },
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
          productId: this.productId,
        },
      }).then(res => {
        this.productRecommendPurchaseArray = res.result.product
      })
    },
    getEcPlatform() {
      apiAxios({
        method: 'post',
        url: '/Profile/GetEcPlatform',
        data: {},
      }).then(res => {
        this.ecPlatformItems = res.result
      })
    },
    insertProductNotice() {
      if (this.$refs.form.validate()) {
        return apiAxios({
          method: 'post',
          url: '/ProductNotice/InsertProductNotice',
          data: {
            product_id: this.product.product_id,
            spec_id: this.productNotice_spec_id,
            price: this.productNotice_price,
            ec_platform: this.productNotice_ec_platform,
            url: this.productNotice_url,
            email: this.productNotice_email,
          },
        }).then(res => {
          if (res.message == '買貴通報成功') {
            this.productNoticeSuccess = 1
            this.product.product_id = ''
            this.productNotice_spec_id = ''
            this.productNotice_price = 0
            this.productNotice_ec_platform = ''
            this.productNotice_url = ''
            if (this.$store.state.profile.email) {
              this.productNotice_email = this.$store.state.profile.email
            } else {
              this.productNotice_email = ''
            }
          } else {
            this.productNoticeSuccess = 0
            this.product.product_id = ''
            this.productNotice_spec_id = ''
            this.productNotice_price = 0
            this.productNotice_ec_platform = ''
            this.productNotice_url = ''
            if (this.$store.state.profile.email) {
              this.productNotice_email = this.$store.state.profile.email
            } else {
              this.productNotice_email = ''
            }
          }
        })
      }
    },
    GA4_view_item() {
      window.dataLayer.push({ ecommerce: null })
      this.$gtm.trackEvent({
        event: 'view_item',
        ecommerce: {
          currency: 'TWD',
          value: this.product.spec_array[0].discount_price,
          items: [
            {
              item_id: this.product.product_id,
              item_name: this.product.product_name,
              affiliation: this.product.supplier,
              coupon: '',
              currency: 'TWD',
              discount: 0,
              index: 0,
              item_brand: this.product.supplier,
              item_category: this.product.category_array[0].category_name,
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_list_id: '',
              item_list_name: '',
              item_variant: '',
              location_id: '',
              price: this.product.spec_array[0].discount_price,
              quantity: 1,
            },
          ],
        },
      })
    },
    updateRecommendId(v) {
      this.recommendIndex = v
    },
    updateSpcloffId(v) {
      this.spcloffIndex = v
    },
  },
}
</script>
<style scoped>
.ranking-mobile-title {
  color: #0901fb;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 1 auto;
  width: 100%;
}
.flag {
  position: absolute;
  top: 0px;
  left: 6px;
  z-index: 1;
}
.pec-rich-content {
  overflow: hidden;
}
.product-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.v-bottom-navigation .v-btn {
  max-width: 100% !important;
}
blockquote {
  border-left: 3px solid var(--v-primary-base);
  padding-left: 8px;
}
li {
  line-height: 2rem;
}
ul > li::marker {
  color: var(--v-primary-base);
}
td.va-middle {
  vertical-align: middle;
}
table.my-order,
table.kv-table {
  width: 100%;
  border-collapse: collapse;
}
table.my-order th,
table.my-order td,
table.kv-table th,
table.kv-table td {
  padding: 12px;
  border: 1px solid #dddddd;
}
table.kv-table td:first-child {
  background: #eeeeee;
}
table.threshold {
  border-collapse: collapse;
}
table.threshold td {
  padding: 6px;
}
table.threshold td.bl {
  border-left: 1px solid #707070;
}
table.threshold td.br {
  border-right: 1px solid #707070;
}
table.threshold tr:first-child td.b {
  border-top: 1px solid #707070;
}
table.threshold tr:last-child td.b {
  border-bottom: 1px solid #707070;
}
th {
  background: #f5f5f5;
}
.image-comment {
  height: 64px;
}
.thumb_up {
  cursor: pointer;
}
.tour-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1100;
  background-color: #000;
  opacity: 0.8;
  filter: alpha(opacity=80);
}
.tour-step-backdrop::before {
  z-index: 1101;
  border-width: 10px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: #832f2f00;
  border-style: solid;
  bottom: -13px;
  top: auto;
  margin-left: -10px;
  content: ' ';
  border-top-width: 0;
  border-bottom-color: #ca1f1d;
  background-color: transparent;
  opacity: 1;
  left: 50%;
  cursor: auto;
  pointer-events: none;
}
.tour-step-backdrop {
  position: relative;
  z-index: 1101;
}
.tour-step-backdrop:hover::before,
.tour-step-backdrop:focus::before {
  opacity: 1 !important;
}
.tour-step-backdrop::after {
  z-index: 1101;
  position: absolute;
  display: block;
  content: '點擊即可分享';
  padding: 8px 14px;
  margin: 0;
  font-size: 14px;
  background-color: #ca1f1d;
  border-bottom: 1px solid #ebebeb;
  border-radius: 5px;
  top: 48px;
  cursor: auto;
  pointer-events: none;
  color: #fff;
}
:deep(.v-overlay__content) {
  width: 100%;
}
@media (max-width: 960px) {
  :deep(.add-on-dialog.v-dialog) {
    margin: 0;
    max-height: inherit;
    border-radius: 0;
    min-width: 100%;
  }
}
@media (max-width: 767px) {
  .tour-step-backdrop::after {
    width: 180%;
    white-space: pre-wrap;
  }
}
@media (max-width: 374px) {
  .tour-step-backdrop::after {
    width: 130%;
  }
}
</style>
