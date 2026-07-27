<template>
  <div>
    <div class="d-flex justify-end flex-wrap">
      <v-breadcrumbs large :items="items" class="primary--text"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn
        class="mt-3 mr-3 secondary pec-share-btn"
        @click="share"
      >
        <background-svg
          class="mt-1"
          backgroungUrl="/share.svg"
          width="16px"
          height="16px"
          color="#fff"
        ></background-svg>
        立即分享
      </v-btn>
      <!-- <product-list
        :product-array="brandList"
        :is-loading="isLoading"
        :breadcrumbs="items"
      ></product-list> -->
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="12">
            <!-- <v-card class="d-none d-md-block mb-4">
              <div class="d-flex justify-space-between py-3 px-4">
                <div class="d-flex align-center">
                  呈現方式：
                  <v-btn-toggle class="ml-1" v-model="gridView" borderless>
                    <v-btn small :value="false">
                      <background-svg
                        class="mt-1 mr-1"
                        backgroungUrl="/view_list.svg"
                        width="18px"
                        height="18px"
                        color="#000"
                      ></background-svg>
                      列表
                    </v-btn>
                    <v-btn small :value="true">
                      <background-svg
                        class="mt-1 mr-1"
                        backgroungUrl="/grid_view.svg"
                        width="18px"
                        height="18px"
                        color="#000"
                      ></background-svg>
                      圖表
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </div>
            </v-card> -->
            <!-- <template v-if="isLoading && !gridView">
              <v-skeleton-loader
                v-for="index in 4"
                :key="index"
                type="list-item-avatar-three-line"
              ></v-skeleton-loader>
            </template> -->
            <v-row v-if="isLoading">
              <v-col cols="6" sm="4" md="3" v-for="index in 4" :key="index">
                <v-skeleton-loader type="card"></v-skeleton-loader>
              </v-col>
            </v-row>
            <!-- <v-row dense v-if="!isLoading">
              <v-col cols="12" v-for="(brand, index) in brandList" :key="index">
                {{ brand.title }}
              </v-col>
            </v-row> -->
            <v-row v-if="!isLoading">
              <v-col
                cols="6"
                sm="4"
                md="3"
                v-for="(brand, index) in brandList"
                :key="index"
                class="d-flex justify-center align-center"
              >
                <v-card class="mx-auto">
                  <v-img
                    :src="brand.img_url_list"
                    @click="toBrandGroup(brand)"
                    style="cursor: pointer"
                  ></v-img>
                  <div class="pt-10 primary" style="position: relative">
                    <v-img
                      :src="brand.img_url_list"
                      @click="toBrandGroup(brand)"
                      style="
                        position: absolute;
                        cursor: pointer;
                        z-index: 1;
                        border-radius: 50%;
                        width: 160px;
                        top: -110px;
                        right: calc(50% - 80px);
                      "
                    ></v-img>
                    <v-card-title class="white--text justify-center"
                      >{{brand.title}}</v-card-title
                    >
                  </div>
                  <v-btn width="100%" color="white">追蹤</v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <!-- <div v-for="(brand, index) in brandList" :key="index">
        {{ brand.title }}
      </div> -->
    </div>
  </div>
</template>
<script>
// import ProductList from '@/components/ProductList.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'
import { mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  components: {
    // ProductList,
    BackgroundSvg,
  },
  created() {
    this.fetchData()
    window.appShareToWeb = this.shareResult
    if (window.previousUrl == '/share') {
      this.isFromShare = 'Y'
    }
  },
  data() {
    return {
      isLoading: false,
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '品牌旗艦館',
          to: '/brand-group',
        },
        {
          text: '全部商品',
          to: '/brand-flagship-hall',
        },
      ],
      isFromShare: 'N',
      brandList: [],
    }
  },
  computed: {
    ...mapState(['isAndroid']),
    canShare() {
      return window.navigator.canShare && !window.GroupJSInterface
    },
    canShareMobile() {
      return window.GroupJSInterface
    },
  },
  methods: {
    fetchData() {
      this.isLoading = true
      return Promise.resolve()
        .then(() => {
          if (this.$store.getters.isLogin) {
            return apiAxios({
              method: 'post',
              url: '/Users/VerifyToken',
            })
          } else {
            return Promise.resolve()
          }
        })
        .then(() =>
          apiAxios({
            method: 'post',
            url: '/Brand/GetBrand',
          }).then(res => {
            this.brandList = res.result
          })
        )
        .finally(() => (this.isLoading = false))
    },
    toBrandGroup(brand) {
      if (brand.router_to) {
        this.$router.push(brand.router_to)
      } else {
        this.$snackbar.add(brand.brand_name + ' 品牌專館建置中')
      }
    },
    share() {
      if (this.canShare) {
        const shareData = {
          title: '統一團購網',
          text: this.items[1].text,
          url: window.location.href,
        }
        navigator.share(shareData)
      } else if (this.canShareMobile) {
        const shareData = {
          title: '統一團購網',
          text: this.items[1].text,
          url: (this.isAndroid ? ' ' : '') + window.location.href,
        }
        if (window.GroupJSInterface.shareToApp) {
          window.GroupJSInterface.shareToApp(JSON.stringify(shareData))
        } else {
          this.$snackbar.add(`此分享功能需要更新至最新 app 版本`, {
            color: 'success',
          })
        }
      }
    },
    shareResult(servcie) {
      return apiAxios({
        method: 'post',
        url: '/Share/InsertShareLog',
        data: {
          activity_name: `活動專區 ${this.items[1].text}`,
          share_app: servcie,
          share_point: this.isFromShare,
        },
      }).then(() => {
        this.$snackbar.add(`分享成功`, { color: 'success' })
        if (this.isFromShare == 'Y') {
          this.$router.push('/share')
        }
      })
    },
  },
}
</script>
<style scoped>
.pec-share-btn {
  position: sticky;
  top: 83px;
  z-index: 2;
}
</style>