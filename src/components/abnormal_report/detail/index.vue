<!--
 * @Description: 警察详情
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:16:16
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-13 17:41:04
 -->
<template>
  <!-- <div class="page"> -->
  <!-- <el-button @click="getDetail" class="yn_text_btn" type="text">详情</el-button> -->
  <el-dialog
    title="整改反馈结果"
    @close="close"
    :visible="detailVisible"
    center
    class="yn_dialog"
    width="60%"
  >
    <el-form ref="insertform" :model="formData" class="yn_form el-police-detail" label-width="9rem">
      <h3 class="yn_page_title">【违规基本情况】</h3>
      <el-row :gutter="10">
        <!--<el-col :span="12">-->
          <!--<el-form-item label="违规等级：">-->
            <!--<div class="title">{{ formData.gradeName }}</div>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="违规时间：">
            <div class="title">{{ formData.datetime }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当日类型：">
            <div class="title">{{ formData.dayTypeName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规类型：">
            <div class="title">{{ formData.firstTypeName }}-{{ formData.secondTypeName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规单位：">
            <div class="title">{{ formData.copName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规部门：">
            <div class="title">{{ formData.deptName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规区域：">
            <div class="title">{{ formData.violationAreaName }}</div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="整改期限：">
            <div class="title">{{ formData.fixCompleteDatetime }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下载附件：">
            <el-popover v-if="formData.fileIds" placement="right" trigger="click">
              <el-table :data="formData.fileList">
                <el-table-column
                  width="200"
                  property="fileName"
                  show-overflow-tooltip
                  label="文件名"
                  align="center"
                ></el-table-column>

                <el-table-column width="100" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button class="yn_text_btn" type="text" @click="download(scope.row)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button slot="reference" class="yn_btn" type="primary">下载文件</el-button>
            </el-popover>

            <div class="yn_msg" v-else>无附件</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="违规描述：">
            <div class="title">{{ formData.description }}</div>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="违规截图：">
            <div class="img_box" v-if="formData.photoList">
              <el-image
                v-for="(img, i) in formData.photosBase"
                :key="i"
                :src="img"
                class="imgs"
                :preview-src-list="formData.photosBase"
              ></el-image>
              <!-- {{formData.photos}} -->
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <h3 class="yn_page_title">【处理情况】</h3>
      <el-row :gutter="10" v-if="backList.length > 0">
        <el-col :span="24" class="yn_msg" v-for="(item, i) in backList" :key="i">
          <p>{{ i + 1 }}、{{ item.createTime }}———— {{ item.desc }}</p>
          <div class="img_box" v-if="item.imageList">
            <el-image v-for="(img, i) in item.imageList" :key="i" :src="img.filePath" class="imgs"></el-image>
          </div>
        </el-col>
      </el-row>
      <div v-else class="yn_msg">暂无处理情况</div>
      <h3 class="yn_page_title">【反馈情况】</h3>
      <el-row :gutter="10" v-if="noticeList.length > 0">
        <el-col :span="24" class="yn_msg" v-for="(item, i) in noticeList" :key="i">
          <p>{{ i + 1 }}、{{ item.createTime }}———— {{ item.desc }}</p>
          <div class="img_box" v-if="item.imageList">
            <el-image v-for="(img, i) in item.imageList" :key="i" :src="img.filePath" class="imgs"></el-image>
          </div>
        </el-col>
      </el-row>
      <div v-else class="yn_msg">暂无反馈情况</div>
    </el-form>
    <span slot="footer" class="dialog-footer">云南省局监狱指挥中心</span>
  </el-dialog>
  <!-- </div> -->
</template>
<script>
import { getDetail, selInfo } from './service'
import { downloadFile } from '@/utils/downloadFile.js'
import { MessageBox, Message, Loading } from 'element-ui'

export default {
  props: {
    detail: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: ''
        }
      }
    },
    detailVisible: {
      type: Boolean
    },
    closeDetail: {
      type: Function
    }
  },
  data() {
    return {
      formData: { reportRecords: [] },
      levelList: [
        { name: '较低', value: 0 },
        { name: '低', value: 1 },
        { name: '中', value: 2 },
        { name: '较高', value: 3 },
        { name: '高', value: 4 }
      ],
      backList: [],
      noticeList: []
    }
  },
  watch: {
    detail: {
      deep: true,
      handler(val) {
        if (val) {
          this.getDetail()
        }
      }
    }
  },
  methods: {
    close() {
      this.formData = { reportRecords: [] }
      this.closeDetail()
    },
    getDetail() {
      selInfo(this.detail.id).then(res => {
        this.open(res)
      })
    },
    download(row) {
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      setTimeout(() => {
        loadingInstance.close()
      }, 2000)
      downloadFile(row.fileId)
    },
    open(res) {
      this.backList = []
      this.noticeList = []
      this.formData = res
      this.formData.gradeName = this.levelList[this.formData.grade].name

      if (this.formData.photoList) {
        this.formData.photosBase = this.formData.photoList.map(item => {
          return 'data:image/jpeg;base64,' + item.photo
        })
      }
      if (this.formData.reportRecords.length > 0) {
        this.formData.reportRecords.map(item => {
          if (item.state == 2) {
            this.backList.push(item)
          } else {
            this.noticeList.push(item)
          }
        })
      }
      console.log(this.formData)

      //   let ele = this.ele(res)
      //   this.$msgbox({
      //     title: '监狱违规通知单',
      //     lockScroll: false,
      //     message: this.ele(res),
      //     showCancelButton: true,
      //     showConfirmButton: false
      //   })
    },
    ele({
      grade = '',
      datetime = '',
      typeName = '',
      copName = '',
      deptName = '',
      place = '',
      deptAreaName = '',
      dayType = '',
      description = '',
      fixCompleteDatetime = '',
      photos = [],
      insertDate = ''
    }) {
      const h = this.$createElement
      let photo = photos.map(item => {
        return h('img', {
          class: 'image',
          domProps: { src: 'data:image/jpeg;base64,' + item }
        })
      })

      return h('div', { class: 'el-form el-police-detail' }, [
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规等级：'),
          h('div', { class: 'el-form-item__content' }, grade)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规时间：'),
          h('div', { class: 'el-form-item__content' }, datetime)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规类型：'),
          h('div', { class: 'el-form-item__content' }, typeName)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规单位：'),
          h('div', { class: 'el-form-item__content' }, copName)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规部门：'),
          h('div', { class: 'el-form-item__content' }, deptName)
        ]),

        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规区域：'),
          h('div', { class: 'el-form-item__content' }, deptAreaName)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '单日类型：'),
          h('div', { class: 'el-form-item__content' }, dayType)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规描述：'),
          h('div', { class: 'el-form-item__content' }, description)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '整改期限：'),
          h('div', { class: 'el-form-item__content' }, fixCompleteDatetime)
        ]),
        h('div', { class: 'el-form-item img' }, [
          h('label', { class: 'el-form-item__label' }, '违规截图：'),
          h('div', { class: 'el-form-item__content ' }, photo)
        ]),
        h('div', { class: 'el-form-item img foot' }, [
          h('label', { class: 'el-form-item__label' }, ''),
          h('div', {
            class: 'el-form-item__content ',
            domProps: {
              innerHTML: '云南省局监狱指挥中心<br/>' // + insertDate
            }
          })
        ])
      ])
    }
  }
}
</script>
<style lang="less" scoped>
.el-dialog__footer {
  text-align: right;
}
/deep/.el-form-item__content {
  font-size: 1.1rem;
}
.title {
  font-size: 1.1rem;
}
/deep/.el-form-item {
  margin-bottom: 2px;
}
.img_box {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .imgs {
    width: 10rem;
    height: 10rem;
    margin: 10px;
  }
}
.el-message-box__wrapper .el-message-box {
  width: 600px;
  .el-police-detail {
    padding: 0 20px;
    // width: 750px;
    .el-form-item {
      margin-bottom: 16px;
      display: inline-block;
      width: 50%;
      font-size: 1.1rem;
      img {
        width: 180px;
        height: 180px;
        display: inline-block;
      }
      img + img {
        margin-left: 10px;
      }
      .el-form-item__content,
      .el-form-item__label {
        font-size: 1.1rem;
      }
    }
    .el-form-item.img {
      width: 100%;
    }
    .foot {
      text-align: right;
    }
  }
}

.technology {
  /deep/.el-form-item__content {
    color: #fff;
    font-size: 1.1rem;
  }
  .title {
    color: #fff;
    font-size: 1.1rem;
    line-height: 30px;
  }
  .yn_msg,
  .dialog-footer {
    color: #fff;
  }
}
</style>
