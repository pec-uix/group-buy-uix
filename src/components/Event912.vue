<template>
  <v-container fluid>
    <v-row no-gutters class="d-md-none">
      <v-col cols="12">
        <!-- <v-img src="/912/0.jpg"></v-img> -->
        <v-img
          src="https://unilife.pec.com.tw/images/october-9grid-app.jpg"
        ></v-img>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-001" to="/activity/shopee">
          <v-img src="/912/1.jpg"></v-img>
        </router-link> </v-col
      ><v-col cols="4">
        <router-link class="zone-007" to="/activity/2022-0112-4">
          <v-img src="/912/2.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-006" to="/activity/1110719">
          <v-img src="/912/3.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-009" to="/category/25">
          <v-img src="/912/4.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-005" to="/activity/2021-1212-1">
          <v-img src="/912/5.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-010" to="/category/26">
          <v-img src="/912/6.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link to="/category/28">
          <v-img src="/912/7.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-015" to="/activity/wine">
          <v-img src="/912/8.jpg"></v-img>
        </router-link>
      </v-col>
      <v-col cols="4">
        <router-link class="zone-014" to="/category/23">
          <v-img src="/912/9.jpg"></v-img>
        </router-link>
      </v-col>
    </v-row>
    <v-row no-gutters class="d-none d-md-flex">
      <v-col cols="12">
        <!-- <v-img src="/912pc/0.jpg"></v-img> -->
        <v-img
          src="https://unilife.pec.com.tw/images/october-9grid-web.jpg"
        ></v-img>
      </v-col>
      <v-col cols="12">
        <div class="d-flex">
          <div class="w20">
            <router-link class="zone-001" to="/activity/shopee">
              <v-img src="/912pc/1.jpg"></v-img>
            </router-link>
          </div>
          <div class="w30">
            <router-link class="zone-007" to="/activity/2022-0112-4">
              <v-img src="/912pc/2.jpg"></v-img>
            </router-link>
          </div>
          <div class="w30">
            <router-link class="zone-005" to="/activity/2021-1212-1">
              <v-img src="/912pc/3.jpg"></v-img>
            </router-link>
          </div>
          <div class="w20">
            <router-link class="zone-006" to="/activity/1110719">
              <v-img src="/912pc/4.jpg"></v-img>
            </router-link>
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex">
          <div class="w20">
            <router-link to="/category/28">
              <v-img src="/912pc/5.jpg"></v-img>
            </router-link>
          </div>
          <div class="w20">
            <router-link class="zone-010" to="/category/26">
              <v-img src="/912pc/6.jpg"></v-img>
            </router-link>
          </div>
          <div class="w20">
            <router-link class="zone-009" to="/category/25">
              <v-img src="/912pc/7.jpg"></v-img>
            </router-link>
          </div>
          <div class="w20">
            <router-link class="zone-015" to="/activity/wine">
              <v-img src="/912pc/8.jpg"></v-img>
            </router-link>
          </div>
          <div class="w20">
            <router-link class="zone-014" to="/category/23">
              <v-img src="/912pc/9.jpg"></v-img>
            </router-link>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.w20 {
  width: 20%;
}
.w30 {
  width: 30%;
}
</style>
