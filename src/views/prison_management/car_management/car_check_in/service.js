/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 14:16:47
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-05 18:08:07
 */
import axios from '@/utils/axios_setting'
import breakSearchParamString from '@/utils/breakSearchParamString'
import API from '@/api'
// 入监历史记录
const getPrisonOutSideCarInfo = async data =>
  await axios
    .get(API.GET_PRISON_OUT_SIDE_CAR_INFO + breakSearchParamString(data))
    .then(res => res)
// 入监登记
const carCheckIn = async data =>
  await axios.post(API.INSERT_CAR_CHECK_IN, data).then(res => res)
// 当前在监车辆
const getInPrisonCars = async data =>
  await axios
    .get(API.GET_IN_PRISON_CARS + breakSearchParamString(data))
    .then(res => res)
// 车辆离监操作
const carDeparture = async data =>
  await axios.post(API.CAR_DEPARTURE, data).then(res => res)
// 获取当前值班警察
const getDutyPolice = async data =>
  await axios
    .get(API.DUTY_POLICE + breakSearchParamString(data))
    .then(res => res)
// 获取车辆历史记录
const getHistory = async data =>
  await axios
    .get(API.GET_HISTORY_CAR_LIST + breakSearchParamString(data))
    .then(res => res)
const getOverTime = async () =>
  await axios.get(API.GET_OVER_TIME).then(res => res)
export {
  getPrisonOutSideCarInfo,
  getInPrisonCars,
  carDeparture,
  getDutyPolice,
  carCheckIn,
  getHistory,
  getOverTime
}
