/** 面包屑组件item */
<template>
  <div class="xtx-bread-item">
    <RouterLink :to="to" v-if="to">
      <slot />
    </RouterLink>
    <span v-else>
      <slot />
    </span>
    <!-- <i class="iconfont icon-angle-right"></i> -->
  </div>

</template>

<script>
export default {
  name: 'XtxBreadItem',
  components: {},
  props: {
    to: {
      type: [Object, String],
      defualt: ''
    }
  },
  setup () { }
}
</script>

<style scoped lang='less'>
</style>
