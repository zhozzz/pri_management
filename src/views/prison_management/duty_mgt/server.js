/*
 * @Description: 
 * @Author: zhuhao
 * @Date: 2020-01-03 11:04:02
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-14 16:26:37
 */
import _globalUrl from "@/utils/global_url";
import axios from "@/utils/axios_setting";

const getPrisonDutyTable = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/duty/prisonCheckRota/" + data)
        .then(res => res);

const getProvinDutyTable = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/duty/provincialCheckRota/" + data)
        .then(res => res);
const getDepartCheckRota = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/duty/departCheckRota/" + data)
        .then(res => res);
const dutyStatistics = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/duty/dutyStatistics/" + data)
        .then(res => res);
const getDeptList = async data =>
    await axios
        .get(_globalUrl.userUrl + "/compose/getChildrenTree/" + data)
        .then(res => res);
const getRecordList = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/dayWork/queryDutyRecords", data)
        .then(res => res);
const realTimeCreate = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/dayWork/realTimeCreate", data)
        .then(res => res);
const getLeaderList = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/duty/leaderPatrolQuery/" + data)
        .then(res => res);
const leaderPatrolAdd = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/duty/leaderPatrolAdd", data)
        .then(res => res);
const leaderPatrolDel = async data =>
    await axios
        .delete(_globalUrl.businessUrl + "/duty/leaderPatrolDelete/" + data)
        .then(res => res);
const getRegisterExplain = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/duty/getRegisterExplain" , data)
        .then(res => res);
const addRegisterExplain = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/duty/addRegisterExplain", data)
        .then(res => res);
export {
    getPrisonDutyTable,
    getProvinDutyTable, dutyStatistics,
    getDepartCheckRota, getDeptList,
    getRecordList, realTimeCreate,
    getLeaderList, leaderPatrolAdd,
    leaderPatrolDel,getRegisterExplain,
    addRegisterExplain
}