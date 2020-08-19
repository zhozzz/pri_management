/*
 * @Description:
 * @Author: huxuelin
 * @Github:
 * @Date: 2019-09-14
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-16 18:03:22
 */
import axios from '@/utils/axios_setting'
import breakSearchParamString from '@/utils/breakSearchParamString'
import _globalUrl from '@/utils/global_url'

// 获取计划数据
const getStatisticalData = async data =>
    await axios
        .get(
            _globalUrl.businessUrl +
            '/safetyDailyReportController/getStatisticalData' +
            breakSearchParamString(data)
        )
        .then(res => res)
const getThresholdValue = data =>
    axios.get(
        _globalUrl.businessUrl +
        '/safetyDailyReportController/getThresholdValue' +
        breakSearchParamString(data)
    )
const getPrisonData = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            '/supervise/findReportByReportDate',
            data
        )
        .then(res => res)
const getTime = async data =>
    await axios
        .get(
            _globalUrl.businessUrl +
            '/supervise/getByStatus/' +
            data
        )
        .then(res => res)
const subTime = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            '/supervise/updateConfig',
            data
        )
        .then(res => res)
const markReportState = async data =>
    await axios
        .put(
            _globalUrl.businessUrl +
            '/supervise/markReportState',
            data
        )
        .then(res => res)
const provincialHandleReport = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            '/supervise/provincialHandleReport',
            data
        )
        .then(res => res)

const listDailyReport = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            // '/safetyDailyReportController/listDailyReport' +
            '/supervise/listByPrisonId',
            data
            // breakSearchParamString(data)
        )
        .then(res => res)

const getLeader = async data =>
    await axios
        .get(
            _globalUrl.businessUrl +
            '/duty/prisonCheckRota/' +
            data
        )
        .then(res => res)
export {
    getStatisticalData, getThresholdValue, getPrisonData, getTime, subTime,
    markReportState, provincialHandleReport, listDailyReport, getLeader
}
