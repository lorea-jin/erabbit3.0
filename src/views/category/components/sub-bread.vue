<template>
  <div class="container">
    <xtx-bread>
      <xtx-bread-item>首页</xtx-bread-item>
      <xtx-bread-item :to="`/category/${category.top.id}`" v-if="category.top">{{category.top.name}}
      </xtx-bread-item>
      <transition name="fade-right" mode="out-in">
        <xtx-bread-item :key="category.sub.id" v-if="category.sub">{{category.sub.name}}
        </xtx-bread-item>
      </transition>
    </xtx-bread>
  </div>
</template>

<script>
import XtxBread from '@/components/library/xtx-bread.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'SubBread',
  components: { XtxBread },
  props: {},
  setup () {
    const store = useStore()
    const route = useRoute()
    const category = computed(() => {
      const obj = {}
      store.state.category.list && store.state.category.list.forEach(item => {
        item.children && item.children.forEach(sub => {
          if (sub.id === route.params.id) {
            obj.top = { name: item.name, id: item.id }
            obj.sub = { name: sub.name, id: sub.id }
          }
        })
      })
      return obj
    })


    return { category }
  }
}
</script>

<style scoped lang='less'>
</style>
