<template>
  <div>
    <div
      v-for="(item, index) in activityArray"
      :key="item.id"
      :id="`activity-${item.id}`"
    >
      <div class="rebate-head">
        <div class="rebate-head-title">
          <h3
            class="text-center text-h4 my-4 primary pa-2 white--text"
            :class="{ 'mt-0': index == 0 }"
          >
            {{ item.title }}
          </h3>
        </div>
        <div class="rebate-head-share">
          <v-btn
            class="primary--text"
            icon
            outlined
            tile
            color="white"
            :class="{ 'mt-0': index == 0 }"
            @click="share(item.title, `activity-${item.id}`)"
          >
            <v-icon> share </v-icon>
            分享
          </v-btn>
        </div>
      </div>
      <div v-if="item.activity_url" @click="clickBannerTo(item.activity_url)">
        <v-img
          @load="onImgLoad()"
          style="margin: 0 auto"
          max-width="800px"
          :src="item.img_url"
        ></v-img>
      </div>
      <v-img
        v-else
        @load="onImgLoad()"
        style="margin: 0 auto"
        max-width="800px"
        :src="item.img_url"
      ></v-img>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { apiAxios } from '@/api'

export default {
  created() {
    this.fetchActivityArray()
    this.url = new URL(location.href)
    this.eventId = this.url.searchParams.get('id')
    window.appShareToWeb = this.shareResult
    if (window.previousUrl == '/share') {
      this.isFromShare = 'Y'
    }
  },
  data() {
    return {
      url: '',
      isLoaded: false,
      triggered: false,
      catchActivity: false,
      activity_name: '',
      isFromShare: 'N',
      activityArray: [],
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
    fetchActivityArray() {
      apiAxios({
        method: 'post',
        url: '/Activity/GetActivityOverview',
      }).then(res => {
        this.activityArray = res.result
      })
    },
    onImgLoad() {
      this.isLoaded = true
    },
    share(activity_name, activity_id) {
      this.activity_name = activity_name
      if (this.canShare) {
        const shareData = {
          title: '統一團購網',
          text: activity_name,
          url: `${this.url.origin}${this.url.pathname}?id=${activity_id}`,
        }
        navigator.share(shareData)
      } else if (this.canShareMobile) {
        const shareData = {
          title: '統一團購網',
          text: activity_name,
          url:
            (this.isAndroid ? ' ' : '') +
            `${this.url.origin}${this.url.pathname}?id=${activity_id}`,
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
          activity_name: this.activity_name,
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
    setScrollTop() {
      return new Promise(resolve => {
        let anchor = document.getElementById(this.eventId)
        document.documentElement.scrollTop = anchor.offsetTop + 183
        document.body.scrollTop = anchor.offsetTop + 183
        setTimeout(function () {
          if (window.scrollY < anchor.offsetTop && !this.catchActivity) {
            resolve(true)
          } else {
            resolve(false)
          }
        }, 500)
      }).then(res => {
        if (res == true) {
          this.setScrollTop()
        } else {
          this.catchActivity = true
        }
      })
    },
    clickBannerTo(url) {
      if (url.startsWith('/')) {
        this.$router.push(url)
      } else {
        if (window.GroupJSInterface) {
          let newUrl = new URL(url)
          newUrl.searchParams.set('external_browser', 2)
          window.location.href = newUrl.href
        } else {
          window.location.href = url
        }
      }
    },
  },
  watch: {
    isLoaded() {
      if (this.eventId != null && !this.triggered) {
        this.triggered = true
        this.setScrollTop()
      }
    },
  },
}
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}
.rebate-head {
  display: flex;
}
.rebate-head .rebate-head-title {
  flex: 1 1 auto;
  min-width: 0;
}
.rebate-head .rebate-head-title h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rebate-head .rebate-head-share button {
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 30px;
  height: 56px;
  width: 105px;
  font-size: 24px;
  font-weight: 700;
}
@media (max-width: 767px) {
  .rebate-head {
    position: relative;
  }
  .rebate-head .rebate-head-title h3 {
    overflow: auto;
    text-overflow: ellipsis;
    white-space: wrap;
  }
  .rebate-head .rebate-head-share {
    position: absolute;
    z-index: 1;
    bottom: -45px;
    right: 9px;
  }
  .rebate-head .rebate-head-share button {
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 24px;
    width: 93px;
    border-radius: 7px;
    height: 38px;
    box-shadow: 0px 3px 5px rgb(34 62 66 / 25%);
    background-color: #fff;
  }
  @media (max-width: 375px) {
    .rebate-head .rebate-head-share[data-v-239eb754] {
      bottom: -39px;
      right: 7px;
    }
    .rebate-head .rebate-head-share button {
      font-size: 18px;
      width: 74px;
      height: 31px;
    }
    .rebate-head .rebate-head-share button i {
      font-size: 18px;
    }
  }
}
</style>
