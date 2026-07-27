<template>
  <pec-member-template img-src="/my-order.jpg">
    <v-card class="pa-8">
      <div class="d-flex">
        <h6 class="rounded-0 text-h6 pec-title-bl font-weight-bold">
          產品評論
        </h6>
        <v-btn
          :color="this.likeMark == 1 ? 'primary' : 'second'"
          :outlined="this.likeMark == 1"
          class="ml-3"
          depressed
          small
          @click.stop="change"
        >
          <background-svg
            backgroungUrl="/thumb_up_off_alt.svg"
            width="20px"
            height="20px"
            color="#000"
          ></background-svg>
          讚
        </v-btn>
      </div>

      <v-form v-model="valid" ref="form">
        <v-textarea
          class="mt-6 text-black"
          outlined
          placeholder="評論內容"
          counter
          maxlength="200"
          v-model="comment"
          :disabled="
            !(
              auditResults == 'N' ||
              (auditResults != 'Y' && !hasInitialComment)
            )
          "
        >
          {{ comment }}
        </v-textarea>
      </v-form>
      <div class="d-flex flex-wrap">
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
          <img class="image-thumb" :src="!file.blob ? file : file.blob" />
        </v-badge>
        <file-upload
          v-model="files"
          ref="upload"
          :size="200 * 1000"
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
      <div class="d-flex mt-2 justify-end">
        <div>
          <v-btn class="mr-3" depressed color="primary" to="/my-order">
            返回
          </v-btn>
          <v-btn
            depressed
            color="primary"
            :loading="isLoading"
            @click="insert"
            v-if="
              auditResults == 'N' || (auditResults != 'Y' && !hasInitialComment)
            "
          >
            確認送出
          </v-btn>
        </div>
      </div>
    </v-card>
  </pec-member-template>
</template>

<script>
import FileUpload from 'vue-upload-component'
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { apiAxios } from '@/api'
// import { mapGetters } from 'vuex'

export default {
  components: { PecMemberTemplate, FileUpload, BackgroundSvg },
  props: ['order-id'],
  computed: {
    // canUpload() {
    //   return !window.GroupJSInterface
    // },
    file() {
      return this.files
    },
  },
  created() {
    return this.getOrderComment()
  },
  data() {
    return {
      isLoading: false,
      comment: '',
      likeMark: 0,
      imgUrl: '',
      valid: false,
      files: [],
      auditResults: '',
      hasInitialComment: false,
    }
  },
  methods: {
    change() {
      this.likeMark = this.likeMark == 0 ? 1 : 0
    },
    remove(i) {
      this.files.splice(i, 1)
    },
    insert() {
      // if (this.$refs.form.validate()) {
      let formData = new FormData()
      formData.append('preorder_id', this.orderId)
      formData.append('reviews', this.comment)
      formData.append('like_mark', this.likeMark)
      this.files.forEach(x => {
        formData.append('files', x.file)
      })
      this.isLoading = true

      return apiAxios({
        method: 'post',
        url: '/Comment/InsertComment',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(() => {
        // console.log(res.result)
        if (this.comment) {
          this.$snackbar.add('完成評價', { colors: 'Success' })
        }
        this.$router.push('/my-order')
      })
      // }
    },
    getOrderComment() {
      return apiAxios({
        method: 'post',
        url: '/Comment/GetOrderComment',
        data: {
          preorder_id: this.orderId,
        },
      }).then(res => {
        const hasResult = res.result.length > 0
        const reviews = hasResult ? res.result[0].reviews : null

        // 判斷是否有評論
        this.hasInitialComment = hasResult && reviews !== 'null'

        // 根據條件設定 comment
        this.comment = this.hasInitialComment ? reviews : null

        // 設定其他屬性
        this.likeMark = hasResult ? res.result[0].like_mark : 0
        this.imgUrl = hasResult ? res.result[0].img_url : null
        this.auditResults = hasResult ? res.result[0].audit_results : null

        // 如果有圖片 URL，加入到 files
        if (this.imgUrl != null) {
          this.files.push(this.imgUrl)
        }
        this.isLoading = false
      })
    },
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile) {
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          this.$snackbar.add('請上傳正確圖片格式')
          return prevent()
        }
        if (newFile.size > 2 * 1024 * 1024) {
          this.$snackbar.add('單筆檔案大小不得超過2MB')
          return prevent()
        }
      }

      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    },
  },
}
</script>
<style scoped>
:deep(.theme--light.v-input--is-disabled textarea) {
  color: #000 !important;
}

.add-image {
  width: 64px;
  height: 64px;
  cursor: pointer;
  border: 1px dashed var(--v-primary-base);
}
.image-thumb {
  height: 64px;
}
</style>
