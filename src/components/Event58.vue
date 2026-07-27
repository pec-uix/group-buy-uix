<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="3">
        <router-link class="section-001" to="/activity/2021-1212-2">
          <v-img src="https://unilife.pec.com.tw/images/event-58-1.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link class="section-002" to="/activity/2021-1212-1">
          <v-img src="https://unilife.pec.com.tw/images/event-58-2.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link class="section-003" to="/activity/2021-1212-3">
          <v-img src="https://unilife.pec.com.tw/images/event-58-3.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link class="section-004" to="/activity/2022-0112-1">
          <v-img src="https://unilife.pec.com.tw/images/event-58-4.jpg"></v-img>
        </router-link>
      </v-col>

      <v-col cols="6">
        <router-link class="section-005" to="/activity/13ALL">
          <v-img src="https://unilife.pec.com.tw/images/event-58-5.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="6">
        <router-link class="section-006" to="/activity/2022-0112-4">
          <v-img src="https://unilife.pec.com.tw/images/event-58-6.jpg"></v-img>
        </router-link>
      </v-col>

      <v-col cols="12">
        <router-link class="section-007" to="/activity/2022-0112-2">
          <v-img src="https://unilife.pec.com.tw/images/event-58-7.jpg"></v-img>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isLogin', 'isVerified']),
  },
}
</script>
