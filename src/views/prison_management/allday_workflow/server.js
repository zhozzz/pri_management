/*
 * @Description: 
 * @Author: zhuhao
 * @Date: 2020-01-10 10:41:16
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-11 14:23:32
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

const getWorkProcess = async (data) =>
    await axios
        .get(_globalUrl.businessUrl + '/workProcess/query/' + data)
        .then(res => res)
const getRank = async (data) =>
    await axios
        .get(_globalUrl.userUrl + '/dictionary/option/WorkRank')
        .then(res => res)
const create = async (data) =>
    await axios
        .post(_globalUrl.businessUrl + '/workProcess/create', data)
        .then(res => res)
const deleteWork = async (data) =>
    await axios
        .delete(_globalUrl.businessUrl + '/workProcess/delete/' + data)
        .then(res => res)
const editWork = async (data) =>
    await axios
        .put(_globalUrl.businessUrl + '/workProcess/edit', data)
        .then(res => res)
const getDayWork = async (data) =>
    await axios
        .get(_globalUrl.businessUrl + '/dayWork/queryDayWorkFlow/' + data)
        .then(res => res)
const finish = async (data) =>
    await axios
        .post(_globalUrl.businessUrl + '/dayWork/finish', data)
        .then(res => res)
const deleteUndo = async (data) =>
    await axios
        .delete(_globalUrl.businessUrl + '/dayWork/deleteUndo/' + data)
        .then(res => res)
const getDeptRota = async (data) =>
    await axios
        .get(_globalUrl.businessUrl + '/duty/departCheckRota/' + data)
        .then(res => res)
export {
    getWorkProcess, getRank, create, deleteWork, editWork, getDayWork, finish, deleteUndo, getDeptRota
}