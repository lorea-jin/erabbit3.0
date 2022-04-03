/** 好物和人气推荐 */
<template>
  <div class="container">
    <HomePanel v-for="(panel,i) in DataArr" :key="i+'panel'" :title="panel.title"
      :sub-title="panel.subTitle">
      <template v-slot:right>
        <XtxMore path="/" />
      </template>

      <transition name="fade">
        <ul class="listWrap" v-if="panel.picList().length>0">
          <li v-for="(item,i2) in panel.picList()" :key="i2+'pic'">
            <!-- {{item}}
          --------
          {{panel.picList}} -->
            <RouterLink :to="`/product/${item.id}`" v-if="panel.des==='new'">
              <img :src="item.picture" alt="">
              <p class="name ellipsis">{{item.name}}</p>
              <p class="price">&yen;{{item.price}}</p>
            </RouterLink>

            <RouterLink :to="`/product/${item.id}`" v-else-if="panel.des==='hot'">
              <img :src="item.picture" alt="">
              <p class="name">{{item.title}}</p>
              <p class="desc">{{item.alt}}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton v-else />
      </transition>

    </HomePanel>
  </div>
</template>

<script>
import HomeSkeleton from '../components/home-skeleton.vue'
import { findNew, findHot } from '../api/category.js'
import HomePanel from './home-panel.vue'
import { ref } from 'vue'
export default {
  name: 'GoodAndNewIndex',
  components: { HomePanel, HomeSkeleton },
  props: {},
  setup () {
    let DataArr = ref([])
    const hotList = ref([])
    const newList = ref([])

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

    // 1.获取新鲜的接口
    findNew().then(res => {
      newList.value = res.result
    })

    // 2.获取人气的接口
    findHot().then(res => {
      hotList.value = res.result
    })

    console.log(DataArr)
    return { DataArr }
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
