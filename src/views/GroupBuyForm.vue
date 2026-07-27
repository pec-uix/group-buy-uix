<template>
  <div class="my-12">
    <div
      style="overflow: hidden; width: 100%; height: 0px; padding-bottom: 56%"
    >
      <a href="/group-buy">
        <img
          :src="
            new Date() > new Date('2023-12-31T23:59:59+08:00')
              ? 'https://unilife.pec.com.tw/images/group-buy-banner-2024-H1-ver3.jpg'
              : 'https://unilife.pec.com.tw/images/group-buy-banner.jpg'
          "
          alt=""
          width="100%"
      /></a>
    </div>
    <div class="container mt-8">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="applicationCategory"
          label="申請類別"
          outlined
          readonly
          disabled
        ></v-text-field>

        <!--<v-text-field
          v-model="name"
          :counter="10"
          label="報名日期"
          outlined
          required
        ></v-text-field>-->

        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
          disabled
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="報名日期"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              disabled
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
        </v-menu>

        <v-text-field
          v-model="company_name"
          label="公司籍別"
          outlined
          readonly
          disabled
        ></v-text-field>

        <v-text-field
          v-model="emp_no_s"
          label="員工編號"
          outlined
          readonly
          disabled
        ></v-text-field>

        <v-text-field
          v-model="name"
          label="姓名"
          :rules="nameRules"
          outlined
        ></v-text-field>

        <v-text-field v-model="phone" label="行動電話" outlined></v-text-field>

        <v-row dense>
          <v-col cols="3">
            <v-text-field
              v-model="areaCode"
              label="區碼"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field v-model="localTelephone" label="公司電話" outlined>
              <v-icon slot="prepend" color="gary"> remove </v-icon>
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="extension" label="分機" outlined>
              <v-icon slot="prepend" color="gary"> tag </v-icon>
            </v-text-field></v-col
          >
        </v-row>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="信箱"
          outlined
        ></v-text-field>

        <v-textarea
          v-model="memo"
          name="input-7-1"
          label="備註"
          outlined
        ></v-textarea>

        <!--<v-checkbox
          v-model="checkbox"
          label="Do you agree?"
          outlined
        ></v-checkbox>-->

        <div>
          <v-btn
            :disabled="!valid"
            color="info"
            class="mr-4"
            style="width: 100%"
            @click="insertGpMaster()"
            large
          >
            送出表單
          </v-btn>
        </div>

        <!--<v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>

        <v-btn color="warning" @click="resetValidation">
          Reset Validation
        </v-btn>-->
      </v-form>
    </div>
    <!--<div class="my-4 pa-2 primary white--text">
      <h6 class="text-h6">活動說明：</h6>
      <h5 class="text-h6"></h5>
      <span> </span>
      <h5 class="text-h6"></h5>
      <ol>
        <li>活動時間：2022/8/01-2022/12/31</li>
        <li>
          除上述活動說明，若有於活動網頁說明之未盡事宜，UNI團購網擁有保留修改活動內容之權利。
        </li>
      </ol>
    </div>-->
  </div>
</template>
<script>
import { apiAxios } from '@/api'

export default {
  data() {
    return {
      shareArray: [],
      isLoading: false,
      valid: true,
      name: '',
      phone: '',
      nameRules: [v => !!v || '姓名為必填項目'],
      emailRules: [
        v => !!v || '信箱為必填項目',
        v => /.+@.+\..+/.test(v) || '請輸入有效信箱',
      ],
      email: '',
      emp_no_s: '',
      areaCode: '',
      localTelephone: '',
      extension: '',
      select: null,
      applicationCategory: '新申請',
      company_name: '',
      checkbox: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      memo: '',
    }
  },
  created() {
    this.getAndSetShare()
    this.getCheckRegister()
  },
  methods: {
    getAndSetShare() {
      return apiAxios({
        method: 'post',
        url: '/Users/GetUserProfile',
        data: {},
      }).then(res => {
        if (res.result[0]) {
          this.company_name = res.result[0].company_name
          this.name = res.result[0].display_name
          this.phone = res.result[0].phone_number
          this.email = res.result[0].email
          this.emp_no_s = res.result[0].emp_no_s
        }
      })
    },
    getCheckRegister() {
      return apiAxios({
        method: 'post',
        url: '/GpMaster/checkRegister',
        data: {},
      }).then(res => {
        if (res.message && res.result.length > 0) {
          this.applicationCategory = res.message
          this.areaCode = res.result[0].areaCode
          this.localTelephone = res.result[0].localTelephone
          this.extension = res.result[0].extension
        }
      })
    },
    insertGpMaster() {
      if (this.$refs.form.validate()) {
        if (!(this.areaCode || this.localTelephone || this.phone)) {
          this.$snackbar.add(`行動電話與公司電話必須選填一項`, {
            color: 'erroe',
          })
          return
        }

        if (this.areaCode) {
          let re = /^[0-9]*$/
          if (!this.localTelephone) {
            this.$snackbar.add(`若選填公司電話，請同時填寫區碼與公司電話`, {
              color: 'erroe',
            })
            return
          }
          if (!re.test(this.areaCode)) {
            this.$snackbar.add(`區碼必須為數字`, {
              color: 'erroe',
            })
            return
          }
          if (this.areaCode.length > 4) {
            this.$snackbar.add(`區碼必須為小於四碼`, {
              color: 'erroe',
            })
            return
          }
        }

        if (this.localTelephone) {
          let re = /^[0-9]*$/
          if (!this.areaCode) {
            this.$snackbar.add(`若選填公司電話，請同時填寫區碼與公司電話`, {
              color: 'erroe',
            })
            return
          }
          if (!re.test(this.localTelephone)) {
            this.$snackbar.add(`公司電話必須為數字`, {
              color: 'erroe',
            })
            return
          }
          if (this.localTelephone.length != 7) {
            this.$snackbar.add(`公司電話必須為七碼`, {
              color: 'erroe',
            })
            return
          }
        }

        if (this.extension) {
          let re = /^[0-9]*$/
          if (!re.test(this.extension)) {
            this.$snackbar.add(`分機必須為數字`, {
              color: 'erroe',
            })
            return
          }
        }

        return apiAxios({
          method: 'post',
          url: '/GpMaster/InsertGpMaster',
          data: {
            mail: this.email,
            memo: this.memo,
            areaCode: this.areaCode,
            localTelephone: this.localTelephone,
            extension: this.extension,
            displayName: this.name,
            phoneNumber: this.phone,
          },
        }).then(res => {
          if (res.status == 1) {
            this.$snackbar.add(`${res.message}`, { color: 'success' })
            this.$router.push('/')
          } else {
            this.$snackbar.add(`${res.message}`, { color: 'primary' })
          }
        })
      }
    },
    validate() {
      this.$refs.form.validate()
    },
  },
}
</script>
