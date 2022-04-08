import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/layout.vue')
const home = () => import('@/views/home/page/index.vue')
const TopCategory = () => import('@/views/category/page/top.vue')
const SubCategory = () => import('@/views/category/page/sub.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory }
    ]
  }
]

// vue 2中是通过new VueRouter()
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
