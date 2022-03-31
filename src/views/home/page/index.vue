/**二级路由首页*/
<template>
  <div class='container'>

    <!-- 左侧分类 -->
    <HomeCategory />
  </div>
</template>

<script>
import HomeCategory from '../components/home-category.vue'
export default {
  name: 'PageHome',
  components: {
    HomeCategory
  },
  setup () { }
}
</script>

<style scoped lang='less'>
</style>
