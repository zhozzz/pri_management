/*
 * @Description:
 * @Author:
 * @Date: 2019-08-28 10:45:48
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-11 10:52:43
 */
import axios from 'axios'
import router from '@/router'
import { MessageBox } from 'element-ui'
import _globalUrl from '@/utils/global_url'
import _globalWs from '@/utils/global_ws'
const quit = function () {
  MessageBox.confirm('注销将返回登陆页，确定注销？', '注销', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.replace({
      name: 'login'
    })
    _globalWs.ws.close()
    //   if (wsInterVal) {
    //       clearInterval(wsInterVal);
    //   }
    let userGuid = JSON.parse(localStorage.getItem('user')).userGuid
    axios
      .post(_globalUrl.userUrl + '/userManage/logout/' + userGuid)
      .then(res => {
        let theme = window.localStorage.getItem('theme')
        window.localStorage.clear()
        window.sessionStorage.clear()
        window.localStorage.setItem('theme', theme)
      })
      .catch(() => {})
  })
}
export { quit }
