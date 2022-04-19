<template>
  <div class="goods-sku">
    <dl v-for="(item,index) in goods.specs" :key="index+'specs'">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="(btn,i2) in item.values" :key="i2+'btn'">
          <img v-if="btn.picture" :src="btn.picture" alt="btn.name"
            :class="{selected:btn.selected,disabled:btn.disabled}" @click="clickSpecs(item,btn)">
          <span v-else @click="clickSpecs(item,btn)"
            :class="{selected:btn.selected,disabled:btn.disabled}">{{btn.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
const spliter = '★'
import getPowerSet from '@/vendor/power-set'
const getPathMap = (skus) => {
  // 2.1 目标格式：每个skus下的specs数组中的valueName提取成：['红色','M']  
  const dictionary = {}
  skus.forEach(sku => {
    if (sku.inventory) {
      const skuArr = sku.specs.map(obj => obj.valueName)
      // powerSet是幂集算法后的结果 数组  [[红色],[M],[红色,M]...]      
      getPowerSet(skuArr).forEach(arr => {
        const key = arr.join(spliter)
        // 2.2 设置给路径字典对象，把数组下的每个小数组拼接成字符串作为key，把skuId作为value  
        dictionary[key] ? dictionary[key].push(sku.id) : dictionary[key] = [sku.id]
      }
      )
    }

  })
  return dictionary
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => { }
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {

    // 初始化选中的SKU
    const initSelectedStatus = (goods, skuId) => {
      const targetSku = goods.skus.find(sku => sku.id == skuId)
      // specs中的每个btn找到 添加selected属性
      if (targetSku) {
        targetSku.specs.forEach(s => {
          goods.specs.forEach(spec => {
            const re = spec.values.find(btn => btn.name == s.valueName)
            re ? re.selected = true : null
          })
        })
      }

    }

    initSelectedStatus(props.goods, props.skuId)
    // goods.specs 里面每个obj都是一个规格属性，obj.values是次规格下的可选项
    // 1.按钮点击事件 效果：点击选中，点击取消。点击别的本按钮取消选中
    const clickSpecs = (specsObj, btnObj) => {
      // btnObj是点击的那个具体按钮信息（红色）。specsObj是这一行的规格信息{颜色，valuse：[]}
      // 点击的那一项btn添加selected属性
      if (btnObj.disabled) return
      if (btnObj.selected) {
        btnObj.selected = false
      } else {
        specsObj.values.forEach(item => {
          item.selected = false
        })
        btnObj.selected = true
      }
      updateDisabledStatus(props.goods.specs, pathMap)

      // 点击的时候获取当前规格数组，判断是否点全，点全了emit父组件信息
      const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)//去掉undefined
      if (selectedArr.length === props.goods.specs.length) {
        // 点全了（只有一条sku可能），拿到当前key找到skus里面的一条 传信息
        const key = selectedArr.join(spliter)
        const skuIds = pathMap[key]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        // sku就是全选的那一条sku信息 包括库存，价格等
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((acc, cur) => `${acc} ${cur.name}:${cur.valueName}`, '') //sku.specs数组下详细规格内容的拼接
        })
      } else {
        // 没点全,传空对象
        emit('change', {})
      }
    }

    // 2.拿到有效路径字典
    const pathMap = getPathMap(props.goods.skus)
    console.log(pathMap)


    // 3.拿到点击的每个规格名字 selectedArr:[红色,undefined] 都是已经选择的属性名字
    const getSelectedArr = (specs) => {
      // 一行里就拿被点击的那个，都没有就undefined占位
      const selectedArr = []
      specs.forEach(obj => {//
        const targetBtn = obj.values.find(btn => btn.selected)
        targetBtn ? selectedArr.push(targetBtn.name) : selectedArr.push(undefined)
      })
      return selectedArr
    }


    // 4 更新按钮状态的函数 触发时机：初始化 或者 点击按钮
    const updateDisabledStatus = (specs, pathMap) => {
      // 约定每个按钮的能否点击的状态由 【disabled属性】来决定
      // a.循环规则属性下的每个按钮，如果已经选择 则忽略 
      // b.满足要求的每一个都依次放入对比数组selectedArr中 按照顺序 
      // c.剔除undefined的 [红色，M，undefined]==> [红色，M] 再拼接成key
      // d. 根据key去字典里查询 是否存在。

      specs.forEach((item, i) => {
        const selectedArr = getSelectedArr(specs)
        item.values.forEach(btn => {
          if (btn.selected) return
          selectedArr[i] = btn.name
          const key = selectedArr.filter(item => item).join(spliter)
          btn.disabled = !pathMap[key]
        })
      })

    }
    // 4.1 组件初始化的时候更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)



    return { clickSpecs }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>