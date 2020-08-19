/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:36:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-21 15:50:07
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getTeamType = async () =>
  await axios
    .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/EmergencyTeamType')
    .then(res => res)
const getTeamData = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/emergencyTeam/query', data)
    .then(res => res)
const getOfficersUnderPrison = data =>
  axios
    .get(_globalUrl.userUrl + '/department/getPolicesEachDeparts/' + data)
    .then(res => res)
const emergencyTeamCreate = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/emergencyTeam/create', data)
    .then(res => res)
const emergencyTeamEdit = async data =>
  await axios
    .put(_globalUrl.businessUrl + '/emergencyTeam/edit', data)
    .then(res => res)
const emergencyTeamDel = async data =>
  await axios
    .delete(
      _globalUrl.businessUrl + '/emergencyTeam/remove?' + setDataString(data)
    )
    .then(res => res)
const setDataString = data => {
  let url = ''
  data.forEach(item => {
    let params
    params = 'teamIds=' + item + '&'
    url += params
  })
  url = url.substr(0, url.length - 1)

  return url
}

const getIntercom = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/intercom/query', data)
    .then(res => res)
export {
  getTeamType,
  getTeamData,
  getOfficersUnderPrison,
  emergencyTeamCreate,
  emergencyTeamEdit,
  emergencyTeamDel,
  getIntercom
}
