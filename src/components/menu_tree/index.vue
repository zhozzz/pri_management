<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-16 15:55:40
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-29 14:10:35
 -->
<template>
  <div class="page_main">
    <div class="menu_info_box">
      <div class="date">
        <i class="el-icon-time"></i>
        时间 ：{{date}}
      </div>
      <div class="messages">
        <div class="tilte">
          <i class="el-icon-message-solid"></i>
          发布消息：
        </div>
        <div class="info_runner">
          <div class="run_way">
            <span
              class="medium"
              v-for="(item, i) in noticeRow"
              :key="i"
              :class="i==animate?'marquee_top':''"
            >
              {{
              item.title
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="menu_page yn_page">
      <div class="menu_tree">
        <span>
          <i class="el-icon-s-home" />
          当前位置：
        </span>
        <span v-for="(item,i) in menuList" :key="i">
          {{item}}
          <i v-if="i!==menuList.length-1" class="el-icon-arrow-right" />
        </span>
      </div>
      <div class="slot_box">
        <div class="menu_page_name" v-if="!noMune">
          {{menuList[menuList.length-1]}}
          <div class="name_detail">
            说明：{{nameDateil}}
            <i
              class="el-icon-edit"
              v-if="prisonId==1"
              @click="editFlag=true;eidtMune=nameDateil"
            ></i>
          </div>
        </div>
        <slot name="heade_btn"></slot>

        <slot></slot>
      </div>

      <el-dialog
        @close="()=>{eidtMune=''}"
        class="yn_dialog"
        :visible.sync="editFlag"
        center
        title="编辑说明"
        width="60%"
      >
        <el-input v-model="eidtMune" maxlength="300" type="textarea" class="yn_ipt"></el-input>
        <div slot="footer">
          <el-button
            class="yn_btn"
            type="primary"
            v-loading="eidtLoading"
            @click="$checkMessage(subEdit)"
          >提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import { getPrisonId, getDeptId, getDeptType, getUserId } from '@/utils'
import { formatDate } from '@/utils/date'

export default {
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    noMune: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prisonId: getPrisonId(),
      nameDateil: '暂未配置',
      noticeRow: [],
      date: formatDate(new Date(), 'yyyy年MM月dd日 hh:mm'),
      editFlag: false,
      eidtMune: '',
      animate: null,
      noticeBadge: 0,
      eidtLoading: false
    }
  },
  created() {
    if (!this.noMune) {
      this.getDateil()
    }
    let that = this
    setInterval(function() {
      that.$set(that, 'date', formatDate(new Date(), 'yyyy年MM月dd日 hh:mm'))
    }, 59000)
    setInterval(function() {
      that.setNotic()
    }, 10000)
    this.watchWS()
  },
  methods: {
    //监听消息数
    watchWS() {
      //ws连接中
      this.axios
        .get(
          _globalUrl.NoSSLUrl +
            `/message/unReadNum/${getDeptId()}/${getUserId()}`
          //   _globalUrl.baseUrl +
          // `/base/message/unReadNum/${getDeptId()}/${getUserId()}`
        )
        .then(response => {
          this.noticeBadge = response
        })
        .catch(error => {
          this.$message.error(error)
        })
      if (this._globalWs.ws) {
        this._globalWs.ws.onmessage = evt => {
          try {
          } catch (e) {
            if (evt.data.indexOf('未读消息') != -1) {
              let unReadNum = this.noticeBadge
              this.noticeBadge = parseInt(unReadNum) - 1
            } else {
              let unReadNum = this.noticeBadge
              this.noticeBadge = unReadNum + 1
            }

            //请求通知消息
          }
        }
      }
    },
    getDateil() {
      this.axios
        .get(_globalUrl.userUrl + '/menu/queryMenuRemark/' + this.$route.name)
        .then(res => {
          if (res) {
            this.nameDateil = res
          } else {
            this.nameDateil = '暂未设置'
          }
        })
    },
    getNotic() {
      this.axios
        .post(_globalUrl.NoSSLUrl + '/message/list', {
          // .post(_globalUrl.baseUrl + '/base/message/list', {
          receiveUserId: getUserId(),
          receiveDeptId: getDeptId(),
          currentPage: 1,
          pageSize: 10
        })
        .then(response => {
          let rows = []
          response.rows.forEach(item => {
            if (item != null) {
              rows.push(item)
            }
          })
          console.log(rows)

          //   this.noticeRow = rows
        })
        .catch(error => {
          console.log(error)
        })
    },

    setNotic: function() {
      if (this.animate < this.noticeRow.length - 1) {
        this.animate += 1
      } else {
        if (this.animate == 0) {
          this.animate = 1
        } else {
          this.animate = 0
        }
      }
    },
    subEdit() {
      this.eidtLoading = true
      this.axios
        .put(
          _globalUrl.userUrl +
            '/menu/addMenuRemark/' +
            this.$route.name +
            '?remark=' +
            this.eidtMune
        )
        .then(res => {
          this.$message.success(res)
          this.editFlag = false
          this.eidtLoading = false

          this.getDateil()
        })
    }
  },
  watch: {
    //监听消息数
    noticeBadge(val) {
      if (val > 0) {
        if (this.noticeBadge > 0) {
          this.axios

            .post(_globalUrl.NoSSLUrl + '/message/list', {
              // .post(_globalUrl.baseUrl + '/base/message/list', {
              receiveUserId: getUserId(),
              receiveDeptId: getDeptId(),
              currentPage: 1,
              pageSize: 10
            })
            .then(response => {
              let rows = []
              response.rows.forEach(item => {
                if (item != null) {
                  rows.push(item)
                }
              })
              console.log(rows)

              //   this.noticeRow = rows
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@keyframes myMove {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.page_main {
  width: 100%;
  .menu_page {
    width: 100%;
    padding: 1rem;
  }
  .menu_info_box {
    background: rgba(255, 251, 239, 1);
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    color: #956a0f;
    height: 40px;
    font-size: 1.4rem;

    .date {
      width: 30%;
    }
    .messages {
      width: 70%;
      position: relative;
      display: flex;

      .tilte {
        width: 15%;
      }
      .info_runner {
        position: relative;
        width: 80%;
        overflow: hidden;
        z-index: 998;
        color: #956a0f;
        .run_way {
          width: 100%;
          height: 100%;
          position: absolute;
          overflow: hidden;
        }

        .medium {
          z-index: 999;
          font-size: 1.4rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          right: -100%;
        }
        .marquee_top {
          transition: all 10s linear;
          right: 100%;
        }
      }
    }
  }

  .slot_box {
    width: 100%;
    // border: 1px solid #cddded;
    border-radius: 2px;
    box-sizing: border-box;
    padding: 1rem;
    position: relative;
    .menu_page_name {
      font-size: 1.6rem;
      font-weight: bold;
      margin: 1rem 0 1rem;
      display: flex;
      align-items: center;
    }
    .name_detail {
      color: #787878;
      font-size: 12/14rem;
      margin-left: 1rem;
      max-width: 50%;
      word-break: break-all;
    }
  }
}
.menu_tree {
  width: 100%;
  font-size: 1.2rem;
  font-weight: 600;
  color: #787878;
  margin-bottom: 1rem;
}
.technology {
  .menu_tree,
  .slot_box,
  .menu_info_box,
  .name_detail,
  .medium {
    color: #fff !important;
  }
  .menu_info_box {
    background: linear-gradient(#052652, #063068);
    color: #98c6f9;
    border-bottom: 1px solid #01a0ef;
  }
  //   .slot_box {
  //     border: 1px solid #7cdafd;
  //     box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
  //       0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  //   }
}
</style>
