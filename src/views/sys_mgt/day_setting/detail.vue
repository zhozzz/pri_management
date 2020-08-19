<!--
 * @Description:5+1+1配置
 * @Author: fylih
 * @Date: 2019-08-21 15:37:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 17:31:45
 -->
<template>
  <div ref="mainPage">
    <menuTree :menuList="['系统管理','5+1+详情']">
      <div class="day_detail_btn">
        <router-link class="link_btn" :to="{name:'day_detail',params:{date:pickMonth}}">详情</router-link>
        <router-link class="link_btn dis_btn" :to="{name:'day_setting',params:{date:pickMonth}}">配置</router-link>
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
              v-for="(item,i) in dayList"
              :key="i"
              :content="dateShow(item.times)"
            >
              <div slot="reference" class="content_item" ref="canlenderBox">
                <div class="item_icon" :style="{'background':item.color?item.color:'#999494'}"></div>
                <div class="item_date">{{item.num}}</div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </menuTree>
  </div>
</template>
<script>
import _global from '@/utils/global_url'
import { getDeptId } from '@/utils'
import menuTree from '@/components/menu_tree/'
import { days, format, blank, getList, dateShow } from './date_change'
export default {
  components: { menuTree },

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
    // 日期选择框选择事件
    dateChange(date) {
      if (!date) {
        return
      }
      this.dayList = []
      this.noneWidth = blank(date) // 留空
      for (var i = 0; i < days(date); i++) {
        this.dayList[i] = {}
        this.$set(this.dayList[i], 'num', i + 1)
      }
      getList(date).then(res => {
        let list = []
        if (res) {
          res.forEach((item, i) => {
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
    // 24小时的popover展示
    dateShow(val) {
      return dateShow(val)
    },
    submit() {},
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
