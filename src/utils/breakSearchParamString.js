/*
 * @Description: 返回get Url 数据
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-29 11:30:20
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-06 16:15:19
 */
const breakSearchParamString = (data = {}) => {
  let user = JSON.parse(localStorage.getItem('user'))
  let tempData
  if (user) {
    tempData = { prisonId: user.prisonId, ...data }
  }
  let url = '?'
  Object.keys(tempData).forEach(item => {
    let val = tempData[item] ? tempData[item] : ''
    let param = item + '=' + val + '&'
    url += param
  })
  return url
}
export default breakSearchParamString
