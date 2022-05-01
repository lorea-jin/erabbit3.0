/** 全局函数式调用的消息提示框 */
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'  // 1.引入

const div = document.createElement('div') // 3. 准备容器，插入body
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

export default ({ type, text }) => {


  // 2.单文件组件渲染成虚拟dom :createVNode(要渲染的组件，组件上的属性参数对象props) 
  const vnode = createVNode(XtxMessage, { type, text })

  render(vnode, div) // 4. 容器种放入虚拟dom

  // 5. 开启定时，移出DOM容器内容
  let timer = null
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)

}