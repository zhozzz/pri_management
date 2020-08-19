<!--
 * @Description: 重点罪犯管理
 * @Author:zhu
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 14:38:25
 -->
<template>
  <menuTree :menuList="['工作辅助','指挥中心工作考核']">
    <!-- <span class="yn_page_title">考评月度</span> -->
    <!-- <div class="zongjie_box">
      <span class="yn_page_title">指挥中心月度工作总结</span>
    </div>-->
    <headIcon :list="headIconList"></headIcon>
    <table-view :tableData="tableData" noBottom noPage v-loading="loading">
      <div slot="searchCondition">
        <div class="btn_group">
          <el-date-picker
            class="yn_ipt date_pikcer"
            v-model="date"
            type="month"
            placeholder="选择日期时间"
            @change="dateChange"
          ></el-date-picker>
          <el-button class="yn_btn" @click="dateLess" type="primary">上一月</el-button>
          <el-button class="yn_btn" @click="dateNow" type="primary">当月</el-button>
          <el-button class="yn_btn" @click="dateAdd" type="primary">后一月</el-button>
        </div>
      </div>
      <template slot="table-column">
        <el-table-column align="center" prop="userName1" label="人员" />
        <el-table-column align="center" prop="times1" label="值班次数" />
        <el-table-column align="center" prop="num1" label="巡查次数" />
        <el-table-column align="center" prop="userName2" label="人员" />
        <el-table-column align="center" prop="times2" label="值班次数" />
        <el-table-column align="center" prop="num2" label="巡查次数" />
      </template>
    </table-view>
  </menuTree>
</template>

<script>
import tableView from '@/components/table_view/'
import { expnoraml, Isname, isIDCard } from '@/utils/form_valid.js'
import { MessageBox, Message } from 'element-ui'
import headIcon from '@/components/head_icon'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree/'

let today = new Date().getTime()

export default {
  components: { tableView, headIcon, menuTree },
  data() {
    return {
      date: today, // 时间
      prisonId: getPrisonId(),
      loading: true,
      deptRout: '',
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 5
      },
      headIconList: [
        {
          url: require('@/assets/other/exercise.png'),
          info: '重大活动',
          text: 0,
          isRouter: true,
          routerString: 'major_activities_statistics',
          params: {}
        },
        {
          url: require('@/assets/other/exercise_error.png'),
          info: '突发事件',
          text: 0,
          isRouter: true,
          routerString: 'emergency_statisic',
          params: {}
        },
        {
          url: require('@/assets/other/exercise_success.png'),
          info: '应急演练',
          text: 0,
          isRouter: true,
          routerString: 'exercise_statisic',
          params: {}
        }
      ]
    }
  },
  created() {
    this.getAllList()
    this.getEventCount()
    this.getExerciseCount()
    this.getImportantEvent()
  },
  methods: {
    // 设置时间格式
    selectDate(date) {
      let time = new Date(date)
      let year = time.getFullYear()
      let mounth = time.getMonth() + 1
      if (mounth < 10) {
        mounth = '0' + mounth
      }

      return year + '-' + mounth
    },
    getExerciseCount() {
      let date = this.selectDate(new Date())
      this.axios
        .get(
          this._global.businessUrl +
            '/emergencyDrill/countsByMonth/' +
            date +
            '/' +
            this.prisonId
        )
        .then(res => {
          this.$set(this.headIconList[2], 'text', res)
        })
    },
    getImportantEvent() {
      let date = this.selectDate(new Date())
      this.axios
        .get(
          this._global.businessUrl +
            '/importantEvent/countsByMonth/' +
            date +
            '/' +
            this.prisonId
        )
        .then(res => {
          this.$set(this.headIconList[0], 'text', res)
        })
    },
    getEventCount() {
      let params = {
        emPrisonId: this.prisonId,
        startTime: '',
        endTime: ''
      }
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let endYear
      let endMonth
      if (month == 12) {
        endYear = year + 1
        endMonth = 1
      } else {
        endYear = year

        endMonth = month + 1
      }

      params.startTime = new Date(year + '/' + month + '/' + '01').getTime()
      params.endTime = new Date(endYear + '/' + endMonth + '/' + '01').getTime()
      this.axios
        .post(this._global.businessUrl + '/emergencyEvent/Count', params)
        .then(res => {
          this.$set(this.headIconList[1], 'text', res.total)
        })
    },
    // 获取列表
    getAllList() {
      let that = this
      let params = {}
      params.prisonId = this.prisonId
      params.date = this.date
      let dutyArr = []
      this.loading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/duty/userDutyTimes/' +
            params.date +
            '/' +
            params.prisonId
        )
        .then(res => {
          dutyArr = res
          params.date = that.selectDate(params.date)
          this.axios
            .post(
              this._global.businessUrl + '/dayWork/commandCenterXunCha',

              params
            )
            .then(reponse => {
              let xuncha = []
              for (const key in reponse) {
                let user = {}
                user.userGuid = key

                for (const num in reponse[key]) {
                  user.userName = num
                  user.num = reponse[key][num]
                  xuncha.push(user)
                }
              }
              xuncha.forEach(item => {
                let flag = false
                dutyArr.forEach(obj => {
                  let objFlag = false
                  if (item.userName == obj.userName) {
                    obj.num = item.num
                    flag = true
                    objFlag = true
                  }
                  if (!objFlag) {
                    obj.num = 0
                  }
                })
                if (!flag) {
                  item.times = 0
                  dutyArr.push(item)
                }
              })
              // console.log(dutyArr)

              let tempObj = {}
              let arr = []
              dutyArr.forEach((item, index) => {
                if (index % 2) {
                  tempObj.userName2 = item.userName
                  tempObj.times2 = item.times
                  tempObj.num2 = item.num
                  arr.push(tempObj)
                  tempObj = {}
                } else {
                  tempObj = {
                    userName1: item.userName,
                    times1: item.times,
                    num1: item.num
                  }
                }
              })
              this.tableData.list = arr
              this.loading = false
            })
        })
    },
    // 时间变化
    dateChange(val) {
      this.date = new Date(val).getTime()
      this.getAllList()
    },
    dateAdd() {
      this.date = this.date + 24 * 60 * 60 * 1000 * 30

      this.getAllList()
    },
    dateLess() {
      this.date = this.date - 24 * 60 * 60 * 1000 * 30

      this.getAllList()
    },
    dateNow() {
      this.date = new Date().getTime()
      this.getAllList()
    },
    // 格式化数据
    formtype(row, column, cellValue, index) {
      let name = ''
      this.rankoptions.forEach(item => {
        item.value == cellValue ? (name = item.label) : ''
      })

      return name
    },
    formDay(row, column, cellValue, index) {
      return this.selectDate(cellValue)
    },
    // 设置时间
    formTime(row) {
      let date = new Date(row.dayStamp)
      let hour = date.getHours()
      if (hour < 10) {
        hour = '0' + hour
      }
      let min = date.getMinutes()
      if (min < 10) {
        min = '0' + min
      }
      row.dateTime = hour + ':' + min
      return hour + ':' + min
    }
  },
  watch: {}
}
</script>

<style scoped lang='less'>
.technology {
  .zongjie_box {
    color: #fff;
  }
}
.date_pikcer {
  margin: 0 1rem;
}
.zongjie_box {
  width: 100%;
  font-size: 1.2rem;
  padding: 0.5rem;
  box-sizing: border-box;
  margin: 0.5rem 0;
  .title {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  .num_box {
    width: 100%;
    display: flex;
    .nums {
      width: 30%;
      border-left: 4px solid #2b8bef;
      padding-left: 0.5rem;
    }
  }
}

.btn_group {
  margin: 1rem 0;
}
</style>
