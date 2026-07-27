<template>
  <v-bottom-navigation
    app
    color="primary"
    grow
    hide-on-scroll
    v-if="$vuetify.breakpoint.mobile"
  >
    <v-btn
      class="ga-tab-home"
      text
      to="/"
      @click="getActiveBottomNavigation(0)"
    >
      <span>首頁</span>
      <background-svg
        :backgroungUrl="
          activeBottomNavigation === 0 ? '/home_after.svg' : '/home_before.svg'
        "
        width="20px"
        height="20px"
        color="#ca1f1d"
      ></background-svg>
    </v-btn>
    <v-btn
      class="ga-tab-category"
      text
      @click="
        $store.commit('setDrawer', !drawer)
        getActiveBottomNavigation(1)
      "
    >
      <span>商品分類</span>
      <background-svg
        :backgroungUrl="
          activeBottomNavigation === 1
            ? '/pec_category_after.svg'
            : '/pec_category_before.svg'
        "
        width="20px"
        height="20px"
        color="#ca1f1d"
      ></background-svg>
    </v-btn>
    <v-btn
      class="ga-tab-orders"
      text
      to="/my-order"
      @click="getActiveBottomNavigation(2)"
    >
      <span>我的訂單</span>
      <background-svg
        :backgroungUrl="
          activeBottomNavigation === 2
            ? '/shopping_bag_after.svg'
            : '/shopping_bag_before.svg'
        "
        width="20px"
        height="20px"
        color="#ca1f1d"
      ></background-svg>
    </v-btn>
    <v-btn
      class="ga-tab-notice"
      text
      to="/notification-center"
      @click="getActiveBottomNavigation(3)"
    >
      <v-badge
        class="custom-badge"
        v-if="badgeNumber > 0"
        :content="badgeNumber > 99 ? '99+' : badgeNumber"
        offset-x="-1"
        offset-y="-24"
      ></v-badge>
      <span>通知中心</span>
      <background-svg
        :backgroungUrl="
          activeBottomNavigation === 3
            ? '/notifications_after.svg'
            : '/notifications_before.svg'
        "
        width="20px"
        height="20px"
        color="#ca1f1d"
      ></background-svg>
    </v-btn>
    <v-btn
      class="ga-tab-service"
      text
      @click="
        $store.commit('toLine')
        getActiveBottomNavigation(4)
        toLine()
      "
    >
      <span>線上客服</span>
      <!-- <background-svg
        :backgroungUrl="
          activeBottomNavigation === 4
            ? '/support_agent_after.svg'
            : '/support_agent_before.svg'
        "
        width="20px"
        height="20px"
        color="#ca1f1d"
      ></background-svg> -->
      <v-img
        :src="
          activeBottomNavigation === 4
            ? '/support_agent_after.svg'
            : '/support_agent_before.svg'
        "
        eager
        max-width="23"
        max-height="23"
      ></v-img>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
import { mapState } from 'vuex'
import BackgroundSvg from '@/components/BackgroundSvg.vue'

export default {
  components: {
    BackgroundSvg,
  },
  data() {
    return {
      isToLine: false,
    }
  },
  computed: {
    ...mapState(['drawer', 'badgeNumber', 'activeBottomNavigation']),
  },
  watch: {
    drawer: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.initActive()
        }
      },
    },
    isToLine: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.initActive()
        }
      },
    },
  },
  methods: {
    getActiveBottomNavigation(id) {
      this.$store.commit('setActiveBottomNavigation', id)
    },
    initActive() {
      let routeName = this.$route.name
      if (routeName == 'MyOrder') {
        this.$store.commit('setActiveBottomNavigation', 2)
      }
      if (routeName == 'Home') {
        this.$store.commit('setActiveBottomNavigation', 0)
      }
      if (routeName == 'NotificationCenter') {
        this.$store.commit('setActiveBottomNavigation', 3)
      }
    },
    toLine() {
      this.isToLine = true
      setTimeout(() => {
        this.isToLine = false
      }, 1000)
    },
  },
  mounted() {
    this.initActive()
  },
}
</script>
<style scoped>
.theme--light.v-bottom-navigation >>> .v-btn:not(.v-btn--active) {
  color: inherit !important;
}
.theme--light.v-bottom-navigation >>> .v-btn__content span {
  color: rgba(0, 0, 0, 0.87);
}

.theme--light.v-bottom-navigation >>> .v-badge__wrapper span {
  color: rgb(255, 255, 255);
}
.v-bottom-navigation >>> .v-btn {
  min-width: 60px !important;
}
.custom-badge >>> .v-badge__wrapper .v-badge__badge {
  background-color: #fff !important;
  color: var(--v-primary-base) !important;
  border: 1px solid var(--v-primary-base) !important;
  z-index: 1;
}
</style>
