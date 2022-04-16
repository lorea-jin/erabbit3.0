<template>
  <div class="container ">
    <!-- 二级的面包屑 -->
    <SubBread />
    <!-- 筛选区 -->
    <SubFilter @filter-change="filterList" />
    <!-- 展示区 -->
    <div class="goods-list">
      <SubSort @sort-change="sortList" />
      <ul>
        <li v-for="item in list" :key="item.id">
          <GoodsItem :goods="item" />
        </li>
      </ul>
      <XtxInfiniteLoading @onload="getList" :loading="loading" :finished="finished" />
    </div>

  </div>
</template>

<script>
import { ref, watch } from 'vue'
import SubBread from '../components/sub-bread.vue'
import SubFilter from '../components/sub-filter.vue'
import SubSort from '../components/sub-sort.vue'
import GoodsItem from '../components/goods-item.vue'
import { findSubCategoryGoods } from '../api/index.js'
import { useRoute } from 'vue-router'
export default {
  name: 'subCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const list = ref([])
    let params = {
      page: 1,
      pageSize: 20,
      categoryId: route.params.id
    }

    // 1.获取列表
    const getList = () => {
      loading.value = true
      findSubCategoryGoods(params).then(res => {
        if (res.result.items.length > 0) {
          list.value.push(...res.result.items)
          params.page++
        } else {
          finished.value = true
        }
      })
      loading.value = false
    }

    // 2.切换二级分类重新加载
    watch(() => route.params.id, (newValue) => {
      if (!newValue || route.fullPath.indexOf('/sub') === -1) return
      // 重新加载：页面重置+list清空,loading设置
      loading.value = false
      finished.value = false
      params.page = 1
      params.categoryId = newValue
      list.value = []
    }, { immediate: true })

    // 3.切换排序条件重新加载
    const sortList = (sortParams) => {
      params = { ...params, ...sortParams }
      params.page = 1
      loading.value = false
      finished.value = false
      list.value = []
    }

    // 4.切换筛选区重新加载
    const filterList = (filterParams) => {
      loading.value = false
      finished.value = false
      params = { ...params, ...filterParams }
      params.page = 1
      list.value = []
    }
    return { loading, finished, getList, list, sortList, filterList }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
