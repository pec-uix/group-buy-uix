<template>
  <div>
    <div class="d-flex">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
    </div>
    <v-card elevation="2" class="mb-4">
      <div class="d-flex justify-space-between align-center">
        <v-btn small text class="py-5" @click="changeDate('subtract')">
          <background-svg
            backgroungUrl="/chevron_left.svg"
            width="16px"
            height="16px"
            color="#000"
          ></background-svg>
        </v-btn>
        <span>
          {{
            `${selectDate.year}年 ${selectDate.month[0]}月 - ${selectDate.month[1]}月`
          }}
        </span>
        <v-btn small text class="py-5" @click="changeDate('add')">
          <background-svg
            backgroungUrl="/chevron_right.svg"
            width="16px"
            height="16px"
            color="#000"
          ></background-svg>
        </v-btn>
      </div>
    </v-card>
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="white"
        fixed-tabs
        icons-and-text
        centered
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
            v-show="item.length"
            color="red"
            :content="item.length"
            offset-x="-15"
            offset-y="12"
          >
          </v-badge>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <div v-if="tab === 'tab-1'" class="mx-auto mt-2 px-2">
          若您的中獎發票未呈現於此，詳情請至
          <router-link to="/faq/INVO?qid=45"> 【常見問題】 </router-link>
          內查閱。
        </div>
        <v-tab-item v-for="(item, i) in tabItems" :key="i" :value="'tab-' + i">
          <v-card flat>
            <invoice-list
              :invoice-status="item.status"
              :invoice-mine="item.mine"
              :invoice-array="invoiceArray[i]"
              :notification-no="notificationNo ? notificationNo : ''"
              :is-loading="isLoading"
            ></invoice-list>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import InvoiceList from '@/components/InvoiceList.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { apiAxios } from '@/api'

export default {
  components: { InvoiceList, BackgroundSvg },
  created() {
    this.currentYear = this.$dayjs().year()
    this.currentMonth = this.$dayjs().month()
    if (this.$route.query.invoNo && this.$route.query.invoDate) {
      this.tab = 'tab-1'
      this.notificationNo = this.$route.query.invoNo
      this.currentYear = this.$dayjs(this.$route.query.invoDate).year()
      this.currentMonth = this.$dayjs(this.$route.query.invoDate).month()
    }
    return this.fetchInvoData()
  },
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
          text: '發票日誌',
          to: '/my-invoice',
        },
      ],
      tab: null,
      tabItems: [
        {
          text: '消費發票',
          icon: 'ticket',
          status: 0,
          mine: true,
          length: 0,
        },
        {
          text: '中獎發票',
          icon: 'emoji_events',
          status: 1,
          mine: true,
          length: 0,
        },
        // {
        //   text: '團購網開獎',
        //   icon: 'casino',
        //   status: null,
        //   mine: false,
        //   length: 0,
        // },
      ],
      invoiceArray: [],
      currentDate: 0,
      currentMonth: 0,
      notificationNo: '',
      currentTab: 0,
    }
  },
  computed: {
    selectDate() {
      // 月份為 0 ~ 11
      if (this.currentMonth % 2) {
        // 目前是偶數月
        return {
          year: this.currentYear,
          month: this.padStartMonth([this.currentMonth, this.currentMonth + 1]),
        }
      } else {
        // 目前是奇數月
        return {
          year: this.currentYear,
          month: this.padStartMonth([
            this.currentMonth + 1,
            this.currentMonth + 2,
          ]),
        }
      }
    },
  },
  methods: {
    fetchInvoData() {
      this.isLoading = true
      return Promise.all([this.fetchMyInvo(), this.fetchPrizeInvo()]).finally(
        () => (this.isLoading = false)
      )
    },
    fetchMyInvo() {
      return apiAxios({
        method: 'post',
        url: '/Invo/GetInvo',
        data: {
          start_month: `${this.selectDate.year}${this.selectDate.month[0]}`,
          end_month: `${this.selectDate.year}${this.selectDate.month[1]}`,
        },
      }).then(res => {
        this.invoiceArray[0] = res.result
        this.invoiceArray[1] = res.result.filter(e => e.prize !== null)
        this.tabItems[0].length = this.invoiceArray[0].length
        this.tabItems[1].length = this.invoiceArray[1].length
      })
    },
    fetchPrizeInvo() {
      return apiAxios({
        method: 'post',
        url: '/Invo/GetPrizeInvo',
        data: {
          start_month: `${this.selectDate.year}${this.selectDate.month[0]}`,
          end_month: `${this.selectDate.year}${this.selectDate.month[1]}`,
        },
      }).then(res => {
        this.invoiceArray[2] = res.result
        this.tabItems[2].length = this.invoiceArray[2].length
      })
    },
    changeDate(way) {
      if (this.$route.query.invoNo && this.$route.query.invoDate) {
        this.notificationNo = ''
        let path = this.$route.path
        this.$router.push(path)
      }
      let NewDate = null
      NewDate = this.$dayjs(
        `${this.selectDate.year}${this.selectDate.month[1]}`
      )[way](2, 'month')
      this.selectDate.year = NewDate.year()
      this.selectDate.month = this.padStartMonth([
        NewDate.month(),
        parseInt(NewDate.month()) + 1,
      ])
      this.fetchInvoData()
    },
    padStartMonth(arr) {
      return arr.map(e => e.toString().padStart(2, '0'))
    },
  },
}
</script>
<style scoped>
.v-tabs:not(.v-tabs--vertical) .v-tab {
  white-space: nowrap !important;
}
</style>
