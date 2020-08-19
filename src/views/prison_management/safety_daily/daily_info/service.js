/*
 * @Description:
 * @Author: huxuelin
 * @Github:
 * @Date: 2019-09-14
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-16 17:52:30
 */
import axios from '@/utils/axios_setting'
import breakSearchParamString from '@/utils/breakSearchParamString'
import _globalUrl from '@/utils/global_url'

// 获取计划数据
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
const upDataKey = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            '/supervise/updateSubsitution',
            data
        )
        .then(res => res)
const report = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            '/supervise/reportSupervise',
            data
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
export { listDailyReport, upDataKey, report, getLeader }
