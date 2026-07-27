<template>
  <v-card>
    <v-card-title>選擇折價券(三聯式發票不得使用折價券)</v-card-title>
    <v-divider></v-divider>
    <v-card-text style="max-height: calc(90vh - 110px)">
      <v-list two-line>
        <v-list-item-group multiple v-model="selectedCustomerRewardIdArray">
          <v-list-group
            v-for="groupByReward in groupByRewardArray"
            :key="groupByReward[0].reward_id"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  <v-chip class="mr-2"
                    >{{
                      groupByReward.filter(x =>
                        selectedCustomerRewardIdArray.includes(x.id)
                      ).length
                    }}/{{ groupByReward.length }}</v-chip
                  >
                  {{ groupByReward[0].reward_name }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="item in groupByReward"
              :key="item.id"
              :value="item.id"
              :ripple="false"
              :disabled="
                totalSelectedCustomerRewardAmountReached + item.amount_reached >
                  productTotalPrice &&
                !selectedCustomerRewardIdArray.includes(item.id)
              "
            >
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>編號:{{ item.id }} </v-list-item-title>
                  <v-list-item-subtitle>
                    截止日: {{ $dayjs(item.end_date).format('MM/DD') }}
                    <v-chip v-if="item.invalid" color="warning" outlined small
                      >無法套用</v-chip
                    >
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    購物車滿{{ item.amount_reached }}元使用
                  </v-list-item-subtitle>
                </v-list-item-content>
                <!-- <v-list-item-icon v-if="active">
                  <v-icon class="handle"> reorder </v-icon>
                </v-list-item-icon> -->
              </template>
            </v-list-item>
          </v-list-group>
        </v-list-item-group>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn depressed @click="$emit('cancel')" text>取消</v-btn>
      <v-btn depressed @click="applyReward" color="primary">套用</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { apiAxios } from '@/api'
// import draggable from 'vuedraggable'
import groupBy from 'lodash/groupBy'

export default {
  // components: { draggable },
  props: {
    cartIdArray: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    productTotalPrice: { type: Number, default: 0 },
  },
  created() {
    return apiAxios({
      method: 'post',
      url: '/Reward/GetUserCustomerReward',
    }).then(res => {
      this.rewardArray = this.rewardArray = res.result.map(x => ({
        ...x,
        invalid: false,
      }))
    })
  },
  watch: {
    selectedCustomerRewardIdArrayWithOrder() {
      this.rewardArray.forEach(reward => {
        reward.invalid = false
      })
    },
  },
  data() {
    return {
      rewardArray: [],
      drag: false,
    }
  },
  computed: {
    groupByRewardArray() {
      return Object.values(groupBy(this.rewardArray, 'reward_id')).sort(
        (a, b) => (a[0].end_date > b[0].end_date ? 1 : -1)
      )
    },
    selectedCustomerRewardIdArray: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit(
          'input',
          this.rewardArray.filter(x => newValue.includes(x.id)).map(x => x.id)
        )
      },
    },
    totalSelectedCustomerRewardAmountReached() {
      return this.rewardArray
        .filter(x => this.selectedCustomerRewardIdArray.includes(x.id))
        .reduce((acc, cur) => acc + cur.amount_reached, 0)
    },
    selectedCustomerRewardIdArrayWithOrder() {
      return this.rewardArray
        .filter(x => this.selectedCustomerRewardIdArray.includes(x.id))
        .map(x => x.id)
    },
  },
  methods: {
    applyReward() {
      return apiAxios({
        method: 'post',
        url: '/Checkout/CartToPreorder',
        data: {
          customer_reward_id_array: this.selectedCustomerRewardIdArrayWithOrder,
          cart_id_array: this.cartIdArray,
        },
      }).then(res => {
        if (res.result.invalid_customer_reward_array.length) {
          this.rewardArray.forEach(reward => {
            if (
              res.result.invalid_customer_reward_array
                .map(x => x.id)
                .includes(reward.id)
            ) {
              reward.invalid = true
            }
          })
          this.$snackbar.add('折價券套用失敗')
        } else {
          this.$emit('success', res.result)
        }
      })
    },
  },
}
</script>
<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
