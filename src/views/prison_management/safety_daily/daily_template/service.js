/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-09 11:43:18
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-11 17:32:08
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const creatTemplate = async data =>
    await axios
        .post(
            _globalUrl.businessUrl + '/supervise/addItem',
            data
        )
        .then(res => res)

const useTemplates = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            '/supervise/updateItemStatus',
            data
        )
        .then(res => res)
const editTemplates = async data =>
    await axios
        .post(
            _globalUrl.businessUrl + '/supervise/updateItem',
            data
        )
        .then(res => res)
const delTemplate = async data =>
    await axios
        .delete(
            _globalUrl.businessUrl +
            '/supervise/removeItem/' +
            data
        )
        .then(res => res)

// 拼接参数
const setDataString = data => {
    let url = ''
    data.forEach(item => {
        let params
        params = 'drillIds=' + item + '&'
        url += params
    })
    url = url.substr(0, url.length - 1)

    return url
}

const getDailyDataList = async data =>
    await axios
        .post(
            _globalUrl.businessUrl +
            '/supervise/getList',
            data
        )
        .then(res => res)

export {
    creatTemplate,
    useTemplates,
    editTemplates,
    delTemplate,
    getDailyDataList
}
