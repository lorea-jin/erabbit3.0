import request from '@/base/service.js'

// 获取首页头部分类数据
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

// 获取品牌的弹层展示数据
export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}
