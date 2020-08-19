/*
 * @Description
 * @Author:
 * @Date: 2019-10-31 16:28:27
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 14:28:07
 */
export default function textColor () {
  let theme = JSON.parse(localStorage.getItem('theme'))
  let color = ''
  if (theme === 1) {
    color = '#000'
  } else if (theme === 2) {
    color = '#ccc'
  }
  return color
}
