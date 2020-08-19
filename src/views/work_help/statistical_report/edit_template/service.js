/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-17 17:04:32
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-20 11:42:09
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'

// 获取模板数据
const add = async (data) =>
    await axios
        .post(_globalUrl.businessUrl + '/reportTemplate/add', data)
        .then(res => res)

export { add }
