/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 17:28:32
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-26 13:54:49
 */
import { debounce } from '../index'

export default {
  data () {
    return {
      $_sidebarElm: null,
      ii: 0
    }
  },
  mounted () {
    this.$_initResizeEvent()
    this.$_initSidebarResizeEvent()
  },
  beforeDestroy () {
    this.$_destroyResizeEvent()
    this.$_destroySidebarResizeEvent()
  },
  // to fixed bug when cached by keep-alive
  // https://github.com/PanJiaChen/vue-element-admin/issues/2116
  activated () {
    this.$_initResizeEvent()
    this.$_initSidebarResizeEvent()
  },
  deactivated () {
    this.$_destroyResizeEvent()
    this.$_destroySidebarResizeEvent()
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    // 执行echarts的resize
    $_resizeHandler () {
      return debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)()
    },
    // 添加window resize的监听
    $_initResizeEvent () {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 溢出resize监听
    $_destroyResizeEvent () {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    // 执行echarts的resize
    $_sidebarResizeHandler (e) {
      this.$_resizeHandler()
    },
    // 点击侧边按钮的时候执行一次resize
    $_initSidebarResizeEvent () {
      this.$_sidebarElm = document.getElementsByClassName('arrow')[0]
      this.$_sidebarElm &&
        this.$_sidebarElm.addEventListener('click', this.$_sidebarResizeHandler)
    },
    // 移除侧边按钮的监听
    $_destroySidebarResizeEvent () {
      this.$_sidebarElm &&
        this.$_sidebarElm.removeEventListener(
          'click',
          this.$_sidebarResizeHandler
        )
    }
  }
}
