import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart } from '@/views/cart/api/index.js'
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

    // 1.加购添加 购物车 goods是商品信息
    insertCart (state, goods) {
      // 根据skuid找是否有相同，有则删除原先再累加，无则直接添加
      const index = state.list.findIndex(item => item.skuId === goods.skuId)
      if (index > -1) {//找到了
        state.list.splice(index, 1)
        goods.count = state.list[index].count + goods.count

      }
      state.list.unshift(goods)
    },

    // 3.更新购物车,修改购物车信息 goods中必有skuId,+其他要改变的属性
    updateCart (state, goods) {
      //但其他信息可能不完整，有数据的修改就行了
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
    },

    // 11.设置购物车列表
    setCartList (state, list) {
      state.list = list
    }

  },
  actions: {
    // 组件中触发actions有2种情况：登陆了（异步请求）；没登陆（本地同步）
    insertCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          insertCart(goods).then(() => {
            // 调接口拉取最新购物车 拿到最新lst，再插入
            return findCartList()
          }).then(res => {
            ctx.commit('insertCart', res.result)
          })
          resolve()
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
          //  已登录
          findCartList().then(data => {
            ctx.commit('setCartList', data.result)
          })
          resolve()
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
          //  已登录
          deleteCart([skuId]).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },

    // 6.修改购物车商品信息详情
    updateCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登陆
          updateCart(goods).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    },

    // 7.全选的/取消全选的actions
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },

    // 8.批量删除选中商品
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },

    // 9.修改sku规格函数
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
          // 获取原先老的商品数量
          // 拿到修改后的skuId和原先商品数量 做插入
          // 更新
          const oldGoods = ctx.state.list.find(item => item.skuID === oldSkuId)
          // 删除老商品
          deleteCart([oldSkuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then(res => {
            ctx.commit('setCartList', res.result)
            resolve()
          })


        } else {
          // 本地
          // 1. 获取旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 2. 删除旧的商品
          ctx.commit('deleteCart', oldSkuId)
          // 3. 合并一条新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4. 去插入即可
          ctx.commit('insertCart', newGoods)

          resolve()
        }
      })
    },

    // 10.登陆后合并购物车action
    async mergeLocalCart (ctx) {
      const cartList = ctx.getters.validList.map(item => ({
        skuId: item.skuId,
        selected: item.selected,
        count: item.count
      }))
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
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
    },

    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => item.stock < 0 || item.isEffective === false)
    },

    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },

    // 选中商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((total, cur) => total + cur.count, 0)
    },

    // 选中商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((total, cur) => total + (cur.nowPrice * 100 * cur.count / 100), 0)
    },

    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  }
}