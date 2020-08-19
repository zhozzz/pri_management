/*
 * @Description: 查询部门
 * @Author:
 * @Date: 2019-08-30 18:28:36
 * @LastEditors: fylih
 * @LastEditTime: 2019-08-31 11:42:28
 */
import axios from 'axios'
import _globalUrl from '@/utils/global_url'
const queryInfoDept = async () => {
  let deptIds = []
  let user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    await axios
      .get(_globalUrl.userUrl + '/compose/getChildrenTree/' + user.prisonId)
      .then(res => {
        deptIds = res.list.map(item => {
          return {
            label: item.departName,
            value: item.id
          }
        })
      })
    return deptIds
  }
}

export { queryInfoDept }
