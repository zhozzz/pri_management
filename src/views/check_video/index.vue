<!--
 * @Description: 海康视频
 * @Author:
 * @Date: 2019-09-07 11:41:13
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-14 21:15:59
 -->
<template>
  <div>
    <!-- <iframe src="https://10.9.101.231/bvideo-web/index.do#/index"
              frameborder="0"
              height="800px"
    width="100%"></iframe>-->
    <iframe
      src="https://10.9.101.231/bvideo-web/index.do#/index"
      id="child"
      v-if="test"
      frameborder="0"
      height="800px"
      width="100%"
    ></iframe>
  </div>
</template>

<script>
import { getPrisonId } from '@/utils'
import globalUrl from '@/utils/global_url'

window.onload = function() {
  document
    .getElementById('child')
    .contentWindow.postMessage('父页面发来贺电', 'https://10.9.101.231/')
}
export default {
  name: 'HelloWorld',
  data() {
    return {
      src: '',
      newWin: '',
      test: false
    }
  },

  mounted() {
    this.sso_login()
  },
  created() {
    // document.getElementById("child").contentWindow.postMessage("父页面发来贺电", "https://10.9.101.231/");
  },

  methods: {
    sso_login() {
      let xpwidth = window.screen.width - 10
      let xpheight = window.screen.height - 35
      let prisonId = getPrisonId()
      this.axios({
        method: 'get',
        url: globalUrl.videoUrl2 + '/login/' + prisonId,
        // url: 'http://localhost:9999/login/' + prisonId,
        // url: 'http://10.1.10.50:9999/video',
        withCredentials: true
      })
        .then(response => {
          console.log(response)
          window.open(response)

          let win = window.open(
            response,
            '',
            `height=${xpheight}, width=${xpwidth},toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no`
          )

          let self = ''
          setTimeout(() => {
            let host = response.split('//bic')[0]
            win.location.href = host + '/bvideo-web/index.do'
            win.focus()
            win.resizeTo(xpwidth, xpheight)
            // window.close()
            setTimeout(() => {
              window.close()
            }, 2000)
          }, 1000)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    resize() {
      let xpwidth = window.screen.width - 10
      let xpheight = window.screen.height - 35
      this.newWin.moveTo(0, 0)
      this.newWin.resizeTo(xpwidth, xpheight)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
