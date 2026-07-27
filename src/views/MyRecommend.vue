<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-breadcrumbs
            large
            :items="breadcrumbs"
            class="primary--text mt-2"
          ></v-breadcrumbs>
        </v-col>
        <v-col cols="3" class="d-none d-md-block"
          ><v-card>
            <v-card-text>
              <v-list flat>
                <v-list-item-group color="primary" v-model="model">
                  <template>
                    <v-list-item to="/my-wish">
                      <v-list-item-content>
                        <v-list-item-title> 我的願望 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title> 我的推薦 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-card-text> </v-card
        ></v-col>
        <v-col cols="12" md="9"
          ><v-card elevation="0">
            <v-card class="pa-4 mb-4">
              <v-row
                ><v-row class="mt-0">
                  <v-col cols="12" md="6">
                    <h6
                      class="rounded-0 text-h6 pec-title-bl font-weight-bold ml-4 mt-2"
                      style="
                        line-height: 1.5rem;
                        border-color: rgba(202, 31, 29, 1);
                      "
                    >
                      我的推薦
                    </h6>
                  </v-col>
                </v-row>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    outlined
                    v-model="search"
                    prepend-inner-icon="search"
                    label="搜尋"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="categoryArray"
                    item-text="category_name"
                    item-value="category_id"
                    v-model="category"
                    label="選擇商品分類"
                    outlined
                    hide-details
                    return-object
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="statusArray"
                    item-text="profile_comments"
                    item-value="profile_comments"
                    v-model="status"
                    label="還願狀態"
                    outlined
                    hide-details
                    return-object
                  ></v-select>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              class="mt-4 pa-3"
              v-for="recommend in filteredRecommendArray"
              :key="recommend.id"
            >
              <div class="d-flex">
                <div class="flex-grow-0">
                  <v-img
                    width="144px"
                    :src="recommend.img_url_array[0].img_url"
                  ></v-img>
                </div>
                <div class="d-flex flex-column justify-space-between ml-3">
                  <div>
                    <h6 class="text-h6 primary--text">
                      {{ recommend.product_name }}
                    </h6>
                    <div class="grey--text">
                      發布日期：{{
                        $dayjs(recommend.creation_date).format(
                          'YYYY-MM-DD HH:mm'
                        )
                      }}
                      <!-- 發布人：{{ recommend.emp_name }} -->
                    </div>
                    <div class="mt-2" style="overflow-wrap: anywhere">
                      {{ recommend.product_desc }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex mt-2 align-center">
                <v-chip
                  v-if="recommend.product_id"
                  class="pr-4"
                  color="primary"
                  :to="`/product/${recommend.product_id}`"
                >
                  前往購買
                  <background-svg
                    class="mt-1 ml-2"
                    backgroungUrl="/touch_app.svg"
                    width="20px"
                    height="20px"
                    color="#fff"
                  ></background-svg>
                </v-chip>
                <v-chip
                  v-else
                  :outlined="recommend.recommend_status != '2'"
                  color="primary"
                >
                  {{ recommend.recommend_status_name }}
                </v-chip>
                <v-spacer></v-spacer>
                <v-chip
                  :outlined="recommend.push_delete_mark != 'N'"
                  color="rgba(235, 111, 20, 1)"
                  class="ml-2 mr-3"
                  :class="{ 'white--text': recommend.push_delete_mark == 'N' }"
                  @click="togglePush(recommend)"
                >
                  <i class="fa-regular fa-thumbs-up mr-1"></i>
                  {{
                    !recommend.push_delete_mark != 'N' ? '我也推薦' : '已推薦'
                  }}
                </v-chip>
                <span
                  class="text-body-1"
                  style="height: 23px; color: rgba(235, 111, 20, 1)"
                >
                  {{ recommend.push_count }}人推薦
                </span>
              </div>
              <template v-if="recommend.recommend_status == '3'">
                <v-divider class="my-2"></v-divider>
                <v-alert dense type="warning" border="left" text class="mb-0">
                  團購網回應: {{ recommend.supplement }}
                </v-alert>
              </template>
            </v-card>
          </v-card></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { apiAxios } from '@/api'

export default {
  props: ['order-id'],
  created() {
    this.fetchRecommend()
    this.fetchCategoryArray()
  },
  data() {
    return {
      recommendArray: [],
      model: 1,
      breadcrumbs: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '許願開團',
          to: '/wish',
        },
        {
          text: '我的願望',
          disabled: false,
        },
      ],
      isLoading: false,
      overlay: false,
      search: '',
      category: { category_id: '0', category_name: '全部' },
      categoryArray: [{ category_id: '0', category_name: '全部' }],
      status: { profile_comments: '全部' },
      statusArray: [{ profile_comments: '全部' }],
    }
  },
  computed: {
    ...mapGetters(['userId']),
    filteredRecommendArray() {
      let filteredArray = this.recommendArray
        .filter(checkout =>
          [checkout].some(
            x =>
              !this.search ||
              x.product_name
                .toUpperCase()
                .includes(this.search.toUpperCase()) ||
              x.id == this.search
          )
        )
        .filter(checkout =>
          [checkout].some(
            x =>
              this.status.profile_comments == '' ||
              this.status.profile_comments == '全部' ||
              this.status.profile_comments == x.recommend_status_name
          )
        )
        .filter(checkout =>
          [checkout].some(
            x =>
              this.category.category_id == '' ||
              this.category.category_id == 0 ||
              this.category.category_id == x.category
          )
        )
      return filteredArray
    },
  },
  methods: {
    fetchRecommend() {
      this.isLoading = true
      return Promise.all([
        apiAxios({
          method: 'post',
          data: {
            type: 'recommend',
          },
          url: '/Recommend/GetRecommendArray',
        }).then(res => {
          this.recommendArray = res.result
        }),
        apiAxios({
          method: 'post',
          url: '/Profile/GetRecommendStatus',
        }).then(res => {
          this.statusArray = res.result
          this.statusArray.unshift({
            profile_name: null,
            profile_value: '0',
            profile_comments: '全部',
            router_to: null,
            seq_no: 0,
          })
        }),
        // apiAxios({
        //   method: 'post',
        //   url: '/Category/GetAllCategory',
        // }).then(res => {
        //   console.log(res)
        //   this.categoryArray = res.result
        // }),
      ]).finally(() => (this.isLoading = false))
    },
    fetchCategoryArray() {
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductArrayAllCategory',
        params: { v: '2' },
        data: {},
      }).then(res => {
        this.categoryArray.push(
          ...res.result.map(x => ({
            ...x,
            highlight: false,
          }))
        )
      })
    },
    togglePush(recommend) {
      return apiAxios({
        method: 'post',
        url:
          recommend.push_delete_mark == 'N'
            ? '/Recommend/CancelPushRecommend'
            : '/Recommend/PushRecommend',
        data: { recommend_id: [recommend.id] },
      }).then(() => {
        this.fetchRecommend()
      })
    },
  },
}
</script>
<style scoped>
.active-black {
  color: rgba(0, 0, 0, 0.87);
}
.pec-footer {
  color: #757575;
  padding-left: 120px;
}
table.my-order {
  width: 100%;
  border-collapse: collapse;
}
table.my-order th,
table.my-order td {
  padding: 12px;
  border: 1px solid #dddddd;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.v-expansion-panels >>> .v-expansion-panel-content__wrap {
  padding: 0;
}
.status-chips {
  flex: 0 0 auto;
}
.amountGpMaster-title {
  padding-left: 12px;
}

.step-date {
  font-size: 14px !important;
}
.wrap-step {
  text-align: center;
  width: 120px;
  min-width: 120px;
}
.stepBar {
  width: 100%;
  height: 40px;
  margin-bottom: 41px;
}
.stepBar .step-star {
  background: #fff;
  border: 1px solid #ca1f1d;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
}
.stepBar .step-star::after,
.stepBar .step::after {
  position: absolute;
  content: '';
  display: block;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: #ca1f1d;
  top: 2px;
  left: 2px;
}
.stepBar .step-star.complate::before {
  position: absolute;
  display: block;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: #ca1f1d;
  top: -1px;
  left: -1px;
  font-family: FontAwesome;
  display: inline-block;
  content: '\f00c';
  color: #fff;
  font-size: 15px;
  text-align: center;
  line-height: 18px;
  z-index: 100;
}
.stepBar .step {
  background: #fff;
  width: 24px;
  height: 24px;
  border: 1px solid #ca1f1d;
  border-radius: 50%;
  margin-left: 47px;
  position: relative;
}
.stepBar .step::before {
  position: absolute;
  content: '';
  display: block;
  width: 97px;
  border-top: 3px solid #ca1f1d;
  top: 10px;
  left: -97px;
  z-index: 0;
}
.stepBar .step.active::before {
  border-top: 2px solid #ca1f1d;
}
.stepBar .step.complate::before {
  border-top: 2px solid #ca1f1d;
}
.stepBar .step.active {
  border: 2px solid #ca1f1d;
}
.stepBar .step.active::after {
  position: absolute;
  content: '';
  display: block;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: #ca1f1d;
  top: 2px;
  left: 2px;
}
.stepBar .step.complate {
  border: 2px solid #ca1f1d;
}
.stepBar .step.complate::after {
  position: absolute;
  display: block;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: #ca1f1d;
  top: -1px;
  left: -1px;
  font-family: FontAwesome;
  display: inline-block;
  content: '\f00c';
  color: #fff;
  font-size: 15px;
  text-align: center;
  line-height: 18px;
  z-index: 100;
}
.pec-card-title {
  font-size: 16px;
}

@media (max-width: 1024px) {
  .amountGpMaster-title {
    border-left: 5px solid currentColor;
    padding-left: 8px;
  }
}
@media (max-width: 959px) {
  .stepBar .step-star::after,
  .stepBar .step::after {
    width: 8px;
    height: 8px;
  }
  .stepBar .step-star {
    width: 14px;
    height: 14px;
  }
  .stepBar .step {
    width: 14px;
    height: 14px;
    margin-left: 36px;
  }
  .step-date {
    font-size: 10px !important;
    color: #787878;
  }
  .wrap-step {
    text-align: center;
    width: 85px;
    min-width: 85px;
  }
  .stepBar .step::before {
    width: 71px;
    border-top: 2px solid #ca1f1d;
    top: 5px;
    left: -72px;
  }
  .stepBar .step-star::before {
    width: 14px;
    border-top: 2px solid #ca1f1d;
    top: 5px;
    right: -15px;
  }
  .pec-footer {
    padding-left: 116px;
  }
}
@media (max-width: 520px) {
  .pec-card-title {
    font-size: 14px;
  }
  .pec-footer {
    padding-left: 12px;
  }
}
</style>
