  <template>
  <pec-member-template img-src="/my-order.jpg">
    <!-- <v-card class="px-7 py-4 mb-4">
      <h6 class="rounded-0 text-h6 pec-title-bl font-weight-bold">
        本月累計薪資扣款金額：NT$ 10,000
      </h6>
    </v-card> -->

    <template v-if="isProductLoading">
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
    </template>
    <template v-else>
      <v-expansion-panels v-model="panel" class="d-md-none">
        <v-expansion-panel v-for="order in orderArray" :key="order.id">
          <v-expansion-panel-header hide-actions>
            <div class="d-flex align-center">
              <v-img
                aspect-ratio="1"
                class="grey flex-grow-0"
                width="72px"
                :src="order.img_url"
              ></v-img>
              <div
                class="
                  d-flex
                  flex-column
                  justify-space-between
                  flex-grow-1
                  px-4
                  py-1
                "
              >
                <div>
                  <div
                    class="
                      pec-card-title
                      primary--text
                      mb-3
                      d-flex
                      justify-space-between
                      align-center
                    "
                  >
                    <span> 訂單編號： {{ order.id }} </span>
                    <v-chip label small class="ml-3" color="primary">
                      {{ order.order_status_name }}</v-chip
                    >
                  </div>
                  <div class="text-subtitle-2">
                    {{ order.product_name }}
                  </div>
                </div>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-divider></v-divider>

              <v-container fluid class="whitespace-nowrap">
                <v-row>
                  <v-col class="black--text" cols="4">件數：</v-col>
                  <v-col class="primary--text" cols="8">{{
                    totalOrderNum(order.detail_array)
                  }}</v-col>
                  <v-col class="black--text" cols="4">金額：</v-col>
                  <v-col class="primary--text" cols="8"
                    >${{
                      totalPrice(order.detail_array).toLocaleString()
                    }}</v-col
                  >
                  <v-col class="black--text" cols="4">截止日：</v-col>
                  <v-col class="primary--text" cols="8"
                    >{{ relativeTime(order.end_date) }} ({{
                      order.end_date.substring(0, 10)
                    }})</v-col
                  >
                  <v-col class="pt-0" cols="12">
                    <v-divider></v-divider>
                  </v-col>
                  <v-col class="black--text" cols="4">領貨方式：</v-col>
                  <v-col class="primary--text" cols="8">{{
                    order.receive_type_name
                  }}</v-col>
                  <v-col class="black--text" cols="4">付款方式：</v-col>
                  <v-col class="primary--text" cols="8">取貨付款</v-col>
                  <template v-if="order.receive_type == '1'">
                    <v-col class="black--text" cols="4">領貨廠區：</v-col>
                    <v-col class="primary--text" cols="8">{{
                      order.receive_name
                    }}</v-col>
                  </template>
                  <v-col cols="12" v-else>
                    <div class="text-caption">宅配地址：</div>
                    <div class="primary--text">{{ order.receive_name }}</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-divider></v-divider>
                    <table class="my-order mb-3">
                      <tbody>
                        <tr>
                          <td class="primary--text text-center pec-w-50">
                            已訂購({{ totalOrderNum(order.detail_array) }})件
                          </td>
                          <td class="primary--text text-center pec-w-50">
                            總計 ${{
                              totalPrice(order.detail_array).toLocaleString()
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      v-for="detail in order.detail_array"
                      :key="detail.id"
                      class="my-order mb-3"
                    >
                      <tbody>
                        <tr>
                          <td colspan="2">{{ detail.spec_name }}</td>
                        </tr>
                        <tr>
                          <td class="pec-w-50">
                            <div class="d-flex justify-space-between">
                              <span>單價：</span
                              ><span
                                >${{
                                  detail.discount_price.toLocaleString()
                                }}</span
                              >
                            </div>
                          </td>
                          <td class="pec-w-50">
                            <div class="d-flex justify-space-between">
                              <span>訂購數量：</span
                              ><span>{{ detail.order_num }}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <div class="d-flex justify-space-between">
                              <span>金額：</span
                              ><span
                                >${{
                                  (
                                    detail.order_num * detail.discount_price
                                  ).toLocaleString()
                                }}</span
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                  <v-col
                    cols="12"
                    class="text-right"
                    v-if="
                      order.order_status == '0' || order.order_status == '5'
                    "
                    @click="cancelOrder(order)"
                  >
                    <v-btn
                      color="primary"
                      text
                      class="text-decoration-underline"
                      >取消訂單</v-btn
                    >
                  </v-col>
                  <v-col
                    cols="12"
                    class="text-right"
                    v-if="
                      order.payment_status == '1' && order.invo_status == '1'
                    "
                    @click="showReturnDialog(order.id)"
                  >
                    <v-btn
                      color="primary"
                      text
                      class="text-decoration-underline"
                      >申請退貨</v-btn
                    >
                  </v-col>
                  <v-col cols="12">
                    <v-btn block outlined color="primary" @click="panel = ''"
                      >收合訂單</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels v-model="panel" class="d-none d-md-flex">
        <v-expansion-panel v-for="order in orderArray" :key="order.id">
          <v-expansion-panel-header>
            <div class="d-flex align-center pa-7">
              <v-img
                aspect-ratio="1"
                class="grey flex-grow-0"
                width="120px"
                :src="order.img_url"
              ></v-img>
              <div
                class="
                  d-flex
                  flex-column
                  justify-space-between
                  flex-grow-1
                  px-4
                  py-1
                "
              >
                <div>
                  <p class="pec-card-title primary--text">
                    訂單編號： {{ order.id }}
                    <v-chip label small class="ml-3" color="primary">
                      {{ order.order_status_name }}</v-chip
                    >
                  </p>
                  <p>
                    {{ order.product_name }}
                  </p>
                </div>
                <div>
                  <p>
                    <span>件數：</span>
                    <span class="primary--text">
                      {{ totalOrderNum(order.detail_array) }}
                    </span>
                    <span class="mx-4">|</span>
                    <span>金額：</span>
                    <span class="primary--text">
                      ${{ totalPrice(order.detail_array).toLocaleString() }}
                    </span>
                    <span class="mx-4">|</span>
                    <span>截止日：</span>
                    <span class="primary--text">
                      {{ relativeTime(order.end_date) }} ({{
                        order.end_date.substring(0, 10)
                      }})
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <template v-slot:actions>
              <v-btn color="primary" outlined>
                <v-icon color="primary"> $expand </v-icon>
                查看訂單</v-btn
              >
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-divider></v-divider>
              <v-container fluid class="pa-7">
                <v-row>
                  <v-col class="black--text" cols="3">領貨方式</v-col>
                  <v-col class="black--text" cols="3">付款方式</v-col>
                  <v-col class="black--text" cols="3">訂單狀態</v-col>
                  <v-col class="black--text" cols="3">操作</v-col>
                  <v-col class="pt-0" cols="12">
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3"> {{ order.receive_type_name }} </v-col>
                  <v-col cols="3"> 取貨付款 </v-col>
                  <v-col cols="3"
                    ><v-chip label small class="ml-3" color="primary">
                      {{ order.order_status_name }}
                    </v-chip>
                  </v-col>
                  <v-col cols="3">
                    <v-btn
                      color="primary"
                      text
                      class="text-decoration-underline"
                      v-if="
                        order.order_status == '0' || order.order_status == '5'
                      "
                      @click="cancelOrder(order)"
                      >取消訂單</v-btn
                    >
                    <v-btn
                      color="primary"
                      text
                      class="text-decoration-underline"
                      v-if="
                        order.payment_status == '1' && order.invo_status == '1'
                      "
                      @click="cancelOrder(order)"
                      >申請退貨</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    領貨廠區：<span class="primary--text">{{
                      order.receive_name
                    }}</span></v-col
                  >
                </v-row>
                <v-row class="mt-8">
                  <v-col class="text-left" cols="4">選擇規格</v-col>
                  <v-col class="text-right" cols="3">單價</v-col>
                  <v-col class="text-right" cols="2">訂購數量</v-col>
                  <v-col class="text-right" cols="3">小計</v-col>
                  <v-col cols="12" class="py-0">
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row v-for="detail in order.detail_array" :key="detail.id">
                  <v-col cols="4">{{ detail.spec_name }}</v-col>
                  <v-col class="text-right" cols="3"
                    >${{ detail.discount_price.toLocaleString() }}</v-col
                  >
                  <v-col class="text-right" cols="2">{{
                    detail.order_num
                  }}</v-col>
                  <v-col class="text-right" cols="3"
                    >${{
                      (
                        detail.order_num * detail.discount_price
                      ).toLocaleString()
                    }}</v-col
                  >
                </v-row>

                <v-row>
                  <v-col cols="12" class="primary--text text-right">
                    總計：$ ${{
                      totalPrice(order.detail_array).toLocaleString()
                    }}
                  </v-col>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-dialog v-model="dialog" scrollable max-width="800">
        <v-card>
          <v-card-text>
            <v-textarea v-model="reason" outlined label="退貨原因">
            </v-textarea>
            <v-checkbox
              v-model="checkbox"
              label="我同意辦理退貨時，由團購網代為處理發票及銷貨退回證明單，以加速退貨退款作業"
            ></v-checkbox>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" @click="dialog = false">
              取消
            </v-btn>
            <v-btn outlined color="primary" @click="dialog = false">
              送出申請
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </pec-member-template>
</template>
<script>
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
import { apiAxios } from '@/api'

export default {
  components: { PecMemberTemplate },
  props: ['order-id'],
  created() {
    this.isProductLoading = true

    return apiAxios({
      method: 'post',
      url: '/MyOrder/GetMyOrder',
      data: {},
    })
      .then(res => (this.orderArray = res.result))
      .then(
        () =>
          (this.panel = this.orderArray.findIndex(x => x.id == this.orderId))
      )
      .finally(() => (this.isProductLoading = false))
  },
  data() {
    return {
      isProductLoading: false,
      panel: '',
      checkbox: true,
      dialog: false,
      reason: '',
      selectedOrderId: '',
      orderArray: [],
    }
  },
  methods: {
    showReturnDialog(orderId) {
      this.selectedOrderId = orderId
      this.dialog = true
    },
    cancelOrder(order) {
      return apiAxios({
        method: 'post',
        url: '/Preorder/CancelPreorder',
        data: { order_id: order.id },
      })
        .then(() => {
          order.order_status = '9'
          order.order_status_name = '已取消'
        })
        .then(() => this.$snackbar.add('訂單已經取消', { color: 'success' }))
    },
    totalOrderNum(detailArray) {
      return detailArray.reduce((acc, cur) => acc + cur.order_num, 0)
    },
    totalPrice(detailArray) {
      return detailArray.reduce(
        (acc, cur) => acc + cur.discount_price * cur.order_num,
        0
      )
    },
    relativeTime(dateString) {
      return this.$dayjs().to(this.$dayjs(dateString))
    },
  },
}
</script>
<style scoped>
table.my-order {
  width: 100%;
  border-collapse: collapse;
}
table.my-order th,
table.my-order td {
  padding: 12px;
  border: 1px solid #dddddd;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.v-expansion-panels >>> .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>