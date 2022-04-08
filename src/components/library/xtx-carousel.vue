<template>
  <div class='xtx-carousel' @mouseenter="end" @mouseleave="start">
    <ul class="carousel-body">
      <li v-for="(item,index) in slider" :key="item.id" class="carousel-item"
        :class="{show:index===ActiveIndex}">
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"
        @click="changeIndex(-1)"></i></a>
    <a href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"
        @click="changeIndex(1)"></i></a>
    <div class="carousel-indicator">
      <span v-for="(dot,i) in slider" :key="i+'dot'" :class="{active:i===ActiveIndex}"
        @click="chagneDot(i)"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  components: {},
  props: {
    slider: {
      type: Array,
      default: () => []
    },
    duration: {
      type: Number,
      default: 3000
    },
    autoPlay: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    // 默认显示的图片索引
    const ActiveIndex = ref(0)

    // 1.前后图片切换
    const changeIndex = (index) => {
      let newIndex = ActiveIndex.value + index
      if (newIndex < 0) {
        newIndex = props.slider.length - 1
      } else if (newIndex > props.slider.length - 1) {
        newIndex = 0
      }
      ActiveIndex.value = newIndex
    }

    // 2.自动播放函数
    let timer = null
    const autoPlayFn = () => {
      timer = setInterval(() => {
        changeIndex(1)
      }, props.duration)
    }

    // 监听slider获取到数据的时候 自动播放
    watch(() => props.slider, () => {
      if (props.slider && props.autoPlay) {
        autoPlayFn()
      }
    })

    // 开始自动
    const start = () => {
      if (props.slider && props.autoPlay) {
        autoPlayFn()
      }
    }

    // 结束自动
    const end = () => {
      if (timer) {
        clearInterval(timer)
      }
    }

    // 3.切换圆点
    const chagneDot = (index) => {
      ActiveIndex.value = index
    }

    // 4.组件卸时销毁定时器
    onUnmounted(() => {
      clearInterval(timer)
    })

    return { ActiveIndex, changeIndex, autoPlayFn, start, end, chagneDot }
  }
}
</script>

<style scoped lang='less'>
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.show {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
