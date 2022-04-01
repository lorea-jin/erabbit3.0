import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import '@/assets/styles/common.less'

import UI from './components/library/index.js' // 挂载插件

createApp(App).use(store).use(router).use(UI).mount('#app')
