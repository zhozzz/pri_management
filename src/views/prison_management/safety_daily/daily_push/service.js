/*
 * @Description:
 * @Author: huxuelin
 * @Github:
 * @Date: 2019-09-14
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-17 14:23:46
 */
import axios from '@/utils/axios_setting'
import breakSearchParamString from '@/utils/breakSearchParamString'
import _globalUrl from '@/utils/global_url'

// 获取计划数据
const listDailyData = async data =>
  await axios
    .get(
      _globalUrl.businessUrl +
        '/safetyDailyReportController/listDailyData' +
        breakSearchParamString(data)
    )
    .then(res => res)
// 录入安全日报
const insertDailyReport = async data =>
  await axios
    .post(
      _globalUrl.businessUrl + '/safetyDailyReportController/insertDailyReport',
      data
    )
    .then(res => res)
// 获取日报上报时间
const getPrisonReportTimes = async data =>
  await axios
    .get(
      _globalUrl.businessUrl +
        '/safetyDailyReportController/getPrisonReportTimes' +
        breakSearchParamString(data)
    )
    .then(res => res)

export { listDailyData, insertDailyReport, getPrisonReportTimes }
