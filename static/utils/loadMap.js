/*
 * @Description:
 * @Author:
 * @Date: 2019-11-15 11:35:25
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-15 11:35:54
 */
var PV = undefined
const loadScript = function(url, callback) {
  let script = document.createElement('script')
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
  if (script.readyState) {
    // IE
    script.onreadystatechange = function() {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    // 其他浏览器
    script.onload = function() {
      callback()
    }
  }
}
loadScript(
  'http://10.1.10.75/ThirdParty/SuperMap_iClient3D_10i_for_WebGL_CN/Build/Cesium/Cesium.js',
  () => {
    loadScript(
      'http://10.1.10.75/PrisonVisualization/PrisonVisualization.js',
      () => {
        PV = PrisonVisualization
      }
    )
  }
)
