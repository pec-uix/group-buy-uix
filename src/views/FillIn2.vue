<template>
  <v-form lazy-validation ref="form">
    <v-container fluid class="mt-3 mb-16">
      <v-row v-if="isProductLoading">
        <v-col cols="4">
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </v-col>
        <v-col cols="8">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12" md="4" class="d-none d-md-block">
          <pec-image-gallery :items="product.img_url_array"></pec-image-gallery>
        </v-col>
        <v-col cols="12" md="8">
          <v-card class="pa-3 pa-md-8 pb-md-11">
            <div class="d-flex mb-5 align-start d-md-none">
              <pec-image-gallery
                class="mr-2"
                :items="product.img_url_array"
              ></pec-image-gallery>
              <div class="flex-grow-1">
                <v-alert
                  v-if="product.subtitle"
                  border="left"
                  class="primary--text py-0 mb-3"
                  dense
                  tile
                  colored-border
                  color="primary"
                  elevation="0"
                >
                  {{ product.subtitle }}
                </v-alert>
                <h6 class="text-h6">
                  {{ product.product_name }}
                </h6>
                <div class="primary--text text-body-2 mt-9">
                  <p>商品編號：{{ product.product_id }}</p>
                  <p>廠商名稱：{{ product.supplier }}</p>
                </div>
              </div>
            </div>
            <div class="d-none d-md-block">
              <v-alert
                v-if="product.subtitle"
                border="left"
                class="primary--text py-0 mb-3"
                dense
                tile
                colored-border
                color="primary"
                elevation="0"
              >
                {{ product.subtitle }}
              </v-alert>
              <h6 class="text-h6 flex-grow-1">
                {{ product.product_name }}
              </h6>
              <!-- <div>
              <v-chip label color="primary">集氣拚成團</v-chip>
            </div> -->
              <div class="primary--text text-body-2 mt-9">
                <p>商品編號：{{ product.product_id }}</p>
                <p>廠商名稱：{{ product.supplier }}</p>
              </div>
              <v-divider class="mt-6 mb-7"></v-divider>
            </div>

            <v-row>
              <v-col cols="12" md="3" class="pb-0"> 商品規格與數量：</v-col>
              <v-col cols="12" md="9">
                <template
                  v-for="(spec, i) in product.spec_array.filter(
                    x => x.order_num > 0
                  )"
                >
                  <v-row :key="i">
                    <!-- <v-col cols="7">
                      <v-alert class="mb-0" dense outlined>
                        <div class="d-flex align-center">
                          <span class="flex-grow-1">
                            {{ spec.spec_name }}
                          </span>
                          <span class="primary--text ml-4 text-h6"
                            >${{ spec.discount_price.toLocaleString() }}</span
                          >
                        </div>
                      </v-alert>
                    </v-col> -->
                    <v-col cols="12">
                      <span class="text-h6 primary--text">
                        {{ spec.spec_name }} X{{ spec.order_num }} ${{
                          spec.discount_price.toLocaleString()
                        }}
                      </span>
                    </v-col>
                  </v-row>
                </template>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" md="3" class="pb-0"> 領貨方式：</v-col>
              <v-col cols="12" md="9" class="pt-0">
                <v-chip-group
                  v-model="receiveType"
                  column
                  active-class="selected"
                  mandatory
                >
                  <v-chip
                    v-for="receive_type in product.receive_type_array"
                    :key="receive_type.value"
                    :value="receive_type.value"
                    filter
                    label
                    outlined
                    >{{ receive_type.text }}</v-chip
                  >
                </v-chip-group>
              </v-col>
            </v-row>
            <v-row v-show="receiveType == 1" class="mt-4">
              <v-col cols="12" md="3" class="pb-0"> 領貨地點：</v-col>
              <v-col cols="12" md="9" class="pt-2">
                <v-select
                  v-model="receiveArea"
                  placeholder="請選擇地點"
                  outlined
                  dense
                  :rules="[v => receiveType == 2 || !!v || '請選擇領貨地點']"
                  :items="product.receive_area_array"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-show="receiveType == 2" class="mt-4">
              <v-col cols="12" md="3" class="pb-0"> 收件人姓名：</v-col>
              <v-col cols="12" md="9">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      placeholder="請輸入姓名"
                      outlined
                      dense
                      v-model="receivePerson"
                      :rules="[
                        v => receiveType == 1 || !!v || '請輸入收件人姓名',
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="3" class="pb-0"> 收件人電話：</v-col>
              <v-col cols="12" md="9">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      placeholder="請輸入電話"
                      outlined
                      dense
                      v-model="contactPhone"
                      :rules="[
                        v => receiveType == 1 || !!v || '請輸入收件人電話',
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="3" class="pb-0"> 宅配地址：</v-col>
              <v-col cols="12" md="9">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      placeholder="請輸入地址"
                      outlined
                      dense
                      v-model="receiveAddress"
                      :rules="[v => receiveType == 1 || !!v || '請輸入地址']"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" md="3" class="pb-0">財政部手機條碼: </v-col>
              <v-col cols="12" md="9">
                <v-text-field
                  placeholder="請輸入手機條碼(選填)"
                  v-model="carrierId"
                  outlined
                  dense
                  :rules="[
                    v =>
                      !v ||
                      /^\/{1}[0-9A-Z+-\.]{7}$/.test(v) ||
                      '請輸入正確格式',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" md="3" class="pb-0"> 付款方式：</v-col>
              <v-col cols="12" md="9" class="pt-0">
                <v-chip-group
                  class="mb-2"
                  column
                  v-model="paymentType"
                  mandatory
                  active-class="selected"
                >
                  <v-chip
                    v-for="payment_type in product.payment_type_array"
                    :key="payment_type.value"
                    :value="payment_type.value"
                    filter
                    label
                    outlined
                    >{{ payment_type.text }}</v-chip
                  >
                  <!-- <v-chip filter label outlined>廠商聯繫</v-chip> -->
                </v-chip-group>
                <a
                  v-if="paymentType == '1'"
                  class="text-decoration-underline"
                  @click="paymentType1Dialog = true"
                >
                  【取貨點繳費說明】
                </a>
                <a
                  v-if="paymentType == '2'"
                  class="text-decoration-underline"
                  @click="paymentType2Dialog = true"
                >
                  【線上支付說明】
                </a>
                <a
                  v-if="paymentType == '3'"
                  class="text-decoration-underline"
                  @click="paymentType3Dialog = true"
                >
                  【匯款說明事項】
                </a>
              </v-col>
            </v-row>
            <v-row class="mt-4" v-if="paymentType === '2'">
              <v-col cols="12" md="3" class="pb-0"> 付款工具：</v-col>
              <v-col cols="12" md="9" class="pt-0">
                <v-chip-group
                  column
                  v-model="paymentTool"
                  mandatory
                  active-class="selected"
                >
                  <v-chip
                    value="OPW"
                    filter
                    label
                    outlined
                    x-large
                    style="border-width: 3px"
                  >
                    <img src="/OPW.png" height="30" alt="" />
                  </v-chip>
                  <!-- v-if="showIcash" -->
                  <v-chip
                    value="ICASH"
                    filter
                    label
                    outlined
                    x-large
                    style="border-width: 4px"
                  >
                    <img
                      v-if="$dayjs().isAfter($dayjs('2024-04-01'))"
                      src="/ICP-new.png"
                      height="30"
                      alt=""
                    />
                    <img v-else src="/ICP.png" height="30" alt="" />
                  </v-chip>
                  <!-- <v-chip filter label outlined>廠商聯繫</v-chip> -->
                </v-chip-group>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" md="3" class="pb-0 pb-md-3">訂購數量：</v-col>
              <v-col cols="12" md="9" class="pt-0 pt-md-3">
                <span class="text-h6 primary--text"
                  >共 {{ specTotalNum }} 件</span
                >
                <span v-if="product.limit_num > 0" class="ml-4"
                  >限購 {{ product.limit_num }} 件</span
                >
                <v-alert
                  dense
                  text
                  type="warning"
                  :value="
                    showAlert &&
                    product.limit_num !== 0 &&
                    specTotalNum > product.limit_num
                  "
                  transition="scale-transition"
                >
                  不得超過限購數量
                </v-alert>
              </v-col>
              <template v-if="needShipment">
                <v-col cols="12" md="3" class="pb-0 pb-md-3">運費：</v-col>
                <v-col cols="12" md="9" class="pt-0 pt-md-3 text-h6">
                  <span class="primary--text"
                    >${{ product.shipment.toLocaleString() }}</span
                  >
                  <span class="ml-4"
                    >({{ product.free_shipment_num }}件以上免運)</span
                  >
                </v-col>
                <v-col cols="12" md="3" class="pb-0 pb-md-3">商品金額：</v-col>
                <v-col
                  cols="12"
                  md="9"
                  class="pt-0 pt-md-3 text-h6 primary--text"
                >
                  ${{
                    product.spec_array
                      .reduce(
                        (acc, cur) => acc + cur.order_num * cur.discount_price,
                        0
                      )
                      .toLocaleString()
                  }}
                </v-col>
              </template>

              <v-col cols="12" md="3" class="pb-0 pb-md-3">總付款金額：</v-col>
              <v-col
                cols="12"
                md="9"
                class="pt-0 pt-md-3 text-h6 primary--text"
              >
                ${{ orderTotalPrice.toLocaleString() }}
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col cols="12" md="3" class="pb-0">備註:</v-col>
              <v-col cols="12" md="9">
                <v-textarea
                  rows="3"
                  no-resize
                  maxlength="80"
                  counter
                  placeholder="請輸入備註(選填)"
                  outlined
                  dense
                  v-model="memo"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row class="mt-12">
              <v-col cols="12">
                <v-btn
                  depressed
                  block
                  color="primary"
                  :loading="isSubmitting"
                  @click="createPreorder"
                >
                  送出訂單
                </v-btn>
                <p class="pt-4">購買說明事項：</p>
                <ol>
                  <li>
                    發票由統一夢公園開立，相關發票作業請參考
                    <a
                      class="text-decoration-underline"
                      @click="invoDialog = true"
                    >
                      【電子發票服務說明】 </a
                    >。
                  </li>
                  <li>
                    欲以財政部手機條碼接收雲端發票者，請輸入手機條碼為〝/〞開頭之條碼，共8碼，無則免填。
                  </li>
                </ol>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="invoDialog" scrollable max-width="800">
      <v-card>
        <v-card-title>購買說明事項：</v-card-title>
        <v-card-text>
          <invo-instruction></invo-instruction>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="invoDialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paymentType1Dialog" scrollable max-width="800">
      <v-card>
        <v-card-title>取貨點繳費說明事項：</v-card-title>
        <v-card-text>
          <payment-type1-content></payment-type1-content>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="paymentType1Dialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paymentType2Dialog" scrollable max-width="800">
      <v-card>
        <v-card-title>線上支付說明事項：</v-card-title>
        <v-card-text>
          <payment-type2-content></payment-type2-content>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="paymentType2Dialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paymentType3Dialog" scrollable max-width="800">
      <v-card>
        <v-card-title>匯款說明事項：</v-card-title>
        <v-card-text>
          <payment-type3-content></payment-type3-content>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="paymentType3Dialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>
<script>
import { apiAxios } from '@/api'
import PecImageGallery from '@/components/PecImageGallery.vue'
import InvoInstruction from '@/components/InvoInstruction.vue'
import PaymentType1Content from '@/components/PaymentType1Content.vue'
import PaymentType2Content from '@/components/PaymentType2Content.vue'
import PaymentType3Content from '@/components/PaymentType3Content.vue'

export default {
  props: ['preorderId'],
  components: {
    PecImageGallery,
    InvoInstruction,
    PaymentType1Content,
    PaymentType2Content,
    PaymentType3Content,
  },
  created() {
    return Promise.all([this.fetchData()])
  },
  data() {
    return {
      invoDialog: false,
      paymentType1Dialog: false,
      paymentType2Dialog: false,
      paymentType3Dialog: false,
      isProductLoading: false,
      isSubmitting: false,
      showAlert: false,
      product: {
        end_date: '',
        estimate_arrival_date: '',
        goal_num: 0,
        img_url_array: [{}],
        max_list_price: 0,
        num_price_array: [],
        order_num: 0,
        product_id: null,
        product_name: '',
        spec_array: [],
        start_date: '',
        supplier: '',
        receive_type_array: [],
        receive_area_array: [],
        payment_type_array: [],
        limit_num: null,
      },
      numArray: Array.from({ length: 11 }).map((x, i) => ({
        text: i === 10 ? '10+' : i,
        value: i + '',
      })), //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      receiveType: '',
      receiveArea: this.defaultReceiveArea,
      receiveAddress: '',
      paymentType: '',
      paymentTool: '',
      receivePerson: '',
      contactPhone: '',
      memo: '',
      carrierId: this.$store.state.profile.carrier_id,
    }
  },
  watch: {
    specTotalNum(val) {
      if (val > 0) {
        this.showAlert = false
      }
    },
  },
  computed: {
    showIcash() {
      return !window.GroupJSInterface
    },
    specTotalNum() {
      return this.product.spec_array.reduce(
        (acc, cur) => acc + (parseInt(cur.order_num, 10) || 0),
        0
      )
    },
    needShipment() {
      return (
        this.receiveType == 2 &&
        this.product.shipment > 0 &&
        this.specTotalNum < this.product.free_shipment_num
      )
    },
    orderTotalPrice() {
      return (
        this.product.spec_array.reduce(
          (acc, cur) =>
            acc + (parseInt(cur.order_num, 10) || 0) * cur.discount_price,
          0
        ) + (this.needShipment ? this.product.shipment : 0)
      )
    },
  },
  methods: {
    fetchData() {
      this.isProductLoading = true
      let order
      return apiAxios({
        method: 'post',
        url: '/Preorder/GetPreorder13',
        data: {
          preorder_id: this.preorderId,
        },
      })
        .then(res => {
          order = res.result
          return apiAxios({
            method: 'post',
            url: '/Product/GetProduct',
            params: { v: '2' },
            data: {
              product_id: res.result.product_id,
            },
          })
        })
        .then(res => (this.product = res.result[0]))
        .then(
          () =>
            (this.product.spec_array = this.product.spec_array
              .filter(x => x.spec_id == order.spec_id)
              .map(x => ({
                ...x,
                order_num: 1,
              })))
        )
        .finally(() => (this.isProductLoading = false))
    },
    createPreorder() {
      if (this.$refs.form.validate()) {
        this.isSubmitting = true
        if (this.carrierId && !this.$store.state.profile.carrier_id) {
          apiAxios({
            method: 'post',
            url: '/Users/UpdateUserProfile',
            data: {
              ...this.$store.state.profile,
              carrier_id: this.carrierId,
            },
          })
        }

        return apiAxios({
          method: 'post',
          url: '/Preorder/CompletePreorder',
          data: {
            preorder_id: this.preorderId,
            product_id: this.productId,
            receive_type: this.receiveType,
            receive_area: this.receiveType === '1' ? this.receiveArea : '',
            receive_address:
              this.receiveType === '2' ? this.receiveAddress : '',
            payment_tool: this.paymentTool,
            payment_type: this.paymentType,
            phone: 'string',
            receive_person: this.receivePerson,
            contact_phone: this.contactPhone,
            memo: this.memo,
            carrier_id: this.carrierId,
          },
        })
          .then(res => {
            this.$snackbar.add('訂單送出成功', { color: 'success' })
            this.$router.push({
              name: 'OrderSubmited',
              params: {
                orderId: res.result.order_id,
                paymentUrl: res.result.payment_url,
              },
            })
          })
          .catch(err => {
            this.fetchData()
            this.$snackbar.add(err.message)
          })
          .finally(() => (this.isSubmitting = false))
      } else {
        this.$nextTick(() => {
          const el = this.$el.querySelector(
            '.v-messages.error--text:first-of-type'
          )
          this.$vuetify.goTo(el, { offset: 120 })
        })
      }
    },
  },
}
</script>
<style>
.text-center input {
  text-align: center;
}
.selected {
  color: var(--v-primary-base) !important;
  border-color: var(--v-primary-base) !important;
}
.v-chip.selected:before {
  background-color: transparent;
}
</style>
