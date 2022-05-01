/**
 * TO：函数调用，or 挂载原型
 * 1.引入组件
 * 2.creatVnode使组件成vnode
 * 3.准备容器<div>
 * 4.render渲染
 * 
 * 使用方法： Confirm({ text: '您确定从购物车删除该商品吗？' })
*/

import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)


// 返回的要是一个promimse，参考饿了么，点击取消/确认都要销毁(关闭)组件
export default ({ title, text }) => {

  return new Promise((resolve, reject) => {
    // 确认
    const submitFn = () => {
      render(null, div)
      resolve()
    }

    // 取消
    const cancelFn = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }

    const vnode = createVNode(XtxConfirm, { title, text, submitFn, cancelFn })
    render(vnode, div)//确认框什么时候渲染进页面？创建promise的时候
  })

}