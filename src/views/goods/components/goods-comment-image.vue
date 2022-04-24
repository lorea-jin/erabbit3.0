<template>
  <!-- 图片预览 -->
  <div class="goods-comment-image" v-if="pictures.length>0">

    <div class="Piclist">
      <a href="javascript:;" v-for="(pic,i) in pictures" :key="i+'pic'" @click="currImage=pic"
        :class="{active:currImage===pic}">
        <img :src="pic" alt="">
      </a>
    </div>

    <div class="preview" v-if="currImage">
      <img :src="currImage" alt="">
      <i @click="currImage=null" class="iconfont icon-close-new"></i>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'GoodsCommentImage',
  components: {},
  props: {
    pictures: {
      type: Array,
      default: () => []
    }
  },
  setup () {

    // 图片预览
    const currImage = ref(null)

    return { currImage }

  }
}
</script>

<style scoped lang='less'>
.goods-comment-image {
  .Piclist {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    a {
      width: 120px;
      height: 120px;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      &.active {
        border-color: @xtxColor;
      }
    }
  }

  .preview {
    width: 480px;
    height: 480px;
    border: 1px solid #e4e4e4;
    background: #f8f8f8;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    i {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
}
</style>
