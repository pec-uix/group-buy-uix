<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        cols="12"
        v-if="
          new Date() > new Date('2022-08-01T00:00:00+08:00') &&
          new Date() < new Date('2022-08-06T00:00:00+08:00')
        "
      >
        <router-link class="section-002" to="/activity/2022-0207-2">
          <v-img
            src="https://unilife.pec.com.tw/images/2022-0207-2.png"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="12">
        <router-link class="zone-008" to="/activity/2022-0531">
          <v-img
            src="https://unilife.pec.com.tw/images/2022-0719-1.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="12">
        <div class="d-flex justify-space-between">
          <div style="width: 42.5%">
            <router-link class="zone-006" to="/activity/1110719">
              <v-img
                src="https://unilife.pec.com.tw/images/2022-0719-2.jpg"
              ></v-img>
            </router-link>
          </div>
          <div
            style="width: 57%"
            class="d-flex flex-column justify-space-between"
          >
            <router-link class="zone-003" to="/activity/20220408-3">
              <v-img
                src="https://unilife.pec.com.tw/images/2022-0719-3.jpg"
              ></v-img>
            </router-link>
          </div>
        </div>
        <div class="d-flex justify-space-between mt-1">
          <div style="width: 42.5%">
            <router-link class="zone-001" to="/activity/shopee">
              <v-img
                src="https://unilife.pec.com.tw/images/2022-0719-4.jpg"
              ></v-img>
            </router-link>
          </div>
          <div
            style="width: 57%"
            class="d-flex flex-column justify-space-between"
          >
            <router-link class="zone-002" to="/activity/20220408-1">
              <v-img
                src="https://unilife.pec.com.tw/images/2022-0719-5.jpg"
              ></v-img>
            </router-link>
          </div>
        </div>
      </v-col>

      <v-col cols="12" class="mt-3">
        <router-link class="section-001" to="/activity/2022-0321-1">
          <v-img
            src="https://unilife.pec.com.tw/images/2022-0711-1.jpg"
          ></v-img>
        </router-link>
      </v-col>

      <v-col cols="4">
        <router-link class="zone-004" to="/activity/2022-0513-2">
          <v-img
            src="https://unilife.pec.com.tw/images/2022-0711-2.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-005" to="/activity/2021-1212-1">
          <v-img
            src="https://unilife.pec.com.tw/images/2022-0711-3.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-007" to="/activity/2022-0112-4">
          <v-img
            src="https://unilife.pec.com.tw/images/2022-0711-4.jpg"
          ></v-img>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

