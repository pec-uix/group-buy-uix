<template>
  <v-container fluid class="pt-0">
    <v-img src="/order-submited.jpg" class="pec-page"> </v-img>
    <pec-line></pec-line>

    <h6 class="text-center mt-10 mb-7 text-h6">
      您可於
      <span class="primary--text"> 「我的訂單」 </span>
      檢視商品<br />訂單成立後，將以E-mail通知
    </h6>
    <v-overlay v-if="paymentUrl" :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row v-else-if="isProductLoading">
      <v-col cols="4">
        <v-skeleton-loader type="image"></v-skeleton-loader>
      </v-col>
      <v-col cols="8">
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
      </v-col>
    </v-row>
    <template v-else>
      <v-card class="d-md-none pa-3">
        <div class="pec-title-bl mb-3 rounded-0 primary--text">
          訂單編號：{{ orderId }}
        </div>
        <div class="d-flex mb-2">
          <v-img
            :src="product.img_url_array[0].img_url"
            aspect-ratio="1"
            class="grey flex-grow-0"
            width="96px"
          ></v-img>
          <div class="flex-grow-1 px-4 py-1">
            {{ product.product_name }}
          </div>
        </div>
        <table class="my-order mb-3">
          <tbody>
            <tr>
              <td class="primary--text text-center pec-w-50">
                已訂購({{ totalOrderNum }})件
              </td>
              <td class="primary--text text-center pec-w-50">
                總計 ${{ totalPrice.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
        <table
          v-for="detail in order.detail_array"
          :key="detail.detail_id"
          class="my-order mb-2"
        >
          <tbody>
            <tr>
              <td colspan="2">規格：{{ detail.spec_name }}</td>
            </tr>
            <tr>
              <td class="pec-w-50">
                <div class="d-flex justify-space-between">
                  <span>單價：</span>
                  <span>${{ detail.discount_price.toLocaleString() }}</span>
                </div>
              </td>
              <td class="pec-w-50">
                <div class="d-flex justify-space-between">
                  <span>訂購數量：</span>
                  <span>{{ detail.order_num }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="d-flex justify-space-between">
                  <span>金額：</span>
                  <span>
                    ${{
                      (
                        detail.order_num * detail.discount_price
                      ).toLocaleString()
                    }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <table v-if="order.shipment" class="my-order mb-3">
          <tbody>
            <tr>
              <td class="pec-w-50">
                <div class="d-flex justify-space-between">
                  <span>運費：</span>
                </div>
              </td>
              <td class="pec-w-50 text-right">
                <span>${{ order.shipment }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <v-divider class="mt-4"></v-divider>
        <div class="px-3 py-2">
          <span>付款方式：</span
          ><span class="primary--text">
            {{ order.payment_type_name }}
            <template v-if="order.payment_type === '2'">
              ({{ order.payment_tool_name }})
            </template>
          </span>
        </div>
        <v-divider></v-divider>
        <div class="px-3 py-2">
          <span>付款狀態：</span
          ><span class="primary--text"> {{ order.payment_status_name }}</span>
        </div>
        <v-divider></v-divider>
        <div class="px-3 py-2">
          <span>領貨方式：</span
          ><span class="primary--text"> {{ order.receive_type_name }}</span>
        </div>
        <v-divider></v-divider>
        <div v-if="order.receive_type == 1" class="px-3 py-2">
          <span>領貨廠區：</span
          ><span class="primary--text"> {{ order.receive_area_name }}</span>
        </div>
        <div v-if="order.receive_type == 2" class="px-3 py-2">
          <span>宅配地址：</span
          ><span class="primary--text"> {{ order.receive_address }}</span>
        </div>
        <v-divider></v-divider>
        <template v-if="product.group_buy_mark === 'Y'">
          <div class="px-3 py-2">
            <span>累積 / 成團件數：</span>
            <span>
              {{ product.order_num_with_ratio }} / {{ product.goal_num }}
            </span>
            <span
              v-if="product.order_num_with_ratio >= product.goal_num"
              class="primary--text"
              >(已成團)</span
            >
          </div>
          <v-divider></v-divider>
        </template>
        <div class="px-3 py-2">
          <span>截止日：</span
          ><span class="primary--text">
            {{ relativeTime(product.end_date) }} ({{
              product.end_date.substring(0, 10)
            }})</span
          >
        </div>
        <v-divider></v-divider>
        <v-row class="mt-8">
          <v-col cols="6"
            ><v-btn outlined block color="primary" to="/my-order"
              >我的訂單</v-btn
            ></v-col
          >
          <v-col cols="6"
            ><v-btn
              depressed
              block
              color="primary"
              :to="`/category/${product.category_array[0].category_id}`"
              >繼續購買</v-btn
            ></v-col
          >
        </v-row>
      </v-card>
      <v-card class="d-none d-md-block px-11 pa-9">
        <div class="d-flex">
          <v-img
            :src="product.img_url_array[0].img_url"
            aspect-ratio="1"
            class="grey flex-grow-0"
            width="176px"
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
                訂單編號： {{ orderId }}
              </p>
              <h6 class="text-h6">
                {{ product.product_name }}
              </h6>
            </div>
            <div class="mt-4">
              <p>
                <span>付款方式：</span>
                <span class="primary--text">
                  {{ order.payment_type_name }}
                  <template v-if="order.payment_type === '2'">
                    ({{ order.payment_tool_name }})
                  </template>
                </span>
                <span class="mx-4">|</span>
                <span>付款狀態：</span>
                <span class="primary--text">
                  {{ order.payment_status_name }}
                </span>
              </p>
              <p class="mt-2">
                <span>領貨方式：</span>
                <span class="primary--text">
                  {{ order.receive_type_name }}
                </span>
                <template v-if="order.receive_type == 1">
                  <span class="mx-4">|</span>

                  <span>領貨廠區：</span>
                  <span class="primary--text">
                    {{ order.receive_area_name }}
                  </span>
                </template>
                <template v-if="order.receive_type == 2">
                  <div>
                    <span>宅配地址：</span>
                    <span class="primary--text">
                      {{ order.receive_address }}
                    </span>
                  </div>
                </template>
              </p>
              <p v-if="product.group_buy_mark === 'Y'" class="mb-0">
                <span>累積 / 成團件數：</span>
                <span class="primary--text">
                  {{ product.order_num_with_ratio }} /
                  {{ product.goal_num }} </span
                ><span v-if="product.order_num_with_ratio >= product.goal_num"
                  >(已成團)</span
                >
                <span class="mx-4">|</span>
                <span>截止日：</span>
                <span class="primary--text">
                  {{ relativeTime(product.end_date) }} ({{
                    product.end_date.substring(0, 10)
                  }})</span
                >
              </p>
            </div>
          </div>
        </div>
        <table class="my-order mt-10">
          <thead>
            <tr>
              <th class="text-left">選擇規格</th>
              <th class="text-right">單價</th>
              <th class="text-right">訂購數量</th>
              <th class="text-right">金額</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in order.detail_array" :key="detail.detail_id">
              <td class="text-left">{{ detail.spec_name }}</td>
              <td class="text-right">
                ${{ detail.discount_price.toLocaleString() }}
              </td>
              <td class="text-right">{{ detail.order_num }}</td>
              <td class="text-right">
                ${{
                  (detail.order_num * detail.discount_price).toLocaleString()
                }}
              </td>
            </tr>
            <tr v-if="order.shipment > 0">
              <td colspan="2">運費</td>

              <td colspan="2" class="text-right">
                ${{ this.order.shipment.toLocaleString() }}
              </td>
            </tr>
            <tr>
              <td colspan="4" class="text-right primary--text">
                <span>已訂購({{ totalOrderNum }})件</span>
                <span class="ml-12"
                  >總計 ${{ totalPrice.toLocaleString() }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-center mt-5">
          <v-btn outlined color="primary" to="/my-order">我的訂單</v-btn>
          <v-btn
            class="ml-4"
            depressed
            color="primary"
            :to="`/category/${product.category_array[0].category_id}`"
            >繼續購買</v-btn
          >
        </div>
      </v-card>
    </template>
  </v-container>
</template>
<script>
import { apiAxios } from '@/api'
import PecLine from '@/components/PecLine.vue'

export default {
  props: ['orderId', 'paymentUrl'],
  components: {
    PecLine,
  },
  created() {
    if (this.paymentUrl) {
      this.overlay = true
      window.location.href = this.paymentUrl
    } else {
      return apiAxios({
        method: 'post',
        url: '/Preorder/GetPreorder',
        params: { v: '2' },
        data: {
          preorder_id: this.orderId,
        },
      })
        .then(res => {
          this.order = res.result[0]
          return apiAxios({
            method: 'post',
            url: '/Product/GetProductV2',
            params: { v: '2' },
            data: {
              product_id: this.order.product_id,
            },
          }).then(res => (this.product = res.result[0]))
        })
        .finally(() => (this.isProductLoading = false))
    }
  },
  data() {
    return {
      isProductLoading: false,
      overlay: false,
      order: {
        product_id: '',
        receive_type: '',
        receive_type_name: '',
        receive_area_name: '',
        receive_address: '',
        shipment: 0,
        detail_array: [],
      },
      product: {
        end_date: '',
        estimate_arrival_date: '',
        goal_num: 0,
        img_url_array: [{}],
        max_list_price: 0,
        num_price_array: [],
        order_num: 0,
        order_num_with_ratio: 0,
        product_id: null,
        product_name: '',
        spec_array: [],
        start_date: '',
        supplier: '',
        receive_type: '',
        receive_type_array: [],
        receive_area: '',
        receive_area_array: [],
        limit_num: null,
        category_array: [{}],
      },
    }
  },
  computed: {
    totalOrderNum() {
      return this.order.detail_array.reduce(
        (acc, cur) => acc + cur.order_num,
        0
      )
    },
    totalPrice() {
      return (
        this.order.detail_array.reduce(
          (acc, cur) => acc + cur.discount_price * cur.order_num,
          0
        ) + this.order.shipment
      )
    },
  },
  methods: {
    relativeTime(dateString) {
      return this.$dayjs().to(this.$dayjs(dateString))
    },
  },
}
</script>
<style >
.pec-card-title {
  border-left: 2px solid var(--v-primary-base);
  padding-left: 8px;
}
table.my-order {
  width: 100%;
  border-collapse: collapse;
}
table.my-order th,
table.my-order td {
  padding: 12px;
  border: 1px solid #dddddd;
}
th {
  background: #f5f5f5;
}
</style>