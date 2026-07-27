<template>
  <!-- <div>
    
    <v-btn @click="requestBindCard">新增信用卡</v-btn>
    <v-list subheader>
      <v-list-item v-for="card in cardArray" :key="card.cardId">
        <v-list-item-content>
          <v-list-item-title v-text="card.maskedPan"></v-list-item-title>
          <v-list-item-title v-text="card.expiryDate"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon @click="removeCard(card.cardId)">
            <v-icon> fas fa-remove </v-icon>
          </v-btn>
          <v-btn @click="setCardAsDefault(card.cardId)"> 設為預設 </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div> -->

  <div>
    <div class="d-flex justify-end flex-wrap">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>

      <v-spacer></v-spacer>
    </div>

    <v-card class="pa-8 pt-4 pb-0 mb-8">
      <v-form lazy-validation ref="form">
        <div>
          <v-list three-line subheader class="pb-0">
            <v-list-item class="text-left px-0 px-md-4">
              <v-list-item-content class="justify-space-between py-4">
                <v-list-item-title
                  class="mb-0 pt-2"
                  style="font-size: 22px; font-weight: 700"
                >
                  常用信用卡
                </v-list-item-title>

                <v-list-item-subtitle> 請選擇預設信用卡 </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content>
                <template>
                  <div class="my-2">
                    <v-btn
                      class="float-right"
                      color="error"
                      dark
                      large
                      @click="dialog = true"
                    >
                      <v-icon left>add</v-icon>
                      信用卡資訊
                    </v-btn>
                  </div>
                </template>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-radio-group v-model="radioGroup">
              <div
                v-if="cardArray.length > 0"
                style="
                  background-color: #ffe5e5;
                  color: #ff0000;
                  margin-bottom: 20px;
                  text-align: center;
                  padding: 10px;
                "
              >
                新增信用卡時，團購網將會進行一筆1元測試交易，此筆款項不會實際扣款，請放心依步驟進行認證
                !
              </div>
              <v-list-item
                v-if="cardArray.length <= 0"
                class="text-left theme--light v-sheet--outlined mx-md-4 mb-4 rounded-lg grey lighten-1"
                style="
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: auto;
                  min-height: auto;
                  padding: 22px 0;
                  box-sizing: border-box;
                "
              >
                <h3 class="text-center white--text" style="width: 100%">
                  尚未新增常用信用卡
                </h3>
                <div class="text-center white--text">
                  新增信用卡時，團購網將會進行一筆1元測試交易，此筆款項不會實際扣款，請放心依步驟進行認證
                  !
                </div>
              </v-list-item>

              <v-list-item
                v-for="(item, index) in cardArray"
                :key="index"
                class="text-left theme--light v-sheet--outlined mx-md-4 mb-4 rounded-lg"
              >
                <v-card-actions class="pl-0">
                  <v-radio
                    name="radioGroup"
                    :value="index"
                    @click="setCardAsDefault(item.cardId)"
                    :disabled="checkExpiry(item.expiryDate)"
                  ></v-radio>
                </v-card-actions>

                <v-list-item-content style="cursor: default">
                  <v-list-item-title
                    class="mb-2 text--darken-1 font-weight-bold d-flex align-center"
                    style="min-height: 24px"
                    :style="`${
                      checkExpiry(item.expiryDate)
                        ? 'color:rgba(0, 0, 0, 0.38)'
                        : ''
                    }`"
                  >
                    {{ item.issuerName }}
                    <v-chip
                      v-if="radioGroup == index"
                      class="ml-2"
                      color="secondary"
                      label
                      small
                    >
                      預設
                    </v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle
                    :style="`${
                      checkExpiry(item.expiryDate)
                        ? 'color:rgba(0, 0, 0, 0.38)'
                        : ''
                    }`"
                  >
                    {{ item.maskedPan }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle
                    :style="`${
                      checkExpiry(item.expiryDate)
                        ? 'color:rgba(0, 0, 0, 0.38)'
                        : ''
                    }`"
                  >
                    {{ formattedNumber(item.expiryDate) }} {{
                      checkExpiry(item.expiryDate) ? '(已過期)' : ''
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <!-- <v-btn icon @click="openPersonalInformation(false, item)">
                    <v-icon>edit</v-icon>
                  </v-btn> -->

                  <v-btn
                    icon
                    @click="
                      catchCardId = item.cardId
                      removeCardDialog = true
                    "
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-list-item>
            </v-radio-group>
          </v-list>
        </div>
      </v-form>
    </v-card>
    <v-dialog v-model="dialog" persistent scrollable max-width="320">
      <v-card class="rounded-lg">
        <v-card-title
          class="font-weight-bold primary--text justify-center mt-2 pb-2"
          ><i class="fal fa-exclamation-circle mr-2"></i>提醒</v-card-title
        >
        <v-card-text class="black--text pb-2">
          <p class="text-center mb-0">
            即將前往國泰世華新增信用卡頁面， 請依照頁面指示新稱。
          </p>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between px-9 pb-7">
          <v-btn
            outlined
            color="primary"
            style="min-width: 116px"
            @click="dialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            style="min-width: 116px"
            @click="requestBindCard()"
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="removeCardDialog" persistent scrollable max-width="320">
      <v-card class="rounded-lg">
        <v-card-title
          class="font-weight-bold primary--text justify-center mt-2 pb-2"
          ><i class="fal fa-exclamation-circle mr-2"></i>提醒</v-card-title
        >
        <v-card-text class="black--text pb-2">
          <p class="text-center mb-0">確定刪除此張信用卡 ?</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between px-9 pb-7">
          <v-btn
            outlined
            color="primary"
            style="min-width: 116px"
            @click="removeCardDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            style="min-width: 116px"
            @click="
              removeCard(catchCardId)
              removeCardDialog = false
            "
          >
            確定刪除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { apiAxios } from '@/api'

export default {
  created() {
    this.updateRadioGroup()
    if (this.$route.query.sessionId) {
      return apiAxios({
        method: 'post',
        url: '/CreditCard/VerifyBindCard',
        data: {
          sessionId: this.$route.query.sessionId,
        },
      })
        .then(() => {
          // console.log(res.result)
        })
        .finally(() => {
          this.$router.replace({ path: this.$route.path, query: {} })
        })
    } else {
      this.getCardArray()
    }
  },
  data() {
    return {
      dialog: false,
      removeCardDialog: false,
      cardArray: [],
      isLoading: false,
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '常用信用卡',
          to: '/credit-card',
        },
      ],
      openPersonalInformationDialog: false,
      openPersonalInformationListDialog: false,
      radioGroup: null,
      defaultCardId: null,
      catchCardId: null,
    }
  },
  computed: {},
  methods: {
    getCardArray() {
      apiAxios({
        method: 'post',
        url: '/CreditCard/GetCardArray',
      }).then(res => {
        this.cardArray = res.result
      })
    },
    formattedNumber(expiryDate) {
      if (!expiryDate) {
        return ''
      }
      const numberStr = expiryDate.toString().padStart(4, '0')
      return numberStr.slice(0, 2) + '/' + numberStr.slice(2)
    },
    updateRadioGroup() {
      return Promise.all([
        apiAxios({
          method: 'post',
          url: '/Users/GetUserProfile',
          data: {},
        }).then(res => {
          if (res.result[0]) {
            this.defaultCardId = res.result[0].default_card_id
            // console.log(res.result[0].default_card_id)
          }
        }),
        apiAxios({
          method: 'post',
          url: '/CreditCard/GetCardArray',
        }).then(res => {
          this.cardArray = res.result
        }),
      ]).then(() => {
        if (this.defaultCardId && this.cardArray.length > 0) {
          if (
            this.cardArray
              .map(item => {
                return item.cardId == this.defaultCardId
              })
              .indexOf(true) !== -1
          ) {
            this.radioGroup = this.cardArray
              .map(item => {
                return item.cardId == this.defaultCardId
              })
              .indexOf(true)
          } else {
            this.setCardAsDefault(this.cardArray[0].cardId)
          }
        } else if (!this.defaultCardId > 0 && this.cardArray.length > 0) {
          this.setCardAsDefault(this.cardArray[0].cardId)
        }
      })
    },
    requestBindCard() {
      return apiAxios({
        method: 'post',
        url: '/CreditCard/RequestBindCard',
      }).then(res => {
        // console.log(res.result)
        window.location.href = res.result
      })
    },
    setCardAsDefault(cardId) {
      return apiAxios({
        method: 'post',
        url: '/CreditCard/SetCardAsDefault',
        data: {
          cardId,
        },
      }).then(() => {
        this.$snackbar.add('修改成功', { color: 'success' })
        this.updateRadioGroup()
      })
    },
    removeCard(cardId) {
      return apiAxios({
        method: 'post',
        url: '/CreditCard/RemoveCard',
        data: {
          cardId,
        },
      }).then(() => {
        this.updateRadioGroup()
        // console.log(res.result)
      })
    },
    checkExpiry(expiryDate) {
      const month = parseInt(expiryDate.slice(0, 2), 10)
      const year = parseInt(expiryDate.slice(2), 10) + 2000
      const expiryThreshold = new Date(year, month, 1) // 下個月的第一天
      const currentDate = new Date()
      return currentDate >= expiryThreshold
    },
  },
}
</script>
