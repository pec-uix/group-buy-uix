<template>
  <v-container fluid class="pa-0">
    <v-breadcrumbs large :items="breadcrumbArray" class="primary--text">
    </v-breadcrumbs>
    <v-row>
      <v-col
        cols="12"
        md="3"
        v-show="$vuetify.breakpoint.mdAndUp || !faqCategoryId"
      >
        <v-card>
          <v-list>
            <v-list-item-group color="primary">
              <template v-for="item in faqCategorys">
                <v-list-item
                  :key="item.profile_value"
                  :to="`/faq/${item.profile_value}`"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.profile_comments }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider :key="item.profile_value + '-d'"></v-divider>
              </template>
            </v-list-item-group>
            <v-divider></v-divider>
          </v-list>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="9"
        v-show="$vuetify.breakpoint.mdAndUp && !faqCategoryId"
      >
        <v-alert color="primary" colored-border border="top" elevation="2">
          請先選取左邊的問題分類
        </v-alert>
      </v-col>
      <v-col cols="12" md="9" v-show="faqCategoryId">
        <v-card>
          <v-card-title>
            <v-text-field
              outlined
              v-model="search"
              prepend-inner-icon="search"
              label="搜尋"
              hide-details
            >
            </v-text-field>
          </v-card-title>
          <v-divider></v-divider>
          <v-expansion-panels accordion multiple v-model="panel">
            <v-expansion-panel v-for="(item, i) in filterfaqItems" :key="i">
              <v-expansion-panel-header class="primary--text">
                Q{{ item.num }}.{{ item.question }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-html="item.answer_clob"></div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { apiAxios } from '@/api'

export default {
  props: ['faqCategoryId', 'defaultQ'],
  created() {
    return this.fetchFaqCategory()
  },
  watch: {
    faqCategoryId: {
      immediate: true,
      handler: function (value) {
        this.fetchFaqData(value).then(() => {
          if (
            this.defaultQ &&
            this.filterfaqItems.length &&
            this.filterfaqItems.findIndex(x => x.id == this.defaultQ) >= 0
          )
            this.panel = [
              this.filterfaqItems.findIndex(x => x.id == this.defaultQ),
            ]
        })
      },
    },
  },
  data() {
    return {
      isLoading: false,
      isMobile: '',
      isShowfaqCategory: false,
      isShowFaqItem: false,
      faqCategory: '',
      faqCategorys: [],
      faqItems: [],
      search: '',
      panel: [],
    }
  },
  computed: {
    breadcrumbArray() {
      let items = [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: 'FAQ 常見問題',
          exact: true,
          to: '/faq',
        },
      ]
      let category = this.faqCategorys.find(
        x => x.profile_value === this.faqCategoryId
      )
      if (category) {
        items.push({
          text: category.profile_comments,
        })
      }
      return items
    },
    filterfaqItems() {
      return this.faqItems.filter(
        x =>
          !this.search ||
          (this.faqCategory == x.faq_sort && x.question.includes(this.search))
      )
    },
  },
  methods: {
    fetchFaqCategory() {
      return apiAxios({
        method: 'post',
        url: '/Faq/GetFaqCategory',
      }).then(res => (this.faqCategorys = res.result))
    },
    fetchFaqData(faqSort) {
      return apiAxios({
        method: 'post',
        url: '/Faq/GetFaqList',
        params: { faqSort: faqSort },
      }).then(res => (this.faqItems = res.result))
    },
  },
}
</script>
<style scoped>
.v-expansion-panel-content >>> img {
  width: 100%;
}
.v-expansion-panel-content >>> span {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
.v-expansion-panel-content >>> p {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
.v-expansion-panel-header >>> p {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
</style>

