<template>
  <v-dialog v-model="dialog" persistent :max-width="600">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">{{ title }}</v-card-title>
      <v-card-text
        v-show="!!content"
        class="pa-4 text-body-1 primary--text"
        v-html="content"
        style="white-space: pre-line"
      ></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text v-if="cancelable" @click="cancel">返回</v-btn>
        <v-btn depressed color="primary" @click="confirm">{{
          confirmButtonText
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  created() {
    this.$dialog.show = this.show
  },
  data() {
    return {
      dialog: false,
      color: '',
      title: '',
      content: '',
      confirmButtonText: '',
      cancelable: false,
      resolve: '',
      reject: '',
    }
  },
  methods: {
    show(content, userOption) {
      let option = {
        color: 'grey lighten-5',
        title: '系統訊息',
        cancelable: false,
        confirmButtonText: '確認',
        ...userOption,
      }

      this.content = content
      this.color = option.color
      this.title = option.title
      this.cancelable = option.cancelable
      this.confirmButtonText = option.confirmButtonText
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    confirm() {
      this.resolve(true)
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    },
  },
}
</script>
