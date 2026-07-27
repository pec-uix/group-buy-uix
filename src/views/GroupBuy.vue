<template>
  <pec-member-template
    img-src="/my-order.jpg"
    :breadcrumbs="[
      {
        text: '首頁',
        disabled: false,
        to: '/',
      },
      {
        text: '分級會員',
        disabled: false,
      },
    ]"
  >
    <img
      :src="'https://unilife.pec.com.tw/images/group-buy-vip-ver3.jpg'"
      alt=""
      width="100%"
    />
  </pec-member-template>
</template>
<script>
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'

export default {
  components: { PecMemberTemplate },
}
</script>
