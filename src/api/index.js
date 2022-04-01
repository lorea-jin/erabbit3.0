/** 公用api */
import request from '@/base/service.js'

// 获取轮播图
export const findBanner = (distributionSite) => {
  return request('/home/banner', 'get', { distributionSite })
}
