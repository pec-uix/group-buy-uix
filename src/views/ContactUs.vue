<template>
  <v-container fluid class="pa-0">
    <v-img src="/terms-and-policy.jpg" class="pec-page"> </v-img>
    <pec-line></pec-line>
    <div class="px-4">
      <h6 class="text-center text-h6 primary--text my-6">
        請留下聯絡資料，專人將盡快與你聯繫
      </h6>
      <v-form class="mb-4">
        <v-container>
          <v-row>
            <v-col cols="12" sm="3">聯絡資訊</v-col>
            <v-col cols="12" sm="9">
              <v-text-field dense outlined label="姓名"></v-text-field>
              <v-text-field dense outlined label="員工編號"></v-text-field>
              <v-text-field dense outlined label="E-mail"></v-text-field>
              <v-text-field dense outlined label="聯絡電話"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="3">問題類型</v-col>
            <v-col cols="12" sm="9">
              <v-select outlined label="問題類型"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="3">回饋訊息</v-col>
            <v-col cols="12" sm="9">
              <v-text-field outlined label="訊息主旨"></v-text-field>
              <v-textarea outlined label="訊息內文"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="8" offset-sm="2">
              <v-btn block depressed color="primary">確認送出</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </v-container>
</template>
<script>
import PecLine from '@/components/PecLine.vue'

export default {
  components: {
    PecLine,
  },
}
</script>
