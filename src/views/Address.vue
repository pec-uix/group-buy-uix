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
                  常用地址
                </v-list-item-title>

                <v-list-item-subtitle> 請選擇預設地址 </v-list-item-subtitle>
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
                      收件人資訊
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
                        <span class="text-h5">收件人資訊</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="template.receivePerson"
                                label="收件人*"
                                :rules="receivePersonRules"
                                required
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                              <v-row dense>
                                <v-col cols="4">
                                  <v-select
                                    v-model="template.zipcode"
                                    :items="filterZipcodesTemplate"
                                    item-text="zipcode"
                                    item-value="zipcode"
                                    label="郵遞區號"
                                    disabled
                                    dense
                                  ></v-select>
                                </v-col>

                                <v-col cols="4">
                                  <v-select
                                    v-model="template.county"
                                    :items="counties"
                                    :rules="countyRules"
                                    item-text="name"
                                    item-value="id"
                                    label="請選擇縣市*"
                                    @change="template.zipcode = ''"
                                    dense
                                  ></v-select>
                                </v-col>

                                <v-col cols="4">
                                  <v-select
                                    v-model="template.zipcode"
                                    :items="filterZipcodesTemplate"
                                    :rules="zipcodeRules"
                                    item-text="city"
                                    item-value="city"
                                    dense
                                    label="請選擇鄉鎮市區*"
                                    return-object
                                  ></v-select>
                                </v-col>
                              </v-row>
                            </v-col>

                            <v-col cols="12">
                              <v-text-field
                                v-model="template.receiveAddress"
                                label="收件地址*"
                                :rules="addressRules"
                                required
                              ></v-text-field>
                            </v-col>

                            <v-col cols="3">
                              <v-text-field
                                v-model="template.areaCode"
                                :counter="2"
                                label="區碼"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="9">
                              <v-text-field
                                v-model="template.localTelephone"
                                label="市話"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                              <v-text-field
                                v-model="template.contactPhone"
                                label="連絡電話"
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
                  尚未新增常用地址
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
                  <v-list-item-title
                    class="mb-2"
                    :class="{
                      'grey--text': !item.receivePerson,
                      'text--darken-1': !item.receivePerson,
                    }"
                  >
                    {{ item.receivePerson ? item.receivePerson : '待填寫' }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    地址 :
                    {{ item.zipcode.zipcode == 0 ? '' : item.zipcode.zipcode }}
                    {{ item.county }}{{ item.zipcode.city
                    }}{{ item.receiveAddress }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    市話 : {{ item.areaCode }}-{{ item.localTelephone }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    電話 : {{ item.contactPhone }}
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
import counties from '@/data/counties.js'
import zipcodes from '@/data/zipcodes.js'
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
        this.receiveAddress = this.template.receiveAddress
        this.county = this.template.county
        this.zipcode = this.template.zipcode
        this.receivePerson = this.template.receivePerson
        this.areaCode = this.template.areaCode
        this.localTelephone = this.template.localTelephone
        this.contactPhone = this.template.contactPhone
      }
    },
  },
  created() {
    this.counties = counties
    this.zipcodes = zipcodes
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
          text: '常用地址',
          to: '/address',
        },
      ],
      openPersonalInformationDialog: false,
      openPersonalInformationListDialog: false,
      radioGroup: null,
      countyRules: [v => !!v || '縣市 是必填項目'],
      zipcodeRules: [v => !!v || '鄉鎮市區 是必填項目'],
      addressRules: [v => !!v || '宅配地址 是必填項目'],
      contactPhoneRules: [v => !!v || '收件人電話 是必填項目'],
      receivePersonRules: [v => !!v || '收件人 是必填項目'],
      personalInformation: null,
      personalInformationArray: [],
      isNew: false,
      newPreset: false,
      template: {
        id: '',
        receivePerson: '',
        areaCode: '',
        localTelephone: '',
        contactPhone: '',
        receiveAddress: '',
        zipcode: null,
        preset: false,
        county: '',
      },
      counties: null,
      zipcodes: null,
      county: '',
      zipcode: null,
    }
  },
  computed: {
    filterZipcodes() {
      if (this.county) {
        return this.zipcodes.filter(item => {
          return item.county === this.county
        })
      } else {
        return ['請先選擇城市']
      }
    },
    filterZipcodesTemplate() {
      if (this.template.county) {
        return this.zipcodes.filter(item => {
          return item.county === this.template.county
        })
      } else {
        return ['請先選擇城市']
      }
    },
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
        id: '',
        receivePerson: '',
        contactPhone: '',
        receiveAddress: '',
        county: '',
        zipcode: '',
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
            url: '/Address/InsertAddress',
            data: {
              zipcode: this.template.zipcode || {},
              id: 0,
              receivePerson: this.template.receivePerson,
              areaCode: this.template.areaCode,
              localTelephone: this.template.localTelephone,
              contactPhone: this.template.contactPhone,
              receiveAddress: this.template.receiveAddress,
              county: this.template.county,
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
            url: '/Address/InsertAddress',
            data: {
              zipcode: this.template.zipcode || {},
              id: this.template.id,
              receivePerson: this.template.receivePerson,
              areaCode: this.template.areaCode,
              localTelephone: this.template.localTelephone,
              contactPhone: this.template.contactPhone,
              receiveAddress: this.template.receiveAddress,
              county: this.template.county,
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
          url: '/Address/DeleteAddress',
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
        alert('請先更換預設地址')
      }
    },
    getPresetPersonalInformation() {
      apiAxios({
        method: 'post',
        url: '/Address/GetAddress',
        data: {},
      }).then(res => {
        this.personalInformationArray = res.result
        if (this.personalInformationArray.length > 0) {
          this.personalInformationArray.forEach(item => {
            item.preset = !!item.preset
          })
          this.updateRadioGroup()
        }
      })
    },
    changePreset(item) {
      apiAxios({
        method: 'post',
        url: '/Address/InsertAddress',
        data: {
          zipcode: item.zipcode || {},
          id: item.id,
          receivePerson: item.receivePerson,
          areaCode: item.areaCode,
          localTelephone: item.localTelephone,
          contactPhone: item.contactPhone,
          receiveAddress: item.receiveAddress,
          county: item.county,
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
      // this.receiveAddress = this.template.receiveAddress
      // this.county = this.template.county
      // this.zipcode = this.template.zipcode
      // this.receivePerson = this.template.receivePerson
      // this.areaCode = this.template.areaCode
      // this.localTelephone = this.template.localTelephone
      // this.contactPhone = this.template.contactPhone
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
