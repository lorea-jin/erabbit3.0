import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [

]

// vue 2中是通过new VueRouter()
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
