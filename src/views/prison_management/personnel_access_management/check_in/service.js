/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 14:16:47
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-13 16:14:12
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import breakSearchParamString from '@/utils/breakSearchParamString'
// 检索符合条件的数据
const listVisitorInfo = async data =>
  await axios
    .get(API.GET_PRISON_VISITOR_INFO + breakSearchParamString(data))
    .then(res => res)
// 入监登记
const visitorCheckIn = async data =>
  await axios.post(API.INSERT_VISITOR_DATA, data).then(res => res)
// 离监操作
const visitorLeave = async data =>
  await axios.post(API.VISITOR_LEAVE, data).then(res => res)
// 获取当前值班警察
const getDutyPolice = async data =>
  await axios
    .get(API.DUTY_POLICE + breakSearchParamString(data))
    .then(res => res.data)
// 获取车辆历史记录
const getHistory = async data =>
  await axios
    .get(API.GET_PRISON_VISITOR_HISTORY + breakSearchParamString(data))
    .then(res => res)
// 获取未出监的数据
const listLeaveVistorInfo = async data =>
  await axios
    .get(API.LIST_LEAVE_VISITOR_INFO + breakSearchParamString(data))
    .then(res => res)

const getBaseData = async () =>
  await axios.get(API.GET_BASE_DATA).then(res => res)

const getOverTime = async data =>
  await axios
    .get(API.VISITOR_GET_OVER_TIME + breakSearchParamString(data))
    .then(res => res)

export {
  listVisitorInfo,
  visitorCheckIn,
  visitorLeave,
  getDutyPolice,
  getHistory,
  listLeaveVistorInfo,
  getBaseData,
  getOverTime
}
