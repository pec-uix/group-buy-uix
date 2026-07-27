<template>
  <div>
    <v-carousel
      v-model="index"
      hide-delimiters
      :show-arrows="false"
      height="auto"
    >
      <v-carousel-item v-for="x in items" :key="x.img_url">
        <v-img
          aspect-ratio="1"
          class="mx-auto"
          :src="x.img_url"
          height="auto"
          max-width="400"
          min-width="160"
          contain
          @click="dialog = true"
        ></v-img>
      </v-carousel-item>
    </v-carousel>
    <v-slide-group
      v-if="items.length > 1"
      v-model="index"
      mandatory
      show-arrows
      center-active
      class="mt-2"
    >
      <v-slide-item
        class="mx-1"
        v-for="(x, i) in items"
        :key="x.img_url"
        v-slot="{ toggle }"
      >
        <v-card
          tile
          :height="$vuetify.breakpoint.mobile ? 48 : 64"
          :width="$vuetify.breakpoint.mobile ? 48 : 64"
          @click="toggle"
        >
          <v-overlay :value="i !== index" absolute> </v-overlay>
          <v-img aspect-ratio="1" width="100%" :src="x.img_url" contain> </v-img>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <v-dialog max-width="720" v-model="dialog">
      <v-card class="pa-2">
        <v-btn
          absolute
          color="black"
          top
          right
          icon
          outlined
          dark
          style="z-index: 1"
          @click="dialog = false"
        >
          <background-svg
            backgroungUrl="/close.svg"
            width="22px"
            height="22px"
            color="#000"
          ></background-svg>
        </v-btn>
        <v-img
          aspect-ratio="1"
          class="mx-auto"
          width="100%"
          :src="items[index].img_url"
        ></v-img>
        <v-slide-group
          v-if="items.length > 1"
          v-model="index"
          mandatory
          show-arrows
          center-active
          class="mt-2"
        >
          <v-slide-item
            class="mx-1"
            v-for="(x, i) in items"
            :key="x.img_url"
            v-slot="{ toggle }"
          >
            <v-card tile height="120" width="120" @click="toggle">
              <v-overlay :value="i !== index" absolute> </v-overlay>
              <v-img aspect-ratio="1" width="100%" :src="x.img_url"> </v-img>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import BackgroundSvg from '@/components/BackgroundSvg.vue'
export default {
  components: {
    BackgroundSvg,
  },
  props: ['items'],
  data() {
    return { index: 0, dialog: false }
  },
}
</script>
