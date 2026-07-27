<template>
  <v-app v-scroll="onScroll">
    <v-app-bar
      app
      :height="$vuetify.breakpoint.mobile ? 72 : PCHotKeyWordsH"
      color="white"
      fixed
      scroll-off-screen
      hide-on-scroll
      :extended="$vuetify.breakpoint.mobile && extended"
      :extension-height="mobileHotKeyWordsH"
    >
      <div class="flex-grow-1">
        <div
          class="body-2 text-right d-none d-md-flex justify-end align-bassline"
        >
          <template v-if="isLogin">
            您好，
            <img
              class="mr-1"
              :width="20"
              aspect-ratio="1/1"
              :src="membershipInfo.currentGradeImgUrl"
            />
            <span
              class="mr-1"
              :style="`color:${membershipInfo.currentGradeColor}`"
              >{{ membershipInfo.currentGrade }}
            </span>
            <span class="mr-1 primary--text">{{ displayName || userId }}</span>
            <span>|</span>
            <router-link class="mx-1 text-decoration-none" to="/member-centre">
              會員中心
            </router-link>
            <span>|</span>
            <a class="mx-1 text-decoration-none" @click="logout">登出</a>
            <span>|</span>
          </template>
          <template v-else>
            <router-link class="mr-1 text-decoration-none" to="/login">
              會員登入
            </router-link>
            <span>|</span>
            <router-link v-if="showRegister" class="mx-1" to="/register">
              註冊
            </router-link>
            <span v-if="showRegister">|</span>
          </template>
          <router-link class="ml-1 text-decoration-none" to="/">
            回首頁
          </router-link>
        </div>
        <div class="d-flex align-center justify-space-between">
          <router-link to="/" class="flex-grow-0">
            <v-img
              eager
              alt="Logo"
              :width="$vuetify.breakpoint.xsOnly ? 160 : 320"
              src="/logo.jpg"
            />
          </router-link>
          <v-menu offset-y nudge-width="-90" ref="PCMenu">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mx-2 pec-search-input d-none d-md-flex"
                :placeholder="
                  featuredKeywords ? featuredKeywords : '請輸入關鍵字'
                "
                v-model="q"
                outlined
                hide-details
                rounded
                dense
                @keydown.enter="toSearch()"
                color="warning"
                v-bind="attrs"
                v-on="on"
                ref="inputWidth"
                @compositionstart="isComposing = true"
                @compositionend="compositionend"
              >
                <template #append>
                  <!-- <v-btn
                    v-if="isLogin"
                    depressed
                    color="warning"
                    tile
                    height="40"
                    @click="
                      isComposing = false
                      isAiSearch = 'N'
                      toSearch()
                    "
                    >測試搜尋</v-btn
                  > -->
                  <v-btn
                    depressed
                    color="primary"
                    tile
                    height="40"
                    class="rounded-r-xl"
                    @click="
                      isComposing = false
                      isAiSearch = 'Y'
                      toSearch()
                    "
                    >智能搜尋</v-btn
                  >
                </template>
              </v-text-field>
            </template>
            <v-list dense>
              <template v-if="userKeywords.length">
                <v-subheader class="d-flex justify-space-between">
                  <span>最近查詢</span>
                  <v-img
                    eager
                    src="/delete_forever.svg"
                    max-width="18"
                    @click.stop.prevent="delAllKeywords"
                  ></v-img>
                </v-subheader>
                <v-list-item v-for="(item, index) in userKeywords" :key="index">
                  <v-list-item-content
                    @click="
                      isComposing = false
                      toSearch(item.keywords)
                    "
                  >
                    {{ item.keywords }}
                  </v-list-item-content>
                  <v-list-item-icon
                    @click.stop.prevent="delKeywords(item.keywords, index)"
                  >
                    <background-svg
                      backgroungUrl="/close.svg"
                      width="18px"
                      height="18px"
                      color="#898989"
                    ></background-svg>
                  </v-list-item-icon>
                </v-list-item>
              </template>
              <template v-else>
                <v-subheader class="d-flex justify-center">
                  <span>無最近查詢</span>
                </v-subheader>
              </template>
            </v-list>
          </v-menu>
          <v-spacer class="d-md-none"></v-spacer>
          <!-- 手機版搜尋介面從這開始 -->
          <template class="d-md-none">
            <v-dialog
              v-model="keyWordsInterface"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="warning"
                  height="40"
                  class="d-md-none"
                  v-bind="attrs"
                  v-on="on"
                  @click="checkPath()"
                >
                  <!-- <v-img src="/search.svg" eager max-width="18"></v-img> -->
                  <background-svg
                    backgroungUrl="/search.svg"
                    width="18px"
                    height="18px"
                    color="#ca1f1d"
                  ></background-svg>
                </v-btn>
              </template>
              <v-card class="rounded-0">
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="keyWordsInterface = false">
                    <!-- <v-img
                      src="/keyboard_backspace.svg"
                      eager
                      max-width="18"
                    ></v-img> -->
                    <background-svg
                      backgroungUrl="/keyboard_backspace.svg"
                      width="18px"
                      height="18px"
                      color="#fff"
                    ></background-svg>
                  </v-btn>
                  <v-text-field
                    class="mx-2 pec-search-input"
                    :placeholder="
                      featuredKeywords ? featuredKeywords : '請輸入關鍵字'
                    "
                    v-model="q"
                    outlined
                    hide-details
                    rounded
                    dense
                    color="warning"
                    @keydown.enter="toSearch()"
                    filled
                    @compositionstart="isComposing = true"
                    @compositionend="compositionend"
                  >
                    <template #append>
                      <!-- <div
                        class="search-btn"
                        @click.stop.prevent="
                          isComposing = false
                          isAiSearch = 'N'
                          toSearch()
                        "
                      >
                        <i
                          class="far fa-hammer"
                          style="
                            padding-bottom: 2px;
                            font-size: 17px;
                            color: #fff;
                          "
                        ></i>
                      </div> -->
                      <div
                        class="search-btn"
                        @click.stop.prevent="
                          isComposing = false
                          isAiSearch = 'Y'
                          toSearch()
                        "
                      >
                        <i
                          class="far fa-lightbulb"
                          style="
                            padding-bottom: 2px;
                            font-size: 17px;
                            color: #fff;
                          "
                        ></i>
                      </div>
                    </template>
                  </v-text-field>
                </v-toolbar>
                <v-container>
                  <div>
                    <div
                      v-if="pathName == 'BrandGroup'"
                      class="d-flex align-center justify-space-between"
                    >
                      <div
                        v-if="searchAllProducts"
                        class="v-subheader theme--light px-1 body-1"
                      >
                        改限搜
                        <div
                          class="font-weight-bold mx-1"
                          style="color: #0047ff"
                        >
                          品牌專館
                        </div>
                        內品牌
                      </div>
                      <div v-else class="v-subheader theme--light px-1 body-1">
                        改搜全站商品
                      </div>
                      <v-btn
                        class="mx-0"
                        fab
                        text
                        elevation="0"
                        x-small
                        @click="searchAllProducts = !searchAllProducts"
                      >
                        <i
                          class="fa-solid fa-angle-right"
                          style="font-size: 20px; color: rgba(0, 0, 0, 0.6)"
                        ></i>
                      </v-btn>
                    </div>
                    <div
                      v-else-if="pathName == 'Category'"
                      class="d-flex align-center justify-space-between"
                    >
                      <div
                        v-if="searchAllProducts"
                        class="v-subheader theme--light px-1 body-1"
                      >
                        改限搜
                        <div
                          class="font-weight-bold mx-1"
                          style="color: #0047ff"
                        >
                          {{ categoryName }}
                        </div>
                        內品牌
                      </div>
                      <div v-else class="v-subheader theme--light px-1 body-1">
                        改搜全站商品
                      </div>
                      <v-btn
                        class="mx-0"
                        fab
                        text
                        elevation="0"
                        x-small
                        @click="searchAllProducts = !searchAllProducts"
                      >
                        <i
                          class="fa-solid fa-angle-right"
                          style="font-size: 20px; color: rgba(0, 0, 0, 0.6)"
                        ></i>
                      </v-btn>
                    </div>
                    <v-divider v-if="pathName == 'BrandGroup'"></v-divider>
                  </div>
                  <div class="v-subheader theme--light px-1 body-1">
                    熱門搜尋
                  </div>
                  <v-row dense class="mb-3">
                    <v-col cols="12">
                      <v-card
                        elevation="0"
                        outlined
                        color="primary--text"
                        class="rounded-pill py-1 d-flex justify-center align-center"
                        :style="{ 'font-size': '15px' }"
                        @click="
                          keyWordsInterface = false
                          $router.push('/all')
                        "
                      >
                        查看全部商品
                        <v-icon size="15" color="primary" class="ml-1"
                          >fa-regular fa-hand-pointer</v-icon
                        >
                      </v-card>
                    </v-col>
                    <v-col
                      v-for="(item, i) in hotKeyWords"
                      :key="i"
                      cols="6"
                      xs="6"
                      sm="4"
                      md="3"
                      lg="2"
                    >
                      <v-card
                        elevation="0"
                        outlined
                        color="primary--text"
                        class="rounded-pill text-center py-1"
                        :style="{ 'font-size': '15px' }"
                        @click="
                          isComposing = false
                          toSearch(item.keywords)
                        "
                        >{{ item.keywords }}</v-card
                      >
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-list dense>
                    <template v-if="userKeywords.length">
                      <v-subheader class="d-flex justify-space-between body-1">
                        <span>最近查詢</span>
                        <v-img
                          eager
                          src="/delete_forever.svg"
                          max-width="18"
                          @click.stop.prevent="delAllKeywords"
                        ></v-img>
                      </v-subheader>
                      <v-list-item
                        v-for="(item, index) in userKeywords"
                        :key="index"
                      >
                        <v-list-item-content
                          @click="
                            isComposing = false
                            toSearch(item.keywords)
                          "
                        >
                          {{ item.keywords }}
                        </v-list-item-content>
                        <v-list-item-icon
                          @click.stop.prevent="
                            delKeywords(item.keywords, index)
                          "
                        >
                          <background-svg
                            backgroungUrl="/close.svg"
                            width="18px"
                            height="18px"
                            color="#898989"
                          ></background-svg>
                        </v-list-item-icon>
                      </v-list-item>
                    </template>
                    <template v-else>
                      <v-subheader class="d-flex justify-center">
                        <span>無最近查詢</span>
                      </v-subheader>
                    </template>
                  </v-list>
                </v-container>
              </v-card>
            </v-dialog>
          </template>
          <v-btn
            v-if="isLogin"
            icon
            color="primary"
            height="40"
            class="d-md-none"
            @click="$store.commit('setHistoryDrawer', !historyDrawer)"
          >
            <!-- <i class="fa-solid fa-clock-rotate-left fa-lg"></i> -->
            <v-img
              src="/history_icon.svg"
              eager
              class="mb-1"
              max-width="25"
            ></v-img>
            <!-- <background-svg
              backgroungUrl="/search.svg"
              width="18px"
              height="18px"
              color="#ca1f1d"
            ></background-svg> -->
          </v-btn>
          <v-app-bar-nav-icon
            class="d-md-none primary--text"
            @click="$store.commit('setDrawer', !drawer)"
          ></v-app-bar-nav-icon>
          <div class="d-none d-md-block">
            <v-btn color="primary" class="mx-2" outlined to="/my-order">
              <background-svg
                backgroungUrl="/pec_my_order.svg"
                width="21px"
                height="21px"
                color="#ca1f1d"
                class="mr-1"
              ></background-svg>
              我的訂單
            </v-btn>
            <v-menu
              max-width="1200"
              min-width="920"
              offset-y
              tile
              nudge-bottom="44"
              scroll-strategy="colse"
              content-class="pec-category-subMenu"
              :value="menu"
              @input="v => $store.commit('setMenu', v)"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" outlined v-bind="attrs" v-on="on">
                  <background-svg
                    backgroungUrl="/pec_category.svg"
                    width="21px"
                    height="21px"
                    color="#ca1f1d"
                    class="mr-1"
                  ></background-svg>
                  全站分類
                </v-btn>
              </template>
              <v-sheet>
                <v-container fluid class="pa-0 menu-list d-flex">
                  <div
                    style="
                      max-width: 130px;
                      min-height: 529px;
                      background-color: #515151;
                    "
                  >
                    <v-list two-line subheader dark class="py-2">
                      <template v-for="(mainCategory, index) in allCategory">
                        <v-list-item
                          :class="{ active: chsoeMainCategory == index }"
                          @mouseover="chsoeMainCategory = index"
                          link
                          :key="index"
                        >
                          <router-link
                            :to="mainCategory.router_to"
                            class="text-justify ga-home-menu-categorys"
                          >
                            <v-list-item-content class="pa-1">
                              <v-list-item-title
                                class="text-center"
                                color="#fff"
                                >{{ mainCategory.name }}</v-list-item-title
                              >
                            </v-list-item-content>
                          </router-link>
                        </v-list-item>
                      </template>
                    </v-list>
                  </div>
                  <template v-for="(mainCategory, index) in allCategory">
                    <div
                      class="wrapArea"
                      style="min-width: 939px"
                      :key="index"
                      v-if="index === chsoeMainCategory"
                    >
                      <div class="topArea">
                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                          v-for="(
                            subCategory, index
                          ) in mainCategory.CATEGORY_SECONDARY"
                          :key="index"
                        >
                          <tbody>
                            <tr>
                              <th>
                                <router-link
                                  :to="subCategory.router_to"
                                  class="ga-home-menu-category-secondary"
                                >
                                  <span>{{
                                    subCategory.name
                                  }}</span></router-link
                                >
                              </th>
                              <td>
                                <ul>
                                  <li
                                    v-for="(
                                      minirCategory, index
                                    ) in subCategory.CATEGORY_MINIR"
                                    :key="index"
                                  >
                                    <router-link
                                      :to="minirCategory.router_to"
                                      class="ga-home-menu-category-minor"
                                      ><span>{{
                                        minirCategory.name
                                      }}</span></router-link
                                    >
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        class="bottomArea"
                        :class="{
                          borderTop:
                            mainCategory.BRAND.length !== 0 ||
                            mainCategory.BRAND_NO_IMG.length !== 0,
                        }"
                      >
                        <div style="position: absolute; z-index: 1">
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            v-if="mainCategory.BRAND.length !== 0"
                          >
                            <tbody>
                              <tr>
                                <th>
                                  <span>推薦品牌</span>
                                </th>
                                <td style="vertical-align: top">
                                  <ul>
                                    <li
                                      v-for="(
                                        brandItem, index
                                      ) in mainCategory.BRAND"
                                      :key="index"
                                    >
                                      <router-link
                                        :to="brandItem.router_to"
                                        class="ga-home-menu-brand-img"
                                        ><v-img
                                          :src="brandItem.img_url"
                                          :alt="brandItem.name"
                                          style="margin: 0 auto"
                                          width="60"
                                          height="60"
                                      /></router-link>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <th>
                                  <span
                                    v-if="
                                      mainCategory.BRAND_NO_IMG.length !== 0
                                    "
                                    >人氣推薦</span
                                  >
                                </th>
                                <td style="vertical-align: top">
                                  <ul>
                                    <li
                                      v-for="(
                                        brandItem, index
                                      ) in mainCategory.BRAND_NO_IMG"
                                      :key="index"
                                    >
                                      <router-link
                                        :to="brandItem.router_to"
                                        class="ga-home-menu-brand-text"
                                        ><span>{{
                                          brandItem.name
                                        }}</span></router-link
                                      >
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div></template
                  >
                </v-container>
                <!-- <v-container fluid class="pa-7 pec-category-menu menu-list">
                  <v-row>
                    <v-col
                      cols="3"
                      v-for="category in categoryArray"
                      :key="category.category_value"
                    >
                      <router-link
                        class="d-flex flex-column align-center text-decoration-none"
                        :to="`/category/${category.category_value}`"
                      >
                        <img width="36px" :src="category.img_url_menu" />
                        {{ category.name }}
                      </router-link>
                    </v-col>
                    <v-col cols="3">
                      <router-link
                        class="d-flex flex-column align-center text-decoration-none"
                        to="/buy"
                      >
                        <img
                          width="36px"
                          :src="`https://unilife.pec.com.tw/images/buy.png`"
                        />
                        宅配專區
                      </router-link>
                    </v-col>
                  </v-row>
                </v-container> -->
              </v-sheet>
            </v-menu>
            <v-btn
              class="mx-2"
              icon
              height="32"
              width="32"
              outlined
              color="primary"
              to="/notification-center"
            >
              <background-svg
                backgroungUrl="/notifications.svg"
                width="20px"
                height="20px"
                color="#ca1f1d"
              ></background-svg>
            </v-btn>
            <v-btn
              v-if="isLogin"
              class="mr-2"
              icon
              outlined
              color="primary"
              height="32"
              width="32"
              @click="$store.commit('setHistoryDrawer', !historyDrawer)"
            >
              <!-- <i class="fa-solid fa-clock-rotate-left fa-lg"></i> -->
              <v-img
                src="/history_icon.svg"
                eager
                class="mb-1"
                max-width="20"
              ></v-img>
              <!-- <background-svg
              backgroungUrl="/search.svg"
              width="18px"
              height="18px"
              color="#ca1f1d"
            ></background-svg> -->
            </v-btn>
            <v-btn
              icon
              height="32"
              width="32"
              color="primary"
              @click.stop.prevent="$store.commit('toLine')"
            >
              <v-img src="/support_agent.png" eager max-width="50"></v-img>
            </v-btn>
          </div>
        </div>
        <div
          style="margin: 0 auto; width: fit-content"
          class="body-2 warning--text d-none d-md-block"
          ref="PCHotKeyWordsH"
        >
          <template>
            <v-chip
              color="warning"
              text-color="white"
              label
              small
              class="py-0 px-1 mr-2"
              to="/all"
            >
              <background-svg
                backgroungUrl="/local_fire_department.svg"
                width="16px"
                height="16px"
                color="#fff"
              ></background-svg>
              全部商品
            </v-chip>
          </template>
          <span v-for="(item, i) in hotKeyWords" :key="i">
            <span v-if="i !== 0" class="px-1 black--text">|</span>
            <span
              @click="
                isComposing = false
                toSearch(item.keywords)
              "
              style="cursor: pointer"
              >{{ item.keywords }}</span
            >
          </span>
        </div>
      </div>
      <template #extension v-if="$vuetify.breakpoint.mobile && extended">
        <!-- 已更改版型，目前無 extension -->
      </template>
    </v-app-bar>

    <v-navigation-drawer
      app
      disable-resize-watcher
      width="100%"
      class="d-md-none pec-nav"
      :value="drawer"
      @input="v => $store.commit('setDrawer', v)"
      touchless
    >
      <div
        class="primary pa-4 white--text d-flex justify-space-between align-center"
      >
        <div
          class="primary white--text d-flex justify-space-between align-center pr-4"
          style="width: 100%"
        >
          <template v-if="isLogin">
            <div class="d-flex align-center">
              您好，<img
                class="mr-1 pb-1"
                :width="20"
                aspect-ratio="1/1"
                :src="membershipInfo.currentGradeImgUrl"
              /><span class="mr-1">{{ membershipInfo.currentGrade }} </span
              >{{ displayName || userId }}
            </div>
            <v-btn depressed small color="white" @click="logout">登出</v-btn>
          </template>
          <v-btn
            v-else
            depressed
            small
            color="white"
            to="/login"
            @click="toLogin"
            >{{ showRegister ? '登入/註冊' : '登入' }}</v-btn
          >
        </div>
        <v-btn
          class="px-0"
          text
          depressed
          fab
          small
          style="margin-right: 6px; height: 28px; width: 28px !important"
          @click="$store.commit('setDrawer', !drawer)"
        >
          <i class="fa-solid fa-xmark white--text" style="font-size: 27px"></i>
        </v-btn>
      </div>
      <v-expansion-panels accordion multiple v-model="expanded">
        <v-expansion-panel>
          <v-expansion-panel-header class="primary--text">
            會員中心
            <template v-slot:actions>
              <v-icon color="primary"> $expand </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <div v-if="isLogin">
              <div class="px-4">
                <div class="w-100 mb-2">
                  <div
                    class="d-flex justify-space-between align-center mt-3 mb-1"
                  >
                    <div
                      class="text-h6 d-flex align-center"
                      :style="`color: ${membershipInfo.currentGradeColor}`"
                    >
                      <div class="mr-1" style="width: 24px">
                        <v-img
                          :width="24"
                          :src="membershipInfo.currentGradeImgUrl"
                          aspect-ratio="1"
                          cover
                        ></v-img>
                      </div>
                      <div class="font-weight-bold ml-2">
                        {{ membershipInfo.currentGrade }}
                      </div>
                    </div>
                    <div
                      class="text-subtitle-2"
                      style="color: #0029ff; text-underline-offset: 3px"
                    >
                      <router-link to="/group-buy">分級辦法</router-link>
                    </div>
                  </div>
                  <div class="d-flex mb-2 wrap-member-level-area">
                    <div
                      v-for="item in membershipInfo.monthlyInfo"
                      :key="item.month"
                      class="member-level-area"
                    >
                      <div
                        class="d-flex align-center justify-center member-level-area-title"
                      >
                        {{ item.month }}
                      </div>
                      <div
                        class="d-flex align-center justify-center"
                        style="height: 48px"
                      >
                        <v-tooltip
                          v-model="show[item.month]"
                          bottom
                          :nudge-top="7"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <div
                              v-if="item.imgUrl"
                              icon
                              v-bind="attrs"
                              v-on="on"
                              class="tooltip-arrow"
                              style="width: 32px; height: 32px"
                            >
                              <v-img
                                :width="32"
                                :src="item.imgUrl"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </div>
                          </template>
                          <div
                            style="
                              color: #565656;
                              background-color: #fff;
                              font-size: 14px;
                              border: 1px solid #f8822b;
                              border-top: 8px solid #f8822b;
                              padding: 8px;
                            "
                          >
                            <div>{{ item.grade }}</div>
                            <div>{{ item.period }}</div>
                            <div>
                              本月消費
                              <span style="color: #ca1f1d">{{
                                item.checkoutMonthAmt
                              }}</span>
                              元
                            </div>
                            <div>
                              結帳金額
                              <span style="color: #ca1f1d">{{
                                item.checkoutAmt
                              }}</span>
                              元
                            </div>
                          </div>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex align-center mb-1"
                    style="font-size: 14px; color: #666666; letter-spacing: 1px"
                  >
                    會籍有效期限
                    {{
                      this.$dayjs(membershipInfo.expire).format('YYYY/MM/DD')
                    }}
                    | 更新日期
                    {{
                      this.$dayjs(membershipInfo.update).format('YYYY/MM/DD')
                    }}
                  </div>
                  <div
                    class="mb-2"
                    style="width: 100%; height: 2px; background-color: #d9d9d9"
                  ></div>
                  <div class="d-flex align-end font-weight-bold mb-1">
                    <div>目前年度累計消費</div>
                    <div
                      class="mx-1 font-weight-bold primary--text"
                      v-if="
                        membershipInfo.currentAmt !== null &&
                        membershipInfo.currentAmt !== undefined
                      "
                    >
                      {{ membershipInfo.currentAmt.toLocaleString() }}
                    </div>
                    <div>元 /</div>
                    <div
                      class="mx-1 font-weight-bold primary--text"
                      v-if="
                        membershipInfo.targetAmt !== null &&
                        membershipInfo.targetAmt !== undefined
                      "
                    >
                      {{ membershipInfo.targetAmt.toLocaleString() }}
                    </div>
                    <div>元</div>
                  </div>
                  <v-progress-linear
                    class="mb-3"
                    color="primary"
                    :value="
                      (membershipInfo.currentAmt / membershipInfo.targetAmt) *
                      100
                    "
                    rounded
                    height="6"
                  ></v-progress-linear>
                  <div class="d-flex font-weight-bold mb-2">
                    <div>本月消費</div>
                    <div
                      class="mx-1 font-weight-bold primary--text"
                      v-if="
                        membershipInfo.currentMonthAmt !== null &&
                        membershipInfo.currentMonthAmt !== undefined
                      "
                    >
                      {{ membershipInfo.currentMonthAmt.toLocaleString() }}
                    </div>
                    <div>元</div>
                  </div>
                  <div
                    v-if="membershipInfo.diffAmt !== 0"
                    class="d-flex align-end font-weight-bold mb-2"
                  >
                    <div class="d-flex">
                      <div style="width: 64px; white-space: nowrap">
                        <span style="letter-spacing: 7.6px">再消</span>費
                      </div>
                      <div
                        class="mx-1 font-weight-bold primary--text"
                        v-if="
                          membershipInfo.diffAmt !== null &&
                          membershipInfo.diffAmt !== undefined
                        "
                      >
                        {{ membershipInfo.diffAmt.toLocaleString() }}
                      </div>
                      <div>元</div>
                    </div>
                  </div>
                  <div v-else class="mb-2 font-weight-bold primary--text">
                    恭喜您！已達成
                  </div>
                  <div
                    class="d-flex align-center text-subtitle-1 font-weight-bold"
                  >
                    <div class="mr-2">{{ membershipInfo.word }}</div>
                    <div class="mr-1" style="width: 20px">
                      <v-img
                        :width="20"
                        :src="membershipInfo.nextGradeImgUrl"
                        aspect-ratio="1"
                        cover
                      ></v-img>
                    </div>
                    <div class="ml-1 primary--text mr-2">
                      {{ membershipInfo.nextGrade }}
                    </div>
                    <div>好康優惠</div>
                  </div>
                </div>
              </div>
              <div class="member-info-area">
                <div class="member-info-area-content member-info-dashboard">
                  <div
                    class="member-info-dashboard-item mb-md-0"
                    @click="clickTo('/my-order')"
                  >
                    <div class="member-info-dashboard-item-content pr-2">
                      <div
                        class="d-flex mb-0 mb-md-3 member-info-dashboard-title"
                      >
                        <div
                          class="font-weight-bold member-info-dashboard-title-text mb-1"
                        >
                          購物清單
                        </div>
                      </div>
                      <div class="d-flex justify-space-between">
                        <div class="mb-0 mb-md-3">
                          <div
                            class="font-weight-bold mb-1 member-info-dashboard-text"
                            @click.stop="
                              clickTo('/my-order?status=取貨點已到貨')
                            "
                          >
                            待取貨
                          </div>
                          <div
                            class="font-weight-bold member-info-dashboard-text"
                            @click.stop="clickTo('/my-order?status=訂單成立')"
                          >
                            待出貨
                          </div>
                        </div>
                        <div
                          class="d-flex flex-column align-end"
                          style="flex: 1 0 auto"
                        >
                          <div
                            class="font-weight-bold member-info-dashboard-value mb-1 cursor-pointer w-100 text-end"
                            @click.stop="
                              clickTo('/my-order?status=取貨點已到貨')
                            "
                            v-if="
                              userInfo.receiveStatus2 !== null &&
                              userInfo.receiveStatus2 !== undefined
                            "
                          >
                            {{ userInfo.receiveStatus2.toLocaleString() }}
                          </div>
                          <div
                            class="font-weight-bold member-info-dashboard-value cursor-pointer w-100 text-end"
                            @click.stop="clickTo('/my-order?status=訂單成立')"
                            v-if="
                              userInfo.receiveStatus0 !== null &&
                              userInfo.receiveStatus0 !== undefined
                            "
                          >
                            {{ userInfo.receiveStatus0.toLocaleString() }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="member-info-dashboard-item mb-md-0"
                    @click="clickTo('/reward')"
                  >
                    <div class="member-info-dashboard-item-content pl-2">
                      <div
                        class="d-flex mb-0 mb-md-3 member-info-dashboard-title"
                      >
                        <div
                          class="font-weight-bold member-info-dashboard-title-text mb-1"
                        >
                          折價券
                        </div>
                      </div>
                      <div class="d-flex justify-space-between">
                        <div class="mb-0 mb-md-3">
                          <div
                            class="font-weight-bold mb-1 mb-md-3 member-info-dashboard-text"
                            @click.stop="clickTo('/reward?tab=tab-0')"
                          >
                            待使用
                          </div>
                          <div
                            class="font-weight-bold member-info-dashboard-text"
                            @click.stop="clickTo('/reward?tab=tab-1')"
                          >
                            可領取
                          </div>
                        </div>
                        <div
                          class="d-flex flex-column align-end"
                          style="flex: 1 0 auto"
                        >
                          <div
                            class="font-weight-bold member-info-dashboard-value mb-1 cursor-pointer w-100 text-end"
                            @click.stop="clickTo('/reward?tab=tab-0')"
                            v-if="
                              userInfo.availableReward !== null &&
                              userInfo.availableReward !== undefined
                            "
                          >
                            {{ userInfo.availableReward.toLocaleString() }}
                          </div>
                          <div
                            class="font-weight-bold member-info-dashboard-value cursor-pointer w-100 text-end"
                            @click.stop="clickTo('/reward?tab=tab-1')"
                            v-if="
                              userInfo.availableReceiveReward !== null &&
                              userInfo.availableReceiveReward !== undefined
                            "
                          >
                            {{
                              userInfo.availableReceiveReward.toLocaleString()
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template
              v-for="(memberNavArray, index) in newMemberNavArrayFilter"
            >
              <div :key="'title' + index">
                <div class="font-weight-bold member-list-title mb-4">
                  <div>{{ memberNavArray[0].title }}</div>
                </div>
                <div class="d-flex justify-unset flex-wrap">
                  <div
                    v-for="item in memberNavArray"
                    :key="item.id"
                    class="d-flex justify-center mb-4 d-flex"
                    style="width: 25%"
                  >
                    <router-link
                      style="text-decoration: none; width: fit-content"
                      v-if="item.to"
                      :to="item.to"
                    >
                      <div style="width: fit-content">
                        <div class="d-flex justify-center mb-3">
                          <v-img
                            class="d-none d-lg-block"
                            :src="`./${item.name}.png`"
                            :max-width="64"
                          ></v-img>
                          <v-img
                            class="d-block d-lg-none"
                            :src="`./${item.name}.png`"
                            :max-width="56"
                          ></v-img>
                        </div>
                        <div class="member-list-value font-weight-bold">
                          {{ item.name }}
                        </div>
                      </div>
                    </router-link>
                    <div v-else>
                      <div
                        class="d-flex justify-center mb-3"
                        @click="
                          $store.commit('toLine')
                          getActiveBottomNavigation(4)
                          toLine()
                        "
                      >
                        <v-img
                          class="d-none d-lg-block"
                          :src="`./${item.name}.png`"
                          :max-width="64"
                        ></v-img>
                        <v-img
                          class="d-block d-lg-none"
                          :src="`./${item.name}.png`"
                          :max-width="56"
                        ></v-img>
                      </div>
                      <div class="member-list-value font-weight-bold">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div></template
            >
            <v-divider></v-divider>
            <!-- <v-list class="py-0">
              <template v-for="(item, i) in memberNavArray">
                <v-divider v-if="i !== 0" :key="item.id + 'd'"></v-divider>
                <v-list-item v-if="item.to" :key="item.id" :to="item.to">
                  <v-list-item-content>
                    <v-list-item-title class="pl-9">{{
                      item.name
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-else
                  :key="item.id"
                  @click="$store.commit(item.clickEvent)"
                >
                  <v-list-item-content>
                    <v-list-item-title class="pl-9">{{
                      item.name
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list> -->
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="primary--text">
            商品分類
            <template v-slot:actions>
              <v-icon color="primary"> $expand </v-icon>
            </template></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-container fluid class="menu-list pa-0">
              <v-container
                fluid
                class="pa-0 menu-list d-flex pec-category-subMenu-mobile"
                style="height: calc(100vh - 172px); overflow: hidden"
              >
                <div class="menuTitle">
                  <v-list
                    two-line
                    subheader
                    style="height: calc(100vh - 172px); overflow: auto"
                  >
                    <template v-for="(mainCategory, index) in allCategory">
                      <v-list-item
                        class="px-1"
                        :class="{ active: chsoeMainCategory == index }"
                        :disabled="
                          !(allCategory[index].CATEGORY_SECONDARY.length > 0) &&
                          !(allCategory[index].BRAND.length > 0)
                        "
                        @click="
                          if (
                            allCategory[index].CATEGORY_SECONDARY.length > 0 ||
                            allCategory[index].BRAND.length > 0
                          ) {
                            chsoeMainCategory = index
                            chsoesubCategory = ''
                          }
                        "
                        link
                        :key="index"
                      >
                        <v-list-item-content class="pa-1">
                          <v-list-item-title class="text-center" color="#fff">{{
                            mainCategory.name
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item></template
                    >
                  </v-list>
                </div>
                <template v-for="(mainCategory, index) in allCategory">
                  <div
                    class="wrapArea"
                    :key="index"
                    v-if="index === chsoeMainCategory"
                  >
                    <div
                      class="topArea d-flex justify-space-between"
                      :class="{ active: isOpenMoreChip }"
                      v-if="mainCategory.CATEGORY_SECONDARY.length > 0"
                    >
                      <div
                        class="d-flex align-center justify-start"
                        style="
                          overflow: auto;
                          flex: 1 0 auto;
                          max-width: calc(100% - 35px);
                        "
                      >
                        <v-chip-group
                          v-model="chsoesubCategory"
                          center-active
                          mandatory
                          :column="isOpenMoreChip"
                        >
                          <v-chip
                            v-for="(
                              subCategory, index
                            ) in mainCategory.CATEGORY_SECONDARY"
                            :key="index"
                            filter
                            outlined
                            color="FCF2F2"
                          >
                            {{ subCategory.name }}
                          </v-chip>
                        </v-chip-group>
                      </div>
                      <div
                        class="openMoreChipArea d-flex justify-space-between"
                      >
                        <div v-if="isOpenMoreChip" class="openMoreChipTitle">
                          選擇分類
                        </div>
                        <div
                          class="openMoreChipBtn"
                          @click="isOpenMoreChip = !isOpenMoreChip"
                        >
                          <i
                            v-if="!isOpenMoreChip"
                            class="fa-regular fa-chevron-down"
                          ></i>
                          <i v-else class="fa-regular fa-solid fa-xmark"></i>
                        </div>
                      </div>
                    </div>
                    <v-overlay :value="isOpenMoreChip"></v-overlay>
                    <div
                      id="lowerHalf"
                      class="lowerHalf"
                      :class="{ hideBrand: mainCategory.BRAND.length == 0 }"
                      v-if="
                        mainCategory.CATEGORY_SECONDARY.length > 0 ||
                        allCategory[index].BRAND.length > 0
                      "
                    >
                      <template
                        v-for="(
                          subCategory, index
                        ) in mainCategory.CATEGORY_SECONDARY"
                      >
                        <div
                          class="bottomArea"
                          :id="subCategory.value"
                          :key="index"
                        >
                          <h4
                            class="pb-3"
                            @click="
                              toLink(
                                subCategory.router_to,
                                'ga-home-menu-category-secondary'
                              )
                            "
                          >
                            {{ subCategory.name }}
                          </h4>
                          <ul>
                            <li
                              v-for="(
                                minirCategory, index
                              ) in subCategory.CATEGORY_MINIR"
                              :key="index"
                            >
                              <div
                                @click="
                                  toLink(
                                    minirCategory.router_to,
                                    'ga-home-menu-category-minor'
                                  )
                                "
                              >
                                <div class="wrapImg">
                                  <v-img
                                    :src="minirCategory.img_url"
                                    :alt="minirCategory.name"
                                    style="margin: 0 auto"
                                    width="60"
                                    height="60"
                                  />
                                </div>
                                <div class="wrapTitle">
                                  <span class="text-center">{{
                                    minirCategory.name
                                  }}</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div></template
                      >
                      <div
                        class="bottomArea"
                        v-if="mainCategory.BRAND.length !== 0"
                      >
                        <h4 class="pb-3">推薦品牌</h4>
                        <ul>
                          <li
                            v-for="(brandItem, index) in mainCategory.BRAND"
                            :key="index"
                          >
                            <div
                              @click="
                                toLink(
                                  brandItem.router_to,
                                  'ga-home-menu-brand-img'
                                )
                              "
                            >
                              <div class="wrapImg">
                                <v-img
                                  :src="brandItem.img_url"
                                  :alt="brandItem.name"
                                  style="margin: 0 auto"
                                  width="60"
                                  height="60"
                                />
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <!-- <div
                      v-if="mainCategory.BRAND.length !== 0"
                      class="middleArea"
                      :class="{
                        fallHeight: mainCategory.CATEGORY_SECONDARY == 0,
                      }"
                    >
                      <h4>推薦品牌</h4>
                      <ul>
                        <li
                          v-for="(brandItem, index) in mainCategory.BRAND"
                          :key="index"
                        >
                          <div
                            class="wrapImg"
                            @click="toLink(brandItem.router_to)"
                          >
                            <v-img
                              :src="brandItem.img_url"
                              :alt="brandItem.name"
                            />
                          </div>
                        </li>
                      </ul>
                    </div> -->
                  </div></template
                >
              </v-container>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
    <v-navigation-drawer
      app
      temporary
      disable-resize-watcher
      width="90%"
      :value="historyDrawer"
      touchless
      right
      style="max-width: 340px"
      @input="h => $store.commit('setHistoryDrawer', h)"
    >
      <div class="px-4 white--text d-flex justify-end align-center">
        <v-btn
          text
          depressed
          height="42px"
          color="primary"
          class="pa-0 mb-4"
          @click="$store.commit('setHistoryDrawer', !historyDrawer)"
        >
          <i class="fa-solid fa-xmark" style="font-size: 32px"></i
          ><span
            style="
              margin-top: 6px;
              font-size: 15px;
              margin-left: 4px;
              font-weight: 600;
            "
            >關閉</span
          >
        </v-btn>
      </div>
      <v-tabs
        v-model="tab"
        background-color="white"
        fixed-tabs
        icons-and-text
        show-arrows
        height="45px"
      >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab v-for="(item, i) in tabItems" :key="i" :disabled="isLoading">
          <span class="mb-0" style="font-size: 20px; font-weight: bolder">{{
            item.text
          }}</span>
        </v-tab> </v-tabs
      ><v-tabs-items v-model="tab" touchless>
        <v-tab-item>
          <v-card color="basil" flat>
            <v-responsive
              style="max-height: calc(100vh - 103px); overflow: auto"
            >
              <v-responsive>
                <v-col
                  cols="12"
                  class="pa-0"
                  v-for="product in filterbrowsHistoryArray"
                  :key="product.id"
                >
                  <pec-product-row-small-a
                    :section-name="'ga-header-history'"
                    :product="product"
                    :showDelBtn="tab"
                    :is-login="$store.getters['isLogin']"
                    :is-verified="$store.getters['isVerified']"
                    :to="`/product/${product.product_id}`"
                    @delHistoryItem="delHistoryItem"
                  ></pec-product-row-small-a>
                </v-col>
                <v-col>
                  <v-btn
                    v-intersect="{ handler: onIntersect }"
                    v-if="
                      filterbrowsHistoryArray.length % 20 == 0 &&
                      !(
                        filterbrowsHistoryArray.length <
                        this.browsHistoryPageNo * 20
                      )
                    "
                    dark
                    color="#CA1F1D"
                    style="width: 100%"
                    >載入更多</v-btn
                  >
                  <div
                    v-else-if="
                      !isLoading && filterbrowsHistoryArray.length == 0
                    "
                    class="text-center my-1"
                    style="color: #ca1f1d"
                  >
                    目前無資料
                  </div>
                  <div
                    v-else-if="!isLoading"
                    class="text-center my-1"
                    style="color: #ca1f1d"
                  >
                    已經到底囉!
                  </div>
                  <div class="text-center" v-else-if="isLoading">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                </v-col>
              </v-responsive>
            </v-responsive>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card color="basil" flat>
            <v-responsive
              class="rounded-0"
              style="max-height: calc(100vh - 103px); overflow: auto"
            >
              <v-responsive>
                <v-col
                  cols="12"
                  class="pa-0"
                  v-for="product in filterbrowsHistoryArray"
                  :key="product.id"
                >
                  <pec-product-row-small-a
                    :section-name="'ga-header-purchased'"
                    :product="product"
                    :showDelBtn="tab"
                    :is-login="$store.getters['isLogin']"
                    :is-verified="$store.getters['isVerified']"
                    :to="`/product/${product.product_id}`"
                    @delHistoryItem="delHistoryItem"
                  ></pec-product-row-small-a>
                </v-col>
                <v-col>
                  <v-btn
                    v-intersect="{ handler: onIntersect }"
                    v-if="
                      filterbrowsHistoryArray.length % 20 == 0 &&
                      !(
                        filterbrowsHistoryArray.length <
                        this.purchaseHistoryPageNo * 20
                      )
                    "
                    dark
                    color="#CA1F1D"
                    style="width: 100%"
                    >載入更多</v-btn
                  >
                  <div
                    v-else-if="
                      !isLoading && filterbrowsHistoryArray.length == 0
                    "
                    class="text-center my-1"
                    style="color: #ca1f1d"
                  >
                    目前無資料
                  </div>
                  <div
                    v-else-if="!isLoading"
                    class="text-center my-1"
                    style="color: #ca1f1d"
                  >
                    已經到底囉!
                  </div>
                  <div class="text-center" v-else-if="isLoading">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                </v-col>
              </v-responsive>
            </v-responsive>
          </v-card>
        </v-tab-item> </v-tabs-items
    ></v-navigation-drawer>
    <v-snackbar
      top
      color="primary"
      outlined
      v-model="snackbar"
      :timeout="20 * 1000"
      light
    >
      <div class="d-flex">
        <v-btn color="primary" text @click="snackbar = false"> 稍後再說 </v-btn>
        <v-spacer></v-spacer>
        <div>
          <v-btn color="primary" depressed @click="openWithApp">
            在應用程式中開啟
          </v-btn>
        </div>
      </div>
    </v-snackbar>
    <v-snackbar
      v-model="showAppPrompt"
      class="pb-0"
      top
      color="primary"
      outlined
      :timeout="appPromptTimeout"
      light
      ><div class="d-flex">
        <v-btn color="primary" text @click="showAppPrompt = false">
          稍後再說
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="confirmRedirect">
          尚未安裝？立即下載
        </v-btn>
      </div>
      <div class="text-right text-caption gray-text mt-2">
        {{ appPromptCountdown }} 秒後關閉此提醒框
      </div>
    </v-snackbar>
    <v-main>
      <div class="pec-page">
        <v-overlay :value="isPageLoading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath">
          </router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath">
        </router-view>
      </div>
    </v-main>
    <div
      v-if="$route.path != '/cart'"
      class="d-flex flex-column float-button-group"
    >
      <v-badge
        v-if="isExpandedButtonGroup"
        offset-x="14"
        offset-y="14"
        color="primary"
        :value="cartCount > 0"
        :content="cartCount"
      >
        <v-btn
          class="mb-2 ga-home-right-icon"
          dark
          fab
          small
          color="secondary"
          to="/cart"
          @click.stop
        >
          <v-img src="/shopping_cart.png" eager max-width="35"></v-img>
        </v-btn>
      </v-badge>
      <v-btn
        v-if="
          $dayjs().isSameOrAfter('2024-06-01', 'day') && isExpandedButtonGroup
        "
        color="#ffcc00"
        class="mb-2 ga-home-right-icon"
        dark
        fab
        small
        to="/check-in"
      >
        <v-img
          class="rounded-circle"
          max-width="42"
          src="https://unilife.pec.com.tw/images/check-in-icon-2024.png"
        >
        </v-img>
      </v-btn>
      <template v-if="isExpandedButtonGroup">
        <v-badge
          v-if="isExpandedButtonGroup"
          offset-x="14"
          offset-y="14"
          color="primary"
          :value="activityWheelCount > 0"
          :content="activityWheelCount"
          class="d-flex flex-column"
        >
          <v-btn
            v-for="activity in activityArray"
            :key="activity.id"
            class="mb-2 ga-home-right-icon"
            fab
            small
            :to="activity.router_to"
          >
            <v-img width="45px" :src="activity.icon_img_url"> </v-img>
          </v-btn>
        </v-badge>
      </template>
      <v-btn
        v-if="isExpandedButtonGroup"
        color="#ffcc00"
        class="mb-2 ga-home-right-icon"
        dark
        fab
        small
        to="/my-follow"
      >
        <v-img
          class="rounded-circle"
          src="https://unilife.pec.com.tw/images/track-side-icon.png"
        >
        </v-img>
      </v-btn>
      <v-btn
        class="mb-2"
        color="white"
        dark
        fab
        small
        @click="isExpandedButtonGroup = !isExpandedButtonGroup"
      >
        <background-svg
          backgroungUrl="/pec_category.svg"
          width="23px"
          height="23px"
          color="#aaa"
          style="margin-top: 2px; margin-right: 1px"
        ></background-svg>
      </v-btn>
      <!-- <v-btn
        class="mb-2"
        color="white"
        dark
        fab
        small
        @click="floatBtnGroupDialog = true"
      >
        <background-svg
          backgroungUrl="/pec_category.svg"
          width="23px"
          height="23px"
          color="#aaa"
          style="margin-top: 2px; margin-right: 1px"
        ></background-svg>
      </v-btn> -->
      <v-btn
        v-if="showToTopIcon"
        class="mb-2"
        color="primary"
        dark
        fab
        small
        @click.stop="$vuetify.goTo(0)"
      >
        <v-img src="/upload.svg" eager max-width="35"></v-img>
      </v-btn>
    </div>
    <v-dialog v-model="dialogForUpdate" persistent max-width="280">
      <v-card>
        <v-card-title>
          <span class="text-h5">系統訊息</span>
        </v-card-title>
        <v-card-text class="text-body-1"
          >為了提供更好的使用體驗，請您更新應用程式</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogForUpdate = false">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <pec-line></pec-line>
    <pec-footer class="pec-page"></pec-footer>
    <v-footer
      app
      fixed
      color="white"
      class="pa-0"
      v-if="cookiesAccepted !== 'true'"
    >
      <pec-line> </pec-line>
      <div class="px-4 pec-page">
        <div>
          <h5 class="text-h5 primary--text mb-4">隱私權聲明</h5>

          <p>
            為提供您最佳的網站使用體驗，我們使用 Cookies
            以改善我們的網頁，以作為技術、分析、行銷之用。
            繼續瀏覽此網頁即代表您同意 Cookies 的使用。進一步的資訊可閱讀我們的
            <router-link class="primary--text" to="/terms-and-policy"
              >隱私權條款</router-link
            >
            。
          </p>
        </div>
        <div class="px-4 pb-4 text-right">
          <v-btn color="primary" depressed @click="acceptCookies">確認</v-btn>
        </div>
      </div>
    </v-footer>
    <router-view name="pageFooter"> </router-view>
    <global-snackbar></global-snackbar>
    <global-dialog></global-dialog>
    <v-bottom-sheet v-model="sheet">
      <product-form
        :product="product"
        :is-loading="isFormLoading"
        button-text="加入購物車"
        :area-order-num-array="areaOrderNumArray"
        :receive-area="receiveAreaInProfile"
        order-num="1"
        @submit="addToCart"
        :key="product.product_id"
      ></product-form>
    </v-bottom-sheet>
    <group-dialog></group-dialog>
    <v-navigation-drawer
      app
      disable-resize-watcher
      v-model="teamBuyDrawer"
      right
      temporary
      width="320"
      touchless
    >
      <div v-if="teamBuyArray && teamBuyArray.length">
        <div class="text-h6 pa-2">
          {{ teamBuyArray[0].product_name }}
        </div>
        <v-divider></v-divider>
        <div>
          <v-card
            v-for="(item, index) in teamBuyArray"
            :key="index"
            elevation="1"
            class="ma-1"
          >
            <v-card-subtitle class="pa-0 pl-2 pt-2 black--text"
              >{{ index + 1 }}.</v-card-subtitle
            >
            <v-card-text class="pa-1">
              <template>
                <v-simple-table dense>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td class="no-wrap">開團規格</td>
                        <td>{{ item.spec }}</td>
                      </tr>
                      <tr>
                        <td class="no-wrap">目前/成團數量</td>
                        <td>{{ item.now_num }}/{{ item.target_num }}</td>
                      </tr>
                      <tr>
                        <td class="no-wrap">取貨廠區</td>
                        <td>{{ item.receive_area }}</td>
                      </tr>
                      <tr>
                        <td class="no-wrap">連絡電話</td>
                        <td>{{ item.phone_start }}</td>
                      </tr>
                      <tr>
                        <td class="no-wrap">預計結團時間</td>
                        <td>
                          {{ $dayjs(item.end_date).format('YYYY-MM-DD HH:mm') }}
                        </td>
                      </tr>
                      <tr>
                        <td class="no-wrap">備註</td>
                        <td>{{ item.memo }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="deep-purple accent-1"
                dark
                small
                @click="joinTeamBuy(item)"
                >我要跟團</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-navigation-drawer>
    <v-dialog
      v-model="floatBtnGroupDialog"
      max-width="300"
      content-class="float-btn-group-dialog"
    >
      <v-card style="position: relative">
        <div
          style="
            position: absolute;
            top: 4px;
            right: 4px;
            cursor: pointer;
            border-radius: 50%;
            border: 1px solid #ccc;
            width: 14px;
            height: 14px;
          "
          @click="floatBtnGroupDialog = false"
        >
          <background-svg
            backgroungUrl="/close.svg"
            width="10px"
            height="10px"
            color="#898989"
            style="margin-top: -6px; padding-left: 1px"
          ></background-svg>
        </div>
        <v-card-text class="pt-5" @click="floatBtnGroupDialog = false">
          <div class="grid-container">
            <v-badge
              offset-x="14"
              offset-y="14"
              color="primary"
              :value="cartCount > 0"
              :content="cartCount"
            >
              <v-btn
                dark
                fab
                small
                color="secondary"
                to="/cart"
                @click.stop="floatBtnGroupDialog = false"
              >
                <v-img src="/shopping_cart.png" eager max-width="35"></v-img>
              </v-btn>
            </v-badge>
            <v-btn
              v-if="$dayjs().isSameOrAfter('2024-06-01', 'day')"
              color="#ffcc00"
              dark
              fab
              small
              to="/check-in"
            >
              <v-img
                class="rounded-circle"
                max-width="42"
                src="https://unilife.pec.com.tw/images/check-in-icon-2024.png"
              >
              </v-img>
            </v-btn>
            <router-link
              v-for="activity in activityArray"
              :key="activity.id"
              class="my-2"
              :to="activity.router_to"
            >
              <v-btn fab small>
                <v-img width="45px" eager :src="activity.icon_img_url"> </v-img>
              </v-btn>
            </router-link>
            <v-btn
              color="#ffcc00"
              class="my-2"
              dark
              fab
              small
              to="/share"
              v-if="new Date() < new Date('2024-02-01T00:00:00+08:00')"
            >
              <v-img
                eager
                class="rounded-circle"
                src="https://unilife.pec.com.tw/images/comment-icon.png"
              >
              </v-img>
            </v-btn>
            <v-btn
              class="my-2"
              dark
              fab
              small
              to="/group-buy-form"
              v-if="new Date() < new Date('2024-03-01T00:00:00+08:00')"
            >
              <v-img
                eager
                class="rounded-circle"
                src="https://unilife.pec.com.tw/images/group-buy-icon.png"
              >
              </v-img>
            </v-btn>
            <v-btn color="#ffcc00" dark fab small to="/my-follow">
              <v-img
                class="rounded-circle"
                src="https://unilife.pec.com.tw/images/track-side-icon.png"
              >
              </v-img>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="privacyDialog" persistent max-width="600">
      <v-card class="privacyDialog">
        <v-card-text class="pa-4 pr-3"
          ><div
            class="px-2 pr-3"
            style="
              height: calc(100vh - 328px);
              overflow-y: auto;
              line-height: 1.5;
            "
            v-html="privacyContent"
          ></div>
          <v-footer padless>
            <v-card style="width: 100%" flat tile>
              <v-card-title
                class="white black--text px-2 pt-3 pb-1 justify-center align-center"
              >
                <v-checkbox
                  v-model="confirmPrivacyContentCheck"
                  class="pt-0 mt-1 mb-3"
                  label="本人同意團購網個人隱私保密政策"
                  color="success"
                  value="agree"
                  hide-details
                ></v-checkbox>
                <v-btn
                  class="text-subtitle-1 font-weight-bold v-btn v-btn--has-bg theme--light v-size--default success"
                  style="width: 100%"
                  :disabled="!(confirmPrivacyContentCheck.length > 0)"
                  @click="confirmPrivacyContent()"
                >
                  <v-icon size="24px"> mdi-cart </v-icon>
                  同意上述事項
                </v-btn>
              </v-card-title>
            </v-card>
          </v-footer></v-card-text
        >
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      :overlay-opacity="0.8"
      content-class="rounded-xl recommend-dialog"
      max-width="1280"
      :transition="false"
    >
      <div style="position: relative">
        <v-btn
          v-if="dialog"
          absolute
          outlined
          color="white"
          icon
          elevation="0"
          style="z-index: 20; top: 6px; right: 7px"
          @click="closeDialog(true)"
        >
          <background-svg
            backgroungUrl="/close.svg"
            width="20px"
            height="20px"
            color="#fff"
          ></background-svg>
        </v-btn>
        <v-card
          class="rounded-xl"
          style="overflow: hidden; background-color: #ffc52b"
        >
          <div class="recommend-dialog-head">
            <div class="text-h4 white--text font-weight-bold mt-6 mb-3">
              <i class="fa-solid fa-sparkles mr-3" style="color: #ffe30e"></i
              >專屬推薦<i
                class="fa-solid fa-sparkles ml-3"
                style="color: #ffe30e"
              ></i>
            </div>
          </div>

          <div class="py-0 py-md-3" style="background-color: #ffc52b">
            <recommend-slide
              :product-array="productRecommendArray"
              @handleClick="handleClick"
              :sectionName="'ga-sleep-guard-recommend'"
            ></recommend-slide>
          </div>
          <div class="d-flex justify-center mb-4">
            <v-btn
              depressed
              color="#e93123"
              active-class="no-active"
              class="rounded-pill white--text text-h6 px-10"
              :to="`/personalized-recommendation`"
              large
              @click="closeDialog()"
            >
              查看更多
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-dialog>
  </v-app>
</template>

<script>
import PecLine from '@/components/PecLine.vue'
import PecFooter from '@/components/PecFooter.vue'
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'
import GlobalDialog from '@/components/GlobalDialog.vue'
import ProductForm from '@/components/ProductForm.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import GroupDialog from '@/components/GroupDialog.vue'
import { mapState, mapGetters } from 'vuex'
import { apiAxios } from '@/api'

export default {
  name: 'App',
  components: {
    PecLine,
    PecFooter,
    GlobalSnackbar,
    GlobalDialog,
    ProductForm,
    BackgroundSvg,
    GroupDialog,
  },
  created() {
    // this.$gtm.trackEvent({
    //   event: 'login', // Event type [default = 'interaction'] (Optional)
    //   userId: this.userId,
    // })

    //window.appShareToWeb = this.shareResult
    this.url = new URL(location.href)
    if (this.url.searchParams.get('status')) {
      this.orderStatus = this.url.searchParams.get('status')
    }

    let urlParams = new URLSearchParams(window.location.search)
    let os = urlParams.get('os')
    let v = urlParams.get('v')

    fetch(
      'https://firestore.googleapis.com/v1/projects/pec-unilife/databases/(default)/documents/Release_Version/iOS_Version'
    )
      .then(response => response.json())
      .then(data => {
        if (data.fields.version.integerValue == v && os === 'iOS') {
          this.$store.commit('setShowRegister', true)
        }
      })
      .catch(() => {})

    const fetchDateWhenIdle = () => {
      apiAxios({
        method: 'post',
        url: '/Category/GetAllCategory',
      }).then(res => {
        this.allCategory = res.result
      })

      apiAxios({
        method: 'post',
        url: '/Activity/GetActivityArray',
      }).then(res => {
        this.activityArray = res.result[0] ? [res.result[0]] : []
      })

      apiAxios({
        method: 'post',
        url: '/KeyWords/HotKeyWords',
      }).then(res => {
        this.hotKeyWords = res.result.sys_keywords
        if (Array.isArray(res.result.featured_keywords)) {
          this.featuredKeywords = res.result.featured_keywords[0]?.keywords
        }
        let source_type
        if (Array.isArray(res.result.featured_keywords)) {
          source_type = res.result.featured_keywords[0]?.source_type || 'F'
        } else {
          source_type = 'F'
        }
        this.sourceType = {
          featured: source_type,
          sys: res.result.sys_keywords[0]?.source_type || 'S',
        }
      })

      return Promise.resolve()
        .then(() => {
          if (this.isLogin) {
            return apiAxios({
              method: 'post',
              url: '/Users/VerifyToken',
            })
          } else {
            return Promise.resolve()
          }
        })
        .then(() => {
          if (this.isLogin) {
            apiAxios({
              method: 'post',
              url: '/Privacy/GetPrivacyContent',
            }).then(res => {
              this.privacyContent = res.result
            })

            apiAxios({
              method: 'post',
              url: '/Privacy/ConfirmPrivacyContentCheck',
            }).then(res => {
              if (res.result === 'N') {
                this.privacyDialog = true
              }
            })

            this.getProductRecommendPurchase()
          }
        })
    }

    if (window.requestIdleCallback) {
      requestIdleCallback(fetchDateWhenIdle)
    } else {
      setTimeout(fetchDateWhenIdle, 1000)
    }
    //分類
    apiAxios({
      method: 'post',
      url: '/Category/GetCategoryImg',
    }).then(res => {
      this.$store.commit('setCategoryArray', res.result)
    })

    setInterval(() => {
      apiAxios({
        method: 'post',
        url: '/Activity/GetActivityArray',
      }).then(res => {
        this.activityArray = res.result[0] ? [res.result[0]] : []
      })
    }, 1000 * 60 * 30)
  },
  mounted() {
    if (window.GroupJSInterface && window.GroupJSInterface.onLoadFinish) {
      window.GroupJSInterface.onLoadFinish()
    }
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      ) &&
      !window.GroupJSInterface
    ) {
      this.snackbar = true
    }
    this.getHotKeyWordsHeight()
    window.addEventListener('resize', this.getHotKeyWordsHeight)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  updated() {
    this.getHotKeyWordsHeight()
  },
  data() {
    return {
      showAppPrompt: false,
      isExpandedButtonGroup: true,
      expanded: [1],
      show: {},
      url: '',
      orderStatus: '',
      JSInterface: '',
      os: '',
      v: '',
      h: '',
      dialogForUpdate: false,
      q: '',
      isAiSearch: 'Y',
      extended: false,
      snackbar: false,
      cookiesAccepted: localStorage.getItem('pec_cookies_accepted'),
      scrollTop: 0,
      activityArray: [],
      // recentKeyWords: [],
      hotKeyWords: [],
      PCHotKeyWordsH: 0,
      mobileHotKeyWordsH: 0,
      inputW: 0,
      keyWordsInterface: false,
      floatBtnGroupDialog: false,
      featuredKeywords: null,
      sourceType: {},
      privacyDialog: false,
      privacyContent: null,
      confirmPrivacyContentCheck: ['agree'],
      chsoeMainCategory: 0,
      chsoesubCategory: null,
      allCategory: [],
      isOpenMoreChip: false,
      overlay: false,
      browsHistoryArray: [],
      purchaseHistoryArray: [],
      browsHistoryPageNo: 0,
      purchaseHistoryPageNo: 0,
      isLoading: false,
      tabItems: [
        {
          text: '瀏覽紀錄',
          icon: 'fa-solid fa-basket-shopping',
          badge: false,
        },
        {
          text: '買過紀錄',
          icon: 'fa-solid fa-store',
          badge: false,
        },
      ],
      tab: 0,
      searchAllProducts: true,
      pathName: '',
      categoryName: '',
      // userInfo: {},
      // membershipInfo: { monthlyInfo: [] },
      isComposing: false,
      dialog: false,
      productRecommendArray: [],
      timer: null,
      countdownTimer: null,
      countdown: 300,
      isPaused: false,
      appPromptCountdown: 5,
      appPromptTimeout: 5000,
      interval: null,
    }
  },
  computed: {
    ...mapState([
      'categoryArray',
      'memberNavArray',
      'showRegister',
      'drawer',
      'historyDrawer',
      'menu',
      'badgeNumber',
      'cartCount',
      'activityWheelCount',
      'isPageLoading',
      'userKeywords',
      'product',
      'areaOrderNumArray',
      'isFormLoading',
      'teamBuyArray',
      'newMemberNavArray',
      'userInfo',
    ]),
    ...mapGetters({
      sheetFromStore: 'sheet',
      teamBuyDrawerFromStore: 'teamBuyDrawer',
    }),
    newMemberNavArrayFilter() {
      let data = this.newMemberNavArray.map(e => {
        return e.filter(x => x.name !== '好評推薦')
      })
      if (new Date() > new Date('2024-05-31T23:59:59+08:00')) {
        return data
      } else {
        return data.map(e => {
          return e.filter(x => x.name !== '每日簽到')
        })
      }
    },
    sheet: {
      get() {
        return this.sheetFromStore
      },
      set() {
        this.$store.commit('setProductForm', {
          type: 'sheet',
          data: false,
        })
      },
    },
    teamBuyDrawer: {
      get() {
        return this.teamBuyDrawerFromStore
      },
      set(boolean) {
        this.$store.commit('setTeamBuyDrawer', {
          drawer: boolean,
          data: this.teamBuyArray,
        })
      },
    },
    ...mapGetters([
      'isLogin',
      'userId',
      'displayName',
      'membershipInfo',
      'updateBrowsHistoryPageNo',
    ]),
    userAgent() {
      return navigator.userAgent
    },
    showToTopIcon() {
      return this.scrollTop > 500
    },
    filterbrowsHistoryArray() {
      if (this.tab !== 0) {
        return this.purchaseHistoryArray
      } else {
        return this.browsHistoryArray
      }
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
  watch: {
    '$route.path'() {
      this.closeDialog()
      if (
        this.$router.currentRoute.path !== '/login' &&
        this.$router.currentRoute.path !== '/login/pec' &&
        this.$router.currentRoute.path !== '/notification-center'
      ) {
        if (this.isLogin) {
          this.$store.dispatch('getUserUnreadCount')
        }
      }
    },
    teamBuyDrawer: {
      immediate: true,
      handler(val) {
        if (val) {
          document.getElementsByTagName('html')[0].style.overflowY = 'hidden'
        } else {
          document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
        }
      },
    },
    chsoesubCategory() {
      if (
        typeof this.chsoesubCategory === 'number' &&
        this.allCategory[this.chsoeMainCategory].CATEGORY_SECONDARY.length > 0
      ) {
        this.scrollToAnchor(
          this.allCategory[this.chsoeMainCategory].CATEGORY_SECONDARY[
            this.chsoesubCategory
          ].value
        )
      }
    },
    updateBrowsHistoryPageNo() {
      this.browsHistoryPageNo = 0
      this.browsHistoryArray = []
      this.$store.commit('setUpdateBrowsHistoryPageNo', false)
    },
    showAppPrompt(val) {
      if (val) {
        this.startCountdown()
      } else {
        clearInterval(this.interval)
      }
    },
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        this.showAppPrompt = false
      }
    },
    startCountdown() {
      this.appPromptCountdown = this.appPromptTimeout / 1000 // 轉換為秒
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        if (this.appPromptCountdown > 0) {
          this.appPromptCountdown--
        } else {
          clearInterval(this.interval)
        }
      }, 1000)
    },
    openWithApp() {
      this.snackbar = false
      let url = window.location.href.replace(/^https?:\/\//, 'unilife://')
      window.location.href = url
      setTimeout(() => {
        this.showAppPrompt = true
      }, 3000)
    },
    confirmRedirect() {
      // 使用者點擊確定後執行跳轉
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.location.href =
          'https://apps.apple.com/tw/app/%E5%9C%98%E8%B3%BC%E7%B6%B2/id1577520115'
      } else if (/android/i.test(navigator.userAgent)) {
        window.location.href =
          'https://play.google.com/store/apps/details?id=com.pec.unilife'
      }
      this.showAppPrompt = false
    },
    shareResult(servcie, succes, error) {
      // alert('param1:' + servcie + ' param2:' + succes + ' param3:' + error)
      return servcie + succes + error
    },
    toStore() {
      window.location.href = 'https://lihi1.cc/hn8Li'
    },
    toLogin() {
      this.$store.commit('setDrawer', false)
      if (this.$route.path != '/login') {
        this.$router.push('/login')
      }
    },
    toLink(path, event) {
      if (event) {
        this.$gtm.trackEvent({
          event: 'select_content',
          content_type: event,
          content_id: path,
        })
      }
      this.$store.commit('setDrawer', false)
      this.$router.push(path).catch(() => {})
    },
    onScroll(e) {
      this.scrollTop = e.target.documentElement.scrollTop
    },
    acceptCookies() {
      this.cookiesAccepted = 'true'
      localStorage.setItem('pec_cookies_accepted', 'true')
    },
    compositionend() {
      // for safari，針對 enter 是輸入法結束還是真的要搜尋
      setTimeout(() => {
        this.isComposing = false
      }, 100)
    },
    toSearch(keywords) {
      if (!this.isComposing) {
        // 處理 Enter 鍵的邏輯
        if (keywords) this.q = keywords
        if (this.q !== '') {
          if (
            this.searchAllProducts == false &&
            this.pathName == 'BrandGroup'
          ) {
            this.$gtm.trackEvent({
              event: 'select_content',
              content_type: 'search-enter',
              content_id: this.q,
            })
            this.$router
              .push({
                path: '/search-auto',
                query: {
                  q: this.q,
                  type: this.sourceType.sys,
                  brandId: this.$route.params.groupId,
                  isAiSearch: this.isAiSearch,
                },
              })
              .catch(error => {
                if (error.name != 'NavigationDuplicated') {
                  throw error
                }
              })
            this.$store.commit('sortUserKeywords', { q: this.q })
          } else if (
            this.searchAllProducts == false &&
            this.pathName == 'Category'
          ) {
            this.$gtm.trackEvent({
              event: 'select_content',
              content_type: 'search-enter',
              content_id: this.q,
            })
            this.$router
              .push({
                path: '/search-auto',
                query: {
                  q: this.q,
                  type: this.sourceType.sys,
                  categoryId: this.$route.params.categoryId,
                  isAiSearch: this.isAiSearch,
                },
              })
              .catch(error => {
                if (error.name != 'NavigationDuplicated') {
                  throw error
                }
              })
            this.$store.commit('sortUserKeywords', { q: this.q })
          } else {
            this.$gtm.trackEvent({
              event: 'select_content',
              content_type: 'search-enter',
              content_id: this.q,
            })
            this.$router
              .push({
                path: '/search-auto',
                query: {
                  q: this.q,
                  type: this.sourceType.sys,
                  isAiSearch: this.isAiSearch,
                },
              })
              .catch(error => {
                if (error.name != 'NavigationDuplicated') {
                  throw error
                }
              })
            this.$store.commit('sortUserKeywords', { q: this.q })
          }
        } else {
          if (this.featuredKeywords) {
            if (
              this.searchAllProducts == false &&
              this.pathName == 'BrandGroup'
            ) {
              this.q = this.featuredKeywords
              this.$gtm.trackEvent({
                event: 'select_content',
                content_type: 'search-enter',
                content_id: this.featuredKeywords,
              })
              this.$router
                .push({
                  path: '/search-auto',
                  query: {
                    q: this.featuredKeywords,
                    type: this.sourceType.featured,
                    brandId: this.$route.params.groupId,
                    isAiSearch: this.isAiSearch,
                  },
                })
                .catch(error => {
                  if (error.name != 'NavigationDuplicated') {
                    throw error
                  }
                })
            } else if (
              this.searchAllProducts == false &&
              this.pathName == 'Category'
            ) {
              this.$gtm.trackEvent({
                event: 'select_content',
                content_type: 'search-enter',
                content_id: this.q,
              })
              this.$router
                .push({
                  path: '/search-auto',
                  query: {
                    q: this.q,
                    type: this.sourceType.sys,
                    categoryId: this.$route.params.categoryId,
                    isAiSearch: this.isAiSearch,
                  },
                })
                .catch(error => {
                  if (error.name != 'NavigationDuplicated') {
                    throw error
                  }
                })
              this.$store.commit('sortUserKeywords', { q: this.q })
            } else {
              this.q = this.featuredKeywords
              this.$gtm.trackEvent({
                event: 'select_content',
                content_type: 'search-enter',
                content_id: this.featuredKeywords,
              })
              this.$router
                .push({
                  path: '/search-auto',
                  query: {
                    q: this.featuredKeywords,
                    type: this.sourceType.featured,
                    isAiSearch: this.isAiSearch,
                  },
                })
                .catch(error => {
                  if (error.name != 'NavigationDuplicated') {
                    throw error
                  }
                })
            }
          }
        }
        // keyup.enter 事件後關閉 menu
        this.$refs.PCMenu && (this.$refs.PCMenu.isActive = false)
        this.$refs.mobileMenu && (this.$refs.mobileMenu.isActive = false)
        // click 與 keyup.enter 事件後關閉 dialog
        if (this.keyWordsInterface) {
          setTimeout(() => {
            this.keyWordsInterface = false
          }, 100)
        }
      }
    },
    async logout() {
      await this.$store.dispatch('inOrOutLog', {
        emp_no: this.userId,
        event_name: 'logout',
      })
      this.$store.dispatch('logout')

      this.$gtm.trackEvent({
        event: 'logout',
        userId: '',
      })

      this.$router.push({
        path: '/login',
      })
    },
    delKeywords(keywords, index) {
      apiAxios({
        method: 'post',
        url: '/KeyWords/DeleteKeyWords',
        data: { keywords: keywords },
      }).then(() => {
        this.$store.commit('delUserKeywords', { index: index })
      })
    },
    delAllKeywords() {
      apiAxios({
        method: 'post',
        url: '/KeyWords/DeleteAllKeyWords',
      }).then(() => {
        this.$store.commit('setUserKeywords', [])
      })
    },
    getHotKeyWordsHeight() {
      this.inputW = document.querySelector('.pec-search-input').clientWidth
      this.$nextTick(() => {
        if (this.$refs.mobileHotKeyWordsH) {
          this.mobileHotKeyWordsH = this.$refs.mobileHotKeyWordsH
            ? this.$refs.mobileHotKeyWordsH.clientHeight + 48
            : 48
        } else {
          this.inputW = this.$refs.inputWidth
            ? this.$refs.inputWidth.$el.clientWidth
            : this.inputW
          this.PCHotKeyWordsH = this.$refs.PCHotKeyWordsH
            ? this.$refs.PCHotKeyWordsH.clientHeight + 96
            : 96
        }
      })
    },
    addToCart(spec) {
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

      this.$store.commit('setProductForm', {
        type: 'isFormLoading',
        data: true,
      })
      return apiAxios({
        method: 'post',
        url: '/Cart/AddCartItemV2',
        data: {
          spec_id: spec.specId,
          receive_type: spec.receiveType,
          receive_area: spec.receiveType === '1' ? spec.receiveArea : '',
          order_num: spec.orderNum,
          section_name: gaInfo.section_name || 'direct',
          target_product_id: gaInfo.target_product_id || null,
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
          this.$store.commit('setProductForm', {
            type: 'sheet',
            data: false,
          })
          this.$store.commit('setProductForm', {
            type: 'isFormLoading',
            data: false,
          })
        })
    },
    joinTeamBuy(item) {
      this.teamBuyDrawer = false
      this.$store.commit('setTeamBuyDialog', {
        dialog: true,
        data: item,
        status: 'join',
      })
    },
    confirmPrivacyContent() {
      apiAxios({
        method: 'post',
        url: '/Privacy/ConfirmPrivacyContent',
      }).then(() => {
        this.privacyDialog = false
      })
    },
    scrollTo(targetPos, duration) {
      const startingPos = document.getElementById('lowerHalf').scrollTop
      const diff = targetPos - startingPos
      let startTime
      function scrollStep(currentTime) {
        if (startTime === undefined) {
          startTime = currentTime
        }
        const elapsedTime = currentTime - startTime
        const scrollProgress = Math.min(elapsedTime / duration, 1)
        const scrollPosition = startingPos + diff * scrollProgress
        const lowerHalf = document.getElementById('lowerHalf')
        lowerHalf.scrollTo(0, scrollPosition)
        if (scrollProgress < 1) {
          window.requestAnimationFrame(scrollStep)
        }
      }
      window.requestAnimationFrame(scrollStep)
    },
    scrollToAnchor(eventId) {
      const anchor = document.getElementById(eventId)
      if (anchor) {
        const targetPos = anchor.offsetTop
        this.scrollTo(targetPos, 600)
        this.isOpenMoreChip = false
      }
    },
    getBrowsHistory() {
      const vm = this
      this.isLoading = true
      this.browsHistoryPageNo++
      apiAxios({
        method: 'post',
        url: `/Product/GetBrowsHistory?pageNo=${this.browsHistoryPageNo}`,
        data: {},
      }).then(res => {
        this.browsHistoryArray = this.browsHistoryArray.concat(res.result)
        window.setTimeout(function () {
          vm.isLoading = false
        }, 500)
      })
    },
    getPurchaseHistory() {
      const vm = this
      this.isLoading = true
      this.purchaseHistoryPageNo++
      apiAxios({
        method: 'post',
        url: `/Product/GetPurchaseHistory?pageNo=${this.purchaseHistoryPageNo}`,
        data: {},
      }).then(res => {
        this.purchaseHistoryArray = this.purchaseHistoryArray.concat(res.result)
        window.setTimeout(function () {
          vm.isLoading = false
        }, 500)
      })
    },
    delHistoryItem(product_id) {
      apiAxios({
        method: 'post',
        url: '/History/DeleteBrowsHistory',
        data: { product_id_array: [product_id] },
      }).then(() => {
        this.browsHistoryPageNo = 0
        this.browsHistoryArray = []
        this.getBrowsHistory()
      })
    },
    onIntersect() {
      if (!this.isLoading && this.historyDrawer) {
        if (this.tab === 0) {
          this.getBrowsHistory()
        } else {
          this.getPurchaseHistory()
        }
      }
    },
    checkPath() {
      this.pathName = this.$route.name
      if (this.$route.name == 'Category') {
        apiAxios({
          method: 'post',
          url: '/Profile/GetCategory',
          data: {
            value: this.$route.params.categoryId,
          },
        }).then(res => {
          this.categoryName = res.result.profile_comments
        })
      }
    },
    clickTo(url) {
      this.$store.commit('setDrawer', !this.drawer)
      let regex = new RegExp('^/.*?')
      if (regex.test(url)) {
        if (this.$route.path !== url.split('?')[0]) {
          this.$router.push({ path: url })
        }
      } else if (url) {
        if (window.GroupJSInterface) {
          let url = new URL(url)
          url.searchParams.set('external_browser', 2)
          window.location.href = url.href
        } else {
          window.open(url)
        }
      }
    },
    getProductRecommendPurchase() {
      apiAxios({
        method: 'post',
        url: '/Product/GetProductRecommendPurchaseV3?pageNo=1&pageSize=20&v=2&type=home',
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
        this.productRecommendArray = res.result.product
        if (this.productRecommendArray.length > 0 && this.isLogin) {
          this.setupListeners()
          this.resetTimer()
        }
      })
    },
    resetTimer() {
      if (this.isPaused) return

      if (this.timer) clearTimeout(this.timer)
      if (this.countdownTimer) clearInterval(this.countdownTimer)

      this.countdown = 300
      this.dialog = false

      this.timer = setTimeout(() => {
        if (
          this.productRecommendArray &&
          this.productRecommendArray.length > 0
        ) {
          this.dialog = true
        }
        this.isPaused = true
        clearInterval(this.countdownTimer)
      }, 300000)
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          clearInterval(this.countdownTimer)
        }
      }, 1000)
    },
    closeDialog(isManual = false) {
      if (isManual) {
        this.$gtm.trackEvent({
          event: 'select_content',
          content_type: 'section-click',
          content_id: 'ga-sleep-guard-recommend-close',
        })
      }
      this.isPaused = false
      this.resetTimer()
      this.dialog = false
    },
    onUserAction() {
      if (!this.isPaused) {
        this.resetTimer()
      }
    },
    setupListeners() {
      window.addEventListener('mousemove', this.onUserAction)
      window.addEventListener('keydown', this.onUserAction)
      window.addEventListener('scroll', this.onUserAction)
      window.addEventListener('click', this.onUserAction)
      window.addEventListener('touchstart', this.onUserAction)
    },
    removeListeners() {
      window.removeEventListener('mousemove', this.onUserAction)
      window.removeEventListener('keydown', this.onUserAction)
      window.removeEventListener('scroll', this.onUserAction)
      window.removeEventListener('click', this.onUserAction)
      window.removeEventListener('touchstart', this.onUserAction)
    },
    handleClick() {
      this.closeDialog()
    },
  },
  beforeDestroy() {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    )
    clearInterval(this.interval)
    this.removeListeners()
    if (this.timer) clearTimeout(this.timer)
    if (this.countdownTimer) clearInterval(this.countdownTimer)
  },
}
</script>
<style>
.v-footer--absolute,
.v-footer--fixed {
  z-index: 5;
}
.member-info-dashboard {
  flex-wrap: wrap;
  font-size: 16px;
  position: relative;
}
.member-info-dashboard-item {
  width: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  height: fit-content;
  cursor: pointer;
}
.member-info-dashboard-item-content {
  width: 96%;
}
.member-info-dashboard-item:after {
  position: absolute;
  content: '';
  display: block;
  width: 2px;
  height: 65px;
  background-color: #d9d9d9;
  right: -1px;
  top: 8px;
}
.member-info-dashboard-title-text {
  font-size: 16px;
  color: #ca1f1d;
}
.member-info-dashboard-value {
  color: #ca1f1d;
}
.member-info-dashboard .member-info-dashboard-item:nth-child(even)::after {
  display: none;
}
/* .member-info-dashboard:after {
  position: absolute;
  content: '';
  display: block;
  width: 96%;
  height: 2px;
  background-color: #d9d9d9;
  right: 2%;
  top: 72%;
} */
.w-100 {
  width: 100%;
}
.pec-page {
  max-width: 1280px !important;
  margin: 0 auto;
}
div.pec-search-input {
  max-width: 1024px;
}
.pec-search-input .v-input__slot {
  padding-right: 0 !important;
}
.pec-search-input .v-input__append-inner {
  margin-top: 0 !important;
}
.pec-category-menu {
  border-top: 3px solid var(--v-primary-base);
}
.pec-nav .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
.pec-nav .v-expansion-panel::before {
  box-shadow: none !important;
}
.pec-w-50 {
  width: 50%;
}
.pec-rich-content img,
.pec-rich-content iframe {
  display: block;
  max-width: min(100%, 800px);
  margin: 0 auto;
}
.v-chip.block {
  width: 100%;
  text-align: center;
  justify-content: center;
}
.v-chip.selected.selected {
  color: var(--v-primary-base) !important;
  border-color: var(--v-primary-base) !important;
}
.v-chip.selected:before {
  background-color: transparent;
}
.v-btn--active.no-active::before {
  opacity: 0 !important;
}
.v-application .text-decoration-line-through {
  text-decoration-color: rgba(0, 0, 0, 0.4) !important;
}
.v-breadcrumbs__item--disabled {
  color: inherit !important;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.text-center input {
  text-align: center;
}
.float-button-group {
  position: fixed;
  bottom: 60px;
  right: 12px;
  z-index: 4;
}
input[type='text'] {
  cursor: text !important;
}
.v-list-item__content,
.v-list-item__icon {
  cursor: pointer;
}
.v-toolbar__extension {
  display: block !important;
}
.pec-search-input .search-btn {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.text-justify {
  width: 100%;
  text-align: justify;
  text-align-last: justify;
}
.theme--light.v-btn:focus::before {
  opacity: 0 !important;
}
.no-wrap {
  white-space: nowrap;
  padding-right: 0 !important;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 50px);
  place-items: center;
}
.float-btn-group-dialog {
  position: absolute;
  bottom: 36px;
}
.privacyDialog .v-footer {
  position: relative;
}
.privacyDialog .v-footer:before {
  position: absolute;
  top: 0px;
  left: 50%;
  content: '';
  display: block;
  width: 90%;
  transform: translate(-50%);
  height: 30px;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 5px 8px 0 rgb(0 0 0 / 14%),
    0 1px 14px 0 rgb(0 0 0 / 12%);
}
.privacyDialog ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.privacyDialog ::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
.privacyDialog ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #727272;
}
.privacyDialog ::-webkit-scrollbar-thumb:hover {
  background: #3a3a3a;
}
.privacyDialog ::-webkit-scrollbar-thumb:active {
  background: #3a3a3a;
}
/* .pec-category-subMenu {
  position: absolute !important;
} */
.pec-category-subMenu .theme--dark.v-list-item:hover::before {
  opacity: 0;
}
.pec-category-subMenu .theme--dark.v-list-item a {
  text-decoration: none;
}
.pec-category-subMenu .theme--dark.v-list-item:hover,
.pec-category-subMenu .theme--dark.v-list-item.active {
  background-color: #d00617;
}
.pec-category-subMenu .wrapArea {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 4px solid #d00617;
}
.pec-category-subMenu .topArea {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0px 0px 20px 0px;
  margin: 0px;
  display: inline-block;
  position: relative;
}
.pec-category-subMenu .topArea::before {
  content: '';
  display: inline-block;
  margin: 0px;
  padding: 0px;
  width: 135px;
  height: 20px;
  background: #ececec;
  position: absolute;
  bottom: 0px;
}
.pec-category-subMenu .bottomArea {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  display: inline-block;
  position: relative;
}
.pec-category-subMenu .bottomArea::before {
  position: absolute;
  content: '';
  width: 135px;
  background-color: #ececec;
  top: 0px;
  bottom: 0px;
}
.pec-category-subMenu .bottomArea.borderTop {
  border-top: 1px solid #d8d8d8;
}
.pec-category-subMenu .v-list {
  background-color: #515151;
}
.pec-category-subMenu .v-list .v-list-item {
  min-height: inherit;
}
.pec-category-subMenu .v-list .v-list-item .v-list-item__title {
  font: 14px/28px Microsoft JhengHei, sans-serif;
}
.pec-category-subMenu table th {
  width: 135px;
  vertical-align: top;
  text-align: right;
  padding: 0px 10px 0px 10px;
  background: #ececec;
  box-sizing: border-box;
}
.pec-category-subMenu table span {
  display: inline-block;
  margin: 0px;
  padding: 0px 0px;
  font: bold 14px/30px Microsoft JhengHei, sans-serif;
  color: #000000;
  box-sizing: border-box;
}
.pec-category-subMenu table td span {
  color: #333333;
  font: 14px/30px Microsoft JhengHei, sans-serif;
}
.pec-category-subMenu .topArea table tbody tr td ul li:hover a span {
  color: #d62872 !important;
}
.pec-category-subMenu table:first-child tr th,
.pec-category-subMenu .bottomArea table tr th {
  padding-top: 20px;
}
.pec-category-subMenu .topArea table tr td {
  padding: 0 20px 0 0;
}
.pec-category-subMenu table:first-child tr td,
.pec-category-subMenu .bottomArea table tr td {
  padding-top: 20px;
}
.pec-category-subMenu table td ul li {
  display: inline-block;
  font: 14px/30px Microsoft JhengHei, sans-serif;
  color: #666666;
  padding: 0px 20px;
  margin: 0px;
  position: relative;
  cursor: pointer;
}
.pec-category-subMenu .topArea table td ul li::before,
.pec-category-subMenu .bottomArea table:nth-child(2) td ul li::before {
  content: '';
  display: inline-block;
  margin: 0px;
  padding: 0px;
  width: 1px;
  height: 14px;
  background: #e5e5e5;
  position: absolute;
  right: 0px;
  top: 8px;
}
.pec-category-subMenu .topArea table td ul li:last-child::before,
.pec-category-subMenu .bottomArea table td ul li:last-child::before {
  display: none;
}
.pec-category-subMenu table td li a {
  cursor: pointer;
  text-decoration: none;
}
.pec-category-subMenu-mobile {
  border: 4px solid #f5f5f5;
}

.pec-category-subMenu-mobile a {
  text-decoration: none;
}

.pec-category-subMenu-mobile h4 {
  font-weight: bolder;
}
.pec-category-subMenu-mobile .v-list-item:hover,
.pec-category-subMenu-mobile .v-list-item.active {
  background-color: #f5f5f5;
  color: #d00617 !important;
  font-weight: bold;
}
.pec-category-subMenu-mobile .theme--light.v-list-item:hover::before {
  opacity: 0;
}
.pec-category-subMenu-mobile .menuTitle {
  width: 110px;
  border-right: 4px solid #f5f5f5;
}
.pec-category-subMenu-mobile .menuTitle .v-list-item__title {
  font-size: 15px;
}
.pec-category-subMenu-mobile .menuTitle .v-list--two-line .v-list-item,
.v-list-item--two-line {
  min-height: 52px;
}
.pec-category-subMenu-mobile .wrapArea {
  width: calc(100% - 110px);
}
.pec-category-subMenu-mobile .wrapArea .topArea {
  border-bottom: 4px solid #f5f5f5;
  background-color: #fff;
  transition: all 0.3s;
}
.pec-category-subMenu-mobile .wrapArea .topArea .v-chip--active {
  border-color: #ca1f1d;
  color: #ca1f1d;
  background-color: #fcf2f2 !important;
}
.pec-category-subMenu-mobile .wrapArea .topArea .v-chip i {
  display: none;
}
.pec-category-subMenu-mobile .wrapArea .topArea.active {
  position: fixed;
  z-index: 6;
  top: 60px;
  background-color: #fff;
  width: 100%;
  left: 0px;
  flex-direction: column-reverse;
  border: none;
}
.pec-category-subMenu-mobile .wrapArea .topArea.active .v-chip-group {
  padding: 8px;
}
.pec-category-subMenu-mobile
  .wrapArea
  .topArea.active
  .v-chip-group
  .v-chip:first-child {
  margin-left: 0px;
}
.pec-category-subMenu-mobile .v-chip-group .v-chip:first-child {
  margin-left: 8px;
}
.pec-category-subMenu-mobile .wrapArea .topArea .openMoreChipTitle {
  padding: 10px;
  font: 15px/23px Helvetica, sans-serif;
}
.pec-category-subMenu-mobile .wrapArea .topArea .openMoreChipBtn {
  box-shadow: -3px 0px 3px -2px rgba(0, 0, 0, 0.1);
  padding: 16px 10px;
  display: flex;
  align-items: center;
}
.pec-category-subMenu-mobile .wrapArea .topArea.active .openMoreChipBtn {
  padding: 10px;
}
.pec-category-subMenu-mobile .wrapArea .topArea.active .openMoreChipArea {
  border-bottom: 2px solid #f5f5f5;
}
.pec-category-subMenu-mobile .wrapArea .middleArea {
  padding: 10px;
  overflow: auto;
  height: 110px;
  width: 100%;
}
.pec-category-subMenu-mobile .wrapArea .middleArea.fallHeight {
  height: 100%;
}
.pec-category-subMenu-mobile .wrapArea .bottomArea {
  padding: 10px;
}
.pec-category-subMenu-mobile ul {
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}
.pec-category-subMenu-mobile ul li {
  display: inline-block;
  font: 14px/30px Microsoft JhengHei, sans-serif;
  color: #666666;
  padding: 0px 5px;
  margin: 0px;
  position: relative;
  cursor: pointer;
  width: 33%;
}
.pec-category-subMenu-mobile .lowerHalf {
  overflow: auto;
  height: calc(100% - 52px);
  position: relative;
  /* border-bottom: 4px solid #f5f5f5; */
}
.pec-category-subMenu-mobile .lowerHalf.hideBrand {
  overflow: auto;
  height: calc(100% - 52px);
  position: relative;
}
.pec-category-subMenu-mobile .topArea.active ~ .lowerHalf {
  overflow: auto;
  height: calc(100% - 0px);
}
.pec-category-subMenu-mobile .middleArea ul li .wrapImg {
  width: 90%;
  max-width: 65px;
  padding-bottom: 90%;
  overflow: hidden;
  position: relative;
}
.pec-category-subMenu-mobile .middleArea ul li .wrapImg img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.pec-category-subMenu-mobile .bottomArea ul li .wrapImg {
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 2px;
}
.pec-category-subMenu-mobile .bottomArea ul li .wrapImg img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pec-category-subMenu-mobile .bottomArea ul li a {
  text-decoration: none;
}
.pec-category-subMenu-mobile .bottomArea ul li .wrapTitle {
  display: flex;
  height: 42px;
  align-items: center;
  margin-bottom: 12px;
  justify-content: center;
  line-height: 1.5;
}
.pec-category-subMenu-mobile .bottomArea ul li a span {
  text-align: center;
  width: 100%;
  font-style: bold 14 px/30px Microsoft JhengHei, sans-serif;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.pec-category-subMenu-mobile .wrapArea .bottomArea {
  padding: 10px;
  overflow: auto;
}
.member-info-area {
  background-color: #ca1f1d;
  padding: 12px 8px;
}
.member-info-area-content {
  display: flex;
  /* height: 134px; */
  padding: 8px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 5px;
  background: #fff;
  /* box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); */
  flex-wrap: wrap;
}
.member-info-title {
  text-align: center;
  color: #000;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 1px;
}
.member-info-value {
  text-align: center;
  color: #ca1f1d;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 32.4px */
  letter-spacing: 1.2px;
}
.member-centre-wrap-ship-value {
  position: relative;
  text-align: center;
  color: #ca1f1d;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 32.4px */
  letter-spacing: 1.2px;
  cursor: pointer;
}
.member-centre-wrap-ship-value::after {
  position: absolute;
  content: '';
  display: block;
  bottom: 0px;
  right: 0px;
  height: 1px;
  width: 100%;
  background-color: #ca1f1d;
}
.member-centre-wrap {
  margin: 13px 0;
  position: relative;
}
.member-centre-wrap::after {
  position: absolute;
  content: '';
  display: block;
  bottom: 8px;
  right: 50%;
  height: 47px;
  width: 2px;
  background-color: #d9d9d9;
}
.member-list-title {
  padding: 15px;
  background: #f5f5f5;
  color: #000;
  font-size: 15px;
  border-bottom: 5px solid #ca1f1d;
}
.member-list-value {
  color: #555;
  font-size: 14px;
  text-align: center;
}
.v-tooltip__content.menuable__content__active {
  opacity: 1 !important;
}
.v-tooltip__content {
  background-color: transparent;
}
.tooltip-arrow {
  position: relative;
}
.tooltip-arrow::after {
  content: '';
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  background-color: #f8822b;
  bottom: -13px;
  left: 12px;
  transform: rotate(0deg);
  opacity: 0;
  transition: 0.3s all;
}
.tooltip-arrow:hover::after {
  transform: rotate(45deg);
  opacity: 1;
}
.member-centre-wrap-ship-value {
  position: relative;
}
.member-centre-wrap-ship-value::after {
  position: absolute;
  content: '';
  display: block;
  bottom: 0px;
  right: 0px;
  height: 1px;
  width: 100%;
  background-color: #ca1f1d;
}
.member-centre-icon-list {
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
.member-centre-icon-list-point {
  width: 9px;
  height: 9px;
  border-radius: 5px;
  background-color: #ca1f1d;
  display: block;
}
.member-centre-icon-list-title {
  color: #ca1f1d;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
}
.member-level-area {
  width: 100%;
  height: 72px;
  background-color: #f9f9f9;
  margin-right: 2px;
  margin-bottom: 2px;
}
.member-level-area-title {
  background-color: #e6e6e6;
  font-size: 20px;
  color: #868686;
  font-weight: bold;
  height: 24px;
}
.recommend-dialog {
  max-width: 1280px !important;
}
.recommend-dialog-head {
  background-color: #e93123;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 1024px) {
  .recommend-dialog {
    max-width: 378px !important;
  }
}
@media (max-width: 959px) {
  .wrap-member-level-area {
    flex-wrap: wrap;
  }
  .member-level-area {
    max-width: 54.5px;
  }
}
</style>
