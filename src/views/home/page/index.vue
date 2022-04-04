/**二级路由首页*/
<template>
  <div class="home-entry">
    <div class='container'>
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 右侧轮播图 -->
      <HomeBanner />
    </div>

    <NewAndHot />

    <!-- 热门品牌 -->
    <HomeBrand />

    <HomeProduct />

  </div>

</template>

<script>
import HomeCategory from '../components/home-category.vue'
import HomeBanner from '../components/home-banner.vue'
import NewAndHot from '../components/home-NewAndHot.vue'
import HomeBrand from '../components/home-brand.vue'
import HomeProduct from '../components/home-product.vue'
export default {
  name: 'PageHome',
  components: {
    HomeCategory, HomeBanner, NewAndHot, HomeBrand, HomeProduct
  },
  setup () { }
}
</script>

<style scoped lang='less'>
</style>
