<template>
  <!-- 筛选区 -->
  <div class="sub-filter " v-if="subFilter">

    <div class="item" v-if="subFilter.brands.length>0">
      <div class="head">品牌：</div>
      <div class="body">
        <span v-for="brand in subFilter.brands" :key="brand.id"
          :class="{active:subFilter.selectedBrand===brand.id}"
          @click="subFilter.selectedBrand=brand.id">{{brand.name}}</span>
      </div>
    </div>

    <div class="item" v-for="p in subFilter.saleProperties" :key="p.id">
      <div class="head">{{p.name}}：</div>
      <div class="body">
        <span v-for="attr in p.properties" :key="attr.id"
          :class="{active:p.selectedProperty===attr.id}"
          @click="p.selectedProperty=attr.id">{{attr.name}}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { findSubCategoryFilter } from '../api/index'
import { useRoute } from 'vue-router'
export default {
  name: 'SubFilter',
  setup () {
    const route = useRoute()
    const subFilter = ref(null)

    const getFilter = () => {
      findSubCategoryFilter(route.params.id).then(({ result }) => {

        // 1.自己添加品牌属性 ，选项值值使用brands，brands自己添加全部
        // 2.其他筛选属性使用saleProperties，选项值自己添加全部
        result.selectedBrand = null// 选中的品牌
        result.brands.length > 0 && result.brands.unshift({ id: null, name: '全部' })
        result.saleProperties.length > 0 && result.saleProperties.forEach(item => {
          item.selectedProperty = null // 每个筛选 默认选中全部
          item.properties.unshift({ id: null, name: '全部' })
        })

        subFilter.value = result
      })
    }

    watch(() => route.params.id, (newVal) => {
      if (!newVal || route.fullPath.indexOf('/sub') === -1) return
      getFilter()
    }, { immediate: true })

    return {
      subFilter
    }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      span {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          cursor: pointer;
          color: @xtxColor;
        }
      }
    }
  }
}
</style>