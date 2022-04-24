<template>
  <div class="xtx-pagination">
    <a v-if="myCurrentPage<=1" href="javascript:;" class="disabled">上一页</a>
    <a v-else href="javascript:;" @click="changePage(myCurrentPage-1)">上一页</a>

    <span v-if="pager.start>1">...</span>

    <a href="javascript:;" v-for="i in pager.btnArr" :key="i+'page'"
      :class="{active:i===myCurrentPage}" @click="changePage(i)">{{i}}</a>

    <span v-if="pager.end<pager.pageCount">...</span>

    <a v-if="myCurrentPage>=pager.pageCount" href="javascript:;" class="disabled">下一页</a>
    <a v-else href="javascript:;" @click="changePage(myCurrentPage+1)">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {

    const myCurrentPage = ref(5)
    const myPageSize = ref(10)
    const myTotal = ref(100)
    const btnCount = 5 // 按钮个数

    // 1.依赖上述4个参数 得到(起始页码start，结束页码end，有几条，按钮数组)
    // 总公式：btnCount=end-start+1

    const pager = computed(() => {
      const pageCount = Math.ceil(myTotal.value / myPageSize.value) //总页数

      // 1.1 数组开始页码= 当前按钮个数/2 向下取整，前面放一半
      let start = myCurrentPage.value - Math.floor(btnCount / 2)

      let end = btnCount + start - 1 // 按照总公式变化

      // 1.2处理start和end特殊情况  且另一边是否超过按钮个数/第一页
      if (start < 1) {
        start = 1
        end = (btnCount + start - 1) > pageCount ? pageCount : (btnCount + start - 1)
      }

      if (end > pageCount) {
        end = pageCount
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }

      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, btnArr, end, start }
    })

    // 2.切换页码
    const changePage = (newPage) => {
      myCurrentPage.value = newPage
      // 通知父组件最新页码
      emit('current-change', newPage)
    }

    // 3.监听依赖变化，变化复制给附件内的变量
    watch(props, () => {
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
      myTotal.value = props.total
    }, { immediate: true })


    return { pager, myCurrentPage, changePage }
  },
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>