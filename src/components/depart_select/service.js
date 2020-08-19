/*
 * @Description: 获取部门
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 16:50:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-03 15:47:15
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import breakSearchParamString from '@/utils/breakSearchParamString'
// 获取部门
const getDepartmentList = async data =>
  await axios.get(API.GET_DEPART_TREE + data).then(res => res)
export { getDepartmentList }
