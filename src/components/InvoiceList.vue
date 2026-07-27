<template>
  <div>
    <v-container fluid>
      <v-row dense v-if="!isLoading">
        <v-col v-if="invoiceArray.length <= 0" cols="12">
          <div v-if="invoiceMine" class="text-center my-5">
            目前無{{ invoiceStatus ? '中獎' : '' }}發票
          </div>
          <div v-else class="text-center my-5">尚未開獎</div>
        </v-col>
        <v-col
          v-else
          cols="12"
          v-for="(invoice, index) in invoiceArray"
          :key="index"
        >
          <v-card :disabled="!invoiceMine" @click="showInvoDialog(invoice)">
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
                <span v-if="invoiceMine" class="text-h6">
                  {{ invoice.invo_no }}</span
                >
                <span v-else class="text-h6">
                  {{ invoice.invo_no.slice(0, -4) + '****' }}
                </span>
                <v-chip
                  small
                  class="ml-1"
                  color="orange"
                  text-color="white"
                  v-if="invoice.prize !== null"
                >
                  <background-svg
                    backgroungUrl="/auto_awesome.svg"
                    width="16px"
                    height="16px"
                    color="#fff"
                    class="mt-1 mr-1"
                  ></background-svg>
                  <span v-if="invoiceMine">
                    {{ invoiceStatus ? invoice.prize_amt : '中獎' }}
                  </span>
                  <span v-else>{{ invoice.prize }}</span>
                </v-chip>
              </v-alert>
              <v-badge
                v-show="invoice.invo_no === notificationNo"
                color="red"
                dot
                offset-x="2"
                offset-y="-13"
              ></v-badge>
            </v-card-title>
            <v-card-text class="d-flex justify-space-between">
              <v-chip label color="black--text" small>
                {{ $dayjs(invoice.invo_date).format('YYYY-MM-DD') }}
              </v-chip>
              <div v-show="invoiceMine" class="secondary--text">
                ${{ invoice.amt.toLocaleString() }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="invoDialog" scrollable max-width="600">
        <v-card v-if="invoDialogData">
          <v-card-title class="d-block text-center primary--text">
            {{ invoDialogData.invo_no }}
          </v-card-title>
          <v-card-text class="pb-0">
            <div class="text-center">交易明細</div>
            <v-divider></v-divider>
            <v-row class="pt-2 font-weight-bold" no-gutters>
              <v-col cols="7">品名</v-col>
              <v-col cols="2" class="text-right">數量</v-col>
              <v-col cols="3" class="text-right">價格</v-col>
            </v-row>
            <v-row
              class="pt-2"
              no-gutters
              v-for="(detail, i) in invoDialogData.invo_detail"
              :key="i"
            >
              <v-col cols="7">{{ detail.product_name + detail.spec }}</v-col>
              <v-col cols="2" class="text-right">{{ detail.order_num }}</v-col>
              <v-col cols="3" class="text-right">
                ${{ detail.final_price.toLocaleString() }}
              </v-col>
            </v-row>
            <div
              v-if="invoDialogData.invo_detail"
              class="d-flex justify-space-between mt-3 font-weight-bold"
            >
              <span>共 {{ invoDialogData.invo_detail.length }} 項</span>
              <span>
                合計
                <span class="primary--text">
                  ${{ invoDetailSum.toLocaleString() }}
                </span>
              </span>
            </div>
          </v-card-text>
          <v-container v-if="invoDialogData.prize">
            <div class="text-h6 warning--text">{{ invoDialogData.prize }}</div>
            <v-alert outlined color="warning">
              <div class="text-h6 d-flex justify-center">
                <span>中獎金額：</span>
                <span class="primary--text">
                  ${{ invoDialogData.prize_amt.toLocaleString() }}
                </span>
              </div>
            </v-alert>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="invoDialog = false">
              確認
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { apiAxios } from '@/api'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  components: {
    BackgroundSvg,
  },
  props: {
    isLoading: Boolean,
    invoiceArray: { type: Array, default: () => [] },
    invoiceStatus: Number,
    invoiceMine: Boolean,
    notificationNo: String,
  },
  data() {
    return {
      invoDialog: false,
      invoDialogData: null,
    }
  },
  computed: {
    invoDetailSum() {
      return this.invoDialogData.invo_detail
        .map(e => e.order_num * e.final_price)
        .reduce((a, b) => a + b)
    },
  },
  methods: {
    showInvoDialog(invoice) {
      if (invoice.preorder_id) {
        this.invoDialogData = invoice
        apiAxios({
          method: 'POST',
          url: '/Invo/GetInvoDetail',
          data: { preorder_id: invoice.preorder_id },
        }).then(res => {
          this.invoDialogData.invo_detail = res.result
          this.invoDialog = true
        })
      }
    },
  },
}
</script>

<style scoped>
.v-alert__content {
  display: flex;
  align-items: center;
}
.bg-transparent {
  background-color: transparent !important;
}
</style>