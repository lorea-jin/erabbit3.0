/** 选择城市地址组件 */
<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleActive">
      <span class="placeholder" v-if="!fullLocation">请选择配送地址</span>
      <span class="value" v-else>{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>

    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span class="ellipsis" v-for="city in currList" :key="city.id"
          @click="changeItem(city)">{{city.name}}</span>
      </template>
    </div>
  </div>

</template>

<script>
import { onClickOutside } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'
export default {
  name: 'XtxCity',
  components: {},
  props: {
    fullLocation: {
      type: String,
      default: null
    }
  },
  setup (props, { emit }) {
    const active = ref(false)
    const cityData = ref([])
    const loading = ref(false)

    const close = () => {
      active.value = false
    }
    const open = () => {
      active.value = true
      loading.value = true
      getCityData().then(res => {
        cityData.value = res
        loading.value = false
      })
      // 再次打开已选择的城市结果清空
      for (let k in changeResult) {
        changeResult[k] = ''
      }
    }

    // 1. 控制下拉框切换显隐
    const toggleActive = () => {
      active.value ? close() : open()
    }

    // 2.点击其他地方关闭下拉框
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })

    // 3.获取城市数据
    const getCityData = () => {
      // 触发open的时候获取请求
      // 获取后缓存在全局变量，避免多次请求
      // 缓存后若有 则直接使用

      return new Promise((resolve, reject) => {
        if (Window.cityData) {
          // 有缓存，直接resolve出去，返回一个resolve状态的promise
          resolve(Window.cityData)
        } else {// 没缓存 拿到数据再resolve
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then(res => {
            Window.cityData = res.data
            resolve(Window.cityData)
          })
        }
      })


    }

    // 选择完的城市结果
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    // 4.点击改变城市 level 省0 市1 区2
    const changeItem = (item) => {
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      } else if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      } else if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 关闭
        close()
        emit('change', changeResult)
      }
    }

    // 5.依赖城市数据 实现省市区切换
    // TODO 根据点击的省份城市获取对应的列表  
    const currList = computed(() => {
      let list = cityData.value // 显示省

      if (changeResult.provinceCode) { // 有省了 要市的数据
        list = list.find(item => item.code == changeResult.provinceCode).areaList
      }
      if (changeResult.cityCode) { //有市了，要区的数据
        list = list.find(item => item.code == changeResult.cityCode).areaList
      }
      return list
    })

    // 6. 设置未选择前下拉框默认显示城市
    return { active, toggleActive, target, cityData, loading, currList, changeItem, changeResult }
  }
}
</script>

<style scoped lang='less'>
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
  .loading {
    height: 290px;
    width: 100%;
    background: url(../../assets/images/loading.gif) no-repeat center;
  }
}
</style>
