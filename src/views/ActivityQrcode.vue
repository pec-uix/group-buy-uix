<template>
  <div>
    <div class="d-flex justify-end flex-wrap">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <!-- <v-btn class="mt-3 mr-3 secondary pec-share-btn" @click="share">
        <background-svg
          class="mt-1"
          backgroungUrl="/share.svg"
          width="16px"
          height="16px"
          color="#fff"
        ></background-svg>
        立即分享
      </v-btn> -->
      <v-container class="pb-1" fluid>
        <v-carousel
          v-if="banner_array.length"
          height="auto"
          :hide-delimiters="!!banner_array[carousel].youtube_id"
          hide-delimiter-background
          v-model="carousel"
          :cycle="cycle"
          :interval="interval"
        >
          <v-carousel-item
            class="carousell"
            v-for="(banner, i) in banner_array"
            :key="banner.id"
            :eager="i < 3"
          >
            <div>
              <v-img
                :eager="i < 3"
                class="d-md-none white--text text-h4"
                :aspect-ratio="16 / 9"
                width="100%"
                :src="banner.img_url_mobile"
              >
              </v-img>
              <v-img
                :eager="i < 3"
                class="d-none d-md-flex white--text text-h4"
                :aspect-ratio="24 / 9"
                width="100%"
                :src="banner.img_url_pc"
              >
              </v-img>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-container>
      <product-list
        :product-array="productArray"
        :is-loading="isLoading"
        :breadcrumbs="items"
        :brand="brand"
        :category="category"
        :categorySecondary="categorySecondary"
        :categoryMinor="categoryMinor"
        :pagingInfo="pagingInfo"
        @updatedFilterConditions="updatedFilterConditions"
      ></product-list>
      <div
        class="pa-4 my-3 mx-3 text-body-2"
        style="background-color: rgba(247, 197, 214, 1)"
      >
        登入團購網購物金立即送<br /><br />
        一、 活動期間:<br />2025年7月25日—2025年9月30日 <br /><br />
        二、 活動方案:<br />
        掃描Qrcode，登入團購網，購物金（折價券）立即送
        掃描指定Qrcode，成功登入團購網，即可獲得購物金，每位會員享有一次領取機
        會，已註冊會員於活動期間登入成功，可獲得25元購物金一張、新註冊會員可獲
        得購物金125元（包含新會員好禮購物金100元），本活動人人有獎。<br /><br />
        三、折價券使用說明：
        <br />掃描Qrcode，登入團購網購物金使用規則：<br />
        25元折價券視同25元購物金，可折抵UNI團購網全站商品（手機、黃金、票券或
        指定商品除外），使用期限:發送日起算30天內需使用完畢，若逾期，則自動失效
        不另行補發。（電子折價券使用後，若取消訂單或辦理退貨時，若仍在有效期限，
        將歸還至會員帳戶內）。 <br /><br />
        四、注意事項： <br />
        1.電子折價券折抵部分不再另開立發票，開立發票金額，以該訂單「購買時實際支付的金額」來計算。<br />
        2.電子折價券不得要求變現，請留意該電子折價券是否有使用規則及使用效期。電子折價券為贈品，係屬無償取得，恕不適用商品（服務）禮券記載之規範。<br />
        3.UNI團購網保留活動調整及變更電子折價券贈送辦法及折抵方式的權利，會員同意接受主辦單位安排之替代方式，如有變動請以UNI團購網公告為主。<br />
        4.會員於參加本活動時，即視為同意接受本活動相關規範。活動期間如自行取消訂單者，UNI團購網有權決定取消、終止、修改、收回及暫停本活動；活動如遇有任何因電腦系統、網路、電話等故障或傳輸異常、或有不可抗力事由，因而致參加者之資料有延遲、遺失、錯誤或無法辨識等情況，主辦單位不負任何法律責任，參加者亦不得因此異議。其他未盡事宜，悉依主辦單位相關規定辦理。<br />
        5.除上述活動說明，若有於活動網頁說明之未盡事宜，UNI團購網擁有保留修改活動內容之權利。<br />
        6. 活動內容如有任何疑問，歡迎致電UNI團購網服務專線：0800-789-168。
      </div>
    </div>
    <v-dialog
      v-model="dialog"
      :overlay-opacity="0.8"
      content-class="rounded-xl recommend-dialog"
      max-width="1280"
      :transition="false"
    >
      <div style="position: relative">
        <!-- <v-btn
          v-if="dialog"
          absolute
          outlined
          color="white"
          icon
          elevation="0"
          style="z-index: 20; top: 6px; right: 7px"
          @click="closeDialog()"
        >
          <background-svg
            backgroungUrl="/close.svg"
            width="20px"
            height="20px"
            color="#fff"
          ></background-svg>
        </v-btn> -->
        <v-card class="rounded-xl" style="overflow: hidden">
          <div class="recommend-dialog-head">
            <div
              v-if="!isCouponClaimed"
              class="text-h5 white--text font-weight-bold mt-3 mb-2 px-2 text-center"
            >
              🎉登入成功！<br />恭喜您獲得{{ couponValue }}元購物金~
            </div>
            <div
              v-else
              class="text-h5 white--text font-weight-bold mt-3 mb-2 px-2 text-center"
            >
              🎉 歡迎您再次登入團購網，<br />購物金記得使用喔！
            </div>
          </div>

          <div v-if="!isCouponClaimed" class="pa-4 py-md-3 text-center">
            恭喜您！獲得{{ couponValue }}元購物金，<br />
            <span v-if="couponValue == '125'"
              >(新會員購物金將於明日歸戶)<br
            /></span>
            使用期限至：{{ couponEndDate.split('T')[0] }} <br />
            祝您購物愉快！
          </div>
          <div v-else class="pa-4 py-md-3 text-center">
            您已經參與過本次活動，<br />歡迎每日來團購網簽到賺購物金喔！
          </div>

          <div class="d-flex justify-center mb-4">
            <v-btn
              depressed
              color="#e93123"
              active-class="no-active"
              class="rounded-pill white--text text-h6 px-10"
              large
              @click="closeDialog()"
            >
              開始購物
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import ProductList from '@/components/ProductList.vue'
// import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  components: { ProductList },
  created() {
    const now = new Date()
    const startDate = new Date('2025-07-25T00:00:00+08:00')
    const endDate = new Date('2025-09-30T23:59:59+08:00')
    if (now >= startDate && now <= endDate) {
      this.fetchData()
      window.appShareToWeb = this.shareResult
      if (window.previousUrl == '/share') {
        this.isFromShare = 'Y'
      }
    } else {
      alert('活動尚未開始或已結束')
      this.$router.push('/')
    }
  },
  data() {
    return {
      isLoading: false,
      productArray: [],
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '購物金',
          to: '/activity-qrcode',
        },
      ],
      isFromShare: 'N',
      pagingInfo: {},
      brand: [],
      category: [],
      categorySecondary: [],
      categoryMinor: [],
      dialog: false,
      carousel: 0,
      cycle: true,
      banner_array: [
        {
          id: 364,
          img_url_pc:
            'https://unilife.pec.com.tw/images/qrcode-banner-desktop.jpg',
          img_url_mobile:
            'https://unilife.pec.com.tw/images/qrcode-banner-mobile.jpg',
          background_color: '#020532',
          pop_up_mark: 'N',
          youtube_id: null,
          router_to: '/activity-qrcode',
        },
      ],
      memberCreatedAt: '',
      thresholdDate: '2025-07-25T00:00:00+08:00',
      couponEndDate: '',
      isCouponClaimed: false,
      couponValue: '',
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
    bannerColor() {
      return this.banner_array[this.carousel]
        ? this.banner_array[this.carousel].background_color
        : 'grey'
    },
    interval() {
      return (this.banner_array[this.carousel].banner_duration || 1) * 1000
    },
  },
  methods: {
    fetchData() {
      this.isLoading = true
      return Promise.resolve()
        .then(() => {
          if (this.$store.getters.isLogin) {
            return apiAxios({
              method: 'post',
              url: '/Users/VerifyToken',
            })
              .then(() => {
                return apiAxios({
                  method: 'post',
                  url: '/Users/GetUserProfile',
                  data: {},
                })
              })
              .then(res => {
                this.memberCreatedAt = res.result[0].creation_date
                if (
                  new Date(this.memberCreatedAt) > new Date(this.thresholdDate)
                ) {
                  this.couponValue = '125'
                } else {
                  this.couponValue = '25'
                }
              })
              .then(() => {
                return apiAxios({
                  method: 'post',
                  url: '/Reward/InsertUserReward',
                  data: {
                    id: 74367,
                  },
                })
              })
              .then(res => {
                if (res.status) {
                  this.isCouponClaimed = false
                  this.couponEndDate = res.result.end_date
                } else {
                  this.isCouponClaimed = true
                }
              })
          } else {
            sessionStorage.setItem('pec_form_qrocde', 'Y')
            this.$router.push('/login')
          }
        })
        .then(() => {
          return apiAxios({
            method: 'post',
            url: '/Product/GetProductAllRandomV2',
            params: {
              pageNo: 1,
              pageSize: '20',
              totalPageSize: '200',
              v: '2',
            },
            data: {
              category_id_array: [
                '8',
                '48',
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '49',
                '40',
                '41',
                '42',
                '43',
                '44',
                '45',
                '46',
                '47',
              ],
              filter: {
                storeType: [],
                paymentType: [],
                receiveType: [],
                brand: [],
                category: [],
                categorySecondary: [],
                categoryMinor: [],
                minPrice: '0',
                maxPrice: '0',
                orderBy: { key: 'default_order_seq', asc: true },
              },
            },
          })
        })
        .then(res => {
          this.productArray = res.result.product
          this.brand = res.result.brand
          this.category = res.result.category
          this.categorySecondary = res.result.categorySecondary
          this.categoryMinor = res.result.categoryMinor
          this.pagingInfo = res.pagingInfo
        })
        .finally(() => {
          this.dialog = true
          this.isLoading = false
        })
    },
    closeDialog() {
      this.dialog = false
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
    shareResult(servcie) {
      return apiAxios({
        method: 'post',
        url: '/Share/InsertShareLog',
        data: {
          activity_name: `活動專區 ${this.items[1].text}`,
          share_app: servcie,
          share_point: this.isFromShare,
        },
      }).then(() => {
        this.$snackbar.add(`分享成功`, { color: 'success' })
        if (this.isFromShare == 'Y') {
          this.$router.push('/share')
        }
      })
    },
    updatedFilterConditions(filterConditions) {
      this.isLoading = true
      apiAxios({
        method: 'post',
        url: '/Product/GetProductAllRandomV2',
        params: {
          pageNo: filterConditions.currentPage,
          pageSize: '20',
          totalPageSize: '200',
          v: '2',
        },
        data: {
          category_id_array: [
            '8',
            '48',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '49',
            '40',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '47',
          ],
          filter: filterConditions,
        },
      }).then(res => {
        this.productArray = res.result.product
        this.brand = res.result.brand
        this.category = res.result.category
        this.categorySecondary = res.result.categorySecondary
        this.categoryMinor = res.result.categoryMinor
        this.pagingInfo = res.pagingInfo
        this.isLoading = false
      })
    },
  },
}
</script>
<style scoped>
.pec-share-btn {
  position: sticky;
  top: 83px;
  z-index: 2;
}

.pec-title {
  color: #c02220;
  padding-left: 20px;
  line-height: 1.2;
  position: relative;
  font-size: 22px;
}

.pec-title::before {
  position: absolute;
  content: '';
  display: block;
  top: 0px;
  left: 3px;
  width: 5px;
  height: 100%;
  border-radius: 50px;
  background-color: #c02220;
}
</style>
