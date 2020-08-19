<template slot-scope="scope">
  <div class="yn_page" style="height:100%;background:#333">
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

    <div style="width:100%;height:100%;background:#333333;padding:2px">
      <el-container style="height:100%">
        <el-header style="height:40%;background:black">
          <el-row style="min-height:100%;" type="flex" align="middle">
            <el-col
              :span="6"
              v-for="node in meeting.nodes"
              :key="node.nodeId"
              style="text-align:center"
            >
              <video style="height:240px" :id="node.nodeId" autoplay controls></video>
              <el-row justify="center" type="flex" align="middle">
                <el-col :span="8">
                  <span style="color:white">{{ node.nodeName }}</span>
                </el-col>

                <el-col :span="2">
                  <img
                    style="height:32px;width:32px;"
                    src="@/assets/av/camera.png"
                    @click="changeRemoteVideo(node.nodeId)"
                    v-if="checkVideoEnbled(node.nodeId)"
                  />
                  <img
                    style="height:32px;width:32px;"
                    src="@/assets/av/noCamera.png"
                    @click="changeRemoteVideo(node.nodeId)"
                    v-if="!checkVideoEnbled(node.nodeId)"
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-header>
        <el-container style="height:70%;margin-top:10px">
          <el-aside style="width:600px;height:100%;background:black;margin-right:10px">
            <div style="height:88%;overflow-y:auto">
              <el-row style="margin-top:10px;margin-right:10px;" type="flex" justify="center">
                <el-col :span="22">
                  <el-input size="mini" v-model="searchText" placeholder>
                    <el-button slot="append" @click="searchList" icon="el-icon-search">搜索</el-button>
                  </el-input>
                </el-col>
              </el-row>
              <el-checkbox-group v-model="callUsers">
                <el-row
                  style="margin-top:10px"
                  v-for="(user, i) in userList"
                  :key="i"
                  align="middle"
                  justify="center"
                  type="flex"
                >
                  <el-col :span="22" style="text-align:left">
                    <!-- <el-button
                  v-show="!user.isCalling"
                  type="text"
                  @click="add2CallUsers(user.userId)"
                    >加入呼叫列表</el-button>-->

                    <el-checkbox :disabled="user.isCalling" :label="user.userId" :key="user.userId">
                      <template>
                        <el-row type="flex" align="middle">
                          <el-col style="text-align:center;" :span="8">
                            <span style="color:white">
                              <b>{{ user.username }}</b>
                            </span>
                          </el-col>
                          <el-col style="text-align:center" :span="8">
                            <span v-show="user.isCalling" style="color:red">通话中</span>
                            <span v-show="!user.isCalling" style="color:green">
                              <b>空闲</b>
                            </span>
                          </el-col>
                          <el-col style="text-align:center" :span="8">
                            <el-button
                              size="mini"
                              type="primary"
                              :disabled="user.isCalling"
                              @click.native="callOne(user.userId)"
                            >呼叫</el-button>
                          </el-col>
                        </el-row>
                      </template>
                    </el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </div>
            <div style="height:10%;text-align:right">
              <el-button
                size="mini"
                style="margin-right:10px"
                @click="callMany"
                type="primary"
              >呼叫已选择的</el-button>
              <el-button size="mini" style="margin-right:10px" @click="callUsers = []">取消</el-button>
            </div>
          </el-aside>
          <el-container style="height:100%">
            <el-main style="height:100%;background:black">
              <span style="color:white">
                <b>{{ userName }}</b>
              </span>
              <div style="height:82%">
                <video
                  :id="userId"
                  autoplay
                  controls
                  muted
                  style="height:100%;width:100%;background:#333"
                ></video>
              </div>
              <el-row type="flex" align="middle" style="margin-top:10px;">
                <el-col :span="22" style="text-align:center">
                  <el-button type="danger" @click="hangUp">
                    <i class="el-icon-upload"></i>
                    挂断
                  </el-button>
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
                <el-col :span="1">
                  <img
                    v-show="video"
                    style="height:32px;width:32px;"
                    src="@/assets/av/camera.png"
                    @click="closeVideo"
                  />
                  <img
                    v-show="!video"
                    style="height:32px;width:32px;"
                    src="@/assets/av/noCamera.png"
                    @click="openVideo"
                  />
                </el-col>
              </el-row>

              <!-- <div style="height:25%">{{meeting.nodes}}</div>
              <div style="height:25%">{{peerConns}}</div>-->
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
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
  iceServers: [
    { url: 'stun:stun.ekiga.net' },
    { url: 'stun:stun.ideasip.com' },
    { url: 'stun:stun.schlund.de' },
    { url: 'stun:stun.stunprotocol.org' },
    { url: 'stun:stun.voiparound.com' },
    { url: 'stun:stun.voipbuster.com' },
    { url: 'stun:stun.voipstunt.com' },
    { url: 'stun:stun.voxgratia.org' },
    { url: 'stun:stun.xten.com' },
    { url: 'stun:sip1.lakedestiny.cordiaip.com' },
    { url: 'stun:stun.callwithus.com' },
    { url: 'stun:stun.counterpath.net' },
    { url: 'stun:stun.internetcalls.com' },
    { url: 'stun:stun.sipgate.net' },
    { url: 'stun:stun.stunprotocol.org' },
    { url: 'stun:stun.voip.aebc.com' },
    { url: 'stun:numb.viagenie.ca' },
    { url: 'stun:stun.counterpath.com' },
    { url: 'stun:iphone-stun.strato-iphone.de' },
    { url: 'stun:numb.viagenie.ca' },
    { url: 'stun:sip1.lakedestiny.cordiaip.com' },
    { url: 'stun:stun.12connect.com' },
    { url: 'stun:stun.12voip.com' },
    { url: 'stun:stun.1cbit.ru' },
    { url: 'stun:stun.1und1.de' },
    { url: 'stun:stun.2talk.co.nz' },
    { url: 'stun:stun.2talk.com' },
    { url: 'stun:stun.3clogic.com' },
    { url: 'stun:stun.3cx.com' },
    { url: 'stun:stun.a-mm.tv' },
    { url: 'stun:stun.aa.net.uk' },
    { url: 'stun:stun.aceweb.com' },
    { url: 'stun:stun.acrobits.cz' },
    { url: 'stun:stun.acronis.com' },
    { url: 'stun:stun.actionvoip.com' },
    { url: 'stun:stun.advfn.com' },
    { url: 'stun:stun.aeta-audio.com' },
    { url: 'stun:stun.aeta.com' },
    { url: 'stun:stun.allflac.com' },
    { url: 'stun:stun.anlx.net' },
    { url: 'stun:stun.antisip.com' },
    { url: 'stun:stun.avigora.com' },
    { url: 'stun:stun.avigora.fr' },
    { url: 'stun:stun.b2b2c.ca' },
    { url: 'stun:stun.barracuda.com' },
    { url: 'stun:stun.beam.pro' },
    { url: 'stun:stun.bahnhof.net' },
    { url: 'stun:stun.bitburger.de' },
    { url: 'stun:stun.bluesip.net' },
    { url: 'stun:stun.bomgar.com' },
    { url: 'stun:stun.botonakis.com' },
    { url: 'stun:stun.budgetphone.nl' },
    { url: 'stun:stun.budgetsip.com' },
    { url: 'stun:stun.cablenet-as.net' },
    { url: 'stun:stun.callromania.ro' },
    { url: 'stun:stun.callwithus.com' },
    { url: 'stun:stun.cheapvoip.com' },
    { url: 'stun:stun.cloopen.com' },
    { url: 'stun:stun.cognitoys.com' },
    { url: 'stun:stun.commpeak.com' },
    { url: 'stun:stun.comrex.com' },
    { url: 'stun:stun.comtube.com' },
    { url: 'stun:stun.comtube.ru' },
    { url: 'stun:stun.connecteddata.com' },
    { url: 'stun:stun.cope.es' },
    { url: 'stun:stun.counterpath.com' },
    { url: 'stun:stun.counterpath.net' },
    { url: 'stun:stun.crimeastar.net' },
    { url: 'stun:stun.dcalling.de' },
    { url: 'stun:stun.demos.ru' },
    { url: 'stun:stun.demos.su' },
    { url: 'stun:stun.dls.net' },
    { url: 'stun:stun.dokom.net' },
    { url: 'stun:stun.dowlatow.ru' },
    { url: 'stun:stun.duocom.es' },
    { url: 'stun:stun.dus.net' },
    { url: 'stun:stun.e-fon.ch' },
    { url: 'stun:stun.easycall.pl' },
    { url: 'stun:stun.easyvoip.com' },
    { url: 'stun:stun.ekiga.net' },
    { url: 'stun:stun.ekir.de' },
    { url: 'stun:stun.elitetele.com' },
    { url: 'stun:stun.emu.ee' },
    { url: 'stun:stun.engineeredarts.co.uk' },
    { url: 'stun:stun.eoni.com' },
    { url: 'stun:stun.epygi.com' },
    { url: 'stun:stun.faktortel.com.au' },
    { url: 'stun:stun.fbsbx.com' },
    { url: 'stun:stun.fmo.de' },
    { url: 'stun:stun.freecall.com' },
    { url: 'stun:stun.freeswitch.org' },
    { url: 'stun:stun.freevoipdeal.com' },
    { url: 'stun:stun.genymotion.com' },
    { url: 'stun:stun.gmx.de' },
    { url: 'stun:stun.gmx.net' },
    { url: 'stun:stun.wtfismyip.com' },
    { url: 'stun:stun.gnunet.org' },
    { url: 'stun:stun.gradwell.com' },
    { url: 'stun:stun.halonet.pl' },
    { url: 'stun:stun.highfidelity.io' },
    { url: 'stun:stun.hoiio.com' },
    { url: 'stun:stun.hosteurope.de' },
    { url: 'stun:stun.ideasip.com' },
    { url: 'stun:stun.infra.net' },
    { url: 'stun:stun.innovaphone.com' },
    { url: 'stun:stun.instantteleseminar.com' },
    { url: 'stun:stun.internetcalls.com' },
    { url: 'stun:stun.intervoip.com' },
    { url: 'stun:stun.ipcomms.net' },
    { url: 'stun:stun.ipfire.org' },
    { url: 'stun:stun.ippi.fr' },
    { url: 'stun:stun.it1.hr' },
    { url: 'stun:stun.ivao.aero' },
    { url: 'stun:stun.jabbim.cz' },
    { url: 'stun:stun.jumblo.com' },
    { url: 'stun:stun.justvoip.com' },
    { url: 'stun:stun.kaospilot.dk' },
    { url: 'stun:stun.kaseya.com' },
    { url: 'stun:stun.kaznpu.kz' },
    { url: 'stun:stun.kiwilink.co.nz' },
    { url: 'stun:stun.kuaibo.com' },
    { url: 'stun:stun.levigo.de' },
    { url: 'stun:stun.lindab.com' },
    { url: 'stun:stun.linphone.org' },
    { url: 'stun:stun.linx.net' },
    { url: 'stun:stun.liveo.fr' },
    { url: 'stun:stun.lowratevoip.com' },
    { url: 'stun:stun.lundimatin.fr' },
    { url: 'stun:stun.maestroconference.com' },
    { url: 'stun:stun.mangotele.com' },
    { url: 'stun:stun.mgn.ru' },
    { url: 'stun:stun.mit.de' },
    { url: 'stun:stun.miwifi.com' },
    { url: 'stun:stun.mixer.com' },
    { url: 'stun:stun.modulus.gr' },
    { url: 'stun:stun.mrmondialisation.org' },
    { url: 'stun:stun.myfreecams.com' },
    { url: 'stun:stun.myvoiptraffic.com' },
    { url: 'stun:stun.mywatson.it' },
    { url: 'stun:stun.nas.net' },
    { url: 'stun:stun.nautile.nc' },
    { url: 'stun:stun.netappel.com' },
    { url: 'stun:stun.nextcloud.com' },
    { url: 'stun:stun.nfon.net' },
    { url: 'stun:stun.ngine.de' },
    { url: 'stun:stun.node4.co.uk' },
    { url: 'stun:stun.nonoh.net' },
    { url: 'stun:stun.nottingham.ac.uk' },
    { url: 'stun:stun.nova.is' },
    { url: 'stun:stun.onesuite.com' },
    { url: 'stun:stun.onthenet.com.au' },
    { url: 'stun:stun.ooma.com' },
    { url: 'stun:stun.ozekiphone.com' },
    { url: 'stun:stun.personal-voip.de' },
    { url: 'stun:stun.petcube.com' },
    { url: 'stun:stun.pexip.com' },
    { url: 'stun:stun.phone.com' },
    { url: 'stun:stun.pidgin.im' },
    { url: 'stun:stun.pjsip.org' },
    { url: 'stun:stun.planete.net' },
    { url: 'stun:stun.poivy.com' },
    { url: 'stun:stun.powervoip.com' },
    { url: 'stun:stun.ppdi.com' },
    { url: 'stun:stun.rackco.com' },
    { url: 'stun:stun.redworks.nl' },
    { url: 'stun:stun.ringostat.com' },
    { url: 'stun:stun.rmf.pl' },
    { url: 'stun:stun.rockenstein.de' },
    { url: 'stun:stun.rolmail.net' },
    { url: 'stun:stun.rudtp.ru' },
    { url: 'stun:stun.rynga.com' },
    { url: 'stun:stun.sainf.ru' },
    { url: 'stun:stun.schlund.de' },
    { url: 'stun:stun.sigmavoip.com' },
    { url: 'stun:stun.sip.us' },
    { url: 'stun:stun.sipdiscount.com' },
    { url: 'stun:stun.sipgate.net:10000' },
    { url: 'stun:stun.sipgate.net' },
    { url: 'stun:stun.siplogin.de' },
    { url: 'stun:stun.sipnet.net' },
    { url: 'stun:stun.sipnet.ru' },
    { url: 'stun:stun.siportal.it' },
    { url: 'stun:stun.sippeer.dk' },
    { url: 'stun:stun.siptraffic.com' },
    { url: 'stun:stun.sma.de' },
    { url: 'stun:stun.smartvoip.com' },
    { url: 'stun:stun.smsdiscount.com' },
    { url: 'stun:stun.snafu.de' },
    { url: 'stun:stun.solcon.nl' },
    { url: 'stun:stun.solnet.ch' },
    { url: 'stun:stun.sonetel.com' },
    { url: 'stun:stun.sonetel.net' },
    { url: 'stun:stun.sovtest.ru' },
    { url: 'stun:stun.speedy.com.ar' },
    { url: 'stun:stun.spoiltheprincess.com' },
    { url: 'stun:stun.srce.hr' },
    { url: 'stun:stun.ssl7.net' },
    { url: 'stun:stun.swissquote.com' },
    { url: 'stun:stun.t-online.de' },
    { url: 'stun:stun.talks.by' },
    { url: 'stun:stun.tel.lu' },
    { url: 'stun:stun.telbo.com' },
    { url: 'stun:stun.telefacil.com' },
    { url: 'stun:stun.threema.ch' },
    { url: 'stun:stun.tng.de' },
    { url: 'stun:stun.twt.it' },
    { url: 'stun:stun.ucw.cz' },
    { url: 'stun:stun.uls.co.za' },
    { url: 'stun:stun.usfamily.net' },
    { url: 'stun:stun.veoh.com' },
    { url: 'stun:stun.vipgroup.net' },
    { url: 'stun:stun.viva.gr' },
    { url: 'stun:stun.vivox.com' },
    { url: 'stun:stun.vo.lu' },
    { url: 'stun:stun.vodafone.ro' },
    { url: 'stun:stun.voicetrading.com' },
    { url: 'stun:stun.voip.aebc.com' },
    { url: 'stun:stun.voip.blackberry.com' },
    { url: 'stun:stun.voip.eutelia.it' },
    { url: 'stun:stun.voiparound.com' },
    { url: 'stun:stun.voipblast.com' },
    { url: 'stun:stun.voipbuster.com' },
    { url: 'stun:stun.voipbusterpro.com' },
    { url: 'stun:stun.voipcheap.co.uk' },
    { url: 'stun:stun.voipcheap.com' },
    { url: 'stun:stun.voipdiscount.com' },
    { url: 'stun:stun.voipfibre.com' },
    { url: 'stun:stun.voipgain.com' },
    { url: 'stun:stun.voipgate.com' },
    { url: 'stun:stun.voipinfocenter.com' },
    { url: 'stun:stun.voipplanet.nl' },
    { url: 'stun:stun.voippro.com' },
    { url: 'stun:stun.voipraider.com' },
    { url: 'stun:stun.voipstunt.com' },
    { url: 'stun:stun.voipwise.com' },
    { url: 'stun:stun.voipzoom.com' },
    { url: 'stun:stun.voxgratia.org' },
    { url: 'stun:stun.voxox.com' },
    { url: 'stun:stun.voztele.com' },
    { url: 'stun:stun.wcoil.com' },
    { url: 'stun:stun.webcalldirect.com' },
    { url: 'stun:stun.whc.net' },
    { url: 'stun:stun.whoi.edu' },
    { url: 'stun:stun.wifirst.net' },
    { url: 'stun:stun.wwdl.net' },
    { url: 'stun:stun.xn----8sbcoa5btidn9i.xn--p1ai' },
    { url: 'stun:stun.xten.com' },
    { url: 'stun:stun.xtratelecom.es' },
    { url: 'stun:stun.zadarma.com' },
    { url: 'stun:stun.zepter.ru' },
    { url: 'stun:stun.zoiper.com' },
    { url: 'stun:stun1.faktortel.com.au' },
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    }
  ]
}
let localStream, peerConn
let connectedUser = null

export default {
  name: 'av',
  data() {
    return {
      userId: '',
      userName: '',
      callDialog: false,
      meeting: { meetingId: null, nodes: [] },
      callUsers: [],
      peerConns: [],
      currentConnectUser: '',
      meetingId_cache: '',
      isDisposet: false,
      microphone: true,
      video: true,
      searchText: '',
      userList: []
    }
  },

  mounted() {
    window.addEventListener('beforeunload', e => this.οnbefοreunlοad(e))
    let that = this
    that.bus.$off('av')
    that.bus.$on('av', function(message) {
      console.log(message.event, message)
      switch (message.event) {
        //实时保持人数更新，可以看到最新得总人数信息和是否在通话信息
        case 'wsClose':
          that.hangUp()
          break
        case 'list':
          //   that._globalWsUsers.setWsUsers(message.data.filter(user => user.userId != that.userId))
          that.userList = Object.assign(that._globalWsUsers.wsUsers, {})
          that.userList.forEach(user => {
            if (that.callUsers.indexOf(user.userId) != -1 && user.isCalling) {
              that.callUsers.splice(that.callUsers.indexOf(user.userId), 1)
            }
          })
          that.$forceUpdate()
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
  },
  created() {
    let that = this
    that.userId = JSON.parse(localStorage.getItem('user')).userGuid
    that.userName = JSON.parse(localStorage.getItem('user')).realName
    let message = that.$route.params.message
    that.userList = this._globalWsUsers.wsUsers
    //此处有bug，有时会错误弹出呼叫框
    if (message && message.event == 'call') {
      that.handleCall(message)
    }
    this.initCreate()
  },
  beforeDestroy() {
    if (this.meeting.meetingId != null) {
      this.send('leave', this.meeting.meetingId, null)
    }
  },
  methods: {
    searchList() {
      //   if (this.searchText == '') {
      //     this.userList = this._globalWsUsers.wsUsers
      //     return
      //   }
      this.userList = this._globalWsUsers.wsUsers.filter(user => {
        console.log(user.username)
        return user.username.indexOf(this.searchText) != -1
      })
    },
    οnbefοreunlοad(e) {
      if (this.meeting.meetingId != null) {
        this.send('leave', this.meeting.meetingId, null)
      }
    },

    addVideoURL(elementId, stream) {
      var video = document.getElementById(elementId)
      if ('srcObject' in video) {
        video.srcObject = stream
      } else {
        // 防止在新的浏览器里使用它，应为它已经不再支持了
        video.src = window.URL.createObjectURL(stream)
      }
    },

    initCreate() {
      const self = this
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
        .then(function(stream) {
          var video = document.getElementById(self.userId)
          self.addVideoURL(self.userId, stream)
          video.muted = true
          localStream = stream
          console.log(localStream)
        })
        .catch(function(err) {
          console.log(err)
          //TODO:处理错误，如果本地音频出现问题，则不应加入到整体呼叫列表中
        })
    },
    changeRemoteVideo(nodeId) {
      let index = this.getPeerConnIndex(nodeId)
      this.peerConns[index].peerConn
        .getRemoteStreams()[0]
        .getVideoTracks()[0].enabled = !this.peerConns[index].peerConn
        .getRemoteStreams()[0]
        .getVideoTracks()[0].enabled
      this.$forceUpdate()
    },
    checkVideoEnbled(nodeId) {
      try {
        let index = this.getPeerConnIndex(nodeId)
        return this.peerConns[index].peerConn
          .getRemoteStreams()[0]
          .getVideoTracks()[0].enabled
      } catch (e) {
        // console.log(e)
        return true
      }
    },
    closeMicroPhone() {
      this.microphone = false
      localStream.getAudioTracks()[0].enabled = false
    },
    openMicroPhone() {
      this.microphone = true
      localStream.getAudioTracks()[0].enabled = true
    },
    closeVideo() {
      localStream.getVideoTracks()[0].enabled = false
      this.video = false
    },
    openVideo() {
      localStream.getVideoTracks()[0].enabled = true
      this.video = true
    },
    send(event, data, receiver) {
      let message = {
        type: 'rtc',
        event: event,
        receiver: receiver,
        sender: this.userId,
        data: data
      }
      console.log('send', message.event, message)
      this._globalWs.ws.send(JSON.stringify(message))
    },
    add2CallUsers(id) {
      if (this.callUsers.indexOf(id) == -1) {
        this.callUsers.push(id)
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
    //单人呼叫
    callOne(callUserId) {
      if (this.meeting.meetingId == null) {
        this.send('call', '', callUserId)
      } else {
        this.send('call', this.meeting.meetingId, callUserId)
      }
    },
    //群体呼叫
    callMany() {
      if (this.meeting.meetingId == null) {
        this.callUsers.forEach(id => {
          this.send('call', '', id)
        })
      } else {
        this.callUsers.forEach(id => {
          this.send('call', this.meeting.meetingId, id)
        })
      }
    },
    handleCall(message) {
      this.currentConnectUser = message.sender
      if (this.meeting.meetingId != null) {
        this.send('calling', this.userName, message.sender)
        return
      }
      this.callDialog = true
      this.isDispose = false
      setTimeout(() => {
        if (!this.isDisposet) {
          this.callDialog = false
          this.reject()
        }
      }, 10000)
      //初始化会议
      this.meetingId_cache = message.data
    },
    handleMeetGreate(messaage) {
      this.meeting = messaage.data
    },
    //接受
    accept() {
      this.isDisposet = true
      //将hancleCall中的meeting缓存赋值给meeting，等待meetingChange事件
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

    //或许存在并发问题
    handleMeetingChage(message) {
      message.data.nodes = message.data.nodes.filter(node => {
        return node.nodeId != this.userId
      })
      this.meeting = message.data
      this.meeting.nodes.forEach(node => {
        let flag = true
        this.peerConns.forEach(conn => {
          if (conn.nodeId == node.nodeId) {
            flag = false
          }
        })
        if (flag) {
          //建立连接也有自己和自己建立连接的问题（处理meeting，移除自己的节点）
          peerConn = new RTCPeerConnection(configuration)
          //处于同一个网络不需要打洞？？不确定
          //   peerConn = new RTCPeerConnection()
          console.log('addStream')
          console.log(localStream)
          peerConn.oniceconnectionstatechange = e => {
            console.log(peerConn.iceConnectionState)
          }
          peerConn.addStream(localStream)
          peerConn.onaddstream = e => {
            console.log('onaddstream')
            console.log(e.stream)
            this.addVideoURL(node.nodeId, e.stream)
          }
          peerConn.onicecandidate = event => {
            if (event.candidate) {
              this.send('candidate', event.candidate, node.nodeId)
            }
          }
          //如果是新加入的节点则不应该向其他节点发送offer
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
          //TODO:增加加入提示
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
  },
  change(e) {
    console.log(e)
  }
}
</script>

<style scoped lang="less">
.oo {
  background: solid #90a8c7;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  /* line-height: 60px; */
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}
/*
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
} */
/deep/.el-checkbox {
  width: 100%;
  /deep/.el-checkbox-button__inner,
  .el-checkbox__input {
    line-height: 2.4 !important;
    vertical-align: top !important;
  }
}
/deep/.el-checkbox__label {
  width: 100%;
}
</style>
