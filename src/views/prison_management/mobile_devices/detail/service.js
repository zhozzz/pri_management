/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-26 16:21:44
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-13 19:52:21
 */

import axios from '@/utils/axios_setting'
import breakSearchParams from '@/utils/breakSearchParams'
import _globalUrl from "@/utils/global_url";
import API from '@/api'
// 获取4G设备子列表
const getMobileDeviceManagementDetail = async data =>
    await axios
        .post(API.GET_MOBILE_DEVICE_MANAGEMENT_DETAIL, breakSearchParams(data))
        .then(res => res)
const updDeviceInfo = async data => {
    let user = JSON.parse(localStorage.getItem('user'))
    let updateUser = ''
    if (user) {
        updateUser = user.userGuid
    }
    return await axios
        .post(API.UPDATE_DVICE, { ...data, updateUser })
        .then(res => res)
}
const insertDeviceDetail = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/mobileDeviceManagement/insertDeviceDetail', data)
        .then(res => res)
const editDeviceDetail = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/mobileDeviceManagement/editDeviceDetail ', data)
        .then(res => res)
const mobileDeviceLog = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/mobileDeviceLog/list ', data)
        .then(res => res)
export {
    getMobileDeviceManagementDetail,
    updDeviceInfo, insertDeviceDetail,
    editDeviceDetail, mobileDeviceLog
}
