/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-29 16:41:30
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-06 17:08:51
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import breakSearchParamString from '@/utils/breakSearchParamString'
const getGoodsSummary = async data =>
  await axios
    .get(API.GET_GOODS_SUMMARY + breakSearchParamString(data))
    .then(res => res)

export { getGoodsSummary }
