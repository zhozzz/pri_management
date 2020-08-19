/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-12-02 17:47:09
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-02 19:30:42
 */
// 用户权限查询
function selPurview (rol) {
  let prisonPermissions = JSON.parse(localStorage.getItem('user'))
    .prisonPermissions

  return prisonPermissions.indexOf(rol) >= 0
}

export default selPurview
