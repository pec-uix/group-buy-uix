<template>
  <v-container fluid>
    <v-row dense class="d-none d-sm-flex">
      <v-col
        cols="12"
        v-if="new Date() < new Date('2022-05-23T00:00:00+08:00')"
      >
        <router-link class="section-001" to="/activity/2022-0513-1">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-1-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="section-002" to="/activity/2022-0513-2">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-2-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="section-003" to="/activity/2021-1212-1">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-3-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="section-004" to="/activity/2022-0112-4">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-4-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>
    </v-row>
    <v-row dense class="d-sm-none">
      <v-col
        cols="12"
        v-if="new Date() < new Date('2022-05-23T00:00:00+08:00')"
      >
        <router-link class="section-001" to="/activity/2022-0513-1">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-1-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="section-002" to="/activity/2022-0513-2">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-2-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="section-003" to="/activity/2021-1212-1">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-3-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="section-004" to="/activity/2022-0112-4">
          <v-img
            src="https://unilife.pec.com.tw/images/event-513-4-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

