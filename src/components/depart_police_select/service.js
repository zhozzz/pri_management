/*
 * @Description: 获取警员列表
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 16:50:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-04 14:42:58
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import breakSearchParamString from '@/utils/breakSearchParamString'
// 获取当前值班警察
const getDutyPolice = async data =>
  await axios
    .get(API.DUTY_POLICE + breakSearchParamString(data))
    .then(res => res)
export { getDutyPolice }
