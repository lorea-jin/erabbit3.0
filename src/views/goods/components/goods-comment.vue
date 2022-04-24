<template>
  <div class="goods-comment" v-if="commentInfo">
    <div class="head">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a href="javascript:;" v-for="(item,index) in  commentInfo.tags" :key="index+'tag'"
            :class="{active:activeIndex==index}"
            @click="changeTag(index)">{{item.title}}({{item.tagCount}})</a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a href="javascript:;" @click="changeSort(null)"
        :class="{active:reqParams.sortField==null}">默认</a>
      <a href="javascript:;" @click="changeSort('createTime')"
        :class="{active:reqParams.sortField=='createTime'}">最新</a>
      <a href="javascript:;" @click="changeSort('praiseCount')"
        :class="{active:reqParams.sortField=='praiseCount'}">最热</a>
    </div>

    <!-- 评论列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" class="iconfont icon-wjx01" :key="i+item.id"></i>
            <i v-for="i in 5-item.score" :key="i+'2'" class="iconfont icon-wjx02"></i>
            <span class=" attr">{{filterDes(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 图片预览 -->
          <GoodsCommentImage :pictures="item.pictures" />

          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>

    <XtxPagination @current-change="changePager" :total="total" :current-page="reqParams.page" />
  </div>
</template>
<script>
import GoodsCommentImage from '../components/goods-comment-image.vue'
import { inject, reactive, ref, watch } from 'vue'
import { findCommentInfoByGoods, findGoodsCommentList } from '../api/index'
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  props: {},
  setup () {
    const goods = inject('goods')
    const activeIndex = ref(0)
    // 1获取评论
    const commentInfo = ref(null)
    const getCommentInfo = () => {
      findCommentInfoByGoods().then(res => {
        res.result.tags.unshift({
          title: '全部评价', tagCount: res.result.evaluateCount, type: 'all'
        }, {
          title: '有图', tagCount: res.result.hasPictureCount, type: 'img'
        })
        commentInfo.value = res.result
      })
    }
    getCommentInfo()

    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })

    // 2.切换tag
    const changeTag = (i) => {
      activeIndex.value = i
      const currTag = commentInfo.value.tags[i]

      if (currTag.type === 'all') {
        reqParams.hasPicture = false
        reqParams.tag = null
      } else if (currTag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = false
        reqParams.tag = currTag.title
      }
      reqParams.page = 1
    }

    // 改排序
    const changeSort = (type) => {
      reqParams.sortField = type
      reqParams.page = 1
    }

    // 监听参数 reqParmas变化了就重拿评论列表
    const commentList = ref([])
    const total = ref(0)
    watch(reqParams, (val) => {
      findGoodsCommentList(goods.id, reqParams).then(res => {
        commentList.value = res.result.items
        total.value = res.result.counts
      })
    }, { immediate: true })

    // 过滤商品属性
    const filterDes = (arr) => {
      const re = arr.reduce((acc, cur) => `${acc} ${cur.name}:${cur.nameValue}`, '').trim()
      return re
    }

    // 过滤名字
    const formatNickname = (name) => {
      return name.substring(0, 1) + '****' + name.substring(name.length - 1)
    }


    // 改变分页函数
    const changePager = (np) => {
      reqParams.page = np
    }

    return { commentInfo, activeIndex, changeTag, changeSort, reqParams, commentList, filterDes, formatNickname, changePager, total }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
}

.list {
  padding: 0 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }
    .text {
      color: #666;
      line-height: 24px;
    }
    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>