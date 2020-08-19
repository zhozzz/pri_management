/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-09-10 19:36:26
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-25 17:17:16
 */
import _global from './global_url'

function $markKeyCriminal (criminalId, flag, fnc) {
  flag = parseInt(flag)
  let userId = JSON.parse(localStorage.getItem('user')).userGuid
  let warning =
    flag === 0 ? '确定取消其重点罪犯的标记?' : '标记该罪犯为重点罪犯?'
  this.$confirm(warning, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.axios
      .put(
        _global.businessUrl +
          '/keyCriminal/markAsKey/' +
          criminalId +
          '/' +
          flag +
          '/' +
          userId
      )
      .then(res => {
        // this.$message.success(res)
        this.$notify({ title: '提示', message: res, duration: 0 })
        fnc()
      })
      .catch(err => {
        // this.$message.error('系统异常，操作失败')
        this.$notify({ title: '提示', message: err.data.msg, duration: 0 })
      })
  })
}

export default $markKeyCriminal
