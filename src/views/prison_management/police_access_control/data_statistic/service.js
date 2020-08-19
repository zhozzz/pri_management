/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 17:40:25
 * @LastEditors: wentoo
 * @LastEditTime: 2019-08-28 17:40:34
 */
/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:08:10
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-06 17:18:44
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import breakSearchParamString from '@/utils/breakSearchParamString'

const getPoliceAccessControlSummary = async (data = {}) =>
  await axios
    .get(API.GET_POLICE_ACCESS_CONTROL_SUMMARY + breakSearchParamString(data))
    .then(res => res)
export { getPoliceAccessControlSummary }
