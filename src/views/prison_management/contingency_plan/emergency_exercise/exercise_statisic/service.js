/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-12 10:31:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-10-12 16:14:16
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getCardsStatistics = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/emergencyDrill/statistics/' + data)
    .then(res => res)
const getCountsByProvincial = async data =>
  await axios
    .get(
      _globalUrl.businessUrl +
        '/emergencyDrill/provincialEachPrisonCounts/' +
        data[0] +
        '/' +
        data[1]
    )
    .then(res => res)
const getSatisfactionByProvincial = async data =>
  await axios
    .get(
      _globalUrl.businessUrl +
        '/emergencyDrill/provincialEachPrisonSatisfaction/' +
        data[0] +
        '/' +
        data[1]
    )
    .then(res => res)
const getTypeData = async data =>
  await axios
    .get(
      _globalUrl.businessUrl +
        '/emergencyDrill/provincialEachPrisonCounts/' +
        data[0] +
        '/' +
        data[1] +
        '/' +
        data[2]
    )
    .then(res => res)
const getCountsByPrison = async data =>
  await axios
    .get(
      _globalUrl.businessUrl +
        '/emergencyDrill/prisonEachDepartCounts/' +
        data[0] +
        '/' +
        data[1] +
        '/' +
        data[2]
    )
    .then(res => res)
const getMonthData = async data =>
  await axios
    .get(
      _globalUrl.businessUrl +
        '/emergencyDrill/eachMonthCounts/' +
        data[0] +
        '/' +
        data[1]
    )
    .then(res => res)
// 拼接参数
const setDataString = data => {
  let url = ''
  data.forEach(item => {
    let params
    params = 'drillIds=' + item + '&'
    url += params
  })
  url = url.substr(0, url.length - 1)

  return url
}

export {
  getCardsStatistics,
  getCountsByProvincial,
  getSatisfactionByProvincial,
  getTypeData,
  getCountsByPrison,
  getMonthData
}
