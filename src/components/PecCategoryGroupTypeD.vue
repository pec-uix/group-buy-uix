<template>
  <div style="width: 100%">
    <div class="d-none d-md-block">
      <v-sheet class="mx-auto" style="box-shadow: none !important">
        <v-slide-group
          v-model="model"
          active-class="active"
          mandatory
          show-arrows
        >
          <v-slide-item
            v-for="(item, i) in this.categoryImgArray"
            :key="i"
            :ripple="false"
            v-slot="{ active, toggle }"
          >
            <v-card
              class="mx-4 mb-5 pec-prand-card"
              elevation="0"
              :color="'#fff'"
              @click="
                toggle()
                pushItem(item)
              "
              :ripple="false"
            >
              <div class="card-recipe">
                <v-img
                  width="75"
                  height="75"
                  class="mb-1 mx-auto"
                  :src="item.img_url"
                  alt=""
                  contain
                ></v-img>
              </div>
              <div
                class="pec-category-title"
                :style="`background-color:${
                  active ? '#CA1F1D' : '#fff'
                };color:${active ? '#fff' : '#000'}`"
              >
                {{ item.title }}
              </div>
              <div></div>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </div>
    <div class="d-flex d-md-none">
      <v-container class="pa-0" fluid>
        <v-row v-if="isMobilePushItem" dense>
          <v-col
            cols="3"
            v-for="(item, index) in filteredCategoryArray"
            :key="index"
            class="mb-3"
            @click="
              pushItem(item)
              toggleModel(index)
            "
          >
            <div class="d-flex justify-center text-center mb-3">
              <v-img
                max-width="70"
                height="70"
                :src="item.img_url"
                alt=""
                contain
              />
            </div>
            <div class="pec-category-title" :class="{ active: model == index }">
              {{ item.title }}
            </div>
          </v-col>
        </v-row>
        <v-row v-else dense>
          <v-col cols="12" class="mb-3 py-0">
            <brand-slide :brand-array="categoryImgArray"></brand-slide>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          v-if="categoryImgArray.length > 8 && isMobilePushItem"
        >
          <v-col cols="12">
            <v-btn
              v-if="!IsExpanded"
              class="mt-2 font-weight-bold"
              block
              depressed
              @click="IsExpanded = true"
              :color="color"
            >
              展開
            </v-btn>
            <v-btn
              v-else
              block
              outlined
              :color="color"
              class="mt-2 font-weight-bold black--text"
              :style="`border-color: ${color}`"
              @click="IsExpanded = false"
            >
              收闔
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
import BrandSlide from '@/components/BrandSlide.vue'
export default {
  props: [
    'isLogin',
    'isVerified',
    'categoryImgArray',
    'color',
    'isMobilePushItem',
    'className',
    'sectionName',
  ],
  components: {
    BrandSlide,
  },
  computed: {
    filteredCategoryArray() {
      if (this.IsExpanded == false) {
        return this.categoryImgArray.slice(0, 8)
      } else {
        return this.categoryImgArray
      }
    },
  },
  data() {
    return {
      IsExpanded: false,
      colors: ['primary', 'secondary', 'yellow darken-2', 'red', 'orange'],
      model: 0,
    }
  },
  methods: {
    pushItem(item) {
      this.$gtm.trackEvent({
        event: 'select_content',
        content_type: this.sectionName,
        content_id: item.title,
      })
      console.log(this.sectionName, item.title)
      this.$emit('pushItem', item, this.model)
    },
    toggleModel(index) {
      this.model = index
    },
  },
}
</script>
<style scoped>
.pec-category-title {
  border-radius: 18px;
  padding: 2px 15px;
  width: fit-content;
  padding-top: 4px;
  font-size: 16px;
  margin: 0 auto;
  font-weight: bold;
  text-align: center;
}

.pec-category-title.active {
  background-color: rgb(202, 31, 29);
  color: rgb(255, 255, 255);
  padding: 0 5px;
  padding: 0px 5px;
  border-radius: 5px;
}

.pec-prand-card.v-card--link:focus::before {
  opacity: 0;
}

@media (max-width: 959px) {
  .pec-category-title {
    padding: 0px;
  }
}
</style>
