<template>
  <div class="pa-1">
    <section v-show="!isCartLoading">
      <v-skeleton-loader
        v-if="isExtraPurchaseLoading"
        type="list-item-three-line"
      ></v-skeleton-loader>
      <div v-if="!isExtraPurchaseLoading">
        <div v-if="tabItems.length" class="mt-1">
          <div class="d-flex justify-space-between align-center">
            <v-tabs v-model="extraPurchaseTab" color="primary">
              <v-tab v-for="(item, i) in tabItems" :key="i">
                {{ item.text }}
                <v-icon size="16" class="ml-1">{{ item.icon }}</v-icon>
              </v-tab>
            </v-tabs>
            <a
              class="text-decoration-none"
              :class="
                extraPurchaseTab !== null &&
                tabItems[extraPurchaseTab]?.text == '推薦商品'
                  ? 'cart-picks'
                  : 'cart-deals'
              "
            >
              <v-btn
                color="primary"
                elevation="0"
                small
                @click.stop="moreSpcloff(0)"
              >
                查看更多
              </v-btn>
            </a>
          </div>
          <v-tabs-items v-model="extraPurchaseTab">
            <v-tab-item v-for="(item, i) in tabItems" :key="i">
              <div class="mt-3 mb-1">
                <ExtraPurchase
                  :product-array="item.products"
                  :add-on="item.isAddOn"
                  :extra-purchase-tab="extraPurchaseTab"
                  @moreSpcloff="moreSpcloff"
                  @showSheet="showSheet"
                ></ExtraPurchase>
              </div>
            </v-tab-item>
          </v-tabs-items>

          <v-progress-linear value="100" color="secondary"></v-progress-linear>
        </div>
        <div v-else>
          <v-progress-linear value="100"></v-progress-linear>
        </div>
      </div>
    </section>

    <v-skeleton-loader
      v-if="isCartLoading"
      type="list-item-three-line"
    ></v-skeleton-loader>
    <template v-else-if="cartItemArray.length === 0">
      <v-alert prominent text type="warning" class="mt-4">
        <div class="d-flex justify-space-between align-center">
          <span> 購物車沒有品項 </span>
          <v-btn color="warning" outlined to="/">立即選購</v-btn>
        </div>
      </v-alert>
    </template>
    <template v-else>
      <div class="mt-4 text-center">
        <v-btn
          text
          color="primary"
          v-if="violationArray.length > 0"
          @click="removeInvalidCartItem"
        >
          移除所有失效商品
        </v-btn>
      </div>
      <v-card
        class="mt-4"
        outlined
        v-for="(filtedCartItemArray, key) in groupByObject"
        :key="key"
      >
        <h6 class="d-flex align-center text-h6 pa-1 mt-2">
          <v-checkbox
            class="mt-0"
            hide-details
            :indeterminate="
              filtedCartItemArray
                .filter(x => !x.invalid)
                .some(x => selectedIdArray.includes(x.id)) &&
              !filtedCartItemArray
                .filter(x => !x.invalid)
                .every(x => selectedIdArray.includes(x.id))
            "
            :input-value="
              filtedCartItemArray.every(x => selectedIdArray.includes(x.id))
            "
            @change="
              v =>
                setSelectedIdArray(
                  filtedCartItemArray.filter(x => !x.invalid).map(x => x.id),
                  v
                )
            "
            :disabled="spcloffGroupCheckboxValid(filtedCartItemArray)"
          ></v-checkbox>
          <div v-if="filtedCartItemArray[0].receive_type == '1'">
            {{ filtedCartItemArray[0].receive_area_name }}
          </div>
          <div
            class="d-flex align-center"
            v-if="
              filtedCartItemArray[0].receive_type == '2' &&
              filtedCartItemArray[0].cart_group_id == '0'
            "
          >
            <span class="black--text">{{
              filtedCartItemArray[0].cart_group_name
            }}</span>
            <v-chip label color="primary" class="ml-2">免運專區</v-chip>
          </div>
          <div
            class="d-flex align-center"
            v-if="
              filtedCartItemArray[0].receive_type == '2' &&
              filtedCartItemArray[0].cart_group_id != '0'
            "
            @click="toCartGroup(filtedCartItemArray[0].cart_group_id)"
          >
            <span class="black--text">{{
              filtedCartItemArray[0].cart_group_name
            }}</span>
            <v-chip label link color="primary" class="ml-2">活動專區</v-chip>
            <v-img
              class="ml-2 flex-grow-0"
              src="/pointer.png"
              width="24"
            ></v-img>
          </div>
          <v-img
            v-if="
              !(
                filtedCartItemArray[0].receive_type == '2' &&
                filtedCartItemArray[0].cart_group_id == '0'
              )
            "
            src="/chevron_right.svg"
            eager
            max-width="12"
            class="ml-1"
          ></v-img>
        </h6>
        <v-divider class="my-2"></v-divider>
        <div class="pa-1">
          <div
            class="mb-2 pa-1"
            v-for="cartItem in filtedCartItemArray"
            :key="cartItem.id"
            style="position: relative"
          >
            <div class="d-flex align-start">
              <v-overlay absolute :value="cartItem.invalid">失效 </v-overlay>
              <div class="d-flex align-center">
                <div v-if="cartItem.invalid" class="px-4"></div>
                <v-checkbox
                  v-else
                  class="mt-0"
                  hide-details
                  :value="cartItem.id"
                  v-model="selectedIdArray"
                  @change="changeDetailRewardStatus()"
                  :disabled="spcloffCheckboxValid(cartItem.is_spcloff_product)"
                ></v-checkbox>
                <v-img
                  aspect-ratio="1"
                  class="flex-grow-0"
                  width="60px"
                  :src="cartItem.img_url"
                  contain
                  style="cursor: pointer"
                  @click="
                    toProduct(cartItem.product_id, cartItem.is_spcloff_product)
                  "
                ></v-img>
              </div>
              <div
                class="d-flex flex-column justify-space-between flex-grow-1 px-2 py-1"
              >
                <div>
                  <div
                    class="product-name"
                    style="cursor: pointer"
                    @click="
                      toProduct(
                        cartItem.product_id,
                        cartItem.is_spcloff_product
                      )
                    "
                  >
                    <v-chip
                      v-if="cartItem.is_spcloff_product == 'Y'"
                      color="rgba(255, 229, 0, 1)"
                      class="flex-shrink-0"
                      small
                      style="
                        white-space: nowrap;
                        margin-top: -3px;
                        line-height: 24px;
                      "
                    >
                      加價購
                    </v-chip>
                    <span>
                      {{ cartItem.product_name }}
                    </span>
                  </div>
                  <div class="text-body-2 text--secondary">
                    規格: {{ cartItem.spec_name }}
                  </div>
                  <div class="mt-1">
                    <span
                      class="text--secondary d-flex align-center"
                      v-if="cartItem.invalid"
                    >
                      {{
                        violationArray.find(x => x.cart_id == cartItem.id)
                          .error_message
                      }}
                    </span>
                    <template v-else>
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <span>
                            ${{ cartItem.discount_price }} x{{
                              cartItem.order_num
                            }}
                          </span>
                          <!-- <template>
                            <br />
                            <span
                              v-if="cartItem.reward_exclude == 'Y'"
                              class="warning--text"
                            >
                              不可折抵
                            </span>
                          </template> -->
                        </div>

                        <div>
                          <v-btn
                            text
                            small
                            color="primary"
                            class="px-1"
                            style="font-size: 14px"
                            @click.stop.prevent="
                              setProductTrack(cartItem.item_main_id)
                            "
                          >
                            <i
                              class="fa-heart fa-xl mr-1"
                              :class="{
                                'fa-solid': cartItem.track_status == 'Y',
                                'fa-regular': !(cartItem.track_status == 'Y'),
                              }"
                            ></i
                            >{{
                              cartItem.track_status == 'Y' ? '已追蹤' : '追蹤'
                            }}
                          </v-btn>
                          <v-btn
                            text
                            class="align-self-baseline"
                            :disabled="isDisabled"
                            @click="
                              removeCartItem(cartItem.id, cartItem.product_id)
                            "
                          >
                            移除
                          </v-btn>
                          <v-btn
                            text
                            class="align-self-baseline"
                            color="warning"
                            :disabled="isDisabled"
                            @click="showSheet(cartItem)"
                          >
                            修改
                          </v-btn>
                        </div>
                      </div>

                      <div
                        v-if="cartItem.reward_exclude == 'Y'"
                        class="warning--text"
                      >
                        不可折抵
                      </div>
                      <div v-else>
                        <div
                          class="mt-2 d-flex align-end"
                          v-if="
                            cartItem &&
                            cartItem.reward_usable &&
                            cartItem.reward_usable.length &&
                            cartItem.processing_fee == 0
                          "
                        >
                          <v-btn
                            v-if="
                              selectedHasSpcloffN ||
                              cartItem.is_spcloff_product == 'N'
                            "
                            outlined
                            small
                            @click="showRewardDialog(cartItem)"
                            color="info"
                          >
                            {{
                              getDiscountPrice(cartItem.id) > 0
                                ? '修改折價券'
                                : '套用折價券'
                            }}
                          </v-btn>
                          <v-btn v-else outlined small disabled>
                            套用折價券
                          </v-btn>
                          <div
                            v-if="getDiscountPrice(cartItem.id)"
                            class="text-body-2 ml-2"
                          >
                            已折抵
                            <span class="info--text"
                              >${{ getDiscountPrice(cartItem.id) }}</span
                            >
                            元
                          </div>
                        </div>
                        <div class="mt-2 d-flex align-end" v-else>
                          <v-btn outlined small disabled>
                            無可套用折價券
                          </v-btn>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template
          v-if="
            filtedCartItemArray[0].receive_type == '2' &&
            filtedCartItemArray[0].free_shipping > 0
          "
        >
          <v-divider></v-divider>
          <div class="px-4 py-2 d-flex justify-space-between">
            <span v-if="filtedCartItemArray[0].free_shipping != 999999999"
              >滿${{ filtedCartItemArray[0].free_shipping }}，宅配免運費
            </span>
            <span v-else></span>
            <span
              v-if="
                filtedCartItemArray
                  .filter(x => !x.invalid)
                  .filter(x => selectedIdArray.includes(x.id))
                  .reduce(
                    (acc, cur) => acc + cur.order_num * cur.discount_price,
                    0
                  ) >= filtedCartItemArray[0].free_shipping
              "
              class="primary--text"
              >免運費</span
            >
            <span v-else class="primary--text"
              >運費: ${{ filtedCartItemArray[0].shipment }}
              <template v-if="filtedCartItemArray[0].free_shipping != 999999999"
                >( 再 ${{
                  filtedCartItemArray[0].free_shipping -
                  filtedCartItemArray
                    .filter(x => !x.invalid)
                    .filter(x => selectedIdArray.includes(x.id))
                    .reduce(
                      (acc, cur) => acc + cur.order_num * cur.discount_price,
                      0
                    )
                }}免運)</template
              ></span
            >
          </div>
        </template>
        <template
          v-if="
            filtedCartItemArray[0].receive_type == '2' &&
            filtedCartItemArray[0].cart_group_id != 0 &&
            filtedCartItemArray[0].free_shipping == 0 &&
            filtedCartItemArray[0].shipment == 0
          "
        >
          <v-divider></v-divider>
          <div class="px-4 py-2 d-flex justify-space-between">
            <span>宅配免運費 </span>
          </div>
        </template>
      </v-card>
    </template>
    <v-bottom-sheet v-model="sheet">
      <product-form
        button-text="確認"
        :product="product"
        :area-order-num-array="product.product_area_order_num"
        :spec-id="spec_id"
        :order-num="order_num"
        :receive-type="receive_type"
        :receive-area="receive_area"
        @submit="update"
        :key="product.product_id"
      >
      </product-form>
    </v-bottom-sheet>
    <v-dialog v-model="violationDialog" max-width="600px">
      <v-card>
        <v-card-title>失效商品</v-card-title>
        <v-list two-line>
          <v-list-item
            v-for="item in selectedViolationArray"
            :key="item.cart_id"
          >
            <v-list-item-content>
              <v-list-item-title>item.product_name </v-list-item-title>
              <v-list-item-subtitle>{{
                item.error_message
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed @click="handler">返回購物車</v-btn></v-card-actions
        >
      </v-card>
    </v-dialog>
    <v-dialog v-model="rewardDialog" persistent scrollable max-width="600px">
      <v-card>
        <v-card-title>選擇折價券</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: calc(90vh - 110px)">
          <!-- <ul class="mt-1 primary--text">
            <li>三聯式發票不得使用折價券</li>
          </ul> -->
          <v-container v-if="rewardArray2.length">
            <template>
              <v-row justify="center">
                <v-expansion-panels accordion>
                  <v-expansion-panel
                    class="pa-0"
                    v-for="(record, i) in rewardArray2"
                    :key="i"
                  >
                    <v-expansion-panel-header class="pa-0">
                      <div>
                        <div
                          class="text-body-1 primary--text product-title d-flex justify-space-between"
                        >
                          {{ record.reward_name }}
                        </div>
                      </div>
                    </v-expansion-panel-header>
                    <div>
                      <div class="text-caption">
                        可用張數:{{ record.customer_rewards_count }}
                        <span v-if="typeOfReward !== 'all'">
                          其他明細已使用張數:{{ record.cum }}
                        </span>
                        ( 截止日:{{
                          $dayjs(record.min_end_date).format('YYYY-MM-DD HH:mm')
                        }}
                        <template
                          v-if="record.min_end_date != record.max_end_date"
                        >
                          ~{{
                            $dayjs(record.max_end_date).format(
                              'YYYY-MM-DD HH:mm'
                            )
                          }} </template
                        >)
                      </div>
                      <v-select
                        v-if="record.qty < 10"
                        outlined
                        dense
                        :items="
                          Array.from({
                            length: Math.min(
                              record.customer_rewards_count + 1,
                              11
                            ),
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
                        prepend-inner-icon="remove"
                        append-icon="add"
                        :value="record.qty"
                        @blur="record.qty = parseInt($event.target.value, 10)"
                        @click:prepend-inner="remove(record)"
                        @click:append="add(record)"
                        :rules="[
                          v => /^\+?(0|[1-9]\d*)$/.test(v) || '請輸入正確數量',
                          v =>
                            record.customer_rewards_count >= v ||
                            '超過剩餘數量',
                        ]"
                      >
                      </v-text-field>
                    </div>
                    <v-expansion-panel-content>
                      <template>
                        <v-simple-table fixed-header>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">截止日</th>
                                <th class="text-left">張數</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(detail, index) in record.reward_detail"
                                :key="index"
                              >
                                <td>
                                  {{
                                    $dayjs(detail.end_date).format(
                                      'YYYY-MM-DD HH:mm'
                                    )
                                  }}
                                </td>
                                <td>{{ detail.qty }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </template>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>
            </template>
          </v-container>
          <v-container v-else>
            <div class="d-flex justify-center text-h6 mt-5">無符合折價券</div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <table v-if="rewardArray2.length">
            <tr>
              <td>{{ typeOfReward == 'all' ? '結帳' : '明細' }}總金額:</td>

              <td class="pr-2">${{ totalPriceForDialog }}</td>
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
                <!-- 明細折抵{{ 1 }}+ {{ totalRewardAmount }} = 總折抵 -->
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
          <div>
            <v-btn depressed @click="cancelRewardDialog" text>取消</v-btn>
            <v-btn
              depressed
              :disabled="isRewardDisabled2 || !rewardConCal"
              @click="confirmRewardDialog"
              color="primary"
              >套用</v-btn
            >
          </div>
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
    <v-dialog v-model="noSelectAlertDialog" max-width="500">
      <v-card class="py-2">
        <v-card-text class="black--text text-center pt-3 pb-0">
          <div class="primary--text text-h5 font-weight-bold mb-4">
            <span
              class="pl-2"
              style="border-bottom: 2px solid var(--v-primary-base)"
            >
              未勾選商品提醒！</span
            >
          </div>
          <div class="text-body-1 font-weight-bold">
            您尚未勾選要使用折價的商品，請先勾選商品再選擇折價券。
          </div>
        </v-card-text>
        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            elevation="0"
            @click="noSelectAlertDialog = false"
          >
            確定
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogAddOn"
      content-class="add-on-dialog"
      max-width="955px"
      persistent
    >
      <div style="position: relative">
        <add-on-product
          :props-add-on-product-array="spcloffArray"
          :props-recommend-product-array="recommendAIArray"
          :recommend-id="recommendIndex"
          :add-on-id="spcloffIndex"
          @update:recommendId="updateRecommendId"
          @update:spcloffId="updateSpcloffId"
          @closeAddOnDialog="closeAddOnDialog"
          @changeTab="changeTab"
          from="cart"
        ></add-on-product>
        <v-overlay :absolute="true" :value="isAddOnLoading">
          <div style="width: 64px; overflow: hidden; margin: 0 auto">
            <v-progress-circular
              indeterminate
              color="white"
              size="64"
            ></v-progress-circular>
          </div>
        </v-overlay>
      </div>
    </v-dialog>
    <v-overlay :value="dialogAddOn">
      <div style="width: 64px; overflow: hidden; margin: 0 auto">
        <v-progress-circular indeterminate size="64" color="white">
        </v-progress-circular>
      </div>
    </v-overlay>
    <v-dialog v-model="activityInfoDialog" max-width="480">
      <v-card class="py-2">
        <v-card-text class="black--text pt-4 pb-0">
          <div
            class="text-body-1 font-weight-bold"
            style="font-size: 20px !important"
          >
            ✨加油！✨
            <br />
            再加購一項商品，就享有抽購物金資格！🎉🎉
          </div>
        </v-card-text>
        <v-card-actions class="mt-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="activityInfoDialog = false">
            返回購物車
          </v-btn>
          <v-btn
            color="primary"
            outlined
            @click="
              $router.push({
                name: 'Checkout',
                params: {
                  cartIdArray: selectedCartItemArray.map(x => x.id),
                  cartRewardArray: tempReward,
                },
              })
            "
          >
            繼續結帳
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-footer fixed color="white" elevation="4" class="pa-0">
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <div
              class="d-flex align-center pa-1 mb-2"
              style="cursor: pointer"
              @click="showRewardDialog('all')"
            >
              <div>折價券</div>
              <v-spacer></v-spacer>
              <div v-if="totalRewardAmount2 && !rewardDialog">
                已套用<span class="primary--text">"{{ countOfReward }}"</span
                >張折價券
              </div>
              <div v-else>
                <v-btn outlined color="info">
                  使用折價券
                  <v-icon style="margin-right: -8px">chevron_right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-divider></v-divider>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-spacer></v-spacer>
              <template v-if="totalRewardAmount2 && !rewardDialog">
                <div class="mr-2">
                  商品金額:
                  <span class="primary--text">${{ productTotalPrice }}</span> -
                </div>
                <div class="mr-2">
                  折扣:
                  <span class="primary--text">${{ totalRewardAmount2 }}</span>
                </div>
              </template>

              <div class="mr-2">
                總金額:
                <span class="primary--text"
                  >${{
                    productTotalPrice - (rewardDialog ? 0 : totalRewardAmount2)
                  }}</span
                >
              </div>
              <v-btn
                class="text-subtitle-1 font-weight-bold"
                color="primary"
                depressed
                @click="toCheckout"
                :disabled="
                  selectedCartItemArray.length === 0 ||
                  amountReachedValidForCheckout
                "
                :loading="isLoading"
                >結帳</v-btn
              >
            </div>
            <div
              class="text-end secondary--text mt-2"
              v-if="amountReachedValidForCheckout"
            >
              您使用的折價券額度超過目前您的結帳總金額，請調整折價券數量後再進行結帳。
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>
<script>
import { apiAxios } from '@/api'
import uniqBy from 'lodash/uniqBy'
import groupBy from 'lodash/groupBy'
import union from 'lodash/union'
import xor from 'lodash/xor'
import ProductForm from '@/components/ProductForm.vue'
import AddOnProduct from '@/components/AddOnProduct.vue'
// import { mapState } from 'vuex'
import ExtraPurchase from '@/components/ExtraPurchase.vue'

export default {
  components: { ProductForm, AddOnProduct, ExtraPurchase },
  created() {
    this.isCartLoading = true
    return this.updateCartSpecId()
      .then(() => this.getCart())
      .then(() =>
        Promise.all([
          Promise.all([
            this.getRewardAmountCond(),
            this.getViolation(),
            this.getReward(),
          ]).finally(() => (this.isCartLoading = false)),
          this.fetchTabData(),
        ])
      )
      .finally(() => {
        this.GA4_view_cart()
      })
  },
  watch: {
    sheet: {
      handler(val) {
        if (!val) {
          this.cartItemId = ''
          this.spec_id = null
          this.order_num = ''
          this.receive_type = ''
          this.receive_area = ''
        }
      },
      immediate: true,
    },
    selectedCartItemArray() {
      this.rewardArray2 = []
    },
    selectedIdArray(newVal) {
      // 若選擇完所有折價券後又取消勾選，清空 tempReward
      if (!newVal.length) {
        this.tempReward = []
      }
    },
    selectedHasSpcloffN(newVal) {
      if (!newVal) {
        this.selectedIdArray = []
      }
    },
  },
  data: () => ({
    sheet: false,
    sourceCartItemArray: [],
    isDisabled: false,
    isCartLoading: false,
    isLoading: false,

    product: { spec_array: [] },
    // areaOrderNumArray: [],
    spec_id: '',
    order_num: '',
    receive_type: '',
    receive_area: '',
    cartItemId: '',
    violationArray: [],
    selectedIdArray: [],
    selectedViolationArray: [],
    violationDialog: false,
    rewardDialog: false,
    rewardArray: [],
    drag: false,

    rewardArray2: [],
    typeOfReward: '',
    tempReward: [],
    rewardForAll: [],
    noSelectAlertDialog: false,

    spcloffArray: [],
    dialogAddOn: false,
    isAddOnLoading: false,
    addOnProductArray: [],
    extraPurchaseTab: null,
    isExtraPurchaseLoading: false,
    recommendAIArray: [],
    tabItems: [],

    recommendIndex: 0,
    spcloffIndex: 0,
    activityInfoDialog: false,

    rewardCondition: 0,
  }),
  computed: {
    // ...mapState(['profile']),
    cartItemArray() {
      return this.sourceCartItemArray.map(x => ({
        ...x,
        invalid: this.violationArray.some(y => y.cart_id == x.id),
      }))
    },
    selectedCartItemArray() {
      return this.cartItemArray
        .filter(x => this.selectedIdArray.includes(x.id))
        .filter(x => !x.invalid)
    },
    productTotalPrice() {
      return this.selectedCartItemArray.reduce(
        (acc, cur) => acc + cur.order_num * cur.discount_price,
        0
      )
    },
    detailTotalDiscountReached() {
      let detailUsedSum = 0
      if (this.tempReward.length) {
        detailUsedSum = this.tempReward
          .filter(e => e.type !== 'all')
          .map(e => e.reward)
          .flat()
          .reduce((acc, cur) => acc + cur.qty * cur.amount_reached, 0)
      }
      return detailUsedSum
    },
    receiveTypeOptionArray() {
      return uniqBy(this.cartItemArray, 'receive_type').sort((a, b) =>
        a.receive_type > b.receive_type ? 1 : -1
      )
    },
    groupByObject() {
      return groupBy(this.cartItemArray, function (x) {
        return x.receive_type == '1' ? x.receive_area : x.cart_group_id
      })
    },
    totalAmountReached() {
      // 需達標的金額限制
      return this.rewardArray2
        .filter(x => x.qty > 0)
        .reduce((acc, cur) => acc + cur.amount_reached * cur.qty, 0)
    },
    totalRewardAmount() {
      return this.rewardArray
        .filter(x => x.qty > 0)
        .reduce((acc, cur) => acc + cur.reward_amount * cur.qty, 0)
    },
    totalRewardAmount2() {
      // 總折扣
      return this.tempReward
        .map(e => e.reward)
        .flat()
        .reduce((acc, cur) => acc + cur.reward_amount * cur.qty, 0)
    },
    hasLimitReward() {
      return this.rewardArray
        .filter(x => x.qty > 0)
        .some(x => x.product_reward_limit === 'Y')
    },
    isRewardDisabled() {
      return (
        this.productTotalPrice < this.totalAmountReached ||
        (this.hasLimitReward &&
          this.productRewardAmountLimit <
            this.rewardArray
              .filter(x => x.qty > 0)
              .filter(x => x.product_reward_limit === 'Y')
              .reduce((acc, cur) => acc + cur.reward_amount * cur.qty, 0)) ||
        (this.hasLimitReward &&
          this.productRewardAmountLimit <
            this.rewardArray
              .filter(x => x.qty > 0)
              .filter(x => x.product_reward_limit === 'Y')
              .reduce((acc, cur) => acc + cur.amount_reached * cur.qty, 0)) ||
        this.overRange ||
        this.selectedCartItemArray.some(x => x.reward_exclude == 'Y')
      )
    },
    isRewardDisabled2() {
      if (this.typeOfReward !== 'all') {
        let cartItem = this.cartItemArray.find(e => e.id == this.typeOfReward)
        // reward_exclude = 'Y' 單品不可以套用折價券
        let rewardExclude = cartItem?.reward_exclude == 'Y' ? true : false
        // 選擇的折價券數量已告罄
        let rewardOverUse = this.rewardArray2.some(
          e => e.qty + e.cum > e.customer_rewards_count
        )
        // 單品的金額 低於 滿額的金額限制，則不可套用
        let discountOverRange =
          this.totalAmountReached >
          cartItem?.discount_price * cartItem?.order_num
        // 檢查明細的折價券數量修正後，是否造成 amount_reached 總金額超過的情形
        let checkAmountReachedLimit = false
        if (this.tempReward.find(x => x.type == 'all')) {
          let amountReachedForAll = this.tempReward
            .filter(e => e.type == 'all')
            .map(e => e.reward)
            .flat()
            .filter(x => x.qty > 0)
            .reduce((acc, cur) => acc + cur.amount_reached * cur.qty, 0)
          let detailDiscountReached = this.tempReward
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
          checkAmountReachedLimit
        )
      } else {
        let rewardExcludeTotalPrice = this.selectedCartItemArray
          .filter(e => e.reward_exclude == 'Y')
          .reduce((acc, cur) => acc + cur.order_num * cur.discount_price, 0)
        // 總金額 低於 滿額的金額限制，則不可套用
        let discountOverRange =
          this.totalAmountReached >
          this.productTotalPrice -
            rewardExcludeTotalPrice -
            this.detailTotalDiscountReached
        return discountOverRange
      }
    },
    getDiscountPrice() {
      // 在單品明細上顯示該單品目前折了多少元
      return x => {
        let temp = this.tempReward.find(e => e.type == x)
        let discountPrice = 0
        if (temp) {
          discountPrice = temp.reward.reduce(
            (acc, cur) => acc + cur.qty * cur.reward_amount,
            0
          )
        }
        return discountPrice
      }
    },
    productRewardAmountLimit() {
      return this.selectedCartItemArray.reduce(
        (acc, cur) => acc + cur.order_num * cur.reward_amount_limit,
        0
      )
    },
    overRange() {
      return this.rewardArray.some(e => e.qty > e.customer_rewards_count)
    },
    totalPriceForDialog() {
      // 處理 rewardDialog footer 的總金額顯示
      if (this.typeOfReward !== 'all') {
        let cartItem = this.cartItemArray.find(e => e.id == this.typeOfReward)
        return cartItem.discount_price * cartItem.order_num
      } else {
        return this.selectedCartItemArray.reduce(
          (acc, cur) => acc + cur.discount_price * cur.order_num,
          0
        )
      }
    },
    countOfReward() {
      return this.tempReward
        .map(e => e.reward)
        .flat()
        .reduce((acc, cur) => acc + cur.qty, 0)
    },
    spcloffCheckboxValid() {
      return is_spcloff_product => {
        if (this.selectedHasSpcloffN) {
          return false
        } else {
          if (is_spcloff_product == 'Y') {
            return true
          } else {
            return false
          }
        }
      }
    },
    spcloffGroupCheckboxValid() {
      return filtedCartItemArray => {
        if (this.selectedHasSpcloffN) {
          return false
        } else {
          if (
            filtedCartItemArray.filter(e => e.is_spcloff_product == 'N').length
          ) {
            return false
          }
          return true
        }
      }
    },
    selectedHasSpcloffN() {
      const isSelected = this.sourceCartItemArray
        .filter(cartItem => this.selectedIdArray.includes(cartItem.id))
        .map(cartItem => ({
          id: cartItem.id,
          is_spcloff_product: cartItem.is_spcloff_product,
        }))
      return !!isSelected.filter(e => e.is_spcloff_product == 'N').length
    },
    amountReachedValidForCheckout() {
      // 假如檢查出 amount_reached 未達成，disable 結帳按鈕
      let amountReachedNow = this.tempReward
        .map(e => e.reward)
        .flat()
        .reduce((acc, cur) => acc + cur.qty * cur.amount_reached, 0)

      if (amountReachedNow > this.productTotalPrice) {
        return true
      } else {
        return false
      }
    },
    cartItemHasSpcloffN() {
      let spcloffWithN = this.sourceCartItemArray.filter(
        e => e.is_spcloff_product == 'N'
      )
      return !!spcloffWithN.length
    },
    receiveAreaInProfile() {
      if (this.$store.state.profile.receive_area) {
        return this.$store.state.profile.receive_area
      } else if (this.$store.state.profile.recent_receive_area) {
        return this.$store.state.profile.recent_receive_area
      } else {
        return ''
      }
    },
    rewardConCal() {
      return this.productTotalPrice >= this.rewardCondition
    },
  },
  methods: {
    fetchTabData() {
      this.isExtraPurchaseLoading = true
      return Promise.all([this.additionalPurchase(), this.recommendByAI()])
        .then(() => {
          if (this.spcloffArray.length) {
            this.tabItems.push({
              text: '優惠加購',
              icon: 'fa-solid fa-cart-plus',
              products: this.spcloffArray,
              isAddOn: true,
            })
          }
          if (this.recommendAIArray.length) {
            this.tabItems.push({
              text: '推薦商品',
              icon: 'fa-regular fa-thumbs-up',
              products: this.recommendAIArray,
              isAddOn: false,
            })
          }
        })
        .catch(error => {
          this.$snackbar.add(error, { color: 'primary' })
        })
        .finally(() => {
          this.isExtraPurchaseLoading = false
        })
    },
    recommendByAI() {
      let cartIdArray = this.cartItemArray
        .filter(e => e.is_spcloff_product == 'N')
        .map(e => e.id)

      return apiAxios({
        method: 'post',
        url: '/Product/GetProductRecommendByAiV2',
        params: {
          pageNo: 1,
          pageSize: 20,
          v: 2,
        },
        data: {
          storeType: [],
          paymentType: [],
          receiveType: [],
          brand: [],
          category: [],
          categorySecondary: [],
          categoryMinor: [],
          minPrice: '0',
          maxPrice: '0',
          orderBy: {
            key: 'default_order_seq',
            asc: true,
          },
          cartItemArray: cartIdArray,
          type: 'cart',
        },
      }).then(res => {
        this.recommendAIArray = res.result.product
      })
    },
    additionalPurchase() {
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductSpcloff',
        data: {
          spcloffType: 'A',
          filterDto: {
            storeType: [],
            paymentType: [],
            receiveType: [],
            brand: [],
            category: [],
            categorySecondary: [],
            categoryMinor: [],
            minPrice: '0',
            maxPrice: '0',
            orderBy: {
              key: 'default_order_seq',
              asc: true,
            },
          },
        },
      }).then(res => {
        this.spcloffArray = res.result.product
      })
    },
    moreSpcloff(index) {
      // this.getAddOnProductArray()
      if (this.tabItems[this.extraPurchaseTab].text == '推薦商品') {
        this.recommendIndex = index
      } else {
        this.spcloffIndex = index
      }
      this.dialogAddOn = true
    },
    // getAddOnProductArray() {
    //   this.isAddOnLoading = true
    //   apiAxios({
    //     method: 'post',
    //     url: '/Product/GetSpcloffProductArray',
    //     data: {
    //       spcloffType: 'A',
    //       comeFrom: 'CART',
    //       prefix: 'asd',
    //     },
    //   }).then(res => {
    //     this.addOnProductArray = res.result
    //     this.isAddOnLoading = false
    //     this.dialogAddOn = true
    //   })
    // },
    async closeAddOnDialog(spec) {
      // 點擊 加價購 & 推薦商品 視窗內的加入購物車按鈕後的邏輯處理
      if (spec && spec.specId) {
        apiAxios({
          method: 'post',
          url: '/Cart/AddCartItemV2',
          data: {
            spec_id: spec.specId,
            order_num: spec.orderNum,
            receive_type: spec.receiveType,
            receive_area: spec.receiveType == '1' ? spec.receiveArea : '',
            section_name:
              this.extraPurchaseTab == 0
                ? 'ga-cart-recommend-upsell-entry'
                : 'ga-cart-recommend-product-entry',
            target_product_id: 0,
            current_path: '',
            previous_path: '',
            add_from: '',
            utm_campaign: '',
            utm_content: '',
          },
        })
          .then(() => {
            if (this.tabItems[this.extraPurchaseTab].text == '推薦商品') {
              this.recommendAIArray[this.recommendIndex].cart_num =
                this.recommendAIArray[this.recommendIndex].cart_num +
                Number(spec.orderNum)
            } else {
              this.spcloffArray[this.spcloffIndex].cart_num =
                this.spcloffArray[this.spcloffIndex].cart_num +
                Number(spec.orderNum)
            }
            this.getCart()
              .then(() => {
                this.$snackbar.add(`成功加入購物車`, { color: 'success' })
              })
              .then(() => this.getViolation())
              .then(() => this.getReward())
          })
          .catch(error => {
            this.$snackbar.add(error, { color: 'primary' })
          })
      } else {
        this.dialogAddOn = false
      }
    },
    updateRecommendId(v) {
      this.recommendIndex = v
    },
    updateSpcloffId(v) {
      this.spcloffIndex = v
    },
    updateCartSpecId() {
      return apiAxios({
        method: 'post',
        url: '/Cart/UpdateCartSpecId',
      })
    },
    getCart() {
      return apiAxios({
        method: 'post',
        url: '/Cart/GetCartItemArray',
      }).then(res => {
        this.sourceCartItemArray = res.result
        this.$store.commit('setCartCount', res.result.length)
      })
    },
    getReward() {
      return apiAxios({
        method: 'post',
        url: '/Reward/GetUserRewardV2',
      }).then(res => {
        let rewardArray = res.result
        this.sourceCartItemArray = this.sourceCartItemArray.map(cartItem => {
          cartItem.reward_usable = []
          rewardArray.map(reward => {
            reward.include.map(include => {
              if (
                include.condition_key == 'ACTIVITY_TYPE' &&
                cartItem.activity_type_array.includes(include.condition_value)
              ) {
                cartItem.reward_usable.push(JSON.parse(JSON.stringify(reward)))
              }
              if (
                include.condition_key == 'CATEGORY_ID' &&
                cartItem.category_id_array.includes(include.condition_value)
              ) {
                cartItem.reward_usable.push(JSON.parse(JSON.stringify(reward)))
              }
              if (
                include.condition_key == 'PRODUCT_ID' &&
                cartItem.product_id == include.condition_value
              ) {
                cartItem.reward_usable.push(JSON.parse(JSON.stringify(reward)))
              }
            })
          })
          return cartItem
        })
        this.rewardForAll = rewardArray.filter(e => !e.include.length)
      })
    },
    getProduct(cartItem) {
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductV2',
        params: { v: '2' },
        data: {
          product_id: cartItem.product_id,
        },
      }).then(res => {
        this.product = res.result[0]
      })
    },
    // getAreaOrderNum(cartItem) {
    //   return apiAxios({
    //     method: 'post',
    //     url: '/Product/GetProductAreaOrderNum',
    //     data: { product_id: cartItem.product_id },
    //   }).then(res => {
    //     this.areaOrderNumArray = res.result
    //   })
    // },
    showSheet(cartItem) {
      this.isDisabled = true
      return Promise.all([
        this.getProduct(cartItem),
        // this.getAreaOrderNum(cartItem),
      ])
        .then(() => {
          this.cartItemId = cartItem.id
          this.spec_id = cartItem.spec_id
          this.order_num = cartItem.order_num ? cartItem.order_num + '' : '1'
          this.receive_type = cartItem.receive_type
          this.receive_area = cartItem.receive_area || this.receiveAreaInProfile
          this.sheet = true
        })
        .finally(() => {
          this.isDisabled = false
        })
    },
    update(payload) {
      let gaInfo = JSON.parse(sessionStorage.getItem('pec_ga_info')) || {}
      // console.log(gaInfo)
      let utmInfo = JSON.parse(sessionStorage.getItem('pec_utm_info')) || {}
      // console.log(utmInfo)

      // 檢查 UTM 是否超過 1 小時
      if (utmInfo.utm_recorded_at) {
        const recordedTime = new Date(utmInfo.utm_recorded_at).getTime()
        const now = Date.now()
        const ONE_HOUR = 60 * 60 * 1000

        if (now - recordedTime > ONE_HOUR) {
          // 超過一小時就清除 UTM 資料
          sessionStorage.removeItem('pec_utm_info')
          utmInfo = {} // 不帶 UTM
        }
      }

      this.isDisabled = true
      return apiAxios({
        method: 'post',
        url: '/Cart/UpdateCartItemV2',
        data: {
          id: this.cartItemId,
          spec_id: payload.specId,
          order_num: payload.orderNum,
          receive_type: payload.receiveType,
          receive_area: payload.receiveType == '1' ? payload.receiveArea : '',
          section_name: gaInfo.section_name || 'direct',
          target_product_id: gaInfo.target_product_id || 0,
          current_path: gaInfo.current_path || '',
          previous_path: gaInfo.previous_path || '',
          add_from: gaInfo.add_from || '',
          utm_campaign: utmInfo.utm_campaign || '',
          utm_content: utmInfo.utm_content || '',
        },
      })
        .then(() => {
          this.sheet = false
          this.isCartLoading = true
          this.tempReward = this.tempReward.filter(
            e => e.type !== this.cartItemId
          )
          this.getCart()
            .then(() => this.getViolation())
            .then(() => this.getReward())
            .finally(() => {
              this.isCartLoading = false
            })
        })
        .finally(() => {
          this.isDisabled = false
        })
    },
    getViolation() {
      return apiAxios({
        method: 'post',
        url: '/Checkout/ValidateCheckout',
        data: { cart_id_array: this.cartItemArray.map(x => x.id) },
      }).then(res => (this.violationArray = res.result))
    },
    setSelectedIdArray(idArray, v) {
      this.selectedIdArray = v
        ? union(idArray, this.selectedIdArray)
        : xor(idArray, this.selectedIdArray)

      // 取消 group 的勾選時，同時也取消 tempReward 內的紀錄
      if (!v) {
        this.tempReward = this.tempReward
          .map(e => {
            for (let i = 0; i < idArray.length; i++) {
              if (e.type == idArray[i]) {
                e.needRemoved = true
              } else {
                e.needRemoved = false
              }
            }
            return e
          })
          .filter(e => !e.needRemoved)
      }

      // this.autoApply()
    },
    changeDetailRewardStatus() {
      // 取消明細的勾選時，同時也取消 tempReward 內的紀錄
      let typeId = this.tempReward
        .filter(e => e.type !== 'all')
        .map(e => e.type)
      let needRemoveIdList = typeId.filter(
        e => !this.selectedIdArray.includes(e)
      )
      this.tempReward.map(e => {
        for (let i = 0; i < needRemoveIdList.length; i++) {
          if (e.type == needRemoveIdList[i]) {
            e.needRemoved = true
          } else {
            e.needRemoved = false
          }
        }
      })
      this.tempReward = this.tempReward.filter(e => !e.needRemoved)

      // this.autoApply()
    },
    toCheckout() {
      this.isLoading = true
      return apiAxios({
        method: 'post',
        url: '/Checkout/ValidateCheckout',
        data: { cart_id_array: this.selectedCartItemArray.map(x => x.id) },
      })
        .then(res => {
          this.selectedViolationArray = res.result
          if (this.selectedViolationArray.length > 0) {
            this.violationDialog = true
          } else {
            if (
              this.$dayjs().isAfter('2024-12-01') &&
              this.selectedCartItemArray.length < 2
            ) {
              this.activityInfoDialog = true
            } else {
              this.$router.push({
                name: 'Checkout',
                params: {
                  cartIdArray: this.selectedCartItemArray.map(x => x.id),
                  // cartRewardArray: this.rewardArray.filter(x => x.qty > 0),
                  cartRewardArray: this.tempReward,
                },
              })
            }
          }
        })
        .finally(() => (this.isLoading = false))
    },
    removeCartItem(id, product_id) {
      this.isDisabled = true
      return apiAxios({
        method: 'post',
        url: '/Cart/RemoveCartItem',
        data: { id },
      })
        .then(() => {
          this.isCartLoading = true
          this.selectedIdArray = this.selectedIdArray.filter(e => e !== id)
          this.getCart()
            .then(() => this.getViolation())
            .then(() => this.getReward())
            .finally(() => {
              this.changeDetailRewardStatus()

              let checkRecommendSameData = this.recommendAIArray.find(
                e => e.product_id == product_id
              )
              if (checkRecommendSameData) {
                checkRecommendSameData.cart_num = 0
              }

              this.isCartLoading = false
            })
        })
        .finally(() => {
          this.isDisabled = false
        })
    },
    async removeInvalidCartItem() {
      try {
        this.isCartLoading = true
        for (let id of this.violationArray.map(x => x.cart_id)) {
          await apiAxios({
            method: 'post',
            url: '/Cart/RemoveCartItem',
            data: { id },
          })
        }
        await this.getCart()
        await this.getViolation()
        await this.getReward()
      } finally {
        this.isCartLoading = false
      }
    },
    toCartGroup(cart_group_id) {
      this.$router.push({
        name: 'CartGroup',
        params: {
          groupId: cart_group_id,
        },
      })
    },
    toProduct(product_id, is_spcloff_product) {
      if (is_spcloff_product == 'N') {
        this.$router.push(`/product/${product_id}`)
      } else {
        //
      }
    },
    handler() {
      this.violationDialog = false
      this.isCartLoading = true
      return this.getCart()
        .then(() => this.getViolation())
        .then(() => this.getReward())
        .finally(() => {
          this.isCartLoading = false
        })
    },
    showRewardDialog(params) {
      let rewardForDialog = []
      if (params === 'all') {
        this.typeOfReward = 'all'
        rewardForDialog = this.rewardForAll
        if (!this.selectedCartItemArray.length) {
          // this.$snackbar.add('請先勾選欲結帳明細')
          this.noSelectAlertDialog = true
          return
        }
      } else {
        this.typeOfReward = params.id
        rewardForDialog = params.reward_usable
      }

      let tempId = this.tempReward.findIndex(e => e.type == this.typeOfReward)
      let tempData = tempId >= 0 ? this.tempReward[tempId].reward : []
      let tempForCumulate = this.tempReward
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
      let tempId = this.tempReward.map(e => e.type)
      // 在 tempReward 已有此購物車紀錄時，編輯資料
      if (tempId.includes(this.typeOfReward)) {
        let id = this.tempReward.findIndex(e => e.type == this.typeOfReward)
        // 存入 qty > 0 的 reward 資料
        if (this.rewardArray2.filter(e => e.qty > 0).length) {
          this.tempReward[id].reward = this.rewardArray2.filter(e => e.qty > 0)
        } else {
          // 若 reward qty 皆為 0，刪除此購物車折價券紀錄
          this.tempReward.splice(id, 1)
        }
      } else {
        // tempReward 未有此購物車紀錄時，新增資料
        this.tempReward.push({
          type: this.typeOfReward,
          reward: this.rewardArray2.filter(e => e.qty > 0),
        })
      }
      // 若單筆明細套用了折價券，把該單筆明細加入 selectedIdArray
      if (
        this.typeOfReward !== 'all' &&
        !this.selectedIdArray.includes(this.typeOfReward) &&
        this.rewardArray2.filter(e => e.qty > 0).length
      ) {
        this.selectedIdArray.push(this.typeOfReward)
      }

      this.rewardDialog = false
    },
    cancelRewardDialog() {
      this.rewardArray2 = []
      this.rewardDialog = false
    },
    setProductTrack(item_main_id) {
      apiAxios({
        method: 'post',
        url: '/Track/Track',
        data: { item_main_id: [item_main_id] },
      }).then(res => {
        if (res.message == null) {
          this.$snackbar.add(`此商品未設立追蹤功能`, { color: 'primary' })
        } else {
          this.$snackbar.add(`${res.message}`, { color: 'success' })
          this.getCart()
        }
      })
    },
    GA4_view_cart() {
      const arr = Object.keys(this.groupByObject)
      if (arr.length !== 0) {
        let viewCartItem = []
        for (let i = 0; i < Object.keys(this.groupByObject).length; i++) {
          for (
            let j = 0;
            j < this.groupByObject[Object.keys(this.groupByObject)[i]].length;
            j++
          ) {
            viewCartItem.push({
              item_id:
                this.groupByObject[Object.keys(this.groupByObject)[i]][j]
                  .product_id,
              item_name:
                this.groupByObject[Object.keys(this.groupByObject)[i]][j]
                  .product_name,
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
              item_variant:
                this.groupByObject[Object.keys(this.groupByObject)[i]][j]
                  .spec_name,
              location_id: '',
              price:
                this.groupByObject[Object.keys(this.groupByObject)[i]][j]
                  .discount_price,
              quantity:
                this.groupByObject[Object.keys(this.groupByObject)[i]][j]
                  .order_num,
            })
          }
        }
        window.dataLayer.push({ ecommerce: null })
        this.$gtm.trackEvent({
          event: 'view_cart',
          ecommerce: {
            currency: 'TWD',
            value: this.productTotalPrice,
            items: viewCartItem,
          },
        })
      }
    },
    autoApply() {
      // 預先勾選全部
      // this.selectedIdArray = this.cartItemArray
      //   .filter(x => !x.invalid)
      //   .map(x => x.id)

      // 對有勾選的商品進行自動套用折價券
      let needAutoApply = this.selectedCartItemArray
        .filter(x => !x.invalid)
        .filter(e => e.reward_usable.length)
        .filter(e => e.reward_exclude !== 'Y')
        .sort(
          (a, b) =>
            b.discount_price * b.order_num - a.discount_price * a.order_num
        )

      // 計算購物車明細的自動套用
      let rewardUseTracker = {}
      this.tempReward = needAutoApply
        .map(e => ({
          type: e.id,
          reward: e.reward_usable,
        }))
        .map(e => {
          // 排序折價券，總折抵金額高至低排列
          e.reward.sort(
            (a, b) =>
              b.reward_amount * b.customer_rewards_count -
              a.reward_amount * a.customer_rewards_count
          )

          let cart = this.cartItemArray.find(cart => cart.id == e.type)
          let cartPrice = cart.discount_price * cart.order_num
          let remainPrice = cartPrice

          e.reward = e.reward
            .map(r => {
              let remainRewardCount = Object.hasOwn(rewardUseTracker, r.id)
                ? rewardUseTracker[r.id]
                : r.customer_rewards_count

              let maxUsable = Math.floor(remainPrice / r.amount_reached)

              r.qty = Math.min(maxUsable, remainRewardCount)

              // if (r.qty > 0) {
              rewardUseTracker[r.id] = remainRewardCount - r.qty
              remainPrice -= r.qty * r.reward_amount
              // }

              return r
            })
            .filter(e => e.qty > 0)
          return e
        })
        .filter(e => e.reward.length)

      // 計算全購物車的自動套用
      let autoApplyForAll = JSON.parse(JSON.stringify(this.rewardForAll))
      // 確認至少有一筆符合 reward_exclude == 'N'
      let selectedArray = this.selectedCartItemArray.filter(
        e => e.reward_exclude == 'N'
      )

      // 計算總消費金額
      let cartAmountSum = 0
      if (selectedArray.length) {
        cartAmountSum = selectedArray.reduce(
          (acc, cur) => acc + cur.discount_price * cur.order_num,
          0
        )
      }
      // 計算單品明細的折扣金額
      let detailUsedSum = 0
      if (this.tempReward.length) {
        detailUsedSum = this.tempReward
          .filter(e => e.type !== 'all')
          .map(e => e.reward)
          .flat()
          .reduce((acc, cur) => acc + cur.qty * cur.amount_reached, 0)
      }

      let cartPriceForAll = cartAmountSum - detailUsedSum
      let remainPriceForAll = cartPriceForAll

      autoApplyForAll.sort(
        (a, b) =>
          b.reward_amount * b.customer_rewards_count -
          a.reward_amount * a.customer_rewards_count
      )
      autoApplyForAll = autoApplyForAll.map(e => {
        let maxUsable = Math.floor(remainPriceForAll / e.amount_reached)
        e.qty =
          maxUsable >= e.customer_rewards_count
            ? e.customer_rewards_count
            : maxUsable

        remainPriceForAll -= e.qty * e.reward_amount

        return e
      })

      if (autoApplyForAll.filter(e => e.qty > 0).length) {
        this.tempReward.push({
          type: 'all',
          reward: autoApplyForAll,
        })
      }
    },
    getRewardAmountCond() {
      return apiAxios({
        method: 'post',
        url: '/Profile/GetRewardAmountCond',
      }).then(res => {
        if (res.result[0]) {
          this.rewardCondition = +res.result[0].profile_comments
        }
      })
    },
    changeTab(mainTab) {
      this.extraPurchaseTab = mainTab
    },
  },
}
</script>
<style scoped>
.product-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-name {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3rem;
}
/* .v-tabs >>> .v-tabs-slider-wrapper {
  z-index: initial;
  height: 100% !important;
} */
.flip-list-move {
  transition: transform 0.5s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
:deep(.v-expansion-panel:not(:first-child)::after) {
  border-top: unset;
}
:deep(.v-expansion-panel::before) {
  box-shadow: unset;
}
:deep(.v-data-table__wrapper) {
  height: auto;
  max-height: 300px;
}
:deep(.v-footer--fixed) {
  z-index: 6 !important;
}
@media (max-width: 960px) {
  :deep(.add-on-dialog.v-dialog) {
    margin: 0;
    max-height: inherit;
    border-radius: 0;
    min-width: 100%;
  }
}
</style>
