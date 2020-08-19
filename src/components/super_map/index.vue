
<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-05 16:30:06
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-09 11:54:09
 @triggerAlarm:{
   prisonName:{
     type:String，
     required:true
   },
   cameraIndexCodes:{
     type:Array,
     required:true
   },
   options:{
     title:{
       报警联动
       type:String
     },
     mode:{
       报警设备类型
       type:String
     },
     alarmId:{
       报警设备Id
       type:String
     }
   }
 }
 -->
<template>
  <div id="viewerContainer" class="fullWindow" :style="{'height':height}"></div>
</template>
<script>
var viewer = null
// var scene = null
export default {
  props: {
    triggerAlarm: {
      type: Object,
      default: function() {
        return { cameraIndexCodes: [] }
      }
    },
    closeMune: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      //   viewer: function() {},
      haveViewer: false,
      num: 0
      //   scene: null
    }
  },
  mounted() {
    this.initMap()
  },
  watch: {
    triggerAlarm: {
      deep: true,
      handler: function(val) {
        console.log('1--triggerAlarm.cameraIndexCodes:' + val.cameraIndexCodes)
        console.log('num:' + this.num)
        console.log('haveViewer:' + this.haveViewer)

        if (
          this.haveViewer &&
          val.cameraIndexCodes.length > 0 &&
          this.num < 1
        ) {
          this.setAlarm(val)
        }
      }
    },
    height: {
      deep: true
    }
  },
  methods: {
    // 加载地图
    initMap() {
      let time = 0
      let that = this
      let mapLoad = setInterval(() => {
        if (PV) {
          // PrisonVisualization为html中定义
          let prisonName = JSON.parse(localStorage.getItem('user')).prisonName
          let prisonId = JSON.parse(localStorage.getItem('user')).prisonId
          if (prisonId == 1) {
            if (that.closeMune) {
              console.log('关闭面板：' + that.closeMune)

              viewer = PV.Viewer('viewerContainer', {
                showPrisonListPanel: false, //默认隐藏监狱列表
                showDataTree: false //默认隐藏树结构
              })
            } else {
              viewer = PV.Viewer('viewerContainer')
            }
          } else {
            if (that.closeMune) {
              console.log('关闭面板：' + that.closeMune)

              viewer = PV.Viewer('viewerContainer', {
                prisonList: [prisonName],
                showPrisonListPanel: false, //默认隐藏监狱列表
                showDataTree: false //默认隐藏树结构
              })
            } else {
              viewer = PV.Viewer('viewerContainer', {
                prisonList: [prisonName],
                showPrisonListPanel: true, //默认隐藏监狱列表
                showDataTree: true //默认隐藏树结构
              })
            }
          }
          //   scene = viewer.scene
          //   scene.debugShowFramesPerSecond = true
          viewer._drawAble = true
          console.log(
            '2--triggerAlarm.cameraIndexCodes:' +
              that.triggerAlarm.cameraIndexCodes
          )

          viewer.initEvent.addEventListener(function(init) {
            console.log('init:' + init)
            console.log('1--viewer._initCompkete:' + viewer._initCompkete)
            that.haveViewer = true

            //摄像头数组参数
            if (that.triggerAlarm.cameraIndexCodes.length > 0) {
              that.setAlarm(that.triggerAlarm)

              //关闭右侧菜单
            } else {
              //调用页面发起请求摄像头
              that.$emit('mapReady')
            }
          })

          // this.viewer.flyToHome(0.0)
          clearInterval(mapLoad)
        }
        time++
        if (time === 25) {
          clearInterval(mapLoad)
          if (this.$route.name == 'beindex') {
            this.$message.warning('地图加载失败')
          }
        }
      }, 1000)
    },
    setAlarm(val) {
      if (this.haveViewer) {
        this.num += 1
        if (this.num < 2) {
          console.log('alarm方法调用次数：' + this.num)
          console.log('alarm方法传入参数：' + val.cameraIndexCodes)
          let prisonName = val.prisonName
          let cameraIndexCodes = val.cameraIndexCodes
          console.log('2-viewer._initCompkete:' + viewer._initCompkete)

          viewer.alarm(prisonName, cameraIndexCodes)
        }
      }

      //   viewer.alarm('云南省玉溪监狱', [
      //     '3b47affc7c4d40398b3f9e9e9a4449db',
      //     '2fccc3bf1dd04e0babe9f45a65b44fae'
      //   ])
    }
  },
  beforeDestroy() {
    if (viewer) {
      viewer.destroy()
    }
  }
}
</script>
<style lang="less" scoped>
// @import "./监狱可视化Demo_files/widgets.css";
@import 'http://10.1.10.75/PrisonVisualization/Viewer/Viewer.css';
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background: #000;
}
#viewerContainer {
  width: 100%;
  //   height: 100%;
}
/deep/.cesium-widget,
/deep/.cesium-widget canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
/deep/.cesium-viewer {
  height: 100% !important;
}
/deep/.cesium-viewer-cesiumWidgetContainer {
  height: 100%;
}
/deep/.cesium-zoom-wrapper {
  display: none;
}
</style>
