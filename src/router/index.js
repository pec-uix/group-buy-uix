import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import LoginUniopen from '../views/LoginUniopen.vue'
import MyOrder from '../views/MyOrder.vue'
import CheckIn from '../views/CheckIn.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import authGuard from './auth-guard'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home,
      pageFooter: BottomNavigation,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    components: {
      default: LoginUniopen,
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/loginuniopen',
    name: 'LoginUniopen',
    components: {
      default: LoginUniopen,
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/login/pec',
    name: 'LoginPec',
    components: {
      default: () => import('../views/LoginPec.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/login/auth',
    name: 'Auth',
    components: {
      default: () => import('../views/Auth.vue'),
    },
    props: { default: route => ({ v: route.query['v'] }) },
  },
  {
    path: '/Register',
    name: 'Register',
    components: {
      default: () => import('../views/Register.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/category/:categoryId',
    name: 'Category',
    components: {
      default: () => import('../views/Category.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/categoryMinor/:categoryMinorId',
    name: 'CategoryMinor',
    components: {
      default: () => import('../views/CategoryMinor.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/categorySecondary/:categorySecondaryId',
    name: 'CategorySecondary',
    components: {
      default: () => import('../views/CategorySecondary.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/activity/:activityType',
    name: 'Activity',
    components: {
      default: () => import('../views/Activity.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/buy',
    name: 'Buy',
    components: {
      default: () => import('../views/Buy.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/hot',
    name: 'Hot',
    components: {
      default: () => import('../views/Hot.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/activity-qrcode',
    name: 'ActivityQrcode',
    components: {
      default: () => import('../views/ActivityQrcode.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
  },
  {
    path: '/personalized-recommendation',
    name: 'PersonalizedRecommendation',
    components: {
      default: () => import('../views/PersonalizedRecommendation.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/coupon',
    name: 'Coupon',
    components: {
      default: () => import('../views/Coupon.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/recommend',
    name: 'Recommend',
    components: {
      default: () => import('../views/Recommend.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/new',
    name: 'New',
    components: {
      default: () => import('../views/New.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/end-soon',
    name: 'EndSoon',
    components: {
      default: () => import('../views/EndSoon.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/search',
    name: 'Search',
    components: {
      default: () => import('../views/Search.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: route => ({
        q: route.query['q'],
        type: route.query['type'],
        brandId: route.query['brandId'],
        categoryId: route.query['categoryId'],
        isAiSearch: route.query['isAiSearch'],
      }),
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/search-auto',
    name: 'SearchAuto',
    components: {
      default: () => import('../views/SearchAuto.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: route => ({
        q: route.query['q'],
        type: route.query['type'],
        brandId: route.query['brandId'],
        categoryId: route.query['categoryId'],
        isAiSearch: route.query['isAiSearch'],
      }),
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/product/:productId',
    name: 'Product',
    components: {
      default: () => import('../views/Product.vue'),
    },
    props: {
      default: route => ({
        isPreview: !!route.query['is-preview'],
        breadcrumbs: route.params.breadcrumbs,
        productId: route.params.productId,
        prefix: route.query['prefix'],
      }),
    },
  },
  {
    path: '/product/:productId/fill-in',
    name: 'FillIn',
    components: {
      default: () => import('../views/FillIn.vue'),
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
      requireProfile: true,
    },
  },
  {
    path: '/order-submited/:orderId',
    name: 'OrderSubmited',
    components: {
      default: () => import('../views/OrderSubmited.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/my-order',
    name: 'MyOrder',
    components: {
      default: MyOrder,
      pageFooter: BottomNavigation,
    },
    props: {
      default: route => ({ orderId: route.query['order-id'] }),
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
      keepAlive: true,
    },
  },
  {
    path: '/my-order/:orderId',
    name: 'OrderDetail',
    components: {
      default: () => import('../views/OrderDetail.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/credit-card',
    name: 'CreditCard',
    components: {
      default: () => import('@/views/CreditCard.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/comment/:orderId',
    name: 'Comment',
    components: {
      default: () => import('../views/Comment.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    components: {
      default: () => import('../views/Profile.vue'),
      pageFooter: BottomNavigation,
    },
    props: { default: route => ({ v: route.query['v'] }) },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/price-report',
    name: 'PriceReport',
    components: {
      default: () => import('../views/PriceReport.vue'),
      pageFooter: BottomNavigation,
    },
    props: { default: route => ({ v: route.query['v'] }) },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/address',
    name: 'Address',
    components: {
      default: () => import('../views/Address.vue'),
      pageFooter: BottomNavigation,
    },
    props: { default: route => ({ v: route.query['v'] }) },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/invoice',
    name: 'Invoice',
    components: {
      default: () => import('../views/Invoice.vue'),
      pageFooter: BottomNavigation,
    },
    props: { default: route => ({ v: route.query['v'] }) },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/notification-center',
    name: 'NotificationCenter',
    components: {
      default: () => import('../views/NotificationCenter.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/wish',
    name: 'Wish',
    components: {
      default: () => import('../views/Wish.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/frequently-asked-questions',
    name: 'FrequentlyAskedQuestions',
    components: {
      default: () => import('../views/FrequentlyAskedQuestions.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/terms-and-policy',
    name: 'TermsAndPolicy',
    components: {
      default: () => import('../views/TermsAndPolicy.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    components: {
      default: () => import('../views/ContactUs.vue'),
      pageFooter: BottomNavigation,
    },
  },
  // },
  // {
  //   path: '/vip',
  //   name: 'Vip',
  //   component: () => import('../views/ProductList.vue'),
  // },
  {
    path: '/rebate',
    name: 'Rebate',
    components: {
      default: () => import('../views/Rebate.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/price-match',
    name: 'PriceMatch',
    components: {
      default: () => import('../views/PriceMatch.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/member-centre',
    name: 'MemberCentre',
    components: {
      default: () => import('../views/MemberCentre.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/1111',
    name: '1111',
    components: {
      default: () => import('../views/1111.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/all',
    name: 'all',
    components: {
      default: () => import('../views/All.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/check-in',
    name: 'CheckIn',
    components: {
      default: CheckIn,
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/share',
    name: 'Share',
    components: {
      default: () => import('../views/Share.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/faq',
    name: 'FAQ',
    components: {
      default: () => import('../views/FAQ.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/ActivityOverview',
    name: 'ActivityOverview',
    components: {
      default: () => import('../views/ActivityOverview.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/faq/:faqCategoryId',
    name: 'FaqDetail',
    components: {
      default: () => import('../views/FAQ.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: route => ({
        faqCategoryId: route.params['faqCategoryId'],
        defaultQ: route.query['qid'],
      }),
    },
  },
  {
    path: '/event/2022214',
    name: 'Event2022214',
    component: () => import('../views/PrizeWheel.vue'),
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/cart',
    name: 'Cart',
    components: {
      default: () => import('../views/Cart.vue'),
    },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    components: {
      default: () => import('../views/Checkout.vue'),
    },
    props: {
      default: true,
    },
  },
  {
    path: '/private-checkout/:privateCheckoutId',
    name: 'PrivateCheckout',
    components: {
      default: () => import('../views/Checkout.vue'),
    },
    props: {
      default: true,
    },
  },
  {
    path: '/checkout-result/:checkoutId',
    name: 'CheckoutResult',
    components: {
      default: () => import('../views/CheckoutResult.vue'),
    },
    props: {
      default: true,
    },
  },
  {
    path: '/checkout/:checkoutId/verification/:transactionId',
    name: 'CheckouVerification',
    components: {
      default: () => import('../views/CheckouVerification.vue'),
    },
    props: {
      default: true,
    },
  },
  {
    path: '/prize-wheel/:id',
    name: 'PrizeWheel',
    components: {
      default: () => import('../views/PrizeWheel.vue'),
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
    props: {
      default: true,
    },
  },
  {
    path: '/prize-wheel-redesign/:id/checkout/:ckeckoutId',
    name: 'PrizeWheelForCheckoutRedesign',
    components: {
      default: () => import('../views/PrizeWheelForCheckoutRedesign.vue'),
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
    props: {
      default: true,
    },
  },
  {
    path: '/prize-wheel/:id/checkout/:ckeckoutId',
    name: 'PrizeWheelForCheckout',
    components: {
      default: () => import('../views/PrizeWheelForCheckout.vue'),
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
    props: {
      default: true,
    },
  },
  {
    path: '/activity-quiz',
    name: 'ActivityQuiz',
    components: {
      default: () => import('../views/ActivityQuizV2.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/activity-scratch/:id',
    name: 'ActivityScratch',
    components: {
      default: () => import('../views/ActivityScratch.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
    props: {
      default: true,
    },
  },
  {
    path: '/my-invoice',
    name: 'MyInvoice',
    components: {
      default: () => import('../views/MyInvoice.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/my-oppoint',
    name: 'MyOpenpoint',
    components: {
      default: () => import('../views/MyOpenpoint.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/my-sale-notice',
    name: 'MySaleNotice',
    components: {
      default: () => import('../views/MySaleNotice.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/my-follow',
    name: 'MyFollow',
    components: {
      default: () => import('../views/MyFollow.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/my-wish',
    name: 'MyWish',
    components: {
      default: () => import('../views/MyWish.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/my-recommend',
    name: 'MyRecommend',
    components: {
      default: () => import('../views/MyRecommend.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/reward',
    name: 'Reward',
    components: {
      default: () => import('../views/Reward.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/cart_group/:groupId',
    name: 'CartGroup',
    components: {
      default: () => import('../views/CartGroup.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/relevance/:productId',
    name: 'Relevance',
    components: {
      default: () => import('../views/Relevance.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/brand-group/:groupId',
    name: 'BrandGroup',
    components: {
      default: () => import('../views/BrandGroup.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/brand-group',
    name: 'BrandGroupList',
    components: {
      default: () => import('../views/BrandGroupList.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/brand-flagship-hall',
    name: 'BrandFlagshipHall',
    components: {
      default: () => import('../views/BrandFlagshipHall.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/scratch',
    name: 'Scratch',
    components: {
      default: () => import('../views/Scratch.vue'),
      pageFooter: BottomNavigation,
    },
  },
  {
    path: '/group-buy',
    name: 'GroupBuy',
    components: {
      default: () => import('../views/GroupBuy.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/group-buy-form',
    name: 'GroupBuyForm',
    components: {
      default: () => import('../views/GroupBuyForm.vue'),
      pageFooter: BottomNavigation,
    },
    meta: {
      requireAuth: true,
      requireVerified: true,
    },
  },
  {
    path: '/picks',
    name: 'Picks',
    components: {
      default: () => import('../views/Picks.vue'),
      pageFooter: BottomNavigation,
    },
  },
  // {
  //   path: '/personalized-picks/:bannerId',
  //   name: 'PersonalizedPicks',
  //   components: {
  //     default: () => import('../views/PersonalizedPicks.vue'),
  //     pageFooter: BottomNavigation,
  //   },
  //   props: {
  //     default: true,
  //   },
  //   meta: {
  //     keepAlive: true,
  //   },
  // },
  {
    path: '/flash-sale',
    name: 'FlashSale',
    components: {
      default: () => import('../views/FlashSale.vue'),
      pageFooter: BottomNavigation,
    },
    props: {
      default: true,
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/de-order-files',
    name: 'DeOrderFiles',
    component: () => import('../views/DeOrderFiles.vue'),
    meta: {
      // requiresAuth: true,
      keepAlive: false,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.VITE_BASE_URL || '/',
  behavior: 'smooth',
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

router.beforeEach(authGuard)

router.afterEach(() => store.commit('setPageLoading', false))

router.onError(function (error) {
  if (error.name === 'ChunkLoadError') {
    router.app.$dialog
      .show('網頁將進行更新以獲取新版本', { title: '需要更新' })
      .then(() => (window.location.href = '/'))
  }
})

export default router
