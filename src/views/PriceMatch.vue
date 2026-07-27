<template>
  <v-container fluid class="pa-0">
    <!-- <v-img src="/terms-and-policy.jpg" class="pec-page"> </v-img>
    <pec-line></pec-line> -->
    <v-breadcrumbs
      large
      :items="[
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '買貴退差價',
          disabled: false,
        },
      ]"
      class="primary--text"
    ></v-breadcrumbs>
    <div class="px-4">
      <img
        src="https://unilife.pec.com.tw/images/price-match.jpg"
        alt=""
        width="100%"
      />
    </div>
  </v-container>
</template>
