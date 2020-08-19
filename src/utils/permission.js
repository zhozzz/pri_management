/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-18 15:29:26
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-27 15:37:31
 */
// 根据权限控制页面上button的显示隐藏
// val: 对应页面权限key
let user = JSON.parse(localStorage.getItem('user'))
let permissions = []
if (user) {
  permissions = user.prisonPermissions
}
const btnPermission = val => {
  return permissions.indexOf(val) >= 0
}
// const btnPermission = () => true
export default btnPermission
