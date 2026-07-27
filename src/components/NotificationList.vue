<template>
  <v-container fluid>
    <v-row>
      <v-navigation-drawer
        fixed
        temporary
        v-model="filterDrawer"
        right
        touchless
      >
        <div>
          <div class="d-flex pa-4 pr-1 pb-1 primary--text align-center">
            條件篩選
            <v-spacer></v-spacer>
            <v-btn
              fab
              plain
              text
              color="primary"
              class="flex-column primary--text pec-close-fiter"
              @click="filterDrawer = false"
            >
              <background-svg
                backgroungUrl="/close.svg"
                width="20px"
                height="20px"
                color="#ca1f1d"
              ></background-svg>
              <span class="text-caption"> 關閉 </span>
            </v-btn>
          </div>
          <v-divider></v-divider>
          <v-container>
            <div class="text-message_title-1 black--text">日期區間</div>
            <v-chip-group
              v-model="days"
              mandatory
              column
              active-class="selected"
            >
              <!-- multiple mandatory -->
              <!-- class="block" -->
              <!-- @input="$emit('input', $event)" -->
              <v-chip
                v-for="item in daysArray[notificationSet.type]"
                :key="item.value"
                :value="item.value"
                filter
                large
                label
                outlined
                @input="$emit('input', $event)"
                >{{ item.text }}</v-chip
              >
            </v-chip-group>
            <div class="text-message_title-1 black--text">讀取狀態</div>
            <v-chip-group
              v-model="read_status"
              mandatory
              column
              active-class="selected"
            >
              <!-- multiple mandatory -->
              <!-- class="block" -->
              <!-- @input="$emit('input', $event)" -->
              <v-chip
                v-for="item in readStatusArray"
                :key="item.value"
                :value="item.value"
                filter
                large
                label
                outlined
                @input="$emit('input', $event)"
                >{{ item.text }}</v-chip
              >
            </v-chip-group>
          </v-container>
        </div>
        <v-sheet class="d-flex pa-5 pec-filter-action">
          <v-btn
            outlined
            class="mr-2 flex-grow-1"
            color="warning"
            @click="filterClear"
          >
            清除</v-btn
          >
          <v-btn
            depressed
            class="flex-grow-1"
            color="primary"
            @click="filterAppove"
          >
            套用</v-btn
          >
        </v-sheet>
      </v-navigation-drawer>
      <!--<v-col cols="12" lg="12">-->
      <!--
      <v-col cols="12" class="d-none">
        <v-card>
          <v-card-title>
            條件篩選
            <v-spacer></v-spacer>
            <v-btn small outlined color="primary"> 清空 </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="text-message_title-1 black--text">日期區間</div>
            <v-radio-group v-model="days">
              <v-radio
                v-for="(item, i) in daysArray[notificationSet.type]"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></v-radio>
            </v-radio-group>
            <v-checkbox
              v-for="(item, i) in daysArray[notificationSet.type]"
              :key="item.value"
              hide-details 
              :label="item.text"
            ></v-checkbox>
            <div class="text-message_title-1 black--text">讀取狀態</div>
            <v-radio-group v-model="read_status">
              <v-radio
                v-for="(item, i) in readStatusArray"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></v-radio>
            </v-radio-group>
            <v-checkbox
              v-for="(item, i) in readStatusArray"
              :key="item.value"
              hide-details 
              :label="item.text"
            ></v-checkbox>
          </v-card-text>
        </v-card>
      </v-col>
      -->

      <v-col cols="12" lg="12">
        <v-card class="d-none d-md-block mb-4">
          <!-- v-if="notificationArray.length > 0" -->
          <div class="d-flex justify-space-between py-3 px-4">
            <div class="d-flex align-center">
              排序：
              <v-btn
                v-for="option in sortOptionArray"
                :key="option.value"
                text
                @click="sort(option.value)"
              >
                {{ option.text }}
                <background-svg
                  v-if="sortBy.key !== option.value"
                  backgroungUrl="/import_export.svg"
                  width="14px"
                  height="14px"
                  color="#000"
                  class="mt-1"
                ></background-svg>
                <background-svg
                  v-else-if="sortBy.asc"
                  backgroungUrl="/arrow_upward.svg"
                  width="14px"
                  height="14px"
                  color="#ca1f1d"
                  class="mt-1"
                ></background-svg>
                <background-svg
                  v-else
                  backgroungUrl="/arrow_downward.svg"
                  width="14px"
                  height="14px"
                  color="#ca1f1d"
                  class="mt-1"
                ></background-svg>
              </v-btn>
              <v-btn text @click="sort('default_order_seq')">
                預設
                <background-svg
                  v-if="sortBy.key == 'default_order_seq'"
                  backgroungUrl="/arrow_downward.svg"
                  width="14px"
                  height="14px"
                  color="#ca1f1d"
                  class="mt-1"
                ></background-svg>
              </v-btn>
              <div
                class="ml-1"
                style="width: 2px; background-color: #b0b0b0; height: 55%"
              ></div>
              <v-btn
                elevation="0"
                small
                text
                class="ml-1"
                :color="`${
                  read_status !== 'ALL' || days !== 7 ? 'primary' : ''
                }`"
                @click="filterDrawer = true"
              >
                <span class="text-subtitle-2" style="padding-top: 1px"
                  >篩選更多</span
                ><i
                  class="fa-sharp fa-solid fa-caret-down ml-1"
                  style="font-size: 1.3em"
                ></i>
              </v-btn>
            </div>

            <!-- <v-img
              @click="filterDrawer = true"
              class="mt-2"
              src="/filter_alt.svg"
              eager
              max-width="16"
              max-height="16"
            ></v-img> -->
            <!--
            <div class="d-flex align-center">
              篩選：
              <v-select
                class="mb-2"
                v-model="days"
                :items="daysArray[notificationSet.type]"
                filled
                hide-details
                @change="changeDays"
              ></v-select>
            </div>
            -->
          </div>
        </v-card>
        <v-card class="d-md-none mb-4">
          <!-- v-if="notificationArray.length > 0" -->
          <div class="d-flex align-center py-3 px-4">
            <v-btn
              class="font-weight-black px-0 py-2 mr-2"
              elevation="0"
              text
              :color="`${
                read_status !== 'ALL' || days !== 7 ? 'primary' : '#626262'
              }`"
              @click="filterDrawer = true"
              style="height: 48px; line-height: 1.2; letter-spacing: 1.5px"
            >
              <i
                class="fa-sharp fa-solid fa-arrow-up-right-from-square mr-2"
              ></i
              >篩選<br />更多
            </v-btn>
            <v-divider
              vertical
              class="my-1"
              style="border-color: rgb(209, 209, 209); border-width: 1px"
            ></v-divider>
            <v-select
              class="ml-2"
              style="max-width: 150px"
              flat
              solo-inverted
              v-model="sortBy"
              :items="selectItemsArray"
              hide-details
              label="排序"
              @change="changeSort"
            ></v-select>
            <v-spacer></v-spacer>
            <!-- <v-img
              @click="filterDrawer = true"
              src="/filter_alt.svg"
              eager
              max-width="16"
              max-height="16"
            ></v-img> -->
            <!--
            <v-select
              style="max-width: 150px"
              flat
              solo-inverted
              v-model="days"
              :items="daysArray[notificationSet.type]"
              hide-details              
              label="最近1個月"
              @change="changeDays"
            ></v-select>
            -->
          </div>
        </v-card>

        <template v-if="isLoading">
          <v-skeleton-loader
            v-for="index in 4"
            :key="index"
            type="list-item-avatar-three-line"
          ></v-skeleton-loader>
        </template>
        <v-row dense v-if="!isLoading">
          <v-col v-if="notificationArray.length <= 0" cols="12">
            <div v-if="isTextLoading" class="text-center my-5">
              <v-skeleton-loader
                v-for="index in 4"
                :key="index"
                type="list-item-avatar-three-line"
              ></v-skeleton-loader>
            </div>
            <div v-else class="text-center my-5">目前無資料</div>
          </v-col>
          <!-- notificationArraySorted notificationArray -->
          <template v-else>
            <v-col
              cols="12"
              v-for="(notification, index) in notificationArray"
              :key="notification.id"
            >
              <div v-if="notificationArray.length - 1 > index">
                <!-- v-elseif="notificationArray.length - 1 > index" -->
                <!-- :to="transRedirectUrl(notification.redirect_url)" -->
                <!-- :to="to" :to="`/product/${notification.product_id}`" -->
                <!-- @click="emitUpdateReadStatus(notification)" -->
                <v-card
                  class="d-flex flex-column pa-3 justify-end"
                  :key="notification.id"
                  @click="showNotificationDialog(notification)"
                >
                  <div class="d-flex flex-grow-1 align-start">
                    <!--
                  <div
                    small
                    class="pec-card-tag primary white--text rounded-0 px-2 py-1"
                  >{{ index }} / {{ notification.id }} / {{ notification.read_status }}</div>
                  -->
                    <!--
                  <div
                    v-if="notification.read_status === 'F'"
                    small
                    class="pec-card-tag primary white--text rounded-0 px-2 py-1"
                  >未讀</div>
                  -->
                    <!--
                  <v-img
                    :src="notification.img_url"
                    aspect-ratio="1"
                    class="grey flex-grow-0"
                    width="60px"
                  ></v-img>
                  -->
                    <div
                      class="d-flex flex-column justify-space-between flex-grow-1 px-4"
                    >
                      <div class="d-flex justify-space-between">
                        <div class="primary--text pec-title-bl">
                          {{ notification.message_title }}
                        </div>
                        <v-badge
                          v-show="
                            (notification.read_status === 'N' &&
                              notification.user_id !== 'ALL') ||
                            (notification.all_read_status === 'N' &&
                              (notification.user_id == 'ALL' ||
                                notification.user_id.split('-')[0] == 'group'))
                          "
                          color="red"
                          dot
                          offset-x="-10"
                          offset-y="5"
                        >
                        </v-badge>
                        <!--
                      <v-chip
                        v-if="notification.read_status === 'N'"
                        label
                        smalll
                        color="primary lighten-1"
                      >未讀</v-chip>
                      <v-chip v-else label small color="primary lighten-1">已讀
                      </v-chip>
                      --></div>
                      <div class="mt-2 text-body-1 pec-notification-card-title">
                        <p v-html="notification.message_content"></p>
                      </div>
                      <div class="d-flex justify-space-between">
                        <v-chip
                          v-if="notification.start_date"
                          label
                          color="black--text"
                          small
                        >
                          {{
                            $dayjs(notification.start_date).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )
                          }}
                        </v-chip>
                        <!-- :to="transRedirectUrl(notification.redirect_url)" -->
                        <!-- @click.stop="emitUpdateReadStatus(notification)" -->
                        <!-- @click.stop
                        :to="transRedirectUrl(notification.redirect_url)"  -->
                        <v-chip
                          v-if="notification.redirect_url != null"
                          @click.stop="
                            redirectToUrl(
                              notification.redirect_url,
                              notification
                            )
                          "
                          label
                          color="secondary"
                          small
                          >前往 >
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>

              <div v-else>
                <!-- v-else -->
                <!-- :to="transRedirectUrl(notification.redirect_url)" -->
                <!-- :to="to" :to="`/product/${notification.product_id}`" -->
                <!-- @click="emitUpdateReadStatus(notification)" -->
                <v-card
                  class="d-flex flex-column pa-3 justify-end"
                  :key="notification.id"
                  v-intersect="fetchNotificationArray"
                  @click="showNotificationDialog(notification)"
                >
                  <div class="d-flex flex-grow-1 align-start">
                    <!--
                  <div
                    small
                    class="pec-card-tag primary white--text rounded-0 px-2 py-1"
                  >{{ index }} / {{ notification.id }} / {{ notification.read_status }}</div>
                  -->
                    <!--
                  <div
                    v-if="notification.read_status === 'N'"
                    small
                    class="pec-card-tag primary white--text rounded-0 px-2 py-1"
                  >未讀</div>
                  -->
                    <!--
                  <v-img
                    :src="notification.img_url"
                    aspect-ratio="1"
                    class="grey flex-grow-0"
                    width="60px"
                  ></v-img>
                  -->
                    <div
                      class="d-flex flex-column justify-space-between flex-grow-1 px-4"
                    >
                      <v-card class="d-flex justify-space-between" flat tile>
                        <v-alert
                          v-if="notification.message_title"
                          border="left"
                          class="primary--text py-0 mb-0 d-flex justify-content-start align-center"
                          dense
                          tile
                          colored-border
                          color="primary"
                          elevation="0"
                        >
                          {{ notification.message_title }}
                        </v-alert>
                        <v-badge
                          v-show="
                            (notification.read_status === 'N' &&
                              notification.user_id !== 'ALL') ||
                            (notification.all_read_status === 'N' &&
                              notification.user_id === 'ALL')
                          "
                          color="red"
                          dot
                          offset-x="-10"
                          offset-y="5"
                        >
                        </v-badge>
                        <!--
                      <v-chip
                        v-if="notification.read_status === 'N'"
                        label
                        smalll
                        color="primary lighten-1"
                      >未讀</v-chip>
                      <v-chip v-else label small color="primary lighten-1">已讀
                      </v-chip>
                      -->
                      </v-card>
                      <div class="mt-2 text-body-1 pec-notification-card-title">
                        <p v-html="notification.message_content"></p>
                      </div>
                      <v-card class="d-flex justify-space-between" flat tile>
                        <v-chip
                          v-if="notification.start_date"
                          label
                          color="black--text"
                          small
                        >
                          {{
                            $dayjs(notification.start_date).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )
                          }}
                        </v-chip>
                        <!-- :to="transRedirectUrl(notification.redirect_url)" -->
                        <!-- @click.stop="emitUpdateReadStatus(notification)" -->
                        <!-- @click.stop
                        :to="transRedirectUrl(notification.redirect_url)" -->
                        <v-chip
                          v-if="notification.redirect_url != null"
                          @click.stop="
                            redirectToUrl(
                              notification.redirect_url,
                              notification
                            )
                          "
                          label
                          color="secondary"
                          small
                          >前往 >
                        </v-chip>
                      </v-card>
                    </div>
                  </div>
                </v-card>
                <div class="text-center my-5" v-if="isTextLoading">
                  <v-skeleton-loader
                    v-for="index in 4"
                    :key="index"
                    type="list-item-avatar-three-line"
                  ></v-skeleton-loader>
                </div>
                <div class="text-center my-5" v-else-if="isEnd">已經到底了</div>
              </div>
            </v-col>
          </template>
        </v-row>

        <!--
        <div class="d-flex align-center text-center justify-center">
          <v-avatar
            :color="isIntersecting ? 'green lighten-1' : 'red darken-2'"
            class="mr-3 swing-transition"
            size="32"
          ></v-avatar>
        </div>
        -->

        <!-- <div class="text-center my-5">
          <v-pagination
            color="primary"
            :length="20"
            :total-visible="7"
          ></v-pagination>
        </div> -->
      </v-col>
    </v-row>
    <v-dialog v-model="notificationDialog" scrollable max-width="800">
      <v-card>
        <v-card-title>訊息：</v-card-title>
        <v-card-text>
          <div>
            <p class="text-subtitle-1">
              {{ notificationDialogData.message_title }}
            </p>
            <p v-html="notificationDialogData.message_content"></p>
            <v-chip
              class="d-flex flex-column pa-3 justify-end"
              v-if="notificationDialogData.redirect_url != null"
              @click.stop="urlReplace(notificationDialogData.redirect_url)"
              label
              color="secondary"
              small
              >前往 >
            </v-chip>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="notificationDialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
//import { apiAxios } from '@/api'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  components: { BackgroundSvg },
  props: {
    isLoading: Boolean,
    isTextLoading: Boolean,
    notificationSet: { type: Object, default: () => {} },
    notificationArray: { type: Array, default: () => [] },
    defaultSortBy: {
      type: Object,
      default: () => ({ key: 'default_order_seq', asc: false }),
    },
  },
  data() {
    return {
      //defaultSortBy: { key: 'default_order_seq', asc: false },
      sortOptionArray: [{ value: 'start_date', text: '日期' }],
      selectItemsArray: [
        { text: '預設', value: { key: 'default_order_seq', asc: false } },
        {
          text: '日期(舊到新)',
          value: { key: 'start_date', asc: true },
        },
        {
          text: '日期(新到舊)',
          value: { key: 'start_date', asc: false },
        },
      ],
      sortBy: this.defaultSortBy,
      filterDrawer: false,
      days: 7, // 10
      daysArray: [
        [
          {
            text: '最近7天',
            value: 7,
          },
        ],
        [
          {
            text: '最近1個月',
            value: 31, // 10
          },
          {
            text: '最近3個月',
            value: 93, // 31
          },
          {
            text: '最近半年',
            value: 185, // 62
          },
        ],
        [
          {
            text: '最近7天',
            value: 7,
          },
          {
            text: '最近半個月',
            value: 15,
          },
          {
            text: '最近1個月',
            value: 31, // 10
          },
        ],
      ],
      read_status: 'ALL', // N
      readStatusArray: [
        {
          text: '已讀取',
          value: 'Y',
        },
        {
          text: '未讀取',
          value: 'N',
        },
        {
          text: '全部',
          value: 'ALL',
        },
      ],
      isIntersecting: false,
      isEnd: false,
      notificationDialog: false,
      notificationDialogData: {},
    }
  },
  /*
  computed: {
    notificationArraySorted() {
      console.log(`notificationArraySorted in = `)
      return this.notificationArray
        .map(x => x)
        .sort((a, b) => {
          let modifier = this.sortBy.asc ? 1 : -1
          if (a[this.sortBy.key] < b[this.sortBy.key]) return -1 * modifier
          if (a[this.sortBy.key] > b[this.sortBy.key]) return 1 * modifier
          return 0
        })
    },
  },
  */
  methods: {
    sort(key) {
      //console.log(`sort = ${key} / ${this.defaultSortBy.key}`)
      if (key === 'default_order_seq') {
        this.sortBy = { key: 'default_order_seq', asc: false }
        //console.log(`111 ${key} === ${this.defaultSortBy.key} / ${this.sortBy.asc}`)
      } else if (key === this.sortBy.key) {
        this.sortBy.asc = !this.sortBy.asc
        //console.log(`222 ${key} === ${this.sortBy.key} / ${this.sortBy.asc}`)
      } else {
        this.sortBy.key = key
        this.sortBy.asc = true
        //console.log(`333 ${key} === ${this.sortBy.key} / ${this.sortBy.asc}`)
      }
      this.emitFetchNotificationArray(true)
    },
    changeSort(selectObj) {
      //console.log(`changeSort = ${selectObj} / ${JSON.stringify(this.sortBy)}`)
      this.sortBy = selectObj
      this.emitFetchNotificationArray(true)
    },
    changeDays(selectObj) {
      //console.log(`changeDays = ${selectObj} / ${JSON.stringify(this.days)}`)
      this.days = selectObj
      this.emitFetchNotificationArray(true)
    },
    changeReadStatus(selectObj) {
      //console.log(`changeDays = ${selectObj} / ${JSON.stringify(this.read_status)}`)
      this.read_status = selectObj
      this.emitFetchNotificationArray(true)
    },
    transRedirectUrl(url) {
      return url.replace(
        /^(https?|http):\/\/(localhost:8080|unilife.pec.com.tw|unilifetest.pec.com.tw)/,
        ''
      )
    },
    redirectToUrl(url, notification) {
      this.emitUpdateReadStatus(notification)
      window.location.replace(url)
    },
    urlReplace(url) {
      window.location.replace(url)
    },
    fetchNotificationArray(entries, observer, isIntersecting) {
      //console.log(`fetchNotificationArray isIntersecting = ${isIntersecting}`)
      /*
      entries.forEach(entry => {
        // Each entry describes an intersection change for one observed target element:
        // entry.boundingClientRect
        // entry.intersectionRatio
        // entry.intersectionRect
        // entry.isIntersecting
        // entry.rootBounds
        // entry.target
        // entry.time
        console.log(`entry.boundingClientRect = ${JSON.stringify(entry.boundingClientRect)}`);
        console.log(`entry.intersectionRatio = ${entry.intersectionRatio}`);
        console.log(`entry.intersectionRect = ${JSON.stringify(entry.intersectionRect)}`);
        console.log(`entry.isIntersecting = ${entry.isIntersecting}`);
        console.log(`entry.rootBounds = ${JSON.stringify(entry.rootBounds)}`);
        console.log(`entry.target = ${entry.target}`);
        console.log(`entry.time = ${entry.time}`);
      });      
      */
      this.isIntersecting = isIntersecting
      // isIntersecting = false, 向下捲到離開畫面, isIntersecting = true, 向上捲到進入畫面,
      if (!isIntersecting) return
      if (
        this.notificationSet.pagingInfo.totalRows === 0 ||
        this.notificationSet.pagingInfo.currentPage >=
          this.notificationSet.pagingInfo.totalPageCount
      ) {
        if (
          this.notificationSet.pagingInfo.currentPage >=
          this.notificationSet.pagingInfo.totalPageCount
        )
          this.isEnd = true
        return
      }
      this.emitFetchNotificationArray(false)
    },
    emitFetchNotificationArray(clearData) {
      //console.log(`emitFetchNotificationArray emit - ${this.notificationSet.type} / ${this.sortBy} / ${this.days} / ${this.read_status}`)
      //console.log(`emit 111 this.notificationArray = ${this.notificationSet.type} / ${this.notificationArray} / ${this.notificationArray.length}`)
      if (clearData) {
        this.notificationArray.splice(0, this.notificationArray.length)
      }
      //console.log(`emit 222 this.notificationArray = ${this.notificationSet.type} / ${this.notificationArray} / ${this.notificationArray.length}`)
      this.$emit(
        'fetchNotificationArray',
        this.notificationSet.type,
        this.sortBy,
        this.days,
        this.read_status
      )
    },
    emitUpdateReadStatus(notification) {
      //console.log(`emitUpdateReadStatus emit - ${this.notificationSet.type} / ${notification.id} / ${notification.read_status}`)
      //console.log(notification.user_id)
      if (
        notification.read_status === 'N' &&
        (notification.user_id !== 'ALL' ||
          notification.user_id.split('-')[0] !== 'group')
      ) {
        notification.read_status = notification.read_status === 'N' ? 'Y' : 'N'
        this.$emit(
          'updateReadStatus',
          this.notificationSet.type,
          notification.id,
          notification.user_id
        )
      } else if (
        notification.all_read_status === 'N' &&
        (notification.user_id === 'ALL' ||
          notification.user_id.split('-')[0] === 'group')
      ) {
        //console.log(notification.all_read_status)
        notification.all_read_status =
          notification.all_read_status === 'N' ? 'Y' : 'N'
        this.$emit(
          'updateReadStatus',
          this.notificationSet.type,
          notification.id,
          notification.user_id
        )
      }
      //if (notification.redirect_url != null) {
      //  window.location.href = this.transRedirectUrl(notification.redirect_url)
      //}
    },
    filterClear() {
      //this.filterDrawer = false
      this.days = this.daysArray[this.notificationSet.type][0].value // 7 // 10
      //console.log(`filterClear => ${this.days}`)
      this.read_status = 'ALL'
    },
    filterAppove() {
      this.filterDrawer = false
      this.emitFetchNotificationArray(true)
    },
    showNotificationDialog(notification) {
      this.notificationDialog = true
      //console.log(`notification = ${JSON.stringify(notification)}`)
      this.notificationDialogData = notification
      this.emitUpdateReadStatus(notification)
    },
  },
}
</script>
<style>
.pec-notification-card-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3rem;
}
</style>
