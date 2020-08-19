/*
 * @Description:
 * @Author:
 * @Date: 2019-10-08 10:20:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-03 09:56:32
 */
import axios from '@/utils/axios_setting'
import breakSearchParams from '@/utils/breakSearchParams'
import _global from '@/utils/global_url'
const getUnitDropdownInfo = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/getDropdownInfo',
      breakSearchParams(data)
    )
    .then(res => res)
const getDepartDropdownInfo = async data =>
  await axios
    .get(_global.userUrl + '/compose/getChildrenTree/' + data)
    .then(res => res)
const getSelfPrison = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/getLoginBelongsPrison',
      breakSearchParams(data)
    )
    .then(res => res)
const getDic = async data =>
  await axios
    .get(_global.userUrl + '/dictionarySubclass/byCode/' + data)
    .then(res => res)
const getArea = async data =>
  await axios
    .get(_global.userUrl + '/dictionary/option/VioLateArea')
    .then(res => res)
const getEventRecord = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/getEventRecord',
      breakSearchParams(data)
    )
    .then(res => res)
const getInCharge = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/getUserList',
      breakSearchParams(data)
    )
    .then(res => res)
const getInChargeDepart = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/getLoginBelongsPrisonAllDept',
      breakSearchParams(data)
    )
    .then(res => res)
const getPoliceList = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/getInitInfo',
      breakSearchParams(data)
    )
    .then(res => res)
const getCriminalList = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/getCriminalInfo',
      breakSearchParams(data)
    )
    .then(res => res)
const addSubmit = async data =>
  await axios
    .post(_global.businessUrl + '/importantEvent/insertSelective', data)
    .then(res => res)
const checkQuery = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/editInfo',
      breakSearchParams(data)
    )
    .then(res => res)
const del = async data =>
  await axios
    .post(
      _global.businessUrl + '/importantEvent/deleteEvent',
      breakSearchParams(data)
    )
    .then(res => res)
const getCriminalDepartmentList = async data =>
  await axios
    .get(_global.userUrl + '/compose/getPrisonTree/' + data)
    .then(res => res)
export {
  getDepartDropdownInfo,
  getUnitDropdownInfo,
  getSelfPrison,
  getDic,
  getEventRecord,
  getInCharge,
  getInChargeDepart,
  getPoliceList,
  getCriminalList,
  addSubmit,
  checkQuery,
  del,
  getCriminalDepartmentList,
  getArea
}
