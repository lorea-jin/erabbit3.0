<template>
  <div class="goods-tabs">
    <nav>
      <a href="javascript:;" @click="toggle('GoodsDetail')"
        :class="{active:activeTab==='GoodsDetail'}">
        商品详情
      </a>
      <a href=" javascript:" @click="toggle('GoodsComment')"
        :class="{active:activeTab==='GoodsComment'}">
        商品评价<span>(0+)</span>
      </a>
    </nav>
    <!-- 切换内容的地方 -->
    <component :is="activeTab"></component>
  </div>
</template>

<script>
import GoodsDetail from './goods-detail'
import GoodsComment from './goods-comment'
import { ref } from 'vue'

export default {
  name: 'GoodsTabs',
  components: { GoodsDetail, GoodsComment },
  props: {},
  setup () {
    // GoodsDetail-->详情   GoodsComment-->评价
    const activeTab = ref('GoodsDetail')
    const toggle = (name) => {
      activeTab.value = name
    }




    return { toggle, activeTab }
  }
}
</script>

<style scoped lang='less'>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
