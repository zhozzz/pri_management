/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-11-25 15:02:24
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-04 14:55:23
 */
import { MessageBox, Message } from 'element-ui'

function checkMessage (fnc) {
  MessageBox.confirm('确认操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      fnc()
    })
    .catch(err => {
      console.log(err)

      Message({
        type: 'info',
        message: '已取消操作'
      })
    })
}

export default checkMessage
