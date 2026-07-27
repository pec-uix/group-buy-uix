<template>
  <pec-member-template img-src="/my-order.jpg">
    <template v-if="isProductLoading">
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
    </template>
    <v-card v-else-if="order">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <div class="d-flex">
              <div
                class="cursor-pointer"
                @click.prevent="
                  handleProductClick(`/product/${order.product_id}`)
                "
              >
                <v-img
                  aspect-ratio="1"
                  class="flex-grow-0"
                  :width="$vuetify.breakpoint.xsOnly ? '72px' : '160px'"
                  :src="order.img_url"
                  contain
                ></v-img>
              </div>
              <div
                class="d-flex flex-column justify-space-between flex-grow-1 px-4 py-1"
              >
                <div>
                  <div
                    class="pec-card-title primary--text mb-3 d-flex justify-space-between align-center"
                  >
                    <span> 訂單編號： {{ order.id }} </span>
                    <div v-if="order.source === 'LINE'" style="width: 57px">
                      <v-img
                        src="https://unilife.pec.com.tw/images/LineOrder.png"
                        width="57"
                      >
                      </v-img>
                    </div>
                  </div>
                  <div class="text-subtitle-2">
                    <v-chip
                      v-if="order.is_spcloff_product == 'Y'"
                      class="mb-1 mt-1 px-3 mr-2"
                      style="font-size: 12px"
                      color="#FFE500"
                      small
                      >加價購</v-chip
                    >
                    {{ order.product_name }}
                  </div>
                </div>
              </div>
            </div>
            <v-divider class="mt-2"></v-divider>
          </v-col>
          <v-col class="black--text" cols="6">訂單狀態：</v-col>
          <v-col class="primary--text" cols="6">
            <span>{{ order.order_status_name }}</span>
            <template v-if="order.order_status == '2'">
              <br /><span>
                ({{ order.order_fail_kind_name
                }}<template v-if="order.order_fail_kind_name == '團購失敗'"
                  >，取貨廠區未達成團購件數</template
                >)
              </span>
            </template>
            <template v-if="order.order_status == '2' && order.cancel_reason">
              <br /><span>
                {{ order.reason_id == 0 ? '其他' : order.cancel_reason
                }}<i
                  class="far fa-info-circle ml-1 cursor-pointer"
                  v-if="order.reason_id == 0"
                  style="color: #ff7700"
                  @click="cancelReasonDialog = true"
                ></i>
              </span>
            </template>
          </v-col>
          <v-col class="black--text" cols="6">件數：</v-col>
          <v-col class="primary--text" cols="6">{{ totalOrderNum }}</v-col>
          <v-col class="black--text" cols="6">商品總金額：</v-col>
          <v-col class="primary--text" cols="6"
            >${{ totalPrice.toLocaleString() }}
          </v-col>
          <v-col class="black--text" cols="6">折價券折抵:</v-col>
          <v-col class="primary--text" cols="6">
            ${{ order.sale_rewards.toLocaleString() }}
          </v-col>
          <!-- <template v-if="order.sale_rewards > 0">
            <v-col class="black--text" cols="6">折價券折抵:</v-col>
            <v-col class="primary--text" cols="6">
              ${{ order.sale_rewards.toLocaleString() }}
            </v-col>
          </template> -->

          <v-col class="black--text" cols="6">建立日期：</v-col>
          <v-col class="primary--text" cols="6">{{
            $dayjs(order.creation_date).format('YYYY-MM-DD HH:mm:ss')
          }}</v-col>
          <v-col class="black--text" cols="6">截止日：</v-col>
          <v-col
            v-if="new Date(order.end_date) > new Date()"
            class="primary--text"
            cols="6"
          >
            {{ relativeTime(order.end_date) }} ({{
              order.end_date.substring(0, 10)
            }})
          </v-col>
          <v-col v-else class="primary--text" cols="6">
            {{ order.end_date.substring(0, 10) }} (已停止銷售)
          </v-col>
          <v-col class="black--text" cols="6">備註:</v-col>
          <v-col class="primary--text" cols="6">{{ order.memo }}</v-col>
          <template v-if="order.order_status != '7'">
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col class="black--text" cols="6">付款總金額：</v-col>
            <v-col class="primary--text" cols="6">
              ${{ (totalPrice - order.sale_rewards).toLocaleString() }}
            </v-col>
            <v-col class="black--text" cols="6">付款方式：</v-col>
            <v-col class="primary--text" cols="6">
              {{ order.payment_type_name }}
              <template v-if="order.payment_type === '2'">
                ({{ order.fisc_twqr_issuer_code ? `TWQR${order.fisc_twqr_issuer_name}`: order.payment_tool_name }})
              </template>
              ({{
                (
                  totalPrice -
                  order.sale_rewards -
                  order.discount_amount / 100
                ).toLocaleString()
              }})
              <template v-if="order.discount_amount > 0">
                + OP點數折抵({{
                  (order.discount_amount / 100).toLocaleString()
                }})
              </template>
            </v-col>
            <v-col cols="12" class="text-right">
              <a
                v-if="order.payment_type == '1'"
                class="text-decoration-underline"
                @click="paymentType1Dialog = true"
              >
                取貨點繳費說明
              </a>
              <a
                v-if="order.payment_type == '2'"
                class="text-decoration-underline"
                @click="paymentType2Dialog = true"
              >
                線上支付說明
              </a>
              <a
                v-if="order.payment_type == '3'"
                class="text-decoration-underline"
                @click="paymentType3Dialog = true"
              >
                匯款說明事項
              </a>
            </v-col>
            <v-col class="black--text" cols="6">付款狀態：</v-col>
            <v-col class="primary--text" cols="6"
              >{{ order.payment_status_name }}
              <span
                v-if="order.payment_status == '0' && order.payment_type == '2'"
              >
                (請於訂單成立1小時內完成繳費，逾期取消訂單。)
              </span>
              <span
                v-if="
                  order.payment_status == '0' &&
                  order.payment_type == '1' &&
                  order.receive_type == '2'
                "
              >
                (請於訂單成立4天內完成繳費，逾期取消訂單。)
              </span>
            </v-col>
            <v-col class="black--text" cols="6">付款日期：</v-col>
            <v-col
              class="primary--text"
              v-if="order.payment_type == '2' && order.payment_digital_date"
              cols="6"
              >{{
                $dayjs(order.payment_digital_date).format('YYYY-MM-DD HH:mm:ss')
              }}</v-col
            >
            <v-col
              class="primary--text"
              v-else-if="order.payment_date"
              cols="6"
              >{{
                $dayjs(order.payment_date).format('YYYY-MM-DD HH:mm:ss')
              }}</v-col
            >
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" class="pa-0" style="position: relative">
              <div
                class="d-flex justify-end"
                style="position: absolute; right: 10px; top: 2px; width: 88px"
              >
                <v-btn
                  v-if="
                    !isEditInvo &&
                    (order.invo_status == null || order.invo_status == 0)
                  "
                  depressed
                  fab
                  small
                  color="#fff"
                  @click.stop="editInvo()"
                >
                  <i
                    class="fa-regular fa-pen-circle secondary--text"
                    style="font-size: 34px; opacity: 0.7"
                  ></i>
                </v-btn>
                <v-btn
                  v-if="isEditInvo"
                  depressed
                  fab
                  small
                  color="#fff"
                  @click.stop="editInvoCancel()"
                >
                  <i
                    class="fa-sharp fa-regular fa-circle-xmark secondary--text"
                    style="font-size: 34px; opacity: 0.7"
                  ></i>
                </v-btn>
                <v-btn
                  v-if="isEditInvo"
                  class="ml-2"
                  depressed
                  fab
                  small
                  color="#fff"
                  @click.stop="editInvoConfirm()"
                >
                  <i
                    class="fa-sharp fa-regular fa-circle-check secondary--text"
                    style="font-size: 34px; opacity: 0.7"
                  ></i>
                </v-btn>
              </div>
            </v-col>
            <v-col class="black--text" cols="12" sm="6">發票狀態：</v-col>
            <v-col class="primary--text" cols="12" sm="6">{{
              order.invo_status_name
            }}</v-col>
            <template>
              <v-col class="black--text" cols="12" sm="6" v-if="order.invo_no"
                >發票號碼：</v-col
              >
              <v-col class="primary--text" cols="12" sm="6" v-if="order.invo_no"
                >{{ order.invo_no }}({{ order.invo_type_name }})
              </v-col>
              <v-col class="black--text" cols="12" sm="6" v-if="order.invo_no"
                >發票日期：</v-col
              >
              <v-col class="primary--text" cols="12" sm="6" v-if="order.invo_no"
                >{{ $dayjs(order.invo_date).format('YYYY-MM-DD') }}
              </v-col>
              <v-col class="black--text" cols="12" sm="6" v-if="order.invo_no"
                >發票金額：</v-col
              >
              <v-col class="primary--text" cols="12" sm="6" v-if="order.invo_no"
                >{{ order.amt.toLocaleString() }}
              </v-col>
              <template v-if="order.invo_type == '3'">
                <v-col class="black--text" cols="12" sm="6"
                  >買方統一編號：</v-col
                >
                <v-col class="primary--text" cols="12" sm="6" v-if="!isEditInvo"
                  >{{ order.pre_no }}
                </v-col>
                <v-col
                  class="primary--text"
                  cols="12"
                  sm="6"
                  v-if="order.invo_type == '3' && isEditInvo"
                >
                  <v-text-field
                    v-model="template.pre_no"
                    dense
                    :rules="[
                      v => !!v || '此欄位為必填項目',
                      v =>
                        order.invo_type != 3 ||
                        checkPreNo(v) ||
                        '統一編號驗證錯誤',
                    ]"
                    ref="preNoField"
                  ></v-text-field
                ></v-col>
                <v-col class="black--text" cols="12" sm="6"
                  >買受人公司名稱：</v-col
                >
                <v-col class="primary--text" cols="12" sm="6" v-if="!isEditInvo"
                  >{{ order.pre_name }}
                </v-col>
                <v-col
                  class="primary--text"
                  cols="12"
                  sm="6"
                  v-if="order.invo_type == '3' && isEditInvo"
                >
                  <v-text-field
                    v-model="template.pre_name"
                    dense
                    :rules="[
                      v =>
                        order.invo_type != 3 || !!v || '請輸入買受人公司名稱',
                    ]"
                    ref="preNameField"
                  ></v-text-field
                ></v-col>
                <v-col class="black--text" cols="12" sm="6"
                  >買受人公司地址：</v-col
                >
                <v-col class="primary--text" cols="12" sm="6" v-if="!isEditInvo"
                  >{{ order.invo_address }}
                </v-col>
                <v-col
                  class="primary--text"
                  cols="12"
                  sm="6"
                  v-if="order.invo_type == '3' && isEditInvo"
                >
                  <v-text-field
                    v-model="template.invo_address"
                    dense
                    ref="invoAddressField"
                  ></v-text-field
                ></v-col> </template
              ><v-col
                class="black--text"
                cols="12"
                sm="6"
                v-if="order.invo_type !== '3'"
                >電子發票手機載具：</v-col
              >
              <v-col
                class="primary--text"
                cols="12"
                sm="6"
                v-if="order.invo_type !== '3' && !isEditInvo"
                >{{ order.carrier_id }}
              </v-col>
              <v-col
                class="primary--text"
                cols="12"
                sm="6"
                v-if="order.invo_type !== '3' && isEditInvo"
              >
                <v-text-field
                  v-model="template.carrier_id"
                  label="電子發票手機載具"
                  :rules="[
                    v =>
                      !v ||
                      /^\/{1}[0-9A-Z+-\.]{7}$/.test(v) ||
                      '請輸入正確格式',
                  ]"
                  dense
                  ref="carrierField"
                ></v-text-field
              ></v-col>
              <v-col cols="12" class="text-right">
                <a
                  class="text-decoration-underline text-body-2"
                  cols="12"
                  @click="invoDialog = true"
                >
                  電子發票服務說明
                </a>
              </v-col>
            </template>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <template v-if="order.receive_type == '1'">
              <v-col class="black--text" cols="6">領貨地點：</v-col>
              <v-col class="primary--text" cols="6">{{
                order.receive_area_name
              }}</v-col>
            </template>
            <template v-if="order.receive_type == '2'">
              <v-col class="black--text" cols="6">領貨方式：</v-col>
              <v-col class="primary--text" cols="6">{{
                order.receive_type_name
              }}</v-col>
            </template>
            <v-col class="black--text" cols="6">配送狀態：</v-col>
            <v-col class="primary--text" cols="6">{{
              order.receive_status_name
            }}</v-col>
            <v-col class="black--text" cols="6">確認到貨日：</v-col>
            <v-col class="primary--text" cols="6">
              <span v-if="order.actual_arrival_date">
                {{ $dayjs(order.actual_arrival_date).format('YYYY-MM-DD') }}
              </span>
            </v-col>
            <template v-if="order.receive_type == '2'">
              <v-col class="black--text" cols="6">收件人姓名：</v-col>
              <v-col class="primary--text" cols="6">{{
                order.receive_person
              }}</v-col>
              <v-col v-if="order.local_telephone" class="black--text" cols="6"
                >收件人市話：</v-col
              >
              <v-col
                v-if="order.local_telephone"
                class="primary--text"
                cols="6"
                >{{ order.local_telephone }}</v-col
              >
              <v-col v-if="order.contact_phone" class="black--text" cols="6"
                >收件人手機：</v-col
              >
              <v-col
                v-if="order.contact_phone"
                class="primary--text"
                cols="6"
                >{{ order.contact_phone }}</v-col
              >
              <v-col cols="12">
                <div class="text-caption">宅配地址：</div>
                <div class="primary--text">{{ order.receive_address }}</div>
              </v-col>
            </template>
          </template>
        </v-row>
        <v-row>
          <v-col cols="12">
            <table class="my-order mb-3">
              <tbody>
                <tr>
                  <td class="primary--text text-center pec-w-50">
                    共({{ totalOrderNum }})件
                  </td>
                  <td class="primary--text text-center pec-w-50">
                    總計 ${{ totalPrice.toLocaleString() }}
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
                  <td colspan="2">商品規格: {{ detail.spec_name }}</td>
                </tr>
                <tr>
                  <td class="pec-w-50">
                    <div class="d-flex justify-space-between">
                      <span>單價：</span
                      ><span
                        >${{ detail.discount_price.toLocaleString() }}</span
                      >
                    </div>
                  </td>
                  <td class="pec-w-50">
                    <div class="d-flex justify-space-between">
                      <span>數量：</span><span>{{ detail.order_num }}</span>
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
          </v-col>

          <v-col
            cols="12"
            class="text-right"
            v-if="
              (order.order_status == '0' ||
                order.order_status == '5' ||
                order.order_status == '7') &&
              ($dayjs(order.end_date) > $dayjs() || order.product_id == 14351)
            "
          >
            <v-btn
              color="primary"
              text
              class="text-decoration-underline"
              @click="cancelOrder"
              >取消訂單</v-btn
            >
          </v-col>
          <!-- <v-col
            cols="12"
            class="text-right"
            v-if="order.payment_status == '1' && order.invo_status == '1'"
          >
            <v-btn
              color="primary"
              text
              class="text-decoration-underline"
              @click="showReturnDialog"
              >申請退貨</v-btn
            >
          </v-col> -->

          <template
            v-if="
              $dayjs() > $dayjs(order.payment_start_date) &&
              order.order_status == '7'
            "
          >
            <v-col cols="6">
              <v-btn
                active-class="no-active"
                color="secondary"
                block
                depressed
                :to="`/preorder/${order.id}/fill-in`"
                >結帳去</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                active-class="no-active"
                color="secondary"
                block
                outlined
                @click="backToOrder()"
                >返回</v-btn
              >
            </v-col>
          </template>
          <template
            v-else-if="
              $dayjs().isBetween(
                $dayjs(order.start_date),
                $dayjs(order.end_date)
              ) &&
              order.tb_status == null &&
              order.order_status != '7'
            "
          >
            <v-col cols="6">
              <v-btn
                active-class="no-active"
                color="secondary"
                block
                depressed
                @click.prevent="
                  handleProductClick(`/product/${order.product_id}`)
                "
                >重新購買</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                active-class="no-active"
                color="secondary"
                block
                outlined
                @click="backToOrder()"
                >返回</v-btn
              >
            </v-col>
          </template>
          <v-col v-else cols="12">
            <v-btn
              active-class="no-active"
              color="secondary"
              block
              outlined
              @click="backToOrder()"
              >返回</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-dialog v-model="dialog" max-width="800">
      <v-card>
        <v-card-title>申請退貨</v-card-title>
        <v-card-text>
          <v-textarea v-model="reason" outlined label="退貨原因"> </v-textarea>
          <v-checkbox
            v-model="checkbox"
            label="我同意辦理退貨時，由團購網代為處理發票及銷貨退回證明單，以加速退貨退款作業"
          ></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" @click="dialog = false"> 取消 </v-btn>
          <v-btn outlined color="primary" @click="dialog = false">
            送出申請
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="invoDialog" scrollable max-width="800">
      <v-card>
        <v-card-title>電子發票服務說明</v-card-title>
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
    <v-dialog v-model="cancelOrderDialog" scrollable max-width="800">
      <v-card>
        <v-card-title class="grey lighten-2">系統信息</v-card-title>
        <v-card-text class="pa-4 text-body-1 primary--text">
          {{ cancelOrderMessage }}
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-select
              v-if="cancelReasons.length > 0"
              v-model="cancelReason"
              :items="cancelReasons"
              class="mt-3"
              item-text="reason"
              item-value="id"
              placeholder="請選擇原因"
              persistent-hint
              dense
              outlined
              required
              :rules="[
                v => (!isNaN(parseFloat(v)) && v >= 0) || '請選擇取消訂單原因',
              ]"
            ></v-select>
            <v-text-field
              v-if="cancelReason === 0"
              v-model="cancelReasonOther"
              placeholder="請填寫原因"
              dense
              outlined
              required
              counter="200"
              maxlength="200"
              :rules="[v => !!v || '請填寫取消訂單原因']"
              :error-messages="errorMsg"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            @click="
              cancelOrderDialog = false
              isCancelLoading = false
            "
          >
            取消
          </v-btn>
          <v-btn
            outlined
            :loading="isCancelLoading"
            color="primary"
            @click="cancelOrderConfirm"
          >
            確定取消
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
    <v-dialog v-model="cancelReasonDialog" scrollable max-width="800">
      <v-card>
        <v-card-title>取消原因</v-card-title>
        <v-card-text class="text-body-1">
          {{ order?.cancel_reason }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="cancelReasonDialog = false">
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </pec-member-template>
</template>
<script>
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
import { apiAxios } from '@/api'
import InvoInstruction from '@/components/InvoInstruction.vue'
import PaymentType1Content from '@/components/PaymentType1Content.vue'
import PaymentType2Content from '@/components/PaymentType2Content.vue'
import PaymentType3Content from '@/components/PaymentType3Content.vue'

export default {
  components: {
    PecMemberTemplate,
    InvoInstruction,
    PaymentType1Content,
    PaymentType2Content,
    PaymentType3Content,
  },
  props: ['order-id'],
  created() {
    return this.fetchOrder()
  },
  data() {
    return {
      valid: true,
      errorMsg: '',
      cancelReasonDialog: false,
      cancelOrderDialog: false,
      cancelOrderMessage: '',
      cancelReason: '',
      cancelReasons: [],
      cancelReasonOther: '',
      paymentType1Dialog: false,
      paymentType2Dialog: false,
      paymentType3Dialog: false,
      isProductLoading: false,
      isCancelLoading: false,
      order: null,
      checkbox: true,
      dialog: false,
      invoDialog: false,
      reason: '',
      isEditInvo: false,
      template: {
        pre_no: '',
        pre_name: '',
        invo_address: '',
        carrier_id: '',
      },
    }
  },
  watch: {
    cancelReasonOther(newVal) {
      if (newVal.length >= 200) {
        this.errorMsg = '已達字數上限，無法再輸入'
      } else {
        this.errorMsg = ''
      }
    },
  },
  computed: {
    totalOrderNum() {
      return this.order
        ? this.order.detail_array.reduce((acc, cur) => acc + cur.order_num, 0)
        : 0
    },
    totalPrice() {
      return this.order
        ? this.order.detail_array.reduce(
            (acc, cur) => acc + cur.discount_price * cur.order_num,
            0
          ) + this.order.shipment
        : 0
    },
  },
  methods: {
    handleProductClick(to) {
      sessionStorage.setItem(
        'pec_ga_info',
        JSON.stringify({
          target_product_id: this.order.product_id,
          current_path: this.$route.path,
          previous_path: window.previousUrl,
          section_name: 'ga-order-buy-again-detail',
          add_from: '',
        })
      )
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: 'section-click',
        content_id: 'ga-order-buy-again-detail',
      })
      this.$router.push(to)
    },
    fetchOrder() {
      this.isProductLoading = true
      return apiAxios({
        method: 'post',
        url: '/Preorder/GetPreorder',
        params: { v: '2' },
        data: { preorder_id: this.orderId },
      })
        .then(res => {
          if (res.result[0]) {
            this.order = res.result[0]
            if (
              this.order.payment_type === '2' &&
              this.order.payment_status == '0'
            ) {
              return apiAxios({
                method: 'post',
                url: '/Checkout/VerifyPaymentStatus',
                data: {
                  checkout_id: this.order.checkout_id,
                },
              })
                .then(() =>
                  apiAxios({
                    method: 'post',
                    url: '/Preorder/GetPreorder',
                    params: { v: '2' },
                    data: { preorder_id: this.orderId },
                  })
                )
                .then(res => (this.order = res.result[0]))
            }
          }
        })
        .finally(() => (this.isProductLoading = false))
    },
    showReturnDialog() {
      this.dialog = true
    },
    cancelOrder() {
      this.cancelOrderDialog = true
      if (this.order.checkout_id) {
        apiAxios({
          method: 'post',
          url: '/Checkout/GetOrderIdArray',
          data: { checkout_id: this.order.checkout_id },
        }).then(res => {
          this.cancelOrderMessage =
            res.result.length > 1
              ? '本次結帳包含其他訂單，將會一併取消，確定要取消訂單?'
              : '確定要取消訂單?'
        })
      } else {
        this.cancelReasons = '確定要取消訂單?'
      }
      apiAxios({
        method: 'post',
        url: '/CancelReason/GetCancelReason',
      }).then(res => {
        this.cancelReasons = res.result
      })
    },

    cancelOrderConfirm() {
      if (this.$refs.form.validate()) {
        this.isCancelLoading = true
        if (this.order.checkout_id) {
          return apiAxios({
            method: 'post',
            url: '/Checkout/CancelCheckout',
            data: {
              checkout_id: this.order.checkout_id,
              reason_id: this.cancelReason,
              reason: this.cancelReasonOther,
            },
          })
            .then(() => this.fetchOrder())
            .then(() => {
              this.$snackbar.add('訂單已經取消', { color: 'success' })
              localStorage.setItem('pec_refresh_order_list', true)
            })
            .finally(() => {
              this.cancelOrderDialog = false
              this.isCancelLoading = false
            })
        } else {
          return apiAxios({
            method: 'post',
            url: '/Preorder/CancelPreorder',
            data: { order_id: this.orderId },
          })
            .then(() => this.fetchOrder())
            .then(() => {
              this.$snackbar.add('訂單已經取消', { color: 'success' })
              localStorage.setItem('pec_refresh_order_list', true)
            })
            .finally(() => {
              this.cancelOrderDialog = false
              this.isCancelLoading = false
            })
        }
      }
    },
    relativeTime(dateString) {
      return this.$dayjs().to(this.$dayjs(dateString))
    },
    editInvoCancel() {
      this.isEditInvo = false
      this.template = {
        pre_no: '',
        pre_name: '',
        invo_address: '',
        carrier_id: '',
      }
    },
    editInvo() {
      this.isEditInvo = true
      if (this.order.invo_type == '3') {
        this.template.pre_no = this.order.pre_no
        this.template.pre_name = this.order.pre_name
        this.template.invo_address = this.order.invo_address
      } else {
        this.template.carrier_id = this.order.carrier_id
      }
    },
    editInvoConfirm() {
      let isValid
      if (this.order.invo_type == 2) {
        isValid = this.$refs.carrierField.validate()
      } else {
        isValid =
          this.$refs.preNoField.validate() &&
          this.$refs.preNameField.validate() &&
          this.$refs.invoAddressField.validate()
      }

      if (isValid) {
        this.template.preorder_id = this.order.id
        return apiAxios({
          method: 'post',
          url: '/Invo/UpdateInvoInfo',
          data: this.template,
        }).then(() => {
          this.isEditInvo = false
          this.template = {
            pre_no: '',
            pre_name: '',
            invo_address: '',
            carrier_id: '',
          }
          this.$snackbar.add('發票資訊修改成功', { color: 'success' })
          this.fetchOrder()
        })
      } else {
        this.$snackbar.add('修改失敗，請檢查發票資訊格式', { color: 'error' })
      }
    },
    backToOrder() {
      this.$router.go(-1)
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

:deep(.v-text-field.v-input--dense:not(.v-text-field--outlined) input) {
  padding: 0px;
}
</style>
