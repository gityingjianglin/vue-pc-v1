<!-- 每个流程信息 processInfo -->
<template>
  <div class="staging-every-task-info" @click="gotoDetail">
    <div class="title-box h-view align-center justify-space-between">
      <div class="title">{{ info.scenarioName }}</div>
    </div>
    <div class="content">
      <div class="every-info h-view align-center">
        <div class="title">数字化覆盖度：</div>
        <div class="content cover">{{ info.digitalCoverage }}{{ info.digitalCoverage === '-' ? '' : '%' }}</div>
      </div>
      <div class="h-view align-center">
        <div class="every-info h-view align-center flex1">
          <div class="title">业务主人：</div>
          <div class="content">
            <div v-if="info.bizOwnerList && info.bizOwnerList[0]">
              <comName :info="info.bizOwnerList[0]" type="biz-owner"></comName>
            </div>
            <!-- <comName v-if="info.bizOwnerList" :info="info.createBy" type="biz-owner"></comName> -->
          </div>
        </div>
        <div class="every-info h-view align-center flex1">
          <div class="title">科技融入：</div>
          <div class="content">
            <div v-if="info.techOwnerList && info.techOwnerList[0]">
              <comName :info="info.techOwnerList[0]" type="tech-owner"></comName>
            </div>
            <!-- <comName v-if="info.techOwnerList" :info="info.grabUser" type="tech-owner"></comName> -->
          </div>
        </div>
      </div>
      <div class="h-view align-center">
        <div class="every-info h-view align-center flex1">
          <div class="title">流程占比：</div>
          <div class="content">{{ info.processProportion }}</div>
        </div>
        <div class="every-info h-view align-center flex1">
          <div class="title">未闭环流程：</div>
          <div class="content" :class="{red: info.unclosedLoopProcessCount > 0}">{{ info.unclosedLoopProcessCount }}</div>
        </div>
      </div>
      <div class="h-view align-center">
        <div class="every-info h-view align-center flex1">
          <div class="title">未闭环任务：</div>
          <div class="content" :class="{red: info.unclosedLoopTaskCount > 0}">{{ info.unclosedLoopTaskCount }}</div>
        </div>
        <div class="every-info h-view align-center flex1">
          <div class="title">逾期任务：</div>
          <div class="content" :class="{red: info.lateTaskCount > 0}">{{ info.lateTaskCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import comName from '@/components/comName/index'
export default {
  name: '',
  data () {
    return {
    };
  },
  props: ['info'],
  components: {
    comName
  },
  
  computed: {},
  
  methods: {
    gotoDetail () {
      this.$emit('gotoScene', this.info.scenarioId)
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
.staging-every-task-info {
  width: 240px !important;
  .every-info {
    .cover {
      line-height: 24px;
      font-size: 16px;
    }
  }
  .red {
    color: #F35050;
  }
}
</style>