<!-- 选择流程 flowSelect -->
<template>
  <div>
    <el-select
      v-model="user"
      filterable
      remote
      clearable
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      @change="getFlowValue"
      :loading="loading">
      <el-option
        v-for="item in userList"
        :key="item.processId"
        :label="item.processName"
        :value="item.processId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { processList } from '@/api/editScene'
export default {
  name: '',
  data () {
    return {
      user: '',
      loading: false,
      userList: []
    };
  },
  props: ['processName'],
  components: {},
  
  computed: {},
  
  methods: {
    getUser(query) {
      const params = {
        processName: query
      }
      processList(params).then(data => {
        this.loading = false
        this.userList = data.data
        // this.userList.forEach((item) => {
        //   item.selectLable = item.nickName + '/' + item.userName
        // })
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
    getFlowValue (value) {
      for (let i = 0, length = this.userList.length; i < length; i++) {
        if (this.userList[i].processId === value) {
          this.$emit('getFlowValue', this.userList[i])
          break
        }
      }
    }
  },
  
  mounted () {},
  
  created () {
  },
  watch: {
    processName (val) {
      debugger
      this.user = val
    }
  }
}

</script>
<style lang='scss' scoped>
</style>