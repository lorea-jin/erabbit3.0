/**一级路由布局容器*/
<template>
  <AppTopnav />
  <AppHeader />
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <AppFooter />

</template>

<script>
import AppTopnav from '../components/app-topnav.vue'
import AppHeader from '../components/app-header.vue'
import AppFooter from '../components/app-footer.vue'
import { useStore } from 'vuex'

export default {
  name: 'layoutIndex',
  components: {
    AppTopnav, AppHeader, AppFooter
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang='less'>
</style>
