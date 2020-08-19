<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:27:31
 -->

<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','指挥中心','巡查督察统计']">
      <tab slot="heade_btn" name="巡查督察" :left="true" pathName="abnormal_report" />
      <headIcon :list="headIconList"></headIcon>

      <el-row :gutter="10">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>违规类型统计</h3>
            <timeSelect @setTime="getTypeCharts" :prisonId="prisonId" />
            <PieChart
              :chartData="typeData"
              :dataList="typeData"
              :centerTitle="['总计','条']"
              v-loading="typeFlag"
            />
          </div>
        </el-col>

        <el-col :span="24">
          <div class="yn_charts">
            <h3>违规区域统计</h3>
            <timeSelect @setTime="getAreaCharts" :prisonId="prisonId" />
            <PieChart
              tipName="区域"
              :chartData="areaData"
              :dataList="areaData"
              :centerTitle="['总计','条']"
              v-loading="areaFlag"
            />
          </div>
        </el-col>

        <!-- <el-col :span="24">
          <div class="yn_charts">
            <h3>整改进行统计</h3>
            <el-form ref="form" class="yn_form" inline label-width="6rem">
              <el-form-item label="选择年份:">
                <el-date-picker
                  class="yn_ipt"
                  v-model="selectYear"
                  :clearable="false"
                  type="year"
                  placeholder="选择年"
                  value-format="yyyy-MM-dd hh:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-form>

            <barCharts :chartData="barChartData" v-loading="barLoading" :rotate="0" />
          </div>
        </el-col>-->
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import deptLayout from '@/components/deptLayout/index.vue'
import timeSelect from '@/components/time_select/index.vue'
import tab from '@/components/tab/index.vue'
import headIcon from '@/components/head_icon/index.vue'
import menuTree from '@/components/menu_tree/'
import PieChart from '@/components/pie_charts/pie_charts.vue'
import { getTypeCharts, getAreaCharts, getCompleteData } from '../service'
import barCharts from './bar_charts.vue'
import { getPrisonId } from '@/utils'

export default {
  data() {
    return {
      prisonId: getPrisonId(),
      typeFlag: false,
      areaFlag: false,
      barLoading: false,
      typeData: [],
      areaData: [],
      barChartData: [],
      selectYear: new Date(),
      headIconList: [
        {
          url: require('@/assets/index/crimal_sucess.png'),
          info: '已完成',
          text: 0,
          isRouter: true,
          routerString: 'abnormal_report',
          params: { state: 2 }
        },
        {
          url: require('@/assets/index/crimal_err.png'),
          info: '整改中',
          text: 0,
          isRouter: true,
          routerString: 'abnormal_report',
          params: { state: 1 }
        },
        {
          url: require('@/assets/index/crimal_err.png'),
          info: '未通知',
          text: 0,
          isRouter: true,
          routerString: 'abnormal_report',
          params: { state: 0 }
        }
      ]
    }
  },
  components: {
    deptLayout,
    timeSelect,
    tab,
    headIcon,
    menuTree,
    PieChart,
    barCharts
  },
  created() {
    this.getCompleteData()
  },
  methods: {
    nodeClick(val) {
      this.prisonId = val.id
      this.getCompleteData()

      if (this.prisonId == 1) {
        this.prisonName = '全省各监狱'
      } else {
        this.prisonName = val.departName
      }
    },
    getTypeCharts(val) {
      this.typeFlag = true
      let start = this.formatDate(new Date(val[0]), 'yyyy-MM-dd hh-mm-ss')

      let end = this.formatDate(new Date(val[1]), 'yyyy-MM-dd hh-mm-ss')
      let params = this.prisonId + '/' + start + '/' + end
      getTypeCharts(params).then(res => {
        this.typeData = []
        this.typeFlag = false
        res.map(item => {
          if (item.result !== 0) {
            this.typeData.push({ name: item.name, value: item.result })
          }
        })
      })
    },
    getAreaCharts(val) {
      this.areaFlag = true

      let start = this.formatDate(new Date(val[0]), 'yyyy-MM-dd hh-mm-ss')

      let end = this.formatDate(new Date(val[1]), 'yyyy-MM-dd hh-mm-ss')
      let params = this.prisonId + '/' + start + '/' + end
      getAreaCharts(params).then(res => {
        console.log(res)
        this.areaData = []
        this.areaFlag = false

        res.map(item => {
          if (item.result !== 0) {
            this.areaData.push({ name: item.name, value: item.result })
          }
        })
      })
    },

    getCompleteData() {
      getCompleteData(this.prisonId).then(res => {
        if (res) {
          this.$set(this.headIconList[0], 'text', res[0].yiWanCheng)
          this.$set(this.headIconList[1], 'text', res[0].zhengGaiZhong)
          this.$set(this.headIconList[2], 'text', res[0].weiTongZhi)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
