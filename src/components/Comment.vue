<template>
  <v-card class="pa-8" style="border-radius: 0 0 4px 4px">
    <div class="d-flex">
      <h6 class="rounded-0 text-h6 pec-title-bl font-weight-bold">產品評論</h6>
      <v-btn
        :color="this.likeMark == 1 ? 'primary' : 'second'"
        :outlined="this.likeMark == 1"
        class="ml-3"
        depressed
        small
      >
        <v-img src="/thumb_up_off_alt.svg" eager max-width="18"></v-img>
        讚
      </v-btn>
    </div>

    <v-form v-model="valid" ref="form">
      <v-textarea
        class="mt-6"
        outlined
        placeholder="請分享10字(含)以上"
        counter
        maxlength="200"
        v-model="comment"
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
        class="
          primary--text
          add-image
          d-flex
          flex-column
          align-center
          justify-center
        "
      >
        <background-svg
          backgroungUrl="/add.svg"
          width="18px"
          height="18px"
          color="#ca1f1d"
        ></background-svg>
        圖片
      </label>
    </div>
    <div class="d-flex mt-2 justify-end align-center flex-wrap">
      <div>
        <v-btn class="mr-3" depressed color="primary" @click="hideComment">
          取消
        </v-btn>
        <v-btn depressed color="primary" :loading="isLoading" @click="insert">
          確認送出
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import FileUpload from 'vue-upload-component'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { apiAxios } from '@/api'
// import { mapGetters } from 'vuex'

export default {
  components: { FileUpload, BackgroundSvg },
  props: ['orderId'],
  computed: {
    canUpload() {
      return !window.GroupJSInterface
    },
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
      likeMark: 1,
      valid: false,
      files: [],
    }
  },
  methods: {
    // change() {
    //   this.likeMark = this.likeMark == 0 ? 1 : 0
    // },
    remove(i) {
      this.files.splice(i, 1)
    },
    insert() {
      if (this.likeMark == 1) {
        if (!(this.comment == null) && this.comment.length >= 10) {
          let formData = new FormData()
          formData.append('preorder_id', this.orderId)
          formData.append('reviews', this.comment)
          formData.append('like_mark', this.likeMark)
          formData.append('audit_procedure', 'Y')
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
              this.$snackbar.add(
                '感謝您的評論，審核時間約1-2天，審核結果會發送通知',
                { color: 'success' }
              )
            }
            this.isLoading = false
            this.hideComment(true)
          })
        } else {
          this.$snackbar.add('請分享10字(含)以上', { color: 'success' })
        }
      } else {
        this.$snackbar.add('尚未點讚', { color: 'success' })
      }
    },
    getOrderComment() {
      return apiAxios({
        method: 'post',
        url: '/Comment/GetOrderComment',
        data: {
          preorder_id: this.orderId,
        },
      }).then(res => {
        this.comment =
          res.result.length == 0 || res.result[0].reviews == 'null'
            ? null
            : res.result[0].reviews
        this.likeMark = 1
        this.imgUrl = res.result.length == 0 ? null : res.result[0].img_url
        if (this.imgUrl != null) {
          this.files.push(this.imgUrl)
        }
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
    hideComment(isUpdate) {
      this.$emit('update', isUpdate)
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
</style>
