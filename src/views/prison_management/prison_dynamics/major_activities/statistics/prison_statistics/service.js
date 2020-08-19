/*
 * @Description:
 * @Author:
 * @Date: 2019-10-08 10:20:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-03 17:03:30
 */
import axios from '@/utils/axios_setting'
import breakSearchParams from '@/utils/breakSearchParams'
import _global from '@/utils/global_url'
const getBar = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/statistics',
      breakSearchParams(data)
    )
    .then(res => res)
const getPie = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/eventNumStatistics',
      breakSearchParams(data)
    )
    .then(res => res)
const getArea = async data =>
  await axios
    .get(_global.businessUrl + '/importantEvent/outPersonCount/' + data)
    .then(res => res)
export { getBar, getPie, getArea }
