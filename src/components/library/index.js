/** 插件 */
import defaultImg from '@/assets/images/200.png'
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
const importFn = require.context('./', false, /\.vue$/)
import XtxMessageFn from './Message'

export default {
  install (app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    importFn.keys().forEach(key => {
      const component = importFn(key).default
      app.component(component.name, component)// 组件注册
    })
    defineDirective(app)
    app.config.globalProperties.$message = XtxMessageFn
  }
}

const defineDirective = (app) => {
  app.directive('lazyload', {
    mounted (el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0
      }
      )

      observer.observe(el)
    }
  })
}
