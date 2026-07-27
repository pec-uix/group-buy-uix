<template>
  <v-container fluid class="pt-0">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-img src="/order-submited.jpg" class="pec-page"> </v-img>
    <pec-line></pec-line>
    <!-- 顯示maskedPan
    如果checkout card_id null 才顯示 
    -->
    <!-- <div
      class="text-center"
      v-if="Math.max(checkoutCount - logArray.length, 0) > 0"
    >
      <v-btn
        large
        color="primary"
        elevation="0"
        @click="activityInfoDialog = true"
        class="font-weight-bold"
      >
        <span style="font-size: 22px">恭喜您獲得本次活動資格！</span>
        <v-icon size="23">fa-regular fa-hand-pointer</v-icon>
      </v-btn>
    </div> -->
    <!-- <div v-if="$dayjs().isBetween('2024-12-01', '2025-02-28 23:59:59')">
      <div v-if="checkout.checkout_item_array.length >= 2">
        <div v-if="wheelLog?.award_id">
          <div class="text-center">
            <span
              class="activity-border"
              style="border: 1px solid var(--v-primary-base)"
            >
              <span
                class="activity-linear pa-3"
                style="
                  border-top-left-radius: 10px;
                  border-bottom-left-radius: 10px;
                "
                >轉盤活動</span
              >
              <span class="pa-3 primary--text"
                >恭喜您！轉中【{{ wheelLog.award_name }}】！</span
              >
            </span>
          </div>
        </div>
        <div v-else>
          <div class="text-center">
            <span
              class="pa-3 activity-linear activity-border cursor-pointer"
              @click="$router.push(`/prize-wheel/1561/checkout/${checkoutId}`)"
            >
              <span>恭喜您獲得本次活動資格！</span>
              <v-icon size="23" color="#fff">fa-regular fa-hand-pointer</v-icon>
            </span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="text-center">
          <span
            class="activity-border pa-3"
            style="border: 1px solid var(--v-primary-base)"
          >
            <span class="primary--text"
              >太可惜了！本次訂單未符合轉盤資格！</span
            >
          </span>
          <div
            class="text-decoration-underline primary--text text--lighten-2 mt-1"
            style="font-size: 14px"
          >
            <span @click="activityInfoDialog = true" class="cursor-pointer">
              轉盤活動說明
            </span>
          </div>
        </div>
      </div>
    </div> -->

    <h6 class="text-h6 my-2 pec-title-bl primary--text">
      結帳編號:{{ checkoutId }}
    </h6>
    <v-skeleton-loader
      v-if="isCheckLoading"
      type="list-item-three-line"
    ></v-skeleton-loader>
    <div v-else>
      <v-alert prominent text dense type="info" v-if="canQr">
        <div class="d-flex justify-space-between align-center">
          <span> 中國信託信用卡提供QR分期 </span>
          <v-btn color="info" outlined @click="to">前往QR分期</v-btn>
        </div>
      </v-alert>
      <div class="pa-2">
        <span>付款方式：</span
        ><span class="primary--text">
          {{ checkout.payment_type_name }}
          <template v-if="checkout.payment_type === '2'">
            ({{
              checkout.fisc_twqr_issuer_code
                ? `TWQR${checkout.fisc_twqr_issuer_name}`
                : checkout.payment_tool_name
            }})
          </template> </span
        ><v-btn
          class="white--text ml-4"
          color="primary"
          @click="bindCard"
          depressed
          small
          v-if="
            checkout.payment_status === '1' &&
            (checkout.payment_tool === 'C0' ||
              checkout.payment_tool === 'C2') &&
            checkout.card_id === null
          "
        >
          儲存信用卡，下次購物更方便
          <i class="fa-regular fa-hand-point-up ml-1"></i
        ></v-btn>
      </div>
      <v-divider></v-divider>
      <div class="pa-2">
        <span>付款狀態：</span
        ><span class="primary--text"> {{ checkout.payment_status_name }}</span>
        <v-btn
          class="ml-4"
          v-if="
            new Date(checkout.payment_deadline) > new Date() &&
            checkout.payment_status === '0' &&
            checkout.payment_type === '2'
          "
          depressed
          small
          color="secondary"
          @click="createPayment"
        >
          重新付款
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div v-if="checkout.receive_address" class="pa-2">
        <span>宅配地址：</span
        ><span class="primary--text"> {{ checkout.receive_address }}</span>
      </div>

      <v-list dense three-line>
        <v-subheader>結帳品項</v-subheader>
        <v-list-item
          class="px-2"
          v-for="checkoutItem in checkout.checkout_item_array"
          :key="checkoutItem.id"
          :to="`/product/${checkoutItem.product_id}`"
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
                <v-chip small outlined color="secondary">{{
                  checkoutItem.receive_type === '1'
                    ? checkoutItem.receive_area_name
                    : '宅配'
                }}</v-chip>
                <v-spacer></v-spacer>
                <div>
                  <span class="primary--text"
                    >${{ checkoutItem.discount_price }}</span
                  >
                  X{{ checkoutItem.order_num }}
                </div>
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <div class="d-flex justify-center mt-5">
      <v-btn outlined color="primary" to="/my-order">我的訂單</v-btn>
      <v-btn class="ml-4" depressed color="primary" :to="'/'">繼續購買</v-btn>
    </div>
    <v-dialog v-model="dialog_updateMail" width="500">
      <v-card>
        <v-card-title class="text-h6 primary white--text lighten-2">
          請提供有效的的 E-mail 資訊
        </v-card-title>
        <v-card-text class="mt-6"> 立即前往 /會員中心/會員資料 </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="grey--text lighten-1"
            text
            @click="dialog_updateMail = false"
          >
            稍後更新
          </v-btn>
          <v-btn color="info" text @click="toProfile()"> 立即前往 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="activityInfoDialog" max-width="480">
      <v-card class="py-2">
        <!-- <v-card-text class="black--text text-center pt-3 pb-0">
          <div class="primary--text text-h5 font-weight-bold mb-4">
            <span
              class="pl-2"
              style="border-bottom: 2px solid var(--v-primary-base)"
            >
              恭喜您獲得本次活動資格！</span
            >
          </div>
          <div class="text-body-1 font-weight-bold">
            通通有獎!
            <br />
            如您欲使用活動執行次數可點選
            <span class="primary--text">立即參加 </span>，
            <br />
            為避免影響您的會員權益，
            <br />
            敬請於活動期間內行使完畢!
          </div>
        </v-card-text>
        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" elevation="0" @click="goToActivity()">
            立即參加
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions> -->
        <v-card-text class="black--text pt-2 pb-0">
          <div class="primary--text text-h5 font-weight-bold mb-2">
            活動說明
          </div>
          <div class="text-body-1 font-weight-bold primary--text">
            任買2件團購網商品，轉盤購物金加碼送
            <br />
            每筆結帳訂單中購買二項（含以上）不同規格商品，待訂單成立依每筆結帳編
            號立即獲得轉盤購物金加碼送無門檻的電子折價券活動機會，一筆結帳編號可
            獲得一次轉盤機會，買越多轉越多，轉盤內除了1%、1.5%、2%購物金外另有精
            選好物獎項，本活動人人有獎。（轉盤獲得購物金計算將以單筆結帳編號金額進
            行計算，採個位數以四捨五入方式計算，發放折價券面額將以100元、10元、
            個位數元進行發送，精選好物獎項為隨機出貨無法自行選擇。）
          </div>
        </v-card-text>
        <v-card-actions class="mt-2">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            elevation="0"
            @click="activityInfoDialog = false"
          >
            關閉
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { apiAxios } from '@/api'
import PecLine from '@/components/PecLine.vue'
let ctbc = [
  '400361',
  '406586',
  '416217',
  '418230',
  '421013',
  '421016',
  '430451',
  '431195',
  '447757',
  '448709',
  '448710',
  '451873',
  '452552',
  '456301',
  '456319',
  '470348',
  '478466',
  '481537',
  '483515',
  '490856',
  '491819',
  '493404',
  '494352',
  '499875',
  '515352',
  '517357',
  '523953',
  '524689',
  '524920',
  '533785',
  '533786',
  '537675',
  '537805',
  '540829',
  '543372',
  '546697',
  '547785',
  '552049',
  '553002',
  '558888',
  '559569',
  '559570',
  '356051',
  '356351',
  '356537',
  '356550',
  '356551',
  '356560',
  '356575',
  '356651',
  '356712',
  '356714',
  '356718',
  '356724',
  '356812',
  '356813',
]
export default {
  props: ['checkoutId', 'needPayment'],
  components: {
    PecLine,
  },
  created() {
    this.init()
  },
  mounted() {
    window.addEventListener('pageshow', this.handlePageShow)
    // this.getActivityResult()
  },
  beforeDestroy() {
    window.removeEventListener('pageshow', this.handlePageShow)
  },
  data() {
    return {
      isCheckLoading: true,
      overlay: false,
      canInstallment: false,
      checkout: { checkout_item_array: [], masked_pan: '' },
      dialog_updateMail: false,
      logArray: [],
      checkoutCount: 0,
      activityRoute: '',
      activityInfoDialog: false,
      wheelLog: {},
      wheelId: '',
      hasExecutedPayment: false,
    }
  },
  computed: {
    canQr() {
      return (
        ctbc.some(x => (this.checkout.masked_pan || '').startsWith(x)) &&
        this.checkout.payment_status == '1' &&
        this.totalPrice >= 3000
      )
    },
    totalPrice() {
      return (
        this.checkout.checkout_item_array.reduce(
          (acc, cur) => acc + cur.discount_price * cur.order_num,
          0
        ) + this.checkout.shipment
      )
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
  },
  methods: {
    handlePageShow(event) {
      // 如果是從快取恢復頁面(返回上一頁),關閉 overlay¶
      if (event.persisted) {
        this.overlay = false
        this.init()
      }
    },
    init() {
      this.isCheckLoading = true
      return apiAxios({
        method: 'post',
        url: '/Checkout/GetCheckout',
        data: {
          checkout_id: this.checkoutId,
        },
      })
        .then(res => {
          this.checkout = res.result

          if (this.needPayment && !this.hasExecutedPayment) {
            this.hasExecutedPayment = true
            return this.createPayment()
          } else if (this.checkout.payment_type == '2') {
            return apiAxios({
              method: 'post',
              url: '/Checkout/VerifyPaymentStatus',
              data: {
                checkout_id: this.checkoutId,
              },
            }).then(() =>
              apiAxios({
                method: 'post',
                url: '/Checkout/GetCheckout',
                data: {
                  checkout_id: this.checkoutId,
                },
              }).then(res => (this.checkout = res.result))
            )
          }
          apiAxios({
            method: 'post',
            url: '/Users/VerifyEmails',
          }).then(res => {
            if (res.result == 'N') {
              this.dialog_updateMail = true
            }
          })
        })
        .finally(() => {
          this.isCheckLoading = false
        })
    },
    async getActivityResult() {
      const activityArray = await apiAxios({
        method: 'post',
        url: '/Activity/GetActivityArray',
        data: {},
      })
      if (activityArray.result.length) {
        const id = activityArray.result[0].id
        this.wheelId = id
        // this.activityRoute = activityArray.result[0].router_to
        // await apiAxios({
        //   method: 'post',
        //   url: '/Activity/GetActivityLogArray',
        //   data: { activity_id: id },
        // }).then(res => {
        //   this.logArray = res.result
        // })
        // await apiAxios({
        //   method: 'post',
        //   url: '/Activity/GetExecutionQuota',
        //   data: { activity_id: id },
        // }).then(res => {
        //   this.checkoutCount = res.result.quota
        // })
        await apiAxios({
          method: 'post',
          url: '/Activity/GetActivityLog',
          data: { activity_id: id, checkout_id: +this.checkoutId },
        }).then(res => {
          // this.logArray = res.result
          this.wheelLog = res.result
        })
      }
    },
    goToActivity() {
      if (this.activityRoute) {
        this.activityInfoDialog = false
        this.$router.push(this.activityRoute)
      } else {
        this.$snackbar.add('未獲得正確活動網址，請聯繫客服人員排查問題')
      }
    },
    to() {
      window.location.href =
        'https://www.ctbcbank.com/twrbo/zh_tw/onlinecounter_index/cc_service/QRCode_installment.html?QRCode=70486723000&external_browser=1'
    },
    createPayment() {
      this.overlay = true
      return apiAxios({
        method: 'post',
        url: '/Checkout/CreatePaymentUrlV2',
        data: {
          checkout_id: this.checkoutId,
          is_mobile: this.isMobile,
        },
        timeout: 20000,
      })
        .then(res => {
          if (res.status === 1 && res.result) {
            if (this.checkout.payment_tool === 'ICASH_PAY' && this.isMobile) {
              const url = new URL(res.result)
              url.searchParams.append('external_browser', '2')
              window.location.href = url.toString()
              this.overlay = false
            } else {
              window.location.href = res.result
            }
          } else {
            this.$snackbar.add('取得付款連結失敗，請稍後再試')
            this.overlay = false
          }
        })
        .catch(() => {
          this.$snackbar.add('取得付款連結失敗，請稍後再試')
          this.overlay = false
        })
    },
    toProfile() {
      this.$router.push('/profile')
    },
    bindCard() {
      return apiAxios({
        method: 'post',
        url: '/CreditCard/BindCard',
        data: {
          checkoutId: this.checkoutId,
        },
      }).then(res => {
        if (res.result) {
          window.location.href = res.result
        }
      })
    },
  },
}
</script>
<style scoped>
.activity-linear {
  background: linear-gradient(
    180deg,
    rgba(234, 112, 104, 0.765625) 0%,
    rgba(250, 16, 0, 0.6) 12.02%,
    #f8685f 49.5%,
    #c93e35 89.91%,
    #b93229 100%
  );
  color: #fff;
}
.activity-border {
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  font-size: 22px;
}
@media (max-width: 600px) {
  .activity-border {
    font-size: 18px;
  }
}
</style>
