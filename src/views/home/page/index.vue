/**二级路由首页*/
<template>
  <div class="home-entry">
    <div class='container'>
      <!-- 左侧分类 -->
      <HomeCategory />

      <!-- 右侧轮播图 -->
      <HomeBanner />

      <NewAndHot />
    </div>
  </div>

</template>

<script>
import HomeCategory from '../components/home-category.vue'
import HomeBanner from '../components/home-banner.vue'
import NewAndHot from '../components/home-NewAndHot.vue'

export default {
  name: 'PageHome',
  components: {
    HomeCategory, HomeBanner, NewAndHot
  },
  setup () { }
}
</script>

<style scoped lang='less'>
</style>
