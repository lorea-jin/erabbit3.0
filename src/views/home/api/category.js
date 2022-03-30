import request from '@/base/service.js'

// 获取首页头部分类数据
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
