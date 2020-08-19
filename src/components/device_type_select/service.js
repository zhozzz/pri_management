/*
 * @Description: 获取警员列表
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 16:50:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-08-30 14:15:08
 */
import axios from '@/utils/axios_setting'
import breakSearchParams from '@/utils/breakSearchParams'
import API from '@/api'

// 获取4G设备类型
const getdeviceTypeList = async data =>
  await axios
    .post(API.GET_DVICE_TYPE, breakSearchParams(data))
    .then(res => res)
export { getdeviceTypeList }
