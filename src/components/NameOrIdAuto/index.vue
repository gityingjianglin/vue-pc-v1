<template>
  <el-autocomplete
    v-model.trim="formData[bindKey]"
    :fetch-suggestions="querySearchAsync"
    :placeholder="placeholder"
    :size="size"
    :style="styleCss"
    clearable
    :debounce="800"
    @input="input"
    @blur="blur"
    @clear="clear"
    @select="handleSelect"
  ></el-autocomplete>
</template>
<script>
import { listByName } from "@/api/editScene";
export default {
  name: "NameOrIdAuto",
  data() {
    return {
      timeout: '',
      resultsFlag: true,
      userId: '',
      lastNickName: ''
    };
  },
  props: {
    blurHandler: {
      type: Function
    },
    inputHandler: {
      type: Function
    },
    selectResultHandler: {
      type: Function
    },
    clearResultHandler: {
      type: Function
    },
    styleCss: {
      type: String,
      default: 'width:215px'
    },
    placeholder: {
      type: String,
      default: '请输入用户账户或者用户名称'
    },
    size: {
      type: String,
      default: 'small'
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bindKey: {
      // 选中值的key
      type: String,
      default: 'userId'
    },
    realKey: {
      // 真实值的key，为解决不同key对应关系
      type: String,
      default: 'userId'
    }
  },
  created() {
  },
  methods: {
    querySearchAsync(queryString, cb) {
      console.log('querySearch')
      clearTimeout(this.timeout)
      if (queryString) {
        queryString = queryString.trim()
        // this.formData[this.bindKey] = queryString
        if (queryString.indexOf('/') > -1) {
          let queryArr = queryString.split('/')
          queryString = queryArr[1]
        }
        this.timeout = setTimeout(async () => {
          let res = await this.getListByNicknameOrId(queryString)
          res && res.forEach((item) => {
            item.value = item.nickName + '/' + item.userName
          })
          var results = queryString ? res.filter(this.createStateFilter(queryString)) : res;
          console.log('querySearchresults')
          console.log(results)
          cb(results);
        }, 200)
      } else {
        console.log('333333')
        cb([])
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleSelect(item) {
      console.log('select')
      console.log(item)
      debugger
      this.formData[this.bindKey] = item.value
      this.lastNickName = item.value
      this.$emit('selectResultHandler', item)
    },
    async getListByNicknameOrId (queryString) {
      let res = await listByName({
        nameParam : queryString,
        pageNum: 1,
        pageSize: 100,
        status: this.formData.status
      })
      if(res.rows.length > 0) {
        this.resultsFlag = true
      }else{
        this.resultsFlag = false
      }
      if (res && res.rows) {
        return res.rows
      }
    },
    reset () {
      this.formData[this.bindKey] = ''
      this.formData.autoValue = ''
    },
    clear () {
      console.log('clear')
      this.formData[this.bindKey] = ''
      this.formData.autoValue = ''
      this.$emit('clearResultHandler')
      document.activeElement.blur()
    },
    blur () {
      debugger
      if (!this.lastNickName) {
        this.formData[this.bindKey] = ''
      } else {
        this.formData[this.bindKey] = this.lastNickName
      }
      this.$emit('blurHandler')
    },
    input (value) {
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
