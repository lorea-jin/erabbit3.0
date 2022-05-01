<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{goodsId?'同类商品推荐':'猜你喜欢'}}</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
    <XtxCarousel :slider="sliders" />
  </div>
</template>

<script>
import { findRelGoods } from '../api/index.js'
import { ref } from 'vue'
export default {
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: [String, Number],
      default: undefined
    }
  },
  setup (props) {
    // 1.获取轮播图数据  [[4条数据],[],[],[]]
    const sliders = ref([])
    const useRelGoodsData = (id) => {
      findRelGoods(id).then(res => {
        // console.log(res.result)
        const size = 4 // 每页4条
        const total = Math.ceil(res.result.length / 4) //循环次数
        for (let i = 0; i < total; i++) {
          // 截取 0-4条数据
          const start = i * size
          const end = (i + 1) * size
          sliders.value.push(res.result.slice(start, end))
        }

      })
    }

    useRelGoodsData(props.goodsId)
    return { sliders }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}

.xtx-carousel {
  height: 380px;
}
</style>