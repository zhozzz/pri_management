/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-17 17:04:32
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-07 14:41:14
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'
import { download } from '@/utils'

// 获取模板对应数据
const getReportInfo = async data =>
    await axios
        .get(
            // _globalUrl.businessUrl + '/reportComplexTemplate/getFieldTree/' + data
            _globalUrl.businessUrl + '/reportTemplate/selOne/' + data
        )
        .then(res => res)
// 模板列表
const getTemplateList = async (data) =>
    await axios
        // .get(_globalUrl.businessUrl + '/reportTemplate/selAll/' + data)
        .post(_globalUrl.businessUrl + '/reportTemplate/selAll', data)
        .then(res => res)

const getWeekDay = async (data) =>
    await axios
        .get(_globalUrl.businessUrl + '/reportTemplate/getWeekDay/' + data)
        .then(res => res)

// 模板删除
const delTemplate = async data =>
    await axios
        // .delete(
        //     _globalUrl.businessUrl + '/reportTemplate/delete/' +
        //     data
        // )
        //软删除
        .put(_globalUrl.businessUrl + '/reportTemplate/deleteSoft/' + data)
        .then(res => res)
// 模板导出
const exportTemplate = data => {
    location.href =
        _globalUrl.businessUrl + '/reportTemplate/exportReport/' + data
    // axios
    //     .get(
    //         _globalUrl.businessUrl + '/reportTemplate/exportReport/' + data
    //     )
    //     .then(res => download(res))
}


const selOneDetail = async data =>
    await axios
        .get(
            _globalUrl.businessUrl + '/reportTemplate/selOneDetail/' +
            data
        )
        .then(res => res)
const selOneDetailByParam = async data =>
    await axios
        .post(
            _globalUrl.businessUrl + '/reportTemplate/selOneDetailByParam',
            data
        )
        .then(res => res)

const downReport = async data =>
    await axios
        .put(
            _globalUrl.businessUrl + '/reportTemplate/downReport/' +
            data
        )
        .then(res => res)
const postReport = async (data, body) =>
    await axios
        .post(
            _globalUrl.businessUrl + '/reportTemplate/postReport/' + data, body
        )
        .then(res => res)
const deleteOneRecord = async data =>
    await axios
        .delete(
            _globalUrl.businessUrl + '/reportTemplate/deleteOneRecord/' +
            data
        )
        .then(res => res)
const updateOneRecord = async data =>
    await axios
        .put(
            _globalUrl.businessUrl + '/reportTemplate/updateOneRecord',
            data
        )
        .then(res => res)

const toOld = async data =>
    await axios
        .put(
            _globalUrl.businessUrl + '/reportTemplate/toOld/' +
            data
        )
        .then(res => res)


const handleAuthorize = async data =>
    await axios
        .put(
            _globalUrl.businessUrl + '/reportTemplate/handleAuthorize/' +
            data
        )
        .then(res => res)
export {
    getReportInfo,
    getTemplateList,
    delTemplate,
    exportTemplate,
    selOneDetail,
    downReport,
    postReport,
    deleteOneRecord,
    updateOneRecord,
    toOld,
    selOneDetailByParam,
    getWeekDay,
    handleAuthorize
}
