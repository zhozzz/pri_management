/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-09 11:43:18
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-10 10:18:19
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getEventType = async () =>
    await axios
        .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/EmergencyType')
        .then(res => res)
const getExerciseData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/list', data)
        .then(res => res)

const getOfficersUnderPrison = data =>
    axios
        .get(_globalUrl.userUrl + '/department/getPolicesEachDeparts/' + data)
        .then(res => res)

const setFinish = data =>
    axios
        .put(_globalUrl.businessUrl + '/emergencyEvent/update', data)
        .then(res => res)
const setExercise = data =>
    axios
        .put(_globalUrl.businessUrl + '/emergencyDrill/markAsDrill/' + data)
        .then(res => res)
const getPlanDetail = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/emergencyPlan/checkDetail/' + data)
        .then(res => res)
const getEventDetail = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/emergencyEvent/getEventDetail/' + data)
        .then(res => res)
// 统计数据
const getChartData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/CountAll', data)
        .then(res => res)
const getChartMonthData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/CountMouth', data)
        .then(res => res)
const getChartTypeData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/CountByType', data)
        .then(res => res)
const getChartEventData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/CountByEvent', data)
        .then(res => res)
const getChartLevelData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/CountByLevel', data)
        .then(res => res)

const getPlans = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/emergencyPlan/getPlansForEmergency/' + data)
        .then(res => res)
const upData = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/emergencyEvent/update', data)
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
    getEventType,
    getExerciseData,
    getOfficersUnderPrison,
    setFinish,
    getPlanDetail,
    setExercise,
    getChartData,
    getChartTypeData,
    getChartEventData,
    getChartLevelData,
    getChartMonthData,
    getEventDetail,
    getPlans, upData
}
