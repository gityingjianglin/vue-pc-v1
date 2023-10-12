<!-- 任务完成 finishTask -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      title="任务完成"
      :visible.sync="finishTaskDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData" label-position="top">
              <div class="h-view show-double justify-space-between">
                <el-form-item label="实际完成时间：" prop="actualFinish">
                  <el-date-picker
                    v-model="formData.actualFinish"
                    type="date"
                    @change="getActualTime"
                    placeholder="完成时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="实际费用：" prop="actualCost" class="cost-box">
                  <el-input v-model="formData.actualCost" placeholder="请输入金额" @input="chengeActualCost"></el-input>
                  <div class="unit">元</div>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <div class="predict-content-box h-view justify-space-between">
                  <el-form-item label="实际人/天：" prop="actualPeople" class="predict-box cost-box">
                    <el-input v-model="formData.actualPeople" placeholder="请输入" v-numberOnly></el-input>
                    <div class="unit">人</div>
                  </el-form-item>
                  <el-form-item label="实际人/天：" prop="actualDays" class="predict-box day cost-box">
                    <el-input v-model="formData.actualDays" placeholder="请输入" v-numberOnly></el-input>
                    <div class="unit">天</div>
                  </el-form-item>
                </div>
              </div>
              <el-form-item label="附件：" class="upload-box">
                <uploadFile @uploadFile="uploadFile" @removeFile="removeFile" :fileList="formData.fileArr"></uploadFile>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
        <div class="bottom-edit-box h-view align-center justify-end">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="validateForm('formData')" type="primary">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import NameOrIdAuto from '@/components/NameOrIdAuto/index'
import numberOnly from '@/assets/directives/numberOnly'
import { numFormatSelf } from '@/utils/utils'
import uploadFile from '@/components/uploadFile/index'
import { taskFinish } from '@/api/task'
export default {
  name: '',
  data () {
    return {
      formData: {
        actualCost: '', // 实际费用
        actualDays: '', // 实际天数	
        actualFinishTime: '', // 实际完成时间（时间戳）
        actualPeople: '', // 实际人数
        fileList: [], // 	附件列表
        finishId: '', // 	任务完成id（新增时为空；修改时必填）
        fileArr: [],
        actualFinish: ''
      },
      closeDate: '',
      rules: {
        actualFinish: [
          { type: 'date', required: true, message: '请选择实际完成时间', trigger: 'change' }
        ],
        actualPeople: [
          { required: true, message: '请输入实际人数', trigger: 'blur' }
        ],
        actualDays: [
          { required: true, message: '请输入实际天数', trigger: 'blur' }
        ],
        actualCost: [
          { required: true, message: '请输入实际费用', trigger: 'blur' }
        ]
      },
      fileList: []
    };
  },
  directives: {
    numberOnly
  },
  props: ['finishTaskDrawer', 'taskId'],
  components: {
    NameOrIdAuto,
    uploadFile
  },
  
  computed: {},
  
  methods: {
    chengeActualCost () {
      this.formData.actualCost = numFormatSelf(this.formData.actualCost)
    },
    getActualTime (time) {
      this.formData.actualFinishTime = time.getTime()
    },
    handleClose (str) {
      debugger
      this.formData = {
        actualCost: '', // 实际费用
        actualDays: '', // 实际天数	
        actualFinishTime: '', // 实际完成时间（时间戳）
        actualPeople: '', // 实际人数
        fileList: [], // 	附件列表
        finishId: '', // 	任务完成id（新增时为空；修改时必填）
        fileArr: [],
        actualFinish: ''
      }
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
        // done();
      });
      this.$emit('closeFinishTaskDrawer', str)
    },
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          console.log(this.formData)
          let params = {
            taskId: this.taskId,
            ...this.formData
          }
          taskFinish(params).then(() => {
            this.handleClose('add')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    numberReg () {
      this.dataForm.datas.weight = val.replace(/[^0-9.]/g, '')
    },
    // 删除上传文件
    removeFile () {
      debugger
      this.formData.fileList = []
      this.formData.fileArr = []
    },
    uploadFile (obj) {
      this.formData.fileList = [{
        fileName: obj.fileName,
        filePath: obj.filePath,
        fileUrl: obj.fileUrl
      }]
      this.$set(this.formData, 'fileArr', [{
        name: obj.fileName,
        url: obj.fileUrl
      }])
      // this.formData.fileArr = [{
      //   name: obj.fileName,
      //   url: obj.fileUrl
      // }]
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
.show-double {
  .predict-content-box {
    width: 328px;
  }
  ::v-deep .el-form-item {
    width: 328px !important;
    .el-input {
      width: 328px !important;
    }
    .el-input__prefix {
      left: auto;
      right: 5px;
      
    }
    .el-input__inner {
      padding-left: 12px;
    }
  }
}
</style>