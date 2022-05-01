<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="!goods"></div>
      <!-- 规格 -->
      <GoodsSku v-if="goods" @change="changeSku" :skuId="skuId" :goods="goods" />
      <XtxButton v-if="goods" type="primary" size="mini" style="margin-left:60px" @click="submit">确认
      </XtxButton>
    </div>
  </div>
</template>
<script>
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { getSpecsAndSkus } from '../api/index'
export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const goods = ref(null) //规格列表
    const visible = ref(false)
    const show = () => {
      visible.value = true
      // 打开的时候根据skuId拿到渲染的规格
      getSpecsAndSkus(props.skuId).then(res => {
        goods.value = res.result
      })
    }
    const hide = () => {
      visible.value = false
      goods.value = null
    }

    const toggle = () => {
      visible.value ? hide() : show()
    }

    const target = ref(null)
    onClickOutside(target, () => {
      hide()
    })

    // 获取修改后的sku
    const currSku = ref(null)
    const changeSku = (skuId) => {
      currSku.value = skuId
    }
    // 点击确认的时候，提交更改后的sku信息给父组件(购物车组件)
    const submit = () => {
      // 排除sku没选择完整的情况 或者 选择后和之前一样
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('comfirmSubmit', currSku.value)
      }
      hide()
    }

    return { visible, show, hide, toggle, target, goods, changeSku, currSku, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>