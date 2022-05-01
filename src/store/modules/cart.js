import { getNewCartGoods } from '@/views/cart/api/index.js'
// 购物车状态
export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  // 本地：id(商品id)、name picture price 、nowPrice count
  // skuId、attrsText 、stock 、selected 、isEffective
  // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
  mutations: {

    // 1.添加购物车 paylog是商品信息
    insertCart (state, goods) {
      // 根据skuid找是否有相同，有则删除原先再累加，无则直接添加
      const index = state.list.findIndex(item => item.skuId === goods.skuId)
      if (index > -1) {//找到了
        state.list.splice(index, 1)
        goods.count = state.list[index].count + goods.count

      }
      state.list.unshift(goods)
    },

    // 3.更新购物车,修改购物车信息
    updateCart (state, goods) {
      //goods中必有skuId，但其他信息可能不完整，有数据的修改就行了
      const currGood = state.list.find(item => item.skuId === goods.skuId)
      for (let k in goods) {
        //排除goods中值不正常的，其余赋值给当前选中商品对象
        if (goods[k] === undefined || goods[k] === null || goods[k] === '') return
        currGood[k] = goods[k]
      }
    },

    // 5.删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }

  },
  actions: {
    // 组件中触发actions有2种情况：登陆了（异步请求）；没登陆（本地同步）
    insertCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // TODO 已登录
        } else {
          // 未登录
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },

    // 2.获取最新购物车信息
    findCartList (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // TODO 已登录

        } else {
          // 未登录
          // api：getNewCartGoods 一次只能拿一个商品信息
          const promiseArr = ctx.state.list.map(item => getNewCartGoods(item.skuId)) // arr中是每个promise 的汇总
          Promise.all(promiseArr).then(dataArr => {
            dataArr.forEach((obj, i) => {
              ctx.commit('updateCart', { ...obj.result, skuId: ctx.state.list[i].skuId })
            })
            resolve()
          })


        }
      })
    },

    // 4.删除购物车actions
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // TODO 已登录

        } else {
          // 未登录
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    }

  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },

    // 有效商品件数
    validTotal (state, getters) {
      return getters.validList.reduce((total, cur) => total + cur.count, 0)
    },

    // 有效商品总价
    validAmount (state, getters) {
      return getters.validList.reduce((total, cur) => total + cur.price * cur.count, 0)
    }
  }
}
