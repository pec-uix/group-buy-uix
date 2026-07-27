<template>
  <div class="d-flex">
    <v-alert v-if="!isUserLoggedIn" text color="warning" class="mx-auto my-4">
      <p>目前環境尚未登入 無法查詢付款狀態</p>
      <p>請切換到APP或是原本進行付款的網頁確認付款狀態</p>
    </v-alert>
    <v-progress-circular
      v-else-if="isLoading"
      class="mx-auto my-4"
      :size="200"
      indeterminate
      color="primary"
      >付款狀態確認中</v-progress-circular
    >
  </div>
</template>
<script>
import { apiAxios } from '@/api'

export default {
  props: ['merchantTradeNo', 'checkoutId', 'transactionId'],
  created() {
    // 檢查是否已登入
    if (!this.isUserLoggedIn) {
      return
    }

    this.isLoading = true
    return apiAxios({
      method: 'post',
      url: '/Transaction/ConfirmTransaction',
      data: {
        transactionId: this.transactionId,
      },
      timeout: 40000,
    })
      .catch(() => {
        // 即使超時也繼續查詢交易狀態
      })
      .then(() =>
        apiAxios({
          method: 'post',
          url: '/Transaction/VerifyTransactionStatus',
          data: {
            transactionId: this.transactionId,
          },
          timeout: 20000,
        })
      )
      .then(res => {
        if (res.result === 'SUCCESS') {
          this.$router.replace(`/checkout-result/${this.checkoutId}`)
        } else {
          let message

          switch (res.result) {
            case 'PENDING':
              message = '交易未完成'
              break
            case 'FAILURE':
              message = '交易失敗'
              break
            case 'UNKNOWN':
              message = '交易狀態不明'
              break
            default:
              message = '交易失敗'
          }

          this.$dialog
            .show(message, { title: '支付未成功' })
            .then(() =>
              this.$router.replace(`/checkout-result/${this.checkoutId}`)
            )
        }
      })
      .catch(() => {
        this.$dialog
          .show('交易處理失敗，請稍後重試', { title: '錯誤' })
          .then(() =>
            this.$router.replace(`/checkout-result/${this.checkoutId}`)
          )
      })
      .finally(() => (this.isLoading = false))
  },
  data() {
    return {
      isLoading: true,
    }
  },
  computed: {
    isUserLoggedIn() {
      // 使用 store 的 isLogin getter 判斷登入狀態
      return this.$store.getters.isLogin
    },
  },
}
</script>
