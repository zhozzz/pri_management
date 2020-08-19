/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:16:24
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-02 13:58:24
 */

import axios from '@/utils/axios_setting'
import API from '@/api'

// 获取违规详情
const add = async data =>
  await axios
    .get(API.GET_REPORT_DETAIL + '/' + data['id'])
    .then(res => res)
export { add }
