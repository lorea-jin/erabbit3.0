import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/layout.vue')
const home = () => import('@/views/home/index.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/', component: home
    }]
  }
]

// vue 2中是通过new VueRouter()
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
