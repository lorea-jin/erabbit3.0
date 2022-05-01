<template>
  <div class="xtx-checkbox" @click="toggleChange">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <slot />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  name: 'XtxCheckbox',
  components: {},
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const checked = ref(false)
    // v-model  :modelValue   @update:modelValue
    // 监听数据，modelValue改变了就重新赋值给checked值
    watch(() => props.modelValue, (newValue) => {

      // if (!newValue) return
      checked.value = newValue
    }, { immediate: true })

    // 监听change事件，如果变化了告知父组件
    const toggleChange = () => {
      checked.value = !checked.value
      emit('update:modelValue', checked.value)
      emit('change', checked.value)
    }

    return { checked, toggleChange }
  }
}
</script>

<style scoped lang='less'>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
