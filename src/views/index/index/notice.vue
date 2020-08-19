<!--
 * @Description: 消息通知
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-07 15:04:57
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-31 14:27:52
 -->
<template>
  <div class="notice-container" v-show="value">
    <div class="masking" @click="close(false)"></div>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="notices.currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size.sync="notices.pageSize"
      :total="notices.total"
    ></el-pagination>
    <el-row :gutter="20" v-if="!notices.rows.length" class="notice-item">
      <el-col>
        <el-card class="box-card">
          <div>
            <span class="title">暂无通知</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="notice-item" v-for="item in notices.rows" :key="item.msgId">
      <el-col :span="24">
        <el-card class="box-card">
          <!-- <div slot="header">
            <router-link class="title"
                         v-text="item.title"
                         :to="{name:item.path}" />
            <div class="time"
                 v-text="item.createTime"></div>
          </div>-->
          <!-- <router-link class="title"

          :to="{name:item.path}" />-->
          <el-button type="text" v-text="item.title" @click="pathRouter(item)"></el-button>
          <div class="time" v-text="item.createTime"></div>
          <!-- <div class="text item">
          </div>-->
          <!-- <div class="card-footer clearfix">
            <el-input placeholder="确认内容"
                      v-model="item.confirmContent"></el-input>
            <el-button type="primary"
                       @click="updNoticeConfirmInfo(item)">确认</el-button>
          </div>-->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getPrisonId, getUserId } from '@/utils'
import _globalUrl from '@/utils/global_url'
import { getDeptId } from '../../../utils'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      notices: {
        rows: [],
        total: null,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  props: {
    value: {
      default: false
    }
  },
  mounted() {},
  methods: {
    pathRouter(item) {
      this.close(false)

      if (item.path.indexOf('?') >= 0) {
        let param = item.path.slice(item.path.indexOf('?date=') + 6)

        let path = item.path.slice(0, item.path.indexOf('?date='))

        this.$router.push({
          name: path,
          params: {
            date: param
          }
        })
      } else {
        this.$router.push({ name: item.path })
      }
      this.updNoticeConfirmInfo(item)
    },
    getNoticeInfo() {
      // 获取数据

      let { currentPage, pageSize } = this.notices
      this.axios
        .post(_globalUrl.NoSSLUrl + '/message/list', {
          // .post(_globalUrl.baseUrl + '/base/message/list', {
          receiveUserId: getUserId(),
          receiveDeptId: getDeptId(),
          currentPage,
          pageSize
        })
        .then(response => {
          let rows = []
          response.rows.forEach(item => {
            if (item != null) {
              rows.push(item)
            }
          })
          console.log(rows)

          this.notices = {
            ...response,
            rows,
            currentPage,
            pageSize
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    updNoticeConfirmInfo({ msgId, confirmContent }) {
      let receiveUnitList = getPrisonId()
      let confirmUserId = getUserId()
      this.axios
        // .post(this._global.businessUrl + '/noticePublic/updNoticeConfirmInfo', {
        .post(this._global.NoSSLUrl + '/message/confirm', {
          // .post(this._global.baseUrl + '/base/message/confirm', {
          msgId
          //   confirmContent,
          //   receiveUnitList,
          //   confirmUserId
        })
        .then(response => {
          this.$emit('upNotice')
        })
        .catch(error => {
          console.log(error)
        })
    },
    close(val) {
      this.$emit('input', val)
    }
  },
  watch: {
    'notices.pageSize'() {
      this.getNoticeInfo()
    },
    'notices.currentPage'() {
      this.getNoticeInfo()
    },
    value(val) {
      if (val) {
        this.getNoticeInfo()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.notice-container {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 500px;
  padding: 20px;
  z-index: 20000;
  padding-bottom: 50px;
  overflow-y: auto;
  background: white;
  .notice-item {
    margin-bottom: 20px;
    .title {
      padding-bottom: 8px;
    }
    .time {
      text-align: right;
      font-size: 13px;
      color: #999;
    }
    .card-footer {
      padding: 8px 0px;
      button {
        float: right;
        // padding: 3px 0;
      }
      .el-input {
        width: 335px;
      }
    }
  }
  .el-pagination {
    width: 460px;
    position: fixed;
    bottom: 0;
    /* right: -450px; */
    padding: 10px 10px 20px 10px;
    z-index: 200;
    background: white;
  }
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.masking {
  position: fixed;
  right: 500px;
  top: 0;
  bottom: 0;
  left: 0;
  // z-index: 19999;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
