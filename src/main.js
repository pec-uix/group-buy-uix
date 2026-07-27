import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import ProductZoomer from 'vue-product-zoomer'
import VueYouTubeEmbed from 'vue-youtube-embed'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import 'dayjs/locale/zh-tw'
import updateLocale from 'dayjs/plugin/updateLocale'
import { ApiError } from '@/api'
import firebase from 'firebase/app'
import VueGtm from '@gtm-support/vue2-gtm'
import VueClipboard from 'vue-clipboard2'
// import Vue2TouchEvents from 'vue2-touch-events'
// Vue.use(Vue2TouchEvents)
import 'firebase/auth'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const firebaseConfig = {
  apiKey: 'AIzaSyBAPACOGABk45lEoxmQe_omcXPNTcR0Fdw',
  authDomain: 'pec-group-buy.firebaseapp.com',
  projectId: 'pec-group-buy',
  storageBucket: 'pec-group-buy.appspot.com',
  messagingSenderId: '1096512570119',
  appId: '1:1096512570119:web:611a12ed51c0cc6cab3ba2',
}

firebase.initializeApp(firebaseConfig)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.locale('zh-tw')
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(updateLocale)
dayjs.updateLocale('zh-tw', {
  relativeTime: {
    future: '倒數%s',
    past: '%s前',
    s: '幾秒',
    m: '1分鐘',
    mm: '%d分鐘',
    h: '1小時',
    hh: '%d小時',
    d: '1天',
    dd: '%d天',
    M: '1個月',
    MM: '%d個月',
    y: '1年',
    yy: '%d年',
  },
})

Vue.use(VueYouTubeEmbed)
Vue.use(VueClipboard)
Vue.use(ProductZoomer)
Vue.use(VueVirtualScroller)

Vue.config.productionTip = false

Vue.prototype.$snackbar = {}
Vue.prototype.$dialog = {}
Vue.prototype.$dayjs = dayjs

Vue.config.errorHandler = function (err, vm) {
  if (err instanceof ApiError) {
    if (err.message === 'Invalid Refresh Token' && vm.$route.path != '/login') {
      vm.$router.push('/login')
    } else {
      vm.$snackbar.add(err.message)
    }
  } else {
    console.log(err)
  }
}

Vue.use(VueGtm, {
  id: 'GTM-W2R6GN6',
  vueRouter: router,
})

window.dataLayer = window.dataLayer || []

window.dataLayer.push({ userId: store.getters['userId'] })

// 解析 URL 參數
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  const utmData = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    const value = params.get(key);
    if (value) {
      utmData[key] = value;
    }
  });

  return utmData;
}

// 記錄 UTM 資訊到 sessionStorage
function saveUTMParams() {
  const utmParams = getUTMParams();
  if (Object.keys(utmParams).length > 0) {
    // 加入當前時間 (ISO 字串)
    utmParams.utm_recorded_at = new Date().toISOString();
    sessionStorage.setItem('pec_utm_info', JSON.stringify(utmParams));
  }
}

// 執行 UTM 記錄
saveUTMParams();

// 取出使用
// const utmInfo = JSON.parse(sessionStorage.getItem('pec_utm_info')) || {};
// console.log(utmInfo.utm_source); // 例如：'google'
// console.log(utmInfo.utm_medium); // 例如：'cpc'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
