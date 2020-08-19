<template slot-scope="scope">
  <div class="yn_page">
    <div style="width:100%;height:100%; padding:2px">
      <el-row style="height:100%" :gutter="10">
        <el-col :span="6" style="height:100%">
          <div
            v-loading="treeLoadding"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.3)"
            class="dept_tree"
          >
            <div style="height:50px">
              <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" class="yn_ipt"></el-input>
              <el-checkbox v-model="checked">屏蔽未绑定</el-checkbox>
            </div>

            <div style="height:75vh;overflow-y:auto">
              <el-tree
                :data="deptUserTree"
                show-checkbox
                node-key="id"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <span
                      v-if="data.isBind&&data.isHkNode&&data.state==0"
                      style="margin-right:80px;"
                    >离线</span>
                    <span
                      v-if="data.isBind&&data.isHkNode&&data.state==1"
                      style="margin-right:80px;color:green"
                    >空闲</span>
                    <span
                      v-if="data.isBind&&data.isHkNode&&data.state==2"
                      style="margin-right:80px;color:red"
                    >繁忙</span>
                    <span v-if="!data.isBind&&data.isHkNode">未绑定</span>
                    <el-button
                      class="yn_btn"
                      type="primary"
                      size="mini"
                      @click="callOne(data.id)"
                      v-if="data.isBind&&data.isHkNode&&data.state==1"
                    >呼叫</el-button>
                  </span>
                </span>
              </el-tree>
            </div>

            <div style="height:15%;text-align:right;margin-top:10px">
              <el-button
                size="mini"
                style="margin-right:10px"
                type="primary"
                @click="callMany"
                class="yn_btn"
              >呼叫已选择的</el-button>
              <el-button
                class="yn_btn"
                size="mini"
                style="margin-right:10px"
                @click="cancleChecked"
              >取消</el-button>
            </div>
          </div>
        </el-col>

        <el-col :span="18" style="height:100%">
          <div style="height:85%;overflow-y:auto;width:100%">
            <el-row :gutter="30" style="width:100%" type="flex" align="middle">
              <el-col :span="8" style="text-algin:center;">
                <div class="video_box">
                  <audio :id="localAVInfo.id+'audio'" autoplay muted></audio>
                  <video
                    :id="localAVInfo.id+'video'"
                    class="video-js vjs-big-play-centered vjs-fluid"
                    controls
                    height="200px"
                  >
                    <source :src="localAVInfo.videoUrl" />
                  </video>
                </div>
                <div class="video_name">我的视频</div>
              </el-col>
              <el-col :span="8" v-for="node in meeting.nodes" :key="node.nodeId">
                <div class="video_box">
                  <audio :id="node.nodeId+'audio'" autoplay></audio>
                  <video
                    height="200px"
                    :id="node.nodeId+'video'"
                    class="video-js vjs-big-play-centered vjs-fluid"
                  >
                    <source :src="node.videoUrl" />
                  </video>
                </div>
                <div class="video_name">{{node.nodeName}}</div>
              </el-col>
            </el-row>
          </div>
          <!-- 操作按钮 -->
          <el-row type="flex" align="middle" justify="center" v-show="meeting.meetingId!=null">
            <el-col :span="4">
              <el-button type="danger" @click="hangUp" class="yn_btn">
                <i class="el-icon-phone"></i>
                挂断
              </el-button>
            </el-col>
            <el-col :span="1" style="color:white">
              <span>{{meeting.meetingId!=null?"会议中":""}}</span>
            </el-col>
            <el-col :span="1">
              <img
                style="height:32px;width:32px;"
                v-show="microphone"
                src="@/assets/av/microphone.png"
                @click="closeMicroPhone"
              />
              <img
                v-show="!microphone"
                src="@/assets/av/microphone-slash.png"
                @click="openMicroPhone"
                style="height:32px;width:32px;"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      id="callDialog"
      title="提示"
      :visible.sync="callDialog"
      width="30%"
      :before-close="reject"
    >
      <span>来电</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reject">拒绝</el-button>
        <el-button type="primary" @click="accept">接受</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
//RTC
import $ from 'jquery'
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia
window.RTCPeerConnection =
  window.RTCPeerConnection ||
  window.mozRTCPeerConnection ||
  window.webkitRTCPeerConnection
window.RTCIceCandidate =
  window.RTCIceCandidate ||
  window.mozRTCIceCandidate ||
  window.webkitRTCIceCandidate
window.RTCSessionDescription =
  window.RTCSessionDescription ||
  window.mozRTCSessionDescription ||
  window.webkitRTCSessionDescription
const configuration = {
  iceServers: []
}
let localStream, peerConn
let connectedUser = null
const options = {
  //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
  controls: true,
  muted: true,
  //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
  preload: 'auto',
  autoplay: true,
  controlBar: {
    playToggle: true
  },
  height: '200px'
}
export default {
  watch: {
    filterText(val) {
      this.checked = false
      this.$refs.tree.filter({ value: val, type: 0 })
    },
    checked(val) {
      this.$refs.tree.filter({ value: val, type: 1 })
    },
    deptUserTree: function() {
      this.$nextTick(function() {
        this.serverUserListChangeHandle()
      })
    }
  },
  name: 'av',
  data() {
    return {
      deptUserTree: [],
      userId: '',
      userName: '',
      callDialog: false,
      meeting: { meetingId: null, nodes: [] },
      filterText: '',
      checked: false,
      peerConns: [],
      currentConnectUser: '',
      meetingId_cache: '',
      isDisposet: false,
      microphone: true,
      audio: true,
      serverUserList: [],
      treeLoadding: false,
      localAVInfo: {
        id: '',
        videoUrl: ''
      },
      deptId: '',
      isHk: false
    }
  },
  created() {
    let that = this
    that.getDeptUserTree()
    that.userId = JSON.parse(localStorage.getItem('user')).userGuid
    that.deptId = JSON.parse(localStorage.getItem('user')).deptGuid
    that.localAVInfo.id = that.userId
    that.userName = JSON.parse(localStorage.getItem('user')).realName
    // 获取最新的在线人数数据
    that.getLastUserState()
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.οnbefοreunlοad(e))
    let that = this
    that.bus.$off('av_hk')
    that.bus.$on('av_hk', function(message) {
      switch (message.event) {
        case 'wsClose':
          that.hangUp()
          break
        case 'list':
          that.serverUserList = that._globalWsUsers.wsUsers_hk
          that.serverUserListChangeHandle()
          break
        case 'exit':
          that.handleExit(message)
          break
        case 'call':
          that.handleCall(message)
          break
        case 'meetingCreate':
          that.handleMeetGreate(message)
          break
        case 'meetingChange':
          that.handleMeetingChage(message)
          break
        case 'accept':
          that.handleAccept(message)
          break
        case 'reject':
          that.handleReject(message)
          break
        case 'calling':
          that.handleCalling(message)
          break
        case 'offer':
          that.handleOffer(message)
          break
        case 'candidate':
          that.handleCandidate(message)
          break
        case 'msg':
          that.handleMsg(message)
          break
        case 'answer':
          that.handleAnswer(message)
          break
        case 'leave':
          that.handleLeave(message)
          break
        case 'end':
          that.handleEnd()
          break
        default:
          break
      }
    })

    try {
      let message = JSON.parse(that.$route.params.message)
      that.bus.$emit('av_hk', message)
    } catch (e) {}

    that.initLocalAV()
  },

  beforeDestroy() {
    if (this.meeting.meetingId != null) {
      this.send('leave', this.meeting.meetingId, null)
    }
  },
  methods: {
    getLastUserState() {
      this.send('fetch', this.userId, null)
    },
    handleExit(message) {
      this.$refs.tree.getNode(message.data).data.state = 0
      this.$refs.tree.getNode(message.data).data.disabled = true
    },
    filterNode(value, data) {
      if (value.type == 0) {
        if (!value.value) return true
        return data.label.indexOf(value.value) !== -1
      } else if (value.type == 1) {
        if (!value.value) {
          return true
        } else {
          return data.isBind
        }
      }
    },
    serverUserListChangeHandle() {
      try {
        this.serverUserList.forEach(user => {
          this.$refs.tree.getNode(user.userId).data.state = user.state
          this.$forceUpdate()
          if (user.state == 2) {
            this.$refs.tree.getNode(user.userId).data.disabled = true
          } else if (user.state == 1) {
            this.$refs.tree.getNode(user.userId).data.disabled = false
          }
        })
        this.$forceUpdate()
      } catch (e) {}
    },
    // 获得全部监狱下的指挥中心和监区
    getDeptUserTree() {
      this.treeLoadding = true
      this.axios
        .get(
          this._global.userUrl + '/department/jianQuAndCommandCenterUserTree'
        )
        .then(rep => {
          for (let i = 0; i < rep.length; i++) {
            const node = rep[i]
            for (let j = 0; j < node.children.length; j++) {
              const child = node.children[j]
              if (child.id == this.userId) {
                node.children.splice(j, 1)
              }
            }
          }
          this.deptUserTree = rep
          this.treeLoadding = false
        })
    },

    οnbefοreunlοad(e) {
      if (this.meeting.meetingId != null) {
        this.send('leave', this.meeting.meetingId, null)
      }
    },

    addAudioURL(elementId, stream) {
      var audio = document.getElementById(elementId)
      if ('srcObject' in audio) {
        audio.srcObject = stream
      } else {
        audio.src = window.URL.createObjectURL(stream)
      }
    },

    initLocalAV() {
      const self = this

      if (navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(function(stream) {
            var audio = document.getElementById(self.localAVInfo.id + 'audio')
            self.addAudioURL(self.localAVInfo.id + 'audio', stream)
            audio.muted = true
            localStream = stream
            console.log(audio)
          })
          .catch(function(err) {
            console.log(err)
          })
      } else {
        this.$message.warning('未打开浏览器权限')
      }

      // 通过部门id获取视频流
      self.axios
        .get(this._global.userUrl + '/department/cameraCode/' + self.deptId)
        .then(rep => {
          let cameraCode = rep
          self.axios
            .get(this._global.videoUrl2 + '/camera/cameraUrl/' + cameraCode)
            .then(rep => {
              console.log(rep)
              if (JSON.parse(rep).data) {
                self.localAVInfo.videoUrl = JSON.parse(rep).data.url
              } else {
                this.$message.warning('视频流获取失败')
              }
              if (self.localAVInfo.videoUrl != null) {
                self.initVideoByVideoJs(self.localAVInfo.id + 'video')
              }
            })
        })
    },

    initVideoByVideoJs(id) {
      let video = document.getElementById(id)
      if (id != null && (video == null || !video)) {
        setTimeout(() => {
          initVideoByVideoJs(id)
        }, 1000)
      }
      let that = this
      $(id).ready(function() {
        let player = that.$video(
          document.getElementById(id),
          options,
          function onPlayerReady() {
            this.play()
          }
        )
      })
    },
    closeMicroPhone() {
      this.microphone = false
      localStream.getAudioTracks()[0].enabled = false
    },
    openMicroPhone() {
      this.microphone = true
      localStream.getAudioTracks()[0].enabled = true
    },
    send(event, data, receiver) {
      let message = {
        type: 'hk',
        event: event,
        receiver: receiver,
        sender: this.userId,
        data: data
      }
      console.log('send', message.event, message)
      if (this._globalWs.ws && this._globalWs.ws.send) {
        this._globalWs.ws.send(JSON.stringify(message))
      }
    },
    getPeerConnIndex(nodeId) {
      for (let i = 0; i < this.peerConns.length; i++) {
        if (this.peerConns[i].nodeId == nodeId) {
          return i
        }
      }
      return null
    },
    // 单人呼叫
    callOne(callUserId) {
      if (this.meeting.meetingId == null) {
        this.send('call', '', callUserId)
      } else {
        this.send('call', this.meeting.meetingId, callUserId)
      }
    },
    // 群体呼叫
    callMany() {
      if (this.meeting.meetingId == null) {
        this.$refs.tree.getCheckedKeys().forEach(id => {
          this.send('call', '', id)
        })
      } else {
        this.$refs.tree.getCheckedKeys().forEach(id => {
          this.send('call', this.meeting.meetingId, id)
        })
      }
    },
    cancleChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    handleCall(message) {
      this.currentConnectUser = message.sender
      if (this.meeting.meetingId != null) {
        this.send('calling', this.userName, message.sender)
        return
      }
      this.callDialog = true
      setTimeout(() => {
        if (!this.isDisposet) {
          this.callDialog = false
          this.isDispose = false
          this.$message.error('已超时自动拒绝')
          this.reject()
        }
      }, 10000)
      // 初始化会议
      this.meetingId_cache = message.data
    },
    handleMeetGreate(message) {
      message.data.nodes = message.data.nodes.filter(node => {
        return node.nodeId != this.userId
      })
      this.meeting = message.data
      console.log(this.meeting.nodes)
    },
    // 接受
    accept() {
      this.isDisposet = true
      // 将hancleCall中的meeting缓存赋值给meeting，等待meetingChange事件
      this.meeting.meetingId = this.meetingId_cache
      this.send('accept', this.meeting.meetingId, this.currentConnectUser)
      this.callDialog = false
    },
    reject() {
      this.isDisposet = true
      this.meeting = { meetingId: null, nodes: [] }
      this.send('reject', this.userName, this.currentConnectUser)
      this.callDialog = false
    },
    handleAccept(message) {
      this.$message.success(message.data + '已接受邀请')
    },
    handleReject(message) {
      this.$message.error(message.data + '拒绝邀请')
    },
    handleCalling(message) {
      this.$message.error(message.data + '正在通话中')
    },
    handleOffer(message) {
      let index = this.getPeerConnIndex(message.sender)
      if (index == null) {
        this.$message('服务错误')
        this.handleError()
        return
      }
      this.peerConns[index].peerConn.setRemoteDescription(
        new RTCSessionDescription(message.data)
      )
      this.peerConns[index].peerConn.createAnswer(
        answer => {
          this.peerConns[index].peerConn.setLocalDescription(answer)
          this.send('answer', answer, message.sender)
        },
        error => {
          console.log('Error when creating an answer', error)
          this.handleError()
        }
      )
    },

    handleAnswer(message) {
      let index = this.getPeerConnIndex(message.sender)
      this.peerConns[index].peerConn.setRemoteDescription(
        new RTCSessionDescription(message.data)
      )
    },

    handleCandidate(message) {
      let index = this.getPeerConnIndex(message.sender)
      this.peerConns[index].peerConn.addIceCandidate(
        new RTCIceCandidate(message.data)
      )
    },

    handleError() {
      this.hangUp()
    },

    hangUp() {
      if (this.meeting.meetingId && this.meeting.meetingId != null) {
        this.send('leave', this.meeting.meetingId, '')
      }
      this.meeting = { meetingId: null, nodes: [] }
      this.peerConns = []
    },
    handleLeave(message) {
      this.$message.success(message.data)
    },
    handleEnd() {
      this.$message.success('会议已关闭')
      this.meeting = { meetingId: null, nodes: [] }
      this.peerConns = []
    },

    handleMeetingChage(message) {
      message.data.nodes = message.data.nodes.filter(node => {
        return node.nodeId != this.userId
      })
      this.meeting = message.data
      this.meeting.nodes.forEach(node => {
        try {
          node.videoUrl = JSON.parse(node.videoUrl).data.url
        } catch (e) {
          node.videoUrl = null
        }
        let flag = true
        this.peerConns.forEach(conn => {
          if (conn.nodeId == node.nodeId) {
            flag = false
          }
        })
        if (flag) {
          peerConn = new RTCPeerConnection(configuration)
          peerConn.addStream(localStream)
          peerConn.onaddstream = e => {
            this.addAudioURL(node.nodeId + 'audio', e.stream)
          }
          peerConn.onicecandidate = event => {
            if (event.candidate) {
              this.send('candidate', event.candidate, node.nodeId)
            }
          }
          // 如果是新加入的节点则不应该向其他节点发送offer
          if (node.nodeId == message.sender) {
            peerConn.createOffer(
              offer => {
                this.send('offer', offer, message.sender)
                peerConn.setLocalDescription(offer)
              },
              error => {
                console.log('Error when creating an offer', error)
                this.handleError()
              }
            )
          }
          this.peerConns.push({ nodeId: node.nodeId, peerConn: peerConn })
          // 初始化视频
          this.axios
            .get(
              this._global.videoUrl2 + '/camera/cameraUrl/' + node.cameraCode
            )
            .then(rep => {
              console.log(rep)
              node.videoUrl = JSON.parse(rep).data.url
              this.$forceUpdate()
              console.log(node.videoUrl)
              if (node.videoUrl != null) {
                this.initVideoByVideoJs(node.nodeId + 'video')
              }
            })
        }
      })
      for (let i = 0; i < this.peerConns.length; i++) {
        let flag = false
        this.meeting.nodes.forEach(node => {
          if (this.peerConns[i].nodeId == node.nodeId) {
            flag = true
          }
        })
        if (!flag) {
          this.peerConns[i].peerConn.close()
          this.peerConns[i].peerConn.onicecandidate = null
          this.peerConns[i].peerConn.onaddstream = null
          this.peerConns.splice(i, 1)
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.yn_page {
  padding: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.cbInfoDiv {
  float: left;
  width: 500px;
  margin-left: 16px;
  border: 1px solid #7f9db9;
}
.cbInfo {
  height: 200px;
  padding: 5px;
  border: 1px solid #7f9db9;
  overflow: auto;
  word-break: break-all;
}
.operate {
  margin-top: 24px;
}
.operate::after {
  content: '';
  display: block;
  clear: both;
}
.operate .btns {
  height: 32px;
}
.module {
  float: left;
  width: 340px;
  min-height: 320px;
  margin-left: 16px;
  padding: 16px 8px;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
}
.module .item {
  margin-bottom: 4px;
}
.module .label {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  text-align: right;
}
.module input[type='text'],
.module select {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  margin-left: 0;
  width: 150px;
  min-height: 20px;
}
.module .btn {
  min-width: 80px;
  min-height: 24px;
  margin-top: 16px;
  margin-left: 158px;
}
.video-js {
  padding-top: 0;
  height: 100% !important;
}

.dept_tree {
  background: #dfedfe;
  border-radius: 4px;
  padding: 1rem;
  .el-tree {
    background: #dfedfe;
  }
  /deep/.custom-tree-node,
  /deep/.el-checkbox__label {
    font-size: 1.2rem !important;
  }
}

.video_box {
  text-align: center;
  width: 100%;
  height: 20rem;
  border: 1px solid #53baff;
  border-radius: 2px;
}
.video_name {
  color: #8fdcf9;
  text-align: center;
}
.technology {
  .dept_tree {
    background: transparent;
    border: 1px solid #7cdafd;
    box-shadow: 14px 0 14px -14px #8fdcf9 inset, 0 14px 14px -14px #8fdcf9 inset,
      0 -14px 14px -14px #8fdcf9 inset, -14px 0 14px -14px #8fdcf9 inset;
    /deep/.custom-tree-node,
    /deep/.el-checkbox__label {
      color: #fff;
    }
    /deep/.el-tree-node__content:hover {
      .custom-tree-node {
        color: #333 !important;
      }
    }
    .el-tree {
      background: transparent;
    }
  }
  .video_box {
    border: 1px solid #7cdafd;
  }
  .video_name {
    color: #fff;
  }
}
</style>
