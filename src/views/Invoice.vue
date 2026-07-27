<template>
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
                  常用三聯發票
                </v-list-item-title>

                <v-list-item-subtitle>
                  請選擇預設發票資訊
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content>
                <template>
                  <div class="my-2">
                    <v-btn
                      class="float-right"
                      color="error"
                      dark
                      large
                      @click="openPersonalInformation(true)"
                    >
                      <v-icon left>add</v-icon>
                      發票資訊
                    </v-btn>
                  </div>
                </template>

                <!-- 彈出視窗區塊 -->

                <v-dialog
                  v-model="openPersonalInformationDialog"
                  persistent
                  max-width="600px"
                >
                  <v-form lazy-validation id="dialogForm" ref="dialogForm">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">發票資訊</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="template.preNo"
                                label="買方統一編號*"
                                :rules="preNoRules"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="template.preName"
                                label="買受人公司名稱*"
                                :rules="preNameRules"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="template.invoAddress"
                                label="買受人公司地址"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-checkbox
                                v-if="!checkPreset"
                                v-model="template.preset"
                                label="設為預設項目"
                                required
                                :disabled="newPreset"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                          color="blue darken-1"
                          text
                          @click="openPersonalInformationDialog = false"
                        >
                          關閉
                        </v-btn>

                        <v-btn
                          color="blue darken-1"
                          text
                          @click="updatePersonalInformation"
                        >
                          儲存
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-radio-group v-model="radioGroup">
              <v-list-item
                v-if="personalInformationArray.length <= 0"
                class="text-left theme--light v-sheet--outlined mx-md-4 mb-4 rounded-lg grey lighten-1"
              >
                <h3 class="text-center white--text" style="width: 100%">
                  尚未新增發票資訊
                </h3>
              </v-list-item>

              <v-list-item
                v-for="(item, index) in personalInformationArray"
                :key="index"
                class="text-left theme--light v-sheet--outlined mx-md-4 mb-4 rounded-lg"
              >
                <v-card-actions class="pl-0">
                  <v-radio
                    name="radioGroup"
                    :value="index"
                    @click="changePreset(item)"
                  ></v-radio>
                </v-card-actions>

                <v-list-item-content>
                  <v-list-item-title class="mb-2 text--darken-1">
                    {{ item.preNo }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    買受人公司名稱 : {{ item.preName }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    買受人公司地址 : {{ item.invoAddress }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn icon @click="openPersonalInformation(false, item)">
                    <v-icon>edit</v-icon>
                  </v-btn>

                  <v-btn icon @click="delPersonalInformation(item)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-list-item>
            </v-radio-group>
          </v-list>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { apiAxios } from '@/api'
export default {
  watch: {
    receiveArea() {
      if (this.receiveType) {
        return this.getAndSetPaymentTypeArray()
      }
    },
    receiveType() {
      if (this.receiveType) {
        return this.getAndSetPaymentTypeArray()
      }
    },
    personalInformation() {
      if (
        typeof this.personalInformation === 'object' &&
        !(this.personalInformation === null)
      ) {
        this.template = this.personalInformationArray.find(item => {
          return this.personalInformation.id === item.id
        })
        this.id = this.template.id
        this.preNo = this.template.preNo
        this.preName = this.template.preName
        this.invoAddress = this.template.invoAddress
        this.preset = this.template.preset
      }
    },
  },
  created() {
    this.getPresetPersonalInformation()
  },
  data() {
    return {
      isLoading: false,
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '常用發票資訊',
          to: '/invoice',
        },
      ],
      openPersonalInformationDialog: false,
      openPersonalInformationListDialog: false,
      radioGroup: null,
      preNoRules: [v => !!v || '買方統一編號 是必填項目'],
      preNameRules: [v => !!v || '買受人公司名稱 是必填項目'],
      invoAddressRules: [v => !!v || '買受人公司地址 是必填項目'],
      personalInformation: null,
      personalInformationArray: [],
      isNew: false,
      newPreset: false,
      template: {
        id: 0,
        preNo: '',
        preName: '',
        invoAddress: '',
        preset: 'N',
      },
      id: 0,
      preNo: '',
      preName: '',
      invoAddress: '',
      preset: 'N',
    }
  },
  computed: {
    checkPreset() {
      if (this.template.id) {
        return this.personalInformationArray.find(item => {
          return this.template.id === item.id
        }).preset
      } else {
        return false
      }
    },
  },
  methods: {
    clearTemplate() {
      this.template = {
        preNo: '',
        preName: '',
        invoAddress: '',
        preset: false,
      }
      if (this.$refs['dialogForm'] !== undefined) {
        this.$refs.dialogForm.resetValidation()
      }
    },
    updatePersonalInformation() {
      if (this.$refs.dialogForm.validate()) {
        if (this.isNew === true) {
          /* 新增 */
          if (this.newPreset == false && this.template.preset) {
            this.personalInformationArray.forEach(item => {
              item.preset = false
            })
          }
          apiAxios({
            method: 'post',
            url: '/UserInvoInfo/InsertInvoInfo',
            data: {
              id: 0,
              preNo: this.template.preNo,
              preName: this.template.preName,
              invoAddress: this.template.invoAddress,
              preset: this.template.preset ? 'Y' : 'N',
            },
          }).then(res => {
            // console.log('insert-new', res)
            if (res.status == 2) {
              this.$snackbar.add(res.message, { color: 'primary' })
              this.getPresetPersonalInformation()
            } else {
              this.$snackbar.add(res.message, { color: 'success' })
              this.getPresetPersonalInformation()
            }
          })
        } else {
          /* 編輯 */
          apiAxios({
            method: 'post',
            url: '/UserInvoInfo/InsertInvoInfo',
            data: {
              id: this.template.id,
              preNo: this.template.preNo,
              preName: this.template.preName,
              invoAddress: this.template.invoAddress,
              preset: this.template.preset ? 'Y' : 'N',
            },
          }).then(res => {
            // console.log('insert-updata', res)
            if (res.status == 2) {
              this.$snackbar.add(res.message, { color: 'primary' })
              this.getPresetPersonalInformation()
            } else {
              this.$snackbar.add(res.message, { color: 'success' })
              this.getPresetPersonalInformation()
            }
          })
        }
        this.openPersonalInformationDialog = false
      }
    },
    openPersonalInformation(isNew, personalItem) {
      this.openPersonalInformationDialog = true
      if (isNew === true) {
        this.isNew = true
        this.clearTemplate()
        if (this.personalInformationArray.length <= 0) {
          this.newPreset = true
          this.template.preset = true
        } else {
          this.newPreset = false
        }
      } else {
        this.isNew = false
        this.template = Object.assign({}, personalItem)
      }
    },
    delPersonalInformation(personalItem) {
      if (
        !(
          personalItem.preset == true &&
          this.personalInformationArray.length >= 2
        )
      ) {
        this.clearTemplate()
        apiAxios({
          method: 'post',
          url: '/UserInvoInfo/DeleteInvoInfo',
          data: {
            id: personalItem.id,
          },
        }).then(res => {
          // console.log('del', res)
          if (res.status == 2) {
            this.$snackbar.add(res.message, { color: 'primary' })
            this.getPresetPersonalInformation()
          } else {
            this.$snackbar.add(res.message, { color: 'success' })
            this.getPresetPersonalInformation()
          }
        })
      } else {
        alert('請先更換預設項目')
      }
    },
    getPresetPersonalInformation() {
      apiAxios({
        method: 'post',
        url: '/UserInvoInfo/GetInvoInfo',
        data: {},
      }).then(res => {
        this.personalInformationArray = res.result
        if (this.personalInformationArray.length > 0) {
          this.personalInformationArray.forEach(item => {
            item.preset = item.preset == 'Y' ? true : false
          })
          this.updateRadioGroup()
        }
      })
    },
    changePreset(item) {
      apiAxios({
        method: 'post',
        url: '/UserInvoInfo/InsertInvoInfo',
        data: {
          id: item.id,
          preNo: item.preNo,
          preName: item.preName,
          invoAddress: item.invoAddress,
          preset: 'Y',
        },
      }).then(res => {
        // console.log('insert-changePreset', res)
        this.$snackbar.add(res.message, { color: 'success' })
        this.getPresetPersonalInformation()
      })
    },
    updateRadioGroup() {
      this.radioGroup = this.personalInformationArray
        .map(item => {
          return item.preset
        })
        .indexOf(true)
      this.template = this.personalInformationArray.find(item => {
        return item.preset == true
      })
      // this.personalInformation = Object.assign({}, this.template)
      // this.preNo = this.template.preNo
      // this.preName = this.template.preName
      // this.invoAddress = this.template.invoAddress
      // this.preset = this.template.preset
    },
  },
}
</script>

<style scoped>
@media (min-width: 1025px) {
  .v-application .px-md-0 {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
}
</style>
