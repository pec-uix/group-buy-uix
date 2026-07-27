<template>
  <div>
    <v-snackbar
      v-for="(item, i) in itemArray"
      :key="item.id"
      top
      right
      :timeout="-1"
      :color="item.color"
      :value="i === 0"
    >
      {{ item.text }}
      <template v-slot:action="{ attrs }">
        <v-btn icon v-if="item.dismissible" v-bind="attrs" @click="close">
          <background-svg
            backgroungUrl="/close.svg"
            width="20px"
            height="20px"
            color="#fff"
          ></background-svg>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  components: {
    BackgroundSvg,
  },
  created() {
    this.$snackbar.add = this.add
  },
  data() {
    return {
      itemArray: [],
      timeoutId: '',
      index: 0,
    }
  },
  methods: {
    add(text, options = {}) {
      let snackbarOption = {
        id: nanoid(),
        text,
        color: 'primary',
        timeout: 6000,
        dismissible: true,
        active: false,
        ...options,
      }
      this.itemArray.push(snackbarOption)
      if (this.itemArray.length == 1) {
        this.show()
      }
    },
    show() {
      this.timeoutId = setTimeout(() => this.close(), this.itemArray[0].timeout)
    },
    close() {
      clearTimeout(this.timeoutId)
      this.itemArray.shift()
      if (this.itemArray.length) {
        this.show()
      }
    },
  },
}
</script>
<style scoped>
.v-snack >>> .v-snack__wrapper {
  min-width: 200px;
}
</style>
