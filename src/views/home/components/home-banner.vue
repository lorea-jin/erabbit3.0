<template>
  <div class="home-banner">
    <XtxCarousel :slider="bannerList" :autoPlay="true" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { findBanner } from '@/api/index.js'

export default {
  name: 'HomeBanner',
  components: {},
  props: {},
  setup () {
    const bannerList = ref([])
    findBanner(1).then(res => {
      bannerList.value = res.result
    })

    return { bannerList }
  }
}
</script>

<style scoped lang='less'>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>
