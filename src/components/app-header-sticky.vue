/** 吸附时的导航展示 */
<template>
  <div class="app-header-sticky" :class="{show:y>=78}">
    <div class=" container" v-show="y>=78">
      <RouterLink class="logo" to="/" />
      <AppHeaderNav />
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeaderNav from './app-header-nav.vue'
import { ref, onMounted } from 'vue'
export default {
  name: 'AppHeaderSticky',
  components: { AppHeaderNav },
  setup () {
    // 卷曲y高度＞=78的时候 加上show的类
    const y = ref(0)

    onMounted(() => {
      window.addEventListener('scroll', () => {
        y.value = document.documentElement.scrollTop
        // console.log(y)
      })
    })

    return { y }
  }
}
</script>

<style scoped lang='less'>
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  transform: translateY(-100%);
  opacity: 0;
  &.show {
    opacity: 1;
    transition: all 0.5s;
    transform: none;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
