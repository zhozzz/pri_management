/*
 * @Description: 返回post Url 数据
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-29 11:30:20
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-06 16:15:25
 */
const breakSearchParams = (data = {}) => {
    let user = JSON.parse(localStorage.getItem('user'))
    let tempData
    if (user) {
        tempData = { prisonId: user.prisonId, ...data }
    }
    let param = new URLSearchParams()
    Object.keys(tempData).forEach(item => {
        let val = tempData[item] ? tempData[item] : ''
        param.append(item, val)
    })


    return param
}
export default breakSearchParams
