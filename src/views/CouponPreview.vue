<template>
  <div style="min-height: 100vh; background: #f5f5f5; display: flex; flex-direction: column; align-items: center; padding: 32px 16px;">
    <div style="width: 100%; max-width: 220px;">
      <div class="text-caption grey--text text-center mb-3">不可折抵折價券 UI 設計稿</div>
      <pec-product-card
        :product="mockProduct"
        :is-login="true"
        :is-verified="true"
        :to="{ name: 'Product', params: { productId: 'mock' } }"
      ></pec-product-card>
    </div>
  </div>
</template>

<script>
import PecProductCard from '@/components/PecProductCard.vue'

export default {
  name: 'CouponPreview',
  components: { PecProductCard },
  data() {
    return {
      mockProduct: {
        product_id: 'mock',
        product_name: '【御衣坊】檸檬水晶濃縮洗衣精補充包2000ml',
        img_url: '',
        max_list_price: 1300,
        min_discount_price: 399,
        max_discount_price: 399,
        discount_price: 399,
        start_date: '2020-01-01',
        end_date: '2027-06-07',
        receive_type: '2',
        teambuy: 'N',
        inv_num: 104,
        order_num_with_ratio: 87,
        acc_order_num: 0,
        goal_num: 1,
        reward_exclude: 'Y',
        _variant: 'D3',
        subtitle: '',
        noticed: 'N',
        track_status: 'N',
        hide_order_num: 'N',
        tb_status: null,
      },
    }
  },
}
</script>
