<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-16 15:55:40
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-08 09:44:13
 -->
<template>
  <div class="time_box">
    <!-- <el-row :gutter="10"
            type="flex"
            align="middle"
            class="row"
            :justify="noSelect&&noDefault?'start':'center'">
      <el-col :span="4"
              v-if="noDefault">
        <div class="time_set"
             :class="selectTime==2?'select_set':''"
             @click="selectDate(2)">最近一月</div>
      </el-col>
      <el-col :span="4"
              v-if="noDefault">
        <div class="time_set"
             :class="selectTime==1?'select_set':''"
             @click="selectDate(1)">最近一周</div>
      </el-col>
      <el-col :span="3"
              v-if="noDefault">
        <div class="time_set"
             :class="selectTime==0?'select_set':''"
             @click="selectDate(0)">今日</div>
      </el-col>
      <el-col :span="3"
              v-if="noSelect">
        <div class="title">日期：</div>
      </el-col>
      <el-col :span="10"
    v-show="noSelect">-->
    <el-form ref="form" class="yn_form" label-width="4rem">
      <el-form-item label="日期:">
        <el-date-picker
          class="yn_ipt yn_date_picker"
          v-model="date"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="timeSet"
          :clearable="false"
          :unlink-panels="true"
          align="right"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- </el-col>
    </el-row>-->
  </div>
</template>
<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
let today = new Date().getTime()
let yesterday = new Date().getTime() - 24 * 60 * 60 * 1000
export default {
  props: {
    setTime: {
      type: Function,
      default: () => {}
    },
    defaultTime: {
      type: Number,
      default: 2
    },
    noSelect: {
      type: Boolean,
      default: true
    },
    noDefault: {
      type: Boolean,
      default: true
    },
    prisonId: {
      type: String
    }
  },
  data () {
    return {
      pickerOptions: pickerOptions,
      selectTime: 0,
      date: []
    }
  },
  created () {
    this.selectTime = this.defaultTime
    this.selectDate(this.selectTime)
  },
  mounted () {},
  methods: {
    selectDate (num) {
      this.date = []
      this.selectTime = num
      let end = new Date()
      let start = new Date(new Date().getTime() - 3600 * 1000 * 24)

      switch (num) {
        case 1:
          start = start.getTime() - 3600 * 1000 * 24 * 7
          break
        case 2:
          start = start.getTime() - 3600 * 1000 * 24 * 30
          break
        default:
          break
      }

      this.date.push(new Date(start).getTime())
      this.date.push(new Date(end).getTime())

      this.$emit('setTime', this.date)
    },
    timeSet (val) {
      if (val) {
        this.date[0] = new Date(val[0]).getTime()
        this.date[1] = new Date(val[1]).getTime()
        this.selectTime = 4
        this.$emit('setTime', this.date)
      } else {
        this.date = []
      }
    }
  },
  watch: {
    prisonId: {
      deep: true,
      handler (val) {
        this.selectTime = this.defaultTime
        this.selectDate(this.selectTime)
      }
    }
  }
}
</script>
<style lang="less" scoped>
// .time_box {
//   width: 100%;
//   display: flex;
//   align-items: center;
//   box-sizing: border-box;
//   padding: 0.5rem;
//   font-size: 1.2rem;
//   font-weight: 600;
//   .row {
//     width: 100%;
//   }
//   .title {
//     text-align: right;
//     padding-bottom: 0.5rem;
//   }
//   .time_set {
//     padding: 0.5rem 0;
//     border-bottom: 3px solid #fff;
//     text-align: center;
//     color: #666;
//   }
//   .select_set {
//     border-bottom: 3px solid #2b8bef;
//     color: #2b8bef;
//   }
//   .yn_date_picker {
//     width: 100%;
//     font-size: 1.2rem;
//   }
// }
.el-date-editor--daterange.el-input__inner {
  width: 100%;
}
</style>
