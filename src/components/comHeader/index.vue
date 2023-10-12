<!-- 头部导航 -->
<template>
  <div class="h-view com-header align-center justify-space-between">
    <div class="left h-view align-center">
      <div class="title">万链数字化转型管理平台</div>
      <div class="manu" @click="gotoDetail(0)" :class="{'now-page': routeName === '/'}">首页</div>
      <div class="manu" @click="gotoDetail(1)" :class="{'now-page': routeName === '/staging'}">工作台</div>
      <!-- <router-link :class="{'now-page': routeName === '/'}" :to="{path: '/'}">首页</router-link>
      <router-link :class="{'now-page': routeName === '/staging'}" :to="{path: '/staging'}">工作台</router-link> -->
      <el-dropdown placement="bottom" :class="{'now-page': routeName === '/sceneManagement' || routeName === '/taskManagement' || routeName === '/processManagement'}" @command="gotoPage">
        <span class="el-dropdown-link">数字化治理中心</span>
        <el-dropdown-menu slot="dropdown" class="mune-dropdown">
          <el-dropdown-item :command="0" :class="{'now-page': routeName === '/sceneManagement'}">场景管理</el-dropdown-item>
          <!-- <el-dropdown-item :command="1" :class="{'now-page': routeName === '/processManagement'}">流程管理</el-dropdown-item> -->
          <el-dropdown-item :command="2" :class="{'now-page': routeName === '/taskManagement'}">任务管理</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <router-link :to="{path: '/taskManagement'}">任务管理</router-link> -->
    </div>
    <div class="right">
      <div v-if="isIhaier === 'false'">
        <el-popover
          placement="bottom-end"
          popper-class="exit-login"
          trigger="hover">
          <div class="exit-btn" @click="outLoginOpt">退出登录</div>
          <el-button slot="reference">
            <div class="h-view align-center justify-center name">{{ nickName.slice(-2) }}</div>
            <div>{{ nickName }}</div>
          </el-button>
        </el-popover>
      </div>
      <div class="h-view align-center" v-else>
        <div class="h-view align-center justify-center name">{{ nickName.slice(-2) }}</div>
        <div>{{ nickName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/config'
import { getStore } from '@/utils/storage';
import { outLogin } from '@/utils/login'
export default {
  name: '',
  data () {
    return {
      isIhaier: '',
      routeName: '',
      nickName: ''
    };
  },

  components: {},

  computed: {},

  methods: {
    gotoPage (index) {
      debugger
      switch (index) {
        case 0:
          this.$router.push({
            path: '/sceneManagement'
          })
          break
        case 1:
          this.$router.push({
            path: '/processManagement'
          })
          break
        case 2:
          this.$router.push({
            path: '/taskManagement'
          })
          break
      }
    },
    gotoDetail (index) {
      switch (index) {
        case 0:
          this.$router.push({
            path: '/'
          })
          break
        case 1:
          this.$router.push({
            path: '/staging'
          })
          break
      }
    },
    outLoginOpt () {
      outLogin()
    }
  },

  mounted () {},

  created () {
    this.isIhaier = localStorage.getItem('client_userAgent')
    // debugger
    this.routeName = this.$route.path
    this.nickName = getStore(`${config.clientCode}NickName`)
  },
  watch: {
    $route (to, from) {
      this.routeName = to.path
      console.log(this.isIhaier)
      console.log('路由变化了')
      console.log('当前页面路由：' + to.path);
      console.log('上一个路由：' + from);
    }
  }
}

</script>
<style lang='scss' scoped>
.com-header {
  height: 48px;
  padding: 0 24px;
  background: #262F3E;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  .title {
    margin-right: 89px;
    font-size: 18px;
    color: #FFFFFF;
  }
  .manu {
    margin-right: 102px;
    line-height: 48px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    &.now-page {
      color: #fff;
    }
  }
  ::v-deep .el-button {
    border: none;
    background-color: transparent;
    padding: 0;
    span {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #FFFFFF;
    }
  }
  .right {
    font-size: 14px;
    color: #FFFFFF;
    .name {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      background: #0073E5;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      font-size: 12px;
    }
  }
}
::v-deep .el-dropdown {
  height: 48px;
  line-height: 48px;
  margin-right: 102px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  &.now-page {
    color: #fff;
  }
}
</style>