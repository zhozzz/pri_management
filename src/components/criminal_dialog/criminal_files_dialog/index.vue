<!--
 * @Description: 罪犯档案管理弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-19 15:05:02
 -->
<template>
  <div class="page">
    <el-button class="yn_text_btn" v-if="!$props.useIcon" type="text" @click="getCriminalInfo">查看档案</el-button>
    <i class="el-icon-view" v-else slot="reference" @click="getCriminalInfo"></i>

    <el-dialog
      class="yn_dialog"
      title="罪犯档案记录"
      center
      :visible.sync="criminalVisible"
      width="60%"
      :v-loading="loading"
    >
      <el-row :gutter="10" class="page_head">
        <el-col :span="5" :offset="1" class="page_head_img">
          <div class="head_photo">
            <img src="../../../assets/login/background.png" />
            <div class="normal_crimal key_crimal" v-if="criminalList.isKey==1">重点罪犯</div>
            <div class="normal_crimal" v-if="criminalList.isKey!=1">普通罪犯</div>
          </div>
        </el-col>
        <el-col :span="16" :offset="1">
          <div class="head_detail">
            <div class="basic_info">
              <div class="info_left">
                <p>
                  <span>编号：</span>
                  <span>{{criminalList.zfNum}}</span>
                </p>
                <p>
                  <span>姓名：</span>
                  <span>{{criminalList.zfName}}</span>
                </p>
                <p>
                  <span>身高：</span>
                  <span
                    v-show="criminalList.height!=null && criminalList.height!==''"
                  >{{criminalList.height}}cm</span>
                </p>
                <p>
                  <span>体重：</span>
                  <span
                    v-show="criminalList.weight!=null && criminalList.weight!==''"
                  >{{criminalList.weight}}kg</span>
                </p>
                <p>
                  <span>原判刑期：</span>
                  <span>{{criminalList.originalSentence}}</span>
                </p>
                <p>
                  <span>罪名：</span>
                  <span v-for="(item,i) in criminalList.criminalAccusations" :key="i">
                    {{i>0?'、':''}}
                    {{item.label}}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <span>性别：</span>
                  <span v-show="criminalList.zfGender==0">女</span>
                  <span v-show="criminalList.zfGender==1">男</span>
                </p>
                <p>
                  <span>籍贯：</span>
                  <span>{{criminalList.zfBornPlace}}</span>
                </p>
                <!-- <p>
                <span>有无病史：</span>
                <span>{{criminalList.isKey}}</span>
                </p>-->
                <p>
                  <span>身份证号：</span>
                  <span>{{criminalList.zfCard}}</span>
                </p>

                <p>
                  <span v-if="criminalList.deathRecord" style="color: red">已死亡</span>
                </p>
                <p>
                  <span>年龄：</span>
                  <span>{{criminalList.age}}</span>
                </p>

                <!-- <p>
                <span>住址：</span>
                <span>{{criminalList.zfName}}</span>
                </p>-->
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="22" :offset="1">
          <!-- <div class="dialog_cont">
            <el-collapse
              accordion
              class="collapse-item-content1"
              v-for="(item,i) of criminalServingList"
              :key="i"
            >
              <el-collapse-item>
                <template slot="title">
                  <span>第{{i+1}}次服刑记录-{{item.intoTime}}入狱</span>
                  <span v-if="item.outTime">，于{{item.outTime}}刑满释放</span>
                </template>
                <el-collapse accordion class="collapse-item-content2">
                  <el-collapse-item>
                    <template slot="title">
                      <span>入监/离监记录</span>
                    </template>
                    <div v-for="(temp,j) of item.outAndReturnRecords" :key="j">
                      <div>
                        <p>
                          {{temp.outTime}}-{{temp.outTypeName}}，理论返监时间{{temp.inTime}}
                          {{temp.outTime}}-{{temp.outTypeName}},
                        </p>
                        <p v-if="temp.inTimeTrue">，实际于{{temp.inTimeTrue}}返监</p>
                        <p v-else>暂未返监,</p>
                        <p v-if="temp.inTime">{{'理论返监时间' + temp.inTime}},</p>
                        <p v-if="temp.inTimeTrue">实际于{{temp.inTimeTrue}}返监,</p>
                        <p v-else>目前暂未返监</p>
                      </div>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template slot="title">
                      <span>住院/转院记录</span>
                    </template>
                    <el-collapse
                      accordion
                      class="collapse-item-content3"
                      v-for="(temp,j) of item.hospitalizeRecords"
                      :key="j"
                    >
                      <el-collapse-item>
                        <template slot="title">
                          <span>第{{j+1}}次住院：{{temp.hospitalizeTime}}</span>
                          <span v-if="temp.hospitalizeReason">，因{{temp.hospitalizeReason}}</span>
                          于{{temp.hospitalizePlace}}住院
                        </template>
                        <div v-for="(tempChild,x) of temp.transferRecords" :key="x">
                          <p>
                            <span>{{tempChild.transferTime}}-</span>
                            <span v-if="tempChild.transferReason">，因{{tempChild.transferReason}}</span>
                            转院到{{tempChild.transferPlace}}
                          </p>
                        </div>
                        <div v-if="temp.leaveTime">
                          {{temp.leaveTime}}
                          <span>-出院</span>
                        </div>
                        <div v-else>
                          <span>目前尚未出院</span>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template slot="title">
                      <span>禁闭/隔离记录</span>
                    </template>
                    <div v-for="(temp,j) of item.isolationRecords" :key="j">
                      <div>
                        <span>{{temp.startTime}}</span>
                        <span v-if="temp.reason">因为{{temp.reason}}</span>
                        <span v-if="temp.reason">-因为{{temp.reason}}</span>
                        被关在房间{{temp.roomId}}中至{{temp.endTime}}
                        <span
                          v-if="temp.realEndTime"
                        >，已在{{temp.realEndTime}}解除</span>
                        <span v-else>，至今未解除</span>
                        <span v-if="temp.isRelieve=='1'">，已在{{temp.realEndTime}}解除</span>
                        <span v-else>，至今未解除</span>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-collapse-item>
            </el-collapse>
          </div>-->

          <div class="info_box" v-for="(item,i) of criminalServingList" :key="i">
            <div class="info_item">
              <div class="item_title">犯罪记录</div>
              <div class="info_detail">
                <p>
                  {{i+1}}、{{item.intoTime}}入狱
                  <span v-if="item.outTime">，于{{item.outTime}}刑满释放</span>
                </p>
              </div>
            </div>
            <div class="info_item">
              <div class="item_title">入监/离监记录</div>
              <div class="info_detail" v-for="(temp,j) of item.outAndReturnRecords" :key="j">
                <p>
                  {{j+1}}、
                  {{temp.outTime}}-{{temp.outTypeName}}，
                  <!-- <span
                    v-if="temp.inTimeTrue"
                  >，
                  理论返监时间{{temp.inTime}}
                  实际于{{temp.inTimeTrue}}返监</span>
                  <span v-else>暂未返监,</span>-->
                  <span v-if="temp.inTime">{{'理论返监时间' + temp.inTime}},</span>
                  <span v-if="temp.inTimeTrue">实际于{{temp.inTimeTrue}}返监,</span>
                  <span v-else>目前暂未返监</span>
                </p>
              </div>
            </div>
            <div class="info_item">
              <div class="item_title">住院/转院记录</div>
              <div class="info_detail" v-for="(temp,j) of item.hospitalizeRecords" :key="j">
                <div>
                  <span>{{j+1}}、{{temp.hospitalizeTime}}</span>
                  <span v-if="temp.hospitalizeReason">，因{{temp.hospitalizeReason}}</span>
                  于{{temp.hospitalizePlace}}住院
                  <div v-for="(tempChild,x) of temp.transferRecords" :key="x">
                    <p>
                      <span>{{tempChild.transferTime}}-</span>
                      <span v-if="tempChild.transferReason">，因{{tempChild.transferReason}}</span>
                      转院到{{tempChild.transferPlace}}
                    </p>
                  </div>
                  <div v-if="temp.leaveTime">
                    {{temp.leaveTime}}
                    <span>-出院</span>
                  </div>
                  <div v-else>
                    <span>目前尚未出院</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="info_item">
              <div class="item_title">禁闭/隔离记录</div>
              <div class="info_detail" v-for="(temp,j) of item.isolationRecords" :key="j">
                <div>
                  <span>{{j+1}}、</span>
                  <span>{{temp.startTime}}</span>
                  <span v-if="temp.reason">因为{{temp.reason}}</span>
                  被关在房间{{temp.roomId}}中至{{temp.endTime}}
                  <!-- <span
                    v-if="temp.realEndTime"
                  >，已在{{temp.realEndTime}}解除</span>
                  <span v-else>，至今未解除</span>-->
                  <span v-if="temp.isRelieve=='1'">，已在{{temp.realEndTime}}解除</span>
                  <span v-else>，至今未解除</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="criminalVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'

export default {
  data() {
    return {
      criminalVisible: false,
      loading: false,
      criminalList: {},
      criminalServingList: []
      //   criminalId: criminalId
    }
  },
  model: {
    prop: 'criminalId',
    event: 'seeFile'
  },
  props: {
    criminalId: {
      required: true
    },
    useIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getCriminalInfo() {
      console.log(23333)
      this.loading = true
      this.criminalVisible = true
      this.axios
        .get(_globalUrl.businessUrl + '/criminalData/detail/' + this.criminalId)
        .then(res => {
          console.log(res)
          this.criminalServingList = res
          this.criminalList = res[res.length - 1]
        })
        .catch(() => {
          this.$message.error('服务器繁忙')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.page {
  display: inline-block;
  margin: 0 1rem;
}
.page_head {
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px #ccc;
  border-radius: 2px;
  box-sizing: border-box;
  padding: 10px;
}
.head_photo {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem 0;
  img {
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
  }
  .normal_crimal {
    width: 100%;
    text-align: center;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    border-radius: 2px;
    background: #c9e4fc;
    color: #2b8bef;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1rem 0;
  }
  .key_crimal {
    background: rgba(244, 213, 213, 0.8);
    color: #fc5d5d;
  }
}
.head_detail {
  margin-left: 1rem;
  color: #333;
  font-size: 1.1rem;
  p {
    margin: 1rem 0;
    padding: 0;
    text-align: left;
  }

  .basic_info {
    display: flex;
    .info_left {
      margin-right: 2rem;
    }
  }
}
.dialog_cont {
  /deep/.el-collapse-item__header {
    height: 3rem;
    line-height: 3rem;
    margin-bottom: 0.3rem;
  }
  /deep/.el-collapse-item {
    .el-collapse-item__wrap {
      text-align: left;
    }
  }
  .collapse-item-content1 {
    span {
      margin-left: 1rem;
    }
    padding: 0 0;
    /deep/.el-collapse-item__header {
      background: #2b8bef;
      border-radius: 5px;
      color: #fff;
    }
  }
  .collapse-item-content2 {
    padding: 0 2rem;
    /deep/.el-collapse-item__header {
      background: #139cea;
    }
  }
  .collapse-item-content3 {
    padding: 0 2rem;
    /deep/.el-collapse-item__header {
      background: #43b9ff;
    }
  }
}

.info_item {
  width: 100%;
  color: #333;
  text-align: left;
  margin: 2rem 0;
  .item_title {
    font-size: 1.4rem;
    font-weight: 600;
    padding-left: 1rem;
    border-left: 3px solid #2b8bef;
  }
  .info_detail {
    font-size: 1.1rem;
  }
}
.el-icon-view {
  color: #409eff;
  cursor: pointer;
}
.technology {
  .page_head,
  .info_item,
  .head_detail {
    color: #fff;
  }
  .page_head {
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
}
</style>
