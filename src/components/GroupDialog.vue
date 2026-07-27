<template>
  <v-dialog v-model="teamBuyDialog" persistent :max-width="600">
    <div v-if="teamBuyDialogStatus == 'join'">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">{{
          teamBuyDialogData.product_name
        }}</v-card-title>
        <v-card-text class="mt-3">
          <v-form lazy-validation ref="form">
            <v-text-field
              label="取貨地點"
              :value="teamBuyDialogData.receive_area"
              outlined
              dense
              color="deep-purple accent-1"
              disabled
            ></v-text-field>
            <v-text-field
              label="規格"
              :value="teamBuyDialogData.spec"
              outlined
              dense
              color="deep-purple accent-1"
              disabled
            ></v-text-field>
            <v-text-field
              label="預計結團時間"
              :value="
                $dayjs(teamBuyDialogData.end_date).format('YYYY-MM-DD HH:mm')
              "
              outlined
              dense
              color="deep-purple accent-1"
              disabled
            ></v-text-field>
            <v-text-field
              label="跟團數量"
              outlined
              dense
              type="number"
              color="deep-purple accent-1"
              v-model="joinData.order_num"
              :min="1"
              :rules="[
                v => !!v || '請填寫跟團數量',
                v => v >= 1 || '跟團數量至少為1',
              ]"
            ></v-text-field>
            <v-text-field
              label="手機/分機"
              outlined
              dense
              type="number"
              color="deep-purple accent-1"
              v-model="joinData.phone_fallow"
              :rules="[v => !!v || '請填寫手機/分機']"
            ></v-text-field>
            <v-text-field
              label="備註"
              outlined
              dense
              color="deep-purple accent-1"
              v-model="joinData.memo"
              :rules="[v => !!v || '請填寫備註']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">取消</v-btn>
          <v-btn
            depressed
            color="deep-purple accent-1"
            dark
            @click="joinTeamBuy"
            >確認跟團</v-btn
          >
        </v-card-actions>
      </v-card>
    </div>
    <div v-else-if="teamBuyDialogStatus == 'start'">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">{{
          teamBuyDialogData.product_name
        }}</v-card-title>
        <v-card-text class="mt-3">
          <v-form lazy-validation ref="form">
            <v-select
              label="取貨地點"
              :items="teamBuyDialogData.receive_area_array"
              outlined
              dense
              color="deep-purple accent-1"
              v-model="insertData.receive_area"
              :rules="[v => !!v || '請選擇取貨地點']"
            ></v-select>
            <v-select
              label="規格"
              :items="teamBuyDialogData.spec_array"
              item-text="spec_name"
              item-value="spec_id"
              outlined
              dense
              color="deep-purple accent-1"
              v-model="insertData.spec_id"
              :rules="[v => !!v || '請選擇規格']"
            ></v-select>
            <v-text-field
              label="開團數量"
              outlined
              dense
              type="number"
              color="deep-purple accent-1"
              v-model="insertData.target_num"
              :rules="[v => !!v || '請填寫開團數量']"
            ></v-text-field>
            <!-- <v-menu
            v-model="start_date_menu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="insertData.start_date"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                color="deep-purple accent-1"
                :rules="[v => !!v || '請選擇開始時間']"
              >
                <template #label> 開始時間 </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="insertData.start_date"
              @input="start_date_menu = false"
              locale="zh-TW"
              color="deep-purple accent-1"
              :min="$dayjs(new Date()).format('YYYY-MM-DD')"
              :max="teamBuyDialogData.end_date"
            ></v-date-picker>
          </v-menu> -->
            <v-text-field
              label="開始時間"
              outlined
              dense
              type="datetime-local"
              color="deep-purple accent-1"
              v-model="insertData.start_date"
              :min="$dayjs(new Date()).format('YYYY-MM-DDTHH:mm')"
              :max="
                $dayjs(teamBuyDialogData.end_date).format('YYYY-MM-DDTHH:mm')
              "
              :rules="[v => !!v || '請選擇開始時間']"
            ></v-text-field>
            <!-- <v-menu
            v-model="end_date_menu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="insertData.end_date"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                color="deep-purple accent-1"
                :rules="[v => !!v || '請選擇結束時間']"
              >
                <template #label> 結束時間 </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="insertData.end_date"
              @input="end_date_menu = false"
              locale="zh-TW"
              color="deep-purple accent-1"
              :min="$dayjs(new Date()).format('YYYY-MM-DD')"
              :max="teamBuyDialogData.end_date"
            ></v-date-picker>
          </v-menu> -->
            <v-text-field
              label="結束時間"
              outlined
              dense
              type="datetime-local"
              color="deep-purple accent-1"
              v-model="insertData.end_date"
              :min="$dayjs(new Date()).format('YYYY-MM-DDTHH:mm')"
              :max="
                $dayjs(teamBuyDialogData.end_date).format('YYYY-MM-DDTHH:mm')
              "
              :rules="[v => !!v || '請選擇結束時間']"
            ></v-text-field>
            <v-text-field
              label="手機/分機"
              outlined
              dense
              type="number"
              color="deep-purple accent-1"
              v-model="insertData.phone_start"
              :rules="[v => !!v || '請填寫手機/分機']"
            ></v-text-field>
            <v-text-field
              label="備註"
              outlined
              dense
              color="deep-purple accent-1"
              v-model="insertData.memo"
              :rules="[v => !!v || '請填寫詳細分貨地點']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">取消</v-btn>
          <v-btn
            depressed
            color="deep-purple accent-1"
            dark
            @click="insertTeamBuy"
            >開團</v-btn
          >
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { apiAxios } from '@/api'
export default {
  data() {
    return {
      start_date_menu: false,
      end_date_menu: false,
      insertData: {},
      joinData: {},
    }
  },
  computed: {
    ...mapState(['teamBuyDialog', 'teamBuyDialogData', 'teamBuyDialogStatus']),
  },
  methods: {
    cancel() {
      this.$store.commit('setTeamBuyDialog', { dialog: false, data: {} })
      this.insertData = {}
    },
    insertTeamBuy() {
      this.insertData.product_id = this.teamBuyDialogData.product_id
      if (this.$refs.form.validate()) {
        this.$store.commit('setTeamBuyDialog', { dialog: false, data: {} })
        return apiAxios({
          method: 'post',
          url: '/TeamBuy/InsertTeamBuy',
          data: this.insertData,
        }).then(res => {
          if (res.status) {
            this.$snackbar.add(res.message, { color: 'success' })
          } else {
            this.$snackbar.add(res.message)
          }
          this.insertData = {}
        })
      } else {
        this.$snackbar.add('尚有必填欄位未填寫')
      }
    },
    joinTeamBuy() {
      this.joinData.parent_id = this.teamBuyDialogData.id
      if (this.$refs.form.validate()) {
        this.$store.commit('setTeamBuyDialog', { dialog: false, data: {} })
        return apiAxios({
          method: 'post',
          url: '/TeamBuy/JoinTeamBuy',
          data: this.joinData,
        }).then(res => {
          if (res.status) {
            this.$snackbar.add(res.message, { color: 'success' })
          } else {
            this.$snackbar.add(res.message)
          }
          this.joinData = {}
        })
      } else {
        this.$snackbar.add('尚有必填欄位未填寫')
      }
    },
  },
}
</script>
<style>
/* ::v-deep .v-text-field__details {
  display: none;
} */
input[type='datetime-local'] {
  position: relative;
}
input[type='datetime-local']::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  color: transparent;
  background: transparent;
}
</style>