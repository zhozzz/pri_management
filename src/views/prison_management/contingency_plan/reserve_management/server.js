/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2020-01-10 10:41:16
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-20 11:03:12
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

// 获取预案列表
const getReserveList = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/businessEmergencyPlan/selAll', data)
        .then(res => res)

// 获取预案小组列表
const getReserveGroupList = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyGroup/selAll', data)
        .then(res => res)
// 新增预案小组
const addGroup = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyGroup/add', data)
        .then(res => res)
// 新增预案
const addReserve = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/businessEmergencyPlan/add', data)
        .then(res => res)
// 编辑预案小组
const editGroup = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/emergencyGroup/update', data)
        .then(res => res)
// 修改预案
const updateReserve = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/businessEmergencyPlan/update', data)
        .then(res => res)
// 删除预案小组
const delGroup = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/emergencyGroup/delete', data)
        .then(res => res)
// 删除预案
const delReverse = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/businessEmergencyPlan/delete', data)
        .then(res => res)

// 对讲机list
const getIntercom = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/intercom/query', data)
        .then(res => res)
// 预案类型
const getPlanType = async () =>
    await axios
        .get(_globalUrl.userUrl + '/dictionary/option/PlanType')
        .then(res => res)
// 预案小组Options
const getPlanGroupType = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/emergencyGroup/sel/' + data)
        .then(res => res)

const getRules = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/businessEmergencyPlan/selRules')
        .then(res => res)
const editRules = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/businessEmergencyPlan/updateRules', data)
        .then(res => res)
export {
    getReserveList,
    getReserveGroupList,
    getIntercom,
    addGroup,
    editGroup,
    delGroup,
    getPlanType,
    addReserve,
    updateReserve,
    delReverse,
    getPlanGroupType,
    getRules,
    editRules
}
