/** 一级分类 */
<template>
  <div class="container top-category">

    <!-- 面包屑 -->
    <XtxBread>
      <XtxBreadItem to="/">首页</XtxBreadItem>
      <transition name="fade-right" mode="out-in">
        <XtxBreadItem :key="topCategory.id">{{topCategory.name}}</XtxBreadItem>
      </transition>
    </XtxBread>

    <!-- 轮播图 -->
    <XtxCarousel :slider="slider" :autoPlay="true" />

    <!-- 二级分类  -->
    <div class="sub-list">
      <h3>全部分类</h3>
      <ul>
        <li v-for="item in topCategory.children" :key="item.id">
          <RouterLink :to="`/category/sub/${item.id}`">
            <img :src="item.picture">
            <p>{{item.name}}</p>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- 不同二级分类下 5个商品展示 -->
    <div class="ref-goods" v-for="item in subList" :key="item.id">
      <div class="head">
        <h3>- {{item.name}} -</h3>
        <p class="tag">{{item.desc}}</p>
        <XtxMore />
      </div>
      <div class="goodsBody">
        <GoodsItem v-for="g in item.goods" :key="g.id" :goods="g" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { findBanner } from '@/api/index.js'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from '../components/goods-item.vue'
import { findTopCategory } from '../api/index'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    // 1.拿轮播图数据
    const slider = ref([])
    findBanner().then(res => {
      slider.value = res.result
    })

    // 2.vuex获取二级分类
    const store = useStore()
    const route = useRoute()
    // let currentId = ref(route.params.id) // 一级分类的路由id
    const topCategory = computed(() => {
      // console.log('currentId', currentId)
      // console.log('没用变量接受', route.params.id)
      let cate = {}
      const item = store.state.category.list.find(item => item.id === route.params.id)
      if (item) cate = item
      return cate
    })

    // 3.监听路由变化拿不同的二级分类
    const subList = ref([])
    const getSubList = (id) => {
      findTopCategory(id).then(data => {
        subList.value = data.result.children
      })
    }

    watch(() => route.params.id, (newVal) => {
      if (!newVal || `/category/${newVal}` !== route.path) return
      getSubList(newVal)
    }, { immediate: true })



    return { slider, topCategory, subList }
  }
}
</script>

<style scoped lang='less'>
.xtx-carousel {
  height: 500px;
}
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .goodsBody {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
