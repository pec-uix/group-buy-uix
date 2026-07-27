<template>
  <div style="width: 100%">
    <div class="d-flex d-md-none pa-3 pb-1" style="flex-wrap: wrap">
      <v-row dense>
        <v-col
          cols="4"
          v-for="(item, index) in filteredCategoryArray"
          :key="index"
        >
          <router-link :to="item.router_to" style="text-decoration: none">
            <v-chip
              class="ma-0 d-flex justify-center"
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
          <v-col cols="12"
            ><v-card flat tile>
              <v-window v-model="onboarding" reverse>
                <v-window-item v-for="n in length" :key="`card-${n}`">
                  <v-card color="grey" height="200">
                    <v-row class="fill-height" align="center" justify="center">
                      <h1 style="font-size: 5rem" class="white--text">
                        Slide {{ n }}
                      </h1>
                    </v-row>
                  </v-card>
                </v-window-item>
              </v-window>

              <v-card-actions class="justify-space-between">
                <v-btn text @click="prev">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-item-group
                  v-model="onboarding"
                  class="text-center"
                  mandatory
                >
                  <v-item
                    v-for="n in length"
                    :key="`btn-${n}`"
                    v-slot="{ active, toggle }"
                  >
                    <v-btn :input-value="active" icon @click="toggle">
                      <v-icon>mdi-record</v-icon>
                    </v-btn>
                  </v-item>
                </v-item-group>
                <v-btn text @click="next">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card></v-col
          >
          <v-col
            cols="2"
            v-for="(item, index) in filteredCategoryArray"
            :key="index"
            class="mb-3"
          >
            <router-link :to="item.router_to" style="text-decoration: none">
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
      </v-container>
    </div>
  </div>
</template>
<script>
export default {
  props: ['isLogin', 'isVerified', 'categoryImgArray'],
  components: {},
  computed: {
    filteredCategoryArray() {
      return this.categoryImgArray
    },
  },
  data() {
    return {
      IsExpanded: false,
      color: 'primary',
      length: 3,
      onboarding: 0,
    }
  },
  methods: {
    next () {
        this.onboarding = this.onboarding + 1 === this.length
          ? 0
          : this.onboarding + 1
      },
      prev () {
        this.onboarding = this.onboarding - 1 < 0
          ? this.length - 1
          : this.onboarding - 1
      },
  },
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
</style>
