/*
 * @Description: 时间段多功能配置
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 11:29:28
 * @LastEditors: fylih
 * @LastEditTime: 2019-10-17 11:15:24
 */
// export const pickerOptions = {
//   shortcuts: [
//     {
//       text: '最近一周',
//       onClick (picker) {
//         const end = new Date()
//         const start = new Date()
//         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
//         picker.$emit('pick', [start, end])
//       }
//     },
//     {
//       text: '最近一个月',
//       onClick (picker) {
//         const end = new Date()
//         const start = new Date()
//         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
//         picker.$emit('pick', [start, end])
//       }
//     },
//     {
//       text: '最近三个月',
//       onClick (picker) {
//         const end = new Date()
//         const start = new Date()
//         start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
//         picker.$emit('pick', [start, end])
//       }
//     }
//   ]
// }
// 日期选择器快捷设置
export const pickerOptions = {
  shortcuts: [
    {
      text: '昨天',
      onClick (picker) {
        const start = new Date()
        const end = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一周',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一月',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}
