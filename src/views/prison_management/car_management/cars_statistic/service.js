/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 14:16:47
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-04 16:09:14
 */
import axios from '@/utils/axios_setting'
import breakSearchParamString from '@/utils/breakSearchParamString'
import API from '@/api'

const getOutsideCarStatisticalData = async data =>
  await axios
    .get(API.GET_OUTSIDE_CAR_STATISTICAL_DATA + breakSearchParamString(data))
    .then(res => res)
const getStayTimeForPeriod = async data =>
  await axios
    .get(API.GET_STAY_TIME_FOR_PERIOD + breakSearchParamString(data))
    .then(res => res)
export { getOutsideCarStatisticalData, getStayTimeForPeriod }
