// 用户模块 包括用户头像，名字 token等
export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  },
  mutations: {
    // 修改用户信息
    setUser (state, paylod) {
      state.profile = paylod
    }
  },
  actions: {},
  getters: {}
}
