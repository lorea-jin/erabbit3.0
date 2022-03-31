<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="item in menuList" :key="item.id" @mouseenter="categoryId=item.id"
        :class="{active:categoryId=== item.id}">
        <RouterLink :to=" `/category/${item.id}`">{{item.name}}</RouterLink>
        <template v-if="item.children">
          <RouterLink :to="`/category/sub/${subItem.id}`" v-for="subItem in item.children"
            :key="subItem.id">{{subItem.name}}
          </RouterLink>
        </template>
        <template v-else>
          <XtxSkeleton :animated="true" width="60px" height="18px" style="margin-right:5px"
            bg="rgba(255,255,255,0.2)" />
          <XtxSkeleton :animated="true" width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
        </template>
      </li>
    </ul>

    <!-- 弹层 -->
    <div class="layer">
      <h4>{{currCategory&&currCategory.id==='brand'?'品牌推荐':'分类推荐'}} <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <!-- 商品 -->
      <ul v-if="currCategory&&currCategory.goods">
        <li v-for="item in currCategory.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌 -->
      <ul v-if="currCategory&&currCategory.brands">
        <li class="brand" v-for="brand in currCategory.brands" :key="brand.id">
          <RouterLink to="/">
            <img :src="brand.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{brand.place}}</p>
              <p class="name ellipsis">{{brand.name}}</p>
              <p class="desc ellipsis-2">{{brand.desc}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { findBrand } from '../api/category.js'
export default {
  name: 'HomeCategory',
  components: {},
  setup () {
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-chilren', name: '品牌推荐' }],
      brands: []
    })

    const store = useStore()
    const menuList = computed(() => {
      const list = store.state.category.list.map(item => ({
        name: item.name,
        id: item.id,
        children: item.children && item.children.slice(0, 2),
        goods: item.goods
      }))
      list.push(brand)
      return list
    })

    // 获取当前分类信息
    const categoryId = ref(null)// 当前分类id
    const currCategory = computed(() => {
      return menuList.value.find(item => item.id === categoryId.value)
    })

    // 获取品牌数据
    findBrand(6).then(res => {
      brand.brands = res.result
    })
    return { menuList, categoryId, currCategory }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }

  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }

      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
