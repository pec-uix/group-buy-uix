<template>
  <div>
    <div class="d-flex">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn
        v-if="unreadCount > 0"
        class="mt-3 mr-3 secondary"
        @click="updateAllReadStatus"
        >全部已讀</v-btn
      >
    </div>
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="white"
        fixed-tabs
        icons-and-text
        show-arrows
      >
        <v-tabs-slider color="primary"></v-tabs-slider>

        <v-tab
          v-for="(item, i) in tabItems"
          :key="i"
          :href="'#tab-' + i"
          @click="currentTab = i"
        >
          {{ item.text }}
          <background-svg
            :backgroungUrl="`/${item.icon}.svg`"
            width="20px"
            height="20px"
            :color="currentTab === i ? '#ca1f1d' : '#aaa'"
          ></background-svg>
          <v-badge
            v-show="item.badge"
            color="red"
            dot
            offset-x="-15"
            offset-y="5"
          >
          </v-badge>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(item, i) in tabItems" :key="i" :value="'tab-' + i">
          <!-- :id="'tab-' + i" -->
          <v-card flat>
            <!--           
              :breadcrumbs="tabItems" 
              @fetchNotificationArray="fetchNotificationArray(arguments)"
            -->
            <notification-list
              :notificationSet="notificationSet[i]"
              :notificationArray="notificationArray[i]"
              :is-loading="isLoading"
              :is-text-loading="isTextLoading"
              @fetchNotificationArray="fetchNotificationArray"
              @updateReadStatus="updateReadStatus"
            ></notification-list>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import NotificationList from '@/components/NotificationList.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { apiAxios } from '@/api'

export default {
  components: { NotificationList, BackgroundSvg },
  created() {
    this.isLoading = true
    return Promise.all([
      this.fetchNotificationArray(0),
      this.fetchNotificationArray(1),
      this.fetchNotificationArray(2),
      this.getUserUnreadCount(),
    ]).finally(() => (this.isLoading = false))
  },
  data() {
    return {
      notificationSet: [{}],
      notificationArray: [[]],
      isLoading: false,
      isTextLoading: false,
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '通知中心',
          to: '/notification-center',
        },
      ],
      tab: null,
      // https://fontawesomeicons.com/materialdesign/icons?search=vue
      tabItems: [
        {
          text: '活動訊息',
          icon: 'local_activity',
          badge: false,
        },
        {
          text: '個人訊息',
          icon: 'person',
          badge: false,
        },
        {
          text: '重要訊息',
          icon: 'notification_important',
          badge: false,
        },
      ],
      pageCount: 1,
      pageSize: 30,
      daysDefaultArray: [7, 31, 7],
      unreadCount: 0,
      currentTab: 0,
    }
  },
  methods: {
    transRedirectUrl(url) {
      return url.replace(
        /^(https?|http):\/\/(localhost:5000|unilife.pec.com.tw|unilifetest.pec.com.tw)\/api\//,
        ''
      )
    },
    fetchNotificationArray() {
      // console.log(`fetchNotificationArray in... ${arguments.length} / ${arguments[0]} / ${JSON.stringify(arguments[1])} / ${JSON.stringify(arguments[2])} / ${JSON.stringify(arguments[3])}`);
      let index = 0
      if (arguments.length === 0 || !arguments[0]) index = 0
      else if (arguments[0]) index = arguments[0]
      else index = undefined

      // {"key":"start_date","asc":true}
      let sort = 'default_order_seq desc'
      if (arguments.length >= 2) {
        sort = `${arguments[1].key} ${arguments[1].asc ? 'asc' : 'desc'}`
      }

      let days = 7
      if (index !== undefined) days = this.daysDefaultArray[index]
      if (arguments.length >= 3) {
        days = arguments[2]
      }

      let read_status = 'ALL' // F
      if (arguments.length === 4) {
        read_status = arguments[3]
      }
      //console.log(`fetchNotificationArray 222... ${arguments.length} / ${index} / ${sort} / ${days} / ${read_status}`);

      /*
      "message": "成功",
        "messageType": null,
        "total": 50,
        "status": 1,
        "exception": null,
        "errors": null,
        "pagingInfo": {
          "currentPage": 1,
          "totalPageCount": 5,
          "totalRows": 201,
          "firstPageLink": "http://localhost:5000/api/NotificationCenter/GetNotificationArrayPaging?pageNo=1",
          "prevPageLink": "",
          "nextPageLink": "http://localhost:5000/api/NotificationCenter/GetNotificationArrayPaging?pageNo=2",
          "lastPageLink": "http://localhost:5000/api/NotificationCenter/GetNotificationArrayPaging?pageNo=5"
        }
      */
      //this.isLoading = true
      let tempUrl = ''
      //tempUrl = `/NotificationCenter/GetNotificationPushArray?pageSize=${this.pageSize}`
      //console.log(`this.notificationSet = ${this.notificationSet} / ${this.notificationSet.length} / ${this.notificationSet[index]}`)
      //console.log(`this.notificationSet = ${JSON.stringify(this.notificationSet)} / ${JSON.stringify(this.notificationSet[index])}`)
      //console.log(`this.notificationArray = ${index} / ${this.notificationArray} / ${this.notificationArray[index]}`)
      if (
        !this.notificationArray ||
        !this.notificationArray[index] ||
        this.notificationArray[index].length === 0
      ) {
        //tempUrl = `/NotificationCenter/GetNotificationArrayPaging?pageNo=${this.pageCount}&pageSize=${this.pageSize}`
        tempUrl = `/NotificationCenter/GetNotificationArray?pageNo=${this.pageCount}&pageSize=${this.pageSize}`
      } else {
        //console.log(`111 ${this.notificationSet[index].pagingInfo.nextPageLink}`);
        //tempUrl = this.transRedirectUrl(this.notificationSet[index].pagingInfo.nextPageLink);
        tempUrl = `/NotificationCenter/GetNotificationArray?pageNo=${++this
          .notificationSet[index].pagingInfo.currentPage}&pageSize=${
          this.pageSize
        }`
      }
      //console.log(`tempUrl = ${tempUrl}`);
      this.isTextLoading = true;
      return apiAxios({
        method: 'post',
        url: tempUrl,
        params: {},
        data: {
          message_type: index,
          sort: sort,
          days: days,
          read_status: read_status,
        },
      }).then(res => {
        //console.log("data 1 = " + res.result.length)
        //console.log("data 1 = " + res.result)
        //console.log(`data 1 pageinfo = ${res.pagingInfo.totalRows}/${res.pagingInfo.currentPage}/${res.pagingInfo.totalPageCount}`);
        //console.log("data 1 = " + JSON.stringify(res.result))
        this.isTextLoading = false;
        if (
          !this.notificationArray ||
          !this.notificationArray[index] ||
          this.notificationArray[index].length === 0
        ) {
          //console.log("data 2 init")
          this.notificationArray[index] = []
          this.notificationSet[index] = {}
          this.notificationSet[index].type = index
          this.notificationSet[index].pagingInfo = {}
          this.notificationSet[index].sort = sort
          this.notificationSet[index].condition = ''
        }
        //console.log(`data 3 = ${index} / ${this.notificationArray[index].length}`)
        this.notificationArray.splice(index, 1, [
          ...this.notificationArray[index],
          ...res.result,
        ])
        this.notificationSet[index].pagingInfo = { ...res.pagingInfo }
        this.checkTabPageReadStatus(index)
        //console.log(`data 4 = ${index} / ${this.notificationArray[index].length} / ${JSON.stringify(this.notificationSet[index].pagingInfo)}`)
        //console.log("data 4 = " + this.notificationArray[index].length + "/" + JSON.stringify(this.notificationArray[index]))
      })
      //.finally(() => (this.isLoading = false))
    },
    updateReadStatus() {
      //console.log(`updateReadStatus in... ${arguments.length} / ${arguments[0]}`);
      let index = 0
      if (arguments.length === 0 || !arguments[0]) index = 0
      else if (arguments[0]) index = arguments[0]
      else index = undefined
      let id = ''
      if (arguments.length >= 2) {
        id = arguments[1]
      }
      let userId = ''
      if (arguments.length >= 3) {
        userId = arguments[2]
      }
      //console.log(`updateReadStatus 222... ${arguments.length} / ${index} / ${id}`);

      //this.isLoading = true
      let tempUrl = '/NotificationCenter/setNotificationReadStatus'
      //console.log(`tempUrl = ${tempUrl}`);
      return apiAxios({
        method: 'post',
        url: tempUrl,
        params: {},
        data: {
          message_type: index,
          user_id: userId,
          id: id,
        },
      }).then(res => {
        // console.log(res.result.unread_count)
        //console.log("data 1 = " + res.result)
        //console.log("data 2 = " + JSON.stringify(res.result))
        this.unreadCount = res.result.unread_count
        this.checkTabPageReadStatus(index)
        this.$snackbar.add(`訊息 ${res.result.id} 更改為已讀狀態`, {
          color: 'success',
        })
        this.$store.commit('setBadgeNumber', this.unreadCount)
      })
      //.finally(() => (this.isLoading = false))
    },
    updateAllReadStatus() {
      this.isLoading = true
      return apiAxios({
        method: 'post',
        url: '/NotificationCenter/setAllNotificationReadStatus',
        params: {},
        data: {
          message_type: `${this.currentTab}`,
        },
      }).then(res => {
        console.log(res.result)
        this.unreadCount = res.result.unread_count
        // this.notificationArray[0].forEach(el => {
        //   if (el.user_id === 'ALL' || el.user_id.split('-')[0] === 'group')
        //     el.all_read_status = 'Y'
        //   else el.read_status = 'Y'
        // })
        // this.notificationArray[1].forEach(el => {
        //   if (el.user_id === 'ALL' || el.user_id.split('-')[0] === 'group')
        //     el.all_read_status = 'Y'
        //   else el.read_status = 'Y'
        // })
        // this.notificationArray[2].forEach(el => {
        //   if (el.user_id === 'ALL' || el.user_id.split('-')[0] === 'group')
        //     el.all_read_status = 'Y'
        //   else el.read_status = 'Y'
        // })
        this.notificationArray[this.currentTab].forEach(el => {
          if (el.user_id === 'ALL' || el.user_id.split('-')[0] === 'group')
            el.all_read_status = 'Y'
          else el.read_status = 'Y'
        })
        this.checkTabPageReadStatus(0)
        this.checkTabPageReadStatus(1)
        this.checkTabPageReadStatus(2)
        this.$snackbar.add(
          `${this.tabItems[this.currentTab].text}更改為已讀狀態`,
          {
            color: 'success',
          }
        )
        this.$store.commit('setBadgeNumber', this.unreadCount)
        this.isLoading = false
      })
    },
    getUserUnreadCount() {
      return apiAxios({
        method: 'post',
        url: '/NotificationCenter/GetUserUnreadCount',
        params: {},
        data: {},
      }).then(res => {
        this.unreadCount = res.result.unread_count
        this.$store.commit('setBadgeNumber', this.unreadCount)
      })
    },
    checkTabPageReadStatus(index) {
      let dataObj = this.notificationArray[index].filter(
        x =>
          (x.read_status === 'N' &&
            (x.user_id !== 'ALL' || x.user_id.split('-')[0] !== 'group')) ||
          (x.all_read_status === 'N' &&
            (x.user_id === 'ALL' || x.user_id.split('-')[0] === 'group'))
      )
      //console.log(`dataObj.length = ${dataObj} / ${dataObj.length} / ${((dataObj.length > 0)?true:false)}`);
      this.tabItems[index].badge = dataObj.length > 0 ? true : false
    },
  },
}
</script>
