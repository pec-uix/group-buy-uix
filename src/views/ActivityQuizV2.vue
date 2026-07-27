<template>
  <div style="max-width: 800px; margin: 0 auto">
    <router-link to="/rebate">
      <v-img
        class="mx-auto mb-4"
        src="https://unilife.pec.com.tw/images/activity-quiz.jpg"
      ></v-img>
    </router-link>

    <template v-if="isLoading">
      <v-skeleton-loader class="mx-auto" type="paragraph"></v-skeleton-loader>
    </template>
    <v-alert v-else-if="!id" text type="warning"> 現在非活動期間 </v-alert>
    <template v-else>
      <v-alert v-if="award_id > 0" text type="success">
        答對，獲得{{ award_name }}
      </v-alert>
      <v-alert v-else-if="award_id === 0" text type="error"> 沒有答對 </v-alert>
      <v-btn
        v-else-if="!question_id"
        class="white--text activity-quiz-btn mb-4"
        depressed
        height="64px"
        style="font-size: 36px"
        block
        @click="go"
      >
        開始測驗
      </v-btn>
      <template v-else>
        <v-img @load="isQuestionLoading = false" :src="src">
          <template v-slot:placeholder>
            <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
          </template>
        </v-img>
        <div v-if="!isQuestionLoading" class="py-2">
          <v-container>
            <v-row>
              <v-col cols="12" v-for="option in option_array" :key="option.id">
                <v-btn
                  block
                  class="white--text activity-quiz-btn"
                  @click="submit(option.id)"
                >
                  {{ option.option_desc }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <!-- <v-radio-group row v-model="answer">
            <v-radio
              v-for="option in option_array"
              :key="option.id"
              :label="option.option_desc"
              :value="option.id"
            ></v-radio>
          </v-radio-group>
          <v-btn depressed block :disabled="!answer" @click="submit">
            提交答案
          </v-btn> -->
        </div>
      </template>
    </template>
    <v-dialog
      v-model="dialog"
      :overlay-opacity="0.8"
      max-width="min(800px, 80vh)"
      persistent
    >
      <v-img
        class="white--text text-h4"
        style="cursor: pointer"
        max-width="min(800px, 80vh)"
        :aspect-ratio="1 / 1"
        :src="pop_up_img_url"
        @click="to"
      >
      </v-img>
    </v-dialog>
  </div>
</template>
<script>
import { apiAxios } from '@/api'
// import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  // components: {
  //   BackgroundSvg,
  // },
  created() {
    this.isLoading = true
    return apiAxios({
      method: 'post',
      url: '/Activity/GetActivity',
      data: {
        activity_kind: '1',
      },
    })
      .then(res => {
        if (res.result) {
          this.id = res.result.id
          this.start_date = new Date(res.result.start_date)
          this.end_date = new Date(res.result.end_date)
          this.pop_up_img_url = res.result.pop_up_img_url
          this.promote_router_to = res.result.promote_router_to

          return apiAxios({
            method: 'post',
            url: '/Activity/GetActivityLog',
            data: { activity_id: this.id },
          }).then(res => {
            this.award_id = res.result?.award_id
            this.award_name = res.result?.award_name
          })
        }
      })
      .finally(() => (this.isLoading = false))
  },
  data() {
    return {
      id: '',
      start_date: '',
      end_date: '',
      award_id: undefined,
      award_name: undefined,
      isLoading: false,
      isQuestionLoading: false,
      dialog: false,
      question_desc: '',
      src: '',
      pop_up_img_url: '',
      promote_router_to: '',
      question_id: '',
      option_array: [],
      answer: '',
    }
  },
  computed: {},
  methods: {
    submit(answer_option_id) {
      return apiAxios({
        method: 'post',
        url: '/Activity/CreateActivityLogV2',
        data: {
          activity_id: this.id,
          question_id: this.question_id,
          answer_option_id,
        },
      })
        .then(() => {
          return apiAxios({
            method: 'post',
            url: '/Activity/GetActivityLog',
            data: { activity_id: this.id },
          })
        })
        .then(res => {
          this.award_id = res.result.award_id
          this.award_name = res.result.award_name
          this.$dialog
            .show(
              this.award_id > 0 ? `答對，獲得${this.award_name}` : `沒有答對`,
              {
                title: '訊息',
              }
            )
            .then(() => {
              this.dialog = true
              this.award = res.result
            })
        })
    },
    to() {
      if (this.promote_router_to.startsWith('/')) {
        this.$router.push(this.promote_router_to)
      } else {
        if (window.GroupJSInterface) {
          window.location.href = `${this.popUpRouterTo}&external_browser=2`
        } else {
          window.open(this.popUpRouterTo)
        }
      }
    },
    go() {
      if (new Date(this.start_date) > new Date()) {
        this.$dialog.show(
          `活動尚未開始，裝置系統時間為 ${new Date().toLocaleString()}`,
          {
            title: '訊息',
          }
        )
      } else if (new Date(this.end_date) < new Date()) {
        this.$dialog.show(`活動已經結束`, {
          title: '訊息',
        })
      } else if (this.award) {
        this.$dialog
          .show(`已參加過活動，獲得OP點數${this.award}點`, {
            title: '訊息',
          })
          .then(() => {
            this.dialog = true
          })
      } else {
        this.isQuestionLoading = true
        return apiAxios({
          method: 'post',
          url: '/Activity/GetQuestion',
          data: {
            activity_id: this.id,
          },
        }).then(res => {
          this.question_id = res.result.id
          this.question_desc = res.result.question_desc
          this.option_array = res.result.option_array
          this.src = res.result.img_url
        })
        // .finally(() => (this.isLoading = false))
      }
    },
  },
}
</script>
<style scoped>
.activity-quiz-btn {
  background-image: linear-gradient(
    180deg,
    #f7e794 0%,
    #f7e794 14%,
    #d3a358 66%,
    #bd7840 100%
  );
}
</style>