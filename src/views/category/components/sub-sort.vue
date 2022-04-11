<template>
  <div class='sub-sort'>
    <div class="sort">
      <span v-for="item in choose" :key="item.id+'choose'" @click="ChangeAvticeSort(item.sort)"
        :class="{active:item.sort===sortParams.sortField&&item.sort!=='price'}">
        {{item.name}}
        <template v-if="item.sort==='price'">
          <i class="arrow up"
            :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod=='asc'}" />
          <i class="arrow down"
            :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod=='desc'}" />
        </template>
      </span>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from 'vue'
export default {
  name: 'SubSort',
  components: {},
  setup (props, { emit }) {
    const choose = ref([
      {
        name: '默认排序',
        sort: null,
        id: 1
      },
      {
        name: '最新商品',
        sort: 'publishTime',
        id: 2
      }, {
        name: '最高人气',
        sort: 'orderNum',
        id: 3
      }, {
        name: '评论最多',
        sort: 'evaluateNum',
        id: 4
      }, {
        name: '价格排序',
        sort: 'price',
        id: 5
      }
    ])

    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null, // 筛选方式
      sortMethod: null // asc为正序 desc为倒序
    })
    const ChangeAvticeSort = (sortway) => {
      if (sortway === 'price') {
        if (sortParams.sortMethod === null) {
          // 第一次点击，默认是降序
          sortParams.sortMethod = 'desc'
        } else {
          // 其他情况根据当前排序取反
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        if (sortParams.sortField === sortway) return
        sortParams.sortMethod = null
      }
      sortParams.sortField = sortway

      emit('sort-change', sortParams)
    }

    const changeCheck = () => {
      console.log('change')
      emit('sort-change', sortParams)
    }
    return { choose, ChangeAvticeSort, sortParams, changeCheck }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    span {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &:hover {
        cursor: pointer;
      }
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>