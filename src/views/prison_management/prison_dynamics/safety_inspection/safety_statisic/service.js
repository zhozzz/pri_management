/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-09 11:43:18
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-11 15:23:44
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getCards = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/hidden/totalStatistics/' + data)
    .then(res => res)
const getProvince = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/provinceCountStatistics/', data)
    .then(res => res)
const getLevel = async (data, id) =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/levelCountStatistics/' + id, data)
    .then(res => res)
const getLineData = async id =>
  await axios
    .get(_globalUrl.businessUrl + '/hidden/rectifyRateCompare/' + id)
    .then(res => res)
const getTypeCount = async (data, id) =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/typeCountStatistics/' + id, data)
    .then(res => res)
const getRectifyRateRank = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/rectifyRateRank/', data)
    .then(res => res)
const getRankAll = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/rectifyRateRankAll/', data)
    .then(res => res)
const getRiskData = async data =>
  await axios.post(_globalUrl.userUrl + '/hidden/sel', data).then(res => res)
const getYearData = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/hidden/checkAimCount/' + data)
    .then(res => res)
export {
  getCards,
  getRiskData,
  getProvince,
  getLevel,
  getLineData,
  getTypeCount,
  getRectifyRateRank,
  getRankAll,
  getYearData
}
