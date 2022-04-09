<template>
  <div class="container ">
    <!-- 二级的面包屑 -->
    <SubBread />
    <!-- 筛选区 -->
    <SubFilter />
    <!-- 展示区 -->
    <XtxCheckbox v-model="isChecked">仅显示有货商品</XtxCheckbox>

  </div>
</template>

<script>
import { ref } from 'vue'
import SubBread from '../components/sub-bread.vue'
import SubFilter from '../components/sub-filter.vue'
export default {
  name: '',
  components: { SubBread, SubFilter },
  setup () {
    const isChecked = ref(false)
    return { isChecked }
  }
}
</script>

<style scoped lang='less'>
</style>
