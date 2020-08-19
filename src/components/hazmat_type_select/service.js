/*
 * @Description: 获取危险品
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 16:50:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-08-29 13:45:25
 */
import axios from '@/utils/axios_setting'
import API from '@/api'

// 获取危险品
const getHazmatList = async () =>
  await axios.get(API.GET_GOODS_TYPE).then(res => res)
export { getHazmatList }
