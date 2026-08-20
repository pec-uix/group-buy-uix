<template>
  <v-app>
    <v-main class="grey lighten-4">
      <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-dialog v-model="dialog" max-width="800" persistent>
          <v-card>
            <v-card-title>申請退貨</v-card-title>
            <v-card-text>
              <v-textarea v-model="reason" outlined label="退貨原因"> </v-textarea>
              <v-checkbox
                v-model="checkbox"
                label="我同意辦理退貨時，由團購網代為處理發票及銷貨退回證明單，以加速退貨退款作業"
              ></v-checkbox>
              <p class="text-body-2 grey--text text--darken-1 mt-1 mb-0">
                線上支付退款作業完成後，款項約 7 ~ 14 個工作天退刷。（實際仍以銀行作業為主）
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="primary" @click="dialog = false">取消</v-btn>
              <v-btn outlined color="primary">送出申請</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'RefundDialogPreview',
  data() {
    return {
      dialog: true,
      reason: '',
      checkbox: false,
    }
  },
}
</script>
