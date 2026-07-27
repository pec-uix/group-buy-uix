<template>
  <pec-member-template
    img-src="/profile.jpeg"
    :breadcrumbs="[
      {
        text: '首頁',
        disabled: false,
        to: '/',
      },
      {
        text: '會員資料',
        disabled: false,
      },
    ]"
  >
    <v-card class="pa-8">
      <v-form lazy-validation ref="form">
        <h6 class="rounded-0 text-h6 pec-title-bl font-weight-bold">
          會員資料維護
        </h6>
        <div class="mt-7 pl-sm-6 info-wrapper">
          <p class="mt-3">公司別：{{ company_name }}</p>
          <p>員工編號：{{ emp_no_s }}</p>
          <v-text-field
            v-model="display_name"
            :rules="[v => !!v || '請輸入姓名']"
          >
            <template #label>
              姓名： <span class="primary--text">(必填)</span> ：
            </template>
          </v-text-field>
          <v-text-field
            :class="{ 'tour-step-backdrop': isOpenTour }"
            class="transition"
            @focus="isOpenTour = false"
            v-model="email"
            :rules="[
              v => !!v || '請輸入電子信箱',
              v =>
                /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
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
          <div class="text-caption">性別:</div>
          <v-radio-group row class="mt-1" v-model="sex">
            <v-radio label="男" value="M"></v-radio>
            <v-radio label="女" value="F"></v-radio>
          </v-radio-group>
          <v-menu
            v-model="birthday_menu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="birthday"
                readonly
                v-bind="attrs"
                v-on="on"
                clearable
                @click:clear="birthday = ''"
                :disabled="!isFirstFillInBirthday"
              >
                <template #label> 生日： </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="birthday"
              @input="birthday_menu = false"
              locale="zh-TW"
            ></v-date-picker>
          </v-menu>
          <v-select
            :items="receive_area_lists"
            v-model="receive_area"
            item-text="area_name"
            item-value="receive_area"
            :rules="[v => !!v || '請選擇贈品領取窗口']"
          >
            <template #label>
              贈品領取窗口 <span class="primary--text">(必填)</span> ：
            </template>
          </v-select>

          <v-text-field
            label="電子發票手機條碼："
            v-model="carrier_id"
            :rules="[
              v => !v || /^\/{1}[0-9A-Z+-\.]{7}$/.test(v) || '請輸入正確格式',
            ]"
          ></v-text-field>
          <div class="text-caption">訂閱團購網通知:</div>
          <v-radio-group row class="mt-1" v-model="edm_notification">
            <v-radio label="是" value="Y"></v-radio>
            <v-radio label="否" value="N"></v-radio>
          </v-radio-group>
          <!-- <template v-if="gid">
            <div>OPEN POINT會員</div>
            <div>{{ gid }}</div>
          </template>
          <v-btn v-else outlined @click="redirectToOP"
            >綁定OPEN POINT會員</v-btn
          > -->

          <div v-if="company_id === '73251209'">
            <div class="mt-6 font-weight-bold text-h6">會員帳號連結管理</div>
            <v-divider class="thick-divider my-2"></v-divider>
            <div class="mt-4 mb-3 d-flex align-center">
              uniopen帳號狀態：<v-btn
                v-if="!gid"
                depressed
                color="error"
                class="ml-2"
                @click="bindUniOpenAccount"
                >綁定uniopen帳號</v-btn
              >
              <div v-else>已連 {{ gid }}</div>
            </div>
            <div v-if="!gid">
              您的團購網帳號尚未連結 uniopen 帳號。如欲連結帳號，請點選『綁定
              uniopen 帳號』變更。
            </div>
            <div v-else>
              您的團購網帳號已連結 uniopen 帳號。如欲解除連結，請點選『解除
              uniopen 帳號』變更。
            </div>
            <v-btn
              v-if="gid"
              depressed
              dark
              color="blue-grey darken-3"
              class="mt-3"
              @click="unbindUniOpenAccount"
              >解除uniopen帳號</v-btn
            >
          </div>

          <v-btn
            class="mt-8"
            block
            depressed
            color="primary"
            @click="beforeUpdate"
            :loading="isFormloading"
            >確認</v-btn
          >
        </div>
      </v-form>
    </v-card>
    <div
      class="tour-backdrop"
      v-if="isOpenTour"
      @click="isOpenTour = !isOpenTour"
    ></div>

    <v-dialog
      v-model="birthdayRemindDialog"
      persistent
      scrollable
      max-width="600"
    >
      <v-card class="py-2">
        <v-card-text class="black--text pt-3 pb-0">
          <div class="primary--text text-h5 font-weight-bold mb-4 text-center">
            <span> 生日資料說明</span>
          </div>
          <div class="text-body-1">
            生日一經送出後<span class="font-weight-bold primary--text">
              無法更改</span
            >，目前您填寫的生日為 {{ this.birthday }}，請確認是否正確。
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            class="mr-3"
            @click="
              birthdayRemindDialog = false
              isFormloading = false
            "
          >
            返回修正
          </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            class="ml-3"
            @click="
              birthdayRemindDialog = false
              update()
            "
          >
            確認送出
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </pec-member-template>
</template>
<script>
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
import { apiAxios } from '@/api'

export default {
  props: ['v'],
  components: { PecMemberTemplate },
  created() {
    return Promise.resolve()
      .then(() => {
        if (this.v) {
          return apiAxios({
            method: 'post',
            url: '/OpMember/BindToPec',
            data: { v: this.v },
          })
        }
      })
      .then(() => {
        return apiAxios({
          method: 'post',
          url: '/Users/VerifyEmails',
          data: {},
        }).then(res => {
          if (
            res.result == 'N' &&
            window.previousUrl.search('/checkout-result') != -1
          ) {
            this.isOpenTour = true
          }
        })
      })
      .then(() => {
        return apiAxios({
          method: 'post',
          url: '/Users/GetUserProfile',
          data: {},
        }).then(res => {
          if (res.result[0]) {
            this.phone_number = res.result[0].phone_number
            this.email = res.result[0].email
            this.edm_notification = res.result[0].edm_notification
            this.carrier_id = res.result[0].carrier_id
            this.display_name = res.result[0].display_name
            this.company_name = res.result[0].company_name
            this.company_id = res.result[0].company_id
            this.emp_no_s = res.result[0].emp_no_s
            this.gid = res.result[0].gid
            this.sex = res.result[0].sex
            this.birthday = res.result[0].birthday
              ? this.$dayjs(res.result[0].birthday).format('YYYY-MM-DD')
              : null
            this.receive_area = res.result[0].receive_area
            this.isFirstFillInBirthday = this.birthday ? false : true
          }
        })
      })
      .then(() => {
        return apiAxios({
          method: 'post',
          url: '/ReceiveArea/GetReceiveArea',
          data: {},
        }).then(res => {
          this.receive_area_lists = res.result
        })
      })
  },
  data() {
    return {
      dialog: false,
      isOpenTour: false,
      isFormloading: false,
      phone_number: '',
      email: '',
      edm_notification: 'Y',
      carrier_id: '',
      display_name: '',
      emp_no_s: '',
      company_name: '',
      company_id: '',
      gid: '',
      sex: '',
      birthday_menu: false,
      birthday: '',
      receive_area: '',
      receive_area_lists: [],
      isFirstFillInBirthday: true,
      birthdayRemindDialog: false,
    }
  },
  methods: {
    bindUniOpenAccount() {
      apiAxios({
        method: 'post',
        url: '/OpMember/GetBindingUri',
      }).then(res => {
        window.location.href = res.result
      })
    },
    unbindUniOpenAccount() {
      apiAxios({
        method: 'post',
        url: '/OpMember/Unbind',
      }).then(() => {
        this.$snackbar.add('UNIOPEN 帳號已成功解除綁定！', { color: 'success' })
        apiAxios({
          method: 'post',
          url: '/Users/GetUserProfile',
          data: {},
        }).then(res => {
          if (res.result[0]) {
            this.phone_number = res.result[0].phone_number
            this.email = res.result[0].email
            this.edm_notification = res.result[0].edm_notification
            this.carrier_id = res.result[0].carrier_id
            this.display_name = res.result[0].display_name
            this.company_name = res.result[0].company_name
            this.company_id = res.result[0].company_id
            this.emp_no_s = res.result[0].emp_no_s
            this.gid = res.result[0].gid
            this.sex = res.result[0].sex
            this.birthday = res.result[0].birthday
              ? this.$dayjs(res.result[0].birthday).format('YYYY-MM-DD')
              : null
            this.receive_area = res.result[0].receive_area
            this.isFirstFillInBirthday = this.birthday ? false : true
          }
        })
      })
    },
    redirectToOP() {
      return apiAxios({
        method: 'post',
        url: '/OpMember/GetBindingUri',
      }).then(res => {
        window.location.href = res.result
      })
    },
    beforeUpdate() {
      if (this.$refs.form.validate()) {
        this.isFormloading = true
        if (this.isFirstFillInBirthday && this.birthday) {
          this.birthdayRemindDialog = true
        } else {
          this.update()
        }
      } else {
        this.$snackbar.add('尚有必填欄位未填寫')
      }
    },
    update() {
      return apiAxios({
        method: 'post',
        url: '/Users/UpdateUserProfile',
        data: {
          phone_number: this.phone_number,
          email: this.email,
          edm_notification: this.edm_notification,
          carrier_id: this.carrier_id,
          display_name: this.display_name,
          sex: this.sex,
          birthday: this.birthday ? this.birthday.replaceAll('-', '') : '',
          receive_area: this.receive_area,
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
    },
  },
}
</script>
<style scoped>
.info-wrapper {
  max-width: 504px;
}
.tour-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1100;
  background-color: #000;
  opacity: 0.64;
}
.tour-step-backdrop::before {
  z-index: 1101;
  border-width: 10px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: #832f2f00;
  border-style: solid;
  bottom: -10px;
  top: auto;
  margin-left: -10px;
  content: ' ';
  border-top-width: 0;
  border-bottom-color: #ca1f1d;
  background-color: transparent;
  opacity: 1;
  left: 50%;
  cursor: auto;
  pointer-events: none;
}
.tour-step-backdrop {
  position: relative;
  z-index: 1101;
  background-color: #fff;
  border-radius: 6px;
  padding: 22px 15px;
  padding-bottom: 0px;
  transition: 0.3s all;
}
.tour-step-backdrop .v-input__slot {
  margin-bottom: 0;
}
.tour-step-backdrop .v-text-field__details {
  opacity: 0;
}
.tour-step-backdrop:hover::before,
.tour-step-backdrop:focus::before {
  opacity: 1 !important;
}
.tour-step-backdrop::after {
  z-index: 1101;
  position: absolute;
  display: block;
  text-align: center;
  content: '請提供有效的電子郵件資訊';
  padding: 8px 14px;
  margin: 0;
  font-size: 14px;
  background-color: #ca1f1d;
  border-bottom: 1px solid #ebebeb;
  border-radius: 5px;
  top: 78px;
  cursor: auto;
  pointer-events: none;
  color: #fff;
  left: 50%;
  transform: translateX(-50%);
}
.transition {
  transition: 0.3s all;
}
.thick-divider {
  border-color: #ca1f1d;
  border-top-width: 2px;
  border-top-style: solid;
  margin: 0 auto;
  max-width: inherit;
}
</style>
