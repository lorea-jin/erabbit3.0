import { createStore } from 'vuex'
import user from './modules/user.js'
import cart from './modules/cart.js'
import category from './modules/category.js'

import createPersistedState from 'vuex-persistedstate'

// 2.0中是通过 new Vuex.Store({}) 来创建实例
export default createStore({
  state: {},
  mutations: {},
  actions: {
  },
  getters: {

  },
  modules: {
    user,
    cart,
    category
  },
  plugins: [createPersistedState({
    key: 'erabbit-client-pc-store',
    paths: ['user', 'cart']
  })]
})
