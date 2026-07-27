import Vue from 'vue'
import Vuex from 'vuex'
import jwt_decode from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid'
import { apiAxios, authAxios } from '@/api'

Vue.use(Vuex)

// let urlParams = new URLSearchParams(window.location.search)
// let os = urlParams.get('os')
// let v = urlParams.get('v')

export default new Vuex.Store({
  strict: import.meta.env.NODE_ENV !== 'production',
  state: {
    accessToken: localStorage.getItem('pec_access_token'),
    refreshToken: localStorage.getItem('pec_refresh_token'),
    profile: {},
    clientId: localStorage.getItem('pec_client_id'),
    giftIcon: false,
    drawer: false,
    historyDrawer: false,
    menu: false,
    showRegister: false,
    badgeNumber: 0,
    cartCount: 0,
    activityWheelCount: 0,
    isAndroid: /Android/i.test(navigator.userAgent),
    // showRegister:
    //   (os === 'iOS' && v === '1201') || (os === 'Android' && v === '12000'),

    memberNavArray: [
      {
        id: 1,
        name: '我的訂單',
        to: '/my-order',
      },
      {
        id: 2,
        name: '會員資料',
        to: '/profile',
      },
      {
        id: 3,
        name: '折價券',
        to: '/reward',
      },
      {
        id: 4,
        name: '活動攻略',
        to: '/rebate',
      },
      {
        id: 5,
        name: '許願開團',
        to: '/wish',
      },
      {
        id: 6,
        name: '追蹤清單',
        to: '/my-follow',
      },
      {
        id: 7,
        name: '開團通知',
        to: '/my-sale-notice',
      },
      {
        id: 8,
        name: '常見問題',
        to: '/faq',
      },
      {
        id: 9,
        name: '賣貴通報',
        to: '/price-report',
      },
      {
        id: 10,
        name: '買貴退差價',
        to: '/price-match',
      },
      {
        id: 11,
        name: '每日分享',
        to: '/share',
      },
      {
        id: 12,
        name: '通知中心',
        to: '/notification-center',
      },
      {
        id: 13,
        name: '發票日誌',
        to: '/my-invoice',
      },
      {
        id: 14,
        name: '線上客服',
        clickEvent: 'toLine',
      },
      {
        id: 15,
        name: '分級會員',
        to: '/group-buy',
      },
      {
        id: 16,
        name: 'OP贈點明細',
        to: '/my-oppoint',
      },
      {
        id: 17,
        name: '常用地址',
        to: '/address',
      },
      // {
      //   id: 5,
      //   name: 'VIP專區',
      //   to: '/vip'
      // },
      // {
      //   id: 6,
      //   name: '集團優惠',
      //   to: '/advertising'
      // },
    ],
    newMemberNavArray: [
      [
        {
          id: 1,
          name: '我的訂單',
          to: '/my-order',
          title: '訂購紀錄',
        },
        {
          id: 2,
          name: '折價券',
          to: '/reward',
          title: '訂購紀錄',
        },
        {
          id: 3,
          name: '發票日誌',
          to: '/my-invoice',
          title: '訂購紀錄',
        },
        {
          id: 4,
          name: 'OP贈點明細',
          to: '/my-oppoint',
          title: '訂購紀錄',
        },
      ],
      [
        {
          id: 5,
          name: '分級會員',
          to: '/group-buy',
          title: '活動總覽',
        },
        {
          id: 6,
          name: '活動攻略',
          to: '/rebate',
          title: '活動總覽',
        },
        {
          id: 7,
          name: '每日簽到',
          to: '/check-in',
          title: '活動總覽',
        },
        // {
        //   id: 8,
        //   name: '好評推薦',
        //   to: '/share',
        //   title: '活動總覽',
        // },
      ],
      [
        {
          id: 9,
          name: '賣貴通報',
          to: '/price-report',
          title: '服務查詢',
        },
        {
          id: 10,
          name: '許願開團',
          to: '/wish',
          title: '服務查詢',
        },
        {
          id: 11,
          name: '追蹤清單',
          to: '/my-follow',
          title: '服務查詢',
        },
        {
          id: 12,
          name: '開團通知',
          to: '/my-sale-notice',
          title: '服務查詢',
        },
        {
          id: 13,
          name: '買貴退差價',
          to: '/price-match',
          title: '服務查詢',
        },
      ],
      [
        {
          id: 14,
          name: '會員資料',
          to: '/profile',
          title: '常用設定',
        },
        {
          id: 15,
          name: '常用地址',
          to: '/address',
          title: '常用設定',
        },
        {
          id: 16,
          name: '常用三聯',
          to: '/invoice',
          title: '常用設定',
        },
        {
          id: 17,
          name: '常用信用卡',
          to: '/credit-card',
          title: '常用設定',
        },
        {
          id: 18,
          name: '常見問題',
          to: '/faq',
          title: '常用設定',
        },
        {
          id: 19,
          name: '線上客服',
          clickEvent: 'toLine',
          title: '常用設定',
        },
        {
          id: 20,
          name: '通知中心',
          to: '/notification-center',
          title: '常用設定',
        },
      ],
    ],
    categoryArray: [],
    cart: [],
    checkoutProductArray: [],
    isPageLoading: false,
    lineURL: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=394nhzcy',
    userKeywords: [],
    product: {},
    areaOrderNumArray: [],
    isFormLoading: true,
    sheet: false,
    activeBottomNavigation: null,
    teamBuyDialog: false,
    teamBuyDialogData: {},
    teamBuyDrawer: false,
    teamBuyArray: [],
    teamBuyDialogStatus: 'close',
    isGpMaster: '',
    membershipInfo: {},
    multipleDeletions: [],
    updateBrowsHistoryPageNo: false,
    isCheckTester: false,
    userInfo: {
      // receiveStatus2: 0,
      // receiveStatus0: 0,
      // availableReward: 0,
      // expiredRewardAfter7: 0,
      // recommend: 0,
      // recommendSuccess: 0,
      // trackProduct: 0,
      // opPoint: 0,
    },
  },
  getters: {
    userId(state) {
      return state.accessToken ? jwt_decode(state.accessToken).user_id : ''
    },
    isLogin(state, getters) {
      return !!getters.userId
    },
    isPec(state) {
      return state.accessToken
        ? jwt_decode(state.accessToken).iss.includes('empauthtp2.pec.com.tw')
        : false
    },
    isVerified(state) {
      return (
        state.accessToken && jwt_decode(state.accessToken).emp_no !== 'unknown'
      )
    },
    isGpMaster(state) {
      return state.isGpMaster
    },
    membershipInfo(state) {
      return state.membershipInfo
    },
    displayName(state) {
      return state.profile.display_name || ''
    },
    sheet(state) {
      return state.sheet
    },
    teamBuyDrawer(state) {
      return state.teamBuyDrawer
    },
    updateBrowsHistoryPageNo(state) {
      return state.updateBrowsHistoryPageNo
    },
  },
  mutations: {
    setClientId(state) {
      let clientId = uuidv4()
      state.clientId = clientId
      localStorage.setItem('pec_client_id', clientId)
    },
    setIsGpMaster(state, isGpMaster) {
      state.isGpMaster = isGpMaster
    },
    setMembershipInfo(state, membershipInfo) {
      state.membershipInfo = membershipInfo
    },
    setUserInfo(state, setUserInfo) {
      state.userInfo = { ...setUserInfo }
    },
    setProfile(state, profile) {
      state.profile = profile
    },
    setCategoryArray(state, categoryArray) {
      state.categoryArray = categoryArray
    },
    setToken(state, { access_token, refresh_token }) {
      state.accessToken = access_token
      state.refreshToken = refresh_token
      localStorage.setItem('pec_access_token', access_token)
      localStorage.setItem('pec_refresh_token', refresh_token)
    },
    clearToken(state) {
      state.accessToken = ''
      state.refreshToken = ''
      localStorage.setItem('pec_access_token', '')
      localStorage.setItem('pec_refresh_token', '')
    },
    setDrawer(state, value) {
      state.drawer = value
    },
    setHistoryDrawer(state, value) {
      state.historyDrawer = value
    },
    setMenu(state, value) {
      state.menu = value
    },
    showGiftIcon(state) {
      state.giftIcon = true
    },
    addToCart(state, value) {
      state.cart.push(value)
    },
    addToCheckout(state, value) {
      state.checkoutProductArray.push(value)
    },
    clearCheckout(state) {
      state.checkoutProductArray = []
    },
    setBadgeNumber(state, value) {
      state.badgeNumber = value
      if (
        window.GroupJSInterface &&
        window.GroupJSInterface.updateBadgeNumber
      ) {
        window.GroupJSInterface.updateBadgeNumber(value)
      }
    },
    setCartCount(state, value) {
      state.cartCount = value
    },
    setActivityWheelCount(state, value) {
      state.activityWheelCount = value
    },
    setPageLoading(state, value) {
      state.isPageLoading = value
    },
    toLine(state) {
      if (window.GroupJSInterface) {
        window.location.href = `${state.lineURL}&external_browser=2`
      } else {
        window.open(state.lineURL)
      }
    },
    setShowRegister(state, value) {
      state.showRegister = value
    },
    setUserKeywords(state, value) {
      state.userKeywords = value
    },
    delUserKeywords(state, payload) {
      state.userKeywords.splice(payload.index, 1)
    },
    sortUserKeywords(state, payload) {
      let findIndex = state.userKeywords.findIndex(e => e.keywords == payload.q)
      if (findIndex != -1) {
        state.userKeywords.splice(findIndex, 1)
      }
      state.userKeywords.push({
        keywords: payload.q,
        creation_date: new Date(),
      })
      state.userKeywords = state.userKeywords.sort(
        (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
      )
      if (state.userKeywords.length > 10) {
        state.userKeywords.splice(state.userKeywords.length - 1, 1)
      }
    },
    setProductForm(state, payload) {
      state[payload.type] = payload.data
    },
    setActiveBottomNavigation(state, value) {
      state.activeBottomNavigation = value
    },
    setTeamBuyDialog(state, payload) {
      state.teamBuyDialog = payload.dialog
      state.teamBuyDialogData = payload.data
      state.teamBuyDialogStatus = payload.status ? payload.status : 'close'
    },
    setTeamBuyDrawer(state, payload) {
      state.teamBuyDrawer = payload.drawer
      state.teamBuyArray = payload.data
    },
    setUpdateBrowsHistoryPageNo(state, value) {
      state.updateBrowsHistoryPageNo = value
    },
    setCheckTester(state, value) {
      state.isCheckTester = value
    },
  },
  actions: {
    login(store, { username, password }) {
      let formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('client_id', import.meta.env.VITE_AUTH_CLIENT_ID)
      let options = {
        method: 'post',
        url: '/GetToken',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      }
      return authAxios(options).then(res => res.data)
    },
    logout(store) {
      store.commit('clearToken')
      store.commit('setIsGpMaster', false)
      store.commit('setMembershipInfo', '')
      store.commit('setBadgeNumber', 0)
      store.commit('setCartCount', 0)
      store.commit('setActivityWheelCount', 0)
      store.commit('setCheckTester', false)
      if (window.GroupJSInterface && window.GroupJSInterface.onLogout) {
        window.GroupJSInterface.onLogout('')
      }
    },
    refreshAccessToken() {
      let data = {
        // refresh_token: store.state.refreshToken,
        refresh_token: localStorage.getItem('pec_refresh_token'),
        client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
      }

      let options = {
        method: 'post',
        url: '/RefreshToken',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      return authAxios(options).then(res => res.data)
    },
    verifyToken() {
      return apiAxios({
        method: 'post',
        url: '/Users/VerifyToken',
      })
    },
    async initialize(store) {
      if (store.getters.isLogin) {
        try {
          await store.dispatch('verifyToken')
        } catch {
          store.dispatch('logout')
        }
      } else {
        store.dispatch('logout')
      }

      //統計登入
      if (!store.state.clientId) {
        store.commit('setClientId')
      }

      if (store.getters.isLogin) {
        await apiAxios({
          method: 'post',
          url: '/Users/GetUserProfile',
        }).then(res => store.commit('setProfile', res.result[0] || {}))

        apiAxios({
          method: 'post',
          url: '/MemberShip/GetMembershipInfo',
          data: {},
        }).then(res => {
          store.commit('setMembershipInfo', res.result)
        })

        apiAxios({
          method: 'post',
          url: '/Users/GetUserInfo',
          data: {},
        }).then(res => {
          store.commit('setUserInfo', res.result[0])
        })
      }

      //會員資料

      const fetchDateWhenIdle = () => {
        apiAxios({
          method: 'post',
          url: '/Event/Visit',
          data: {
            user_id: store.getters.userId,
            client_id: store.state.clientId,
          },
        }).catch(() => {})

        if (store.getters.isLogin) {
          //團購主
          // apiAxios({
          //   method: 'post',
          //   url: '/GpMaster/GetValidMark',
          // })
          //   .then(res => {
          //     store.commit('setIsGpMaster', res.result === 'Y' ? true : false)
          //   })
          //   .catch(() => {})

          //會員分級

          //購物車
          apiAxios({
            method: 'post',
            url: '/Cart/GetCartItemArray',
          })
            .then(res => {
              store.commit('setCartCount', res.result.length)
            })
            .catch(() => store.commit('setCartCount', 0))
          // 轉盤可轉數量
          apiAxios({
            method: 'post',
            url: '/Activity/GetActivityWheelTimes',
          })
            .then(res => {
              store.commit('setActivityWheelCount', res.result)
            })
            .catch(() => store.commit('setActivityWheelCount', 0))
          //使用者關鍵字
          apiAxios({
            method: 'post',
            url: '/KeyWords/RecentKeyWords',
          })
            .then(res => {
              let data = res.result.user_keywords
              data = data.sort(
                (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
              )
              store.commit('setUserKeywords', data)
            })
            .catch(() => {})

          //更新訊息已讀狀態
          const urlParams = new URLSearchParams(window.location.search)
          const messageType = urlParams.get('messageType')
          const messageId = urlParams.get('messageId')
          const userId = urlParams.get('userId')

          try {
            if (messageId) {
              let res = apiAxios({
                method: 'post',
                url: '/NotificationCenter/setNotificationReadStatus',
                data: {
                  message_type: messageType || '0',
                  id: messageId,
                  user_id: userId,
                },
              })
              store.commit('setBadgeNumber', res.result.unread_count)
            } else {
              let res = apiAxios({
                method: 'post',
                url: '/NotificationCenter/GetUserUnreadCount',
                data: {},
              })
              store.commit('setBadgeNumber', res.result.unread_count)
            }
          } catch {
            store.commit('setBadgeNumber', 0)
          }

          //註冊推播token
          if (window.GroupJSInterface && window.GroupJSInterface.onLogin) {
            window.GroupJSInterface.onLogin(store.state.accessToken)
          }

          // 檢查正式機測試帳號權限
          apiAxios({
            method: 'post',
            url: '/Tester/CheckTester',
          }).then(res => {
            store.commit('setCheckTester', res.result == 'Y' ? true : false)
          })
        }
      }

      if (window.requestIdleCallback) {
        requestIdleCallback(fetchDateWhenIdle)
      } else {
        setTimeout(fetchDateWhenIdle, 1000)
      }
    },
    inOrOutLog(store, { emp_no = store.getters.userId, event_name }) {
      return apiAxios({
        method: 'post',
        url: '/Event/InAndOutLog',
        data: {
          emp_no,
          event_name,
          source_device: window.GroupJSInterface ? 'APP' : 'WEB',
          // access_token: store.state.accessToken,
          // refresh_token: store.state.refreshToken,
          access_token: localStorage.getItem('pec_access_token') || '',
          refresh_token: localStorage.getItem('pec_refresh_token') || '',
        },
      })
    },
    setCartProduct(context, payload) {
      context.commit('setProductForm', {
        type: 'isFormLoading',
        data: true,
      })
      context.commit('setProductForm', {
        type: 'sheet',
        data: false,
      })
      return Promise.all([
        apiAxios({
          method: 'post',
          url: '/Product/GetProductAreaOrderNum',
          data: { product_id: payload },
        }),
        apiAxios({
          method: 'post',
          url: '/Product/GetProductV2',
          params: { v: '2' },
          data: { product_id: payload },
        }),
      ])
        .then(res => {
          context.commit('setProductForm', {
            type: 'product',
            data: res[1].result[0],
          })
          context.commit('setProductForm', {
            type: 'areaOrderNumArray',
            data: res[0].result,
          })
        })
        .finally(() => {
          context.commit('setProductForm', {
            type: 'isFormLoading',
            data: false,
          })
          context.commit('setProductForm', {
            type: 'sheet',
            data: true,
          })
        })
    },
    getUserUnreadCount(store) {
      return apiAxios({
        method: 'post',
        url: '/NotificationCenter/GetUserUnreadCount',
        params: {},
        data: {},
      }).then(res => {
        store.commit('setBadgeNumber', res.result.unread_count)
      })
    },
  },
})
