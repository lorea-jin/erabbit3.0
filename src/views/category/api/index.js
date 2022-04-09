import request from '@/base/service.js'

/**
 * 获取单个顶级分类信息 拿到后children属性就是要展示的商品
 * @param {String} id - 顶级分类ID
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}



/**
 * 获取二级分类下筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

//