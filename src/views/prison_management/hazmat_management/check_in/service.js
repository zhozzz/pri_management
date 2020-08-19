/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:08:10
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-06 17:13:09
 */
import axios from '@/utils/axios_setting'
import breakSearchParams from '@/utils/breakSearchParams'
import breakSearchParamString from '@/utils/breakSearchParamString'
import _globalUrl from '@/utils/global_url'

import API from '@/api'
const getGoodsList = async data =>
  await axios
    .get(API.GET_GOODS_LIST + breakSearchParamString(data))
    .then(res => res)
const insertGoods = async (data = {}) =>
  await axios
    .post(API.ADD_GOODS, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
    .then(res => res)
const goodsOut = async (data = {}) =>
  await axios
    .post(API.GOODS_OUT, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
    .then(res => res)
const getPoliceDetail = async data =>
  await axios
    .get(_globalUrl.userUrl + '/userManage/getUserById/' + data['policeId'])
    .then(res => res)
export { getGoodsList, insertGoods, goodsOut, getPoliceDetail }
