<template>
  <div class="d-flex pec-countdown">
    <span v-if="expired" class="primary--text">已截止</span>
    <template v-else>
      <flip v-for="(text, i) in durationArray" :key="i" :value="text"></flip>
    </template>
  </div>
</template>
<script>
import Flip from '@/components/Flip.vue'

export default {
  props: ['endDate'],
  components: {
    Flip,
  },
  created() {
    setInterval(() => {
      this.duration = this.$dayjs
        .duration(Math.max(this.$dayjs(this.endDate) - this.$dayjs(), 0))
        .format('HHmmss')

      this.expired = this.$dayjs(this.endDate) - this.$dayjs() < 0
    }, 1000)
  },
  data() {
    return {
      duration: '',
      expired: false,
    }
  },
  computed: {
    durationArray() {
      return [...this.duration]
    },
  },
}
</script>
<style>
.pec-countdown > .tick:nth-child(2n + 1):not(:first-child) {
  margin-left: 12px;
}
</style>