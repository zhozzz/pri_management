<!--
 * @Description: 劳动新增模态框
 * @Author: fylih
 * @Date: 2019-09-09 15:51:41
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:09:53
 -->
<template>
  <menuTree v-loading="loading" :menuList="['监狱管理','监狱动态','监狱重大活动']">
    <tab slot="heade_btn" right name="重大活动详情" :pathName="'major_activities_statistics'" back></tab>
    <span class="yn_page_title">活动名称：{{eventMainInfo.eventName}}</span>
    <el-form ref="form" class="yn_form" :model="eventMainInfo" label-width="8rem">
      <el-row :gutter="10">
        <el-col :span="7">
          <el-form-item label="负责人:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.eventInChargeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="开始时间:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.eventBeginTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="结束时间:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.eventEndTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="7">
          <el-form-item label="活动类型:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.eventTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="活动地点:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.eventPositionName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="参与人数:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.eventNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="7">
          <el-form-item label="警察:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.policeNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="罪犯:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.criminalNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="外来人员:">
            <el-input class="yn_ipt" readonly v-model="eventMainInfo.visitorNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="yn_page_title">人员详情</span>
    <el-form ref="form" class="yn_form" :model="eventMainInfo" label-width="8rem">
      <el-row :gutter="10">
        <el-col :span="23">
          <el-form-item label="警察:">
            <el-input
              class="yn_ipt"
              type="textarea"
              readonly
              :rows="4"
              v-model="eventMainInfo.showPoliceInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="23">
          <el-form-item label="罪犯:">
            <el-input
              class="yn_ipt"
              type="textarea"
              readonly
              :rows="4"
              v-model="eventMainInfo.showCriminalInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="23">
          <el-form-item label="外来人员:">
            <el-input
              class="yn_ipt"
              type="textarea"
              readonly
              :rows="4"
              v-model="eventMainInfo.showVisitorInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="yn_page_title">活动图片</span>
    <!-- <el-form ref="form" class="yn_form" :model="eventMainInfo" inline label-width="8rem">
    <el-form-item label="图片:"></el-form-item>-->
    <div class="img_box">
      <el-row :gutter="10">
        <el-col :span="6" v-for="(img,i) in eventMainInfo.imagePath" :key="i">
          <div class="img_title">{{img.file_name}}</div>
          <img class="imgs" :src="img.file_path" />
        </el-col>
      </el-row>
    </div>
    <!-- </el-form> -->
  </menuTree>
</template>
<script>
import { checkQuery } from './service'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree/'
import tab from '@/components/tab'
export default {
  components: { tab, menuTree },
  data() {
    return {
      eventMainInfo: {},
      loading: false
    }
  },
  created() {
    this.queryInfo()
  },
  methods: {
    queryInfo() {
      this.loading = true
      checkQuery({ eventId: this.$route.query.eventId, flag: 0 })
        .then(res => {
          this.eventMainInfo = res.eventMainInfo
          this.eventMainInfo.eventNum =
            res.eventMainInfo.policeNum +
            res.eventMainInfo.criminalNum +
            res.eventMainInfo.visitorNum
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100% !important;
}
.yn_form {
  padding-top: 23px;
  padding-left: 6px;
}
i {
  vertical-align: middle;
}
.el-icon-circle-plus {
  font-size: 2rem;
}
.update_border {
  border: 1px solid #999797;
}
.img_box {
  width: 100%;
  padding-left: 8rem;
  box-sizing: border-box;
}
.img_title {
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
  color: #333;
}
.imgs {
  width: 100%;
}
.technology {
  .img_title {
    color: #fff;
  }
}
</style>
