/**一级路由布局容器*/
<template>
  <nav></nav>
  <header></header>
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <footer></footer>

</template>

<script>
export default {
  name: 'xtx-layout',
  setup () { }
}
</script>

<style scoped lang='scss'>
</style>
