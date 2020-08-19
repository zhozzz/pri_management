/*
 * @Description:
 * @Author:
 * @Date: 2019-09-11 17:17:01
 * @LastEditors: fylih
 * @LastEditTime: 2019-09-21 17:17:23
 */
import _global from '@/utils/global_url'
import { getDeptId } from '@/utils'
import axios from '@/utils/axios_setting'
// 日期选择框变化或者页面刚加载的时候调整表格的显示并从后台获取数据
const days = date => {
  let sYear = new Date(date).getFullYear()
  let sMonth = new Date(date).getMonth() + 1
  let sDate = new Date(sYear, sMonth)
  // days是一个月有多少天
  let days =
    Math.floor((new Date(sDate) - new Date(date)) / 1000 / (60 * 60 * 24)) + 1
  return days
}

const blank = date => {
  let day = new Date(date).getDay()
  // 日历前面的留空
  if (day === 0) day = 7
  let blank = (day - 1) * 14.28 + '%'
  return blank
}

// 将当前的日期转换为'yyyy-MM'格式
const format = () => {
  let y = new Date().getFullYear()
  let m = new Date().getMonth() + 1
  if (m < 10) m = '0' + m
  return y + '-' + m
}
const getList = async date => {
  let deptId = getDeptId()
  return await axios
    .get(
      _global.businessUrl +
        '/dateConfig/sel/' +
        date +
        '/' +
        deptId +
        '?' +
        Math.random()
    )
    .then(res => res)
}
const setType = function (index, dateType) {
  if (dateType === null || dateType === undefined) return
  let list = []
  list[index] = {}
  list[index].type = dateType
  if (dateType === '1') {
    list[index].color = '#ffff00'
  } else if (dateType === '0') {
    list[index].color = '#409eff'
  } else if (dateType === '2') {
    list[index].color = '#0eff00'
  } else {
    list[index].color = '#999494'
  }
  return list[index]
}
// 显示popover的时间段
const dateShow = val => {
  let str = ''
  if (val) {
    for (var i = 0; i < val.length; i++) {
      str += val[i].startTime + '-' + val[i].endTime + ' \n '
    }
  }
  return str
}
export { days, format, blank, getList, setType, dateShow }
