<template>
  <div>
    <div
      class="splide pa-2"
      role="group"
      v-show="!$vuetify.breakpoint.mobile"
      ref="splide"
    >
      <div class="splide__track mx-12">
        <div class="splide__list" style="align-items: center">
          <div
            class="splide__slide"
            v-for="category in categoryArray"
            :key="category.category_value"
          >
            <router-link
              class="d-flex flex-column align-center text-decoration-none ga-home-big-sort"
              :to="{
                name: 'Category',
                params: {
                  categoryId: category.category_value,
                  categoryName: category.name,
                },
              }"
            >
              <div class="category-image-block mb-5 mt-2">
                <v-img width="45" :src="category.img_url_menu" eager></v-img>
              </div>
              <span
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 72px;
                  text-align: center;
                "
              >
                {{ category.name }}
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-show="$vuetify.breakpoint.mobile">
      <v-expansion-panels v-model="expansionPanels">
        <v-expansion-panel>
          <v-expansion-panel-header class="pl-2 py-2">
            <div v-show="expansionPanels === 0" class="black--text">
              選擇分類
            </div>
            <div v-show="expansionPanels !== 0" style="width: 96%">
              <div class="splide pa-2" role="group" ref="splideMobile">
                <div class="splide__track">
                  <div class="splide__list" style="align-items: center">
                    <div
                      class="splide__slide"
                      v-for="category in categoryArray"
                      :key="category.category_value"
                      @click.stop="e => e.stopPropagation()"
                    >
                      <router-link
                        class="d-flex flex-column align-center text-decoration-none ga-home-big-sort"
                        :to="{
                          name: 'Category',
                          params: {
                            categoryId: category.category_value,
                            categoryName: category.name,
                          },
                        }"
                      >
                        <!-- <span
                          class="primary--text category-item px-2 py-1"
                          style="line-height: 1.2rem"
                        >
                          {{ category.name }}
                        </span> -->
                        <v-chip
                          class="ma-0 d-flex justify-center pec-category-mobile-title"
                          variant="outlined"
                          outlined
                          color="primary"
                          @click="expansionPanels = null"
                        >
                          <span class="ellipsis">
                            {{ category.name }}
                          </span>
                        </v-chip>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template v-slot:actions>
              <v-icon color="primary"> fa-light fa-circle-chevron-down </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content eager>
            <v-row dense>
              <v-col
                v-for="category in categoryArray"
                :key="category.category_value"
                cols="4"
              >
                <router-link
                  class="text-decoration-none primary--text"
                  :to="{
                    name: 'Category',
                    params: {
                      categoryId: category.category_value,
                      categoryName: category.name,
                    },
                  }"
                >
                  <v-chip
                    class="ma-0 d-flex justify-center pec-category-mobile-title"
                    variant="outlined"
                    outlined
                    color="primary"
                    @click="expansionPanels = null"
                  >
                    <span class="ellipsis">
                      {{ category.name }}
                    </span>
                  </v-chip>
                </router-link>
                <!-- <div
                  @click="expansionPanels = null"
                  class="ma-1 category-item text-center px-2"
                  style="
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                >
                  <router-link
                    class="text-decoration-none primary--text"
                    :to="{
                      name: 'Category',
                      params: {
                        categoryId: category.category_value,
                        categoryName: category.name,
                      },
                    }"
                  >
                    {{ category.name }}
                  </router-link>
                </div> -->
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Splide from '@splidejs/splide'

export default {
  mounted() {
    this.splide = new Splide(this.$refs.splide, {
      pagination: false,
      gap: '48px',
      trimSpace: 'move',
      fixedWidth: '72px',
    })
    this.splide.mount()

    this.splideMobile = new Splide(this.$refs.splideMobile, {
      pagination: false,
      gap: '8px',
      trimSpace: 'move',
      autoWidth: true,
      arrows: false,
    })
    this.splideMobile.mount()
  },
  data() {
    return {
      splide: null,
      expansionPanels: null,
      splideMobile: null,
    }
  },
  computed: {
    ...mapState(['categoryArray']),
  },
  beforeDestroy() {
    this.splide.destroy()
  },
}
</script>
<style scoped>
.category-image-block {
  width: 64px;
  height: 64px;
  border: 1px solid #e1e1e1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
}
.panel-header-overflow {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  height: 36px;
  font-size: 16px;
}
.category-item {
  border: 2px solid var(--v-primary-base);
  border-radius: 20px;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:deep(.v-expansion-panel-content__wrap) {
  display: flex;
  flex-wrap: wrap;
}
@media (max-width: 360px) {
  .col-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>
