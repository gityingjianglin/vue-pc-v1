<!-- 选择用户 getOrgTree -->
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
      @change="getUserValue"
      :loading="loading">
      <el-option
        v-for="item in userList"
        :key="item.value"
        :label="item.selectLable"
        :value="item.selectLable">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { listQuery } from '@/api/editScene'
export default {
  name: '',
  data () {
    return {
      user: '',
      loading: false,
      userList: [],
      timeout: ''
    };
  },
  
  components: {},
  props: ['owner'],
  computed: {},
  
  methods: {
    getUser(query) {
      const params = {
        status: '0',
        pageSize: 10000,
        userType: '01',
        queryName: query
      }
      listQuery(params).then(data => {
        this.loading = false
        this.userList = data.rows
        this.userList.forEach((item) => {
          item.selectLable = item.nickName + '/' + item.userName
        })
      })
    },
    remoteMethod(query) {
      // debugger
      if (query !== '' && query.length > 1) {
        clearTimeout(this.timeout)
        this.loading = true;
        this.timeout = setTimeout(() => {
          this.getUser(query)
        })
      } else {
        this.userList = [];
      }
    },
    getUserValue (value) {
      this.$emit('getUserValue', value)
    }
  },
  
  mounted () {},
  
  created () {},
  watch: {
    owner (val) {
      // debugger
      this.user = val
    }
  }
}

</script>
<style lang='scss' scoped>
</style>