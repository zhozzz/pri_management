/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-09 11:43:18
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-13 18:11:50
 */
import axios from '@/utils/axios_setting'
import _globalUrl from '@/utils/global_url'
import { download } from '@/utils'
import { formatDate } from '@/utils/date'

import breakSearchParamString from '@/utils/breakSearchParamString'

const getDept = async data =>
  await axios
    .get(_globalUrl.userUrl + '/compose/getChildrenTree/' + data)
    .then(res => res)
const getRiskType = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/hidden/getHiddenType/' + data)
    .then(res => res)
const getRiskTypeNum = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/hidden/getHiddenNum/' + data)
    .then(res => res)
const getRiskNum = async data =>
  await axios
    .get(_globalUrl.businessUrl + '/hidden/getHiddenNum/' + data)
    .then(res => res)
const getRiskLevel = async () =>
  await axios
    .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/HiddenLevel')
    .then(res => res)
const getDeptType = async () =>
  await axios
    .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/ORGANIZATION')
    .then(res => res)
const getPosition = async data =>
  await axios
    .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/HiddenPosition')
    .then(res => res)
const getRiskData = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/sel', data)
    .then(res => res)
const addRisk = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/add', data)
    .then(res => res)
const editRisk = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/editLevel', data)
    .then(res => res)
const needRisk = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/editNeedDate', data)
    .then(res => res)
const reportRisk = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/report', data)
    .then(res => res)
const exportData = async data =>
  await axios
    .post(_globalUrl.businessUrl + '/hidden/export', data, {
      //   responseType: 'arraybuffer'
      responseType: 'blob'
    })
    .then(msg => {
      // download(res)
      let url = window.URL.createObjectURL(msg.data) // 表示一个指定的file对象或Blob对象
      console.log(msg)
      let a = document.createElement('a')
      document.body.appendChild(a)
      //   let fileName = msg.headers['content-disposition']
      //     .split(';')[1]
      //     .split('=')[1] // filename名称截取
      let fileName = '隐患排查-' + formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      a.href = url
      a.download = fileName // 命名下载名称
      a.click() // 点击触发下载
      window.URL.revokeObjectURL(url)
    })
export {
  getDept,
  getRiskType,
  getRiskLevel,
  getPosition,
  getDeptType,
  getRiskData,
  getRiskNum,
  addRisk,
  editRisk,
  needRisk,
  reportRisk,
  getRiskTypeNum,
  exportData
}
