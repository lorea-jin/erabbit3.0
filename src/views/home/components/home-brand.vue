<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a @click="toggle(-1)" href="javascript:;" class="iconfont icon-angle-left prev"></a>
      <a @click="toggle(1)" href="javascript:;" class="iconfont icon-angle-right next"></a>
    </template>

    <div class="box" ref="box">
      <ul v-if="brands.length" class="list" :style="{transform:`translateX(-${index*1240}px)`}">
        <li v-for="item in brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
          </RouterLink>
        </li>
      </ul>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { findBrand } from '../api/category'
import HomePanel from './home-panel.vue'
export default {
  name: '',
  components: { HomePanel },
  props: {},
  setup () {
    // 获取数据
    const brands = ref([])
    findBrand(10).then(data => {
      brands.value = data.result
    })

    // 切换页码
    const index = ref(0) // 开始的索引值
    const toggle = (step) => {
      console.log('active')
      const newIndex = step + index.value
      if (newIndex < 0 || newIndex > (brands.value.length / 5 - 1)) return
      index.value = newIndex
    }
    return { brands, toggle, index }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
