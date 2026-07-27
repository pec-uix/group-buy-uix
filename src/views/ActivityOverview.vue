<template>
  <pec-member-template
    :breadcrumbs="[
      {
        text: '首頁',
        disabled: false,
        to: '/',
      },
      {
        text: '活動總覽',
        disabled: false,
      },
    ]"
  >
    <v-card>
      <v-bottom-navigation
        :value="page"
        :key="page + 'p'"
        color="primary"
        grow
        horizontal
      >
        <v-btn @click="fetchActivityData(0, 1)">
          <span>活動總覽</span>
          <v-icon>youtube_searched_for</v-icon>
        </v-btn>
        <v-btn @click="fetchActivityData(1, 3)">
          <span>得獎公告</span>
          <v-icon>emoji_events</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <v-container>
        <template>
          <div v-if="page === 0">
            <v-row dense>
              <v-col cols="12" v-for="item in activityArray" :key="item.id">
                <v-card outlined :key="item.id">
                  <v-img :src="item.img_url"></v-img>
                  <v-card-title class="font-weight-medium">
                    {{ item.title }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ item.start_date }} ~ {{ item.end_date }}
                  </v-card-subtitle>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-row>
                      <v-col>
                        <v-btn text block @click="item.is_show = !item.is_show">
                          活動詳情
                          <v-icon>{{
                            !item.is_show ? 'expand_more' : 'expand_less'
                          }}</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          color="primary"
                          block
                          depressed
                          :disabled="!item.activity_url"
                          :to="`${item.activity_url}`"
                        >
                          前往活動
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                  <v-expand-transition>
                    <div v-show="item.is_show">
                      <v-card-actions>
                        <div class="content" v-html="item.content_clob"></div>
                      </v-card-actions>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-row>
                          <v-col> </v-col>
                          <v-col>
                            <v-btn
                              color="primary"
                              depressed
                              block
                              @click="openDialog(item)"
                            >
                              活動辦法
                            </v-btn>
                          </v-col>
                          <v-col> </v-col>
                        </v-row>
                      </v-card-actions>
                      <div class="text-center">
                        <v-dialog v-model="showDialog" width="800px">
                          <v-card>
                            <v-card-title class="justify-center">
                              <span class="text-h4">活動辦法</span>
                            </v-card-title>
                            <v-card-actions>
                              <div class="content" v-html="activityClob"></div>
                            </v-card-actions>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                depressed
                                block
                                color="primary"
                                @click="showDialog = false"
                              >
                                離開
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </div>
          <div v-else-if="page === 1">
            <!-- <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">活動名稱</th>
                    <th class="text-center">獎項</th>
                    <th class="text-center">活動辦法</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in activityArray" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.calories }}</td>
                    <td>{{ item.calories }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table> -->
            <table
              class="table-content"
              style="
                width: 1120px;
                border-top: none;
                font-family: 'Times New Roman';
                background-color: #ffffff;
              "
              border="0"
              cellspacing="0"
              cellpadding="0"
            >
              <thead>
                <tr>
                  <th>活動名稱</th>
                  <th>獎項</th>
                  <th>活動辦法</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in activityArray" :key="item.id">
                  <td
                    style="
                      border: 1px solid #808080;
                      text-align: center;
                      padding: 20px 18px;
                      font-variant-numeric: normal;
                      font-variant-east-asian: normal;
                      font-stretch: normal;
                      font-size: 16px;
                      line-height: 16px;
                      font-family: 微軟正黑體;
                      color: #595959;
                      width: 186px;
                    "
                  >
                    {{ item.title }}
                  </td>
                  <td
                    style="
                      border: 1px solid #808080;
                      text-align: center;
                      padding: 20px 18px;
                      font-variant-numeric: normal;
                      font-variant-east-asian: normal;
                      font-stretch: normal;
                      font-size: 16px;
                      line-height: 16px;
                      font-family: 微軟正黑體;
                      color: #595959;
                      width: 186px;
                    "
                  >
                    <div v-html="item.activity_clob"></div>
                  </td>
                  <td
                    style="
                      border: 1px solid #808080;
                      text-align: center;
                      padding: 20px 18px;
                      font-variant-numeric: normal;
                      font-variant-east-asian: normal;
                      font-stretch: normal;
                      font-size: 16px;
                      line-height: 16px;
                      font-family: 微軟正黑體;
                      color: #595959;
                      width: 130px;
                    "
                  >
                    <div v-html="item.content_clob"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </v-container>
    </v-card>
  </pec-member-template>
</template>
<script>
import { apiAxios } from '@/api'
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
export default {
  components: { PecMemberTemplate },
  created() {
    this.fetchActivityData(0, 1)
  },
  data() {
    return {
      showDialog: false,
      page: 0,
      activityClob: '',
      activityArray: [],
    }
  },
  methods: {
    fetchActivityData(page, item) {
      this.activityArray = []
      window.scrollTo(0, 0)

      this.page = page

      return apiAxios({
        method: 'post',
        url: '/Activity/GetActivityList',
        params: { activityAttribute: item },
      }).then(res => {
        this.activityArray = res.result
      })
    },
    openDialog(item) {
      this.showDialog = true
      this.activityClob = item.activity_clob
    },
  },
}
</script>
<style scoped>
span {
  font-size: 18px;
}
.v-container >>> img {
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.content >>> img {
  width: 100%;
  margin: auto;
}
.v-dialog >>> img {
  width: 100%;
  margin: auto;
}
.v-bottom-navigation {
  border-radius: 30px;
}
.table-content {
  max-height: 100%;
  max-width: 100%;
  table-layout: fixed;
  overflow-wrap: break-word;
}
</style>
