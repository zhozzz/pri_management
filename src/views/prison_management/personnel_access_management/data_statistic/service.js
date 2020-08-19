/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-07 20:02:57
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-07 20:24:11
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import breakSearchParamString from '@/utils/breakSearchParamString'
const getTodayStatisticalData = async data =>
  await axios
    .get(API.GET_TODAY_STATISTICAL_DATA + breakSearchParamString(data))
    .then(res => res)
const getStayTimeForPeriod = async data =>
  await axios
    .get(API.GET_VISITOR_STAY_TIME_FOR_PERIOD + breakSearchParamString(data))
    .then(res => res)
const getIssueStatisticalDataForPeriod = async data =>
  await axios
    .get(API.GET_ISSUE_STATISTICAL_DATA + breakSearchParamString(data))
    .then(res => res)
export {
  getTodayStatisticalData,
  getStayTimeForPeriod,
  getIssueStatisticalDataForPeriod
}
