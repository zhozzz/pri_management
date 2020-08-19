<!--
 * @Description: 隐患排查管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-11 16:48:58

 -->
<template>
  <div class="sel_time">
    <!-- <div class="sel_name">{{selName}}</div> -->
    <el-date-picker
      :clearable="false"
      v-model="years"
      class="yn_ipt"
      :class="!noSel?'no_border':''"
      type="year"
      placeholder="选择年"
    ></el-date-picker>
    <el-select v-model="month" class="yn_ipt" v-if="!noSel">
      <el-option v-for="(item,i) in timeList" :key="i" :label="item.label" :value="item.num"></el-option>
    </el-select>
    <el-radio v-model="isQuarter" :label="true">季度</el-radio>
    <el-radio v-model="isQuarter" :label="false">月</el-radio>
    <el-button class="yn_btn" type="primary" @click="selcetTime">查询</el-button>
  </div>
</template>

<script>
import _global from '@/utils/global_url'
export default {
  name: 'time_sel',
  props: {
    selName: {
      type: String
    },
    noSel: {
      type: Boolean,
      default: false
    },
    prisonId: {
      type: String
    }
  },
  data () {
    return {
      years: '',
      month: null,
      isQuarter: true,
      //   timeList: [],
      quarterList: [
        {
          num: 0,
          label: '所有',
          value: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12'
          ]
        },
        { num: 1, label: '第一季度', value: ['01', '02', '03'] },
        { num: 2, label: '第二季度', value: ['04', '05', '06'] },
        { num: 3, label: '第三季度', value: ['07', '08', '09'] },
        { num: 4, label: '第四季度', value: ['10', '11', '12'] }
      ],
      monthList: [
        { num: 0, label: '1月', value: ['01'] },
        { num: 1, label: '2月', value: ['02'] },
        { num: 2, label: '3月', value: ['03'] },
        { num: 3, label: '4月', value: ['04'] },
        { num: 4, label: '5月', value: ['05'] },
        { num: 5, label: '6月', value: ['06'] },
        { num: 6, label: '7月', value: ['07'] },
        { num: 7, label: '8月', value: ['08'] },
        { num: 8, label: '9月', value: ['09'] },
        { num: 9, label: '10月', value: ['10'] },
        { num: 10, label: '11月', value: ['11'] },
        { num: 11, label: '12月', value: ['12'] }
      ]
    }
  },

  computed: {
    timeList () {
      if (this.isQuarter) {
        this.month = this.quarterList[0].num
        return this.quarterList
      } else {
        this.month = this.monthList[0].num

        return this.monthList
      }
    }
  },
  created () {
    this.isQuarter = true
    this.years = new Date()
  },
  mounted () {
    this.selcetTime()
  },
  watch: {
    prisonId: {
      handler (val) {
        this.selcetTime()
      }
    }
  },
  methods: {
    selcetTime () {
      let month
      if (this.month !== null) {
        if (this.isQuarter) {
          month = this.quarterList[this.month].value.map(item => {
            return item + '-01 00:00:00'
          })
        } else {
          month = this.monthList[this.month].value.map(item => {
            return item + '-01 00:00:00'
          })
        }
      }
      let year = this.years.getFullYear()

      this.$emit('selcetTime', { year, month, isQuarter: this.isQuarter })
    }
  }
}
</script>

<style scoped lang='less'>
.sel_time {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
  .sel_name {
    border: 1px solid #999797;
    height: 2.5rem;
    border-right: none;
    padding: 0 10px;
    line-height: 2.5rem;
  }
  /deep/.el-input__inner {
    border-radius: 0;
  }
  .el-radio {
    margin: 0 0.5rem;
    /deep/.el-radio__label {
      font-size: 1.1rem !important;
    }
  }
  /deep/.el-date-editor.el-input {
    width: 20%;
  }
  .el-select {
    width: 20%;
  }
  .no_border {
    /deep/.el-input__inner {
      //   border-left: none;
      border-right: none;
    }
  }
}
.technology {
  .sel_name {
    color: #fff;
    border: 1px solid #1471bd;
  }
}
</style>
