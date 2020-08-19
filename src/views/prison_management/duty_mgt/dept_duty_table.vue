<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-12-13 10:51:59
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-02 17:58:05
 -->
<template>
  <!-- 监狱级别的值班信息展示 -->
  <div class="table_page">
    <div class="title">
      <div class="title_item">
        <img :src="require('@/assets/other/leader.png')" alt />
        <span>值班领导</span>
        <b>{{ titleInfos.leaderCount }}</b>
        <span>人</span>
      </div>
      <div class="title_item">
        <img :src="require('@/assets/other/police.png')" alt />
        <span>值班警察</span>
        <b>{{ titleInfos.dutyPoliceCount }}</b>
        <span>人</span>
      </div>
      <div class="title_item">
        <img :src="require('@/assets/other/sup.png')" alt />
        <span>值班辅警</span>
        <b>{{ titleInfos.dutyAuxCount }}</b>
        <span>人</span>
      </div>
      <div class="title_item">
        <img :src="require('@/assets/other/police.png')" alt />
        <span>备勤警察</span>
        <b>{{ titleInfos.prePoliceCount }}</b>
        <span>人</span>
      </div>
      <div class="title_item">
        <img :src="require('@/assets/other/sup.png')" alt />
        <span>备勤辅警</span>
        <b>{{ titleInfos.preAuxCount }}</b>
        <span>人</span>
      </div>
    </div>
    <div class="dept_list center_list">
      <div class="dept_box" ref="leaders" v-if="leaders.departId">
        <div class="dept_item">
          <div class="dept_title">
            值班领导
            <i
              class="el-icon-edit-outline"
              v-if="deptType == '指挥中心'"
              @click="openEdit(leaders, true)"
            ></i>
          </div>
          <div class="infos" v-show="leaders.rotas" v-for="(item, i) in leaders.rotas" :key="i">
            <div class="leaders">
              <!-- <div class="leader_rota">
                {{ item.shiftName }}
                 ( {{ item.startTime }}-{{ item.endTime }})
              </div>-->
              <div class="leader_box">
                <div class="laeder_info" v-for="(user, k) in item.users" :key="k">
                  <div class="leaderInfo">{{ user.userName }}</div>
                  <p class="leaderInfo">职务：{{ user.workPosition ? user.workPosition : "无" }}</p>
                  <p class="leaderInfo">联系电话：{{ user.phoneNumber ? user.phoneNumber : "无" }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="leaders.rotas.length == 0" class="leaderInfo">暂无领导配置</div>
        </div>
      </div>
    </div>
    <div class="dept_list mid_list">
      <div class="dept_box" v-for="(obj, j) in centerList" :key="j">
        <div class="dept_item">
          <div
            class="dept_title"
            :class="
              (deptType == '指挥中心' && obj.orgGroup != 3) ||
              obj.departId == userDeptId
                ? 'self_dept'
                : ''
            "
          >
            {{ obj.departName }}
            <i
              class="el-icon-edit-outline"
              :class="
              (deptType == '指挥中心' && obj.orgGroup != 3) ||
              obj.departId == userDeptId
                ? 'self_icon'
                : ''
            "
              v-if="obj.departId == userDeptId||deptType == '指挥中心'"
              @click="openEdit(obj, false)"
            ></i>
          </div>
          <div class="infos">
            <div class="info bor_b msg">值班人员：{{ obj.dutyAuxCount + obj.dutyPoliceCount }}人</div>
            <div class="info bor_bl msg">备勤人员：{{ obj.preAuxCount + obj.prePoliceCount }}人</div>

            <div class="info">
              <div class="users">
                <div class="userhead">
                  <span class="icon"></span> 警察值班
                </div>
                <div v-if="obj.dutyPoliceList.length > 0">
                  <div class="duty" v-for="(rota, k) in obj.dutyPoliceList" :key="k">
                    <div v-if="rota.users.length > 0" @click="showUsers(rota.users)">
                      <span v-for="(user, l) in rota.users" :key="l" v-show="l < 2">
                        {{ user.userName }}
                        <span v-if="rota.users.length>1&&l < 1">、</span>
                      </span>
                      等{{ rota.users.length }}人
                      <span>({{ rota.shiftName }})</span>
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>

                <div class="userhead marTop">
                  <span class="icon sup"></span> 辅警值班
                </div>
                <div v-if="obj.dutyAuxList.length > 0">
                  <div class="duty" v-for="(rota, k) in obj.dutyAuxList" :key="k">
                    <div v-if="rota.users.length > 0" @click="showUsers(rota.users)">
                      <span v-for="(user, l) in rota.users" :key="l" v-show="l < 2">
                        {{ user.userName }}
                        <span v-if="rota.users.length>1&&l < 1">、</span>
                      </span>
                      等{{ rota.users.length }}人
                      <span>({{ rota.shiftName }})</span>
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>
              </div>
            </div>
            <div class="info bor_l">
              <div class="users">
                <div class="userhead">
                  <span class="icon"></span> 警察备勤
                </div>
                <div v-if="obj.prePoliceList.length > 0">
                  <div class="duty" v-for="(rota, k) in obj.prePoliceList" :key="k">
                    <div v-if="rota.users.length > 0" @click="showUsers(rota.users)">
                      <span v-for="(user, l) in rota.users" :key="l" v-show="l < 2">
                        {{ user.userName }}
                        <span v-if="rota.users.length>1&&l < 1">、</span>
                      </span>
                      等{{ rota.users.length }}人
                      <span>({{ rota.shiftName }})</span>
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>

                <div class="userhead marTop">
                  <span class="icon sup"></span> 辅警备勤
                </div>
                <div v-if="obj.preAuxList.length > 0">
                  <div class="duty" v-for="(rota, k) in obj.preAuxList" :key="k">
                    <div v-if="rota.users.length > 0" @click="showUsers(rota.users)">
                      <span v-for="(user, l) in rota.users" :key="l" v-show="l < 2">
                        {{ user.userName }}
                        <span v-if="rota.users.length>1&&l < 1">、</span>
                      </span>
                      等{{ rota.users.length }}人
                      <!-- <div>{{ rota.time }}</div> -->
                      <span>({{ rota.shiftName }})</span>
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dept_list area_list">
      <div class="dept_box" v-for="(obj, j) in areaList" :key="j">
        <div class="dept_item">
          <div
            class="dept_title"
            :class="
              (deptType == '指挥中心' && obj.orgGroup != 3) ||
              obj.departId == userDeptId
                ? 'self_dept'
                : ''
            "
          >
            {{ obj.departName }}
            <i
              class="el-icon-edit-outline"
              :class="
              (deptType == '指挥中心' && obj.orgGroup != 3) ||
              obj.departId == userDeptId
                ? 'self_icon'
                : ''
            "
              v-if="obj.departId == userDeptId||userPrisonId== 1"
              @click="openEdit(obj, false)"
            ></i>
          </div>
          <div class="infos">
            <div class="info bor_b msg">值班人员：{{ obj.dutyAuxCount + obj.dutyPoliceCount }}人</div>
            <div class="info bor_bl msg">备勤人员：{{ obj.preAuxCount + obj.prePoliceCount }}人</div>

            <div class="info">
              <div class="users">
                <div class="userhead">
                  <span class="icon"></span> 警察值班
                </div>
                <div v-if="obj.dutyPoliceList.length>0">
                  <div class="duty" v-for="(rota,k) in obj.dutyPoliceList" :key="k">
                    <div v-if="rota.users.length>0" @click="showUsers(rota.users)">
                      <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                        {{user.userName}}
                        <span v-if="l<1&&rota.users.length>1">、</span>
                      </span>
                      等{{rota.users.length}}人
                      <!-- <div>{{rota.time}}</div> -->
                      <span>({{ rota.shiftName }})</span>
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>

                <div class="userhead marTop">
                  <span class="icon sup"></span> 辅警值班
                </div>
                <div v-if="obj.dutyAuxList.length>0">
                  <div class="duty" v-for="(rota,k) in obj.dutyAuxList" :key="k">
                    <div v-if="rota.users.length>0" @click="showUsers(rota.users)">
                      <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                        {{user.userName }}
                        <span v-if="l<1&&rota.users.length>1">、</span>
                      </span>
                      等{{rota.users.length}}人
                      <!-- <div>{{rota.time}}</div> -->
                      <span>({{ rota.shiftName }})</span>
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>
              </div>
            </div>
            <div class="info bor_l">
              <div class="users">
                <div class="userhead">
                  <span class="icon"></span> 警察备勤
                </div>
                <div v-if="obj.prePoliceList.length>0">
                  <div class="duty" v-for="(rota,k) in obj.prePoliceList" :key="k">
                    <div v-if="rota.users.length>0" @click="showUsers(rota.users)">
                      <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                        {{user.userName}}
                        <span v-if="l<1&&rota.users.length>1">、</span>
                      </span>
                      等{{rota.users.length}}人
                      <span>({{ rota.shiftName }})</span>
                      <!-- <div>{{rota.time}}</div> -->
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>

                <div class="userhead marTop">
                  <span class="icon sup"></span> 辅警备勤
                </div>
                <div v-if="obj.preAuxList.length>0">
                  <div class="duty" v-for="(rota,k) in obj.preAuxList" :key="k">
                    <div v-if="rota.users.length>0" @click="showUsers(rota.users)">
                      <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                        {{user.userNam}}
                        <span v-if="l<1&&rota.users.length>1">、</span>
                      </span>
                      等{{rota.users.length}}人
                      <span>({{ rota.shiftName }})</span>
                      <!-- <div>{{rota.time}}</div> -->
                    </div>
                  </div>
                </div>
                <div class="duty" v-else>暂无人员配置</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="yn_dialog"
      :visible="editVisible"
      append-to-body
      title="编辑"
      width="90%"
      center
      @close="closeEdit"
    >
      <dutyEdit
        :editForm="editForm"
        :date="date"
        :editIndex="editIndex"
        :isLeader="isLeader"
        :colse="colse"
        @subSuccess="subSuccess"
        :deptId="deptGuId"
      />
      <div slot="footer"></div>
    </el-dialog>

    <el-dialog class="yn_dialog" append-to-body :visible.sync="showFlag" title="查看成员" center>
      <tableView noPage noBottom noSearch noIndex :tableData="{ list: memberList }">
        <template slot="table-column">
          <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
          <el-table-column prop="policeNumber" align="center" label="警号"></el-table-column>
          <el-table-column prop="workPosition" align="center" label="职务"></el-table-column>
          <el-table-column prop="phoneNumber" align="center" label="联系电话"></el-table-column>
        </template>
      </tableView>
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="showFlag = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import dutyEdit from './duty_edit'
import tableView from '@/components/table_view/'

export default {
  props: {
    deptList: {
      type: Array
    },
    titleInfos: {
      type: Object
    },
    date: {},
    deptId: {}
  },
  components: {
    dutyEdit,
    tableView
  },
  data() {
    return {
      centerList: [],
      areaList: [],
      userDeptId: getDeptId(),
      userPrisonId: getPrisonId(),
      deptType: getDeptType(),
      editForm: [],
      editVisible: false,
      leaders: {},
      isLeader: false,
      showFlag: false,
      deptGuId: '',
      memberList: [],
      editIndex: null
    }
  },
  created() {},

  methods: {
    openEdit(row, boolean, index) {
      console.log(row.rotas)

      this.editForm = JSON.parse(JSON.stringify(row.rotas))
      this.isLeader = boolean
      this.editVisible = true
      this.deptGuId = row.departId
      this.editIndex = index
    },
    closeEdit() {
      this.editVisible = false
      this.editForm = []
      this.deptGuId = ''
    },
    colse() {
      this.editVisible = false
    },
    subSuccess() {
      this.$emit('upData')
    },
    showUsers(row) {
      console.log(row)
      this.memberList = row
      this.showFlag = true
    }
  },
  watch: {
    titleInfos: {
      deep: true
    },
    date: {
      deep: true,
      handler(val) {}
    },

    deptList: {
      deep: true,
      handler(val) {
        console.log(val)

        if (val) {
          this.areaList = []
          this.centerList = []
          this.leaders = {}
          val.map(item => {
            if (item.departName === '值班领导') {
              this.leaders = item
              console.log(this.leaders)

              // if (item.rotas.length) {
              //   this.leaders.users = [];
              //   item.rotas.map(obj => {
              //     obj.users.map(son => {
              //       son.endTime = obj.endTime;
              //       son.startTime = obj.startTime;
              //       this.leaders.users.push(son);
              //     });
              //   });
              // }
            } else if (
              item.departType === '指挥中心' ||
              item.departType === '科室值班'
            ) {
              item.dutyAuxList = []
              item.preAuxList = []
              item.dutyPoliceList = []
              item.prePoliceList = []
              if (item.rotas) {
                item.rotas.map(son => {
                  son.dutyAuxList = []
                  son.preAuxList = []
                  son.dutyPoliceList = []
                  son.prePoliceList = []
                  let dutyAuxList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }
                  let preAuxList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }
                  let dutyPoliceList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }
                  let prePoliceList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }

                  son.users.map(user => {
                    if (user) {
                      switch (user.type) {
                        case 1:
                          dutyPoliceList.users.push(user)
                          break
                        case 2:
                          prePoliceList.users.push(user)
                          break
                        case 3:
                          dutyAuxList.users.push(user)
                          break
                        case 4:
                          preAuxList.users.push(user)
                          break
                      }
                    }
                  })

                  son.dutyAuxList.push(...dutyAuxList.users)
                  son.preAuxList.push(...preAuxList.users)
                  son.dutyPoliceList.push(...dutyPoliceList.users)
                  son.prePoliceList.push(...prePoliceList.users)
                  item.dutyAuxList.push(dutyAuxList)
                  item.preAuxList.push(preAuxList)
                  item.dutyPoliceList.push(dutyPoliceList)
                  item.prePoliceList.push(prePoliceList)
                })
              }
              this.centerList.push(item)
            } else {
              item.dutyAuxList = []
              item.preAuxList = []
              item.dutyPoliceList = []
              item.prePoliceList = []
              if (item.rotas) {
                item.rotas.map(son => {
                  son.dutyAuxList = []
                  son.preAuxList = []
                  son.dutyPoliceList = []
                  son.prePoliceList = []
                  let dutyAuxList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }
                  let preAuxList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }
                  let dutyPoliceList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }
                  let prePoliceList = {
                    users: [],
                    time: son.startTime + '-' + son.endTime,
                    shiftName: son.shiftName
                  }

                  son.users.map(user => {
                    if (user) {
                      switch (user.type) {
                        case 1:
                          dutyPoliceList.users.push(user)
                          break
                        case 2:
                          prePoliceList.users.push(user)
                          break
                        case 3:
                          dutyAuxList.users.push(user)
                          break
                        case 4:
                          preAuxList.users.push(user)
                          break
                      }
                    }
                  })
                  son.dutyAuxList.push(...dutyAuxList.users)
                  son.preAuxList.push(...preAuxList.users)
                  son.dutyPoliceList.push(...dutyPoliceList.users)
                  son.prePoliceList.push(...prePoliceList.users)
                  item.dutyAuxList.push(dutyAuxList)
                  item.preAuxList.push(preAuxList)
                  item.dutyPoliceList.push(dutyPoliceList)
                  item.prePoliceList.push(prePoliceList)
                })
              }

              this.areaList.push(item)
            }
          })

          console.log(this.centerList)
          console.log(this.$refs)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.table_page {
  width: 100%;
  box-sizing: border-box;
  padding: 30/14rem 40/14rem;
}
.leaders {
  width: 100%;
  display: flex;
}
.leader_box {
  //   border-right: 1px solid rgba(215, 225, 237, 1);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .laeder_info {
    width: 33%;
    // border-right: 1px solid rgba(215, 225, 237, 1);
  }
}
.leader_rota {
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(215, 225, 237, 1);
}
.title {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 40px;
  .title_item {
    width: 20%;
    font-size: 1.1rem;
    display: flex;
    align-items: center;

    b {
      margin-right: 5px;
      margin-left: 2rem;
      font-size: 1.4rem;
    }

    img {
      width: 18/14rem;
      height: 19/14rem;
      margin-right: 5px;
    }
  }
}
.dept_list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  position: relative;
}
.dept_box {
  width: 24%;
  position: relative;
  margin: 2rem 4px;

  .dept_item {
    // margin-bottom: 2rem;
    border: 1px solid rgba(215, 225, 237, 1);
    border-radius: 2px;
  }
  .dept_title {
    width: 100%;
    background: rgba(223, 237, 254, 1);
    padding: 9/14rem 0 1.1rem;
    text-align: center;
    font-size: 1.1rem;
    // border: 1px solid rgba(215, 225, 237, 1);
  }
  .self_dept {
    background: #2d9fff;
  }
  .el-icon-edit-outline {
    color: #2d9fff;
  }
  .self_icon {
    color: #fff;
  }
  .infos {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    font-size: 1.1rem;
    .info {
      width: 50%;
      box-sizing: border-box;
      padding: 0 1rem;
      .users {
        width: 100%;
        .marTop {
          margin-top: 2rem;
        }
        .icon {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2d9fff;
        }
        .sup {
          background: #04cce4;
        }
        .duty {
          width: 100%;
          //   display: flex;
          //   justify-content: space-between;
          margin: 1rem 0;
        }
      }
    }
    .msg {
      text-align: center;
      padding: 1rem;
    }
    .msg_box {
      width: 100%;
    }
    .bor_b {
      border-bottom: 1px solid rgba(215, 225, 237, 1);
    }
    .bor_l {
      border-left: 1px solid rgba(215, 225, 237, 1);
    }
    .bor_bl {
      border-bottom: 1px solid rgba(215, 225, 237, 1);
      border-left: 1px solid rgba(215, 225, 237, 1);
    }
    .rota {
      width: 100%;
      display: flex;
      .shiftName {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid rgba(215, 225, 237, 1);
      }
      .users_box {
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        padding: 1rem;
        .users {
          width: 50%;
        }
      }
    }
  }
  .leaderInfo {
    width: 100%;
    margin: 1rem 0;
    font-size: 1.2rem;
    text-align: center;
  }
  .tac {
    text-align: center;
  }
}
.center_list {
  justify-content: space-around;
  .dept_box:after {
    content: '';
    width: 2px;
    background: #ccc;
    height: 3rem;
    display: block;
    position: absolute;
    bottom: -3rem;
    left: calc(50% - 2px);
  }
  .dept_box {
    width: 50%;
    margin-bottom: 3rem;
  }
}

.center_list:after {
  width: 50%;
  border-bottom: 2px solid #ccc;
  border-radius: 10px 0 0 10px;
  display: block;
  content: '';
  position: absolute;
  bottom: 0;
}

.mid_list {
  justify-content: space-around;

  .dept_box::before {
    content: '';
    width: 2px;
    background: #ccc;
    height: 2rem;
    display: block;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateY(-100%);
  }
}
.area_list {
  .dept_box:nth-child(4n + 1)::after {
    content: '';
    width: calc(100% + 5px);
    height: 2rem;
    display: block;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateY(-100%);
    border-left: 2px solid #ccc;
    border-right: 2px solid #ccc;
    border-top: 2px solid #ccc;
  }

  .dept_box:nth-child(4n + 2)::after {
    content: '';
    width: calc(100% + 10px);
    height: 2rem;
    display: block;
    position: absolute;
    top: 0;
    left: calc(50% - 5px);
    transform: translateY(-100%);
    border-top: 2px solid #ccc;
  }
  .dept_box:nth-child(4n + 3)::after {
    content: '';
    width: calc(100% + 5px);
    height: 2rem;
    display: block;
    position: absolute;
    top: 0;
    right: calc(50% - 5px);
    transform: translateY(-100%);
    border-top: 2px solid #ccc;
  }

  .dept_box:last-child::after {
    content: '';
    width: 100%;
    height: 2rem;
    display: block;
    position: absolute;
    top: 0;
    right: 50%;
    left: auto;
    transform: translateY(-100%);
    border-right: 2px solid #ccc;
    border-top: none;
    border-left: none;
  }
  .dept_box:nth-child(4n)::after {
    content: '';
    width: calc(100% + 5px);
    height: 2rem;
    display: block;
    position: absolute;
    top: 0;
    right: 50%;
    transform: translateY(-100%);
    border-right: 2px solid #ccc;
    border-left: 2px solid #ccc;
    border-top: 2px solid #ccc;
  }
}
.technology {
  .el-icon-edit-outline {
    color: #fff;
  }
  .table_page {
    color: #fff;
    .dept_item {
      border: 1px solid #7cdafd;
      box-shadow: 14px 0 14px -14px #8fdcf9 inset,
        0 14px 14px -14px #8fdcf9 inset, 0 -14px 14px -14px #8fdcf9 inset,
        -14px 0 14px -14px #8fdcf9 inset;
    }
    .dept_title {
      background: #2b8bef;
    }
    .bor_b {
      border-bottom: 1px solid #7cdafd;
    }
    .bor_l {
      border-left: 1px solid #7cdafd;
    }
    .bor_bl {
      border-bottom: 1px solid #7cdafd;
      border-left: 1px solid #7cdafd;
    }
    .self_dept {
      background: #67c23a;
    }
    .dept_box:after,
    .center_list:after {
      border-color: #fff;
    }
    .mid_list {
      .dept_box::before {
        background: #fff;
      }
    }
    .center_list .dept_box:after {
      background: #fff;
    }
  }
}
</style>
