<!--
 * @Description:
 * @Author:
 * @Date: 2019-10-14 10:25:16
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:00:49
 -->
<template>
  <div>
    <el-row class="head_item" :gutter="10">
      <el-col :span="span" v-for="(item,i) in list" :key="i">
        <div class="cards" @click="item.isRouter?routerFnc(item):''">
          <div class="icon_box">
            <div v-if="i==0" class="slot_btn">
              <slot></slot>
            </div>
            <img :src="list[i].url" alt />
          </div>
          <div class="info_box">
            <div class="info_num">{{list[i].text}}</div>
            <div>{{list[i].info}}</div>
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
  data() {
    return {}
  },
  methods: {
    routerFnc(val) {
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
    padding: 2rem 1rem 2rem 2rem;
    border: 1px solid rgba(205, 221, 237, 1);
    border-radius: 2px;
    background: #fbfcff;
    margin-bottom: 10px;
    cursor: pointer;
    .icon_box {
      width: 6rem;
      height: 6rem;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info_box {
      font-size: 1.2rem;
      font-weight: 500;
      width: 60%;
      margin-left: 1.6rem;
      color: #666;
      .info_num {
        color: #4099ed;
        font-size: 2.4rem;
      }
      .warning {
        color: #f3763e;
      }
    }
  }
  .slot_btn {
    position: absolute;
    right: 10px;
    top: -5px;
  }
}
.technology {
  .cards {
    position: relative;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 2rem 1rem 2rem 2rem;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    border-radius: 2px;
    background: transparent;
    margin-bottom: 20px;
    cursor: pointer;
    .icon_box {
      width: 6rem;
      height: 6rem;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info_box {
      font-size: 1.2rem;
      font-weight: 500;
      width: 60%;
      margin-left: 1.6rem;
      color: #fff;
      .info_num {
        color: #4099ed;
        font-size: 2.4rem;
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
    top: -5px;
  }
}
</style>
