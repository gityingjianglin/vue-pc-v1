<!-- 任务信息 taskInfo -->
<template>
  <div class="staging-every-task-info" @click="gotoTaskDetail">
    <div class="title-box h-view align-center justify-space-between">
      <div class="title over-dot" v-show="fromPage !== 'toDoCenter'">{{ info.taskName }}</div>
      <div class="title over-dot" :title="info.todoDesc" v-show="fromPage === 'toDoCenter'">{{ info.todoDesc }}</div>
      <div class="state-box h-view align-center" v-show="fromPage !== 'toDoCenter'">
        <div class="dot" :class="{close: info.status === 9 && info.lateFlag !== 1, march: (info.status === 1 || info.status === 0) && info.lateFlag !== 1}"></div>
        <div v-if="info.lateFlag === 1">逾期</div>
        <div v-else>{{ info.status|getState }}</div>
      </div>
    </div>
    <div class="content-box">
      <div class="every-info h-view align-center" v-show="info.processName">
        <div class="title">所属流程：</div>
        <div class="content">{{ info.processName }}</div>
      </div>
      <div class="h-view align-center">
        <div class="every-info h-view align-center flex1">
          <div class="title">提报人：</div>
          <div class="content">
            <comName v-if="info.createBy" :info="info.createBy" type="create-by"></comName>
          </div>
        </div>
        <div class="every-info h-view align-center flex1">
          <div class="title">抢单人：</div>
          <div class="content">
            <comName v-if="info.grabUser" :info="info.grabUser" type="grad-by"></comName>
          </div>
        </div>
      </div>
      <div class="h-view align-center justify-space-between">
        <div class="every-info h-view align-center">
          <div class="title">重要度：</div>
          <div class="content degree" :class="{'top-degree': info.importance === 10, 'middle-degree': info.importance === 20}">{{ info.importance|getDegree }}</div>
        </div>
        <div class="every-info h-view align-center">
          <div class="title">紧急度：</div>
          <div class="content degree" :class="{'top-degree': info.emergency === 10, 'middle-degree': info.emergency === 20}">{{ info.emergency|getDegree }}</div>
        </div>
        <div class="every-info h-view align-center">
          <div class="title">任务标签：</div>
          <div class="content">{{ info.taskType }}</div>
        </div>
      </div>
      <div class="every-info h-view align-center last">
        <div class="title">期望闭环时间：</div>
        <div class="content">{{ info.expectedClosedLoopTime|getTime('yyyy/mm/dd') }}</div>
      </div>
    </div>
    <div class="edit-box h-view align-center justify-end" v-show="fromPage !== 'toDoCenter' && (info.addFlag || info.updateFlag)">
      <el-popover
        placement="top-end"
        width="400"
        popper-class="manipulate-box"
        trigger="hover">
        <div class="manipulate">
          <div class="every-box h-view align-center" @click.stop="addNextVis" v-show="info.addFlag">
            <i class="el-icon-plus"></i>
            <p>新增</p>
          </div>
          <div class="every-box h-view align-center" v-show="info.updateFlag" @click.stop="editTask">
            <i class="el-icon-edit"></i>
            <p>编辑</p>
          </div>
          <!-- <div class="every-box h-view align-center">
            <i class="el-icon-delete"></i>
            <p>删除</p>
          </div> -->
        </div>
        <el-button slot="reference" @click.stop="">
          <!-- <i class="el-icon-more"></i> -->
          <img src="~@/assets/img/icon/icon_more.png" alt="">
        </el-button>
      </el-popover>
      <!-- <div class="spread-click">
        <i class="el-icon-edit"></i>
      </div>
      <div class="spread-click">
        <i class="el-icon-plus"></i>
      </div> -->
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
  props: ['info', 'fromPage'],
  components: {
    comName
  },
  
  computed: {},
  
  methods: {
    gotoTaskDetail () {
      this.$emit('gotoTaskDetail', this.info.taskId)
    },
    addNextVis () {
      this.$emit('addNextVis', this.info)
    },
    editTask () {
      this.$emit('editTask', this.info)
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
.content-box {
  height: 104px;
}
.edit-box {
  .el-popover__reference {
    padding: 0;
    border: none;
  }
  img {
    width: 16px;
    height: 16px;
  }
}

</style>