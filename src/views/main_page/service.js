/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-10 14:12:36
 * @LastEditors: fylih
 * @LastEditTime: 2019-10-16 16:02:45
 */
import axios from '@/utils/axios_setting'
import API from '@/api'
import globalUrl from '@/utils/global_url'
const getCriminal = async (
  data // 重点罪犯
) =>
  await axios
    .get(globalUrl.businessUrl + '/keyCriminal/count/' + data)
    .then(res => res)
const allCriminal = async (
  data // 全部罪犯
) =>
  await axios
    .get(globalUrl.businessUrl + '/criminalBase/AllCriminalCount/' + data)
    .then(res => res)
const prisonCriminal = async (
  data // 监狱下全部罪犯
) =>
  await axios
    .get(
      globalUrl.businessUrl + '/criminalBase/countCriminalByPrisonArea/' + data
    )
    .then(res => res)
const countCriminalByPrison = () =>
  axios
    .get(globalUrl.businessUrl + `/criminalBase/countCriminalByPrison`)
    .then(response => response)
const countDutyPoliceByPrison = async data =>
  await axios
    .get(globalUrl.businessUrl + '/duty/dutyUserNum/' + data)
    .then(res => res)
const getSuddenAccident = async (
  data // 突发事件数量
) =>
  await axios
    .post(globalUrl.businessUrl + '/emergencyEvent/Count', data)
    .then(res => res)
export {
  getCriminal,
  allCriminal,
  countCriminalByPrison,
  prisonCriminal,
  countDutyPoliceByPrison,
  getSuddenAccident
}
