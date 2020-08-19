/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 16:24:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-02 17:49:53
 */
import '../src/styles/css_reset.css' // normalize样式重置
import '../src/styles/global.css' // 引入项目全局样式
import '../src/styles/yn_standard_style.less' // 引入项目全局标准版样式
import '../src/styles/yn_technology_style.less' // 引入项目全局科技版样式
import 'element-ui/lib/theme-chalk/index.css' // element样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'babel-polyfill' // 针对IE浏览器引用es6的语法转换
import '@/utils/rem_resize.js' // 屏幕改变后改变rem大小
import '@/assets/font/font.css'
import 'url-search-params-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import element from './utils/element-setting' // 引入按需加载的element
import axios from './utils/axios_setting' // 引入axios二次封装（token，状态码）
import inputValid from './utils/input_valid' // 引入input前端特殊字符校验
import globalUrl from './utils/global_url' // 引入全局的url
import infiniteScroll from 'vue-infinite-scroll' // 引入无限滚动加载插件
import VueQuillEditor from 'vue-quill-editor' // 富文本
import markKeyCriminal from './utils/markKeyCriminal' // 标记/取消标记重点罪犯功能
import formatDate from './utils/date' // 时间格式转换
import globalWs from '@/utils/global_ws'
import wsUsers from '@/utils/global_ws_users'
import checkMessage from '@/utils/checkMessage'
import selPurview from '@/utils/selPurview'
// import $ from 'jquery'
import Videojs from 'video.js'
import 'video.js/dist/video-js.css'

require('echarts/theme/macarons')
Vue.use(element, { size: 'small' }) // 使用elementUi
Vue.use(infiniteScroll) // 使用滚动加载
Vue.use(VueQuillEditor) // 使用富文本
Vue.prototype.axios = axios // 为axios添加vue的实例
Vue.prototype._iptValid = inputValid // 为特殊字符校验添加vue的实例
Vue.prototype._global = globalUrl // 为全局Url添加实例
Vue.config.productionTip = false
Vue.prototype.$markKeyCriminal = markKeyCriminal // 标记/取消标记重点罪犯
Vue.prototype.$checkMessage = checkMessage // 标记/取消标记重点罪犯
Vue.prototype.$selPurview = selPurview // 标记/取消标记重点罪犯

Vue.prototype.formatDate = formatDate
Vue.prototype._globalWs = globalWs // 全局ws
Vue.prototype._globalWsUsers = wsUsers
Vue.prototype.bus = new Vue()
Vue.prototype.wsInterval = new Vue()

// Vue.prototype.$ = $
Vue.prototype.$video = Videojs
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
