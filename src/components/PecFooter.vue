<template>
  <!-- <v-footer
    color="white"
    class="grey--text text--darken-2 text-body-2 pa-0 pb-14"
  > -->
  <v-container
    fluid
    class="page grey--text text--darken-2 text-body-2 pa-0 pb-14"
  >
    <v-row no-gutters class="w-100">
      <v-col cols="12" sm="4" md="3" xl="2">
        <v-row no-gutters class="pa-4">
          <v-col class="text-subtitle-1 warning--text pb-7" cols="12">
            商品分類
          </v-col>
          <v-col
            class="pb-5"
            cols="6"
            sm="12"
            v-for="category in categoryArray"
            :key="category.category_value"
          >
            <router-link
              class="text-decoration-none ga-home-view-category-bottom"
              :to="`/category/${category.category_value}`"
            >
              {{ category.name }}
            </router-link>
          </v-col>
        </v-row>
        <v-divider class="d-sm-none"></v-divider>
      </v-col>
      <v-col cols="12" sm="4" md="3" xl="2">
        <v-row no-gutters class="pa-4">
          <v-col class="text-subtitle-1 warning--text pb-7" cols="12">
            會員中心
          </v-col>
          <template v-if="!isLogin">
            <v-col class="pb-5" cols="6" sm="12">
              <router-link
                class="text-decoration-none ga-home-view-category-bottom"
                to="/login"
              >
                會員登入
              </router-link>
            </v-col>
            <v-col class="pb-5" cols="6" sm="12">
              <router-link
                class="text-decoration-none ga-home-view-category-bottom"
                to="/frequently-asked-questions"
              >
                常見問題
              </router-link>
            </v-col>
          </template>

          <template v-else>
            <v-col
              class="pb-5"
              cols="6"
              sm="12"
              v-for="item in navArray"
              :key="item.id"
            >
              <div v-if="item.to">
                <router-link
                  class="text-decoration-none ga-home-view-category-bottom"
                  :to="item.to"
                >
                  {{ item.name }}
                </router-link>
              </div>
              <div
                v-else
                @click="$store.commit(item.clickEvent)"
                style="cursor: pointer"
              >
                {{ item.name }}
              </div>
            </v-col>
          </template>
        </v-row>
        <v-divider class="d-sm-none"></v-divider>
      </v-col>
      <v-col cols="12" sm="4" md="3" xl="2">
        <v-row no-gutters class="pa-4">
          <v-col class="text-subtitle-1 warning--text pb-7" cols="12">
            客戶服務
          </v-col>
          <v-col class="pb-5" cols="12"> 統一夢公園生活事業股份有限公司 </v-col>
          <v-col class="pb-5" cols="12"> 統一編號: 70486723 </v-col>
          <v-col class="pb-5" cols="12"> 地址: 台南市永康區中正路301號 </v-col>
          <v-col class="pb-5" cols="6" sm="12">
            客服信箱：<br /><a href="mailto:unilife@mail.pec.com.tw"
              >unilife@mail.pec.com.tw</a
            >
          </v-col>
          <v-col class="pb-5" cols="6" sm="12">
            聯絡電話:<a href="tel:+886-800-789-168">0800-789-168</a
            ><br />「週一~五 08:00~17:00」
          </v-col>
          <v-col class="pb-5" cols="6" sm="12">
            <router-link
              class="text-decoration-none ga-home-view-category-bottom"
              to="/terms-and-policy"
            >
              隱私權條款
            </router-link>
          </v-col>
          <v-col class="pb-5" cols="6" sm="12"> V{{ version }} </v-col>
        </v-row>
        <v-divider class="d-sm-none"></v-divider>
      </v-col>

      <v-col cols="12" sm="4" md="3" xl="2" v-if="!hideQRCode" class="w-100">
        <v-row dense class="pa-4 ma-0">
          <v-col class="text-subtitle-1 warning--text pa-0 pb-7" cols="12">
            行動購物APP
          </v-col>
          <v-col cols="6" class="pa-0">
            <div class="w-100 pr-2">
              <v-img src="/qrcode/app-ios-QRcode.png"></v-img>
            </div>
          </v-col>
          <v-col cols="6" class="pa-0">
            <div class="w-100 pl-2">
              <v-img src="/qrcode/app-Android-QRcode.png"></v-img>
            </div>
          </v-col>
          <v-col class="text-subtitle-1 warning--text pa-0 pb-7 pt-7" cols="6">
            UNI社群享好康
          </v-col>
          <v-col class="text-subtitle-1 warning--text pa-0 pb-7 pt-7" cols="6">
            一對一客服
          </v-col>
          <v-col cols="6" class="pa-0">
            <div class="w-100 pr-2">
              <v-img src="/qrcode/giveaway-QRcode.png"></v-img>
              <v-btn
                color="primary"
                class="mt-3 w-100"
                outlined
                block
                @click.stop="clickTo('https://reurl.cc/mD5av1')"
              >
                免費加入
              </v-btn>
            </div>
          </v-col>
          <v-col cols="6" class="pa-0">
            <div class="w-100 pl-2">
              <v-img src="/qrcode/one-on-one-QRcode.png"></v-img>
              <v-btn
                color="primary"
                class="mt-3 w-100"
                outlined
                block
                @click.stop="clickTo('https://lin.ee/KOO0gZd')"
              >
                加我好友
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider class="d-sm-none"></v-divider>
      </v-col>

      <v-col cols="12" sm="4" md="3" xl="2">
        <div class="d-flex flex-column align-center pa-4">
          <img class="mb-6" src="/logo.jpg" width="100%" />
          <div class="pb-5">© 統一企業 版權所有</div>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <!-- </v-footer> -->
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { version } from '/package.json'
export default {
  data() {
    return { version, hideQRCode: false }
  },
  computed: {
    ...mapState(['categoryArray', 'memberNavArray']),
    ...mapGetters(['isLogin']),
    navArray() {
      if (new Date() < new Date('2024-03-01T00:00:00+08:00')) {
        return this.memberNavArray
      } else {
        return this.memberNavArray.filter(e => e.name !== 'UNI團購主')
      }
    },
  },
  mounted() {
    let urlParams = new URLSearchParams(window.location.search)
    let os = urlParams.get('os')
    let v = urlParams.get('v')
    if (os && v) {
      fetch(
        'https://firestore.googleapis.com/v1/projects/pec-unilife/databases/(default)/documents/Release_Version/iOS_Version'
      )
        .then(response => response.json())
        .then(() => {
          if (os === 'iOS') {
            this.hideQRCode = true
          }
        })
        .catch(() => {})
    }
  },
  methods: {
    clickTo(url) {
      let regex = new RegExp('^/.*?')
      if (regex.test(url)) {
        this.$router.push(url)
      } else if (url) {
        if (window.GroupJSInterface) {
          let newUrl = new URL(url)
          newUrl.searchParams.set('external_browser', 2)
          window.location.href = newUrl.href
        } else {
          window.open(url)
        }
      }
    },
  },
}
</script>
