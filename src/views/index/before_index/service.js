/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-10 14:12:36
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-08 15:11:51
 */
import axios from '@/utils/axios_setting'
import globalUrl from '@/utils/global_url'
const getCriminalNum = async (
  data // 罪犯数量
) =>
  await axios
    .get(globalUrl.businessUrl + '/criminalBase/AllCriminalCount/' + data)
    .then(res => res)
const getPoliceNum = async (
  data // 罪犯数量
) =>
  await axios
    .get(globalUrl.userUrl + '/userManage/selPoliceCount/' + data)
    .then(res => res)
const getmunedata = async (
  data // 用户id
) =>
  await axios
    .get(globalUrl.userUrl + '/menu/getMyMenuTree/' + data)
    .then(res => res)
const prisonName = async (
  data // 用户监狱名称
) =>
  await axios
    .get(globalUrl.userUrl + '/department/prisonName/' + data)
    .then(res => res)
export { getCriminalNum, getPoliceNum, getmunedata, prisonName }
