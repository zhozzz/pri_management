/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-30 10:49:12
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-14 17:29:31
 */

import axios from '@/utils/axios_setting'
import breakSearchParams from '@/utils/breakSearchParams'
import breakSearchParamString from '@/utils/breakSearchParamString'
import { Loading } from 'element-ui'
// import { download } from '@/utils'
import API from '@/api'

const getMajorInfo = async data =>
    await axios.post(API.GET_MAJOR_INFO, breakSearchParams(data)).then(res => res)
const insertSelective = async data =>
    await axios.post(API.TITLE_INSERT, data).then(res => res)
const updateTitle = async data =>
    await axios.post(API.TITLE_UPDATE, data).then(res => res)
const getNoticePublicDetail = async data =>
    await axios
        .post(API.GET_NOTICE_PUBLIC_DETAIL, breakSearchParams(data))
        .then(res => res)
const editNoticePublic = async data =>
    await axios
        .post(API.EDIT_NOTICE_PUBLIC, breakSearchParams(data))
        .then(res => res)
const noticeConfirmInfo = async data =>
    await axios.post(API.NOTICE_CONFIRM_INFO, data).then(res => res)
const noticeConfirmMessage = async data =>
    await axios.post(API.CONFIRM_MESSAGE, data).then(res => res)
        .then(res => res)

// 获取部门
const getDepartmentList = async data =>
    await axios.post(API.GET_DEPARTMENT, breakSearchParams(data)).then(res => res)
const uploadFiles = async data =>
    await axios.post(API.UPLOAD_FILES, data).then(res => res)
const majorDownload = async data => {
    let loadingInstance = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })

    setTimeout(() => {
        loadingInstance.close()
    }, 3000)
    location.href = API.DOWNLOAD + data
}

const majorAddList = async data =>
    await axios.post(API.MAJOR_ADD_LIST, data).then(res => res)

export {
    getMajorInfo,
    insertSelective,
    getNoticePublicDetail,
    getDepartmentList,
    updateTitle,
    editNoticePublic,
    uploadFiles,
    majorDownload,
    noticeConfirmInfo,
    majorAddList,
    noticeConfirmMessage
}
