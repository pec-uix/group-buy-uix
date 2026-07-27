import store from '@/store'

const initialized = store.dispatch('initialize')

export default (to, from, next) => {
  window.previousUrl = from.path
  const requireAuth = to.matched.some(record => record.meta.requireAuth)
  const requireVerified = to.matched.some(record => record.meta.requireVerified)
  const requireProfile = to.matched.some(record => record.meta.requireProfile)
  store.commit('setPageLoading', true)
  initialized.then(() => {
    if (requireProfile) {
      if (
        store.state.profile &&
        store.state.profile.email &&
        store.state.profile.phone_number
      ) {
        next()
      } else {
        next({
          path: '/profile',
          query: { redirect: to.fullPath },
        })
      }
    } else if (requireVerified && !store.getters['isVerified']) {
      next({ path: '/login/auth', query: { redirect: to.fullPath } })
    } else if (requireAuth && !store.getters['isLogin']) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  })
}
