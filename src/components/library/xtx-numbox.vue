<template>
  <div class="xtx-numbox">
    <div class="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="toggle(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="toggle(1)">+</a>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue-demi'
export default {
  name: 'XtxNumbox',
  props: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    },
    modelValue: {
      type: Number,
      default: 1
    },
    label: {
      type: String
    }
  },
  setup (props, { emit }) {
    let calculate = ref(1)

    watch(() => props.modelValue, (val) => {
      if (!val) return
      calculate.val = val
    }, { immediate: true })

    const toggle = (step) => {
      const val = calculate.value + step
      if (val < props.min || val > props.max) return
      calculate.value = val

      emit('update:modelValue', calculate.value)
    }

    return { toggle, calculate }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>