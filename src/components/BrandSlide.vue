<template>
  <div class="splide px-2 pb-3" role="group">
    <div class="splide__track">
      <div class="splide__list">
        <div
          class="splide__slide"
          v-for="(brand, index) in brandPairs"
          :key="index"
        >
          <router-link
            class="d-flex flex-column align-center text-decoration-none mb-2"
            :to="`/brand-group/${brand[0].id}`"
          >
            <v-img
              class="mb-1"
              max-width="70"
              height="70"
              :src="brand[0].img_url"
              alt=""
              contain
            />
            <div class="pec-brand-title">
              {{ brand[0].title }}
            </div>
          </router-link>
          <router-link
            class="d-flex flex-column align-center text-decoration-none"
            :to="`/brand-group/${brand[1].id}`"
            v-if="brand.length % 2 == 0"
          >
            <v-img
              class="mb-1"
              max-width="70"
              height="70"
              :src="brand[1].img_url"
              alt=""
              contain
            />
            <div class="pec-brand-title">
              {{ brand[1].title }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Splide from '@splidejs/splide'

export default {
  props: ['brandArray'],
  watch: {
    brandArray() {
      this.remount()
    },
  },
  methods: {
    remount() {
      this.$nextTick(() => {
        this.splide.destroy()
        this.splide.mount()
      })
    },
  },
  mounted() {
    this.splide = new Splide(this.$el, {
      pagination: false,
      gap: '18px',
      trimSpace: 'move',
      fixedWidth: '72px',
      // autoWidth: true,
    })
    this.splide.mount()
  },
  data() {
    return {
      splide: null,
    }
  },
  beforeDestroy() {
    this.splide.destroy()
  },
  computed: {
    brandPairs() {
      const pairs = []
      for (let i = 0; i < this.brandArray.length; i += 2) {
        if (i + 1 < this.brandArray.length) {
          pairs.push([this.brandArray[i], this.brandArray[i + 1]])
        } else {
          pairs.push([this.brandArray[i]])
        }
      }
      return pairs
    },
  },
}
</script>
<style scoped>
.pec-brand-title {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}
</style>
