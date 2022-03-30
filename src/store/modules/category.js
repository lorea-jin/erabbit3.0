import { topCategory } from '@/api/constants.js'
import { findAllCategory } from '@/views/home/api/category'

// 分类模块
export default {
  namespaced: true,
  state () {
    return {
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, paylod) {
      state.list = paylod
    },
    show (state, id) {
      const currentCate = state.list.find(item => item.id === id)
      currentCate.open = true
    },
    hide (state, id) {
      const currentCate = state.list.find(item => item.id === id)
      currentCate.open = false
    }
  },
  actions: {
    async getList (ctx) {
      const { result } = await findAllCategory()
      // 给数据加个控制显隐的参数
      result.forEach(top => {
        top.open = false
      })
      ctx.commit('setList', result)
    }
  },
  getters: {}
}
