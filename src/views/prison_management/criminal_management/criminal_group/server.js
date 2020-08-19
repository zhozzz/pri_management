/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-12-25 17:46:22
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-17 11:25:13
 */
import _globalUrl from "@/utils/global_url";
import axios from "@/utils/axios_setting";

const getPrisonTree = async data =>
    await axios
        .get(_globalUrl.userUrl + "/compose/getPrisonTree/" + data)
        .then(res => res);
const getNogroup = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/criminalGroup/getNoGroup/" + data)
        .then(res => res);
const getDeptType = async data =>
    await axios
        .get(_globalUrl.userUrl + "/dictionary/option/ORGANIZATION")
        .then(res => res);
const getAreaCriminalList = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/criminalGroup/selCriminalByParam", data)
        .then(res => res);
const addGroup = async data =>
    await axios
        .post(_globalUrl.businessUrl + "/criminalGroup/addGroup", data)
        .then(res => res);
const getGroupList = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/criminalGroup/selList/" + data)
        .then(res => res);
const selGroupCriminal = async data =>
    await axios
        .get(_globalUrl.businessUrl + "/criminalGroup/selGroupCriminal/" + data)
        .then(res => res);
const deleteGroup = async data =>
    await axios
        .delete(_globalUrl.businessUrl + "/criminalGroup/deleteGroup/" + data)
        .then(res => res);
const upGroup = async data => {
    await axios
        .put(_globalUrl.businessUrl + "/criminalGroup/updateGroup", data)
        .then(res => res);
};
const deleteOne = async data =>
    await axios
        .delete(_globalUrl.businessUrl + "/criminalGroup/deleteOne/" + data)
        .then(res => res);
const deleteList = async data =>
    await axios
        .delete(_globalUrl.businessUrl + "/criminalGroup/deleteMany", { data: data })
        .then(res => res);
export {
    getPrisonTree,
    getDeptType,
    getAreaCriminalList,
    addGroup,
    getGroupList,
    selGroupCriminal,
    deleteGroup,
    upGroup,
    deleteOne,
    getNogroup,
    deleteList
};
