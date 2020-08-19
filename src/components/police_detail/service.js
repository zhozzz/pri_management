/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:16:24
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-13 17:59:22
 */

import axios from '@/utils/axios_setting'
import API from '@/api'
import _globalUrl from "@/utils/global_url";

// 获取当前值班警察
const getPoliceDetail = async data =>
    await axios
        .get(_globalUrl.userUrl + '/userManage/getUserById/' + data['policeId'])
        .then(res => res)
export { getPoliceDetail }
