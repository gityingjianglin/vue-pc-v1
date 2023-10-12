<!-- 多选用户 multipleSelect -->
<template>
  <div>
    <el-select
      v-model="user"
      filterable
      ref="select"
      remote
      multiple
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
      user: this.owner,
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
      this.$refs.select.query = ''
      this.$emit('getUserValue', value)
    }
  },
  
  mounted () {},
  
  created () {
    debugger
    console.log(this.owner)
  },
  watch: {
    owner: {
      handler(val) {
        debugger
        // 深度监听immutableTitle属性的变化
        this.user = val
      },
      deep: true
    }
  }
}

</script>
<style lang='scss' scoped>
::v-deep .el-select {
  width: 100%;
  input {
    height: 32px !important;
  }
}
</style>