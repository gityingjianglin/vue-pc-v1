<!-- 关联任务 relatedTasks -->
<template>
  <div>
    <el-drawer
      title="关联任务"
      :visible.sync="relatedTasksDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="related-tasks-content-box">
        <el-table
          :data="relatedTasksData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="taskId"
          default-expand-all
          v-loading="tableLoading"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="date"
            label="任务名称"
            min-width="170">
            <template slot-scope="scope">
              <span class="task-name">{{ scope.row.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="66"
            label="紧急度">
            <template slot-scope="scope">
              <span class="degree" :class="{'top-degree': scope.row.emergency === 10, 'middle-degree': scope.row.emergency === 20}">{{ scope.row.emergency|getDegree }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="66"
            label="重要度">
            <template slot-scope="scope">
              <span class="degree" :class="{'top-degree': scope.row.importance === 10, 'middle-degree': scope.row.importance === 20}">{{ scope.row.importance|getDegree }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="78"
            label="状态">
            <template slot-scope="scope">
              <div class="h-view align-center">
                <div class="dot" :class="{close: scope.row.status === 9 && scope.row.lateFlag !== 1, march: (scope.row.status === 1 || scope.row.status === 0) && scope.row.lateFlag !== 1}"></div>
                <div v-if="scope.row.lateFlag === 1">逾期</div>
                <div v-else>{{ scope.row.status|getState }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="76"
            label="是否逾期">
            <template slot-scope="scope">
              <span class="">{{ scope.row.lateFlag ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            width="160"
            label="所属平台/场景">
            <template slot-scope="scope">
              <span class="">{{ scope.row.platName }}/{{ scope.row.scenarioName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="processName"
            width="160"
            label="所属流程">
          </el-table-column>
          <el-table-column
            width="66"
            label="提报人">
            <template slot-scope="scope">
              <comName v-if="scope.row.createBy" :info="scope.row.createBy" type="create-by"></comName>
            </template>
          </el-table-column>
          <el-table-column
            width="66"
            label="抢单人">
            <template slot-scope="scope">
              <comName v-if="scope.row.grabUser" :info="scope.row.grabUser" type="grad-by"></comName>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            width="120"
            label="预计完成时间">
            <template slot-scope="scope">
              <span class="">{{ scope.row.expectedClosedLoopTime|getTime('yyyy/mm/dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            width="120"
            label="实际完成时间">
            <template slot-scope="scope">
              <span class="">{{ scope.row.actualFinishTime|getTime('yyyy/mm/dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            width="76"
            label="实际人天">
            <template slot-scope="scope">
              <span class="">{{ scope.row.actualPeople }}{{scope.row.actualPeople && scope.row.actualDays ? '/' : ''}}{{ scope.row.actualDays }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="actualCost"
            width="90"
            label="实际费用">
          </el-table-column>
          <el-table-column
            width="120"
            label="创建时间">
            <template slot-scope="scope">
              <span class="">{{ scope.row.createTime|getTime('yyyy/mm/dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="更新时间">
            <template slot-scope="scope">
              <span class="">{{ scope.row.updateTime|getTime('yyyy/mm/dd') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import comName from '@/components/comName/index'
import { taskGetRelatedTask } from '@/api/task'
// import scrollx from '@/base/scroll/scrollx'
export default {
  name: '',
  data () {
    return {
      tableLoading: false,
      relatedTasksData: []
    };
  },
  props: ['relatedTasksDrawer', 'taskId'],
  components: {
    // scrollx
    comName
  },
  
  computed: {
  },
  
  methods: {
    handleClose () {
      this.$emit('closeRelatedTasksDrawer')
    }
  },
  
  mounted () {},
  
  created () {},
  watch: {
    relatedTasksDrawer (val) {
      if (val) {
        this.tableLoading = true
        taskGetRelatedTask(this.taskId).then((data) => {
          this.tableLoading = false
          this.relatedTasksData = data.data
        }, () => {
          this.tableLoading = false
        })
      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .related-tasks-content-box {
    padding: 0 24px;
  }
</style>