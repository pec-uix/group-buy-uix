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
        text: '隱私權條款',
        disabled: false,
      },
    ]"
      class="primary--text"
    ></v-breadcrumbs>
    <div class="px-4">
      <h4 class="text-h4 primary--text pb-4">Q1：如何加入會員？</h4>
      <v-row no-gutters>
        <v-col cols="12" md="4">
          <v-img src="https://unilife.pec.com.tw/images/q1-1.jpg"> </v-img>
        </v-col>
        <v-col cols="12" md="4">
          <v-img src="https://unilife.pec.com.tw/images/q1-2.jpg"> </v-img>
        </v-col>
        <v-col cols="12" md="4">
          <v-img src="https://unilife.pec.com.tw/images/q1-3.jpg"> </v-img>
        </v-col>
      </v-row>
      <h4 class="text-h4 primary--text pb-4">Q2：登入有問題？</h4>
      <h6 class="text-h6 pa-2 mb-4 white--text" style="background: #538234">
        狀況一<br />忘記密碼
      </h6>
      <p>
        Step1. 進入統一企業員工入口網 -> 人資 -> 員工自助服務
        (要在公司內部網路環境或是使用VPN)
      </p>
      <p>
        Step2. 在登入畫面底下，點擊
        <span style="color: blue">【重設密碼】</span>
      </p>
      <p>Step3. 依照指示輸入相關欄位資料後即可重設密碼</p>
      <h6 class="text-h6 pa-2 mb-4 white--text" style="background: #538234">
        狀況二<br />
        帳號登入失敗次數超過5次，帳號已封鎖，無法登入；請至員工自助服務系統重新設定密碼
      </h6>
      <p>
        Step1. 進入統一企業員工入口網 -> 人資 -> 員工自助服務
        (要在公司內部網路環境或是使用VPN)
      </p>
      <p>
        Step2. 登入員工自助服務系統，點擊畫面右上角
        <span style="color: #ff720e">"修改密碼"</span>
      </p>
      <p>Step2.1 如果忘記密碼無法登入，請參考"忘記密碼"步驟</p>
      <p>Step3. 依照指示輸入相關欄位資料後設定新密碼，即可解鎖帳號</p>
    </div>
  </v-container>
</template>
