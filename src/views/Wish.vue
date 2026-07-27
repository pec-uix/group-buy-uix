<template>
  <pec-member-template
    img-src="/wish.jpg"
    :breadcrumbs="[
      {
        text: '首頁',
        disabled: false,
        to: '/',
      },
      {
        text: '許願開團',
        disabled: false,
      },
    ]"
  >
    <v-card class="pa-0 pa-md-2">
      <!-- <v-img
        src="https://unilife.pec.com.tw/images/wish-rules.jpg"
      ></v-img> -->
      <v-img
        src="https://unilife.pec.com.tw/images/wish-maintenance.jpg"
      ></v-img>
      <!-- <div class="d-flex">
        <h6
          class="rounded-0 text-h6 pec-title-bl font-weight-bold mb-7"
          style="border-color: rgba(202, 31, 29, 1)"
        >
          我要許願商品
        </h6>
      </div>
      <div class="d-flex flex-wrap mb-7">
        <v-badge
          class="mr-4"
          v-for="(file, i) in files"
          :key="file.id"
          color="primary"
          dark
          icon="close"
          overlap
          @click.native="remove(i)"
        >
          <img class="image-thumb" :src="file.blob" />
        </v-badge>
        <file-upload
          ref="upload"
          v-model="files"
          :size="200 * 1000"
          accept="image/*"
          @input-filter="inputFilter"
        >
        </file-upload>
        <label
          v-if="files.length < 1"
          for="file"
          class="primary--text add-image d-flex flex-column align-center justify-center"
        >
          <background-svg
            backgroungUrl="/add.svg"
            width="20px"
            height="20px"
            color="#ca1f1d"
          ></background-svg>
          圖片
        </label>
      </div>
      <v-form v-model="valid" ref="form">
        <v-text-field
          counter
          maxlength="80"
          outlined
          placeholder="請輸入推薦商品名稱"
          :rules="[v => !!v || '請輸入推薦商品名稱']"
          v-model="productName"
        >
          <template #label>
            商品名稱 <span class="primary--text">(必填)</span> ：
          </template>
        </v-text-field>
        <v-select
          :items="categoryArray"
          v-model="productCategory"
          item-text="category_name"
          item-value="category_id"
          label="商品分類"
          outlined
        ></v-select>
        <v-text-field
          counter
          maxlength="80"
          outlined
          placeholder="輸入商品網址"
          v-model="productUrl"
        >
          <template #label> 輸入商品網址 </template>
        </v-text-field>
        <v-textarea
          outlined
          counter
          maxlength="200"
          placeholder="請輸入推薦內容"
          :rules="[v => !!v || '請輸入推薦內容']"
          v-model="productDesc"
        >
          <template #label>
            推薦內容 <span class="primary--text">(必填)</span> ：
          </template>
        </v-textarea>
        <v-textarea
          label="商家聯絡資訊"
          outlined
          counter
          maxlength="200"
          rows="3"
          placeholder="請輸入商家電話、地址、網址"
          v-model="contactMethod"
        ></v-textarea>
      </v-form>
      <div class="d-flex mt-2">
        <v-spacer></v-spacer>
        <v-btn
          depressed
          block
          color="primary"
          @click="insert"
          :loading="isLoading"
          >確認許願</v-btn
        >
      </div> -->
    </v-card>
    
    <!-- <v-sheet
      class="mt-8 d-flex mb-7"
      style="height: 114px; background-color: rgba(231, 231, 231, 1)"
    >
      <div class="mr-4" style="position: relative">
        <svg
          width="48"
          height="114"
          viewBox="0 0 48 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26.7826 0H0V114H28.8696L48 57.57L26.7826 0Z"
            fill="#CA1F1D"
          />
        </svg>
        <div
          style="
            position: absolute;
            top: 4px;
            color: rgb(255, 255, 255);
            -webkit-writing-mode: vertical-lr;
            writing-mode: vertical-lr;
            letter-spacing: 15px;
            padding-top: 12px;
            margin-left: 2px;
          "
        >
          已開團
        </div>
      </div>
      <div style="padding-top: 10px; flex: 1; overflow: hidden">
        <div v-if="calculateTotalCharacters(recommendHotArray.up) > 35">
          <pec-wish-tag-group
            :recommendHotArray="recommendHotArray.up"
          ></pec-wish-tag-group>
        </div>
        <div v-else>
          <v-chip
            class="ma-2 text-subtitle-1 font-weight-bold cursor-pointer"
            color="white"
            text-color="primary"
            v-for="(item, index) in recommendHotArray.up"
            :key="index"
            @click="clickTagTo(item.product_id)"
          >
            {{ item.product_name }}
          </v-chip>
        </div>
        <div v-if="calculateTotalCharacters(recommendHotArray.down) > 35">
          <pec-wish-tag-group
            :recommendHotArray="recommendHotArray.down"
          ></pec-wish-tag-group>
        </div>
        <div v-else>
          <v-chip
            class="ma-2 text-subtitle-1 font-weight-bold cursor-pointer"
            color="white"
            text-color="primary"
            v-for="(item, index) in recommendHotArray.down"
            :key="index"
            @click="clickTagTo(item.product_id)"
          >
            {{ item.product_name }}
          </v-chip>
        </div>
      </div>
    </v-sheet> -->

    <!-- <div class="mb-6" v-if="myWishArray.length > 0">
      <div class="d-flex justify-space-between align-center mb-4">
        <h6
          class="rounded-0 text-h6 pec-title-bl font-weight-bold"
          style="line-height: 1.5rem; border-color: rgba(202, 31, 29, 1)"
        >
          我的願望
        </h6>
        <v-btn class="more-btn" color="primary" depressed small to="/my-wish"
          >查看更多</v-btn
        >
      </div>
      <pec-wish-card-group
        :recommendArray="myWishArray"
        :userId="userId"
        @togglePush="togglePush"
      ></pec-wish-card-group>
    </div> -->

    <!-- <div class="mb-7" v-if="myRecommendArray.length > 0">
      <div class="d-flex justify-space-between align-center mb-4">
        <h6
          class="rounded-0 text-h6 pec-title-bl font-weight-bold"
          style="line-height: 1.5rem; border-color: rgba(202, 31, 29, 1)"
        >
          我的推薦
        </h6>
        <v-btn
          class="more-btn"
          color="primary"
          depressed
          small
          to="/my-recommend"
          >查看更多</v-btn
        >
      </div>
      <pec-wish-card-group
        :recommendArray="myRecommendArray"
        :userId="userId"
        @togglePush="togglePush"
      ></pec-wish-card-group>
    </div> -->

    <!-- <div
      class="text-h5 text-center primary--text font-weight-bold pb-1 mb-4"
      style="border-bottom: 4px solid rgba(202, 31, 29, 1)"
    >
      許願池
    </div> -->

    <!-- <v-card class="pa-4 mb-4">
      <v-row>
        <v-col cols="12" sm="6" :class="{ 'col-sm-12': !(days == 0) }">
          <v-select
            class=""
            v-model="days"
            :items="daysArray"
            filled
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" :class="{ 'col-sm-6': days == 0 }" v-if="days == 0">
          <v-menu
            v-model="dialog_dates"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                v-on="on"
                v-bind="attrs"
                v-model="dateRangeText"
                label="日期區間"
                readonly
                class="share-dates"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker
              locale="zh"
              color="secondary"
              v-model="dates"
              range
              no-title
              @input="dialog_dates = dates.length < 2 ? true : false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12">
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
            :items="categoryFilterArray"
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
    </v-card> -->

    <!-- <template v-if="isLoading">
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
    </template> -->
    
    <!-- <v-card
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
            <h6 class="text-h6 primary--text">{{ recommend.product_name }}</h6>
            <div class="grey--text">
              許願日期：{{
                $dayjs(recommend.creation_date).format('YYYY-MM-DD HH:mm')
              }}
            </div>
            <div v-if="recommend.closed_date" class="grey--text">
              結案日期：{{
                recommend.closed_date
                  ? $dayjs(recommend.closed_date).format('YYYY-MM-DD HH:mm')
                  : ''
              }}
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
          {{ !recommend.push_delete_mark != 'N' ? '我也推薦' : '已推薦' }}
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
        <v-alert
          dense
          type="warning"
          border="left"
          text
          class="mb-0"
          style="word-break: break-all"
        >
          團購網回應 : {{ recommend.supplement }}
        </v-alert>
      </template>
    </v-card> -->
  </pec-member-template>
</template>
<script>
// import FileUpload from 'vue-upload-component'
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
// import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { apiAxios } from '@/api'
import { mapGetters } from 'vuex'
import * as imageConversion from 'image-conversion'

export default {
  components: {
    // FileUpload,
    PecMemberTemplate,
    // BackgroundSvg,
  },
  created() {
    // this.fetchCategoryArray()
    // this.fetchRecommend()
  },
  watch: {
    days: {
      handler: function () {
        this.getRecommendArray()
      },
    },
    dates() {
      if (this.dates.length == 2) {
        this.getRecommendArray()
      }
    },
  },
  data() {
    return {
      isLoading: false,
      valid: '',
      productName: '',
      productUrl: '',
      productDesc: '',
      productCategory: '',
      contactMethod: '',
      files: [],
      recommendArray: [],
      categoryArray: [],
      myWishArray: [],
      myRecommendArray: [],
      recommendHotArray: { up: [], down: [] },
      category: { category_id: '0', category_name: '全部' },
      categoryFilterArray: [{ category_id: '0', category_name: '全部' }],
      status: { profile_comments: '全部' },
      statusArray: [{ profile_comments: '全部' }],
      search: '',
      daysArray: [
        {
          text: '本月',
          value: -1,
        },
        {
          text: '最近1個月',
          value: 31,
        },
        {
          text: '最近3個月',
          value: 93,
        },
        {
          text: '最近半年',
          value: 185,
        },
        {
          text: '自訂區間',
          value: 0,
        },
      ],
      dates: ['2022-05-10'],
      dialog_dates: false,
      days: 93,
    }
  },
  computed: {
    ...mapGetters(['userId']),
    canUpload() {
      return !window.GroupJSInterface
    },
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
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
  },
  methods: {
    remove(i) {
      this.files.splice(i, 1)
    },
    fetchCategoryArray() {
      return apiAxios({
        method: 'post',
        url: '/Product/GetProductArrayAllCategory',
        params: { v: '2' },
        data: {},
      }).then(res => {
        this.categoryArray = res.result.map(x => ({
          ...x,
          highlight: false,
        }))
        this.categoryFilterArray = Array.from(this.categoryArray)
        this.categoryFilterArray.unshift({
          category_id: '0',
          category_name: '全部',
        })
      })
    },
    getRecommendArray() {
      this.isLoading = true
      const daysData = {}
      if (this.days == 0) {
        daysData['start_date'] = this.dates[0]
        daysData['end_date'] = this.dates[1]
      } else {
        daysData['days'] = this.days
      }
      apiAxios({
        method: 'post',
        data: {
          type: 'all',
          days: this.days,
          start_date: daysData['start_date'],
          end_date: daysData['end_date'],
          when: '',
        },
        url: '/Recommend/GetRecommendArray',
      }).then(res => {
        this.recommendArray = res.result
        this.isLoading = false
      })
    },
    fetchRecommend() {
      this.isLoading = true
      return Promise.all([
        apiAxios({
          method: 'post',
          data: {
            days: this.days,
            type: 'all',
          },
          url: '/Recommend/GetRecommendArray',
        }).then(res => {
          this.recommendArray = res.result
        }),
        apiAxios({
          method: 'post',
          data: {
            type: 'wish',
          },
          url: '/Recommend/GetRecommendArray',
        }).then(res => {
          this.myWishArray = res.result
        }),
        apiAxios({
          method: 'post',
          data: {
            type: 'recommend',
          },
          url: '/Recommend/GetRecommendArray',
        }).then(res => {
          this.myRecommendArray = res.result
        }),
        apiAxios({
          method: 'post',
          data: {
            type: 'recommend',
          },
          url: '/Recommend/GetRecommendHot',
        }).then(res => {
          this.recommendHotArray = res.result
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
      ]).finally(() => (this.isLoading = false))
    },
    insert() {
      if (this.$refs.form.validate()) {
        let formData = new FormData()
        formData.append('product_name', this.productName)
        formData.append('url', this.productUrl)
        formData.append('product_desc', this.productDesc)
        formData.append('contact_method', this.contactMethod)
        this.files.forEach(x => {
          formData.append('files', x.file)
        })
        formData.append('category', this.productCategory)
        this.isLoading = true

        return apiAxios({
          method: 'post',
          url: '/Recommend/InsertRecommend',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
          .then(() => {
            this.$refs.form.reset()
            this.files = []
            this.$dialog.show(
              '恭喜您許願成功！我們將會有專人與您聯繫，謝謝您！'
            )
          })
          .then(() => this.fetchRecommend())
      }
    },
    // deleteRecommend(id) {
    //   this.isLoading = true
    //   return apiAxios({
    //     method: 'post',
    //     url: '/Recommend/DeleteRecommend',
    //     data: { recommend_id: id },
    //   }).then(() => this.fetchRecommend())
    // },
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
    // inputFile: function (newFile, oldFile) {
    //   if (newFile && !oldFile) {
    //     // add
    //     console.log('add', newFile)
    //   }
    //   if (newFile && oldFile) {
    //     // update
    //     console.log('update', newFile)
    //   }
    //   if (!newFile && oldFile) {
    //     // remove
    //     console.log('remove', oldFile)
    //   }
    // },
    inputFilter: async function (newFile, oldFile, prevent) {
      if (newFile) {
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          this.$snackbar.add('請上傳正確圖片格式')
          return prevent()
        }
        // if (newFile.size > 4 * 1024 * 1024) {
        //   this.$snackbar.add('單筆檔案大小不得超過4MB')
        //   return prevent()
        // }

        newFile.blob = ''
        // 壓縮圖檔
        imageConversion
          .compressAccurately(newFile.file, {
            size: '80',
            width: 500,
          })
          .then(async res => {
            let URL = window.URL || window.webkitURL
            if (URL && URL.createObjectURL) {
              newFile.blob = URL.createObjectURL(res)
            }
          })
      }

      // newFile.blob = ''
      // let URL = window.URL || window.webkitURL
      // if (URL && URL.createObjectURL) {
      //   newFile.blob = URL.createObjectURL(newFile.file)
      // }
    },
    linkToLine() {
      window.location.href =
        'line://ti/g2/SOFynU22uKw-gjCsj2dPqvgbK26SahxnimZETQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default'
    },
    calculateTotalCharacters(products) {
      return products.reduce(
        (total, product) => total + product.product_name.length,
        0
      )
    },
    clickTagTo(url) {
      this.$router.push(`/product/${url}`)
    },
  },
}
</script>
<style>
.add-image {
  width: 64px;
  height: 64px;
  cursor: pointer;
  border: 1px dashed var(--v-primary-base);
}
.image-thumb {
  height: 64px;
}
.hide-scroll {
  width: 100%;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.hide-scroll::-webkit-scrollbar {
  display: none;
}
</style>
