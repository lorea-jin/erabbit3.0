<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}
        </XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}
        </XtxBreadItem>
        <XtxBreadItem>{{goods.name}}</XtxBreadItem>
      </XtxBread>

      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 名字区组件 ,城市组件-->
          <GoodsName :goods="goods" />
          <!-- 规格组件 -->
          <GoodsSku :goods="goods" @change="changeSku" />

          <XtxNumbox v-model="num" :max="goods.inventory" label="数量" />

          <XtxButton @click="insertCart()" type="primary" style="margin-top:20px">加入购物车</XtxButton>
        </div>
      </div>

      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />

      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1" />
          <GoodsHot :goodsId="goods.id" :type="2" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { findGoods } from '../api/index.js'
import GoodsRelevant from '../components/goods-relevant'
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsImage from '../components/goods-image'
import GoodsSales from '../components/goods-sales.vue'
import GoodsName from '../components/goods-name.vue'
import GoodsSku from '../components/goods-sku.vue'
import GoodsTabs from '../components/goods-tabs.vue'
import GoodsHot from '../components/goods-hot.vue'
import GoodsWarn from '../components/goods-warn.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/Message.js'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    const num = ref(1)
    const goods = useGoods()

    // 选择不同sku时触发的函数
    const changeSku = (obj) => {
      console.log(obj)
      goods.value.price = obj.price
      goods.value.oldPrice = obj.oldPrice
      goods.value.inventory = obj.inventory
      currSku.value = obj//拿到选择后的sku信息
    }
    provide('goods', goods)

    // 2.加入购物车按钮
    const currSku = ref(null)
    const store = useStore()
    const insertCart = () => {
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(() => {
          Message({ type: 'success', text: '添加购物车成功' })
        })
      } else {
        Message({ type: 'warn', text: '请选择商品规格' })
      }
    }

    return { goods, changeSku, num, insertCart }
  }
}

const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newValue) => {
    if (!newValue || `/goods/${newValue}` !== route.path) return
    findGoods(route.params.id).then(res => {
      goods.value = null// 目的是更新组件
      nextTick(() => {
        goods.value = res.result
      })

    })
  }, { immediate: true })

  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>