/*
 * @Description: 获取level
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 16:50:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-04 14:59:45
 */
import axios from '@/utils/axios_setting'
import API from '@/api'

const getLevelList = async () =>
  await axios.get(API.GET_BY_CODE + 'NoticeLevel').then(res => res)
export { getLevelList }
