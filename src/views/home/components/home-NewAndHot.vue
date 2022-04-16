/** 好物和人气推荐 */
<template>
  <div ref="listRef">
    <HomePanel v-for="(panel,i) in DataArr" :key="i+'panel'" :title="panel.title"
      :sub-title="panel.subTitle">
      <template v-slot:right>
        <XtxMore path="/" />
      </template>

      <div style="{position:relative}">
        <transition name="fade">
          <ul class="listWrap" v-if="panel.picList()&&panel.picList().length>0">
            <li v-for="(item,i2) in panel.picList()" :key="i2+'pic'">
              <RouterLink :to="`/goods/${item.id}`" v-if="panel.des==='new'">
                <img v-lazyload="item.picture" alt="">
                <p class="name ellipsis">{{item.name}}</p>
                <p class="price">&yen;{{item.price}}</p>
              </RouterLink>

              <RouterLink to="/" v-else-if="panel.des==='hot'">
                <img v-lazyload="item.picture" alt="">
                <p class="name">{{item.title}}</p>
                <p class="desc">{{item.alt}}</p>
              </RouterLink>
            </li>
          </ul>

          <HomeSkeleton v-else />
        </transition>
      </div>

    </HomePanel>
  </div>
</template>

<script>

import { ref } from 'vue'
import HomeSkeleton from '../components/home-skeleton.vue'
import HomePanel from './home-panel.vue'
// import { useLazyData } from '@/utils/index.js'
import { findNew, findHot } from '../api/category.js'
export default {
  name: 'GoodAndNewIndex',
  components: { HomePanel, HomeSkeleton },
  props: {},
  setup () {
    let DataArr = ref([])
    const listRef = ref(null)
    const hotList = ref([])
    const newList = ref([])
    const myre = ref(null)

    // myre.value = useLazyData(listRef, findNew)

    // 1.获取新鲜的接口
    findNew().then(res => {
      newList.value = res.result
    })

    // 2.获取人气的接口
    findHot().then(res => {
      hotList.value = res.result
    })

    DataArr = [{
      des: 'new',
      title: '新鲜好物',
      subTitle: '新鲜出炉 品质靠谱',
      picList: () => newList.value
    },
    {
      des: 'hot',
      title: '人气推荐',
      subTitle: '人气爆款 不容错过',
      picList: () => hotList.value
    }]
    return { DataArr, listRef, myre }
  }
}
</script>

<style scoped lang='less'>
.listWrap {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.2s;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-active {
  transition: all 0.2s;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.fade-leave-to {
  opacity: 0;
}
</style>
