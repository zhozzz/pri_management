/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:16:24
 * @LastEditors  : zhuhao
 * @LastEditTime : 2019-12-24 15:56:26
 */

import axios from "@/utils/axios_setting";
import API from "@/api";
import _globalUrl from "@/utils/global_url";

// 获取违规详情
const getDetail = async data =>
  await axios.get(API.GET_REPORT_DETAIL + "/" + data["id"]).then(res => res);
const selInfo = async data =>
  await axios
    .get(_globalUrl.businessUrl + "/patrol/selViolationInfo/" + data)
    .then(res => res);
export { getDetail, selInfo };
