/*
 * @Description: 获取部门
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 16:50:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-19 14:45:17
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'
import breakSearchParamString from '@/utils/breakSearchParamString'
// 获取部门
// getDeptAreaByPrisonId
const getDepartmentList = async () =>
  await axios
    .get(
      _globalUrl.userUrl +
        '/compose/getDeptAreaByPrisonId' +
        breakSearchParamString()
    )
    .then(res => res)
export { getDepartmentList }
