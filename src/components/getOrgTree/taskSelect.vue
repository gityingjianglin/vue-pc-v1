<!-- 选择任务 taskSelect -->
<template>
  <div>
    <el-select
      v-model="user"
      filterable
      remote
      clearable
      :disabled="cannotEdit"
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      @change="getTeskValue"
      :loading="loading">
      <el-option
        v-for="item in userList"
        :key="item.value"
        :label="item.processName"
        :value="item.taskId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { taskSampleList } from '@/api/task'
export default {
  name: '',
  data () {
    return {
      user: this.superiorTask,
      loading: false,
      userList: []
    };
  },
  props: ['superiorTask', 'cannotEdit'],
  components: {},
  
  computed: {},
  
  methods: {
    getUser(query) {
      const params = {
        taskName: query,
        statusList: '0,1'
      }
      taskSampleList(params).then(data => {
        this.loading = false
        this.userList = data.data
        this.userList.forEach((item) => {
          item.processName = `${item.platName}/${item.scenarioName}/${item.processName}/${item.taskName}`
        })
      })
    },
    remoteMethod(query) {
      debugger
      if (query !== '') {
        clearTimeout(this.timeout)
        this.loading = true;
        this.getUser(query)
      } else {
        this.userList = [];
      }
    },
    getTeskValue (value) {
      this.$emit('getTeskValue', value)
    }
  },
  
  mounted () {},
  
  created () {
  },
  watch: {
    superiorTask: {
      handler(val) {
        // 深度监听immutableTitle属性的变化
        this.user = val
      },
      deep: true
    }
  }
}

</script>
<style lang='scss' scoped>
</style>