/*
 * @Description:
 * @Author:
 * @Date: 2019-09-07 16:41:29
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-09 14:45:10
 */
const loadScript = function (url, callback) {
  let script = document.createElement('script')
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
  if (script.readyState) {
    // IE
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    // 其他浏览器
    script.onload = function () {
      callback()
    }
  }
}
export { loadScript }
