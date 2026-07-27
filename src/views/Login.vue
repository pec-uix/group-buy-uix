<template>
  <v-container fluid>
    <v-card v-if="showRegister" class="py-15">
      <div class="wrapper px-2">
        <h3 class="text-h3 text-center primary--text font-weight-bold">
          會員登入
        </h3>
        <p class="mt-9">請使用員工編號/電子信箱登入</p>
        <v-form ref="form">
          <v-text-field
            class="mt-8"
            outlined
            name="login"
            label="員工編號/電子信箱"
            :rules="[v => !!v || `請輸入員工編號/電子信箱`]"
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
            @keyup.enter="login"
            autocomplete="current-password"
            v-model="password"
          ></v-text-field>
          <div class="text-right">
            <span class="text-decoration-underline" @click="dialog = true"
              >登入有問題?</span
            >
          </div>
          <v-btn
            class="mt-9"
            block
            depressed
            color="primary"
            @click="login"
            :loading="loading"
            >登入
          </v-btn>
          <v-btn class="mt-9" block outlined color="primary" to="/register">
            申請帳號
          </v-btn>
        </v-form>
      </div>
    </v-card>
    <v-card v-else class="py-15">
      <div class="wrapper px-2">
        <h3 class="text-h3 text-center primary--text font-weight-bold">
          會員登入
        </h3>
        <div v-if="secondLayer">
          <div class="mt-15 d-flex justify-center">
            <v-btn
              depressed
              color="primary"
              x-large
              :to="{
                path: '/login/pec',
                query: { redirect: $route.query.redirect },
              }"
              >在職員工登入</v-btn
            >
          </div>
          <div class="mt-6 d-flex justify-center">
            <v-btn depressed color="primary" x-large @click="opLogin(1)"
              >退休/離職人員登入</v-btn
            >
          </div>
        </div>
        <div v-else>
          <div class="mt-6 d-flex justify-center">
            <v-btn depressed color="primary" x-large @click="secondLayer = true"
              >統一企業員工登入</v-btn
            >
          </div>
          <div class="mt-6 d-flex justify-center">
            <v-btn depressed color="primary" x-large @click="opLogin(0)"
              >統一集團員工登入</v-btn
            >
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
</template>
<script>
import { apiAxios } from '@/api'
import { mapState, mapGetters } from 'vuex'
import firebase from 'firebase/app'

export default {
  data() {
    return {
      show: false,
      username: '',
      password: '',
      loading: false,
      secondLayer: false,
    }
  },
  computed: {
    ...mapGetters(['userId']),
    ...mapState(['accessToken', 'clientId']),
    ...mapState(['showRegister']),
    isEmail() {
      return /.+@.+/.test(this.username)
    },
  },
  methods: {
    async login() {
      try {
        this.loading = true

        if (this.$refs.form.validate()) {
          if (this.isEmail) {
            let userCredential = await firebase
              .auth()
              .signInWithEmailAndPassword(this.username, this.password)

            let access_token = await userCredential.user.getIdToken()

            this.$store.commit('setToken', {
              access_token: access_token,
            })
            this.$router.push(this.$route.query.redirect || '/')
          } else {
            let data = await this.$store.dispatch('login', {
              username: this.username,
              password: this.password,
            })
            this.$store.commit('setToken', {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
            })

            if (window.GroupJSInterface && window.GroupJSInterface.onLogin) {
              window.GroupJSInterface.onLogin(this.accessToken)
            }

            window.dataLayer.push({ userId: this.userId })

            let user = await apiAxios({
              method: 'post',
              url: '/Users/GetUserProfile',
              data: {},
            })
            this.$store.commit('setProfile', user.result[0] || {})

            try {
              await apiAxios({
                method: 'post',
                url: '/Event/Visit',
                data: { user_id: this.userId, client_id: this.clientId },
              })
            } catch {
              null
            }

            if (user.result[0].email) {
              this.$router.push(this.$route.query.redirect || '/')
            } else {
              this.$router.push({
                path: '/profile',
                query: { redirect: this.$route.query.redirect || '/' },
              })
            }
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.message
        ) {
          this.$snackbar.add(error.response.data.message)
        } else {
          this.$snackbar.add('發生不可預期錯誤')
        }
      } finally {
        this.loading = false
      }
    },
    opLogin(useData) {
      return this.$store
        .dispatch('inOrOutLog', {
          emp_no: '',
          event_name: 'start_login_op',
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/OpMember/GetAuth',
            data: useData ? { company_id: '73251209' } : {},
          })
        )
        .then(res => {
          window.location.href = res.result
        })
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
