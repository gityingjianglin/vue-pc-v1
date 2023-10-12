<template>
  <div class="total-info">
    <h3>{{coverageDatas.name}}</h3>
    <div class="v">{{coverageDatas.digitalCoverage | percentFormat}}</div>
    <div class="task-box">
      <!-- <div class="task-item" v-show="coverageDatas.processProportion !== null">
        <span>流程占比：</span>
        <span class="">{{coverageDatas.processProportion}}%</span>
      </div> -->
      <div class="task-item" v-show="coverageDatas.processCount !== null">
        <span>流程总数：</span>
        <span>{{coverageDatas.processCount}}</span>
      </div>
      <div class="task-item" v-show="coverageDatas.closedLoopProcessCount !== null">
        <span>已闭环流程：</span>
        <span>{{coverageDatas.closedLoopProcessCount}}</span>
      </div>
      <div class="task-item" :class="{'warning' : coverageDatas.unclosedLoopProcessCount > 0}" v-show="coverageDatas.unclosedLoopProcessCount !== null">
        <span>未闭环流程：</span>
        <span>{{coverageDatas.unclosedLoopProcessCount}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoverageInfo',
  data () {
    return {
    };
  },
  props: {
    coverageDatas: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  components: {},

  computed: {},

  methods: {},

  mounted () {},

  created () {},
}

</script>
<style lang='scss' scoped>
  .total-info {
    min-width: 180px;
    h3 {
      overflow: hidden;
      height: 22px;
      margin: 16px 0;
      font-weight: bold;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .v {
      margin: 16px 0 28px 0;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 36px;
    }
    .task-box {
      margin-top: 20px;
      padding-bottom: 11px;
      .task-item {
        margin-bottom: 16px;
        font-weight: 400;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        span:last-child {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 22px;
          font-weight: bold;
        }
      }
      .task-item.warning {
        span:last-child {
          font-weight: bold;
          font-size: 16px;
          color: #F35050;
          line-height: 22px;
        }
      }
      .task-item:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>