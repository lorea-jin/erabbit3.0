import request from '@/base/service.js'

/**
 * 获取单个顶级分类信息 拿到后children属性就是要展示的商品
 * @param {String} id - 顶级分类ID
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}
