import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/layout.vue')
const home = () => import('@/views/home/page/index.vue')
const TopCategory = () => import('@/views/category/page/top.vue')
const SubCategory = () => import('@/views/category/page/sub.vue')
const Goods = () => import('@/views/goods/page/index.vue')
const Login = () => import('@/views/login/page/index')
const cart = () => import('@/views/cart/page/index.vue')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/goods/:id', component: Goods },
      { path: '/cart', component: cart }
    ]
  },
  { path: '/login', component: Login }
]

// vue 2中是通过new VueRouter()
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { left: 0, top: 0 }
  }
})
export default router
