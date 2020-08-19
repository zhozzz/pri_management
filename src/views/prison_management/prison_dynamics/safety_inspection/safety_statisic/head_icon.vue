<!--
 * @Description:
 * @Author:
 * @Date: 2019-10-14 10:25:16
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-13 14:53:28
 -->
<template>
  <div>
    <el-row class="head_item" :gutter="10">
      <el-col :span="span" v-for="(item,i) in list" :key="i">
        <div class="cards">
          <div class="icon_box">
            <img :src="list[i].url" alt />
          </div>
          <div class="info_box">
            <div>{{list[i].info}}</div>
            <div class="info_num" @click="item.isRouter?routerFnc(item):''">{{list[i].text}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      required: true,
      type: Array,
      default: () => {
        return [
          {
            url: null,
            text: '暂无数据',
            info: 'null',
            isRouter: 'false',
            routerString: '',
            paramsName: ''
          }
        ]
      }
    },

    span: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {}
  },
  methods: {
    routerFnc (val) {
      this.$router.push({ name: val.routerString, params: val.params })
    }
  }
}
</script>
<style lang="less" scoped>
.standard {
  .cards {
    position: relative;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 2rem 1rem;
    border: 1px solid rgba(205, 221, 237, 1);
    border-radius: 2px;
    background: #fbfcff;
    margin-bottom: 10px;
    align-items: center;

    .icon_box {
      width: 2rem;
      height: 2rem;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info_box {
      font-size: 1.2rem;
      font-weight: 500;
      margin-left: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #666;
      .info_num {
        color: #4099ed;
        font-size: 2rem;
        margin-left: 10px;
        cursor: pointer;
      }
      .warning {
        color: #f3763e;
      }
    }
  }
  .slot_btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
.technology {
  .cards {
    position: relative;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 2rem 1rem;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    border-radius: 2px;
    background: transparent;
    margin-bottom: 10px;
    align-items: center;

    .icon_box {
      width: 2rem;
      height: 2rem;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info_box {
      font-size: 1.2rem;
      font-weight: 500;
      margin-left: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #fff;
      .info_num {
        color: #4099ed;
        font-size: 2rem;
        margin-left: 10px;
        cursor: pointer;
      }
      .warning {
        color: #f3763e;
      }
    }
  }
  .slot_btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
