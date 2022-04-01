/**二级路由首页*/
<template>
  <div class="home-entry">
    <div class='container'>
      <!-- 左侧分类 -->
      <HomeCategory />

      <!-- 右侧轮播图 -->
      <HomeBanner />
    </div>
  </div>

</template>

<script>
import HomeCategory from '../components/home-category.vue'
import HomeBanner from '../components/home-banner.vue'

export default {
  name: 'PageHome',
  components: {
    HomeCategory, HomeBanner
  },
  setup () { }
}
</script>

<style scoped lang='less'>
</style>
