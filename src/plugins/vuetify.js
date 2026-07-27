import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'
import MyOrder from '@/components/icons/MyOrder.vue'
import Category from '@/components/icons/Category.vue'
import PromoCodeTicket from '@/components/icons/PromoCodeTicket.vue'
import { Scroll, Intersect } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  directives: {
    Scroll,
    Intersect,
  },
})

export default new Vuetify({
  breakpoint: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 600,
      sm: 1025,
      md: 1280,
      lg: 1920,
    },
    scrollBarWidth: 16,
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#CA1F1D',
        secondary: '#D86816',
        accent: '#5D5D5D',
        error: '#D86816',
        info: '#2196F3',
        success: '#0BBE6C',
        warning: '#D86816',
        anchor: colors.grey,
      },
    },
  },
  icons: {
    iconfont: 'md',
    values: {
      pec_my_order: {
        component: MyOrder,
      },
      pec_category: {
        component: Category,
      },
      pec_ticket: {
        component: PromoCodeTicket,
      },
    },
  },
})
