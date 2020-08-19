/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 16:50:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-08-30 10:08:29
 */
import axios from '@/utils/axios_setting'
import API from '@/api'

const getDeptList = async data =>
  await axios.post(API.GET_DEPT_LIST, data).then(res => res)
export { getDeptList }
