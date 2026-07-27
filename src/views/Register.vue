<template>
  <v-container fluid>
    <v-card class="py-15">
      <div class="wrapper px-2">
        <h3 class="text-h3 text-center primary--text font-weight-bold">
          帳號申請
        </h3>
        <v-form>
          <v-text-field
            class="mt-8"
            outlined
            label="E-mail"
            type="text"
            autocomplete="username"
            v-model="username"
          ></v-text-field>
          <v-text-field
            outlined
            name="password"
            label="密碼"
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            @click:append="show = !show"
            @keyup.enter="register"
            autocomplete="current-password"
            v-model="password"
          ></v-text-field>
          <v-btn
            class="mt-9"
            block
            depressed
            color="primary"
            @click="register"
            :loading="loading"
            >註冊
          </v-btn>
          <v-btn class="mt-9" block outlined color="primary" to="/login">
            改為登入
          </v-btn>
        </v-form>
      </div>
    </v-card>
  </v-container>
</template>
<script>
import firebase from 'firebase/app'

export default {
  data() {
    return {
      show: false,
      username: '',
      password: '',
      loading: false,
    }
  },
  methods: {
    async register() {
      try {
        this.loading = true
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.username, this.password)
          .then(userCredential => userCredential.user.getIdToken())
          .then(token => {
            this.$store.commit('setToken', {
              access_token: token,
              refresh_token: '',
            })
            this.$router.push('/')
          })
          .catch(err => this.$snackbar.add(err.message))
      } finally {
        this.loading = false
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