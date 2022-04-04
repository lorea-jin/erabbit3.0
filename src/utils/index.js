/** 工具钩子 */

import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

// 进入可视区
export const useLazyData = (target, apiFn) => {
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        console.log('进入可视区了')
        console.log(apiFn)
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
        console.log(result)
      }
    },
    {
      threshold: 0
    }
  )
  return result
}
