<template>
  <div style="width: 100%">
    <div class="d-flex d-md-none pa-3 pb-1" style="flex-wrap: wrap">
      <v-row dense>
        <v-col
          cols="4"
          v-for="(item, index) in filteredCategoryArray"
          :key="index"
        >
          <router-link :to="item.router_to" style="text-decoration: none" :class="className">
            <v-chip
              class="ma-0 d-flex justify-center pec-category-mobile-title"
              variant="outlined"
              outlined
              :color="item.backgroup_color"
            >
              {{ item.name }}
            </v-chip>
          </router-link>
        </v-col></v-row
      ><v-row no-gutters v-if="categoryImgArray.length > 6" style="width: 100%">
        <v-col cols="12">
          <v-btn
            v-if="!IsExpanded"
            class="mt-3"
            block
            depressed
            dark
            @click="IsExpanded = true"
            color="#FF7C1D"
          >
            展開
          </v-btn>
          <v-btn
            v-else
            block
            outlined
            color="#FF7C1D"
            class="mt-2"
            @click="IsExpanded = false"
          >
            收闔
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="d-none d-md-flex">
      <v-container class="pb-1" fluid>
        <v-row dense>
          <v-col
            cols="2"
            v-for="(item, index) in filteredCategoryArray"
            :key="index"
            class="mb-3"
          >
            <router-link :to="item.router_to" style="text-decoration: none" :class="className">
              <div class="text-center">
                <img width="75" :src="item.img_url" alt="" />
              </div>
              <div
                class="pec-category-title"
                :style="`background-color:${item.backgroup_color}`"
              >
                {{ item.name }}
              </div>
            </router-link>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="categoryImgArray.length > 6">
          <v-col cols="12">
            <v-btn
              v-if="!IsExpanded"
              class="mt-2"
              block
              depressed
              dark
              @click="IsExpanded = true"
              color="#FF7C1D"
            >
              展開
            </v-btn>
            <v-btn
              v-else
              block
              outlined
              color="#FF7C1D"
              class="mt-2"
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
export default {
  props: [
    'isLogin',
    'isVerified',
    'categoryImgArray',
    'className',
  ],
  components: {},
  computed: {
    filteredCategoryArray() {
      if (this.IsExpanded == false) {
        return this.categoryImgArray.slice(0, 6)
      } else {
        return this.categoryImgArray
      }
    },
  },
  data() {
    return {
      IsExpanded: false,
      color: 'primary',
    }
  },
  methods: {},
}
</script>
<style scoped>
.pec-category-title {
  color: #fff;
  border-radius: 18px;
  width: fit-content;
  padding: 2px 15px;
  padding-top: 4px;
  font-size: 18px;
  margin: 0 auto;
  font-weight: bold;
}

.pec-category-mobile-title::v-deep .v-chip__content {
  display: inline-block !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: auto;
}

.pec-category-mobile-title::v-deep .v-chip__close {
  position: absolute;
  top: 5px;
  right: 0;
  width: 24px;
}
</style>
