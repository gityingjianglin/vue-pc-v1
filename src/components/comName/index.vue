<!-- 公共姓名展示 comName -->
<template>
  <div>
    <el-popover
      placement="right-start"
      popper-class="com-name-popover"
      trigger="hover">
      <div class="detail-info">
        <div class="name-box h-view align-center">
          <div class="name h-view align-center justify-center" :class="[type]">{{ info.nickName ? info.nickName.slice(-2) : '' }}</div>
          <p>{{ info.nickName }}</p>
        </div>
        <div>
          <div class="every-info h-view align-center">工号：{{ info.userName }}</div>
          <!-- <div class="every-info h-view align-center">部门：财务</div>
          <div class="every-info h-view align-center">直线：谈波</div> -->
        </div>
      </div>
      <el-button slot="reference">
        <div class="h-view align-center justify-center name" :class="[type]">{{ info.nickName ? info.nickName.slice(-2) : '' }}</div>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
    };
  },
  props: ['info', 'type'],
  components: {},
  
  computed: {},
  
  methods: {},
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
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
  .name {
    width: 32px;
    height: 32px;
    // margin-right: 8px;
    background: #0073E5;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    font-size: 12px;
    &.biz-owner {
      background-color: #0073E5 !important;
    }
    &.tech-owner {
      background-color: #8145DE !important;
    }
    &.create-by {
      background-color: #FC9928 !important;
    }
    &.grad-by {
      background-color: #00C1E5 !important;
    }
  }
}
</style>