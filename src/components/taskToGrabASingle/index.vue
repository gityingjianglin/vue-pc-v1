<!-- 任务抢单 taskToGrabASingle -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      title="任务抢单"
      :visible.sync="taskToGrabASingleDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData" label-position="top">
              <div class="h-view show-double justify-space-between">
                <el-form-item label="预计开始时间：" prop="expectedStart">
                  <el-date-picker
                    @change="(val) => {getChooseTime(val, 'expectedStartTime')}"
                    v-model="formData.expectedStart"
                    type="date"
                    :clearable="false"
                    placeholder="开始时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预计闭环时间：" prop="expectedClosedLoop">
                  <el-date-picker
                    @change="(val) => {getChooseTime(val, 'expectedClosedLoopTime')}"
                    v-model="formData.expectedClosedLoop"
                    type="date"
                    :clearable="false"
                    placeholder="闭环时间">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="预计费用：" prop="expectedCost" class="cost-box">
                  <el-input v-model.number="formData.expectedCost" placeholder="请输入金额" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                  <div class="unit">元</div>
                </el-form-item>
                <div class="predict-content-box h-view justify-space-between">
                  <el-form-item label="预计人/天：" prop="expectedPeople" class="predict-box cost-box">
                    <el-input v-model.number="formData.expectedPeople" placeholder="请输入" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    <div class="unit">人</div>
                  </el-form-item>
                  <el-form-item label="预计人/天：" prop="expectedDays" class="predict-box day cost-box">
                    <el-input v-model.number="formData.expectedDays" placeholder="请输入" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
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
import uploadFile from '@/components/uploadFile/index'
import { taskGrab } from '@/api/task'
export default {
  name: '',
  data () {
    return {
      formData: {
        expectedStartTime: '', // 预计开始时间（时间戳）
        expectedStart: '',
        expectedClosedLoopTime: '', // 预计闭环时间（时间戳）
        expectedClosedLoop: '',
        expectedCost: '', // 预计费用
        expectedDays: '', // 预计天数
        expectedPeople: '', // 预计人数
        fileList: [],
        fileArr: []
      },
      closeDate: '',
      rules: {
        expectedStart: [
          { type: 'date', required: true, message: '请选择预计开始时间', trigger: 'change' }
        ],
        expectedClosedLoop: [
          { type: 'date', required: true, message: '请选择预计闭环时间', trigger: 'change' }
        ],
        expectedCost: [
          { required: true, message: '请输入预计费用', trigger: 'blur' }
        ],
        expectedPeople: [
        { required: true, message: '请输入预计人数', trigger: 'blur' }
        ],
        expectedDays: [
        { required: true, message: '请输入预计天数', trigger: 'blur' }
        ]
      },
      fileList: []
    };
  },
  props: ['taskToGrabASingleDrawer', 'taskId'],
  components: {
    NameOrIdAuto,
    uploadFile
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      debugger
      this.$emit('closeTaskToGrabASingleDrawer', str)
    },
    validateForm (formName) {
      let params = {
        taskId: this.taskId,
        ...this.formData
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          taskGrab(params).then((data) => {
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
    uploadFile (obj) {
      this.formData.fileList = [ // 附件列表
        {
          fileName: obj.fileName,
          filePath: obj.filePath,
          fileUrl: obj.fileUrl
        }
      ]
      this.$set(this.formData, 'fileArr', [{
        name: obj.fileName,
        url: obj.fileUrl
      }])
      // this.formData.fileArr = [{
      //   name: obj.fileName,
      //   url: obj.fileUrl
      // }]
    },
    // 删除上传文件
    removeFile () {
      debugger
      this.formData.fileList = []
      this.formData.fileArr = []
    },
    getChooseTime (val, str) {
      this.formData[str] = val.getTime()
    },
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
    // &.cost-box {
    //   position: relative;
    //   .el-input__inner {
    //     padding-right: 38px;
    //   }
    //   .unit {
    //     position: absolute;
    //     right: 12px;
    //     top: 50%;
    //     transform: translateY(-50%);
    //     font-size: 14px;
    //     color: rgba(0, 0, 0, 0.85);
    //   }
    // }
    // &.predict-box {
    //   width: 160px !important;
    //   .el-input {
    //     width: 160px !important;
    //   }
    // }
    // &.day {
    //   .el-form-item__label {
    //     opacity: 0;
    //   }
    // }
  }
}
</style>