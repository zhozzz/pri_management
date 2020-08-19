<!--
 * @Description:5+1+1配置
 * @Author: fylih
 * @Date: 2019-08-21 15:37:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 17:30:46
 -->
<template>
  <div ref="mainPage">
    <!-- <span class="yn_page_title">"5+1+1"配置</span> -->
    <menuTree :menuList="['系统管理','5+1+1配置']">
      <div class="day_detail_btn">
        <router-link class="link_btn dis_btn" :to="{name:'day_detail',params:{date:pickMonth}}">详情</router-link>
        <router-link class="link_btn" :to="{name:'day_setting',params:{date:pickMonth}}">配置</router-link>
      </div>
      <div class="day_setting_btn">
        <el-button class="yn_btn" type="primary" @click="dateSetting">24小时配置</el-button>
      </div>
      <div class="canlender">
        <div class="canlender_header">
          <div class="canlender_header_item">
            <div class="item_icon" style="background: #ffff00"></div>
            <span class="item_txt">劳动日</span>
          </div>
          <div class="canlender_header_item">
            <div class="item_icon" style="background: #409eff;"></div>
            <span class="item_txt">休息日</span>
          </div>
          <div class="canlender_header_item">
            <div class="item_icon" style="background: #0eff00;"></div>
            <span class="item_txt">学习日</span>
          </div>
          <div class="canlender_header_item">
            <div class="item_icon" style="background: #999494;"></div>
            <span class="item_txt">未配置日程</span>
          </div>
        </div>
        <div class="canlender_datepicker">
          <span>选择月份：</span>
          <el-date-picker
            class="yn_ipt"
            type="month"
            v-model="pickMonth"
            placeholder="请选择月份"
            @change="dateChange"
            value-format="yyyy-MM"
          ></el-date-picker>
        </div>
        <div class="canlender_table">
          <div class="table_title">
            <div class="title_item" v-for="(item, i) in week" :key="i" v-html="'周'+item"></div>
          </div>
          <div class="table_content">
            <div class="none_item" :style="{'width':noneWidth}"></div>
            <el-popover
              placement="top-start"
              class="content_popover"
              title="24小时配置"
              trigger="hover"
              :disabled="true"
              :content="dateShow(item.times)"
              v-for="(item,i) in dayList"
              :key="i"
            >
              <div slot="reference" class="content_item" ref="canlenderBox" @click="setType(i)">
                <div class="item_icon" :style="{'background':item.color?item.color:'#999494'}"></div>
                <div class="item_date">{{item.num}}</div>
              </div>
            </el-popover>
          </div>
        </div>
        <div class="canlender_btn">
          <div class="table_left_btn">
            <el-button
              class="yn_btn"
              @click.stop="chooseType('1')"
              style="background: #ffff00;color:black"
            >标记劳动日</el-button>
            <el-button
              class="yn_btn"
              @click.stop="chooseType('0')"
              style="background: #409eff;color:black"
            >标记休息日</el-button>
            <el-button
              class="yn_btn"
              @click.stop="chooseType('2')"
              style="background: #0eff00;color:black"
            >标记学习日</el-button>
            <el-button
              class="yn_btn"
              @click.stop="chooseType('none')"
              style="background: #999494;color:black"
            >置空</el-button>
          </div>
          <div class="table_right_btn">
            <el-button class="yn_btn" type="primary" @click="$checkMessage(submit)">保存配置</el-button>
            <!-- <el-button class="yn_btn"
            type="primary">默认配置</el-button>-->
          </div>
        </div>
      </div>
      <day-setting-dialog
        :dateSettingVisible="dateSettingVisible"
        :dateSettingClose="dateSettingClose"
        @dateSubmit="dateSubmit"
      ></day-setting-dialog>
    </menuTree>
  </div>
</template>
<script>
import daySettingDialog from './day_setting_dialog'
import menuTree from '@/components/menu_tree/'
import _global from '@/utils/global_url'
import { days, format, blank, getList, setType, dateShow } from './date_change'
export default {
  components: { daySettingDialog, menuTree },
  data() {
    return {
      // 日期控件绑定的value
      pickMonth: format(),
      week: ['一', '二', '三', '四', '五', '六', '日'],
      dayList: [],
      // 日期选择的类型
      dateType: '',
      noneWidth: 0,
      // 24小时配置的模态框
      dateSettingVisible: false
    }
  },
  mounted() {
    if (this.$route.params.date) {
      this.dateChange(this.$route.params.date)
      this.pickMonth = this.$route.params.date
    } else {
      // 默认加载当月的日历
      this.dateChange(format())
    }
  },
  methods: {
    dateChange(date) {
      if (!date) {
        return
      }
      this.dayList = []
      this.noneWidth = blank(date) // 留空
      for (var i = 0; i < days(date); i++) {
        this.dayList[i] = {}
        this.$set(this.dayList[i], 'num', i + 1)
        let g = i + 1
        let a = g < 10 ? '0' + g : g
        this.$set(this.dayList[i], 'date', date + '-' + a)
        this.dayList[i].times = []
      }
      getList(date).then(res => {
        let list = []
        console.log(res)
        if (Array.isArray(res)) {
          res.forEach((item, i) => {
            if (item.type === undefined) {
              item.type = 0
            }
            if (item.type === 0) {
              item.color = '#409eff'
            } else if (item.type === 1) {
              item.color = '#ffff00'
            } else if (item.type === 2) {
              item.color = '#0eff00'
            } else {
              item.color = '#999494'
            }
            list[i] = Object.assign(this.dayList[i], item)
            this.$set(this.dayList, i, list[i])
          })
        }
      })
    },
    // 选择日期类型并标注
    chooseType(val) {
      this.dateType = val
      this.$refs.mainPage.style.cursor = 'pointer'
      // 如果没有点击在日期框上鼠标指针变回来
      document.addEventListener('click', this.addPointer)
    },
    // 鼠标指针事件
    addPointer(e) {
      if (
        e.target.className !== 'item_icon' &&
        e.target.className !== 'content_item el-popover__reference' &&
        e.target.className !== 'item_date'
      ) {
        if (this.$refs.mainPage.style) {
          this.$refs.mainPage.style.cursor = ''
        }
        this.dateType = undefined
      }
    },
    // 给当天日期赋予类型
    setType(i) {
      if (this.dateType) {
        let value = setType(i, this.dateType)
        let list = Object.assign({}, this.dayList[i], {
          color: value.color,
          type: value.type
        })
        this.$set(this.dayList, i, list)
      }
    },
    // 24小时配置显示的popover
    dateShow(val) {
      return dateShow(val)
    },
    // 24小时配置
    dateSetting() {
      this.dateSettingVisible = true
    },
    // 24小时组件更新成功后的emit
    dateSubmit(times) {
      console.log(times)
      this.dayList.forEach(item => {
        item.times = times
        // if (item.times.length === 0) {
        //   item.times = times
        //   return
        // }
        // item.times.length = times.length
        // item.times.forEach((tmp, i) => {
        //   tmp = Object.assign(tmp, times[i])
        // })
      })
    },
    submit() {
      let deptId = JSON.parse(localStorage.getItem('user')).deptGuid
      this.dayList.forEach(item => {
        item.deptId = deptId
      })
      console.log(this.dayList)

      let valid = this.dayList.filter(
        item => item.type === 'none' || item.type === undefined
      )
      console.log(valid)

      if (valid[0]) {
        if (valid[0].type === 'none' || valid[0].type === undefined) {
          this.$message.warning('请配置完整月再提交')
          return
        }
      }

      this.$confirm('确认提交本月日期配置？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.axios
          .post(_global.businessUrl + '/dateConfig/addDateConfig', this.dayList)
          .then(res => {
            this.$message.success('更新配置成功')
            this.dateChange(this.pickMonth)
          })
      })
    },
    dateSettingClose() {
      this.dateSettingVisible = false
    }
  },
  destroyed() {
    document.removeEventListener('click', this.addPointer)
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
