<template>
  <div>
    <v-sheet style="position: relative">
      <v-card class="elevation-0 rounded-0" color="basil">
        <v-tabs v-model="mainTab" color="primary" grow>
          <v-tab
            v-for="(item, index) in items"
            :key="index"
            v-show="
              (index === 0 && addOnProductArray.length > 0) ||
              (index === 1 && recommendProductArray.length > 0)
            "
          >
            <div class="main-title">
              {{ item }}
              <v-icon class="ml-2">{{
                index == 0 ? 'fa-solid fa-cart-plus' : 'fa-regular fa-thumbs-up'
              }}</v-icon>
            </div>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="mainTab">
          <v-tab-item :value="0">
            <div
              class="main-content"
              :class="{ active: mainTab == 0 }"
              ref="dialogContent"
            >
              <v-row no-gutters>
                <v-col cols="12" md="10">
                  <v-row no-gutters>
                    <v-col cols="12" md="4">
                      <div class="mt-3 ml-3 mr-3 mr-md-0">
                        <pec-image-gallery
                          :items="imageItems"
                          :key="galleryKey"
                        ></pec-image-gallery>
                        <div class="d-none d-md-block mt-2">
                          <div
                            class="text-h6"
                            v-if="
                              addOnProductActive.activity_raiders_array &&
                              addOnProductActive.activity_raiders_array.length
                            "
                          >
                            <div
                              v-for="(
                                activity, index
                              ) in addOnProductActive.activity_raiders_array"
                              :key="index"
                            >
                              <span
                                class="primary--text red lighten-5 rounded px-2"
                                >活動</span
                              >
                              {{ activity.activity_name }}
                              <router-link
                                :to="activity.releated_link"
                                class="text-decoration-none"
                              >
                                <span
                                  class="text-button blue--text text--darken-2"
                                  >前往查看</span
                                >
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card
                        class="ma-3 px-md-8 px-0 rounded-0 elevation-0 main-content__center"
                      >
                        <h6 class="text-h6 mb-3 pec-title-bl primary--text">
                          {{ addOnProductActive.subtitle }}
                        </h6>
                        <h6 class="text-h6 mb-5">
                          <v-chip
                            v-if="mainTab == 0"
                            class="mb-2 mt-1 px-3 mr-2"
                            style="font-size: 14px"
                            color="#FFE500"
                            small
                            >加價購</v-chip
                          >
                          <a
                            class="font-weight-bold"
                            style="color: #bf2220"
                            @click="toBrandGroup(addOnProductActive.brand_id)"
                            >{{ addOnProductActive.brand_name }}</a
                          >{{ addOnProductActive.product_name }}
                        </h6>
                        <div class="d-md-none">
                          <!-- 原價與折扣相同時，僅顯示原價 -->
                          <div
                            v-if="
                              addOnProductActive.spec_array[0] &&
                              addOnProductActive.spec_array[0].list_price ==
                                addOnProductActive.spec_array[0].discount_price
                            "
                          >
                            <p
                              class="d-flex align-center justify-space-between flex-wrap"
                            >
                              <span class="d-flex align-center mt-4"
                                ><span class="text-h5">
                                  原價${{
                                    addOnProductActive.spec_array[0] &&
                                    addOnProductActive.spec_array[0].list_price.toLocaleString()
                                  }}
                                </span>
                              </span>
                              <span class="d-flex align-center mt-4"> </span>
                            </p>
                            <p
                              v-if="
                                addOnProductActive.gifts &&
                                isLogin &&
                                isVerified
                              "
                              class="primary--text d-flex align-center mb-0"
                            >
                              <span class="whitespace-nowrap">限定加贈：</span>
                              <span>{{ addOnProductActive.gifts }}</span>
                            </p>
                            <h6
                              class="text-h6 primary--text mb-3"
                              v-if="addOnProductActive.reward_exclude == 'Y'"
                            >
                              ※本商品不可折抵折價券
                            </h6>
                            <!-- <div class="d-flex align-center mb-3">
                              <span
                                v-if="isLogin && isVerified"
                                class="d-flex text-h5 primary--text hide-text align-center mr-2"
                              >
                                <v-btn
                                  text
                                  small
                                  :color="`${
                                    trackProductStatus ? 'primary' : 'black'
                                  }`"
                                  class="d-flex align-center px-1 text-subtitle-1"
                                  @click.stop.prevent="
                                    setProductTrack(
                                      addOnProductActive
                                        .item_main_id
                                    )
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

                              <span class="pt-1 mr-2"
                                >{{ trackCount }}人追蹤此商品</span
                              ><v-btn
                                class="ml-1"
                                :outlined="!noticedStatus"
                                elevation="0"
                                small
                                color="secondary"
                                @click.stop.prevent="
                                  setSaleNotice(
                                    addOnProductActive
                                      .item_main_id
                                  )
                                "
                              >
                                <i
                                  class="fa-solid fa-volume mr-1"
                                  style="padding-top: 1px"
                                ></i
                                >{{
                                  noticedStatus ? '取消開團提醒' : '開團提醒我'
                                }}
                              </v-btn>
                            </div> -->
                          </div>
                          <!-- 原價與折扣不相同時，維持原來的 UI -->
                          <div v-else>
                            <div
                              class="d-flex justify-space-between align-center mb-1"
                            >
                              <p
                                class="text-body-2 text-decoration-line-through"
                              >
                                原價${{
                                  addOnProductActive.spec_array[0] &&
                                  addOnProductActive.spec_array[0].list_price.toLocaleString()
                                }}
                              </p>
                            </div>
                            <template v-if="isLogin && isVerified">
                              <p class="primary--text d-flex align-center">
                                <span>下殺價格：</span>
                                <span
                                  v-if="addOnProductActive.hide_price == 'Y'"
                                  class="text-h5"
                                >
                                  驚喜價
                                </span>
                                <span v-else class="text-h5">
                                  {{ getPriceDisplay(addOnProductActive) }}
                                </span>
                              </p>
                              <p
                                v-if="addOnProductActive.gifts"
                                class="primary--text d-flex align-center mb-0"
                              >
                                <span class="whitespace-nowrap"
                                  >限定加贈：</span
                                >
                                <span>{{ addOnProductActive.gifts }}</span>
                              </p>
                              <h6
                                class="text-h6 primary--text mb-3"
                                v-if="addOnProductActive.reward_exclude == 'Y'"
                              >
                                ※本商品不可折抵折價券
                              </h6>
                            </template>
                            <router-link
                              v-else-if="!isLogin"
                              class="text-h5 primary--text"
                              :to="{
                                path: '/login',
                                query: { redirect: $route.fullPath },
                              }"
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
                            v-if="
                              addOnProductActive.num_price_array &&
                              addOnProductActive.num_price_array.length
                            "
                          >
                            <v-divider class="mb-5"></v-divider>
                            <div>
                              <div class="mb-2">分檻定價</div>
                              <table class="threshold">
                                <tbody>
                                  <tr
                                    v-for="record in addOnProductActive.num_price_array"
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
                              addOnProductActive.activity_raiders_array &&
                              addOnProductActive.activity_raiders_array.length
                            "
                          ></v-divider>
                          <div
                            class="text-h6"
                            v-if="
                              addOnProductActive.activity_raiders_array &&
                              addOnProductActive.activity_raiders_array.length
                            "
                          >
                            <div
                              v-for="(
                                activity, index
                              ) in addOnProductActive.activity_raiders_array"
                              :key="index"
                            >
                              <span
                                class="primary--text red lighten-5 rounded px-2"
                                >活動</span
                              >
                              {{ activity.activity_name }}
                              <router-link
                                :to="activity.releated_link"
                                class="text-decoration-none"
                              >
                                <span
                                  class="text-button blue--text text--darken-2"
                                  >前往查看</span
                                >
                              </router-link>
                            </div>
                          </div>
                          <v-divider class="my-5"></v-divider>
                        </div>
                        <div class="primary--text text-body-2">
                          <p>商品編號：{{ addOnProductActive.product_id }}</p>
                          <p>
                            配送方式：{{
                              addOnProductActive.receive_type_array
                                .map(x => x.text)
                                .join('、')
                            }}
                          </p>
                          <p
                            v-if="
                              addOnProductActive.receive_type_array.filter(
                                x => x.value == '2'
                              ).length
                            "
                          >
                            運費資訊：{{ addOnProductActive.shipping_type }}
                          </p>
                          <div
                            class="d-flex align-center"
                            v-if="addOnProductActive.cart_group_id"
                            @click="
                              toCartGroup(addOnProductActive.cart_group_id)
                            "
                          >
                            <span class="black--text">{{
                              addOnProductActive.group_name
                            }}</span>
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
                        <v-divider class="mt-5 mb-7"></v-divider>
                        <div
                          class="pec-rich-content"
                          v-html="addOnProductActive.content_clob"
                        ></div>
                        <v-chip-group active-class="primary--text" column>
                          <v-chip
                            v-for="(tag, index) in addOnProductActive.tag_array"
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
                              addOnProductActive.spec_array[0] &&
                              addOnProductActive.spec_array[0].list_price ==
                                addOnProductActive.spec_array[0].discount_price
                            "
                          >
                            <p
                              class="d-flex align-center justify-space-between"
                            >
                              <span class="d-flex align-center">
                                <span class="text-h5">
                                  原價${{
                                    addOnProductActive.spec_array[0] &&
                                    addOnProductActive.spec_array[0].list_price.toLocaleString()
                                  }}
                                </span>
                                <v-btn
                                  v-if="isLogin && isVerified"
                                  depressed
                                  class="ml-4 share-btn-pc"
                                  :class="{
                                    'tour-step-backdrop': isOpenTour,
                                  }"
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
                            </p>
                            <p
                              v-if="
                                addOnProductActive.gifts &&
                                isLogin &&
                                isVerified
                              "
                              class="primary--text d-flex align-center mb-0"
                            >
                              <span class="whitespace-nowrap">限定加贈：</span>
                              <span>{{ addOnProductActive.gifts }}</span>
                            </p>
                            <h6
                              class="text-h6 primary--text mb-3"
                              v-if="addOnProductActive.reward_exclude == 'Y'"
                            >
                              ※本商品不可折抵折價券
                            </h6>
                          </div>
                          <!-- 原價與折扣不相同時，維持原來的 UI -->
                          <div v-else>
                            <div class="d-flex justify-space-between mb-4">
                              <p
                                class="text-body-2 text-decoration-line-through mb-0"
                              >
                                原價${{
                                  addOnProductActive.spec_array[0] &&
                                  addOnProductActive.spec_array[0].list_price.toLocaleString()
                                }}
                              </p>
                            </div>

                            <template v-if="isLogin && isVerified">
                              <p
                                class="primary--text d-flex align-center flex-wrap"
                              >
                                <span>下殺價格：</span>
                                <span
                                  v-if="addOnProductActive.hide_price == 'Y'"
                                  class="text-h5"
                                >
                                  驚喜價
                                </span>
                                <span v-else class="text-h5">
                                  {{ getPriceDisplay(addOnProductActive) }}
                                </span>
                                <span
                                  class="d-inline-block text-h6 primary--text pt-3"
                                  v-if="
                                    addOnProductActive.reward_exclude == 'Y'
                                  "
                                  style="width: 100%"
                                >
                                  ※本商品不可折抵折價券
                                </span>
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
                                v-if="addOnProductActive.gifts"
                                class="primary--text d-flex align-center mb-0"
                              >
                                <span class="whitespace-nowrap"
                                  >限定加贈：</span
                                >
                                <span>{{ addOnProductActive.gifts }}</span>
                              </p>
                            </template>
                            <router-link
                              v-else-if="!isLogin"
                              class="text-h5 primary--text"
                              :to="{
                                path: '/login',
                                query: { redirect: $route.fullPath },
                              }"
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
                          <div>
                            <table class="threshold">
                              <tbody>
                                <tr
                                  v-for="record in addOnProductActive.num_price_array"
                                  :key="record.num_price_id"
                                >
                                  <td class="bl b">成團</td>
                                  <td class="b">{{ record.num }}件</td>
                                  <td class="b primary--text">下殺</td>
                                  <td class="b br">
                                    ${{ record.price.toLocaleString() }}
                                  </td>
                                  <td class="primary--text"></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <v-divider class="mt-7"></v-divider>
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-card class="px-4 elevation-0">
                        <v-tabs color="primary" v-model="addOnTab">
                          <v-tab>商品介紹</v-tab>
                          <v-tab>商品規格</v-tab>
                          <v-tab v-if="addOnProductActive.teambuy_price_desc"
                            >團購條件規則</v-tab
                          >
                          <!-- <v-tab>產品評論</v-tab> -->
                        </v-tabs>
                        <v-tabs-items class="pt-4" v-model="addOnTab">
                          <v-tab-item>
                            <v-card flat>
                              <div
                                class="pec-rich-content"
                                v-html="addOnProductActive.content_clob_full"
                              ></div>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item>
                            <div class="pa-2">
                              <table class="kv-table">
                                <tr v-if="addOnProductActive.origin">
                                  <td>產地</td>
                                  <td>
                                    {{ addOnProductActive.origin }}
                                  </td>
                                </tr>
                                <tr v-if="addOnProductActive.store_type_name">
                                  <td>進貨溫層</td>
                                  <td>
                                    {{ addOnProductActive.store_type_name }}
                                  </td>
                                </tr>
                                <tr
                                  v-for="record in addOnProductActive.kv_array"
                                  :key="record.id"
                                >
                                  <td>{{ record.name }}</td>
                                  <td>{{ record.value }}</td>
                                </tr>
                              </table>
                            </div>
                          </v-tab-item>
                          <v-tab-item
                            v-if="addOnProductActive.teambuy_price_desc"
                          >
                            <div class="pa-2">
                              {{ addOnProductActive.teambuy_price_desc }}
                            </div>
                          </v-tab-item>
                        </v-tabs-items>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="2" class="d-none d-md-block">
                  <div class="side-scrollbar">
                    <div style="position: sticky; top: 0px; z-index: 10">
                      <div
                        class="white--text text-center pa-1"
                        style="background-color: #d96f20"
                      >
                        相關{{ mainTab == 0 ? '加購' : '推薦' }}品
                      </div>
                    </div>
                    <div
                      class="pa-4 add-on-product-card"
                      v-for="(item, index) in addOnProductArray"
                      :key="item.id"
                      :class="{ active: addOnProductActiveIndex == index }"
                      @click="selectAddOnProduct(index, item)"
                    >
                      <v-badge
                        color="red"
                        :value="item.cart_num !== 0"
                        :content="`${item.cart_num}`"
                        offset-x="10"
                        offset-y="10"
                        ><v-img :width="118" :src="item.img_url"></v-img
                      ></v-badge>
                      <div>
                        <v-chip
                          v-if="mainTab == 0"
                          class="my-2 px-3 mr-2"
                          style="font-size: 14px"
                          color="#FFE500"
                          small
                          >加價購</v-chip
                        >
                      </div>
                      <div
                        class="mb-1"
                        style="
                          overflow: hidden;
                          text-overflow: ellipsis;
                          display: -webkit-box;
                          line-clamp: 4;
                          -webkit-line-clamp: 4;
                          -webkit-box-orient: vertical;
                        "
                      >
                        {{ item.product_name }}
                      </div>
                      <div class="text-body-2">
                        加購價<span class="mx-1">$</span
                        ><span class="text-h5 primary--text">{{
                          item.min_discount_price
                        }}</span>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-tab-item>
          <v-tab-item :value="1">
            <div
              class="main-content"
              :class="{ active: mainTab == 0 }"
              ref="dialogContent"
            >
              <v-row no-gutters>
                <v-col cols="12" md="10">
                  <v-row no-gutters>
                    <v-col cols="12" md="4">
                      <div class="mt-3 ml-3 mr-3 mr-md-0">
                        <pec-image-gallery
                          :items="imageItems"
                          :key="galleryKey"
                        ></pec-image-gallery>
                        <div class="d-none d-md-block mt-2">
                          <div
                            class="text-h6"
                            v-if="
                              recommendProductActive.activity_raiders_array &&
                              recommendProductActive.activity_raiders_array
                                .length
                            "
                          >
                            <div
                              v-for="(
                                activity, index
                              ) in recommendProductActive.activity_raiders_array"
                              :key="index"
                            >
                              <span
                                class="primary--text red lighten-5 rounded px-2"
                                >活動</span
                              >
                              {{ activity.activity_name }}
                              <router-link
                                :to="activity.releated_link"
                                class="text-decoration-none"
                              >
                                <span
                                  class="text-button blue--text text--darken-2"
                                  >前往查看</span
                                >
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card
                        class="ma-3 px-md-8 px-0 rounded-0 elevation-0 main-content__center"
                      >
                        <h6 class="text-h6 mb-3 pec-title-bl primary--text">
                          {{ recommendProductActive.subtitle }}
                        </h6>
                        <h6 class="text-h6 mb-5">
                          <v-chip
                            v-if="mainTab == 0"
                            class="mb-2 mt-1 px-3 mr-2"
                            style="font-size: 14px"
                            color="#FFE500"
                            small
                            >加價購</v-chip
                          >
                          <a
                            class="font-weight-bold"
                            style="color: #bf2220"
                            @click="
                              toBrandGroup(recommendProductActive.brand_id)
                            "
                            >{{ recommendProductActive.brand_name }}</a
                          >{{ recommendProductActive.product_name }}
                        </h6>
                        <div class="d-md-none">
                          <!-- 原價與折扣相同時，僅顯示原價 -->
                          <div
                            v-if="
                              recommendProductActive.spec_array[0] &&
                              recommendProductActive.spec_array[0].list_price ==
                                recommendProductActive.spec_array[0]
                                  .discount_price
                            "
                          >
                            <p
                              class="d-flex align-center justify-space-between flex-wrap"
                            >
                              <span class="d-flex align-center mt-4"
                                ><span class="text-h5">
                                  原價${{
                                    recommendProductActive.spec_array[0] &&
                                    recommendProductActive.spec_array[0].list_price.toLocaleString()
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
                                  分享
                                </v-btn>
                                <span
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
                              <span class="d-flex align-center mt-4">
                                <span
                                  v-if="
                                    isLogin &&
                                    isVerified &&
                                    recommendProductActive.expired == 'N'
                                  "
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
                              v-if="
                                recommendProductActive.gifts &&
                                isLogin &&
                                isVerified
                              "
                              class="primary--text d-flex align-center mb-0"
                            >
                              <span class="whitespace-nowrap">限定加贈：</span>
                              <span>{{ recommendProductActive.gifts }}</span>
                            </p>
                            <h6
                              class="text-h6 primary--text mb-3"
                              v-if="
                                recommendProductActive.reward_exclude == 'Y'
                              "
                            >
                              ※本商品不可折抵折價券
                            </h6>
                            <div class="d-flex align-center mb-3">
                              <span
                                v-if="isLogin && isVerified"
                                class="d-flex text-h5 primary--text hide-text align-center mr-2"
                              >
                                <v-btn
                                  text
                                  small
                                  :color="`${
                                    trackProductStatus ? 'primary' : 'black'
                                  }`"
                                  class="d-flex align-center px-1 text-subtitle-1"
                                  @click.stop.prevent="
                                    setProductTrack(
                                      recommendProductActive.item_main_id
                                    )
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

                              <span class="pt-1 mr-2"
                                >{{ trackCount }}人追蹤此商品</span
                              ><v-btn
                                class="ml-1"
                                :outlined="!noticedStatus"
                                elevation="0"
                                small
                                color="secondary"
                                @click.stop.prevent="
                                  setSaleNotice(
                                    recommendProductActive.item_main_id
                                  )
                                "
                              >
                                <i
                                  class="fa-solid fa-volume mr-1"
                                  style="padding-top: 1px"
                                ></i
                                >{{
                                  noticedStatus ? '取消開團提醒' : '開團提醒我'
                                }}
                              </v-btn>
                            </div>
                          </div>
                          <!-- 原價與折扣不相同時，維持原來的 UI -->
                          <div v-else>
                            <div
                              class="d-flex justify-space-between align-center mb-1"
                            >
                              <p
                                class="text-body-2 text-decoration-line-through"
                              >
                                原價${{
                                  recommendProductActive.spec_array[0] &&
                                  recommendProductActive.spec_array[0].list_price.toLocaleString()
                                }}
                              </p>
                              <p
                                v-if="
                                  isLogin &&
                                  isVerified &&
                                  recommendProductActive.expired == 'N'
                                "
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
                                <span
                                  v-if="
                                    recommendProductActive.hide_price == 'Y'
                                  "
                                  class="text-h5"
                                >
                                  驚喜價
                                </span>
                                <span v-else class="text-h5">
                                  {{ getPriceDisplay(recommendProductActive) }}
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
                                v-if="recommendProductActive.gifts"
                                class="primary--text d-flex align-center mb-0"
                              >
                                <span class="whitespace-nowrap"
                                  >限定加贈：</span
                                >
                                <span>{{ recommendProductActive.gifts }}</span>
                              </p>
                              <h6
                                class="text-h6 primary--text mb-3"
                                v-if="
                                  recommendProductActive.reward_exclude == 'Y'
                                "
                              >
                                ※本商品不可折抵折價券
                              </h6>
                              <div class="d-flex align-center mb-3">
                                <span
                                  v-if="isLogin && isVerified"
                                  class="d-flex text-h5 primary--text hide-text align-center mr-2"
                                >
                                  <v-btn
                                    text
                                    small
                                    :color="`${
                                      trackProductStatus ? 'primary' : 'black'
                                    }`"
                                    class="d-flex align-center px-1 text-subtitle-1"
                                    @click.stop.prevent="
                                      setProductTrack(
                                        recommendProductActive.item_main_id
                                      )
                                    "
                                  >
                                    <i
                                      class="fa-heart fa-xl mr-1"
                                      :class="{
                                        'fa-solid': trackProductStatus,
                                        'fa-regular': !trackProductStatus,
                                      }"
                                    ></i
                                    >{{
                                      trackProductStatus ? '已追蹤' : '追蹤'
                                    }}
                                  </v-btn> </span
                                ><span class="pt-1 mr-2"
                                  >{{ trackCount }}人追蹤此商品</span
                                ><v-btn
                                  class="ml-1"
                                  :outlined="!noticedStatus"
                                  elevation="0"
                                  small
                                  color="secondary"
                                  @click.stop.prevent="
                                    setSaleNotice(
                                      recommendProductActive.item_main_id
                                    )
                                  "
                                >
                                  <i
                                    class="fa-solid fa-volume mr-1"
                                    style="padding-top: 1px"
                                  ></i
                                  >{{
                                    noticedStatus
                                      ? '取消開團提醒'
                                      : '開團提醒我'
                                  }}
                                </v-btn>
                              </div>
                            </template>
                            <router-link
                              v-else-if="!isLogin"
                              class="text-h5 primary--text"
                              :to="{
                                path: '/login',
                                query: { redirect: $route.fullPath },
                              }"
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
                            v-if="
                              recommendProductActive.num_price_array &&
                              recommendProductActive.num_price_array.length
                            "
                          >
                            <v-divider class="mb-5"></v-divider>
                            <div>
                              <div class="mb-2">分檻定價</div>
                              <table class="threshold">
                                <tbody>
                                  <tr
                                    v-for="record in recommendProductActive.num_price_array"
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
                              recommendProductActive.activity_raiders_array &&
                              recommendProductActive.activity_raiders_array
                                .length
                            "
                          ></v-divider>
                          <div
                            class="text-h6"
                            v-if="
                              recommendProductActive.activity_raiders_array &&
                              recommendProductActive.activity_raiders_array
                                .length
                            "
                          >
                            <div
                              v-for="(
                                activity, index
                              ) in recommendProductActive.activity_raiders_array"
                              :key="index"
                            >
                              <span
                                class="primary--text red lighten-5 rounded px-2"
                                >活動</span
                              >
                              {{ activity.activity_name }}
                              <router-link
                                :to="activity.releated_link"
                                class="text-decoration-none"
                              >
                                <span
                                  class="text-button blue--text text--darken-2"
                                  >前往查看</span
                                >
                              </router-link>
                            </div>
                          </div>
                          <v-divider class="my-5"></v-divider>
                        </div>
                        <div class="primary--text text-body-2">
                          <p>
                            商品編號：{{ recommendProductActive.product_id }}
                          </p>
                          <p>廠商名稱：{{ recommendProductActive.supplier }}</p>
                          <p v-if="recommendProductActive.brand_id">
                            品牌專區：<a
                              style="color: #000"
                              @click="
                                toBrandGroup(recommendProductActive.brand_id)
                              "
                              >{{ recommendProductActive.brand_name }}</a
                            >
                            <v-btn
                              v-if="isLogin && isVerified"
                              class="ml-1 pb-1 font-weight-bold"
                              text
                              :color="`${
                                trackBrandStatus ? '#5C5B5B' : '#001AFF'
                              }`"
                              @click.stop.prevent="
                                setBrandTrack(recommendProductActive.brand_id)
                              "
                            >
                              {{ trackBrandStatus ? '已追蹤' : '追蹤' }}
                            </v-btn>
                          </p>
                          <p>
                            配送方式：{{
                              recommendProductActive.receive_type_array
                                .map(x => x.text)
                                .join('、')
                            }}
                          </p>
                          <p
                            v-if="
                              recommendProductActive.receive_type_array.filter(
                                x => x.value == '2'
                              ).length
                            "
                          >
                            運費資訊：{{ recommendProductActive.shipping_type }}
                          </p>
                          <div
                            class="d-flex align-center"
                            v-if="recommendProductActive.cart_group_id"
                            @click="
                              toCartGroup(recommendProductActive.cart_group_id)
                            "
                          >
                            <span class="black--text">{{
                              recommendProductActive.group_name
                            }}</span>
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
                        <v-divider class="mt-5 mb-7"></v-divider>
                        <div
                          class="pec-rich-content"
                          v-html="recommendProductActive.content_clob"
                        ></div>
                        <v-chip-group active-class="primary--text" column>
                          <v-chip
                            v-for="(
                              tag, index
                            ) in recommendProductActive.tag_array"
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
                              recommendProductActive.spec_array[0] &&
                              recommendProductActive.spec_array[0].list_price ==
                                recommendProductActive.spec_array[0]
                                  .discount_price
                            "
                          >
                            <p
                              class="d-flex align-center justify-space-between"
                            >
                              <span class="d-flex align-center">
                                <span class="text-h5">
                                  原價${{
                                    recommendProductActive.spec_array[0] &&
                                    recommendProductActive.spec_array[0].list_price.toLocaleString()
                                  }}
                                </span>
                                <v-btn
                                  v-if="isLogin && isVerified"
                                  depressed
                                  class="ml-4 share-btn-pc"
                                  :class="{
                                    'tour-step-backdrop': isOpenTour,
                                  }"
                                  @click="share()"
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
                                  v-if="
                                    isLogin &&
                                    isVerified &&
                                    recommendProductActive.expired == 'N'
                                  "
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
                              v-if="
                                recommendProductActive.gifts &&
                                isLogin &&
                                isVerified
                              "
                              class="primary--text d-flex align-center mb-0"
                            >
                              <span class="whitespace-nowrap">限定加贈：</span>
                              <span>{{ recommendProductActive.gifts }}</span>
                            </p>
                            <h6
                              class="text-h6 primary--text mb-3"
                              v-if="
                                recommendProductActive.reward_exclude == 'Y'
                              "
                            >
                              ※本商品不可折抵折價券
                            </h6>
                            <h6
                              class="text-h6 primary--text mb-3"
                              v-if="
                                !recommendProductActive.reward_amount_limit_ratio
                              "
                            >
                              ※特惠商品，不適用折價券
                            </h6>
                            <h6
                              v-else-if="
                                recommendProductActive.reward_amount_limit_ratio !=
                                1
                              "
                              class="text-h6 primary--text mb-3"
                            >
                              ※折價券折抵上限金額：{{
                                getRewardAmountLimitDisplay(product)
                              }}元
                            </h6>
                          </div>
                          <!-- 原價與折扣不相同時，維持原來的 UI -->
                          <div v-else>
                            <div class="d-flex justify-space-between mb-4">
                              <p
                                class="text-body-2 text-decoration-line-through mb-0"
                              >
                                原價${{
                                  recommendProductActive.spec_array[0] &&
                                  recommendProductActive.spec_array[0].list_price.toLocaleString()
                                }}
                              </p>
                              <p
                                v-if="
                                  isLogin &&
                                  isVerified &&
                                  recommendProductActive.expired == 'N'
                                "
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
                              <p
                                class="primary--text d-flex align-center flex-wrap"
                              >
                                <span>下殺價格：</span>
                                <span
                                  v-if="
                                    recommendProductActive.hide_price == 'Y'
                                  "
                                  class="text-h5"
                                >
                                  驚喜價
                                </span>
                                <span v-else class="text-h5">
                                  {{ getPriceDisplay(recommendProductActive) }}
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
                                  v-if="
                                    recommendProductActive.reward_exclude == 'Y'
                                  "
                                  style="width: 100%"
                                >
                                  ※本商品不可折抵折價券
                                </span>
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
                                v-if="recommendProductActive.gifts"
                                class="primary--text d-flex align-center mb-0"
                              >
                                <span class="whitespace-nowrap"
                                  >限定加贈：</span
                                >
                                <span>{{ recommendProductActive.gifts }}</span>
                              </p>
                            </template>
                            <router-link
                              v-else-if="!isLogin"
                              class="text-h5 primary--text"
                              :to="{
                                path: '/login',
                                query: { redirect: $route.fullPath },
                              }"
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
                                :color="`${
                                  trackProductStatus ? 'primary' : 'black'
                                }`"
                                class="d-flex align-center px-1 text-subtitle-1"
                                @click.stop.prevent="
                                  setProductTrack(
                                    recommendProductActive.item_main_id
                                  )
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
                            ><span
                              v-if="isLogin && isVerified"
                              class="ml-2 pt-1"
                              >{{ trackCount }}人追蹤此商品</span
                            ><v-btn
                              v-if="isLogin && isVerified"
                              class="ml-3"
                              :outlined="!noticedStatus"
                              elevation="0"
                              small
                              color="secondary"
                              @click.stop.prevent="
                                setSaleNotice(
                                  recommendProductActive.item_main_id
                                )
                              "
                            >
                              <i
                                class="fa-solid fa-volume mr-1"
                                style="padding-top: 1px"
                              ></i
                              >{{
                                noticedStatus ? '取消開團提醒' : '開團提醒我'
                              }}
                            </v-btn>
                          </div>
                          <div>
                            <table class="threshold">
                              <tbody>
                                <tr
                                  v-for="record in recommendProductActive.num_price_array"
                                  :key="record.num_price_id"
                                >
                                  <td class="bl b">成團</td>
                                  <td class="b">{{ record.num }}件</td>
                                  <td class="b primary--text">下殺</td>
                                  <td class="b br">
                                    ${{ record.price.toLocaleString() }}
                                  </td>
                                  <td class="primary--text"></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <v-divider class="mt-7"></v-divider>
                        </div>
                        <table>
                          <tbody>
                            <tr>
                              <td class="pb-9">累積 / 成團件數：</td>
                              <td class="pl-5 pb-9">
                                <div
                                  v-if="
                                    recommendProductActive.hide_order_num == 'Y'
                                  "
                                >
                                  熱銷中
                                </div>
                                <div v-else-if="!isLogin || !isVerified">
                                  累積:{{
                                    recommendProductActive.order_num_with_ratio +
                                    recommendProductActive.acc_order_num
                                  }}件 成團:{{
                                    recommendProductActive.goal_num
                                  }}件
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
                                        recommendProductActive.order_num_with_ratio +
                                        recommendProductActive.acc_order_num
                                      }}件 成團:{{
                                        recommendProductActive.goal_num
                                      }}
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
                                      v-for="item in recommendProductActive.product_area_order_num"
                                      :key="item.receive_area"
                                      :disabled="
                                        !$dayjs().isBetween(
                                          $dayjs(
                                            recommendProductActive.start_date
                                          ),
                                          $dayjs(
                                            recommendProductActive.end_date
                                          )
                                        ) ||
                                        recommendProductActive.tb_status != null
                                      "
                                    >
                                      <v-list-item-title
                                        >{{ item.receive_area_name }}
                                      </v-list-item-title>
                                      <v-list-item-action>
                                        {{ item.order_num_with_ratio }}
                                      </v-list-item-action>
                                    </v-list-item>
                                    <v-list-item
                                      v-if="
                                        recommendProductActive.acc_order_num
                                      "
                                    >
                                      <v-list-item-title
                                        >已售出</v-list-item-title
                                      >
                                      <v-list-item-action>
                                        {{
                                          recommendProductActive.acc_order_num
                                        }}
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
                                取貨廠區滿{{
                                  recommendProductActive.goal_num
                                }}件成團
                              </td>
                            </tr>
                            <tr>
                              <td class="pb-9" v-if="hasReceiveType2">
                                促銷期間：
                              </td>
                              <td class="pb-9" v-else>截止日：</td>
                              <td class="pl-5 pb-9">
                                <v-chip
                                  v-if="
                                    new Date(
                                      recommendProductActive.start_date
                                    ) > new Date()
                                  "
                                  label
                                  small
                                  color="primary"
                                  >即將開團</v-chip
                                >
                                <countdown
                                  v-else-if="
                                    $dayjs(
                                      recommendProductActive.end_date
                                    ).diff($dayjs(), 'second') <
                                      60 * 60 * 24 &&
                                    0 <
                                      $dayjs(
                                        recommendProductActive.end_date
                                      ).diff($dayjs(), 'second')
                                  "
                                  :end-date="recommendProductActive.end_date"
                                ></countdown>
                                <v-chip v-else label color="primary">
                                  {{
                                    relativeTime(
                                      recommendProductActive.end_date
                                    )
                                  }}
                                  ({{
                                    $dayjs(
                                      recommendProductActive.end_date
                                    ).format('YYYY-MM-DD HH:mm:ss')
                                  }})
                                </v-chip>
                              </td>
                            </tr>
                            <tr
                              v-if="
                                recommendProductActive.estimate_arrival_date &&
                                !recommendProductActive.arrival_time_memo
                              "
                            >
                              <td class="pb-9">預計到貨日：</td>
                              <td class="pl-5 pb-9 primary--text">
                                {{
                                  recommendProductActive.estimate_arrival_date.substring(
                                    0,
                                    10
                                  )
                                }}
                              </td>
                            </tr>
                            <tr
                              v-else-if="
                                hasReceiveType2 &&
                                recommendProductActive.arrival_time_memo
                              "
                            >
                              <td class="pb-9">到貨時間：</td>
                              <td class="pl-5 pb-9 primary--text">
                                {{ recommendProductActive.arrival_time_memo }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-card class="px-4 elevation-0">
                        <v-tabs color="primary" v-model="recommendTab">
                          <v-tab>商品介紹</v-tab>
                          <v-tab>商品規格</v-tab>
                          <v-tab
                            v-if="recommendProductActive.teambuy_price_desc"
                            >團購條件規則</v-tab
                          >
                          <v-tab>產品評論</v-tab>
                        </v-tabs>
                        <v-tabs-items class="pt-4" v-model="recommendTab">
                          <v-tab-item>
                            <v-card flat>
                              <div
                                class="pec-rich-content"
                                v-html="
                                  recommendProductActive.content_clob_full
                                "
                              ></div>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item>
                            <div class="pa-2">
                              <table class="kv-table">
                                <tr v-if="recommendProductActive.origin">
                                  <td>產地</td>
                                  <td>
                                    {{ recommendProductActive.origin }}
                                  </td>
                                </tr>
                                <tr
                                  v-if="recommendProductActive.store_type_name"
                                >
                                  <td>進貨溫層</td>
                                  <td>
                                    {{ recommendProductActive.store_type_name }}
                                  </td>
                                </tr>
                                <tr
                                  v-for="record in recommendProductActive.kv_array"
                                  :key="record.id"
                                >
                                  <td>{{ record.name }}</td>
                                  <td>{{ record.value }}</td>
                                </tr>
                              </table>
                            </div>
                          </v-tab-item>
                          <v-tab-item
                            v-if="recommendProductActive.teambuy_price_desc"
                          >
                            <div class="pa-2">
                              {{ recommendProductActive.teambuy_price_desc }}
                            </div>
                          </v-tab-item>
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
                                      <v-chip
                                        label
                                        class="pa-2 d-flex"
                                        color="primary"
                                      >
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
                                  <div
                                    class="pt-2 pl-2 grey--text text--lighten-1"
                                  >
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
                                    ? Math.floor(
                                        commentArray.length / pageSize
                                      ) + 1
                                    : commentArray.length / pageSize
                                "
                                :total-visible="7"
                                @input="updatePage"
                              ></v-pagination>
                            </div>
                          </v-tab-item>
                        </v-tabs-items>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="2" class="d-none d-md-block">
                  <div class="side-scrollbar">
                    <div style="position: sticky; top: 0px; z-index: 10">
                      <div
                        class="white--text text-center pa-1"
                        style="background-color: #d96f20"
                      >
                        相關{{ mainTab == 0 ? '加購' : '推薦' }}品
                      </div>
                    </div>
                    <div
                      class="pa-4 recommend-product-card"
                      v-for="(item, index) in recommendProductArray"
                      :key="item.id"
                      :class="{ active: recommendProductActiveIndex == index }"
                      @click="selectRecommendProduct(index, item)"
                    >
                      <v-badge
                        color="red"
                        :value="item.cart_num !== 0"
                        :content="`${item.cart_num}`"
                        offset-x="10"
                        offset-y="10"
                        ><v-img :width="118" :src="item.img_url"></v-img
                      ></v-badge>
                      <div>
                        <v-chip
                          v-if="mainTab == 0"
                          class="my-2 px-3 mr-2"
                          style="font-size: 14px"
                          color="#FFE500"
                          small
                          >加價購</v-chip
                        >
                      </div>
                      <div
                        class="mb-1"
                        style="
                          overflow: hidden;
                          text-overflow: ellipsis;
                          display: -webkit-box;
                          line-clamp: 4;
                          -webkit-line-clamp: 4;
                          -webkit-box-orient: vertical;
                        "
                      >
                        {{ item.product_name }}
                      </div>
                      <div class="text-body-2">
                        {{ mainTab == 0 ? '加購價' : '下殺價格'
                        }}<span class="mx-1">$</span
                        ><span class="text-h5 primary--text">{{
                          item.min_discount_price
                        }}</span>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card>

      <div class="add-on-footer">
        <div class="d-block d-md-none" style="background-color: #c9c9c9">
          <div v-if="mainTab == 0" class="splide" role="group">
            <div class="splide__track">
              <div class="splide__list">
                <div
                  class="splide__slide"
                  v-for="(product, index) in addOnProductArray"
                  :key="index"
                >
                  <div class="ma-2">
                    <v-card
                      class="add-on-product-card-mobile d-flex pa-1"
                      @click="selectAddOnProduct(index, item)"
                    >
                      <div class="mr-2 d-flex align-center" style="width: 80px">
                        <v-badge
                          color="red"
                          :value="product.cart_num !== 0"
                          :content="`${product.cart_num}`"
                          offset-x="18"
                          offset-y="18"
                        >
                          <v-img
                            :width="80"
                            :height="80"
                            :src="product.img_url"
                          ></v-img>
                        </v-badge>
                      </div>
                      <div style="flex: 0 1 auto">
                        <div
                          style="
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            line-clamp: 2;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            font-size: 12px;
                            line-height: 2;
                            min-height: 49px;
                          "
                        >
                          <v-chip
                            v-if="mainTab == 0"
                            class="px-3 mr-2"
                            style="font-size: 12px"
                            color="#FFE500"
                            small
                            >加價購</v-chip
                          >{{ product.product_name }}
                        </div>
                        <div class="text-body-2">
                          加購價<span class="mx-1">$</span
                          ><span class="text-h5 primary--text">{{
                            product.min_discount_price
                          }}</span>
                        </div>
                      </div>
                    </v-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="splide" role="group">
            <div class="splide__track">
              <div class="splide__list">
                <div
                  class="splide__slide"
                  v-for="(product, index) in recommendProductArray"
                  :key="index"
                >
                  <div class="ma-2">
                    <v-card
                      class="add-on-product-card-mobile d-flex pa-1"
                      @click="selectRecommendProduct(index, item)"
                    >
                      <div class="mr-2 d-flex align-center" style="width: 80px">
                        <v-badge
                          color="red"
                          :value="product.cart_num !== 0"
                          :content="`${product.cart_num}`"
                          offset-x="18"
                          offset-y="18"
                        >
                          <v-img
                            :width="80"
                            :height="80"
                            :src="product.img_url"
                          ></v-img>
                        </v-badge>
                      </div>
                      <div style="flex: 0 1 auto">
                        <div
                          style="
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            line-clamp: 2;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            font-size: 12px;
                            line-height: 2;
                            min-height: 49px;
                          "
                        >
                          <v-chip
                            v-if="mainTab == 0"
                            class="px-3 mr-2"
                            style="font-size: 12px"
                            color="#FFE500"
                            small
                            >加價購</v-chip
                          >{{ product.product_name }}
                        </div>
                        <div class="text-body-2">
                          {{ mainTab == 0 ? '加購價' : '下殺價格'
                          }}<span class="mx-1">$</span
                          ><span class="text-h5 primary--text">{{
                            product.min_discount_price
                          }}</span>
                        </div>
                      </div>
                    </v-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="mainTab == 0"
          class="d-flex justify-center align-center add-on-footer-info"
        >
          超值優惠！<span style="text-wrap: nowrap"
            >每筆訂單可加購多個商品，搭配購買更划算！</span
          >
        </div>
        <div class="py-3 py-md-3 d-flex justify-center">
          <v-btn
            size="x-large"
            depressed
            outlined
            color="primary"
            tile
            height="44px"
            class="add-on-product-btn"
            @click="closeAddOnDialog()"
          >
            關閉視窗
          </v-btn>
          <v-btn
            v-if="
              mainTab == 0 && addOnProductActive.delivered_in_person !== 'Y'
            "
            color="primary"
            tile
            large
            class="ml-3 add-on-product-btn"
            @click="addOnCta('cart')"
          >
            加入購物車
          </v-btn>
          <v-btn
            v-if="
              mainTab == 1 && recommendProductActive.delivered_in_person !== 'Y'
            "
            color="primary"
            tile
            large
            class="ml-3 add-on-product-btn"
            @click="recommendCta('cart')"
          >
            加入購物車
          </v-btn>
        </div>
      </div>
      <v-overlay
        class="align-end w-100"
        :absolute="true"
        v-model="overlay"
        @click="overlay = false"
        contained
      >
        <div class="elevation-24 w-100" @click.stop>
          <product-form
            v-if="mainTab == 0"
            :product="addOnProductActive"
            :is-loading="isFormLoading"
            :button-text="buttonText"
            :area-order-num-array="addOnProductActive.product_area_order_num"
            @submit="submit"
            order-num="1"
            :receive-area="receiveAreaInProfile"
            :key="addOnProductActive.product_id"
          ></product-form>
          <product-form
            v-else-if="mainTab == 1"
            :product="recommendProductActive"
            :is-loading="isFormLoading"
            :button-text="buttonText"
            :area-order-num-array="
              recommendProductActive.product_area_order_num
            "
            @submit="submit"
            order-num="1"
            :receive-area="receiveAreaInProfile"
            :key="recommendProductActive.product_id"
          ></product-form>
        </div>
      </v-overlay>
      <v-overlay
        class="align-center justify-center w-100"
        :absolute="true"
        v-model="loadingOverlay"
      >
        <div class="d-flex justify-center">
          <v-progress-circular
            color="white"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-overlay>
    </v-sheet>
    <v-dialog
      v-model="dialogForProductNotice"
      class="rounded-0"
      persistent
      max-width="min(620px, 80vh)"
    >
      <v-sheet
        v-if="recommendProductActive.spec_array.some(x => x.notice == 'Y')"
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
            @click.stop.prevent="
              setProductTrack(recommendProductActive.item_main_id)
            "
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
          <v-row>
            <v-col cols="4" sm="3" md="3" class="pa-0 pt-4 pa-md-4 pt-md-4">
              <v-img
                max-height="150"
                max-width="150"
                :src="recommendProductActive.img_url_array[0].img_url"
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
                    {{ recommendProductActive.product_name }}
                  </h6>
                </div>
                <div style="width: 100%">
                  <v-select
                    v-model="productNotice_spec_id"
                    label="規格"
                    :items="recommendProductActive.spec_array"
                    item-text="spec_name"
                    item-value="spec_id"
                    variant="underlined"
                    :rules="[v => !!v || '請選擇商品規格']"
                    required
                  ></v-select>
                  <div class="primary--text">
                    <span>下殺價格：</span>
                    <span class="text-h5">
                      {{ getPriceDisplay(recommendProductActive) }}
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
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { apiAxios } from '@/api'
import Splide from '@splidejs/splide'

export default {
  props: {
    backgroungUrl: {
      type: String,
      default: '',
    },
    propsAddOnProductArray: {
      type: Array,
      default: () => [],
    },
    propsRecommendProductArray: {
      type: Array,
      default: () => [],
    },
    from: {
      type: String,
      default: 'product',
    },
    addOnId: {
      type: Number,
      default: 0,
    },
    recommendId: {
      type: Number,
      default: 0,
    },
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
      mainTab: null,
      items: ['全站加價購', '推薦商品'],
      addOnProductArray: [],
      // addOnProductActiveIndex: 0,
      addOnProductActive: {
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
      recommendProductArray: [],
      // recommendProductActiveIndex: 0,
      recommendProductActive: {
        product_name: '',
        spec_array: [],
        num_price_array: [],
        category_array: [],
        img_url_array: [
          {
            img_url: '',
          },
        ],
        kv_array: [],
        receive_type_array: [],
        receive_area_array: [],
        payment_type_array: null,
        payment_area_array: null,
        activity_raiders_array: [],
        tag_array: [],
        product_area_order_num: [],
      },
      isOpenTour: false,
      likeMark: 0,
      trackProductStatus: false,
      trackCount: 0,
      noticedStatus: false,
      trackBrandStatus: false,
      overlay: false,
      loadingOverlay: false,
      isFormLoading: false,
      actionType: '',
      splide: null,
      cartIdArray: [],
      galleryKey: null,
      addOnTab: 0,
      recommendTab: 0,
      product: {},
      splideInstance: null,
      commentArray: [],
      showCommentArray: [],
      page: 1,
      pageSize: 6,
      emailRules: [
        v => !!v || '信箱為必填項目',
        v => /.+@.+\..+/.test(v) || '請輸入有效信箱',
      ],
    }
  },
  mounted() {
    this.initSplide()
    this.getEcPlatform()
    if (this.$store.state.profile.email) {
      this.productNotice_email = this.$store.state.profile.email
    }
    if (this.addOnProductArray.length == 0) {
      this.mainTab = 1
    }
  },
  beforeDestroy() {
    this.splide.destroy()
  },
  watch: {
    propsAddOnProductArray: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.addOnProductArray = JSON.parse(
            JSON.stringify(this.propsAddOnProductArray)
          )
          this.getAddOnProduct(
            this.addOnProductArray[this.addOnProductActiveIndex].product_id
          )
        }
      },
    },
    propsRecommendProductArray: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.recommendProductArray = JSON.parse(
            JSON.stringify(this.propsRecommendProductArray)
          )
          this.getRecommendProduct(
            this.recommendProductArray[this.recommendProductActiveIndex]
              .product_id
          )
        }
      },
    },
    imageItems() {
      // Update galleryKey with the current timestamp to force re-render
      this.galleryKey = Date.now()
    },
    addOnProductActiveIndex() {
      this.getAddOnProduct(
        this.addOnProductArray[this.addOnProductActiveIndex].product_id
      )
      const dialogContent = this.$refs.dialogContent
      if (dialogContent) {
        dialogContent.scrollTop = 0
      }
      this.addOnTab = 0
    },
    recommendProductActiveIndex() {
      this.getRecommendProduct(
        this.recommendProductArray[this.recommendProductActiveIndex].product_id
      )
      const dialogContent = this.$refs.dialogContent
      if (dialogContent) {
        dialogContent.scrollTop = 0
      }
      this.recommendTab = 0
    },
    recommendProductActive() {
      this.getCommentAndLike(this.recommendProductActive.product_id)
      this.noticedStatus =
        this.recommendProductActive.noticed == 'Y' ? true : false
      this.trackCount = this.recommendProductActive.product_track_count
      this.trackProductStatus =
        this.recommendProductActive.product_track_status == 'Y' ? true : false
      this.trackBrandStatus =
        this.recommendProductActive.brand_track_status == 'Y' ? true : false
    },
    mainTab() {
      this.$emit('changeTab', this.mainTab)
      this.getCommentAndLike(this.recommendProductActive.product_id)
      this.noticedStatus =
        this.recommendProductActive.noticed == 'Y' ? true : false
      this.trackCount = this.recommendProductActive.product_track_count
      this.trackProductStatus =
        this.recommendProductActive.product_track_status == 'Y' ? true : false
      this.trackBrandStatus =
        this.recommendProductActive.brand_track_status == 'Y' ? true : false
    },
  },
  methods: {
    selectAddOnProduct(index) {
      this.addOnProductActiveIndex = index
    },
    selectRecommendProduct(index) {
      this.recommendProductActiveIndex = index
    },
    getAddOnProduct(productId) {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductV2',
        params: { v: '2' },
        data: {
          product_id: productId,
          prefix: 'asd',
        },
      }).then(res => {
        this.addOnProductActive = res.result[0]

        this.$nextTick(() => {
          let element = document.querySelector('.add-on-product-card.active')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }

          if (this.splide) {
            this.splide.go(this.addOnProductActiveIndex)
          }
        })
      })
    },
    getRecommendProduct(productId) {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductV2',
        params: { v: '2' },
        data: {
          product_id: productId,
          prefix: 'asd',
        },
      }).then(res => {
        this.recommendProductActive = res.result[0]

        this.$nextTick(() => {
          let element = document.querySelector('.recommend-product-card.active')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }

          if (this.splide) {
            this.splide.go(this.recommendProductActiveIndex)
          }
        })
      })
    },
    scrollToTop() {
      this.$nextTick(() => {
        // 獲取 v-dialog 的內容部分並滾動到頂部
        const dialogContent = this.$refs.dialogContent
        if (dialogContent) {
          dialogContent.scrollTop = 0
        }
      })
    },
    initSplide() {
      this.$nextTick(() => {
        this.splide = new Splide(this.$el.querySelector('.splide'), {
          perPage: 1,
          pagination: false,
          trimSpace: 'move',
          padding: {
            right: '5rem',
          },
        })
        this.splide.mount()
      })
    },
    remount() {
      this.$nextTick(() => {
        this.splide.destroy()
        this.splide.mount()
      })
    },
    submit(spec) {
      if (this.from == 'cart') {
        this.$emit('closeAddOnDialog', spec)
        this.overlay = false
      } else {
        this.actionType == 'buy' ? this.buyNow(spec) : this.addToCart(spec)
      }
    },
    //調整為加入隱藏購物車InsertCartItem
    addToCart(payload) {
      return apiAxios({
        method: 'post',
        url: '/Cart/InsertCartItemV2',
        data: {
          spec_id: payload.specId,
          receive_type: payload.receiveType,
          receive_area: payload.receiveType === '1' ? payload.receiveArea : '',
          order_num: payload.orderNum,
          section_name:
            this.mainTab == 0
              ? 'ga-cart-recommend-upsell-entry'
              : 'ga-cart-recommend-product-entry',
          target_product_id: 0,
          current_path: '',
          previous_path: '',
          add_from: '',
          utm_campaign: '',
          utm_content: '',
        },
      }).then(res => {
        this.overlay = false
        this.cartIdArray.push(res.result)
        if (this.mainTab == 0) {
          this.addOnProductArray = this.addOnProductArray.map(product => {
            if (product.product_id === payload.productId) {
              return {
                ...product,
                cart_num: product.cart_num + parseInt(payload.orderNum, 10),
              }
            }
            return product
          })
          this.$nextTick(() => {
            let element = document.querySelector('.add-on-product-card.active')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            if (this.splide) {
              this.splide.go(this.addOnProductActiveIndex)
            }
          })
        } else {
          this.recommendProductArray = this.recommendProductArray.map(
            product => {
              if (product.product_id === payload.productId) {
                return {
                  ...product,
                  cart_num: product.cart_num + parseInt(payload.orderNum, 10),
                }
              }
              return product
            }
          )
          this.$nextTick(() => {
            let element = document.querySelector(
              '.recommend-product-card.active'
            )
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            if (this.splide) {
              this.splide.go(this.recommendProductActiveIndex)
            }
          })
        }
        this.$snackbar.add(`成功加入購物車`, { color: 'success' })
        // this.fetchAddOnData()
      })
    },
    // buyNow(payload) {
    //   this.isFormLoading = true
    //   return apiAxios({
    //     method: 'post',
    //     url: '/Cart/InsertCartItem',
    //     data: {
    //       spec_id: payload.specId,
    //       receive_type: payload.receiveType,
    //       receive_area: payload.receiveType === '1' ? payload.receiveArea : '',
    //       order_num: payload.orderNum,
    //     },
    //   })
    //     .then(() => {
    //       this.fetchAddOnData()
    //       // this.$router.push({
    //       //   name: 'Checkout',
    //       //   params: {
    //       //     cartIdArray: [res.result],
    //       //     deliveredInPerson: this.product.delivered_in_person == 'Y',
    //       //   },
    //       // })
    //     })
    //     .finally(() => {
    //       this.sheet = false
    //       this.isFormLoading = false
    //     })
    // },
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
    relativeTime(dateString) {
      return this.$dayjs().to(this.$dayjs(dateString))
    },
    share() {
      this.isOpenTour = false
      if (this.canShare) {
        const shareData = {
          title: '統一團購網',
          text: this.recommendProductActive.product_name,
          url: `https://unilife.pec.com.tw/product/${this.recommendProductActive.product_id}`,
        }
        navigator.share(shareData)
      } else if (this.canShareMobile) {
        const shareData = {
          title: '統一團購網',
          text: this.recommendProductActive.product_name,
          url:
            (this.isAndroid ? ' ' : '') +
            `https://unilife.pec.com.tw/product/${this.recommendProductActive.product_id}`,
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
    closeAddOnDialog() {
      this.$emit('closeAddOnDialog', this.cartIdArray)
    },
    addOnCta(actionType) {
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type:
          this.from === 'cart'
            ? 'ga-cart-recommend-upsell-content'
            : 'ga-buy-now-recommend-upsell-content',
        content_id: this.addOnProductActive.product_id,
      })
      if (this.addOnProductActive.purchase_instruction) {
        this.$dialog.show(this.addOnProductActive.purchase_instruction, {
          title: '系統訊息',
        })
      } else if (
        !this.$dayjs().isBetween(
          this.$dayjs(this.addOnProductActive.start_date),
          this.$dayjs(this.addOnProductActive.end_date)
        )
      ) {
        this.$dialog.show('商品尚未或是已經結束販售', {
          title: '系統訊息',
        })
      } else {
        this.actionType = actionType
        this.overlay = true
      }
    },
    recommendCta(actionType) {
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type:
          this.from === 'cart'
            ? 'ga-cart-recommend-product-content'
            : 'ga-buy-now-recommend-product-content',
        content_id: this.recommendProductActive.product_id,
      })
      if (this.recommendProductActive.purchase_instruction) {
        this.$dialog.show(this.recommendProductActive.purchase_instruction, {
          title: '系統訊息',
        })
      } else if (
        !this.$dayjs().isBetween(
          this.$dayjs(this.recommendProductActive.start_date),
          this.$dayjs(this.recommendProductActive.end_date)
        )
      ) {
        this.$dialog.show('商品尚未或是已經結束販售', {
          title: '系統訊息',
        })
      } else {
        this.actionType = actionType
        this.overlay = true
      }
    },
    fetchAddOnData() {
      this.$emit('fetchAddOnData')
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
    getCommentAndLike(productId) {
      return apiAxios({
        method: 'post',
        url: '/Comment/GetProductPageInfo',
        data: { product_id: productId, prefix: 'asd' },
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
      const dialogContent = this.$refs.dialogContent
      if (dialogContent) {
        dialogContent.scrollTop = 800
      }
      this.recommendTab = 2
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
    insertProductNotice() {
      if (this.$refs.form.validate()) {
        return apiAxios({
          method: 'post',
          url: '/ProductNotice/InsertProductNotice',
          data: {
            product_id: this.recommendProductActive.product_id,
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
  },
  computed: {
    ...mapState(['isAndroid']),
    ...mapGetters(['isLogin', 'isVerified']),
    recommendProductActiveIndex: {
      get() {
        // 取得 prop 的值
        return this.recommendId
      },
      set(value) {
        // 透過 emit 事件來通知父組件進行更新
        this.$emit('update:recommendId', value)
      },
    },
    addOnProductActiveIndex: {
      get() {
        return this.addOnId
      },
      set(value) {
        this.$emit('update:spcloffId', value)
      },
    },
    imageItems() {
      return this.mainTab == 0
        ? this.addOnProductActive?.img_url_array || []
        : this.recommendProductActive?.img_url_array
    },
    showQuota() {
      return (
        this.addOnProductActive.inv_num != null ||
        this.addOnProductActive.spec_array.some(x => x.inv_num != null)
      )
    },
    quota() {
      if (this.addOnProductActive.inv_num != null) {
        return (
          this.addOnProductActive.inv_num -
          (this.prefix === 'asd'
            ? this.addOnProductActive.order_num_with_ratio
            : 0)
        )
      } else if (
        this.addOnProductActive.spec_array.some(x => x.inv_num != null)
      ) {
        return (
          this.addOnProductActive.spec_array.reduce(
            (acc, cur) => acc + cur.inv_num,
            0
          ) -
          (this.prefix === 'asd'
            ? this.addOnProductActive.order_num_with_ratio
            : 0)
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
      return this.addOnProductActive.receive_type_array.some(
        x => x.value == '1'
      )
    },
    hasReceiveType2() {
      return this.addOnProductActive.receive_type_array.some(
        x => x.value == '2'
      )
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
  },
}
</script>

<style scoped>
.add-on-product-btn {
  max-width: 250px;
  width: 100%;
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
.add-on-product-card {
  background-color: #ebebeb;
  transition: all 0.3s;
  border-right: 6px solid #ebebeb;
  margin-bottom: 2px;
  cursor: pointer;
}
.add-on-product-card:hover {
  background-color: #e4e4e4;
}
.add-on-product-card.active {
  background-color: #fff;
  border-right: 6px solid #d96f20;
  transition: all 0.3s;
}
.recommend-product-card {
  background-color: #ebebeb;
  transition: all 0.3s;
  border-right: 6px solid #ebebeb;
  margin-bottom: 2px;
  cursor: pointer;
}
.recommend-product-card:hover {
  background-color: #e4e4e4;
}
.recommend-product-card.active {
  background-color: #fff;
  border-right: 6px solid #d96f20;
  transition: all 0.3s;
}
:deep(.v-overlay__content) {
  width: 100%;
}
.main-title {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal;
  display: flex;
  min-height: 56px;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.main-content {
  max-height: calc(80vh - 100px);
  overflow: auto;
}
.main-content.active {
  max-height: calc(80vh - 150px);
}
.main-content__center {
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.add-on-product-card-mobile {
  min-height: 89px;
}
.side-scrollbar {
  max-height: calc(80vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 0px;
}
.side-scrollbar::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.add-on-footer {
  border-top: none;
}
.add-on-footer-info {
  height: 50px;
  background-color: #ffe500;
  font-size: 24px;
  font-weight: bold;
}
@media (max-width: 959px) {
  .add-on-footer {
    background-color: #f8f8f8;
    border-top: 2px solid #d86816;
  }
  .add-on-footer-info {
    font-size: 16px;
    text-align: center;
    flex-wrap: wrap;
    line-height: 1;
  }
  .main-content {
    max-height: calc(-223px + 100vh);
  }
  .main-content.active {
    max-height: calc(-273px + 100vh);
  }

  .main-title {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: normal;
    flex-wrap: wrap;
    padding: 5px 10px;
    font-weight: bold;
  }
  .main-content__center {
    border: none;
  }
}
@media (max-width: 767px) {
  .tour-step-backdrop::after {
    width: 180%;
    white-space: pre-wrap;
  }
  .add-on-product-btn {
    max-width: 170px;
    width: 100%;
  }
}
@media (max-width: 374px) {
  .tour-step-backdrop::after {
    width: 130%;
  }
}
</style>
