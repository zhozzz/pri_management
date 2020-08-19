/*
 * @Description:
 * @Author:
 * @Date: 2019-10-28 15:54:38
 * @LastEditors: fylih
 * @LastEditTime: 2019-10-31 11:19:05
 */
window.onresize = function () {
  fnResize()
}
function fnResize () {
  let designSize = 1920 // 设计图尺寸
  let html = document.documentElement
  let wW = html.clientWidth // 窗口宽度
  let rem = (wW * 14) / designSize
  document.documentElement.style.fontSize = rem + 'px'
}
fnResize()
