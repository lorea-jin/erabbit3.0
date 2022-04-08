/** 面包屑组件 */

<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  components: {},
  props: {},
  render () {
    // 判断是否为最后一个item，若不是则动态加上i标签
    const dynamicArr = []
    const items = this.$slots.default()
    items.forEach((item, i) => {
      dynamicArr.push(item)
      if (i < items.length - 1) {
        dynamicArr.push(
          h('i', { class: 'iconfont icon-angle-right' })
        )
      }
    })
    return h('div', { class: 'xtx-bread' }, dynamicArr)
  }
}
</script>

<style  lang='less'>
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 样式的方式，不合理
    // &:last-child {
    //   display: none;
    // }
  }
}
</style>
