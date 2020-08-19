<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-28 17:05:28
 * @LastEditTime: 2019-11-25 15:50:04
 * @LastEditors: zhuhao
 -->
<template>
  <div class="yn_page">
    <menuTree :menuList="['工作台']" />

    <!-- <div class="yn_page_title"></div> -->
    <el-switch v-model="delIconVisible" inactive-text="管理菜单："></el-switch>
    <el-card style="margin-top:10px" shadow="hover" v-for="(menuMoudle,i) in moduleList" :key="i">
      <div slot="header">
        <div class="add_item">
          <b>{{menuMoudle.menuName}}</b>
          <el-row
            @click.native="openDialog(menuMoudle.menuId,i)"
            class="plus_div add_div"
            type="flex"
            align="middle"
            justify="center"
          >
            <el-col :span="24">
              <el-popover trigger="click">
                <img class="plus_img" slot="reference" :src="require('@/assets/other/plus.png')" />
                <div class="mune_box" v-if="currentMenuList.length>0">
                  <div class="mune_item" v-for="(menu,i) in currentMenuList" :key="i">
                    <div class="mune_icon_box" @click="addMenu2User(menu.menuId,i)">
                      <img v-if="menu.menuIcon!==null" class="icon_img" :src="menu.menuIcon" />
                      <img v-else class="icon_img" :src="require('@/assets/other/smile.png')" />
                      <div class="icon_name">{{menu.menuName}}</div>
                    </div>
                  </div>
                </div>
                <el-row
                  type="flex"
                  align="middle"
                  justify="center"
                  v-if="currentMenuList.length==0"
                >
                  <el-col :span="24" style="text-align:center">
                    <img
                      class="plus_img"
                      style="width:64px;height:64px"
                      :src="require('@/assets/other/empty.png')"
                    />
                    <div class="icon_name">没有菜单</div>
                  </el-col>
                </el-row>
              </el-popover>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="min-height:100px">
        <div class="item_box">
          <div class="item" v-for="(menu,j) in menuMoudle.hasMenuList" :key="j">
            <!--<el-popover placement="top" trigger="hover" width="50">
              <div style="text-align:center">
                <el-button
                  slot="reference"
                  @click="delMenu2User(menu.workbenchGuid,menuMoudle.menuId,i)"
                  type="danger"
                >删除</el-button>
              </div>
              <el-row
                type="flex"
                align="middle"
                justify="center"
                class="plus_div"
                @click.native="$router.push({ name: menu.menuEnName })"
                slot="reference"
              >
                <el-col :span="24">
                  <img v-if="menu.menuIcon!=null" class="plus_img" :src="menu.menuIcon" />
                  <img
                    v-if="menu.menuIcon==null"
                    class="plus_img"
                    :src="require('@/assets/other/smile.png')"
                  />
                </el-col>
              </el-row>
            </el-popover>-->
            <el-badge
              value="删除"
              @click.native="delMenu2User(menu.workbenchGuid,menuMoudle.menuId,i)"
              style="cursor: pointer;"
              :hidden="!delIconVisible"
            >
              <div class="plus_div" @click="$router.push({ name: menu.menuEnName })">
                <img v-if="menu.menuIcon!=null" class="plus_img" :src="menu.menuIcon" />
                <img
                  v-if="menu.menuIcon==null"
                  class="plus_img"
                  :src="require('@/assets/other/smile.png')"
                />
              </div>
            </el-badge>
            <div class="menu_name">{{menu.menuName}}</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- <el-dialog title="菜单" :visible.sync="menuDialog" width="60%">
      <el-row :gutter="10" v-if="currentMenuList.length>0">
        <el-col :span="4" style="margin-bottom:15px" v-for="(menu,i) in currentMenuList" :key="i">
          <el-row
            @click.native="addMenu2User(menu.menuId,i)"
            type="flex"
            align="middle"
            justify="center"
            class="plus_div"
          >
            <el-col :span="24">
              <img v-if="menu.menuIcon!=null"
                   class="plus_img"
                   :src="menu.menuIcon" />
              <img v-if="menu.menuIcon==null"
                   class="plus_img"
                   :src="require('@/assets/other/smile.png')" />
            </el-col>
          </el-row>
          <div class="menu_name">{{menu.menuName}}</div>
        </el-col>
      </el-row>
      <el-row type="flex"
              align="middle"
              justify="center"
              v-if="currentMenuList.length==0">
        <el-col :span="24"
                style="text-align:center">
          <img class="plus_img"
               style="width:64px;height:64px"
               :src="require('@/assets/other/empty.png')" />
          <div class="menu_name">没有菜单</div>
        </el-col>
      </el-row>
    </el-dialog>-->
  </div>
</template>

<script>
import { inputSpecialCharactersValidator } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'

export default {
  name: 'workbench',
  components: {
    menuTree
  },
  data () {
    return {
      currentUserId: '',
      // 模块列表
      moduleList: [],
      allMenuList: [],
      currentMenuList: [],
      menuDialog: false,
      currentOpenMoudleId: '',
      currentModuleIndex: '',
      delIconVisible: false
    }
  },

  created () {
    this.currentUserId = JSON.parse(localStorage.getItem('user')).userGuid
    // 获得所有需要显示在工作台上的菜单模块数据
    this.getUserMoudleList()
  },
  methods: {
    getUserMoudleList () {
      this.moduleList = []
      this.allMenuList = []
      this.axios
        .get(
          this._global.userUrl +
            '/menu/getMenuInWorkBench/' +
            this.currentUserId +
            '/?t=' +
            new Date().getTime()
        )
        .then(rep => {
          this.moduleList = rep.data
          this.moduleList.unshift({ menuName: '常用功能', menuId: 'OTHER' })
          this.moduleList.forEach(module => {
            // 获取该模块下当前用户已有的菜单list
            this.axios
              .get(
                this._global.userUrl +
                  '/workbench/byUserAndParent/' +
                  this.currentUserId +
                  '/' +
                  module.menuId +
                  '/?t=' +
                  new Date().getTime()
              )
              .then(rep => {
                module.hasMenuList = rep
                this.$forceUpdate()
              })
          })
          this.getChildrenMenu(0)
        })
    },

    getChildrenMenu (i) {
      // 获取该菜单下的所有可以点击跳转的子菜单
      if (i == this.moduleList.length) {
        return
      }

      this.axios
        .post(this._global.userUrl + '/menu/getMenuByParentId', {
          menuId: this.moduleList[i].menuId,
          userId: this.currentUserId
        })
        .then(rep => {
          rep.data.forEach(menu => {
            menu.moudleMenuId = this.moduleList[i].menuId
            this.allMenuList.push(menu)
          })
          i++
          this.getChildrenMenu(i)
        })
    },
    openDialog (moudleId, i) {
      this.currentOpenMoudleId = moudleId
      this.currentModuleIndex = i
      this.getMenuLsitByMoudle(moudleId)
      this.menuDialog = true
    },
    getMenuLsitByMoudle (mouduleId) {
      this.currentMenuList = []
      // 过滤掉该模块已有的菜单
      let hasMenuList = this.moduleList.filter(
        module => module.menuId == mouduleId
      )[0].hasMenuList
      this.currentMenuList = this.allMenuList.filter(menu => {
        let flag = true
        hasMenuList.forEach(hasMenu => {
          if (menu.menuId == hasMenu.menuGuid) {
            flag = false
          }
        })
        return (mouduleId == 'OTHER' || menu.moudleMenuId == mouduleId) && flag
      })
      console.log(this.allMenuList)
      console.log(this.currentMenuList)
    },
    addMenu2User (menuId, i) {
      let param = {
        menuGuid: menuId,
        moduleMenuGuid: this.currentOpenMoudleId,
        userGuid: this.currentUserId
      }
      this.axios.post(this._global.userUrl + '/workbench', param).then(rep => {
        // 刷新该模块数据
        this.refreshModule()
        // 减少当前模块里的这个菜单
        this.currentMenuList.splice(i, 1)
      })
    },
    refreshModule () {
      this.axios
        .get(
          this._global.userUrl +
            '/workbench/byUserAndParent/' +
            this.currentUserId +
            '/' +
            this.currentOpenMoudleId +
            '/?t=' +
            new Date().getTime()
        )
        .then(rep => {
          console.log(rep)
          this.moduleList[this.currentModuleIndex].hasMenuList = rep
          this.$forceUpdate()
        })
    },

    delMenu2User (workbenchGuid, moudleId, i) {
      if (!this.delIconVisible) {
        return
      }
      console.log('asdasdas')
      this.currentModuleIndex = i
      this.currentOpenMoudleId = moudleId
      this.axios
        .delete(this._global.userUrl + '/workbench/' + workbenchGuid)
        .then(rep => {
          // 刷新该模块数据
          this.refreshModule()
        })
    }
  }
}
</script>
<style lang="less" scoped>
.plus_div {
  width: 40/14rem;
  height: 40/14rem;
  //   border: 1px solid #fff;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin: 0 auto;
}
.plus_img {
  width: 100%;
  height: 100%;
}
.plus_div:hover {
  box-shadow: 0px 0px 5px #979494;
}
.menu_name {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  padding: 0.5rem 0;
}
.mune_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.mune_icon_box {
  width: 100%;
  display: flex;
  align-items: center;
  .icon_img {
    width: 22/14rem;
    height: 22/14rem;
    margin: 0 25/14rem;
  }
  .icon_name {
    text-align: left;
    padding: 0.5rem 0;
    width: 150/14rem;
  }
}
.item_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 100/14rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 20px 10px;
  position: relative;
}
.add_item {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  position: relative;
  height: 40/14rem;

  .add_div {
    top: 0;
    right: 10px;
    position: absolute;
    // transform: translateY(-50%);
    border: 1px dashed #ccc;
  }
}
.technology {
  .el-card {
    background: transparent;
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    .el-card__header {
      border-bottom: 1px solid #7cdafd;
    }
  }
}
</style>
