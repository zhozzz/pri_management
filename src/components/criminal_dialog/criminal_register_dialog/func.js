/*
 * @Description:
 * @Author:
 * @Date: 2019-08-29 18:04:09
 * @LastEditors: fylih
 * @LastEditTime: 2019-09-24 10:33:59
 */
import axios from '@/utils/axios_setting'
import _global from '@/utils/global_url'

const judgeBtnVisible = async (params, id) => {
  await axios
    .get(
      _global.businessUrl +
        '/criminalData/checkCriminalStatus/' +
        params +
        '/' +
        id
    )
    .then(res => res)
}

export { judgeBtnVisible }
