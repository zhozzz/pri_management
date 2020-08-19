/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 18:54:30
 * @LastEditors: fylih
 * @LastEditTime: 2019-10-17 11:14:05
 */
// 格式化日期

export function formatDate (date, fmt) {

    var o = {
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S+': date.getMilliseconds() // 毫秒
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            if (k === 'y+') {
                fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length))
            } else if (k === 'S+') {
                var lens = RegExp.$1.length
                lens = lens === 1 ? 3 : lens
                fmt = fmt.replace(
                    RegExp.$1,
                    ('00' + o[k]).substr(('' + o[k]).length - 1, lens)
                )
            } else {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length)
                )
            }
        }
    }
    return fmt
}

// 获取上一个月
export function getPreMonth (date) {
    var arr = date.split('-')
    var year = arr[0] // 获取当前日期的年份
    var month = arr[1] // 获取当前日期的月份
    var day = arr[2] // 获取当前日期的日
    var days = new Date(year, month, 0)
    days = days.getDate() // 获取当前日期中月的天数
    var year2 = year
    var month2 = parseInt(month) - 1
    if (month2 === 0) {
        // 如果是1月份，则取上一年的12月份
        year2 = parseInt(year2) - 1
        month2 = 12
    }
    var day2 = day
    var days2 = new Date(year2, month2, 0)
    days2 = days2.getDate()
    if (day2 > days2) {
        // 如果原来日期大于上一月的日期，则取当月的最大日期。比如3月的30日，在2月中没有30
        day2 = days2
    }
    if (month2 < 10) {
        month2 = '0' + month2 // 月份填补成2位。
    }
    var t2 = year2 + '-' + month2 + '-' + day2
    return t2
}

// 将日期区间变化为日期数组
export function getYearAndMonthAndDay (start, end) {
    function getDate (datestr) {
        var temp = datestr.split('-')
        return new Date(temp[0], temp[1] - 1, temp[2])
    }
    var dateAll = []
    var i = 0
    var startTime = getDate(start)
    var endTime = getDate(end)
    while (endTime.getTime() - startTime.getTime() >= 0) {
        var year = startTime.getFullYear()
        var month =
            (startTime.getMonth() + 1).toString().length === 1
                ? '0' + (startTime.getMonth() + 1).toString()
                : (startTime.getMonth() + 1).toString()
        var day =
            startTime.getDate().toString().length === 1
                ? '0' + startTime.getDate()
                : startTime.getDate()
        dateAll[i] = year + '-' + month + '-' + day
        startTime.setDate(startTime.getDate() + 1)
        i += 1
    }
    return dateAll
}

export default formatDate
