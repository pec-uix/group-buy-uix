<template>
  <v-form lazy-validation ref="form">
    <v-sheet light>
      <v-container>
        <v-row dense style="max-height: 80vh; overflow-y: auto">
          <v-col cols="12">
            <div class="text-body-1 primary--text product-title">
              {{ product.product_name }}
            </div>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <div class="text-caption">配送方式</div>
            <v-chip-group
              mandatory
              active-class="selected"
              v-model="selfReceiveType"
            >
              <v-chip
                v-for="receive_type in product.receive_type_array"
                :key="receive_type.value"
                :value="receive_type.value"
                filter
                label
                outlined
                >{{ receive_type.text }}
              </v-chip>
            </v-chip-group>
            <v-row no-gutters v-show="selfReceiveType == 1">
              <v-col cols="6">
                <v-select
                  outlined
                  dense
                  :items="product.receive_area_array"
                  placeholder="請選擇地點"
                  :rules="[
                    v => selfReceiveType == 2 || !!v || '請選擇領貨地點',
                  ]"
                  v-model="selfReceiveArea"
                >
                </v-select>
              </v-col>
              <v-col cols="6" class="px-2 py-1">
                <span v-if="selfReceiveArea" class="text-h5 primary--text">
                  該區累積:{{ areaOrderNum }}件 / 成團: {{ product.goal_num }}件
                </span>
              </v-col>
            </v-row>
            <v-row no-gutters v-show="selfReceiveType != 1">
              <v-col cols="12">
                <span class="font-weight-bold">
                  {{ product.shipping_type }}
                </span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <div class="text-caption">規格</div>
            <!-- :items="product.spec_array" -->
            <v-select
              :items="handleSpecArray"
              placeholder="請選擇規格"
              item-text="spec_name"
              item-value="spec_id"
              dense
              outlined
              hide-details
              v-model="selfSpecId"
              @change="removeSelfSpecValidation()"
            >
              <template v-slot:item="{ item }">
                <div class="d-flex align-center" style="width: 100%">
                  <span class="flex-grow-1"> {{ item.spec_name }} </span>
                  <span class="primary--text ml-4">
                    ${{ item.discount_price.toLocaleString() }}
                  </span>
                </div>
              </template>
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center" style="width: 100%">
                  <span class="flex-grow-1"> {{ item.spec_name }} </span>
                  <span class="primary--text ml-4">
                    ${{ item.discount_price.toLocaleString() }}
                  </span>
                </div>
              </template>
            </v-select>
            <div class="text-right" v-if="getQuota() !== null">
              剩餘{{ getQuota() }}件
            </div>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <div class="text-caption">數量</div>
            <v-select
              v-if="inputType === 'select'"
              outlined
              dense
              :items="numArray"
              placeholder="請選擇數量"
              @change="changeInputType()"
              :rules="[
                v => /^\+?(0|[1-9]\d*)$/.test(v) || '請輸入正確數量',
                v =>
                  (selectedSpec.inv_num === null && product.inv_num == null) ||
                  v <= getQuota() ||
                  '超過剩餘數量',
              ]"
              v-model="selfOrderNum"
            ></v-select>
            <v-text-field
              v-else
              outlined
              dense
              class="text-center"
              placeholder="請選擇數量"
              v-model="selfOrderNum"
              prepend-inner-icon="remove"
              append-icon="add"
              @click:prepend-inner="remove()"
              @click:append="add()"
              @blur="changeInputType()"
              :rules="[
                v => /^\+?(0|[1-9]\d*)$/.test(v) || '請輸入正確數量',
                v =>
                  (selectedSpec.inv_num === null && product.inv_num == null) ||
                  v <= getQuota() ||
                  '超過剩餘數量',
              ]"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-btn
            :loading="isLoading"
            tile
            depressed
            color="primary"
            class="flex-grow-1"
            @click="
              () => {
                if (this.$refs.form.validate()) {
                  $emit('submit', {
                    receiveType: selfReceiveType,
                    receiveArea: selfReceiveArea,
                    orderNum: selfOrderNum,
                    specId: selfSpecId,
                    productId: product.product_id,
                    productName: product.product_name,
                  })
                }
              }
            "
          >
            {{ buttonText }}
          </v-btn>
        </v-row>
      </v-container>
    </v-sheet>
  </v-form>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      default: function () {
        return {}
      },
    },
    isLoading: {
      type: Boolean,
    },
    buttonText: {
      type: String,
    },
    areaOrderNumArray: {
      type: Array,
      default: function () {
        return []
      },
    },
    // value: {
    //   type: Object,
    //   default: function () {
    //     return {}
    //   },
    // },
    receiveType: {
      type: String,
    },
    receiveArea: {
      type: String,
    },
    orderNum: {
      type: String,
    },
    specId: {
      type: Number,
    },
    comeFrom: {
      type: String,
    },
  },
  watch: {
    // product: {
    //   handler() {
    //     this.selfSpecId = this.product.spec_array[0].spec_id
    //   },
    //   immediate: true,
    // },
    receiveType: {
      handler() {
        this.selfReceiveType = this.receiveType
      },
      immediate: true,
    },
    receiveArea: {
      handler() {
        if (
          this.product.receive_area_array.find(e => e.value == this.receiveArea)
        ) {
          this.selfReceiveArea = this.receiveArea
        } else {
          this.selfReceiveArea = ''
        }
      },
      immediate: true,
      deep: true,
    },
    orderNum: {
      handler() {
        this.selfOrderNum = this.orderNum
        this.changeInputType()
      },
      immediate: true,
      deep: true,
    },
    specId: {
      handler(val) {
        if (val) {
          this.selfSpecId = this.specId
        } else if (this.product.spec_array[0].spec_id) {
          this.selfSpecId = this.product.spec_array[0].spec_id
        } else {
          this.selfSpecId = this.specId
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      selfReceiveType: '',
      selfReceiveArea: '',
      selfOrderNum: '1',
      selfSpecId: '',
      numArray: Array.from({ length: 10 }).map((x, i) => ({
        text: i === 9 ? '10+' : i + 1,
        value: i + 1 + '',
      })), //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      inputType: 'select',
    }
  },
  computed: {
    selectedSpec() {
      return (
        this.product.spec_array.find(x => x.spec_id == this.selfSpecId) || {}
      )
    },
    areaOrderNum() {
      let area = this.areaOrderNumArray.filter(
        x => x.receive_area === this.selfReceiveArea
      )[0]

      return area ? area.order_num_with_ratio : 0
    },
    handleSpecArray() {
      let data = this.product.spec_array.map(e => {
        let productQuota =
          this.product.inv_num - this.product.order_num_with_ratio

        let specQuota = e.inv_num - e.spec_total_order_num_with_ratio

        let quota = null
        if (this.product.inv_num != null) {
          quota = Math.floor(productQuota / e.num_ratio)
        } else if (e.inv_num != null) {
          quota = Math.floor(specQuota / e.num_ratio)
        } else {
          quota = null
        }

        e.quota = quota < 0 ? 0 : quota
        if (e.quota == null) {
          e.disabled = false
        } else {
          e.disabled = quota <= 0 ? true : false
        }
        return e
      })

      return data
    },
  },
  methods: {
    add() {
      if (
        (this.selectedSpec.inv_num === null && this.product.inv_num == null) ||
        parseInt(this.selfOrderNum, 10) < this.getQuota()
      ) {
        this.selfOrderNum = parseInt(this.selfOrderNum, 10) + 1 + ''
      }
      this.changeInputType()
    },
    remove() {
      if (parseInt(this.selfOrderNum, 10) > 0) {
        this.selfOrderNum = parseInt(this.selfOrderNum, 10) - 1 + ''
      }
      this.changeInputType()
    },
    changeInputType() {
      this.inputType = parseInt(this.selfOrderNum, 10) < 10 ? 'select' : 'text'
    },
    getQuota() {
      let productQuota =
        this.product.inv_num - this.product.order_num_with_ratio

      let specQuota =
        this.selectedSpec.inv_num -
        this.selectedSpec.spec_total_order_num_with_ratio

      let quota = null
      if (this.product.inv_num != null) {
        quota = Math.floor(productQuota / this.selectedSpec.num_ratio)
      } else if (this.selectedSpec.inv_num != null) {
        quota = Math.floor(specQuota / this.selectedSpec.num_ratio)
      } else {
        quota = null
      }
      return quota < 0 ? 0 : quota
    },
    removeSelfSpecValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style scoped>
:deep(.v-list-item--disabled) {
  color: rgba(0, 0, 0, 0.38) !important;
}
:deep(.v-list-item--disabled.primary--text) {
  color: rgba(0, 0, 0, 0.38) !important;
}
</style>
