<template>
  <div class="pt-4">
    <div v-if="isLoading">
      <h5 class="text-h5 text-center mb-4">身分確認中</h5>
      <v-progress-linear
        color="primary"
        indeterminate
        rounded
        height="4"
      ></v-progress-linear>
    </div>
    <template v-else>
      <h5 class="text-h5 text-center mb-4">請完成以下步驟</h5>
      <v-stepper v-model="curretStep">
        <v-stepper-header>
          <v-stepper-step :complete="curretStep > 1" step="1">
            身分確認
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="curretStep > 2" step="2">
            基本資料填寫
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form ref="verifyForm">
              <v-autocomplete
                label="公司別:"
                v-model="companyId"
                :items="companyIdArray"
                item-text="company_name"
                item-value="company_id"
                :rules="[v => !!v || '請選擇公司別']"
              ></v-autocomplete>
              <v-text-field
                label="員工編號:"
                v-model="empNo"
                :rules="[v => !!v || '請輸入員工編號']"
              ></v-text-field>
              <v-text-field
                :label="idNoLabel"
                v-model="idNo"
                :rules="[
                  v =>
                    !!v ||
                    (companyId === '73251209'
                      ? '請輸入身分證'
                      : '請輸入身分證後3碼'),
                ]"
              ></v-text-field>
            </v-form>
            <v-btn color="primary" @click="verifyUser" :loading="isFormloading">
              身分驗證
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div
              class="d-flex justify-center flex-column align-center red--text"
            >
              <div>
                若您驗證無法通過可以透過
                <span
                  class="text-decoration-underline"
                  @click="$store.commit('toLine')"
                  style="cursor: pointer"
                  >一對一</span
                >
                線上客服詢問。
              </div>
              <div>點選後可進行line的導連。</div>
            </div>
            <v-form ref="profileForm">
              <v-text-field
                v-model="email"
                :rules="[
                  v => !!v || '請輸入電子信箱',
                  v =>
                    /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/.test(
                      v
                    ) || '請輸入正確格式',
                ]"
              >
                <template #label>
                  E-mail <span class="primary--text">(必填)</span> ：
                </template>
              </v-text-field>
              <v-text-field
                v-model="phone_number"
                :rules="[
                  v => !!v || '請輸入手機號碼',
                  v => /^09[0-9]{8}$/.test(v) || '請輸入正確格式',
                ]"
              >
                <template #label>
                  手機號碼 <span class="primary--text">(必填)</span> ：
                </template>
              </v-text-field>
              <v-text-field
                v-model="display_name"
                :rules="[v => !!v || '請輸入姓名']"
              >
                <template #label>
                  姓名 <span class="primary--text">(必填)</span> ：
                </template>
              </v-text-field>
            </v-form>
            <v-btn color="primary" @click="update" :loading="isFormloading">
              完成註冊</v-btn
            >
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
  </div>
</template>
<script>
import { apiAxios } from '@/api'
import { mapGetters } from 'vuex'

export default {
  props: ['v'],
  created() {
    this.isLoading = true
    this.companyId = this.$route.query['company-id']
    return Promise.resolve()
      .then(() => {
        if (this.v) {
          this.$store.commit('clearToken')
          return apiAxios({
            method: 'post',
            url: '/OpMember/GetUniToken',
            data: { v: this.v },
          }).then(res => {
            let data = JSON.parse(res.result)
            this.$store.commit('setToken', {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
            })
            window.dataLayer.push({ userId: this.$store.getters.userId })
            return this.$store.dispatch('initialize')
          })
        } else if (!this.isLogin) {
          this.$router.replace('/login')
        }
      })
      .then(() => {
        this.$store
          .dispatch('inOrOutLog', {
            emp_no: this.$store.getters.userId,
            event_name: 'login_success_op',
          })
          .catch(() => {})
        if (this.isVerified) {
          this.curretStep = 2
          return apiAxios({
            method: 'post',
            url: '/Users/GetUserProfile',
            data: {},
          }).then(res => {
            if (res.result[0]) {
              this.phone_number =
                res.result[0].phone_number || res.result[0].op_mobile
              this.email = res.result[0].email
              this.display_name = res.result[0].display_name
              if (res.result[0].email && res.result[0].phone_number) {
                this.$store.commit('setProfile', res.result[0])
                const value = sessionStorage.getItem('pec_form_qrocde')
                if (value === 'Y') {
                  sessionStorage.removeItem('pec_form_qrocde')
                  this.$router.push('/activity-qrcode')
                } else {
                  this.$router.push(this.$route.query.redirect || '/')
                }
              }
            }
          })
        } else {
          return apiAxios({
            method: 'post',
            url: '/Profile/GetCompanyArray',
            data: {},
          }).then(res => this.companyIdArray.push(...res.result))
        }
      })
      .finally(() => (this.isLoading = false))
  },
  data() {
    return {
      show: false,
      isLoading: false,
      curretStep: 1,
      companyId: '',
      companyIdArray: [],
      empNo: '',
      password: '',
      idNo: '',
      email: '',
      phone_number: '',
      display_name: '',
      isFormloading: false,
      idNoLabel: '請輸入身分證後3碼',
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'isVerified']),
  },
  watch: {
    companyId(val) {
      this.idNoLabel = val === '73251209' ? '請輸入身分證' : '請輸入身分證後3碼'
    },
  },
  methods: {
    verifyUser() {
      if (this.$refs.verifyForm.validate()) {
        this.isFormloading = true
        return apiAxios({
          method: 'post',
          url: '/OpMember/VerifyUser',
          data: {
            company_id: this.companyId,
            emp_no: this.empNo,
            id_no: this.idNo,
            username: this.empNo,
            password: this.password,
          },
        })
          .then(res => {
            let data = JSON.parse(res.result)
            this.$store.commit('setToken', {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
            })
          })
          .then(() => {
            return apiAxios({
              method: 'post',
              url: '/Users/GetUserProfile',
            })
          })
          .then(res => {
            if (res.result[0]) {
              this.email = res.result[0].email
              this.phone_number =
                res.result[0].phone_number || res.result[0].op_mobile
              this.display_name = res.result[0].display_name
            }
            this.curretStep = 2
          })
          .finally(() => (this.isFormloading = false))
      }
    },
    update() {
      if (this.$refs.profileForm.validate()) {
        this.isFormloading = true
        return apiAxios({
          method: 'post',
          url: '/Users/UpdateUserProfile',
          data: {
            phone_number: this.phone_number,
            email: this.email,
            display_name: this.display_name,
            edm_notification: 'Y',
          },
        })
          .then(() =>
            apiAxios({
              method: 'post',
              url: '/Users/GetUserProfile',
            })
          )
          .then(res => this.$store.commit('setProfile', res.result[0] || {}))
          .then(() => {
            this.$snackbar.add('會員資料更新成功', { color: 'success' })
            const value = sessionStorage.getItem('pec_form_qrocde')
            if (value === 'Y') {
              sessionStorage.removeItem('pec_form_qrocde')
              this.$router.push('/activity-qrcode')
            } else {
              this.$router.push(this.$route.query.redirect || '/')
            }
          })
          .finally(() => (this.isFormloading = false))
      }
    },
  },
}
</script>
