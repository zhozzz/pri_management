/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-26 16:21:44
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-13 10:45:17
 */

import axios from '@/utils/axios_setting'
import breakSearchParams from '@/utils/breakSearchParams'
import { download } from '@/utils'
import API from '@/api'
import _globalUrl from "@/utils/global_url";

// 获取4G设备汇总列表
const getMobileDeviceManagementList = async data =>
    await axios
        .post(API.GET_MOBILE_DEVICE_MANAGEMENT, breakSearchParams(data))
        .then(res => res)
const getTotalMobileDevice = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/mobileDeviceManagement/getTotalMobileDevice', breakSearchParams(data))
        .then(res => res)
const insertSelective = async data =>
    await axios.post(API.INSERT_MOBILE_DEVICE, data).then(res => res)

const editMobileDevice = async data =>
    await axios.post(API.EDIT_MODILE_DEVICE, data).then(res => res)

const mobileDeviceEexport = async data =>
    await axios
        .post(API.MOBILE_DEVICE_EXPORT, breakSearchParams(data), {
            responseType: 'arraybuffer'
        })
        .then(res => {
            console.log(res, res['Content-disposition'])

            download(res)
        })
        .catch(er => { })
export {
    getMobileDeviceManagementList,
    insertSelective,
    mobileDeviceEexport,
    editMobileDevice, getTotalMobileDevice
}
