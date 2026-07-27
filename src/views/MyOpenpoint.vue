<template>
  <div>
    <div class="d-flex">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
    </div>
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
          {{ item.text }}月
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(item, i) in tabItems" :key="i" :value="'tab-' + i">
          <v-card flat>
            <v-container fluid v-if="!isLoading">
              <v-row dense v-if="opArray[currentTab].length">
                <v-col
                  cols="12"
                  v-for="(op, index) in opArray[currentTab]"
                  :key="index"
                >
                  <v-card>
                    <v-card-title class="d-flex justify-space-between">
                      <v-alert
                        border="left"
                        class="primary--text py-0 mb-0 bg-transparent"
                        dense
                        tile
                        colored-border
                        color="primary"
                        elevation="0"
                      >
                        <span class="text-h6">
                          {{ $dayjs(op.tran_date).format('MM/DD') }}
                          {{ op.store_name }}</span
                        >
                      </v-alert>
                    </v-card-title>
                    <v-card-text>
                      <div>{{ op.op_carrier }}</div>
                      <div class="d-flex justify-space-between align-end">
                        <v-chip label color="black--text" small class="mt-2">
                          給點日 {{ $dayjs(op.cr_date).format('YYYY-MM-DD') }}
                        </v-chip>
                        <div class="d-flex">
                          <span class="point">P</span>
                          <span
                            class="secondary--text ml-2"
                            style="font-size: 18px"
                          >
                            {{ op.op_point }}
                          </span>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12">
                  <div class="text-center my-5">本月無點數資訊</div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import { apiAxios } from '@/api'

export default {
  created() {
    return this.initData()
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
          text: 'OP贈點明細',
          to: '/my-oppoint',
        },
      ],
      tab: null,
      tabItems: [],
      currentMonth: '',
      currentYear: '',
      startDate: '',
      currentTab: 0,
      opArray: [],
    }
  },
  computed: {},
  methods: {
    initData() {
      this.currentYear = this.$dayjs().format('YYYY')
      this.currentMonth = this.$dayjs().format('M')
      let lastMonth = this.$dayjs().subtract(1, 'month').format('M')
      let beforeLastMonth = this.$dayjs().subtract(2, 'month').format('M')
      this.startDate = `${this.currentYear}${this.currentMonth
        .toString()
        .padStart(2, '0')}`
      this.tabItems = [
        { text: beforeLastMonth },
        { text: lastMonth },
        { text: this.currentMonth },
      ]
      this.tab = 'tab-2'
      this.currentTab = +this.tab.split('-')[1]
      return this.getMonthOpenPoint()
    },
    getMonthOpenPoint() {
      let firstMonth = this.$dayjs(this.startDate)
        .subtract(2, 'month')
        .format('YYYYMM')
      let secondMonth = this.$dayjs(this.startDate)
        .subtract(1, 'month')
        .format('YYYYMM')
      this.isLoading = true
      return Promise.all([
        apiAxios({
          method: 'post',
          url: '/OpenPoint/GetOpenPointDetail',
          data: {
            start_date: firstMonth,
          },
        }),
        apiAxios({
          method: 'post',
          url: '/OpenPoint/GetOpenPointDetail',
          data: {
            start_date: secondMonth,
          },
        }),
        apiAxios({
          method: 'post',
          url: '/OpenPoint/GetOpenPointDetail',
          data: {
            start_date: this.startDate,
          },
        }),
      ]).then(res => {
        this.opArray = res.map(e => {
          e.result
            .sort((a, b) =>
              new Date(this.$dayjs(a.tran_date).format('YYYY-MM-DD')) >
              new Date(this.$dayjs(b.tran_date).format('YYYY-MM-DD'))
                ? -1
                : 1
            )
            .sort((a, b) =>
              new Date(this.$dayjs(a.cr_date).format('YYYY-MM-DD')) >
              new Date(this.$dayjs(b.cr_date).format('YYYY-MM-DD'))
                ? -1
                : 1
            )
            .map(x => {
              // 移除卡號前的0
              x.op_carrier = x.op_carrier.replace(/^0+/g, '')
              let middleLength = x.op_carrier.length - 10
              let start = x.op_carrier.substring(0, 6)
              let end = x.op_carrier.slice(-4)
              x.op_carrier = start + '*'.repeat(middleLength) + end
              return e
            })
          return e.result
        })
        this.isLoading = false
      })
    },
  },
}
</script>
<style scoped>
.v-tabs:not(.v-tabs--vertical) .v-tab {
  white-space: nowrap !important;
}
.point {
  width: 20px;
  height: 20px;
  background-color: var(--v-secondary-base);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
}
</style>
