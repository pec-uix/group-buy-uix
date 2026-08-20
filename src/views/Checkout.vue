<template>
  <v-form lazy-validation ref="form">
    <v-container fluid class="mt-3 mb-16 pa-2">
      <v-row v-if="isProductLoading">
        <v-col cols="4">
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </v-col>
        <v-col cols="8">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12" md="5">
          <v-card class="mb-4">
            <v-list dense three-line>
              <v-subheader>結帳品項</v-subheader>
              <v-list-item
                class="px-2"
                v-for="checkoutItem in checkoutItemArray"
                :key="checkoutItem.id"
              >
                <v-list-item-avatar tile size="72">
                  <v-img :src="checkoutItem.img_url" contain></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center text-truncate">
                    <v-chip
                      v-if="checkoutItem.is_spcloff_product == 'Y'"
                      class="mb-1 mt-1 px-3 mr-2 flex-shrink-0"
                      style="font-size: 12px"
                      color="#FFE500"
                      small
                      >加價購</v-chip
                    >
                    <span class="text-truncate">
                      {{ checkoutItem.product_name }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle
                    >規格:{{ checkoutItem.spec_name }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle class="text-right">
                    <div class="d-flex align-center">
                      <v-chip
                        v-if="!privateCheckoutId"
                        small
                        outlined
                        color="secondary"
                        >{{
                          checkoutItem.receive_type === '1'
                            ? checkoutItem.receive_area_name
                            : '宅配'
                        }}</v-chip
                      >
                      <v-spacer></v-spacer>
                      <div>
                        <span
                          v-if="checkoutItem.discount_for_checkout_item"
                          class="info--text mr-2"
                          >${{
                            checkoutItem.discount_price *
                              checkoutItem.order_num -
                            checkoutItem.discount_for_checkout_item
                          }}</span
                        >
                        <span
                          :class="
                            checkoutItem.discount_for_checkout_item
                              ? 'text-decoration-line-through'
                              : ''
                          "
                        >
                          <span class="primary--text"
                            >${{ checkoutItem.discount_price }}</span
                          >
                          X{{ checkoutItem.order_num }}
                        </span>
                        <!-- <template
                          v-if="
                            checkoutItem.reward_amount_limit_display !=
                            checkoutItem.discount_price
                          "
                        >
                          <br />
                          <span
                            v-if="checkoutItem.reward_exclude == 'Y'"
                            class="warning--text"
                          >
                            不可折抵
                          </span>
                          <span
                            v-else-if="checkoutItem.reward_amount_limit == 0"
                            class="warning--text"
                          >
                            部分折價券不可折抵
                          </span>
                          <span v-else class="warning--text">
                            折抵上限:{{
                              checkoutItem.reward_amount_limit_display *
                              checkoutItem.order_num
                            }}
                          </span>
                        </template> -->
                      </div>
                    </div>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-right">
                    <div
                      v-if="checkoutItem.reward_exclude == 'Y'"
                      class="warning--text"
                    >
                      不可折抵
                    </div>
                    <div v-else>
                      <div
                        v-if="
                          checkoutItem &&
                          checkoutItem.reward_usable &&
                          checkoutItem.reward_usable.length
                        "
                        class="d-flex align-center justify-end"
                      >
                        <span
                          v-if="checkoutItem.discount_for_checkout_item"
                          class="mr-2 mt-1 black--text"
                        >
                          已折抵
                          <span class="info--text">
                            ${{ checkoutItem.discount_for_checkout_item }}
                          </span>
                          元
                        </span>
                        <v-btn
                          outlined
                          small
                          @click="showRewardDialog(checkoutItem)"
                          color="info"
                          :disabled="invoType == 3"
                        >
                          {{
                            cartRewardArray.find(e => e.type == checkoutItem.id)
                              ? '修改折價券'
                              : '套用折價券'
                          }}
                        </v-btn>
                      </div>
                      <div v-else>
                        <v-btn outlined small disabled> 無可套用折價券 </v-btn>
                      </div>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="7">
          <v-card>
            <v-container>
              <v-row no-gutters class="py-2">
                <template v-if="privateCheckoutId">
                  <v-col cols="12" md="3" class="mt-md-3"> 領貨方式： </v-col>
                  <v-col cols="12" md="9" class="primary--text text-right">
                    <v-chip-group
                      column
                      v-model="receiveType"
                      mandatory
                      active-class="selected"
                    >
                      <v-chip
                        v-for="receive_type in receiveTypeArray"
                        :key="receive_type.value"
                        :value="receive_type.value"
                        filter
                        label
                        outlined
                        >{{ receive_type.text }}</v-chip
                      >
                    </v-chip-group>
                    <v-select
                      v-show="receiveType == 1"
                      outlined
                      dense
                      :items="receiveAreaArray"
                      placeholder="請選擇地點"
                      :rules="[
                        v => receiveType != 1 || !!v || '請選擇領貨地點',
                      ]"
                      v-model="receiveArea"
                    >
                    </v-select>
                  </v-col>
                </template>
                <template
                  v-if="
                    (receiveType == '2' || hasReceiveType2) &&
                    !deliveredInPerson
                  "
                >
                  <v-col cols="12">
                    <h6 class="text-h6 pec-title-bl primary--text">宅配資訊</h6>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0 my-2">
                    收件人姓名：</v-col
                  >
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          ref="personalInformationComboBox"
                          v-model="personalInformation"
                          :items="personalInformationArray"
                          :rules="receivePersonRules"
                          item-text="receivePerson"
                          item-value="id"
                          outlined
                          dense
                          return-object
                          required
                        ></v-combobox>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0 my-2"> 宅配地址：</v-col>
                  <v-col cols="12" md="9">
                    <v-row dense>
                      <v-col cols="4">
                        <v-select
                          v-model="zipcode"
                          :items="filterZipcodes"
                          item-text="zipcode"
                          item-value="zipcode"
                          label="郵遞區號"
                          disabled
                          outlined
                          dense
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          v-model="county"
                          :items="counties"
                          :rules="countyRules"
                          item-text="name"
                          item-value="id"
                          label="請選擇縣市"
                          @change="
                            zipcode = ''
                            $refs.form.resetValidation()
                          "
                          outlined
                          dense
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          v-model="zipcode"
                          :items="filterZipcodes"
                          :rules="zipcodeRules"
                          item-text="city"
                          item-value="city"
                          dense
                          label="請選擇鄉鎮市區"
                          return-object
                          outlined
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0 my-2"></v-col>
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="receiveAddress"
                          :counter="50"
                          :rules="addressRules"
                          outlined
                          dense
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0 my-2">
                    收件人市話：</v-col
                  >
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="3">
                        <v-text-field
                          class="areaCode"
                          v-model="areaCode"
                          :counter="2"
                          outlined
                          dense
                        ></v-text-field
                      ></v-col>
                      <v-col cols="9">
                        <v-text-field
                          v-model="localTelephone"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0 my-2">
                    收件人手機：</v-col
                  >
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="contactPhone"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0"> </v-col>
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12">
                        <v-checkbox
                          v-model="isSaveInfo"
                          class="mt-0 pt-0"
                          label="將此次寄送資料新增到資訊簿"
                          required
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0"> </v-col>
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          color="primary lighten-1"
                          class="mr-4"
                          depressed
                          @click="openPersonalInformationListDialog = true"
                        >
                          編輯資訊簿
                        </v-btn>
                        <v-btn
                          color="error lighten-1"
                          class="mr-4"
                          @click="resetInfo"
                          depressed
                        >
                          清除重填
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </template>
                <template
                  v-if="
                    (receiveType == '2' || hasReceiveType2) && deliveredInPerson
                  "
                >
                  <v-col cols="12" s class="mt-3">
                    <v-alert prominent text dense type="success">
                      永康/新市廠區，提供專人親送服務。
                      <br />
                      ※訂購黃金相關問題請來電諮詢 : 06-2536789#8088 吳小姐
                    </v-alert>
                  </v-col>
                </template>
              </v-row>
              <v-row no-gutters class="py-4">
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row no-gutters class="py-2">
                <v-col cols="12" md="3" class="mt-md-3"> 付款方式： </v-col>
                <v-col v-if="isPaymentTypeLoading" cols="12" md="9">
                  <v-skeleton-loader
                    class="mt-3"
                    type="heading"
                  ></v-skeleton-loader>
                </v-col>
                <v-col
                  cols="12"
                  md="9"
                  v-else-if="
                    privateCheckoutId && receiveType == '1' && !receiveArea
                  "
                >
                  <v-alert text type="warning"> 請先選擇領貨地點 </v-alert>
                </v-col>
                <template v-else-if="filteredPaymentTypeArray.length == 0">
                  <v-col cols="12" md="9">
                    <v-alert text type="warning">
                      <div class="d-flex align-center">
                        <div>無共用付款方式</div>
                        <v-spacer></v-spacer>
                        <v-btn small color="warning" outlined to="/cart"
                          >返回購物車</v-btn
                        >
                      </div>
                    </v-alert>
                  </v-col>
                </template>
                <template v-else>
                  <v-col cols="12" md="9">
                    <template>
                      <v-chip-group
                        column
                        v-model="paymentType"
                        mandatory
                        active-class="selected"
                      >
                        <v-chip
                          v-for="payment_type in filteredPaymentTypeArray"
                          :key="payment_type.payment_type"
                          :value="payment_type.payment_type"
                          filter
                          label
                          outlined
                          >{{ payment_type.payment_type_name }}</v-chip
                        >
                      </v-chip-group>
                      <span v-if="paymentType == '1'">
                        <a
                          class="text-decoration-underline"
                          @click="paymentType1Dialog = true"
                        >
                          【取貨點繳費說明】
                        </a>
                        <v-alert
                          v-if="receiveType == '2' || hasReceiveType2"
                          class="mt-2 py-3"
                          style="background-color: rgba(255, 253, 231, 1)"
                          border="left"
                          color="rgba(251, 192, 45, 1)"
                          colored-border
                        >
                          <div class="text-h5 font-weight-bold mb-1">
                            取貨點繳費說明
                          </div>
                          宅配請於訂單成立4天內
                          <a
                            class="text-decoration-underline cursor-pointer primary--text"
                            @click="paymentType1Dialog = true"
                            >於取貨點 <i class="fa-regular fa-circle-info"></i>
                          </a>
                          完成繳費，逾期取消訂單
                        </v-alert>
                      </span>
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
                  <template v-if="paymentType === '2'">
                    <v-col cols="12" md="3" class="mt-3"> 付款工具： </v-col>
                    <v-col cols="12" md="9" class="pt-0">
                      <template v-if="commonPayments.length">
                        <v-chip-group
                          column
                          v-model="digitalpaymentType"
                          mandatory
                          active-class="selected"
                        >
                          <div>
                            <v-chip
                              v-if="
                                commonPayments.some(
                                  p => p.payment_tool === 'ICASH_PAY'
                                ) && showIcashPayPayment
                              "
                              value="ICASH_PAY"
                              filter
                              label
                              outlined
                              x-large
                              style="border-width: 4px"
                            >
                              <div class="d-flex align-center black--text">
                                <img
                                  class="mr-2"
                                  src="/ICP-new.png"
                                  height="30"
                                  alt=""
                                />
                                <span>(支援</span>
                                <img src="/twqr-logo.png" height="24" alt="" />
                                <span>)</span>
                              </div>
                            </v-chip>
                            <div
                              v-if="showIcashPayPayment"
                              class="d-flex text-body-2 text--secondary cursor-pointer mt-1"
                              @click="twqrListDialog = true"
                            >
                              <background-svg
                                backgroungUrl="/help_outline.svg"
                                width="18px"
                                height="18px"
                                color="#aaa"
                                class="mr-1"
                              ></background-svg>
                              查看TWQR支援電支機構清單
                            </div>
                          </div>

                          <!-- <v-chip
                          v-if="
                            commonPayments.some(
                              p => p.payment_tool === 'OP_WALLET'
                            )
                          "
                          value="OP_WALLET"
                          filter
                          label
                          outlined
                          x-large
                          style="border-width: 3px"
                        >
                          OPEN錢包(中信)
                        </v-chip> -->
                          <v-chip
                            v-if="
                              !categoryHasGold &&
                              commonPayments.some(p => p.payment_tool === 'OPW')
                            "
                            value="OPW"
                            filter
                            label
                            outlined
                            x-large
                            style="border-width: 3px"
                          >
                            <img src="/OPW.png" height="30" alt="" />
                          </v-chip>
                          <v-chip
                            v-if="
                              !categoryHasGold &&
                              commonPayments.some(
                                p => p.payment_tool === 'ICASH'
                              )
                            "
                            value="1"
                            filter
                            label
                            outlined
                            x-large
                            style="border-width: 4px"
                          >
                            <img src="/ICP-new.png" height="30" alt="" />
                          </v-chip>
                          <v-chip
                            v-if="
                              commonPayments.some(
                                p => p.payment_tool === 'LINE_PAY'
                              ) && showLinePayPayment
                            "
                            value="LINE_PAY"
                            filter
                            label
                            outlined
                            x-large
                            style="border-width: 4px"
                          >
                            <img src="/LinePay.png" height="30" alt="" />
                          </v-chip>
                          <div
                            v-if="
                              commonPayments.some(p => p.payment_tool === 'C0')
                            "
                          >
                            <v-chip
                              value="2"
                              filter
                              label
                              outlined
                              x-large
                              style="border-width: 3px"
                            >
                              信用卡(一次付清)
                            </v-chip>
                            <v-tooltip
                              bottom
                              v-if="!canEpp"
                              color="grey darken-1"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <div
                                  v-bind="attrs"
                                  v-on="on"
                                  class="d-flex text-body-2 text--secondary"
                                >
                                  <background-svg
                                    backgroungUrl="/help_outline.svg"
                                    width="18px"
                                    height="18px"
                                    color="#aaa"
                                    class="mr-1"
                                  ></background-svg>
                                  <span>要怎麼分期?</span>
                                </div>
                              </template>
                              <span
                                >消費金額需要滿3000元且不能多筆取貨點取貨商品才可分期
                              </span>
                            </v-tooltip>
                          </div>
                          <template v-if="canEpp">
                            <div
                              v-if="
                                commonPayments.some(
                                  p => p.payment_tool === 'C2'
                                )
                              "
                            >
                              <v-chip
                                value="3"
                                filter
                                label
                                outlined
                                x-large
                                style="border-width: 4px"
                              >
                                信用卡分期(國泰)
                              </v-chip>
                              <template v-if="digitalpaymentType == 3">
                                <v-row>
                                  <v-col cols="12" class="px-3 py-1">
                                    <v-chip-group
                                      v-model="eppTenure"
                                      mandatory
                                      active-class="primary--text"
                                    >
                                      <v-chip value="3"> 3期 </v-chip>
                                      <v-chip value="6"> 6期 </v-chip>
                                      <v-chip
                                        value="12"
                                        v-if="orderTotalPrice > 100000"
                                      >
                                        12期
                                      </v-chip>
                                    </v-chip-group>
                                  </v-col>
                                </v-row>
                              </template>
                            </div>
                            <v-chip
                              v-if="
                                commonPayments.some(
                                  p => p.payment_tool === 'C2'
                                )
                              "
                              value="4"
                              filter
                              label
                              outlined
                              x-large
                              style="border-width: 4px"
                            >
                              信用卡分期(中信QR)
                            </v-chip>
                          </template>
                        </v-chip-group>
                      </template>
                      <div v-else class="mt-3 error--text">
                        「因為沒有共同的線上支付方式，因此建議分開結帳或者使用取貨點繳費。」
                      </div>
                      <div v-if="shouldShowInterface">
                        <div class="d-flex align-center mt-1 mb-2">
                          <span
                            class="text-body-1 font-weight-bold secondary--text mr-3"
                            >常用信用卡</span
                          ><span
                            style="
                              font-size: 14px;
                              padding: 1px 5px;
                              border: 1px solid #d3d3d3;
                              cursor: pointer;
                              display: inline-block;
                            "
                            @click="setCardAsDefaultDialog = true"
                            >更改</span
                          >
                        </div>
                        <div v-if="cardArray.length > 0">
                          <div v-for="(item, index) in cardArray" :key="index">
                            <div v-if="item.cardId == defaultCardId">
                              <v-checkbox
                                v-model="useDefaultCreditCard"
                                class="mt-0 mb-3"
                                hide-details
                                :disabled="checkExpiry(item.expiryDate)"
                              >
                                <template #label>
                                  <div>
                                    <div>
                                      <span
                                        class="font-weight-bold"
                                        :style="`${
                                          checkExpiry(item.expiryDate)
                                            ? 'color:rgba(0, 0, 0, 0.38)'
                                            : 'color:rgba(0, 0, 0, 1)'
                                        }`"
                                        >{{ item.issuerName }}</span
                                      ><v-chip
                                        class="ml-2 mb-1"
                                        color="secondary"
                                        label
                                        small
                                      >
                                        預設
                                      </v-chip>
                                    </div>
                                    <div>
                                      {{ item.maskedPan
                                      }}<span class="ml-3"
                                        >{{ formattedNumber(item.expiryDate) }}
                                        {{
                                          checkExpiry(item.expiryDate)
                                            ? '(已過期)'
                                            : ''
                                        }}</span
                                      >
                                    </div>
                                  </div>
                                </template>
                              </v-checkbox>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" v-if="digitalpaymentType == 2">
                      <v-alert text type="warning">
                        非使用OPEN錢包、icash Pay信用卡支付，不列入0.33%回饋優惠
                      </v-alert>
                    </v-col>
                    <v-col cols="12" v-if="digitalpaymentType == 3">
                      <v-alert text color="warning">
                        <v-row dense>
                          <v-col cols="12">
                            <v-card
                              elevation="0"
                              color="transparent"
                              class="warning--text d-flex align-center"
                            >
                              <background-svg
                                class="mt-1 mr-1"
                                backgroungUrl="/credit_score.svg"
                                width="20px"
                                height="20px"
                                color="#d86816"
                              ></background-svg>
                              <span>分期僅接受國泰世華信用卡</span>
                            </v-card>
                          </v-col>
                          <v-col cols="12">
                            <v-card
                              elevation="0"
                              color="transparent"
                              class="warning--text d-flex"
                            >
                              <background-svg
                                class="mr-1"
                                backgroungUrl="/error_outline.svg"
                                width="20px"
                                height="20px"
                                color="#d86816"
                              ></background-svg>
                              <span>
                                非使用OPEN錢包、icash
                                Pay信用卡支付，不列入0.33%回饋優惠
                              </span>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-alert>
                    </v-col>
                    <v-col cols="12" v-if="digitalpaymentType == 4">
                      <v-alert text color="warning">
                        <v-row dense>
                          <v-col cols="12">
                            <v-card
                              elevation="0"
                              color="transparent"
                              class="warning--text d-flex align-center"
                            >
                              <background-svg
                                class="mt-1 mr-1"
                                backgroungUrl="/credit_score.svg"
                                width="20px"
                                height="20px"
                                color="#d86816"
                              ></background-svg>
                              <span
                                >中國信託信用卡可在付款成功後申請QR分期</span
                              >
                            </v-card>
                          </v-col>
                          <v-col cols="12">
                            <v-card
                              elevation="0"
                              color="transparent"
                              class="warning--text d-flex"
                            >
                              <background-svg
                                class="mr-1"
                                backgroungUrl="/error_outline.svg"
                                width="20px"
                                height="20px"
                                color="#d86816"
                              ></background-svg>
                              <span>
                                非使用OPEN錢包、icash
                                Pay信用卡支付，不列入0.33%回饋優惠
                              </span>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-alert>
                    </v-col>
                  </template>
                </template>
              </v-row>
              <v-row no-gutters class="py-4">
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row no-gutters class="py-2">
                <v-col cols="12" md="3" class="mt-md-3">電子發票: </v-col>
                <v-col cols="12" md="9">
                  <v-chip-group
                    column
                    v-model="invoType"
                    mandatory
                    active-class="selected"
                  >
                    <v-chip value="2" filter label outlined> 二聯式 </v-chip>
                    <v-chip
                      value="3"
                      :disabled="
                        !!cartRewardArray
                          .map(e => e.reward)
                          .flat()
                          .reduce((acc, cur) => acc + cur.qty, 0)
                      "
                      filter
                      label
                      outlined
                    >
                      三聯式{{
                        cartRewardArray
                          .map(e => e.reward)
                          .flat()
                          .reduce((acc, cur) => acc + cur.qty, 0)
                          ? '發票不得使用折價券'
                          : ''
                      }}
                    </v-chip>
                  </v-chip-group>
                </v-col>
                <template v-if="invoType === '2'">
                  <v-col cols="12" md="3" class="mt-md-3">
                    <span></span>
                    電子發票手機載具:
                  </v-col>
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
                </template>
                <template v-else>
                  <v-col cols="12" md="3">買方統一編號: </v-col>
                  <v-col cols="12" md="9">
                    <!-- <v-text-field
                      placeholder="請輸入買方統一編號"
                      v-model="preNo"
                      outlined
                      dense
                      :rules="[
                        v =>
                          invoType != 3 ||
                          /^\d{8}$/.test(v) ||
                          '請輸入正確格式',
                        v =>
                          invoType != 3 || checkPreNo(v) || '統一編號驗證錯誤',
                      ]"
                    ></v-text-field> -->
                    <v-combobox
                      v-model="invoInfoSelect"
                      :items="invoInfoArray"
                      item-text="preNo"
                      outlined
                      dense
                      return-object
                      required
                      :rules="[
                        v => (invoType == 3 ? !!v || '此欄位為必填' : true), // 當 invoType == 3，檢查是否有輸入
                        v =>
                          (invoType != 3 && /^\d{8}$/.test(v)) ||
                          (invoType == 3 && checkPreNo(v)) ||
                          (invoType != 3
                            ? '請輸入正確格式'
                            : '統一編號驗證錯誤'),
                      ]"
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12" md="3">買受人公司名稱: </v-col>
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
                  <v-col cols="12" md="3">買受人公司地址: </v-col>
                  <v-col cols="12" md="9">
                    <v-text-field
                      placeholder="請輸入買受人公司地址"
                      maxlength="80"
                      counter
                      v-model="invoAddress"
                      outlined
                      dense
                      required
                      :rules="[
                        v => invoType != 3 || !!v || '請輸入買受人公司地址',
                      ]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" class="pb-0"> </v-col>
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12">
                        <v-checkbox
                          v-model="isSaveInvo"
                          class="mt-0 pt-0"
                          label="將此次三聯資料新增到常用發票"
                          required
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="pb-0"> </v-col>
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          color="primary lighten-1"
                          class="mr-4"
                          depressed
                          @click="openPersonalInvoListDialog = true"
                        >
                          編輯常用發票
                        </v-btn>
                        <v-btn
                          color="error lighten-1"
                          class="mr-4"
                          @click="resetInvo"
                          depressed
                        >
                          清除重填
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </template>
              </v-row>
              <v-row no-gutters class="py-4">
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row no-gutters class="py-2">
                <v-col cols="12" md="3">備註:</v-col>
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
                <v-col class="py-4" cols="12">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" v-if="!alreadyInviteColleague">
                  <div class="py-2">
                    <div class="d-flex">
                      推薦人
                      <span @click="couponInfoDialog = true">
                        <background-svg
                          backgroungUrl="/error_outline.svg"
                          width="16px"
                          height="16px"
                          color="#ca1f1d"
                          style="
                            cursor: pointer;
                            margin-top: 2px;
                            margin-left: 5px;
                          "
                        ></background-svg>
                      </span>
                    </div>
                    <div class="d-flex">
                      <v-text-field
                        label="推薦人手機"
                        placeholder="請先輸入邀請人手機"
                        outlined
                        dense
                        class="gift-input mb-3"
                        type="number"
                        v-model="couponPhoneNumber"
                        hide-details="auto"
                        :disabled="alreadyInviteColleague"
                      ></v-text-field>
                      <v-btn
                        dense
                        color="primary"
                        @click="searchCouponPhone"
                        class="gift-btn"
                        elevation="0"
                        :disabled="alreadyInviteColleague"
                      >
                        尋找</v-btn
                      >
                    </div>
                    <v-select
                      :items="couponGifter"
                      label="選擇推薦人"
                      outlined
                      item-text="display_name"
                      item-value="username"
                      dense
                      :disabled="
                        !couponGifter.length ||
                        couponGifter.length == 1 ||
                        alreadyInviteColleague
                      "
                      v-model="selectCouponGifter"
                      hide-details="auto"
                    ></v-select>
                  </div>
                </v-col>
                <v-col class="py-4" cols="12" v-if="!alreadyInviteColleague">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12">
                  <div class="d-flex align-center py-2">
                    <h6 class="text-h6 pec-title-bl primary--text">折價券</h6>
                    <v-spacer></v-spacer>

                    <div class="d-flex align-center" v-if="invoType == 3">
                      三聯式發票不得使用折價券
                    </div>
                    <div
                      v-else
                      class="d-flex align-center"
                      style="cursor: pointer"
                      @click="showRewardDialog('all')"
                    >
                      <div v-if="totalRewardAmount2 && !rewardDialog">
                        已套用<span class="primary--text"
                          >"{{ countOfReward }}"</span
                        >張折價券
                      </div>
                      <div v-else>使用折價券</div>
                      <background-svg
                        backgroungUrl="/chevron_right.svg"
                        width="12px"
                        height="12px"
                        color="#444"
                        class="mx-2"
                      ></background-svg>
                    </div>
                  </div>
                </v-col>
                <v-col class="py-4" cols="12">
                  <v-divider></v-divider>
                </v-col>
                <template
                  v-if="
                    ((receiveType == '2' || hasReceiveType2) &&
                      shipment !== 0) ||
                    (totalRewardAmount2 && !rewardDialog)
                  "
                >
                  <v-col cols="6" md="3">商品金額：</v-col>
                  <v-col
                    cols="6"
                    md="9"
                    class="text-h6 primary--text text-right"
                  >
                    ${{ productTotalPrice }}
                  </v-col>
                  <template
                    v-if="
                      (receiveType == '2' || hasReceiveType2) && shipment !== 0
                    "
                  >
                    <v-col cols="6" md="3">運費：</v-col>
                    <v-col
                      cols="6"
                      md="9"
                      class="text-h6 primary--text text-right"
                    >
                      ${{ shipment }}
                    </v-col>
                  </template>
                  <template v-if="totalRewardAmount2 && !rewardDialog">
                    <v-col cols="6" md="3">折扣：</v-col>
                    <v-col
                      cols="6"
                      md="9"
                      class="text-h6 primary--text text-right"
                    >
                      -${{ totalRewardAmount2 }}
                    </v-col>
                  </template>
                </template>
                <v-col cols="6" md="3">總付款金額：</v-col>
                <v-col cols="6" md="9" class="text-h6 primary--text text-right">
                  ${{
                    orderTotalPrice - (rewardDialog ? 0 : totalRewardAmount2)
                  }}
                </v-col>
              </v-row>
              <v-row class="mt-3">
                <v-col cols="12">
                  <div
                    class="return-policy-box"
                    :class="agreeReturnPolicy ? 'return-policy-box--checked' : ''"
                    @click="agreeReturnPolicy = !agreeReturnPolicy; onAgreeReturnPolicyChange(agreeReturnPolicy)"
                  >
                    <v-checkbox
                      v-model="agreeReturnPolicy"
                      color="primary darken-2"
                      class="mt-0 pt-0"
                      hide-details
                      @change="onAgreeReturnPolicyChange"
                      @click.stop
                    >
                      <template v-slot:label>
                        <span class="font-weight-medium primary--text text--darken-2">
                          我同意辦理退貨時，由團購網代為處理發票及銷貨退回證明單，以加速退貨退款作業。線上支付退款作業完成後，款項約 7 ~ 14 個工作天退刷。（實際仍以銀行作業為主）
                        </span>
                      </template>
                    </v-checkbox>
                  </div>
                </v-col>
              </v-row>
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-btn
                    depressed
                    block
                    color="primary"
                    :loading="isSubmitting"
                    @click="beforeSubmit"
                    :disabled="!paymentType && !isDevPreview"
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
                    <li>
                      線上支付退款作業完成後，款項約 7 ~ 14 個工作天退刷。（實際仍以銀行作業為主）
                    </li>
                  </ol>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-text-field
        v-show="isVisible"
        ref="textFieldForFocus"
        label="Name"
      ></v-text-field>
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
        <v-card-title>【線上支付客服】</v-card-title>
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
    <v-dialog v-model="rewardDialog" persistent scrollable max-width="600px">
      <v-card>
        <v-card-title>選擇折價券</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: calc(90vh - 110px)">
          <ul class="mt-1 primary--text">
            <li>三聯式發票不得使用折價券</li>
          </ul>
          <v-container v-if="rewardArray2.length">
            <v-row v-for="(record, i) in rewardArray2" :key="i">
              <v-col cols="12">
                <div class="text-body-1 primary--text product-title">
                  {{ record.reward_name }}
                </div>
                <div class="text-caption">
                  可用張數:{{ record.customer_rewards_count }} ( 截止日:{{
                    $dayjs(record.min_end_date).format('YYYY-MM-DD HH:mm')
                  }}
                  <template v-if="record.min_end_date != record.max_end_date">
                    ~{{
                      $dayjs(record.max_end_date).format('YYYY-MM-DD HH:mm')
                    }} </template
                  >)
                </div>
                <v-select
                  v-if="record.qty < 10"
                  outlined
                  dense
                  :items="
                    Array.from({
                      length: Math.min(record.customer_rewards_count + 1, 11),
                    }).map((x, i) => ({
                      text: i === 10 ? '10+' : i,
                      value: i,
                    }))
                  "
                  placeholder="請選擇數量"
                  v-model.number="record.qty"
                ></v-select>
                <v-text-field
                  v-else
                  outlined
                  dense
                  class="text-center"
                  placeholder="請選擇數量"
                  :value="record.qty"
                  @blur="record.qty = parseInt($event.target.value, 10)"
                  prepend-inner-icon="remove"
                  append-icon="add"
                  @click:prepend-inner="remove(record)"
                  @click:append="add(record)"
                  :rules="[
                    v => /^\+?(0|[1-9]\d*)$/.test(v) || '請輸入正確數量',
                    v => record.customer_rewards_count >= v || '超過剩餘數量',
                  ]"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-container v-else>
            <div class="d-flex justify-center text-h6 mt-5">無符合折價券</div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <table>
            <tr>
              <td>{{ typeOfReward == 'all' ? '結帳' : '明細' }}總金額:</td>
              <td class="pr-2">
                {{ totalPriceForDialog }}
              </td>
              <!-- <td>折抵上限:</td>
              <td
                :class="{
                  'primary--text': productRewardAmountLimit < totalRewardAmount,
                }"
              >
                {{ productRewardAmountLimit }}
              </td> -->
            </tr>
            <tr>
              <td>折價券折抵:</td>
              <td class="pr-2">
                折抵 ${{
                  rewardArray2.reduce(
                    (acc, cur) => acc + (cur.qty || 0) * cur.reward_amount,
                    0
                  )
                }}
              </td>
              <!-- <td>剩餘可折抵:</td>
              <td>
                {{ productRewardAmountLimit - totalRewardAmount }}
              </td> -->
            </tr>
          </table>
          <v-spacer></v-spacer>
          <v-btn depressed @click="cancelRewardDialog" text>取消</v-btn>
          <v-btn
            depressed
            :disabled="isRewardDisabled2 || !rewardConCal"
            @click="confirmRewardDialog"
            color="primary"
            >套用</v-btn
          >
        </v-card-actions>
        <div
          v-if="isRewardDisabled2"
          class="text-end px-4 pb-2 text-subtitle-2 primary--text"
          style="margin-top: -8px"
        >
          您所選擇的折價券不足或超過可用額度。
        </div>
        <div
          v-if="!rewardConCal"
          class="text-end px-4 pb-2 text-subtitle-2 primary--text"
          style="margin-top: -8px"
        >
          您的總結帳金額 {{ productTotalPrice }} 未滿
          {{ rewardCondition }}，不能使用折價券。
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="openPersonalInformationListDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!-- 編輯資訊簿區塊 -->
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openPersonalInformationListDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>編輯資訊簿</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="openPersonalInformationListDialog = false">
              離開
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>使用者設定</v-subheader>
          <v-list-item class="text-left">
            <v-list-item-content class="justify-space-between">
              <v-list-item-title>新增收件人</v-list-item-title>
              <v-list-item-subtitle
                >設定資訊簿方便結帳選用</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-content>
              <template>
                <div class="my-2">
                  <v-btn
                    class="float-right"
                    color="error"
                    dark
                    large
                    @click="openPersonalInformation(true)"
                  >
                    <v-icon left>add</v-icon>收件人資訊
                  </v-btn>
                </div>
              </template>
              <!-- 彈出視窗區塊 -->
              <v-dialog
                v-model="openPersonalInformationDialog"
                persistent
                max-width="600px"
                ><v-form
                  lazy-validation
                  id="infoDialogForm"
                  ref="infoDialogForm"
                >
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">收件人資訊</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="template.receivePerson"
                              label="收件人*"
                              :rules="receivePersonRules"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-row dense>
                              <v-col cols="4">
                                <v-select
                                  v-model="template.zipcode"
                                  :items="filterZipcodesTemplate"
                                  item-text="zipcode"
                                  item-value="zipcode"
                                  label="郵遞區號"
                                  disabled
                                  dense
                                ></v-select>
                              </v-col>
                              <v-col cols="4">
                                <v-select
                                  v-model="template.county"
                                  :items="counties"
                                  :rules="countyRules"
                                  item-text="name"
                                  item-value="id"
                                  label="請選擇縣市*"
                                  @change="template.zipcode = ''"
                                  dense
                                ></v-select>
                              </v-col>
                              <v-col cols="4">
                                <v-select
                                  v-model="template.zipcode"
                                  :items="filterZipcodesTemplate"
                                  :rules="zipcodeRules"
                                  item-text="city"
                                  item-value="city"
                                  dense
                                  label="請選擇鄉鎮市區*"
                                  return-object
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="template.receiveAddress"
                              label="收件地址*"
                              :rules="addressRules"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              v-model="template.areaCode"
                              :counter="2"
                              label="區碼"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="9">
                            <v-text-field
                              v-model="template.localTelephone"
                              label="市話"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="template.contactPhone"
                              label="手機"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-checkbox
                              v-if="!checkPreset"
                              v-model="template.preset"
                              label="設為預設項目"
                              required
                              :disabled="newPreset"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="openPersonalInformationDialog = false"
                      >
                        關閉
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="updatePersonalInformation"
                      >
                        儲存
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>請選擇預設地址</v-subheader>
          <v-radio-group v-model="infoRadioGroup">
            <v-list-item
              v-for="(item, index) in personalInformationArray"
              :key="index"
              class="text-left theme--light v-sheet--outlined mx-4 mb-4 rounded-lg"
            >
              <v-card-actions class="pl-0">
                <v-radio
                  name="infoRadioGroup"
                  :value="index"
                  @click="changeInfoPreset(item)"
                ></v-radio>
              </v-card-actions>
              <v-list-item-content>
                <v-list-item-title
                  class="mb-2"
                  :class="{
                    'grey--text': !item.receivePerson,
                    'text--darken-1': !item.receivePerson,
                  }"
                  >{{
                    item.receivePerson ? item.receivePerson : '待填寫'
                  }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >地址 :
                  {{ item.zipcode.zipcode == 0 ? '' : item.zipcode.zipcode }}
                  {{ item.county }}{{ item.zipcode.city
                  }}{{ item.receiveAddress }}</v-list-item-subtitle
                >
                <v-list-item-subtitle
                  >市話 : {{ item.areaCode }}-{{
                    item.localTelephone
                  }}</v-list-item-subtitle
                >
                <v-list-item-subtitle
                  >手機 : {{ item.contactPhone }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn icon @click="openPersonalInformation(false, item)">
                  <v-icon>edit</v-icon>
                </v-btn>

                <v-btn icon @click="delPersonalInformation(item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-list-item>
          </v-radio-group>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="openPersonalInvoListDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!-- 編輯常用發票區塊 -->
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openPersonalInvoListDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>編輯常用發票</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="openPersonalInvoListDialog = false">
              離開
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>使用者設定</v-subheader>
          <v-list-item class="text-left">
            <v-list-item-content class="justify-space-between">
              <v-list-item-title>新增發票</v-list-item-title>
              <v-list-item-subtitle
                >設定常用發票方便結帳選用</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-content>
              <template>
                <div class="my-2">
                  <v-btn
                    class="float-right"
                    color="error"
                    dark
                    large
                    @click="openInvoInformation(true)"
                  >
                    <v-icon left>add</v-icon>發票資訊
                  </v-btn>
                </div>
              </template>
              <!-- 彈出視窗區塊 -->
              <v-dialog
                v-model="openPersonalInvoDialog"
                persistent
                max-width="600px"
              >
                <v-form
                  lazy-validation
                  id="invoDialogForm"
                  ref="invoDialogForm"
                >
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">發票資訊</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="invoTemplate.preNo"
                              label="買方統一編號*"
                              :rules="[v => !!v || '買方統一編號 是必填項目']"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="invoTemplate.preName"
                              label="買受人公司名稱*"
                              :rules="[v => !!v || '買受人公司名稱 是必填項目']"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="invoTemplate.invoAddress"
                              label="買受人公司地址"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-checkbox
                              v-if="!checkInvoPreset"
                              v-model="invoTemplate.preset"
                              label="設為預設項目"
                              required
                              :disabled="newInvoPreset"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="openPersonalInvoDialog = false"
                      >
                        關閉
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="updateInvoInformation"
                      >
                        儲存
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>請選擇預設發票</v-subheader>
          <v-radio-group v-model="invoInRadioGroup">
            <v-list-item
              v-for="(item, index) in invoInfoArray"
              :key="index"
              class="text-left theme--light v-sheet--outlined mx-4 mb-4 rounded-lg"
            >
              <v-card-actions class="pl-0">
                <v-radio
                  name="invoInRadioGroup"
                  :value="index"
                  @click="changeInvoPreset(item)"
                ></v-radio>
              </v-card-actions>
              <v-list-item-content>
                <v-list-item-title class="mb-2 text--darken-1">
                  {{ item.preNo }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  買受人公司名稱 : {{ item.preName }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  買受人公司地址 : {{ item.invoAddress }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click="openInvoInformation(false, item)">
                  <v-icon>edit</v-icon>
                </v-btn>

                <v-btn icon @click="delInvoInfoInformation(item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-list-item>
          </v-radio-group>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="beforeSubmitDialog"
      persistent
      scrollable
      max-width="600"
    >
      <v-card>
        <v-card-text class="text-body-1 pt-2">
          <div class="black--text text-center my-3">
            請再次確認推薦人姓名、電話，經確認後無法修改推薦者！
          </div>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">姓名</th>
                  <th class="text-center">電話</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">
                    {{
                      couponGifter.find(
                        e => e.username == selectCouponGifter
                      ) &&
                      couponGifter.find(e => e.username == selectCouponGifter)
                        .display_name
                    }}
                  </td>
                  <td class="text-center">{{ couponPhoneNumber }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="
              beforeSubmitDialog = false
              submitCheckout()
            "
          >
            確認
          </v-btn>
          <v-btn color="primary" text @click="beforeSubmitDialog = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="returnPolicyDialog" persistent max-width="420">
      <v-card class="return-policy-dialog pa-4">
        <v-card-text class="text-center pb-2 pt-2">
          <div class="font-weight-bold black--text mb-2" style="font-size:20px">
            ⚠️ 尚未勾選同意事項
          </div>
          <div class="black--text" style="font-size:16px">
            您尚未勾選［我同意辦理退貨時，由團購網代為處理發票及銷貨退回證明單，以加速退貨退款作業］
          </div>
        </v-card-text>
        <v-card-actions class="justify-center pb-3 pt-1">
          <v-btn
            depressed
            color="primary"
            class="px-6"
            @click="agreeAndSubmit"
          >
            勾選並繼續
          </v-btn>
          <v-btn
            outlined
            color="primary"
            class="px-6"
            @click="directSubmit"
          >
            直接結帳
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="couponInfoDialog" persistent scrollable max-width="600">
      <v-card>
        <v-card-title>相揪來團購網消費，一起賺購物金</v-card-title>
        <v-card-text class="black--text pt-2">
          1.活動辦法:
          <br />
          *活動期間為2024月10月15日至2024年12月31日23:59。
          <br />
          *活動期間只要登入團購網進行消費，不限結帳金額，透過「輸入推薦人手機號碼」成功下訂，即送
          50 元全站購物金（使用限期一個月），推薦人與被推薦人均可各獲 50
          元購物金。每位會員能獲得一次 50
          元購物金，僅回饋第一位被推薦者，被推薦人可多次領取。
          <br />
          <br />
          2.活動權益說明:
          <br />
          *50元折價券視同50元購物金，可折抵團購網站上可被折抵全商品（手機、黃金、票券除外）
          <br />
          *被推薦人可獲得50元折價券沒有推薦次數限制。
          <br />
          *購買會員只有一次填寫推薦人活動機會，重複輸入推薦人的電話以第一筆訂單成功被推薦人為主。
          <br />
          *若搜尋不到推薦人手機號碼，可請推薦人於團購網中的會員資料>手機號碼欄位確認是否有填寫。
          <br />
          *折價券歸戶時間：透過「輸入推薦人手機號碼」成功下訂，待訂單成團，隔天早上7:30折價券自動歸戶。
          <br />
          <br />
          *此活動僅限以下公司別可參與:
          <br />
          統一企業、統昶行銷、統奕包裝、統一速邁、統一夢公園、統萬、統清、統流、德記洋行、太子建設、千禧之愛基金會。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="couponInfoDialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="remindRewardDialog"
      persistent
      scrollable
      max-width="450"
    >
      <v-card class="py-2">
        <v-card-text class="black--text text-center pt-3 pb-0">
          <div class="primary--text text-h5 font-weight-bold mb-4">
            <span
              class="pl-2"
              style="border-bottom: 2px solid var(--v-primary-base)"
            >
              電子折價券使用提醒！</span
            >
          </div>
          <div class="text-body-1">
            您尚有未使用之電子折價券，
            <br />
            如您欲使用折價券可點選<span class="primary--text">使用折價券</span
            >進行選擇使用，
            <br />
            敬請把握機會行使完畢，以免影響您的會員權益！
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            class="mr-3"
            @click="
              remindRewardDialog = false
              showRewardDialog('all')
            "
          >
            前往使用
          </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            class="ml-3"
            @click="
              remindRewardDialog = false
              submitCheckout()
            "
          >
            送出訂單
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="setCardAsDefaultDialog"
      persistent
      scrollable
      max-width="320"
    >
      <v-card class="rounded-lg">
        <v-card-title
          class="font-weight-bold primary--text justify-center mt-2 pb-2"
          >更改付款信用卡</v-card-title
        >
        <v-card-text class="black--text pb-0">
          <v-list three-line subheader class="pb-0">
            <v-radio-group v-model="radioGroup" class="mt-0" hide-details>
              <v-list-item
                v-for="(item, index) in cardArray"
                :key="index"
                class="text-left theme--light v-sheet--outlined mx-md-4 mb-4 rounded-lg"
              >
                <v-card-actions class="pl-0">
                  <v-radio
                    name="radioGroup"
                    :value="index"
                    @click="setCardAsDefault(item.cardId)"
                  ></v-radio>
                </v-card-actions>

                <v-list-item-content>
                  <v-list-item-title
                    class="mb-2 text--darken-1 font-weight-bold d-flex align-center"
                    style="min-height: 24px"
                  >
                    {{ item.issuerName }}
                    <v-chip
                      v-if="radioGroup == index"
                      class="ml-2"
                      color="secondary"
                      label
                      small
                    >
                      預設
                    </v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ item.maskedPan }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    {{ item.expiryDate }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-radio-group>
          </v-list>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between px-9 pb-7">
          <v-btn color="primary" block @click="setCardAsDefaultDialog = false">
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="selectOPWVersionDialog"
      persistent
      scrollable
      max-width="800"
    >
      <v-card>
        <v-card-title>請選擇您的OPENPOINT APP版本</v-card-title>
        <v-card-text>
          <v-chip-group
            v-if="showOPWChipGroup"
            column
            active-class="selected"
            v-model="OPWDigitalpaymentType"
          >
            <v-chip
              value="OPW"
              filter
              label
              outlined
              x-large
              style="border-width: 3px"
            >
              5.66 以下
            </v-chip>
            <v-chip
              value="OP_WALLET"
              filter
              label
              outlined
              x-large
              style="border-width: 3px"
            >
              5.66(含) 以上
            </v-chip>
          </v-chip-group>
          <v-alert text color="warning">
            因現為OPEN錢包新舊版本交替期間，請您先確認所使用的OPENPOINT
            APP版本，以利完成的付款。
          </v-alert>
          <v-expansion-panels class="mb-3" flat>
            <v-expansion-panel>
              <v-expansion-panel-header>版本查詢方式</v-expansion-panel-header>
              <v-expansion-panel-content class="text-body-1">
                <div class="d-flex flex-column" style="gap: 4px">
                  <div>
                    <span class="red--text"> 步驟一、 </span>
                    前往 OPENPOINT APP，點擊右下角會員中心。
                  </div>
                  <div>
                    <img src="/OPW_version_0.png" width="80%" alt="" />
                  </div>
                  <div class="pt-3">
                    <span class="red--text"> 步驟二、 </span>
                    下滑找到 APP 相關資訊區塊，展開後選取【版本資訊及螢幕設定】
                  </div>
                  <div>
                    <img src="/OPW_version_1.jpg" width="80%" alt="" />
                  </div>
                  <div>
                    <span class="red--text">步驟三、</span>
                    查看 APP 版本
                  </div>
                  <div>
                    <img src="/OPW_version_2.jpg" width="80%" alt="" />
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text @click="removeOPWPaymentType()">
            返回選擇其他付款方式
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="primary"
            :disabled="!OPWDigitalpaymentType"
            @click="submitCheckout()"
          >
            確定送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="twqrListDialog" scrollable max-width="600">
      <v-card>
        <v-card-title class="primary--text">
          團購網支援電支機構清單
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-4">
          <v-container>
            <v-row dense>
              <v-col v-for="src in logos" :key="src" cols="4" >
                <div class="d-flex justify-center align-center pa-2">
                  <img
                    :src="src"
                    width="100%"
                    style="max-width: 72px; height: auto"
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
          <div>
            * 行動裝置實際支援電支機構以中轉頁面顯示之清單為主</div>
          <div>
            * 更多資訊可參考TWQR官方網頁
            <a href="https://www.twqr.com.tw">https://www.twqr.com.tw</a>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="twqrListDialog = false">
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>
<script>
import { apiAxios } from '@/api'
import InvoInstruction from '@/components/InvoInstruction.vue'
import PaymentType1Content from '@/components/PaymentType1Content.vue'
import PaymentType2Content from '@/components/PaymentType2Content.vue'
import PaymentType3Content from '@/components/PaymentType3Content.vue'
import intersectionBy from 'lodash/intersectionBy'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import counties from '@/data/counties.js'
import zipcodes from '@/data/zipcodes.js'

export default {
  props: {
    breadcrumbs: { type: Array, default: () => [] },
    cartIdArray: { type: Array, default: () => [] },
    privateCheckoutId: { type: String, default: '' },
    deliveredInPerson: { type: Boolean, default: false },
    cartRewardArray: { type: Array, default: () => [] },
  },
  components: {
    InvoInstruction,
    PaymentType1Content,
    PaymentType2Content,
    PaymentType3Content,
    BackgroundSvg,
  },
  created() {
    if (localStorage.getItem('agreeReturnPolicy') === 'true') {
      this.agreeReturnPolicy = true
    }
    if (import.meta.env.VITE_PREVIEW_MODE === 'true') {
      this.isDevPreview = true
      return
    }
    this.counties = counties
    this.zipcodes = zipcodes
    this.updateCreditCardRadioGroup()
    this.getPresetPersonalInformation()
    this.getPresetInvoInfoInformation()
    this.getRewardAmountCond()
    if (!this.selfCartIdArray.length && this.privateCheckoutId == '') {
      this.$dialog.show('無結帳項目').then(() => this.$router.push('/cart'))
    } else if (!this.$store.state.profile.email) {
      this.$dialog
        .show('請先輸入基本資料')
        .then(() => this.$router.push('/profile'))
    } else {
      return Promise.resolve()
        .then(() => {
          if (this.privateCheckoutId) {
            return apiAxios({
              method: 'post',
              url: '/Checkout/GetPrivateCheckoutCartIdArray',
              data: {
                private_checkout_id: this.privateCheckoutId,
              },
            })
              .then(res => {
                this.selfCartIdArray = res.result.map(x => x.id)
                return Promise.all(
                  res.result.map(x =>
                    apiAxios({
                      method: 'post',
                      url: '/Product/GetProductV2',
                      params: { v: '2' },
                      data: {
                        product_id: x.product_id,
                      },
                    })
                  )
                )
              })
              .then(res => {
                this.receiveTypeArray = intersectionBy(
                  ...res.map(x => x.result[0].receive_type_array),
                  'value'
                )
                this.receiveAreaArray = intersectionBy(
                  ...res.map(x => x.result[0].receive_area_array),
                  'value'
                )
              })
          }
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Checkout/PreviewCheckout',
            data: {
              cart_id_array: this.selfCartIdArray,
            },
          })
        )
        .then(res => {
          this.checkoutItemArray = res.result.checkout_item_array || []
          this.categoryHasGold = this.checkoutItemArray
            .map(e => e.category_secondary_array)
            .some(e => e.includes('99'))
          this.commonPayments =
            this.checkoutItemArray[0].payment_tool_array.filter(payment =>
              this.checkoutItemArray.every(c =>
                c.payment_tool_array.some(
                  p => p.payment_tool === payment.payment_tool
                )
              )
            )

          if (this.checkoutItemArray.length) {
            this.checkoutItemArray = this.checkoutItemArray.map(e => {
              let rewardArray =
                this.cartRewardArray.find(x => x.type == e.id)?.reward || []
              let rewardPrice = rewardArray.reduce(
                (acc, cur) => acc + cur.qty * cur.reward_amount,
                0
              )
              e.discount_for_checkout_item = rewardPrice
              return e
            })
          }
          this.shipment = res.result.shipment
          // this.receiveType = res.result.checkout_item_array[0]?.receive_type
          // this.receiveTypeName =
          //   res.result.checkout_item_array[0]?.receive_type_name
        })
        .then(() => {
          this.isPaymentTypeLoading = true
          return apiAxios({
            method: 'post',
            url: '/Reward/GetUserRewardV2',
          }).then(res => {
            this.checkoutItemArray = this.checkoutItemArray.map(e => {
              e.reward_usable = []
              res.result.map(reward => {
                reward.include.map(include => {
                  if (
                    include.condition_key == 'ACTIVITY_TYPE' &&
                    e.activity_type_array.includes(include.condition_value)
                  ) {
                    e.reward_usable.push(JSON.parse(JSON.stringify(reward)))
                  }
                  if (
                    include.condition_key == 'CATEGORY_ID' &&
                    e.category_id_array.includes(include.condition_value)
                  ) {
                    e.reward_usable.push(JSON.parse(JSON.stringify(reward)))
                  }
                  if (
                    include.condition_key == 'PRODUCT_ID' &&
                    e.product_id == include.condition_value
                  ) {
                    e.reward_usable.push(JSON.parse(JSON.stringify(reward)))
                  }
                })
              })
              return e
            })
            this.rewardForAll = res.result.filter(e => !e.include.length)
          })
        })
        .then(() => {
          // 檢查是否輸入過推薦人
          return apiAxios({
            method: 'post',
            url: '/InviteColleagues/CheckRecommender',
          }).then(res => {
            this.alreadyInviteColleague = res.result == 'N' ? true : false
          })
        })
        .then(() => {
          this.getAndSetPaymentTypeArray()
          this.GA4_begin_checkout()
        })
        .finally(() => {
          this.isPaymentTypeLoading = false
        })
    }
  },
  watch: {
    useDefaultCreditCard() {
      if (!this.useDefaultCreditCard) {
        this.cardId = ''
      } else {
        if (this.cardArray.length > 0) {
          const activeItem = this.cardArray.find(
            item => item.cardId === this.defaultCardId
          )
          // 取出 cardId
          this.cardId = activeItem ? activeItem.cardId : ''
        }
      }
    },
    receiveArea() {
      if (this.receiveType) {
        return this.getAndSetPaymentTypeArray()
      }
    },
    receiveType() {
      if (this.receiveType) {
        return this.getAndSetPaymentTypeArray()
      }
    },
    personalInformation() {
      if (
        typeof this.personalInformation === 'object' &&
        !(this.personalInformation === null)
      ) {
        this.template = this.personalInformationArray.find(item => {
          return this.personalInformation.id === item.id
        })
        this.receiveAddress = this.template.receiveAddress
        this.county = this.template.county
        this.zipcode = this.template.zipcode
        this.receivePerson = this.template.receivePerson
        this.areaCode = this.template.areaCode
        this.localTelephone = this.template.localTelephone
        this.contactPhone = this.template.contactPhone
      }
    },
    invoInfoSelect() {
      if (
        typeof this.invoInfoSelect === 'object' &&
        !(this.invoInfoSelect === null)
      ) {
        this.preNo = this.invoInfoSelect.preNo
        this.preName = this.invoInfoSelect.preName
        this.invoAddress = this.invoInfoSelect.invoAddress
      } else {
        this.preNo = this.invoInfoSelect
      }
    },
    cardArray: {
      handler() {
        this.updateCheckboxStatus()
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      selfCartIdArray: this.cartIdArray,
      checkoutItemArray: [],
      paymentTypeArray: [],
      receiveTypeArray: [],
      receiveType: '',
      receiveAreaArray: [],
      receiveArea: '',
      receiveTypeName: '',
      breadcrumbs_: this.breadcrumbs,
      paymentType1Dialog: false,
      paymentType2Dialog: false,
      paymentType3Dialog: false,
      invoDialog: false,
      isProductLoading: false,
      isPaymentTypeLoading: true,
      isSubmitting: false,
      showAlert: false,
      receiveAddress: '',
      paymentType: '',
      digitalpaymentType: '',
      receivePerson: '',
      areaCode: '',
      localTelephone: '',
      contactPhone: '',
      memo: '',
      carrierId: this.$store.state.profile.carrier_id,
      invoType: '2',
      preNo: '',
      preName: '',
      invoAddress: '',
      shipment: 0,
      eppTenure: 3,
      openPersonalInformationDialog: false,
      openPersonalInformationListDialog: false,
      infoRadioGroup: null,
      countyRules: [v => !!v || '縣市 是必填項目'],
      zipcodeRules: [v => !!v || '鄉鎮市區 是必填項目'],
      addressRules: [v => !!v || '宅配地址 是必填項目'],
      contactPhoneRules: [v => !!v || '收件人電話 是必填項目'],
      receivePersonRules: [v => !!v || '收件人 是必填項目'],
      personalInformation: null,
      isSaveInfo: false,
      personalInformationArray: [],
      isNew: false,
      newPreset: false,
      template: {
        id: '',
        receivePerson: '',
        areaCode: '',
        localTelephone: '',
        contactPhone: '',
        receiveAddress: '',
        zipcode: null,
        preset: false,
        county: '',
      },
      counties: null,
      zipcodes: null,
      county: '',
      zipcode: null,
      rewardDialog: false,
      rewardArray: [],
      couponPhoneNumber: '',
      couponGifter: [],
      selectCouponGifter: '',
      beforeSubmitDialog: false,
      agreeReturnPolicy: false,
      returnPolicyDialog: false,
      isDevPreview: false,
      couponInfoDialog: false,
      alreadyInviteColleague: true,
      remindRewardDialog: false,
      invoInfoArray: [],
      invoInfoSelect: null,
      invoInRadioGroup: null,
      openPersonalInvoListDialog: false,
      openPersonalInvoDialog: false,
      isSaveInvo: false,
      isNewInvo: false,
      newInvoPreset: false,
      invoTemplate: {
        id: '',
        preNo: '',
        preName: '',
        invoAddress: '',
        preset: false,
      },
      rewardArray2: [],
      typeOfReward: '',
      rewardForAll: [],
      cardId: '',
      cardArray: [],
      useDefaultCreditCard: true,
      setCardAsDefaultDialog: false,
      radioGroup: null,
      defaultCardId: null,
      isVisible: false,
      rewardCondition: 0,
      categoryHasGold: false,
      commonPayments: [],
      selectOPWVersionDialog: false,
      OPWDigitalpaymentType: null,
      showOPWChipGroup: false,
      twqrListDialog: false,
      logos: [
        '/twqr/logo/ezPay.png',
        '/twqr/logo/icashPay.png',
        '/twqr/logo/iPassMoney.png',
        '/twqr/logo/台灣Pay.png',
        '/twqr/logo/悠遊付.png',
        '/twqr/logo/橘子支付.png',
        '/twqr/logo/歐付寶.png',
        '/twqr/logo/街口支付.png',
      ],
    }
  },
  computed: {
    shouldShowInterface() {
      if (this.digitalpaymentType == 2 && this.cardArray.length > 0) {
        return true
      }
      if (this.digitalpaymentType == 3) {
        const defaultCard = this.cardArray.find(
          card => card.cardId === this.defaultCardId
        )
        return defaultCard && defaultCard.issuerName === '國泰世華銀行'
      }
      return false
    },
    productTotalPrice() {
      return this.checkoutItemArray.reduce(
        (acc, cur) => acc + cur.order_num * cur.discount_price,
        0
      )
    },
    orderTotalPrice() {
      return (
        this.productTotalPrice +
        (this.receiveType == '2' || this.hasReceiveType2 ? this.shipment : 0)
      )
    },
    canEpp() {
      let unique = [...new Set(this.checkoutItemArray.map(x => x.product_id))]
      return (
        this.orderTotalPrice > 3000 &&
        (this.receiveType == '2' ||
          this.checkoutItemArray.every(x => x.receive_type == '2') ||
          unique.length === 1)
      )
    },
    paymentTool() {
      let paymentTool
      switch (this.digitalpaymentType) {
        // 因應新舊版 OP APP，OPW 的情況額外處理
        // case '0':
        //   paymentTool = 'OPW'
        //   break
        case '1':
          paymentTool = 'ICASH'
          break
        case '2':
          paymentTool = 'C0'
          break
        case '3':
          paymentTool = 'C2'
          break
        case '4':
          paymentTool = 'C0'
          break
        case 'TWQR':
          paymentTool = 'ICASH_PAY'
          break
        default:
          paymentTool = this.digitalpaymentType
      }
      return paymentTool
    },
    filterZipcodes() {
      if (this.county) {
        return this.zipcodes.filter(item => {
          return item.county === this.county
        })
      } else {
        return ['請先選擇城市']
      }
    },
    filterZipcodesTemplate() {
      if (this.template.county) {
        return this.zipcodes.filter(item => {
          return item.county === this.template.county
        })
      } else {
        return ['請先選擇城市']
      }
    },
    checkPreset() {
      if (this.template.id) {
        return this.personalInformationArray.find(item => {
          return this.template.id === item.id
        }).preset
      } else {
        return false
      }
    },
    checkInvoPreset() {
      if (this.invoTemplate.id) {
        return this.invoInfoArray.find(item => {
          return this.invoTemplate.id === item.id
        }).preset
      } else {
        return false
      }
    },
    totalAmountReached() {
      return this.rewardArray2
        .filter(x => x.qty > 0)
        .reduce((acc, cur) => acc + cur.amount_reached * cur.qty, 0)
    },
    totalRewardAmount() {
      return this.rewardArray2
        .filter(x => x.qty > 0)
        .reduce((acc, cur) => acc + cur.reward_amount * cur.qty, 0)
    },
    hasLimitReward() {
      return this.rewardArray2
        .filter(x => x.qty > 0)
        .some(x => x.product_reward_limit === 'Y')
    },
    isRewardDisabled() {
      return (
        this.productTotalPrice < this.totalAmountReached ||
        (this.hasLimitReward &&
          this.productRewardAmountLimit <
            this.rewardArray2
              .filter(x => x.qty > 0)
              .filter(x => x.product_reward_limit === 'Y')
              .reduce((acc, cur) => acc + cur.reward_amount * cur.qty, 0)) ||
        (this.hasLimitReward &&
          this.productRewardAmountLimit <
            this.rewardArray2
              .filter(x => x.qty > 0)
              .filter(x => x.product_reward_limit === 'Y')
              .reduce((acc, cur) => acc + cur.amount_reached * cur.qty, 0)) ||
        this.overRange ||
        this.checkoutItemArray.some(x => x.reward_exclude == 'Y')
      )
    },
    overRange() {
      return this.rewardArray2.some(e => e.qty > e.customer_rewards_count)
    },
    productRewardAmountLimit() {
      return this.checkoutItemArray.reduce(
        (acc, cur) => acc + cur.order_num * cur.reward_amount_limit,
        0
      )
    },
    hasReceiveType2() {
      return this.checkoutItemArray.some(x => x.receive_type == 2)
    },
    filteredPaymentTypeArray() {
      return (
        this.paymentTypeArray
          // 如果付款方式是貨到付款的，要檢查是否該結帳每張訂單都是宅配，都是才保留，否則就剃除
          .filter(x =>
            x.payment_type === '5'
              ? this.receiveType == '2' ||
                this.checkoutItemArray.every(x => x.receive_type == '2')
              : true
          )
          // 如果離職了，就只會有線上支付，如果在職就都有
          .filter(
            x => !this.$store.state.profile.quit_date || x.payment_type == '2'
          )
          // 檢查有宅配且也有取貨點取貨的話，就只會保留線上支付，否則就都會有
          .filter(x =>
            this.checkoutItemArray.some(x => x.receive_type == '1') &&
            this.hasReceiveType2
              ? x.payment_type === '2'
              : true
          )
      )
    },
    countOfReward() {
      return this.cartRewardArray
        .map(e => e.reward)
        .flat()
        .reduce((acc, cur) => acc + cur.qty, 0)
    },
    totalRewardAmount2() {
      // 總折扣
      return this.cartRewardArray
        .map(e => e.reward)
        .flat()
        .reduce((acc, cur) => acc + cur.reward_amount * cur.qty, 0)
    },
    isRewardDisabled2() {
      if (this.typeOfReward !== 'all') {
        let checkoutItem = this.checkoutItemArray.find(
          e => e.id == this.typeOfReward
        )
        // reward_exclude = 'Y' 單品不可以套用折價券
        let rewardExclude = checkoutItem?.reward_exclude == 'Y' ? true : false
        // 選擇的折價券數量已告罄
        let rewardOverUse = this.rewardArray2.some(
          e => e.qty + e.cum > e.customer_rewards_count
        )
        // 單品的金額 低於 滿額的金額限制，則不可套用
        let discountOverRange =
          this.totalAmountReached >
          checkoutItem?.discount_price * checkoutItem?.order_num
        // 檢查明細的折價券數量修正後，是否造成 amount_reached 總金額超過的情形
        let checkAmountReachedLimit = false
        if (this.cartRewardArray.find(x => x.type == 'all')) {
          let amountReachedForAll = this.cartRewardArray
            .filter(e => e.type == 'all')
            .map(e => e.reward)
            .flat()
            .filter(x => x.qty > 0)
            .reduce((acc, cur) => acc + cur.amount_reached * cur.qty, 0)
          let detailDiscountReached = this.cartRewardArray
            .filter(e => e.type !== 'all')
            .filter(e => e.type !== this.typeOfReward)
            .map(e => e.reward)
            .flat()
            .reduce((acc, cur) => acc + cur.qty * cur.amount_reached, 0)
          let currentDiscountReached = this.rewardArray2.reduce(
            (acc, cur) => acc + (cur.qty || 0) * cur.amount_reached,
            0
          )
          checkAmountReachedLimit =
            amountReachedForAll >
            this.productTotalPrice -
              detailDiscountReached -
              currentDiscountReached
        }

        return (
          rewardExclude ||
          rewardOverUse ||
          discountOverRange ||
          checkAmountReachedLimit ||
          this.invoType == 3
        )
      } else {
        let rewardExcludeTotalPrice = this.checkoutItemArray
          .filter(e => e.reward_exclude == 'Y')
          .reduce((acc, cur) => acc + cur.order_num * cur.discount_price, 0)
        // 總金額 低於 滿額的金額限制，則不可套用
        let discountOverRange =
          this.totalAmountReached >
          this.productTotalPrice -
            rewardExcludeTotalPrice -
            this.detailTotalDiscountReached
        return discountOverRange || this.invoType == 3
      }
    },
    detailTotalDiscountReached() {
      let detailUsedSum = 0
      if (this.cartRewardArray.length) {
        detailUsedSum = this.cartRewardArray
          .filter(e => e.type !== 'all')
          .map(e => e.reward)
          .flat()
          .reduce((acc, cur) => acc + cur.qty * cur.amount_reached, 0)
      }
      return detailUsedSum
    },
    totalPriceForDialog() {
      // 處理 rewardDialog footer 的總金額顯示
      if (this.typeOfReward !== 'all') {
        let checkoutItem = this.checkoutItemArray.find(
          e => e.id == this.typeOfReward
        )
        return checkoutItem
          ? checkoutItem.discount_price * checkoutItem.order_num
          : 0
      } else {
        return this.checkoutItemArray.reduce(
          (acc, cur) => acc + cur.discount_price * cur.order_num,
          0
        )
      }
    },
    rewardConCal() {
      return this.productTotalPrice >= this.rewardCondition
    },
    showIcashPayPayment() {
      return false
      let whiteList = [
        '11020106',
        '12040051',
        '11010160',
        '11010059',
        '11010148',
        '09075011',
        '07010013',
        '87094024',
        '11010065',
        'uniicp',
      ]
      if (
        this.$store.state.profile.company_id == '70486723' ||
        whiteList.includes(this.$store.state.profile.emp_no_s)
      ) {
        return true
      }
      return false
    },
    showLinePayPayment() {
      let whiteList = [
        '11020106',
        '12040051',
        '11010160',
        '11010059',
        '11010148',
        '09075011',
        '07010013',
        '87094024',
        '11010065',
        'unilinepay',
      ]
      if (whiteList.includes(this.$store.state.profile.emp_no_s)) {
        return true
      }
      return false
    },
    showOPWVersionDialog() {
      let whiteList = [
        '11020106',
        '12040051',
        '11010160',
        '11010059',
        '11010148',
        '09075011',
        '07010013',
        '87094024',
        '11010065',
        'uniopw1',
        'uniopw2',
        'uniopw3',
        'uniopw4',
        'uniopw5',
      ]
      if (whiteList.includes(this.$store.state.profile.emp_no_s)) {
        return true
      }
      return false
    },
  },
  methods: {
    updateCheckboxStatus() {
      const defaultCard = this.cardArray.find(
        card => card.cardId === this.defaultCardId
      )
      if (defaultCard && this.checkExpiry(defaultCard.expiryDate)) {
        this.useDefaultCreditCard = false // 過期時取消勾選
      } else {
        this.useDefaultCreditCard = true
      }
    },
    updateCreditCardRadioGroup() {
      return Promise.all([
        apiAxios({
          method: 'post',
          url: '/Users/GetUserProfile',
          data: {},
        }).then(res => {
          if (res.result[0]) {
            this.defaultCardId = res.result[0].default_card_id
            // console.log(res.result[0].default_card_id)
          }
        }),
        apiAxios({
          method: 'post',
          url: '/CreditCard/GetCardArray',
        }).then(res => {
          this.cardArray = res.result
        }),
      ]).then(() => {
        if (this.defaultCardId && this.cardArray.length > 0) {
          if (
            this.cardArray
              .map(item => {
                return item.cardId == this.defaultCardId
              })
              .indexOf(true) !== -1
          ) {
            this.radioGroup = this.cardArray
              .map(item => {
                return item.cardId == this.defaultCardId
              })
              .indexOf(true)
            const activeItem = this.cardArray.find(
              item => item.cardId === this.defaultCardId
            )
            // 取出 cardId
            this.cardId = activeItem ? activeItem.cardId : ''
          } else {
            this.setCardAsDefault(this.cardArray[0].cardId)
          }
        } else if (!this.defaultCardId > 0 && this.cardArray.length > 0) {
          this.setCardAsDefault(this.cardArray[0].cardId)
        }
      })
    },
    setCardAsDefault(cardId) {
      return apiAxios({
        method: 'post',
        url: '/CreditCard/SetCardAsDefault',
        data: {
          cardId,
        },
      }).then(() => {
        this.$snackbar.add('修改成功', { color: 'success' })
        this.updateCreditCardRadioGroup()
      })
    },
    formattedNumber(expiryDate) {
      if (!expiryDate) {
        return ''
      }
      const numberStr = expiryDate.toString().padStart(4, '0')
      return numberStr.slice(0, 2) + '/' + numberStr.slice(2)
    },
    checkPreNo(v) {
      const inputValue = (() => {
        if (v === null || v === undefined) {
          return ''
        } else if (typeof v === 'object' && v.preNo) {
          return v.preNo.toString()
        } else if (typeof v === 'string') {
          return v
        } else {
          return v.toString()
        }
      })()

      if (inputValue.length !== 8) {
        return false
      }

      let arr = [1, 2, 1, 2, 1, 2, 4, 1]
      let sum = (inputValue || '')
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
      } else if (inputValue[6] == '7' && (sum + 1) % 5 === 0) {
        return true
      } else {
        return false
      }
    },
    getAndSetPaymentTypeArray() {
      return apiAxios({
        method: 'post',
        url: '/Checkout/GetPaymentTypeArrayV2',
        data: {
          cart_id_array: this.selfCartIdArray,
          receive_area:
            this.privateCheckoutId && this.receiveType == '1'
              ? this.receiveArea
              : '',
          receive_type: this.privateCheckoutId ? this.receiveType : '',
        },
      }).then(res => {
        this.paymentTypeArray = intersectionBy(...res.result, 'payment_type')
      })
    },
    beforeSubmit() {
      if (!this.agreeReturnPolicy) {
        this.returnPolicyDialog = true
        return
      }
      this.proceedSubmit()
    },
    proceedSubmit() {
      let checkRewardLimitRatio = this.checkoutItemArray.some(
        e => e.reward_amount_limit_ratio > 0
      )
      let hasDetailReward = this.checkoutItemArray.some(
        e => e.reward_usable.length && !e.discount_for_checkout_item
      )
      let hasAllReward =
        this.rewardForAll.length &&
        !this.cartRewardArray.find(e => e.type == 'all')

      let hasRewardNoUse = false
      if (hasDetailReward || hasAllReward) {
        hasRewardNoUse = true
      }

      let hasRewardExcludeN = this.checkoutItemArray.some(
        e => e.reward_exclude == 'N'
      )

      let needRemind =
        hasRewardNoUse &&
        (this.totalRewardAmount2 == 0 ? true : false) &&
        checkRewardLimitRatio &&
        this.invoType != 3 &&
        hasRewardExcludeN

      if (this.selectCouponGifter) {
        this.beforeSubmitDialog = true
      } else if (needRemind) {
        this.remindRewardDialog = true
      } else {
        return this.submitCheckout()
      }
    },
    onAgreeReturnPolicyChange(val) {
      if (val) {
        localStorage.setItem('agreeReturnPolicy', 'true')
      }
    },
    agreeAndSubmit() {
      this.agreeReturnPolicy = true
      localStorage.setItem('agreeReturnPolicy', 'true')
      this.returnPolicyDialog = false
      this.proceedSubmit()
    },
    directSubmit() {
      this.returnPolicyDialog = false
      this.proceedSubmit()
    },
    removeOPWPaymentType() {
      // 須使用 v-if 強制關閉選擇 OPEN 版本的 group chip，否則無法 set OPWDigitalpaymentType 為 null
      this.showOPWChipGroup = false
      this.OPWDigitalpaymentType = null
      this.selectOPWVersionDialog = false
    },
    submitCheckout() {
      // 外層付款工具選擇 OPEN錢包，並且尚未選擇 OPEN錢包版本資料時，跳出選擇版本的 dialog
      if (
        this.digitalpaymentType == 'OPW' &&
        !this.OPWDigitalpaymentType &&
        this.showOPWVersionDialog
      ) {
        this.showOPWChipGroup = true
        this.selectOPWVersionDialog = true
        return
      }

      // 變數 OPWDigitalpaymentType(OPEN錢包版本資料) 有值時，paymentTool 帶入其值
      let finalPaymentTool = this.OPWDigitalpaymentType
        ? this.OPWDigitalpaymentType
        : this.paymentTool

      if (this.$refs['textFieldForFocus']) {
        this.$refs.textFieldForFocus.focus()
      }
      setTimeout(() => {
        if (this.$refs.form.validate()) {
          return this.$nextTick().then(() => {
            let newReceivePerson
            this.isSubmitting = true

            if (
              (this.receiveType == '2' || this.hasReceiveType2) &&
              !this.deliveredInPerson
            ) {
              if (!(this.localTelephone || this.contactPhone)) {
                this.$snackbar.add(`手機或市話請選填一項`, { color: 'primary' })
                this.isSubmitting = false
                return
              } else {
                if (this.localTelephone) {
                  if (this.areaCode) {
                    if (isNaN(this.areaCode)) {
                      this.$snackbar.add(`市話區碼必須為數字`, {
                        color: 'primary',
                      })
                      this.isSubmitting = false
                      return
                    } else {
                      if (this.areaCode.length !== 2) {
                        this.$snackbar.add(`市話區碼必須為兩碼`, {
                          color: 'primary',
                        })
                        this.isSubmitting = false
                        return
                      }
                    }
                  } else {
                    this.$snackbar.add(`市話缺少區碼`, { color: 'primary' })
                    this.isSubmitting = false
                    return
                  }
                }
              }

              if (typeof this.personalInformation === 'object') {
                newReceivePerson = this.personalInformation.receivePerson
              } else {
                newReceivePerson = this.personalInformation
              }

              if (this.isSaveInfo === true) {
                if (this.personalInformationArray.length <= 0) {
                  this.newPreset = true
                } else {
                  this.newPreset = false
                }
                apiAxios({
                  method: 'post',
                  url: '/Address/InsertAddress',
                  data: {
                    zipcode: this.zipcode,
                    id: 0,
                    receivePerson: newReceivePerson,
                    areaCode: this.areaCode,
                    localTelephone: this.localTelephone,
                    contactPhone: this.contactPhone,
                    receiveAddress: this.receiveAddress,
                    county: this.county,
                    preset: this.newPreset ? 'Y' : 'N',
                  },
                }).then(res => {
                  // console.log('insert', res)
                  this.$snackbar.add(res.message, { color: 'success' })
                })
              }
            }
            if (this.isSaveInvo === true) {
              if (this.invoInfoArray.length <= 0) {
                this.newInvoPreset = true
              } else {
                this.newInvoPreset = false
              }
              apiAxios({
                method: 'post',
                url: '/UserInvoInfo/InsertInvoInfo',
                data: {
                  id: 0,
                  preNo: this.preNo,
                  preName: this.preName,
                  invoAddress: this.invoAddress,
                  preset: 'Y',
                },
              }).then(res => {
                this.$snackbar.add(res.message, { color: 'success' })
              })
            }

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

            if (this.deliveredInPerson) {
              this.receiveAddress = '專人親送'
              newReceivePerson = '專人親送'
              this.contactPhone = '專人親送'
            } else if (this.receiveType == '2' || this.hasReceiveType2) {
              this.receiveAddress = `${this.zipcode.zipcode}${this.county}${this.zipcode.city}${this.receiveAddress}`
            }
            return apiAxios({
              method: 'post',
              url: '/Checkout/SubmitCheckout',
              data: {
                receive_type: this.receiveType,
                receive_area:
                  this.receiveType == '1' ||
                  this.checkoutItemArray.some(x => x.receive_type == '1')
                    ? this.receiveArea
                    : '',
                receive_address:
                  this.receiveType == '2' || this.hasReceiveType2
                    ? this.receiveAddress
                    : '',
                receive_person:
                  this.receiveType == '2' || this.hasReceiveType2
                    ? newReceivePerson
                    : '',
                local_telephone:
                  (this.receiveType == '2' || this.hasReceiveType2) &&
                  this.areaCode &&
                  this.localTelephone
                    ? `${this.areaCode}-${this.localTelephone}`
                    : '',
                contact_phone:
                  (this.receiveType == '2' || this.hasReceiveType2) &&
                  this.contactPhone
                    ? `${this.contactPhone.slice(
                        0,
                        -6
                      )}-${this.contactPhone.slice(-6)}`
                    : '',
                memo: this.memo,
                payment_type: this.paymentType,
                payment_tool: this.paymentType == '2' ? finalPaymentTool : '',
                invo_type: this.invoType,
                carrier_id: this.invoType == '2' ? this.carrierId : '',
                pre_no: this.invoType == '3' ? this.preNo : '',
                pre_name: this.invoType == '3' ? this.preName : '',
                invo_address: this.invoType == '3' ? this.invoAddress : '',
                checkout_item_array: this.selfCartIdArray.map(x => ({ id: x })),
                epp_tenure:
                  this.paymentType == '2' && this.paymentTool == 'C2'
                    ? this.eppTenure
                    : '',
                private_checkout_id: this.privateCheckoutId,
                zipcode:
                  this.receiveType == '2' || this.hasReceiveType2
                    ? this.zipcode.zipcode
                    : null,
                // reward_array: this.rewardArray.map(x => ({
                //   reward_id: x.id,
                //   ...x,
                // })),
                reward_array: this.cartRewardArray.flatMap(x =>
                  x.reward.map(y => ({
                    cart_id: x.type === 'all' ? null : x.type,
                    reward_id: y.id,
                    qty: y.qty,
                  }))
                ),
                recommend_emp_no: this.selectCouponGifter
                  ? this.selectCouponGifter
                  : null,
                card_id: this.cardId,
              },
            })
              .then(res => {
                if (res.result.checkout_id) {
                  this.$snackbar.add('訂單送出成功', { color: 'success' })
                  this.$router.push({
                    name: 'CheckoutResult',
                    params: {
                      checkoutId: res.result.checkout_id,
                      needPayment:
                        this.paymentType == '2' &&
                        this.orderTotalPrice - this.totalRewardAmount2 > 0,
                    },
                  })
                  apiAxios({
                    method: 'post',
                    url: '/Cart/GetCartItemArray',
                  }).then(res => {
                    this.$store.commit('setCartCount', res.result.length)
                  })
                } else {
                  this.$dialog.show(res.result.violationArray[0].error_message)
                }
              })
              .finally(() => (this.isSubmitting = false))
          })
        } else {
          return this.$nextTick().then(() => {
            const el = this.$el.querySelector(
              '.v-messages.error--text:first-of-type'
            )
            this.$vuetify.goTo(el, { offset: 120 })
          })
        }
      }, 200)
    },
    resetInfo() {
      this.personalInformation = ''
      this.receiveAddress = ''
      this.county = ''
      this.zipcode = ''
      this.receivePerson = ''
      this.areaCode = ''
      this.localTelephone = ''
      this.contactPhone = ''
      this.$refs.form.resetValidation()
    },
    resetInvo() {
      this.invoInfoSelect = ''
      this.preName = ''
      this.invoAddress = ''
      this.$refs.form.resetValidation()
    },
    clearTemplate() {
      this.template = {
        id: '',
        receivePerson: '',
        areaCode: '',
        localTelephone: '',
        contactPhone: '',
        receiveAddress: '',
        county: '',
        zipcode: '',
        preset: false,
      }
      if (this.$refs['infoDialogForm'] !== undefined) {
        this.$refs.infoDialogForm.resetValidation()
      }
    },
    clearInvoTemplate() {
      this.invoTemplate = {
        preNo: '',
        preName: '',
        invoAddress: '',
        preset: false,
      }
      if (this.$refs['infoDialogForm'] !== undefined) {
        this.$refs.infoDialogForm.resetValidation()
      }
    },
    updatePersonalInformation() {
      if (this.$refs.infoDialogForm.validate()) {
        if (this.isNew === true) {
          /* 新增 */
          if (this.newPreset == false && this.template.preset) {
            this.personalInformationArray.forEach(item => {
              item.preset = false
            })
          }
          apiAxios({
            method: 'post',
            url: '/Address/InsertAddress',
            data: {
              zipcode: this.template.zipcode || {},
              id: 0,
              receivePerson: this.template.receivePerson,
              areaCode: this.template.areaCode,
              localTelephone: this.template.localTelephone,
              contactPhone: this.template.contactPhone,
              receiveAddress: this.template.receiveAddress,
              county: this.template.county,
              preset: this.template.preset ? 'Y' : 'N',
            },
          }).then(res => {
            // console.log('insert-new', res)
            if (res.status == 2) {
              this.$snackbar.add(res.message, { color: 'primary' })
              this.getPresetPersonalInformation()
            } else {
              this.$snackbar.add(res.message, { color: 'success' })
              this.getPresetPersonalInformation()
            }
          })
        } else {
          /* 編輯 */
          apiAxios({
            method: 'post',
            url: '/Address/InsertAddress',
            data: {
              zipcode: this.template.zipcode || {},
              id: this.template.id,
              receivePerson: this.template.receivePerson,
              areaCode: this.template.areaCode,
              localTelephone: this.template.localTelephone,
              contactPhone: this.template.contactPhone,
              receiveAddress: this.template.receiveAddress,
              county: this.template.county,
              preset: this.template.preset ? 'Y' : 'N',
            },
          }).then(res => {
            // console.log('insert-updata', res)
            if (res.status == 2) {
              this.$snackbar.add(res.message, { color: 'primary' })
              this.getPresetPersonalInformation()
            } else {
              this.$snackbar.add(res.message, { color: 'success' })
              this.getPresetPersonalInformation()
            }
          })
        }
        this.openPersonalInformationDialog = false
      }
    },
    openPersonalInformation(isNew, personalItem) {
      this.openPersonalInformationDialog = true
      if (isNew === true) {
        this.isNew = true
        this.clearTemplate()
        if (this.personalInformationArray.length <= 0) {
          this.newPreset = true
          this.template.preset = true
        } else {
          this.newPreset = false
        }
      } else {
        this.isNew = false
        this.template = Object.assign({}, personalItem)
      }
    },
    delPersonalInformation(personalItem) {
      if (
        !(
          personalItem.preset == true &&
          this.personalInformationArray.length >= 2
        )
      ) {
        this.clearTemplate()
        this.resetInfo()
        apiAxios({
          method: 'post',
          url: '/Address/DeleteAddress',
          data: {
            id: personalItem.id,
          },
        }).then(res => {
          // console.log('del', res)
          if (res.status == 2) {
            this.$snackbar.add(res.message, { color: 'primary' })
            this.getPresetPersonalInformation()
          } else {
            this.$snackbar.add(res.message, { color: 'success' })
            this.getPresetPersonalInformation()
          }
        })
      } else {
        alert('請先更換預設地址')
      }
    },
    getPresetPersonalInformation() {
      apiAxios({
        method: 'post',
        url: '/Address/GetAddress',
        data: {},
      }).then(res => {
        // console.log('get', res.result)
        this.personalInformationArray = res.result
        if (this.personalInformationArray.length > 0) {
          this.personalInformationArray.forEach(item => {
            item.preset = !!item.preset
          })
          this.updateRadioGroup()
        }
      })
    },
    changeInfoPreset(item) {
      apiAxios({
        method: 'post',
        url: '/Address/InsertAddress',
        data: {
          zipcode: item.zipcode || {},
          id: item.id,
          receivePerson: item.receivePerson,
          areaCode: item.areaCode,
          localTelephone: item.localTelephone,
          contactPhone: item.contactPhone,
          receiveAddress: item.receiveAddress,
          county: item.county,
          preset: 'Y',
        },
      }).then(res => {
        // console.log('insert-changeInfoPreset', res)
        this.$snackbar.add(res.message, { color: 'success' })
        this.getPresetPersonalInformation()
      })
    },
    updateRadioGroup() {
      this.infoRadioGroup = this.personalInformationArray
        .map(item => {
          return item.preset
        })
        .indexOf(true)
      this.template = this.personalInformationArray.find(item => {
        return item.preset == true
      })
      this.personalInformation = Object.assign({}, this.template)
      this.receiveAddress = this.template.receiveAddress
      this.county = this.template.county
      this.zipcode = this.template.zipcode
      this.receivePerson = this.template.receivePerson
      this.areaCode = this.template.areaCode
      this.localTelephone = this.template.localTelephone
      this.contactPhone = this.template.contactPhone
    },
    showRewardDialog(params) {
      let rewardForDialog = []
      if (params === 'all') {
        this.typeOfReward = 'all'
        rewardForDialog = this.rewardForAll
      } else {
        this.typeOfReward = params.id
        rewardForDialog = params.reward_usable
      }

      let tempId = this.cartRewardArray.findIndex(
        e => e.type == this.typeOfReward
      )
      let tempData = tempId >= 0 ? this.cartRewardArray[tempId].reward : []
      let tempForCumulate = this.cartRewardArray
        .filter(e => e.type !== this.typeOfReward)
        .map(e => e.reward)
        .flat()
        .map(e => ({
          id: e.id,
          qty: e.qty,
        }))
      this.rewardArray2 = rewardForDialog.map(e => {
        let cumulate = tempForCumulate.filter(elem => elem.id == e.id)
        e.cum = cumulate.length
          ? cumulate.reduce((acc, cur) => acc + cur.qty, 0)
          : 0
        let temp = tempData.find(x => x.id === e.id)
        return temp ? { ...e, ...temp, cum: e.cum } : { ...e, qty: 0 }
      })

      this.rewardDialog = true
    },
    add(record) {
      if (record.customer_rewards_count > record.qty) {
        record.qty = record.qty + 1
      }
    },
    remove(record) {
      if (record.qty > 0) {
        record.qty = record.qty - 1
      }
    },
    confirmRewardDialog() {
      let tempId = this.cartRewardArray.map(e => e.type)
      // 在 cartRewardArray 已有此 id 紀錄時，編輯資料
      if (tempId.includes(this.typeOfReward)) {
        let id = this.cartRewardArray.findIndex(
          e => e.type == this.typeOfReward
        )
        // 存入 qty > 0 的 reward 資料
        if (this.rewardArray2.filter(e => e.qty > 0).length) {
          this.cartRewardArray[id].reward = this.rewardArray2.filter(
            e => e.qty > 0
          )
        } else {
          // 若 reward qty 皆為 0，刪除此 id 折價券紀錄
          this.cartRewardArray.splice(id, 1)
        }
      } else {
        // cartRewardArray 未有此 id 紀錄時，新增資料
        this.cartRewardArray.push({
          type: this.typeOfReward,
          reward: this.rewardArray2.filter(e => e.qty > 0),
        })
      }

      // 編輯畫面上的折扣資料
      if (this.typeOfReward !== 'all') {
        this.checkoutItemArray.filter(
          e => e.id == this.typeOfReward
        )[0].discount_for_checkout_item = this.rewardArray2.reduce(
          (acc, cur) => acc + cur.qty * cur.reward_amount,
          0
        )
      }

      this.rewardDialog = false
    },
    cancelRewardDialog() {
      this.rewardArray2 = []
      this.rewardDialog = false
    },
    searchCouponPhone() {
      return apiAxios({
        method: 'post',
        url: '/Users/GetRewardReceiver',
        data: {
          phone_number: this.couponPhoneNumber,
        },
      }).then(res => {
        if (
          res.message &&
          res.message == '無法贈與自己折價券，請重新輸入手機號碼'
        ) {
          this.$snackbar.add('推薦人不能是自己', {
            timeout: 2000,
          })
          this.selectCouponGifter = ''
        } else if (
          res.message &&
          res.message == '查無此人，請重新輸入手機號碼'
        ) {
          this.$snackbar.add('您的推薦者不是團購網會員，無法成為您的推薦者', {
            timeout: 2000,
          })
          this.selectCouponGifter = ''
        } else {
          this.couponGifter = res.result
          if (this.couponGifter.length == 1) {
            this.selectCouponGifter = this.couponGifter[0].username
          }
          this.$snackbar.add('成功取得推薦人列表', {
            color: 'success',
            timeout: 2000,
          })
        }
      })
    },
    updateInvoInformation() {
      if (this.$refs.invoDialogForm.validate()) {
        if (this.isNewInvo === true) {
          /* 新增 */
          if (this.newInvoPreset == false && this.invoTemplate.preset) {
            this.invoInfoArray.forEach(item => {
              item.preset = false
            })
          }
          apiAxios({
            method: 'post',
            url: '/UserInvoInfo/InsertInvoInfo',
            data: {
              id: 0,
              preNo: this.invoTemplate.preNo,
              preName: this.invoTemplate.preName,
              invoAddress: this.invoTemplate.invoAddress,
              preset: this.invoTemplate.preset ? 'Y' : 'N',
            },
          }).then(res => {
            if (res.status == 2) {
              this.$snackbar.add(res.message, { color: 'primary' })
              this.getPresetInvoInfoInformation()
            } else {
              this.$snackbar.add(res.message, { color: 'success' })
              this.getPresetInvoInfoInformation()
            }
          })
        } else {
          /* 編輯 */
          apiAxios({
            method: 'post',
            url: '/UserInvoInfo/InsertInvoInfo',
            data: {
              id: this.invoTemplate.id,
              preNo: this.invoTemplate.preNo,
              preName: this.invoTemplate.preName,
              invoAddress: this.invoTemplate.invoAddress,
              preset: this.invoTemplate.preset ? 'Y' : 'N',
            },
          }).then(res => {
            // console.log('insert-updata', res)
            if (res.status == 2) {
              this.$snackbar.add(res.message, { color: 'primary' })
              this.getPresetInvoInfoInformation()
            } else {
              this.$snackbar.add(res.message, { color: 'success' })
              this.getPresetInvoInfoInformation()
            }
          })
        }
        this.openPersonalInvoDialog = false
      }
    },
    openInvoInformation(isNewInvo, InvoItem) {
      this.openPersonalInvoDialog = true
      if (isNewInvo === true) {
        this.isNewInvo = true
        this.clearInvoTemplate()
        if (this.invoInfoArray.length <= 0) {
          this.newInvoPreset = true
          this.invoTemplate.preset = true
        } else {
          this.newInvoPreset = false
        }
      } else {
        this.isNewInvo = false
        this.invoTemplate = Object.assign({}, InvoItem)
      }
    },
    delInvoInfoInformation(item) {
      if (!(item.preset == true && this.invoInfoArray.length >= 2)) {
        this.clearInvoTemplate()
        apiAxios({
          method: 'post',
          url: '/UserInvoInfo/DeleteInvoInfo',
          data: {
            id: item.id,
          },
        }).then(res => {
          if (res.status == 2) {
            this.$snackbar.add(res.message, { color: 'primary' })
            this.getPresetInvoInfoInformation()
          } else {
            this.$snackbar.add(res.message, { color: 'success' })
            this.getPresetInvoInfoInformation()
          }
        })
      } else {
        alert('請先更換預設項目')
      }
    },
    getPresetInvoInfoInformation() {
      apiAxios({
        method: 'post',
        url: '/UserInvoInfo/GetInvoInfo',
        data: {},
      }).then(res => {
        this.invoInfoArray = res.result
        if (this.invoInfoArray.length > 0) {
          this.invoInfoArray.forEach(item => {
            item.preset = item.preset == 'Y' ? true : false
          })
          this.updateInvoInfoRadioGroup()
        }
      })
    },
    changeInvoPreset(item) {
      apiAxios({
        method: 'post',
        url: '/UserInvoInfo/InsertInvoInfo',
        data: {
          id: item.id,
          preNo: item.preNo,
          preName: item.preName,
          invoAddress: item.invoAddress,
          preset: 'Y',
        },
      }).then(res => {
        this.$snackbar.add(res.message, { color: 'success' })
        this.getPresetInvoInfoInformation()
      })
    },
    updateInvoInfoRadioGroup() {
      this.invoInRadioGroup = this.invoInfoArray
        .map(item => {
          return item.preset
        })
        .indexOf(true)
      this.invoInfoSelect = this.invoInfoArray[this.invoInRadioGroup]
      this.preNo = this.invoInfoArray[this.invoInRadioGroup].preNo
      this.preName = this.invoInfoArray[this.invoInRadioGroup].preName
      this.invoAddress = this.invoInfoArray[this.invoInRadioGroup].invoAddress
    },
    checkExpiry(expiryDate) {
      const month = parseInt(expiryDate.slice(0, 2), 10)
      const year = parseInt(expiryDate.slice(2), 10) + 2000
      const expiryThreshold = new Date(year, month, 1) // 下個月的第一天
      const currentDate = new Date()
      return currentDate >= expiryThreshold
    },
    getRewardAmountCond() {
      return apiAxios({
        method: 'post',
        url: '/Profile/GetRewardAmountCond',
      }).then(res => {
        if (res.result[0]) {
          this.rewardCondition = res.result[0].profile_comments
        }
      })
    },
    GA4_begin_checkout() {
      let beginCheckoutItem = []
      for (let i = 0; i < this.checkoutItemArray.length; i++) {
        beginCheckoutItem.push({
          item_id: this.checkoutItemArray[i].product_id,
          item_name: this.checkoutItemArray[i].product_name,
          affiliation: '',
          coupon: '',
          currency: 'TWD',
          discount: 0,
          index: 0,
          item_brand: '',
          item_category: '',
          item_category2: '',
          item_category3: '',
          item_category4: '',
          item_category5: '',
          item_list_id: '',
          item_list_name: '',
          item_variant: this.checkoutItemArray[i].spec_name,
          location_id: '',
          price: this.checkoutItemArray[i].discount_price,
          quantity: this.checkoutItemArray[i].order_num,
        })
      }
      window.dataLayer.push({ ecommerce: null })
      this.$gtm.trackEvent({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'TWD',
          value:
            this.orderTotalPrice -
            (this.rewardDialog ? 0 : this.totalRewardAmount2),
          items: beginCheckoutItem,
        },
      })
    },
  },
}
</script>
<style scoped>
.areaCode {
  position: relative;
}
.areaCode::before {
  position: absolute;
  display: block;
  content: '-';
  top: 7px;
  right: -14px;
}
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
.v-list-item__content,
.v-list-item__icon {
  cursor: auto;
}
.gift-input {
  border-top-right-radius: unset;
  border-bottom-right-radius: unset;
}
.gift-btn {
  border-left-width: 0;
  height: 40px !important;
  border-top-left-radius: unset;
  border-bottom-left-radius: unset;
  border-color: var(--v-secondary-base) !important;
}
.return-policy-box {
  background-color: #f5f5f5;
  border: 2px solid var(--v-primary-base);
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.return-policy-box--checked {
  background-color: #ffebee;
}
</style>
