<template>
  <v-container fluid>
    <v-card class="py-15 mb-6">
      <div class="wrapper px-2">
        <h3 class="text-h3 text-center primary--text font-weight-bold">
          會員登入
        </h3>
        <div class="mb-5">
          <div class="mt-6 d-flex justify-center">
            <v-btn
              style="text-transform: none"
              depressed
              color="black"
              dark
              x-large
              @click="opLogin"
            >
              <v-img class="mr-2" src="./uniopen.png" :max-width="33"></v-img>
              uniopen 帳號登入
            </v-btn>
          </div>
          <div class="mt-6 d-flex justify-center">
            <v-btn
              depressed
              color="primary"
              x-large
              :to="{
                path: '/login/pec',
                query: { redirect: $route.query.redirect },
              }"
            >
              <v-img class="mr-4" src="./unilock.png" :max-width="33"></v-img
              >自助帳號密碼登入
            </v-btn>
          </div>
        </div>
        <div>
          <v-divider class="thick-divider"></v-divider>
          <p class="text--secondary text-center text-body-1 mt-4">
            統一企業在職員工可使用自助帳號密碼登入
          </p>
        </div>
      </div>
    </v-card>
  </v-container>
</template>
<script>
import { apiAxios } from '@/api'
import { mapState, mapGetters } from 'vuex'
// import firebase from 'firebase/app'

export default {
  data() {
    return {
      show: false,
      username: '',
      password: '',
      loading: false,
      secondLayer: false,
      isCheckedDontAskAgain: false,
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
    opLogin() {
      return this.$store
        .dispatch('inOrOutLog', {
          emp_no: '',
          event_name: 'start_login_op',
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/OpMember/GetAuth',
            data: {},
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
.thick-divider {
  border-top-width: 2px;
  border-top-style: solid;
  max-width: 247px;
  margin: 0 auto;
}
</style>
