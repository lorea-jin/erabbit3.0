import request from '@/base/service.js'

// 获取首页头部分类数据
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

// 获取品牌的弹层展示数据
export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

// 获取新鲜好物
export const findNew = () => {
  return request('home/new', 'get')
}

// 获取人气推荐
export const findHot = () => {
  return request('home/hot', 'get')
}

// 获取商品
export const findGoods = () => {
  return request('home/goods', 'get')
}
