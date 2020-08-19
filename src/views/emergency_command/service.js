/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-09 11:43:18
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-15 16:35:34
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getEventType = async () =>
    await axios
        .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/EmergencyType')
        .then(res => res)
const getPlanDetail = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/emergencyPlan/checkDetail/' + data)
        .then(res => res)
const getEventInsert = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/insertDetail', data)
        .then(res => res)
const setFinish = data =>
    axios
        .put(_globalUrl.businessUrl + '/emergencyEvent/update', data)
        .then(res => res)
const getExerciseData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyEvent/list', data)
        .then(res => res)
const getEmergencyPlan = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/businessEmergencyPlan/selAll', data)
        .then(res => res)
export {
    getEventType,
    getPlanDetail,
    getEventInsert,
    setFinish,
    getExerciseData,
    getEmergencyPlan
}
