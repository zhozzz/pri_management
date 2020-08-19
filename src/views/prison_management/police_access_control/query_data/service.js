/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:08:10
 * @LastEditors: wentoo
 * @LastEditTime: 2019-08-28 15:10:19
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import breakSearchParamString from '@/utils/breakSearchParamString'
import _globalUrl from '@/utils/global_url'

const getPoliceAccessControlList = async data =>
  await axios
    .get(API.GET_POLICE_ACCESS_CONTROL_LIST + breakSearchParamString(data))
    .then(res => res)
const getPoliceDetail = async data =>
  await axios
    .get(
      _globalUrl.abdoorUrl + '/abDoor/getPoliceDetails/' + data['policeId']
    )
    .then(res => res)
export { getPoliceAccessControlList, getPoliceDetail }
