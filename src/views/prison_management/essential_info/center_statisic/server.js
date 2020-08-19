/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-12-14 14:24:00
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-21 22:11:19
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'
const subTime = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/dataReport/updateTimeConfig/' + data)
        .then(res => res)
const getTime = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selTimeConfig')
        .then(res => res)
const subForm = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/dataReport/add', data)
        .then(res => res)
const getForm = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selOneDay/' + data)
        .then(res => res)
const getDesc = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selReportDescription')
        .then(res => res)
const editDesc = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/dataReport/updateReportDescription', data)
        .then(res => res)
const getDeptTreeForBaseData = async (deptId, data) =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/getDeptTreeForBaseData/' + deptId + "/" + data)
        .then(res => res)

const getAreaList = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/queryLeftTreeWithState/' + data)
        .then(res => res)
const selSevenDay = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selSevenDay/' + data)
        .then(res => res)
const selProSevenDay = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selProvinceSevenDay/' + data)
        .then(res => res)
const selPrisonSevenDay = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selPrisonSevenDay/' + data)
        .then(res => res)

const selProvinceSevenDayMap = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selProvinceSevenDayMap/' + data)
        .then(res => res)
const selPrisonSevenDayMap = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selPrisonSevenDayMap/' + data)
        .then(res => res)
const selPermission = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selPermission/' + data)
        .then(res => res)
const applyPermission = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/applyPermission/' + data)
        .then(res => res)
const authorizePermission = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/authorizePermission/' + data)
        .then(res => res)
const selLibrary = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selLibrary/' + data)
        .then(res => res)
const selIsReport = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/selIsReport/' + data)
        .then(res => res)

// 新增自定义项
const addDIY = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/customFiled/insertFiledList', data)
        .then(res => res)

const deleteDIY = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/customFiled/deleteFiled/' + data)
        .then(res => res)
const editDIY = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/customFiled/updateFiled', data)
        .then(res => res)
const getDIYList = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/customFiled/queryFiledList')
        .then(res => res)
//查询自定义项
const queryReportValue = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/fieldData/queryReportValue?' + data)
        .then(res => res)
const queryChartList = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/fieldData/queryChartList?' + data)
        .then(res => res)
const queryTreeAndChartList = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/fieldData/queryTreeAndChartList?' + data)
        .then(res => res)
const queryPrisonTreeAndChartList = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/fieldData/queryPrisonTreeAndChartList?' + data)
        .then(res => res)
const queryJqChartList = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/fieldData/queryJqChartList?' + data)
        .then(res => res)
//上报自定义项
const updateFieldValue = async data =>
    await axios
        .put(_globalUrl.businessUrl + '/fieldData/updateFieldValue', data)
        .then(res => res)

//打回上报
const rejectReport = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/dataReport/rejectReport', data)
        .then(res => res)
//查看打回原因
const seeReject = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/viewRecalledReport/' + data)
        .then(res => res)
//应用本地
const prisonAreaLocalSaveData = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/dataReport/prisonAreaLocalSaveData/' + data)
        .then(res => res)

const localSave = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/fieldData/localSave', data)
        .then(res => res)
const getLocalData = async data =>
    await axios
        .get(_globalUrl.businessUrl + '/fieldData/getLocalData/' + data)
        .then(res => res)
const findFieldListData = async data =>
    await axios
        .post(_globalUrl.businessUrl + '/dataReport/findFieldListData', data)
        .then(res => res)
export {
    subTime,
    getTime,
    subForm,
    getForm,
    getDesc,
    editDesc,
    getDeptTreeForBaseData,
    selSevenDay,
    selPrisonSevenDay,
    selProSevenDay,
    selPermission,
    applyPermission,
    selLibrary,
    selProvinceSevenDayMap,
    selPrisonSevenDayMap,
    selIsReport,
    getAreaList,
    addDIY,
    deleteDIY,
    editDIY,
    getDIYList,
    rejectReport,
    seeReject,
    queryReportValue,
    updateFieldValue,
    queryChartList,
    queryTreeAndChartList,
    queryPrisonTreeAndChartList,
    queryJqChartList,
    prisonAreaLocalSaveData,
    authorizePermission,
    localSave,
    getLocalData,
    findFieldListData
}
