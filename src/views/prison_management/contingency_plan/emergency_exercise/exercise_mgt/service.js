/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-09 11:43:18
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-03 15:46:37
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getEventType = async () =>
  await axios
    .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/EmergencyType')
    .then(res => res)
const getExerciseData = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/emergencyDrill/query', data)
    .then(res => res)

const getPrisonList = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/emergencyDrill/getSubDepartments/' + data)
    .then(res => res)
const getTaskList = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/emergencyDrill/checkTasks/' + data)
    .then(res => res)

const getPublicList = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/emergencyDrill/checkMyPublic/' + data)
    .then(res => res)
const releaseExercise = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/emergencyDrill/releaseTask', data)
    .then(res => res)
const getOfficersUnderPrison = data =>
  axios
    .get(_globalUrl.userUrl + '/department/getPolicesEachDeparts/' + data)
    .then(res => res)
const createExercise = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/emergencyDrill/create', data)
    .then(res => res)
const editExercise = async data =>
  await axios
    .put(_globalUrl.businessUrl + '/emergencyDrill/edit', data)
    .then(res => res)
const delExercise = async data =>
  await axios
    .delete(
      _globalUrl.businessUrl + '/emergencyDrill/delete?' + setDataString(data)
    )
    .then(res => res)
const getDrillDetail = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/emergencyDrill/detail/' + data)
    .then(res => res)
const bindFiles = async data =>
  await axios
    .put(_globalUrl.businessUrl + '/emergencyDrill/bindFiles?' + data)
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
  getPrisonList,
  releaseExercise,
  getOfficersUnderPrison,
  getTaskList,
  createExercise,
  getDrillDetail,
  editExercise,
  delExercise,
  bindFiles,
  getPublicList
}
