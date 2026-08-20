<template>
  <div>
    <div
      class="tour-backdrop"
      v-if="isOpenTour"
      @click="isOpenTour = !isOpenTour"
    ></div>

    <v-overlay v-if="isLoading" z-index="2000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div class="d-flex justify-end flex-wrap">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn
        class="mt-3 mr-3 secondary"
        :style="{
          position: 'fixed',
          top: `${appBarHeight}px`,
          right: '0px',
          'z-index': 2,
        }"
        @click="share"
      >
        <!-- style="position: fixed; top: 140px; right: 0; z-index: 1" -->
        <background-svg
          class="mt-1"
          backgroungUrl="/share.svg"
          width="16px"
          height="16px"
          color="#fff"
        ></background-svg>
        立即分享
      </v-btn>
    </div>
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="white"
        fixed-tabs
        icons-and-text
        centered
        show-arrows
        class="mb-4"
      >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab
          v-for="(item, i) in tabItems"
          :key="i"
          :href="'#tab-' + i"
          @click="currentTab = i"
        >
          {{ item.text }}
          <v-badge
            v-show="item.length"
            color="red"
            :content="item.length"
            offset-x="-35"
            offset-y="12"
          >
          </v-badge>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <div v-if="tab === 'tab-0'">
          <div class="mx-auto promo-code-input">
            <v-text-field
              :class="{ 'tour-step-backdrop': isOpenTour }"
              outlined
              placeholder="輸入折價券優惠碼"
              prepend-inner-icon="$pec_ticket"
              hide-details="auto"
              v-model="promoCode"
            >
              <!-- color="#757575" -->
              <template v-slot:append>
                <v-btn
                  color="primary"
                  @click="sendPromoCode"
                  :loading="promoBtnLoading"
                  :class="{ 'tour-step-backdrop-btn': isOpenTour }"
                >
                  完成輸入
                </v-btn>
              </template>
            </v-text-field>
          </div>
          <div class="mt-4 mb-4 text-center">
            折價券使用說明，詳情請至
            <router-link to="/faq/coupon"> 【常見問題】 </router-link>
            內查閱。
          </div>
          <div class="d-flex align-center justify-end mr-3 mb-2" style="gap: 8px; flex-wrap: wrap;">
            <!-- 有勾選且在「可使用」分類時才顯示轉贈與取消勾選 -->
            <template v-if="currentTab == 0 && readStatus == '可使用' && checkedItemLength > 0">
              <v-btn
                class="ma-0"
                color="primary"
                depressed
                style="min-width: 80px;"
                @click="getGiftDialogData"
              >
                轉贈
              </v-btn>
              <v-btn
                class="ma-0"
                color="primary"
                outlined
                style="min-width: 80px;"
                @click="clearCheckbox"
              >
                取消勾選
              </v-btn>
            </template>
            <!-- 篩選按鈕：展開於同一列 -->
            <template v-if="currentTab == 0">
              <v-btn
                v-for="(item, index) in readStatusArray"
                v-show="!(checkedItemLength > 0 && item.text == '可使用')"
                :key="index"
                :dark="item.text == readStatus"
                :depressed="item.text == readStatus"
                :outlined="item.text != readStatus"
                color="primary"
                elevation="0"
                @click="readStatus = item.text"
              >
                {{ item.text }}
              </v-btn>
            </template>
          </div>
        </div>
        <v-tab-item v-for="(item, i) in tabItems" :key="i" :value="'tab-' + i">
          <v-card flat>
            <v-container fluid v-if="!isLoading">
              <v-row v-if="ticketArray[currentTab].length">
                <v-col
                  cols="12"
                  v-for="(ticket, index) in filterTicketArray"
                  :key="index"
                  class="d-flex py-0 mb-4"
                >
                  <v-card
                    tile
                    outlined
                    elevation="0"
                    class="left-card"
                    :style="
                      (readStatus == '已用/過期/作廢' ||
                        readStatus == '已轉贈') &&
                      currentTab == 0
                        ? {
                            'border-color': '#bbbbbb',
                            'background-color': '#bbbbbb',
                            'border-right': '2px dashed #bbbbbb',
                          }
                        : ''
                    "
                  >
                    <div
                      class="checkbox-outer"
                      v-if="ticket.hasOwnProperty('checkbox')"
                    >
                      <div
                        class="ribbon-wrap"
                        v-if="
                          ticket.gifter_emp_no &&
                          ticket.reward_status == 'receive'
                        "
                      >
                        <div class="ribbon" style="background-color: #006162">
                          受贈
                        </div>
                      </div>
                      <div
                        class="ribbon-wrap"
                        v-else-if="ticket.reward_status == 'reissued'"
                      >
                        <div class="ribbon">補發</div>
                      </div>
                      <div
                        class="ribbon-wrap"
                        v-else-if="ticket.reward_status == 'expired'"
                      >
                        <div class="ribbon" style="background-color: #656565">
                          過期
                        </div>
                      </div>
                      <div
                        class="ribbon-wrap"
                        v-else-if="ticket.reward_status == 'give_away'"
                      >
                        <div class="ribbon" style="background-color: #656565">
                          轉贈
                        </div>
                      </div>
                      <span
                        class="pa-0 ma-0 checkbox pl-1"
                        v-if="readStatus == '可使用'"
                        @click="toggleCheckbox(ticket)"
                      >
                        <span v-if="ticket.gift_mark == 'Y'">
                          <svg
                            v-if="!ticket.checkbox"
                            width="20"
                            height="20"
                            viewBox="0 0 127 127"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.5"
                              y="1.5"
                              width="124"
                              height="124"
                              rx="3.5"
                              fill="white"
                              stroke="white"
                              stroke-width="3"
                            />
                          </svg>
                          <svg
                            v-else
                            width="20"
                            height="20"
                            viewBox="0 0 127 127"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.5"
                              y="1.5"
                              width="124"
                              height="124"
                              rx="3.5"
                              fill="#F78233"
                              stroke="white"
                              stroke-width="3"
                            />
                            <line
                              x1="25.6196"
                              y1="71.6484"
                              x2="45.9874"
                              y2="97.3296"
                              stroke="white"
                              stroke-width="8"
                              stroke-linecap="round"
                            />
                            <line
                              x1="46.0943"
                              y1="97.3439"
                              x2="107.547"
                              y2="37.9057"
                              stroke="white"
                              stroke-width="8"
                              stroke-linecap="round"
                            />
                          </svg>
                        </span>
                        <span v-else>
                          <span style="width: 20px"></span>
                        </span>
                      </span>
                    </div>
                    <v-card-text
                      class="white--text d-flex align-center justify-center"
                      style="height: 100%; position: relative"
                    >
                      <div class="text-center reward-text">
                        <div>
                          <span class="text-h3">$</span>
                          <span class="text-h3">{{ ticket.amount }}</span>
                        </div>
                        <div class="text-center small">
                          購物車滿{{ ticket.amount_reached }}元使用
                        </div>
                      </div>
                      <div
                        class="text-h6 multiple"
                        :style="
                          (readStatus == '已用/過期/作廢' ||
                            readStatus == '已轉贈') &&
                          currentTab == 0
                            ? {
                                color: '#bbbbbb',
                              }
                            : ''
                        "
                      >
                        <span>
                          {{ ticket.receive_num > 999 ? '' : 'x'
                          }}{{ ticket.receive_num }}
                        </span>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-card
                    tile
                    outlined
                    elevation="0"
                    class="right-card"
                    style="overflow: hidden"
                    :style="
                      (readStatus == '已用/過期/作廢' ||
                        readStatus == '已轉贈') &&
                      currentTab == 0
                        ? {
                            'border-left': '2px dashed #bbbbbb',
                          }
                        : ''
                    "
                  >
                    <v-card-text class="pa-2 overflow-ellipsis">
                      <div class="text-h6 black--text">
                        {{ ticket.reward_name }}
                      </div>
                      <div>
                        有效期限 :
                        {{ $dayjs(ticket.start_date).format('MM/DD') }} ~
                        {{ $dayjs(ticket.end_date).format('MM/DD') }}
                      </div>
                      <!-- <div>
                        *一張折價券限用單台購物車商品。詳情見(折價券使用說明)
                      </div> -->
                      <div v-if="ticket.condition == 'N'">
                        *部分商品適用。
                        <span
                          v-if="
                            (ticket.include && ticket.include.length) ||
                            (ticket.exclude && ticket.exclude.length)
                          "
                          @click="openDialog(ticket)"
                        >
                          <background-svg
                            backgroungUrl="/error_outline.svg"
                            width="16px"
                            height="16px"
                            color="#d86816"
                            class="error-outline"
                          ></background-svg>
                          <span
                            class="ml-4 secondary--text text--base"
                            style="cursor: pointer"
                            >(點我了解更多)</span
                          >
                        </span>
                      </div>
                      <div v-else>*全站商品適用。</div>
                      <div v-if="currentTab == 1">
                        限量{{ ticket.available_num }}份，每人限領一份，領完為止
                      </div>

                      <div class="d-flex justify-start mt-2">
                        <router-link
                          v-if="ticket.link == 'Y'"
                          class="d-flex mr-2"
                          :class="{ 'cursor-default': ticket.link == 'N' }"
                          style="text-decoration: none; color: inherit"
                          :disabled="ticket.link == 'Y' ? false : true"
                          :to="`/coupon?id=${ticket.reward_id}`"
                        >
                          <v-btn
                            small
                            elevation="0"
                            rounded
                            color="primary base"
                            >適用商品</v-btn
                          ></router-link
                        >
                        <!-- <v-btn
                          v-if="
                            currentTab == 0 &&
                            (ticket.reward_status == 'receive' ||
                              ticket.reward_status == 'give_away')
                          "
                          class="mr-2"
                          small
                          dark
                          elevation="0"
                          rounded
                          color="#005ce6"
                          @click="
                            openGiftInfoDialog(
                              ticket,
                              ticket.reward_status == 'receive'
                                ? '贈與人'
                                : '受贈者'
                            )
                          "
                          >{{
                            ticket.reward_status == 'receive'
                              ? '贈與人'
                              : '受贈者'
                          }}</v-btn
                        > -->
                        <span v-if="currentTab == 0 && readStatus == '可使用'">
                          <v-btn
                            small
                            elevation="0"
                            rounded
                            color="primary base"
                            @click="getGiftDialogData"
                            v-if="ticket.gift_mark == 'Y'"
                          >
                            轉贈
                          </v-btn>
                          <v-btn
                            small
                            elevation="0"
                            rounded
                            color="grey"
                            dark
                            style="pointer-events: none !important"
                            v-else
                          >
                            不可轉贈
                          </v-btn>
                        </span>
                        <!-- for 折價券領用 -->
                        <div v-if="currentTab == 1">
                          <v-btn
                            v-if="ticket.showUpcomingTime"
                            small
                            elevation="0"
                            rounded
                            color="secondary lighten-1"
                            style="pointer-events: none"
                          >
                            {{
                              $dayjs(ticket.issued_start_date).format(
                                'MM/DD HH:mm'
                              )
                            }}
                            準時開搶
                          </v-btn>
                          <v-btn
                            v-else
                            small
                            elevation="0"
                            rounded
                            color="secondary base"
                            :loading="ticket.btnLoading"
                            :disabled="ticket.insertBtnDisabled"
                            @click="insertReward(ticket)"
                          >
                            {{ ticket.insertBtnText }}</v-btn
                          >
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12">
                  <div class="text-center my-5">
                    無{{ currentTab ? '可領' : '我的' }}折價券
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>適用範圍 </v-card-title>
        <v-card-text class="text-body-1">
          <div class="grid-container">
            <div class="grid-item d-flex align-center justify-center">
              適用於
            </div>
            <div class="grid-item2">
              <small>
                <div v-for="(item, index) in dialogData.include" :key="index">
                  {{ item }}
                </div>
              </small>
            </div>
            <div class="grid-item d-flex align-center justify-center">
              不適用於
            </div>
            <div class="grid-item2">
              <small>
                <div v-for="(item, index) in dialogData.exclude" :key="index">
                  {{ item }}
                </div>
              </small>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary base" text @click="dialog = false">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="giftInfoDialog" max-width="500">
      <v-card v-if="giftInfoDialogData.info && giftInfoDialogData.info.length">
        <v-card-title>{{ giftInfoDialogData.name }} </v-card-title>
        <v-card-text>
          <template>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>{{ giftInfoDialogData.type.slice(0, 2) }}日期</th>
                    <th>{{ giftInfoDialogData.type.slice(0, 2) }}張數</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(info, i) in giftInfoDialogData.info" :key="i">
                    <td>{{ info.gift_date || info.receive_date }}</td>
                    <td>{{ info.qty }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary lighten-1"
            small
            @click="giftInfoDialog = false"
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="giftDialog" persistent scrollable max-width="600">
      <v-card>
        <v-card-title>贈與折價券</v-card-title>
        <v-card-text class="text-body-1 pt-2">
          <v-form lazy-validation ref="form">
            <template v-for="(item, index) in giftDialogData">
              <div :key="index">
                <div>
                  {{ item.reward_name }}
                </div>

                <v-card outlined class="pa-2 mb-4">
                  <v-card-text class="text-body-1 pa-0">
                    <div class="primary--text">
                      <div class="small-text">金額</div>
                      {{ item.amount }} (滿{{ item.amount_reached }}使用)
                    </div>
                    <div class="my-2">
                      <div class="small-text">期限</div>
                      {{ $dayjs(item.start_date).format('MM/DD') }} ~
                      {{ $dayjs(item.end_date).format('MM/DD') }}
                    </div>
                    <div>
                      <div class="small-text mb-1">
                        數量{{ `(共${item.receive_num}張)` }}
                      </div>
                      <v-text-field
                        outlined
                        dense
                        hide-details="auto"
                        type="number"
                        :max="item.receive_num"
                        min="1"
                        v-model.number="item.gift_reward_num"
                        :rules="[
                          value =>
                            value <= item.receive_num ||
                            `不得大於${item.receive_num}`,
                          value => !!value || '不得為空',
                        ]"
                      ></v-text-field>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </template>
          </v-form>
          <v-divider class="mb-3"></v-divider>
          <div class="d-flex">
            <v-text-field
              label="受贈者手機"
              placeholder="請先輸入受贈者手機"
              outlined
              dense
              class="gift-input"
              type="number"
              v-model="giftedPhone"
              hide-details="auto"
            ></v-text-field>
            <v-btn
              dense
              color="primary"
              class="gift-btn"
              elevation="0"
              @click="searchGiftedPhone"
            >
              尋找</v-btn
            >
          </div>
          <v-select
            :items="giftedPeople"
            label="選擇贈與人"
            outlined
            item-text="display_name"
            item-value="username"
            dense
            :disabled="getRewardReceiver"
            v-model="selectGiftedPerson"
            hide-details="auto"
            class="my-3"
          ></v-select>
          <div class="subtitle-2 grey--text text--darken-3">
            <p>
              電子折價券轉贈權益說明:
              <br />
              消費者欲使用UNI電子折價券之轉贈功能,需先登入UNI團購網會員帳號,並選擇欲轉贈之
              折價券、數量,並正確輸入受贈者會員手機號碼(受贈者須為UNI團購網會員)。
              <br />
              消費者於折價券專區之折價券確定轉贈他人後,視同已使用該折價券,轉贈者不得回收,
              每張折價券僅限轉贈一次,該折價券經轉贈後,受贈者可再轉贈他人。
              <br />
              折價券經確認轉贈後,即無法回復,轉贈者務必在轉出前確認相關輸入資訊是否正確,
              如:轉贈折價券金額、數量、受贈對象...等資訊。
              <br />
              *若消費者誤將受贈者電話號碼、轉贈數量...等資訊輸入錯誤,而轉贈予錯誤對象,
              恕本公司無賠償之義務,該轉贈品折價券亦無法回復。
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!selectGiftedPerson"
            @click="
              confirmDialog = true
              giftDialog = false
            "
          >
            <!-- @click="giftReward" -->
            轉贈
          </v-btn>
          <v-btn color="primary" text @click="giftDialog = false"> 取消 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent scrollable max-width="600">
      <v-card>
        <v-card-title>確定轉贈</v-card-title>
        <v-card-text class="pt-2 black--text">
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>轉贈折價券金額</th>
                  <th>張數</th>
                  <th class="text-right">總計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in giftDialogData" :key="index">
                  <td>{{ item.amount }}元</td>
                  <td>{{ item.gift_reward_num }}</td>
                  <td class="text-right">
                    {{ item.amount * item.gift_reward_num }}元
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td class="text-right">總計 {{ totalGiftRewardCount }} 元</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="my-2">
            <div>將轉贈給</div>
            <v-row>
              <v-col cols="6"
                >姓名:
                {{
                  giftedPeople.find(e => e.username == selectGiftedPerson) &&
                  giftedPeople.find(e => e.username == selectGiftedPerson)
                    .display_name
                }}</v-col
              >
              <v-col cols="6">電話: {{ giftedPhone }}</v-col>
            </v-row>
          </div>
          <p class="mt-7">
            *若消費者誤將受贈者電話號碼、轉贈數量等資訊輸入錯誤，而轉贈予錯誤對象，恕本公司無賠償之義務，該轉贈品折價券亦無法回復。
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="giftReward"> 確定轉贈 </v-btn>
          <v-btn color="primary" text @click="confirmDialog = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="promoCodeDialog" persistent scrollable max-width="450">
      <v-card class="py-2">
        <v-card-text class="black--text text-center pt-3 pb-0">
          <div
            class="text-h5 font-weight-bold mb-4"
            :class="
              promoStatus.status == 'success' ? 'primary--text' : 'black--text'
            "
          >
            <span
              :style="
                promoStatus.status == 'success'
                  ? {
                      borderBottom: '2px solid var(--v-primary-base)',
                      paddingLeft: '8px',
                    }
                  : { borderBottom: '2px solid black' }
              "
            >
              {{ promoStatus.title }}</span
            >
          </div>
          <div
            v-if="promoStatus.status == 'success'"
            class="text-h6"
            style="font-weight: 600"
          >
            折價券名稱: {{ promoStatus.reward[0].reward_name }}
          </div>
          <div class="text-body-1" style="line-height: 2">
            <div v-if="promoStatus.status == 'success'">
              有效期限 :
              {{
                this.$dayjs(promoStatus.reward[0].start_date).format('MM/DD')
              }}
              ~
              {{ this.$dayjs(promoStatus.reward[0].end_date).format('MM/DD') }}
              <br />
              適用範圍：全站商品適用
              <br />
              <!-- 使用限制：一張折價券限用單台購物車商品
              <br /> -->
              在領取成功後，可在
              <span class="text-decoration-underline" style="font-weight: 600"
                >我的折價券</span
              >
              查看已領取的折價券
            </div>
            <div v-if="promoStatus.status == 'finished'">
              非常抱歉，折價券優惠碼已經被領取完畢。
              <br />
              請您關注未來的促銷活動，以獲得更多優惠！。
            </div>
            <div v-if="promoStatus.status == 'claimed'">
              您可能已經領取過相同的折價券，因此無法再次使用。
              <br />
              請檢查您的折價券列表。
            </div>
            <div v-if="promoStatus.status == 'error'">
              您輸入的折價券優惠碼可能已過期、不存在或不正確。
              <br />
              請再次檢查輸入的優惠碼。
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="mt-3 mb-1">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            elevation="0"
            style="height: 36px; width: 96px"
            @click="promoCodeDialog = false"
          >
            確定
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

// ── Mock 資料（取代 API）────────────────────────────────────
const MOCK_MY_REWARD = [
  {
    reward_id: 1,
    reward_name: '全站滿額折扣券',
    reward_amount: 100,
    amount_reached: 1000,
    start_date: '2026-07-01 00:00',
    end_date: '2026-07-31 23:59',
    condition: 'Y',
    reward_status: 'self',
    gift_mark: 'Y',
    receive_num: 3,
    link: 'Y',
    gifter_emp_no: null,
    include: [],
    exclude: [],
  },
  {
    reward_id: 2,
    reward_name: '指定商品折扣券',
    reward_amount: 50,
    amount_reached: 500,
    start_date: '2026-07-05 00:00',
    end_date: '2026-08-05 23:59',
    condition: 'N',
    reward_status: 'receive',
    gift_mark: 'N',
    receive_num: 1,
    link: 'N',
    gifter_emp_no: 'EMP001',
    include: [],
    exclude: [],
  },
  {
    reward_id: 3,
    reward_name: '週年慶優惠券',
    reward_amount: 200,
    amount_reached: 2000,
    start_date: '2026-06-01 00:00',
    end_date: '2026-06-30 23:59',
    condition: 'Y',
    reward_status: 'expired',
    gift_mark: 'Y',
    receive_num: 1,
    link: 'N',
    gifter_emp_no: null,
    include: [],
    exclude: [],
  },
  {
    reward_id: 4,
    reward_name: '補發優惠券',
    reward_amount: 80,
    amount_reached: 800,
    start_date: '2026-07-10 00:00',
    end_date: '2026-08-10 23:59',
    condition: 'Y',
    reward_status: 'reissued',
    gift_mark: 'Y',
    receive_num: 2,
    link: 'Y',
    gifter_emp_no: null,
    include: [],
    exclude: [],
  },
]

const MOCK_AVAILABLE_REWARD = [
  {
    id: 10,
    reward_id: 10,
    reward_name: '新會員歡迎券',
    reward_amount: 150,
    amount_reached: 1500,
    start_date: '2026-07-01 00:00',
    end_date: '2026-08-31 23:59',
    condition: 'Y',
    available_num: 100,
    issued_num: 45,
    received_num: 0,
    issued_start_date: '2026-07-01 00:00',
    display_date: '2026-07-01 00:00',
    link: 'Y',
    include: [],
    exclude: [],
  },
  {
    id: 11,
    reward_id: 11,
    reward_name: '限量搶購大折扣',
    reward_amount: 300,
    amount_reached: 3000,
    start_date: '2026-07-10 00:00',
    end_date: '2026-07-20 23:59',
    condition: 'N',
    available_num: 20,
    issued_num: 20,
    received_num: 0,
    issued_start_date: '2026-07-10 00:00',
    display_date: '2026-07-10 00:00',
    link: 'N',
    include: [],
    exclude: [],
  },
  {
    id: 12,
    reward_id: 12,
    reward_name: '即將開搶優惠券',
    reward_amount: 200,
    amount_reached: 2000,
    start_date: '2026-07-15 00:00',
    end_date: '2026-07-25 23:59',
    condition: 'Y',
    available_num: 50,
    issued_num: 0,
    received_num: 0,
    issued_start_date: '2026-07-15 10:00',
    display_date: '2026-07-14 00:00',
    link: 'Y',
    include: [],
    exclude: [],
  },
]

const MOCK_REWARD_CONDITION = [
  {
    reward_id: 2,
    condition_array: [
      { condition_type: 'INCLUDE', condition_key_name: '生鮮食品', condition_value_name: '蔬菜' },
      { condition_type: 'INCLUDE', condition_key_name: '生鮮食品', condition_value_name: '水果' },
      { condition_type: 'EXCLUDE', condition_key_name: '進口商品', condition_value_name: '日本' },
      { condition_type: 'EXCLUDE', condition_key_name: '進口商品', condition_value_name: '韓國' },
    ],
  },
]
// ────────────────────────────────────────────────────────────

export default {
  name: 'RewardStyleA',
  components: { BackgroundSvg },
  created() {
    this.fetchReward()
    window.appShareToWeb = this.shareResult
    if (window.previousUrl == '/share') {
      this.isFromShare = 'Y'
    }
    this.url = new URL(location.href)
    if (this.url.searchParams.get('tab')) {
      this.tab = this.url.searchParams.get('tab')
      this.currentTab = Number(
        this.url.searchParams.get('tab').split('tab-')[1]
      )
    }

    if (this.$route.query.code && this.$route.query.tab !== 'tab-1') {
      this.$nextTick(() => {
        this.isOpenTour = true
        this.promoCode = this.$route.query.code
      })
    }
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
          text: '折價券',
          to: '/reward',
        },
      ],
      tab: null,
      tabItems: [
        { text: '我的折價券', length: 0 },
        { text: '可領折價券', length: 0 },
      ],
      currentTab: 0,
      ticketArray: [[], []],
      isFromShare: 'N',
      dialog: false,
      dialogData: {
        include: [],
        exclude: [],
      },
      checkedItemLength: 0,
      giftDialog: false,
      giftDialogData: null,
      giftedPhone: '',
      giftedPeople: [],
      getRewardReceiver: true,
      selectGiftedPerson: '',
      filterDrawer: false,
      readStatusArray: [
        {
          text: '可使用',
        },
        {
          text: '已用/過期/作廢',
        },
        // {
        //   text: '已轉贈',
        // },
      ],
      readStatus: '可使用',
      giftInfoDialog: false,
      giftInfoDialogData: {
        type: '',
        info: {},
      },
      confirmDialog: false,
      promoCodeDialog: false,
      promoCode: '',
      promoStatus: {},
      promoBtnLoading: false,
      isOpenTour: false,
      conditionList: [],
    }
  },
  computed: {
    ...mapState(['isAndroid']),
    canShare() {
      return window.navigator.canShare && !window.GroupJSInterface
    },
    canShareMobile() {
      return window.GroupJSInterface
    },
    filterTicketArray() {
      if (this.currentTab == 0) {
        let list
        switch (this.readStatus) {
          case '可使用':
            list = this.ticketArray[this.currentTab].filter(
              e =>
                e.reward_status == 'self' ||
                e.reward_status == 'receive' ||
                e.reward_status == 'reissued'
            )
            break
          case '已用/過期/作廢':
            list = this.ticketArray[this.currentTab].filter(
              e =>
                e.reward_status == 'expired' ||
                e.reward_status == 'used' ||
                e.reward_status == 'invalid'
            )
            break
          case '已轉贈':
            list = this.ticketArray[this.currentTab].filter(
              e => e.reward_status == 'give_away'
            )
            break

          default:
            list = this.ticketArray[this.currentTab].filter(
              e =>
                e.reward_status == 'self' ||
                e.reward_status == 'receive' ||
                e.reward_status == 'reissued'
            )
            break
        }
        return list
      } else {
        return this.ticketArray[this.currentTab]
      }
    },
    appBarHeight() {
      return document.querySelector('.v-app-bar')
        ? document.querySelector('.v-app-bar').clientHeight
        : 64
    },
    totalGiftRewardCount() {
      let count = this.giftDialogData.map(e => e.amount * e.gift_reward_num)
      let reduce = count.reduce((acc, cur) => acc + cur)
      return reduce
    },
  },
  watch: {
    filterTicketArray: {
      deep: true,
      handler(val) {
        if (!this.currentTab) {
          this.tabItems[0].length = val.length
        }
      },
    },
    readStatus() {
      this.clearCheckbox()
    },
  },
  methods: {
    fetchReward() {
      this.isLoading = true
      return Promise.all([this.myReward(), this.availableReward()])
        .then(res => {
          let data = res.map(e =>
            e.result
              .map(x => {
                x.amount = x.reward_amount ? x.reward_amount : x.amount
                return x
              })
              .sort((a, b) =>
                new Date(a.end_date) > new Date(b.end_date) ? 1 : -1
              )
          )
          this.ticketArray = data
          this.ticketArray[0] = this.ticketArray[0].map(e => ({
            ...e,
            checkbox: false,
          }))
          this.ticketArray[1] = this.ticketArray[1].map(e => {
            e.btnLoading = false
            if (e.received_num > 0) {
              e.insertBtnDisabled = true
              e.insertBtnText = '已達領取上限'
            } else {
              if (e.available_num == e.issued_num) {
                e.insertBtnDisabled = true
                e.insertBtnText = '搶購完畢'
              } else {
                e.insertBtnDisabled = false
                e.insertBtnText = '領取'
              }
            }
            if (e.received_num > 0 && e.available_num == e.issued_num) {
              e.insertBtnDisabled = true
              e.insertBtnText = '搶購完畢'
            }
            if (!e.display_date) {
              e.display_date = e.issued_start_date
            }
            if (
              new Date(e.display_date) <= new Date() &&
              new Date() <= new Date(e.issued_start_date)
            ) {
              e.showUpcomingTime = true
            } else {
              e.showUpcomingTime = false
            }
            return e
          })
          if (this.readStatus == '可使用') {
            this.tabItems[0].length = data[0].filter(
              e =>
                e.reward_status == 'self' ||
                e.reward_status == 'receive' ||
                e.reward_status == 'reissued'
            ).length
          }
          this.tabItems[1].length = data[1].length

          // fake data
          // this.ticketArray[1].push({
          //   amount: 999,
          //   amount_reached: 1000,
          //   condition: 'Y',
          //   end_date: '2022-11-30 10:49',
          //   exclude: [],
          //   gifter_emp_no: null,
          //   gift_info: [],
          //   id: 0,
          //   include: [],
          //   link: 'Y',
          //   receive_num: 77,
          //   reward_amount: 0,
          //   reward_id: 358,
          //   reward_name: 'reward_name',
          //   start_date: '2022-11-01 10:49',
          //   reward_status: 'self',
          //   checkbox: false,
          // })
        })
        .finally(async () => {
          await this.rewardCondition()
          this.isLoading = false
          let urlParams = new URLSearchParams(window.location.search)
          // available、user
          let type = urlParams.get('type')
          if (type == 'available') {
            this.tab = 'tab-1'
            this.currentTab = 1
          }
        })
    },
    myReward() {
      return Promise.resolve({ result: MOCK_MY_REWARD })
    },
    availableReward() {
      return Promise.resolve({ result: MOCK_AVAILABLE_REWARD })
    },
    rewardCondition() {
      return Promise.resolve({ result: MOCK_REWARD_CONDITION }).then(res => {
        this.conditionList = res.result
        this.conditionList.map(con => {
          for (let i = 0; i < this.ticketArray[0].length; i++) {
            if (this.ticketArray[0][i].reward_id == con.reward_id) {
              this.ticketArray[0][i].include = []
              this.ticketArray[0][i].exclude = []
              this.ticketArray[0][i].condition = 'N'
              con.condition_array.map(e => {
                if (e.condition_type == 'INCLUDE') {
                  this.ticketArray[0][i].include.push(
                    `${e.condition_key_name} - ${e.condition_value_name}`
                  )
                }
                if (e.condition_type == 'EXCLUDE') {
                  this.ticketArray[0][i].exclude.push(
                    `${e.condition_key_name} - ${e.condition_value_name}`
                  )
                }
              })
            }
          }
        })
      })
    },
    insertReward(ticket) {
      ticket.btnLoading = true
      return new Promise(resolve => setTimeout(resolve, 800))
        .then(() => {
          this.$snackbar.add('領取成功', { color: 'success', timeout: 2000 })
        })
        .finally(() => {
          ticket.btnLoading = false
          this.fetchReward()
        })
    },
    share() {
      if (this.canShare) {
        const shareData = {
          title: '統一團購網',
          text: this.items[1].text,
          url: window.location.href,
        }
        navigator.share(shareData)
      } else if (this.canShareMobile) {
        const shareData = {
          title: '統一團購網',
          text: this.items[1].text,
          url: (this.isAndroid ? ' ' : '') + window.location.href,
        }
        if (window.GroupJSInterface.shareToApp) {
          window.GroupJSInterface.shareToApp(JSON.stringify(shareData))
        } else {
          this.$snackbar.add(`此分享功能需要更新至最新 app 版本`, {
            color: 'success',
          })
        }
      }
    },
    shareResult() {
      this.$snackbar.add(`分享成功`, { color: 'success' })
    },
    openDialog(ticket) {
      this.dialog = true
      this.dialogData = {
        include: ticket.include,
        exclude: ticket.exclude,
      }
    },
    searchGiftedPhone() {
      this.giftedPeople = [
        { username: 'mock_user_001', display_name: '王小明（展示）' },
      ]
      this.selectGiftedPerson = 'mock_user_001'
      this.getRewardReceiver = false
      this.$snackbar.add('成功取得受贈者列表', {
        color: 'success',
        timeout: 2000,
      })
    },
    giftReward() {
      if (this.$refs.form.validate()) {
        this.confirmDialog = false
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false
          this.$snackbar.add('轉贈成功', { color: 'success', timeout: 2000 })
          this.giftDialog = false
          this.selectGiftedPerson = ''
          this.giftedPeople = []
          this.giftedPhone = ''
          this.fetchReward()
        }, 800)
      } else {
        this.$snackbar.add('請確認所有贈送數量皆為正確!', { timeout: 2000 })
      }
    },
    toggleCheckbox(ticket) {
      if (ticket.gift_mark !== 'Y') {
        return
      }

      ticket.checkbox = !ticket.checkbox
      // this.changeCheckbox()
      this.checkedItemLength = this.ticketArray[0].filter(
        e => e.checkbox
      ).length
      this.$forceUpdate()
    },
    getGiftDialogData() {
      if (this.checkedItemLength == 0) {
        this.$snackbar.add('請勾選欲轉贈之折價券')
      } else if (this.readStatus !== '可使用') {
        this.$snackbar.add('目前分類無轉贈功能')
      } else {
        this.giftDialog = true
        this.giftDialogData = this.ticketArray[0]
          .filter(e => e.checkbox)
          .map(e => ({
            ...e,
            gift_reward_num: 1,
          }))
      }
    },
    openGiftInfoDialog(ticket, type) {
      this.giftInfoDialog = true
      this.giftInfoDialogData = {
        type: type,
        name:
          type == '贈與人'
            ? `${type}:${ticket.gifter_info.gifter_name}`
            : `${type}:${ticket.receiver_info.receiver_name}`,
        info:
          type == '贈與人'
            ? ticket.gifter_info.gift_info
            : ticket.receiver_info.receive_info,
      }
    },
    clearCheckbox() {
      this.ticketArray[0] = this.ticketArray[0].map(e => {
        e.checkbox = false
        return e
      })
      this.checkedItemLength = 0
      this.$forceUpdate()
    },
    sendPromoCode() {
      this.isOpenTour = false
      this.promoBtnLoading = true
      setTimeout(() => {
        this.promoStatus = {
          status: 'success',
          title: '恭喜您成功領取折價券！',
          reward: [
            {
              reward_name: '展示折價券',
              start_date: '2026-07-01',
              end_date: '2026-08-31',
            },
          ],
        }
        this.promoCodeDialog = true
        this.promoBtnLoading = false
        this.promoCode = ''
      }, 600)
    },
  },
}
</script>
<style scoped>
.cursor-default {
  cursor: default !important;
}
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
.left-card {
  min-width: 200px;
  border-color: var(--v-secondary-lighten1);
  background-color: var(--v-secondary-lighten1);
  border-right: 2px dashed var(--v-secondary-lighten1);
  border-left: 2px dashed #fff;
  position: relative;
}
.right-card {
  width: 100%;
  border-color: rgba(0, 0, 0, 0.12);
  border-left: 2px dashed var(--v-secondary-lighten1);
}
.overflow-ellipsis div {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.error-outline {
  display: inline;
  position: relative;
  cursor: pointer;
}
::v-deep .error-outline > img {
  position: absolute;
  top: 0;
}
.grid-container {
  display: grid;
  grid-template-columns: 1fr minmax(200px, 3fr);
  /* padding: 10px; */
  gap: 1px;
  outline: 1px solid rgba(0, 0, 0, 0.12);
}
.grid-item {
  outline: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
  grid-column: 1/2;
  overflow-wrap: break-word;
  width: 100%;
  height: 100%;
}
.grid-item2 {
  outline: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
  grid-column: 2/5;
  overflow-wrap: break-word;
  width: 100%;
  height: 100%;
}
.multiple {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  color: var(--v-secondary-lighten1);
  display: grid;
  place-items: center;
  font-size: 18px !important;
  font-weight: normal;
  position: absolute;
  right: 3px;
  top: 3px;
  font-size: 12px !important;
  font-weight: bold;
}
.checkbox-outer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  width: 24px;
}
.ribbon-wrap {
  width: 60px;
  height: 60px;
  overflow: hidden;
  position: absolute;
  top: -5px;
  left: -5px;
}
.ribbon {
  position: relative;
  left: -23px;
  top: 5px;
  width: 80px;
  background-color: #006064;
  /* color: #fb8c00; */
  color: #fff;
  padding: 4px 0;
  text-align: center;
  transform: rotate(-45deg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  text-align: center;
}
.ribbon:before {
  content: '';
  border-top: 4px solid #795548;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  position: absolute;
  bottom: -4px;
  left: 0;
}
.ribbon:after {
  content: '';
  border-top: 4px solid #795548;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  position: absolute;
  bottom: -4px;
  right: 0;
}
.checkbox >>> .material-icons {
  color: #fff !important;
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
.small-text {
  font-size: 0.8rem !important;
  line-height: 0.8rem !important;
}
.promo-code-input {
  max-width: 720px;
}
.promo-code-input >>> .v-input__append-inner {
  margin-top: 9.5px;
}
.tour-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1100;
  background-color: #000;
  opacity: 0.6;
  filter: alpha(opacity=60);
}
.tour-step-backdrop-btn::before {
  z-index: 1101;
  border-width: 10px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: #832f2f00;
  border-style: solid;
  bottom: -14px;
  top: auto;
  margin-left: -10px;
  content: ' ';
  border-top-width: 0;
  border-bottom-color: var(--v-primary-base);
  background-color: transparent;
  opacity: 1;
  left: 50%;
  cursor: auto;
  pointer-events: none;
}
.tour-step-backdrop-btn:hover::before,
.tour-step-backdrop-btn:focus::before {
  opacity: 1 !important;
}
.tour-step-backdrop-btn::after {
  z-index: 1101;
  position: absolute;
  display: block;
  content: '點擊領取折價券';
  padding: 8px 14px;
  margin: 0;
  font-size: 12px;
  background-color: var(--v-primary-base);
  /* border-bottom: 1px solid #ebebeb; */
  border-radius: 5px;
  top: 48px;
  cursor: auto;
  pointer-events: none;
  color: #fff;
}
.tour-step-backdrop {
  position: relative;
  z-index: 1101;
  background-color: #fff;
}
@media (max-width: 660px) {
  .left-card {
    min-width: 150px;
  }
  ::v-deep .v-card__text {
    padding: 8px;
  }
  ::v-deep .text-h3 {
    font-size: 2rem !important;
  }
  .small {
    font-size: 13px;
  }
  .promo-code-input {
    padding: 0 12px;
  }
}
@media (max-width: 435px) {
  .left-card {
    min-width: 125px;
  }
  ::v-deep .v-card__text {
    padding: 5px;
  }
  ::v-deep .text-h3 {
    font-size: 1.8rem !important;
  }
  .small {
    font-size: 12px;
  }
  .left-card .reward-text {
    margin-top: 16px;
  }
}
</style>
