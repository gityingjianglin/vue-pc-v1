<!-- uploadFile -->
<template>
  <div>
    <el-upload
      class="upload-demo"
      action="/stage-api/integration/huaweiObs/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="successFile"
      :before-upload="beforeUpload"
      :headers="headers"
      :data="uploadData"
      :file-list="fileList">
      <el-button size="small">上传附件</el-button>
      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
    </el-upload>
  </div>
</template>

<script>
import { getStore } from '@/utils/storage'
import config from '@/config/config'
export default {
  name: '',
  data () {
    return {
      headers: {
        Authorization: 'Bearer ' + getStore('clientPmpToken')
      },
      fileListArr: this.fileList,
      uploadData: {
        clientId: getStore(`${config.clientCode}ClientId`),
        isPublic: true
      }
    };
  },
  props: ['fileList'],
  components: {},
  
  computed: {},
  
  methods: {
    beforeUpload (file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      // const extension =
      //   testmsg === 'pdf' ||
      //   testmsg === 'PDF'
      const isLt2M = file.size / 1024 / 1024 < 50

      // if (!extension) {
      //   this.$message.error('只能上传pdf格式文件!')
      //   return false
      // }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过50M!')
        return false
      }
      this.loading = true
    },
    handleRemove(file, fileList) {
      debugger
      this.$emit('removeFile')
    },
    handlePreview(file) {
      debugger
      console.log(file);
    },
    successFile(response, file, fileList) {
      debugger
      if (response.code === 200) {
        this.$emit('uploadFile', response.data)
      }
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
</style>