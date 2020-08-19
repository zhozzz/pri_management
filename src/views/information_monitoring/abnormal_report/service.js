/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:08:10
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-10 16:11:19
 */
import axios from "@/utils/axios_setting";
import API from "@/api";
import breakSearchParamString from "@/utils/breakSearchParamString";
import breakSearchParams from "@/utils/breakSearchParams";
import _globalUrl from "@/utils/global_url";

const getList = async data =>
    await axios
        .get(API.GET_AB_NORMAL_REPORT_LIST + breakSearchParamString(data))
        .then(res => res);
const getType = async data =>
    await axios
        .get(_globalUrl.userUrl + "/dictionary/option/" + data)
        .then(res => res);
const getViolateType = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/patrol/getTree/violateType")
        .then(res => res);

const insertData = async (data = {}) =>
    await axios.post(API.ADD_RECTIFY, breakSearchParams(data)).then(res => res);
const insertCheck = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/prison/check", breakSearchParams(data))
        .then(res => res);
const getCheckList = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/prison/getCheckRecord/" + data)
        .then(res => res);
const getTypeCharts = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/patrol/statistics/type/" + data)
        .then(res => res);
const getAreaCharts = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/patrol/statistics/area/" + data)
        .then(res => res);

const getCompleteData = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/patrol/statistics/isComplete/" + data)
        .then(res => res);

const getPrisonList = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/emergencyDrill/getSubDepartments/" + data)
        .then(res => res);
const getDeptList = async data =>
    await axios
        .get(_globalUrl.userUrl + "/compose/getChildrenTree/" + data)
        .then(res => res);
const addPatrol = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/patrol/addPatrol", data)
        .then(res => res);
const getPatrolList = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/patrol/getPatrolList", data)
        .then(res => res);
const getPatrolImage = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/patrol/getImageAndFiles/" + data)
        .then(res => res);
const editPatrol = async data =>
    await axios
        .put(_globalUrl.businessUrl + "/patrol/updatePatrol", data)
        .then(res => res);
const postRectify = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/patrol/postRectify", data)
        .then(res => res);
const selInform = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/patrol/selInform/" + data)
        .then(res => res);
const getPosition = async data =>
    await axios
        .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/HiddenPosition')
        .then(res => res)
const getRiskType = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/hidden/getHiddenType/' + data)
        .then(res => res)
const getRiskLevel = async () =>
    await axios
        .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/HiddenLevel')
        .then(res => res)
const getRiskNum = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/hidden/getHiddenNum/' + data)
        .then(res => res)

const addRisk = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/patrol/statistics/sendUnsafeNotice", data)
        .then(res => res);
const getRiskTypeNum = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/hidden/getHiddenNum/' + data)
        .then(res => res)
export {
    getList,
    insertData,
    getType,
    insertCheck,
    getCheckList,
    getTypeCharts,
    getAreaCharts,
    getCompleteData,
    getPrisonList,
    getDeptList,
    getViolateType,
    addPatrol,
    getPatrolList,
    getPatrolImage,
    editPatrol,
    postRectify,
    selInform,
    getPosition,
    getRiskType,
    getRiskLevel,
    getRiskNum,
    addRisk,
    getRiskTypeNum
};
