/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-09 11:43:18
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-10-10 16:01:38
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getEventType = async () =>
  await axios
    .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/EmergencyType')
    .then(res => res)
const getPlanData = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/emergencyPlan/query', data)
    .then(res => res)
const getTeamList = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/emergencyTeam/checkTeams/' + data)
    .then(res => res)
const createPlan = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/emergencyPlan/create', data)
    .then(res => res)
const emergencyPlanDel = async data =>
  await axios
    .delete(
      _globalUrl.businessUrl + '/emergencyPlan/delete?' + setDataString(data)
    )
    .then(res => res)
const setDataString = data => {
  let url = ''
  data.forEach(item => {
    let params
    params = 'planIds=' + item + '&'
    url += params
  })
  url = url.substr(0, url.length - 1)

  return url
}
const editPlan = async data =>
  await axios
    .put(_globalUrl.businessUrl + '/emergencyPlan/edit', data)
    .then(res => res)

export {
  getEventType,
  getPlanData,
  getTeamList,
  createPlan,
  emergencyPlanDel,
  editPlan
}
