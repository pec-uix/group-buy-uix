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
        <v-col cols="12" class="pa-0">
          <v-breadcrumbs
            large
            :items="breadcrumbs_"
            class="primary--text"
          ></v-breadcrumbs>
        </v-col>
        <v-col cols="12" md="4" class="d-none d-md-block">
          <pec-image-gallery :items="product.img_url_array"></pec-image-gallery>
        </v-col>
        <v-col cols="12" md="8">
          <v-card class="pa-3 pa-md-8 pb-md-11">
            <div
              class="d-flex flex-column flex-sm-row mb-5 align-start d-md-none"
            >
              <pec-image-gallery
                class="mr-2 align-self-center"
                :items="product.img_url_array"
              ></pec-image-gallery>
              <div class="flex-grow-1 mt-4">
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
                <div class="primary--text text-body-2 mt-4">
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
              <div class="primary--text text-body-2 mt-4">
                <p>商品編號：{{ product.product_id }}</p>
                <p>廠商名稱：{{ product.supplier }}</p>
              </div>
            </div>

            <v-row>
              <v-col cols="12"><v-divider></v-divider></v-col>
              <v-col cols="12" md="3" class="pb-0"> 商品規格與數量：</v-col>
              <v-col cols="12" md="9">
                <template v-for="(spec, i) in product.spec_array">
                  <v-row :key="i">
                    <v-col cols="7">
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
                      <div
                        class="text-right"
                        v-if="spec.inv_num !== null || product.inv_num !== null"
                      >
                        剩餘{{ getQuota(spec) }}件
                      </div>
                      <!-- <p>{{ spec.spec_name }}</p> -->
                    </v-col>
                    <v-col cols="5">
                      <v-select
                        v-if="spec.inputType === 'select'"
                        outlined
                        dense
                        :items="
                          numArray.filter(
                            x =>
                              (spec.inv_num === null &&
                                product.inv_num == null) ||
                              x.value <= getQuota(spec)
                          )
                        "
                        placeholder="請選擇數量"
                        v-model="spec.order_num"
                        @change="changeInputType(spec)"
                      ></v-select>
                      <v-text-field
                        v-else
                        outlined
                        dense
                        class="text-center"
                        placeholder="請選擇數量"
                        v-model="spec.order_num"
                        prepend-inner-icon="remove"
                        append-icon="add"
                        @click:prepend-inner="remove(spec)"
                        @click:append="add(spec)"
                        @blur="changeInputType(spec)"
                        :rules="[
                          v => /^\+?(0|[1-9]\d*)$/.test(v) || '請輸入正確數量',
                          v =>
                            (spec.inv_num === null &&
                              product.inv_num == null) ||
                            v <= getQuota(spec) ||
                            '超過剩餘數量',
                        ]"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </template>
                <v-alert
                  dense
                  text
                  class="mt-1"
                  type="warning"
                  :value="showAlert && specTotalNumInvalid"
                  transition="scale-transition"
                >
                  請選擇數量
                </v-alert>
                <v-alert
                  dense
                  text
                  class="mt-1"
                  type="warning"
                  :value="showAlert && overProductInvNum"
                  transition="scale-transition"
                >
                  庫存不足，請調整數量
                </v-alert>
              </v-col>
              <!-- <template v-if="product.inv_num != null">
                <v-col cols="12" md="3" class="pb-0 pb-md-3"
                  >本次購買總數/剩餘庫存</v-col
                >
                <v-col cols="12" md="9" class="pt-0 pt-md-3 text-h6">
                  <div>
                    <span class="primary--text">{{ specTotalNum }}</span> /
                    <span>{{ product.inv_num - product.order_num }}</span>
                  </div>
                  <v-alert
                    dense
                    text
                    class="mt-1"
                    type="warning"
                    :value="showAlert && overProductInvNum"
                    transition="scale-transition"
                  >
                    庫存不足，請調整數量
                  </v-alert>
                </v-col>
              </template> -->
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
              </template>
            </v-row>
            <template v-if="noService">
              <v-alert text type="warning" class="my-4">
                本商品僅銷售特定區域，您無法購買，我們深感抱歉。
              </v-alert>
              <v-btn clas="mt-4" depressed block color="primary" to="/buy">
                【到宅配專區逛逛】
              </v-btn>
            </template>
            <template v-else>
              <v-row class="mt-4">
                <v-col cols="12" md="3" class="pb-0"> 領貨方式：</v-col>
                <v-col cols="12" md="9" class="pt-0">
                  <v-chip-group
                    v-if="product.receive_type_array.length > 0"
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
                  <span v-if="receiveArea">
                    該區累積:{{ areaOrderNum }}件 / 成團:
                    {{ product.goal_num }}件
                  </span>
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
                <v-col cols="12" md="3" class="pb-0"> 付款方式：</v-col>
                <v-col cols="12" md="9" class="pt-0">
                  <v-alert
                    v-if="receiveType == '1' && !receiveArea"
                    dense
                    text
                    class="mt-1"
                    type="warning"
                    transition="scale-transition"
                  >
                    請先選擇領貨地點
                  </v-alert>
                  <template v-else>
                    <v-chip-group
                      class="mb-2"
                      column
                      v-model="paymentType"
                      mandatory
                      active-class="selected"
                    >
                      <v-chip
                        v-for="payment_type in filteredPaymentTypeArray"
                        :key="payment_type.value"
                        :value="payment_type.value"
                        filter
                        label
                        outlined
                        >{{ payment_type.text }}</v-chip
                      >
                    </v-chip-group>
                    <template v-if="paymentType == '1'">
                      <a
                        class="text-decoration-underline"
                        @click="paymentType1Dialog = true"
                      >
                        【取貨點繳費說明】
                      </a>
                    </template>
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
                  </template>
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
                <v-col cols="12" md="3" class="pb-0">電子發票: </v-col>
                <v-col cols="12" md="9" class="pt-0">
                  <v-chip-group
                    column
                    v-model="invoType"
                    mandatory
                    active-class="selected"
                  >
                    <v-chip value="2" filter label outlined> 二聯式 </v-chip>
                    <v-chip value="3" filter label outlined> 三聯式 </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-row class="mt-4" v-if="invoType === '2'">
                <v-col cols="12" md="3" class="pb-0">電子發票手機載具: </v-col>
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
              <v-row class="mt-4" v-if="invoType === '3'">
                <v-col cols="12" md="3" class="pb-0">買方統一編號: </v-col>
                <v-col cols="12" md="9">
                  <v-text-field
                    placeholder="請輸入買方統一編號"
                    v-model="preNo"
                    outlined
                    dense
                    :rules="[
                      v =>
                        invoType != 3 || /^\d{8}$/.test(v) || '請輸入正確格式',
                      v => invoType != 3 || checkPreNo(v) || '統一編號驗證錯誤',
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3" class="pb-0">買受人公司名稱: </v-col>
                <v-col cols="12" md="9">
                  <v-text-field
                    placeholder="請輸入買受人公司名稱"
                    maxlength="40"
                    counter
                    v-model="preName"
                    outlined
                    dense
                    :rules="[
                      v => invoType != 3 || !!v || '請輸入買受人公司名稱',
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3" class="pb-0">買受人公司地址: </v-col>
                <v-col cols="12" md="9">
                  <v-text-field
                    placeholder="請輸入買受人公司地址"
                    maxlength="80"
                    counter
                    v-model="invoAddress"
                    outlined
                    dense
                    :rules="[
                      v => invoType != 3 || !!v || '請輸入買受人公司地址',
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-4">
                <v-col cols="12" md="3" class="pb-0 pb-md-3">訂購數量：</v-col>
                <v-col cols="12" md="9" class="pt-0 pt-md-3">
                  <span class="text-h6 primary--text"
                    >共 {{ specTotalNum }} 件</span
                  >
                  <span v-if="product.limit_num != null" class="ml-4"
                    >限購 {{ product.limit_num }} 件</span
                  >
                  <v-alert
                    dense
                    text
                    class="mt-1"
                    type="warning"
                    :value="showAlert && overProductLimitNum"
                    transition="scale-transition"
                  >
                    不得超過限購數量
                  </v-alert>
                </v-col>
                <template v-if="needShipment">
                  <v-col cols="12" md="3" class="pb-0 pb-md-3">運費：</v-col>
                  <v-col cols="12" md="9" class="pt-0 pt-md-3 text-h6">
                    <span class="primary--text">{{
                      product.shipment.toLocaleString()
                    }}</span>
                    <span class="ml-4"
                      >({{ product.free_shipment_num }}件以上免運)</span
                    >
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0 pb-md-3"
                    >商品金額：</v-col
                  >
                  <v-col
                    cols="12"
                    md="9"
                    class="pt-0 pt-md-3 text-h6 primary--text"
                  >
                    ${{
                      product.spec_array
                        .reduce(
                          (acc, cur) =>
                            acc + cur.order_num * cur.discount_price,
                          0
                        )
                        .toLocaleString()
                    }}
                  </v-col>
                </template>
                <template v-if="product.spec_array.some(x => x.discount > 0)">
                  <v-col cols="12" md="3" class="pb-0 pb-md-3"
                    >訂單金額：</v-col
                  >
                  <v-col
                    cols="12"
                    md="9"
                    class="pt-0 pt-md-3 text-h6 primary--text"
                  >
                    ${{ orderTotalPrice.toLocaleString() }}
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0 pb-md-3"
                    >折扣金額：</v-col
                  >
                  <v-col
                    cols="12"
                    md="9"
                    class="pt-0 pt-md-3 text-h6 primary--text"
                  >
                    ${{ orderTotalDiscount.toLocaleString() }}
                  </v-col>
                </template>
                <v-col cols="12" md="3" class="pb-0 pb-md-3"
                  >總付款金額：</v-col
                >
                <v-col
                  cols="12"
                  md="9"
                  class="pt-0 pt-md-3 text-h6 primary--text"
                >
                  ${{ (orderTotalPrice - orderTotalDiscount).toLocaleString() }}
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
                    :disabled="
                      !$dayjs().isBetween(
                        $dayjs(product.start_date),
                        $dayjs(product.end_date)
                      )
                    "
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
            </template>
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
    <v-dialog v-model="successedDialog" max-width="min(800px, 80vh)">
      <v-sheet>
        <v-img
          max-width="min(800px, 80vh)"
          :aspect-ratio="1 / 1"
          src="https://unilife.pec.com.tw/images/successed.jpg"
        >
        </v-img>
        <v-btn depressed block color="white" tile to="/"> 回首頁 </v-btn>
      </v-sheet>
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
  props: {
    productId: [String, Number],
    defaultReceiveType: [String, Number],
    defaultReceiveArea: String,
    breadcrumbs: { type: Array, default: () => [] },
  },
  components: {
    PecImageGallery,
    InvoInstruction,
    PaymentType1Content,
    PaymentType2Content,
    PaymentType3Content,
  },
  created() {
    return Promise.all([this.fetchData(), this.getAreaOrderNum()]).then(() => {
      this.setDefaullValue()
      this.setBreadcrumbs()
    })
  },
  data() {
    return {
      breadcrumbs_: this.breadcrumbs,
      paymentType1Dialog: false,
      paymentType2Dialog: false,
      paymentType3Dialog: false,
      invoDialog: false,
      isProductLoading: false,
      isSubmitting: false,
      showAlert: false,
      isReceiveAreaUndefined: false,
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
        receive_type_array: [],
        receive_area_array: [],
        payment_type_array: [],
        limit_num: null,
        inv_num: null,
      },
      numArray: Array.from({ length: 11 }).map((x, i) => ({
        text: i === 10 ? '10+' : i,
        value: i + '',
      })), //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      receiveType: '',
      receiveArea: '',
      receiveAddress: '',
      paymentType: '',
      paymentTool: '',
      receivePerson: '',
      contactPhone: '',
      memo: '',
      carrierId: this.$store.state.profile.carrier_id,
      areaOrderNumArray: [],
      successedDialog: false,
      invoType: '2',
      preNo: '',
      preName: '',
      invoAddress: '',
    }
  },
  watch: {
    specTotalNum() {
      this.showAlert = false
    },
  },
  computed: {
    specTotalNum() {
      return this.product.spec_array.reduce(
        (acc, cur) => acc + (parseInt(cur.order_num, 10) || 0) * cur.num_ratio,
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
    orderTotalDiscount() {
      return this.product.spec_array.reduce(
        (acc, cur) => acc + (parseInt(cur.order_num, 10) || 0) * cur.discount,
        0
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
    areaOrderNum() {
      let area = this.areaOrderNumArray.filter(
        x => x.receive_area === this.receiveArea
      )[0]
      return area ? area.order_num_with_ratio : 0
    },
    noService() {
      return (
        this.product.receive_type_array.length === 0 ||
        this.product.payment_type_array.length === 0
      )
    },
    specTotalNumInvalid() {
      return this.specTotalNum === 0
    },
    overProductInvNum() {
      return (
        this.product.inv_num != null &&
        this.specTotalNum >
          this.product.inv_num - this.product.order_num_with_ratio
      )
    },
    overProductLimitNum() {
      return (
        this.product.limit_num != null &&
        this.specTotalNum > this.product.limit_num
      )
    },
    filteredPaymentTypeArray() {
      return this.product.payment_type_array.filter(
        x =>
          x.value != '1' ||
          this.receiveType != '1' ||
          this.product.payment_area_array.some(
            x => x.value === this.receiveArea
          )
      )
    },
  },
  methods: {
    getQuota(spec) {
      let productQuota =
        this.product.inv_num -
        this.product.order_num_with_ratio -
        this.specTotalNum +
        (parseInt(spec.order_num, 10) || 0) * spec.num_ratio

      let specQuota = spec.inv_num - spec.spec_total_order_num_with_ratio
      // -
      // this.specTotalNum +
      // (parseInt(spec.order_num, 10) || 0) * spec.num_ratio

      // if (this.product.inv_num != null && spec.inv_num != null) {
      //   return Math.floor(Math.min(productQuota, specQuota) / spec.num_ratio)
      // } else
      if (this.product.inv_num != null) {
        return Math.floor(productQuota / spec.num_ratio)
      } else if (spec.inv_num != null) {
        return Math.floor(specQuota / spec.num_ratio)
      } else {
        return null
      }
    },
    getAreaOrderNum() {
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductAreaOrderNum',
        data: { product_id: this.productId },
      }).then(res => {
        this.areaOrderNumArray = res.result
      })
    },
    fetchData() {
      this.isProductLoading = true
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductV2',
        params: { v: '2' },
        data: {
          product_id: this.productId,
        },
      })
        .then(res => {
          this.product = res.result[0]
        })
        .then(
          () =>
            (this.product.spec_array = this.product.spec_array.map((x, i) => ({
              ...x,
              order_num:
                this.product.spec_array.length === 1 && i === 0 ? '1' : '0',
              inputType: 'select',
            })))
        )
        .then(() => {
          this.product.receive_type_array =
            this.product.receive_type_array.filter(
              x => x.value != '1' || this.product.receive_area_array.length > 0
            )
        })
        .finally(() => (this.isProductLoading = false))
    },
    setDefaullValue() {
      if (
        this.defaultReceiveType &&
        this.product.receive_type_array.some(
          x => x.value == this.defaultReceiveType
        )
      ) {
        this.receiveType = this.defaultReceiveType
      }
      if (
        this.defaultReceiveArea &&
        this.product.receive_area_array.some(
          x => x.value == this.defaultReceiveArea
        )
      ) {
        this.receiveArea = this.defaultReceiveArea
      }
    },
    setBreadcrumbs() {
      if (this.breadcrumbs_.length === 0) {
        this.breadcrumbs_ = [
          {
            text: '首頁',
            disabled: false,
            to: '/',
          },
          {
            text: this.product.category_array[0].category_name,
            disabled: false,
            to: `/category/${this.product.category_array[0].category_id}`,
          },
          {
            text: this.product.product_name,
            disabled: false,
          },
        ]
      }
    },
    remove(spec) {
      if (parseInt(spec.order_num, 10) > 0) {
        spec.order_num = parseInt(spec.order_num, 10) - 1 + ''
      }
      this.changeInputType(spec)
    },
    add(spec) {
      if (
        (spec.inv_num === null && this.product.inv_num == null) ||
        parseInt(spec.order_num, 10) < this.getQuota(spec)
      ) {
        spec.order_num = parseInt(spec.order_num, 10) + 1 + ''
      }
      this.changeInputType(spec)
    },
    changeInputType(spec) {
      spec.inputType = spec.order_num < 9 ? 'select' : 'text'
    },
    checkPreNo(v) {
      if (!v || typeof v !== 'string' || v.length !== 8) {
        return false
      }
      let arr = [1, 2, 1, 2, 1, 2, 4, 1]
      let sum = v
        .split('')
        .map((x, i) => x * arr[i])
        .map(x =>
          x
            .toString()
            .split('')
            .reduce((acc, cur) => acc + parseInt(cur, 10), 0)
        )
        .reduce((acc, cur) => acc + cur, 0)
      if (sum % 5 === 0) {
        return true
      } else if (v[6] == '7' && (sum + 1) % 5 === 0) {
        return true
      } else {
        return false
      }
    },
    createPreorder() {
      if (this.$refs.form.validate()) {
        if (
          this.specTotalNumInvalid ||
          this.overProductInvNum ||
          this.overProductLimitNum
        ) {
          this.showAlert = true
          this.$nextTick(() => {
            const el = this.$el.querySelector(
              '.v-alert--text.warning--text:first-of-type'
            )
            this.$vuetify.goTo(el)
          })
        } else {
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
            url: '/Preorder/InsertPreoder',
            data: {
              product_id: this.productId,
              receive_type: this.receiveType,
              receive_area: this.receiveType === '1' ? this.receiveArea : '',
              receive_address:
                this.receiveType === '2' ? this.receiveAddress : '',
              receive_person:
                this.receiveType === '2' ? this.receivePerson : '',
              contact_phone: this.receiveType === '2' ? this.contactPhone : '',
              memo: this.memo,
              payment_type: this.paymentType,
              payment_tool: this.paymentType == '2' ? this.paymentTool : '',
              detail_array: this.product.spec_array.filter(
                x => x.order_num > 0
              ),
              invo_type: this.invoType,
              carrier_id: this.invoType == '2' ? this.carrierId : '',
              pre_no: this.invoType == '3' ? this.preNo : '',
              pre_name: this.invoType == '3' ? this.preName : '',
              invo_address: this.invoType == '3' ? this.invoAddress : '',
            },
          })
            .then(res => {
              if (this.product.reserve_mark === 'Y') {
                this.successedDialog = true
              } else {
                this.$snackbar.add('訂單送出成功', { color: 'success' })
                this.$router.push({
                  name: 'OrderSubmited',
                  params: {
                    orderId: res.result.order_id,
                    paymentUrl: res.result.payment_url,
                  },
                })
              }
            })
            .catch(err => {
              this.fetchData()
              this.$dialog.show(err.message, { title: '系統訊息' })
            })
            .finally(() => (this.isSubmitting = false))
        }
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
