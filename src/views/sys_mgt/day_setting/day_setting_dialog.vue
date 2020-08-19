<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-23 13:00:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-28 17:09:16
 -->
<template>
  <el-dialog
    title="24小时配置"
    class="yn_dialog"
    @close="close"
    center
    :visible="dateSettingVisible"
    width="90%"
  >
    <div>
      <el-form class="yn_form">
        <div class="dialog_slider">
          <div class="slider_name">配置劳动/学习时间段1</div>
          <div class="block">
            <!-- <el-form-item :label="'配置劳动/学习时间段1'"> -->
            <el-form-item>
              <el-slider
                v-model="dateValue1"
                range
                :step="15"
                :min="360"
                :max="1440"
                :format-tooltip="changeSlider"
              ></el-slider>
            </el-form-item>
          </div>

          <div class="setting_btn">
            <div class="el-icon-plus add_btn" @click="addSlider"></div>
          </div>
        </div>
        <div class="dialog_slider">
          <div v-if="sliderNum>=2" class="slider_name">配置劳动/学习时间段2</div>
          <div class="block">
            <!-- <el-form-item v-if="sliderNum>=2" :label="'配置劳动/学习时间段2'"> -->
            <el-form-item v-if="sliderNum>=2">
              <el-slider
                v-model="dateValue2"
                range
                :step="15"
                :min="360"
                :max="1440"
                :format-tooltip="changeSlider"
              ></el-slider>
            </el-form-item>
          </div>
          <div v-if="sliderNum>=2" class="setting_btn">
            <div class="el-icon-plus add_btn" @click="addSlider"></div>
            <div class="el-icon-minus reduce_btn" @click="reduceSlider"></div>
          </div>
        </div>
        <div class="dialog_slider">
          <div v-if="sliderNum>=3" class="slider_name">配置劳动/学习时间段3</div>
          <div class="block">
            <!-- <el-form-item v-if="sliderNum>=3" :label="'配置劳动/学习时间段3'"> -->
            <el-form-item v-if="sliderNum>=3">
              <el-slider
                v-model="dateValue3"
                range
                :step="15"
                :min="360"
                :max="1440"
                :format-tooltip="changeSlider"
              ></el-slider>
            </el-form-item>
          </div>
          <div v-if="sliderNum>=3" class="setting_btn">
            <div class="el-icon-plus add_btn" @click="addSlider"></div>
            <div class="el-icon-minus reduce_btn" @click="reduceSlider"></div>
          </div>
        </div>
        <div class="dialog_slider">
          <div v-if="sliderNum>=4" class="slider_name">配置劳动/学习时间段4</div>
          <div class="block">
            <!-- <el-form-item v-if="sliderNum>=4" :label="'配置劳动/学习时间段4'"> -->
            <el-form-item v-if="sliderNum>=4">
              <el-slider
                v-model="dateValue4"
                range
                :step="15"
                :min="360"
                :max="1440"
                :format-tooltip="changeSlider"
              ></el-slider>
            </el-form-item>
          </div>
          <div v-if="sliderNum>=4" class="setting_btn">
            <div class="el-icon-minus reduce_btn" @click="reduceSlider"></div>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <el-button class="yn_btn" type="primary" @click="submit">确 定</el-button>
      <el-button class="yn_btn" @click="dateSettingClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['dateSettingVisible', 'dateSettingClose'],
  data() {
    return {
      // 滑块数量
      sliderNum: 1,
      // 24小时配置的参数
      dateValue1: [1440, 1440],
      dateValue2: [1440, 1440],
      dateValue3: [1440, 1440],
      dateValue4: [1440, 1440]
    }
  },
  methods: {
    // 24小时配置的slider
    paragChange1(val) {},
    // 格式化slider
    changeSlider(index) {
      let h
      index >= 60 ? (h = Math.floor(index / 60)) : (h = 0)
      // eslint-disable-next-line no-self-assign
      h >= 6 && h < 10 ? (h = '0' + h) : h < 6 ? (h = '06') : (h = h)
      let m
      index >= 60 ? (m = index % 60) : (m = index)
      // eslint-disable-next-line no-self-assign
      m < 10 ? (m = '0' + m) : (m = m)
      return h + ':' + m
    },
    // 添加slider
    addSlider() {
      if (this.sliderNum === 4) return
      this.sliderNum += 1
    },
    // 移除slider
    reduceSlider() {
      if (this.sliderNum === 4) {
        this.dateValue4 = [1440, 1440]
      }
      if (this.sliderNum === 3) {
        this.dateValue3 = [1440, 1440]
      }
      if (this.sliderNum === 2) {
        this.dateValue2 = [1440, 1440]
      }
      this.sliderNum -= 1
    },
    // 关闭的回调
    close() {
      this.dateSettingClose()
    },
    submit() {
      this.$confirm('修改配置将更换整月的24小时配置，确认修改？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let format = function(val) {
          if (val[1] - val[0] === 0) {
            return null
          }
          let h1 = Math.floor(val[0] / 60)
          h1 = h1 < 10 ? (h1 = '0' + h1) : h1
          let m1 = val[0] % 60
          m1 = m1 < 10 ? (m1 = '0' + m1) : m1
          let h2 = Math.floor(val[1] / 60)
          h2 = h2 < 10 ? (h2 = '0' + h2) : h2
          let m2 = val[1] % 60
          m2 = m2 < 10 ? (m2 = '0' + m2) : m2
          let value = {}
          value.startTime = h1 + ':' + m1 + ':' + '00'
          value.endTime = h2 + ':' + m2 + ':' + '00'
          return value
        }
        let times = []
        if (format(this.dateValue1) !== null) {
          times.push(format(this.dateValue1))
        }
        if (format(this.dateValue2) !== null) {
          times.push(format(this.dateValue2))
        }
        if (format(this.dateValue3) !== null) {
          times.push(format(this.dateValue3))
        }
        if (format(this.dateValue4) !== null) {
          times.push(format(this.dateValue4))
        }
        this.$emit('dateSubmit', times)
        this.dateSettingClose()
      })
    }
  },
  watch: {
    dateValue1(val) {
      if (val[1] > this.dateValue2[0]) {
        this.dateValue1[1] = this.dateValue2[0]
      }
    },
    dateValue2(val) {
      if (val[0] < this.dateValue1[1]) {
        this.dateValue2[0] = this.dateValue1[1]
      }
      if (val[1] > this.dateValue3[0]) {
        this.dateValue2[1] = this.dateValue3[0]
      }
    },
    dateValue3(val) {
      if (val[0] < this.dateValue2[1]) {
        this.dateValue3[0] = this.dateValue2[1]
      }
      if (val[1] > this.dateValue4[0]) {
        this.dateValue3[1] = this.dateValue4[0]
      }
    },
    dateValue4(val) {
      if (val[0] < this.dateValue3[1]) {
        this.dateValue4[0] = this.dateValue3[1]
      }
    }
  }
}
</script>
<style lang="less" scoped>
.dialog_slider {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  .slider_name {
    width: 20%;
    font-size: 1.1rem;
  }
  .block {
    width: 75%;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .el-slider {
    width: 90%;
  }
  .setting_btn {
    width: 5%;
    display: flex;
    justify-content: flex-end;
    .add_btn {
      font-size: 2rem;
      margin-right: 1rem;
      cursor: pointer;
    }
    .reduce_btn {
      font-size: 2rem;
      cursor: pointer;
    }
  }
}
.technology {
  .setting_btn,
  .slider_name {
    color: #fff;
  }
}
</style>
