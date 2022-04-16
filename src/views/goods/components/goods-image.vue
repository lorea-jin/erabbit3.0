/** 商品图片组件 */
<template>
  <div class="goods-image">
    <div class="large" :style="[{backgroundImage:`url(${images[activeIndex]})`},largePostion]"
      v-show="show">
    </div>
    <div class="middle" ref="target">
      <div class="layer" v-show="show" :style="layerPostion"></div>
      <img :src="images[activeIndex]" alt="">
    </div>
    <ul class="small">
      <li v-for="(img,i) in images" :key="i+'img'" @mouseenter="activeIndex=i"
        :class="{active:i===activeIndex}">
        <img :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'

export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    let activeIndex = ref(0)
    const show = ref(true)
    // 1.遮罩层坐标
    const layerPostion = reactive({
      left: 0,
      top: 0
    })

    // 2.大图背景坐标
    const largePostion = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })



    // 3.拿到动态坐标赋值上两个对象
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    watch([elementX, elementY, isOutside],
      () => {
        // console.log(elementX.value, elementY.value, isOutside.value)
        show.value = !isOutside.value
        const obj = { x: 0, y: 0 }

        // 100-300才有效，100/400 不移动
        if (elementX.value <= 100) obj.x = 0
        else if (elementX.value >= 300) obj.x = 200
        else obj.x = elementX.value - 100 // 因为大于100部分才移动，所以减去100，可能再120对的地方 实际上才移动了20px

        if (elementY.value <= 100) obj.y = 0
        else if (elementY.value >= 300) obj.y = 200
        else obj.y = elementY.value - 100

        layerPostion.left = obj.x + 'px'
        layerPostion.top = obj.y + 'px'
        largePostion.backgroundPositionX = -2 * obj.x + 'px'
        largePostion.backgroundPositionY = -2 * obj.y + 'px'

      })


    return { activeIndex, show, layerPostion, largePostion, target }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>