<template>
  <v-container fluid>
    <v-card v-if="secondLayer" class="py-15 mb-6">
      <div class="wrapper px-2">
        <h3
          class="text-h4 text-center primary--text font-weight-bold mb-2"
          style="line-height: 1.8"
        >
          是否要綁定<span style="white-space: nowrap">UNIOPEN帳號登入?</span>
        </h3>
        <h3 class="text-h6 text-center" style="color: #d86816">
          使用 uniopen 登入更快更方便！
        </h3>
        <div class="mb-6">
          <div
            class="mt-6 d-flex justify-space-between mx-auto"
            style="max-width: 185px"
          >
            <v-btn
              style="text-transform: none"
              color="grey darken-3"
              dark
              large
              @click="handleBindingNo"
            >
              否</v-btn
            >
            <v-btn
              style="text-transform: none"
              color="primary"
              dark
              large
              @click="handleBindingYes"
            >
              是</v-btn
            >
          </div>
        </div>
        <div class="d-flex justify-center">
          <v-checkbox
            v-model="isCheckedDontAskAgain"
            hide-details
            color="primary"
            label="下次不再詢問"
            class="mt-0"
          ></v-checkbox>
        </div>
        <div>
          <p class="text--secondary text-center text-body-2 mt-4 mb-1">
            若您目前不綁定，日後可隨時至會員 中心<span
              style="white-space: nowrap"
              >的「綁定 uniopen 帳號」頁面進行綁定。</span
            >
          </p>
        </div>
      </div>
    </v-card>
    <v-card v-else class="py-15">
      <div class="wrapper px-2">
        <h3 class="text-h3 text-center primary--text font-weight-bold">
          會員登入
        </h3>
        <p class="text-center mt-9">統一企業員工請使用自助帳號密碼登入</p>
        <v-form ref="form">
          <v-text-field
            class="mt-8"
            outlined
            name="login"
            :label="'員工編號'"
            :rules="[v => !!v || `請輸入員工編號`]"
            type="text"
            autocomplete="username"
            v-model="username"
          ></v-text-field>
          <v-text-field
            outlined
            name="password"
            label="密碼"
            :rules="[v => !!v || '請輸入密碼']"
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            @click:append="show = !show"
            @keyup.enter="login()"
            autocomplete="current-password"
            v-model="password"
          ></v-text-field>
          <div class="text-right">
            <span class="text-decoration-underline" @click="dialog = true"
              >登入有問題?</span
            >
          </div>

          <div class="text-center mt-10" v-show="showBioIcon">
            <span @click="biometricAuthInApp">
              <v-icon size="28">fa-solid fa-fingerprint</v-icon>
              <!-- <br />
              <small>使用指紋/臉部登入功能</small> -->
            </span>
          </div>

          <v-btn
            class="mt-9"
            block
            depressed
            color="primary"
            @click="login()"
            :loading="loading"
            >登入
          </v-btn>
          <!-- <div>
            <v-divider class="mt-8"></v-divider>
            <v-subheader class="pl-0"> 使用其他方式登入 </v-subheader>
            <v-chip
              class="justify-center"
              color="primary"
              label
              outlined
              large
              style="width: 100%; border-width: 2px"
              @click="opLogin"
              :loading="loading"
            >
              <img
                class="pb-1"
                src="https://unilife.pec.com.tw/images/openpoint-logo.jpg"
                height="24"
                alt=""
              /><span class="ml-2 mt-1 grey--text text--darken-3"
                >會員登入/註冊</span
              >
            </v-chip>
          </div> -->
        </v-form>
      </div>
    </v-card>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">無法登入</v-card-title>
        <v-card-text class="black--text pt-5">
          <h6 class="text-h6 primary--text pb-4">狀況一<br />忘記密碼</h6>
          <p>
            Step1. 進入統一企業員工入口網 -> 人資 -> 員工自助服務
            (要在公司內部網路環境或是使用VPN)
          </p>
          <p>
            Step2. 在登入畫面底下，點擊
            <span style="color: blue">【重設密碼】</span>
          </p>
          <p>Step3. 依照指示輸入相關欄位資料後即可重設密碼</p>
          <h6 class="text-h6 primary--text py-4">
            狀況二<br />
            帳號登入失敗次數超過5次，帳號已封鎖，無法登入；請至員工自助服務系統重新設定密碼
          </h6>
          <p>
            Step1. 進入統一企業員工入口網 -> 人資 -> 員工自助服務
            (要在公司內部網路環境或是使用VPN)
          </p>
          <p>
            Step2. 登入員工自助服務系統，點擊畫面右上角
            <span style="color: #ff720e">"修改密碼"</span>
          </p>
          <p>Step2.1 如果忘記密碼無法登入，請參考"忘記密碼"步驟</p>
          <p>Step3. 依照指示輸入相關欄位資料後設定新密碼，即可解鎖帳號</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="dialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiAxios } from '@/api'

export default {
  data() {
    return {
      dialog: false,
      show: false,
      username: '',
      password: '',
      loading: false,
      showBioIcon: false,
      secondLayer: false,
      isCheckedDontAskAgain: false,
    }
  },
  mounted() {
    const savedDontAskAgain = localStorage.getItem('pec_dont_ask_again')
    if (savedDontAskAgain !== null) {
      // localStorage 存為字串 'true' 或 'false'，需轉回布林值
      this.isCheckedDontAskAgain = savedDontAskAgain === 'true'
    }
    // 詢問APP是否啟用生物辨識
    if (
      window.GroupJSInterface &&
      window.GroupJSInterface.isBiometricEnableInApp
    ) {
      window.GroupJSInterface.isBiometricEnableInApp()
    }
    // APP回傳是否啟用生物辨識
    window.biometricIsEnableToWeb = this.biometricIsEnableToWeb
    // 判斷生物辨識模組是否成功
    window.credentialLoginToWeb = this.credentialLoginToWeb

    localStorage.setItem('pec_bio_psw_wrong', false)
  },
  watch: {
    isCheckedDontAskAgain(newVal) {
      localStorage.setItem('pec_dont_ask_again', newVal)
    },
  },
  computed: {
    ...mapGetters(['userId']),
    ...mapState(['accessToken', 'clientId', 'profile']),
  },
  methods: {
    handleBindingYes() {
        apiAxios({
            method: 'post',
            url: '/OpMember/GetBindingUri',
        }).then(res => {
            window.location.href = res.result
        }).catch(error => {
            this.$snackbar.add('綁定連結取得失敗')
            console.error(error)
        })
    },
    handleBindingNo() {
        const value = sessionStorage.getItem('pec_form_qrocde')
        if (value === 'Y') {
            sessionStorage.removeItem('pec_form_qrocde')
            this.$router.push('/activity-qrcode')
        } else {
            this.$router.push(this.$route.query.redirect || '/')
        }
    },
    async login(bio = false, acc, psw) {
      try {
        this.loading = true

        if (this.$refs.form.validate() || bio) {
          try {
            await this.$store.dispatch('inOrOutLog', {
              emp_no: this.username,
              event_name: 'start_login_pec',
            })
          } catch (error) {
            null
          }

          let data = await this.$store.dispatch('login', {
            username: bio ? acc : this.username,
            password: bio ? psw : this.password,
          })

          this.$store.commit('setToken', {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          })

          window.dataLayer.push({ userId: this.userId })

          await this.$store.dispatch('initialize')

          try {
            await this.$store.dispatch('inOrOutLog', {
              emp_no: this.userId,
              event_name: 'login_success_pec',
            })
          } catch (error) {
            null
          }

          if (!this.profile.gid && !this.isCheckedDontAskAgain) {
            this.secondLayer = true
          } else if (this.profile.email) {
            const value = sessionStorage.getItem('pec_form_qrocde')
            if (value === 'Y') {
              sessionStorage.removeItem('pec_form_qrocde')
              this.$router.push('/activity-qrcode')
            } else {
              window.location.href = window.location.origin
            }
            // this.$router.push(this.$route.query.redirect || '/')
          } else {
            window.location.href = window.location.origin + '/profile'
            // this.$router.push({
            //   path: '/profile',
            //   query: { redirect: this.$route.query.redirect || '/' },
            // })
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.message
        ) {
          this.$snackbar.add(error.response.data.message)
          if (bio && error.response.data.message.includes('密碼不正確')) {
            // 提醒 APP 端需在登入後跳出「是否更新生物辨識密碼」視窗
            localStorage.setItem('pec_bio_psw_wrong', true)
          }
        } else {
          this.$snackbar.add('發生不可預期錯誤')
        }
        try {
          await this.$store.dispatch('inOrOutLog', {
            emp_no: this.username,
            event_name: 'login_fail_pec',
          })
        } catch (error) {
          null
        }
      } finally {
        this.loading = false
      }
    },
    opLogin() {
      return apiAxios({
        method: 'post',
        url: '/OpMember/GetAuth',
      }).then(res => {
        window.location.href = res.result
      })
    },
    biometricIsEnableToWeb(appParams) {
      let { employeeSelf } = JSON.parse(appParams)
      if (employeeSelf == '1') {
        // 有啟用生物辨識
        // 顯示指紋按鈕
        this.showBioIcon = true
      } else if (employeeSelf == '0') {
        // 裝置不支援
        // 手動登入
      } else {
        // 未啟用生物辨識
        // 手動登入
      }
    },
    biometricAuthInApp() {
      let loginType = '1' // 自助
      if (
        window.GroupJSInterface &&
        window.GroupJSInterface.biometricAuthInApp
      ) {
        window.GroupJSInterface.biometricAuthInApp(
          JSON.stringify({
            loginType: loginType,
          })
        )
      }
    },
    async credentialLoginToWeb(appParams) {
      let { isSuccess, account, password, errorCode } = JSON.parse(appParams)
      /**
       * @bio
       * 辨識失敗 > false, '', '', 1001 > 維持原本登入流程
       * 讀取失敗 > false, '', '', 1002 > 維持原本登入流程
       * 讀取成功 > true, 帳, 密, 0000
       */
      if (isSuccess === 'true') {
        this.login(true, account, password)
      } else {
        this.$dialog.show(`生物辨識讀取失敗，錯誤碼:${errorCode}`)
      }
    },
  },
}
</script>
<style scope>
.wrapper {
  margin: 0 auto;
  width: 100%;
  max-width: 376px;
}
</style>
