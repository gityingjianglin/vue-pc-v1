<!-- 任务提报 taskReport -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      :title="taskReportTitle"
      :visible.sync="taskReportDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box" v-loading="loading">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData" label-position="top">
              <el-form-item label="任务名称：" prop="taskName">
                <el-input v-model="formData.taskName" maxlength="60"></el-input>
              </el-form-item>
              <el-form-item label="任务描述：">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="formData.taskDesc"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="流程名称：" prop="processName">
                  <flowSelect @getFlowValue="getFlowValue" :processName="formData.processName"></flowSelect>
                  <!-- <el-input v-model="formData.scenarioId"></el-input> -->
                </el-form-item>
                <el-form-item label="所属平台/场景：">
                  <el-input disabled v-model="formData.platformName"></el-input>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="上级任务：">
                  <taskSelect :superiorTask="formData.superiorTask" :cannotEdit="cannotEdit" @getTeskValue="getTeskValue"></taskSelect>
                  <!-- <el-input disabled v-model="formData.superiorTask" v-show="addChild"></el-input> -->
                </el-form-item>
                <el-form-item label="任务来源：">
                  <el-input v-model="formData.taskSource" maxlength="60"></el-input>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="紧急度：" prop="emergency">
                  <el-radio-group v-model="formData.emergency">
                    <el-radio :label="10">高</el-radio>
                    <el-radio :label="20">中</el-radio>
                    <el-radio :label="30">低</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="重要度：" prop="importance">
                  <el-radio-group v-model="formData.importance">
                    <el-radio :label="10">高</el-radio>
                    <el-radio :label="20">中</el-radio>
                    <el-radio :label="30">低</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="任务分类：" prop="taskType">
                  <el-radio-group v-model="formData.taskType">
                    <el-radio :label="1">数字化断点</el-radio>
                    <el-radio :label="2">效能优化</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="任务类型：" prop="taskClass">
                  <el-radio-group v-model="formData.taskClass">
                    <el-radio :label="item.dictValue" v-for="(item, index) in taskClass" :key="index">{{ item.dictLabel }}</el-radio>
                    <!-- <el-radio :label="2">效能优化</el-radio> -->
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="期望闭环时间：" prop="expectedClosedLoop">
                  <el-date-picker
                    @change="getExpectedClosedLoop"
                    v-model="formData.expectedClosedLoop"
                    type="date"
                    :clearable="false"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
              <el-form-item label="关联人员：">
                <multipleSelect @getUserValue="getUserValue" :owner="formData.relatedUserSelect"></multipleSelect>
              </el-form-item>
              <el-form-item label="任务依赖：">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="formData.taskDependency"
                  maxlength="100"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item label="附件：" class="upload-box">
                <uploadFile @uploadFile="uploadFile" :fileList="formData.fileArr" @removeFile="removeFile"></uploadFile>
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
import flowSelect from '@/components/getOrgTree/flowSelect'
import taskSelect from '@/components/getOrgTree/taskSelect'
import multipleSelect from '@/components/getOrgTree/multipleSelect'
import uploadFile from '@/components/uploadFile/index'
import { taskAdd, taskUpdate, taskDetail } from '@/api/task'
import { treeType } from '@/api/editScene'
export default {
  name: '',
  data () {
    return {
      formData: {
        bufuId: '', // 产业/企业id（流程不为空时必填）
        emergency: '', // 紧急度：10-高 20-中 30-低
        expectedClosedLoopTime: '', // 期望闭环时间（时间戳）
        fileList: [ // 附件列表
          // {
          //   fileName: '',
          //   filePath: '',
          //   fileUrl: ''
          // }
        ],
        importance: '', // 	重要度：10-高 20-中 30-低
        intention: '', // 	意向（用于二期）
        parentId: '', // 	父级任务id
        platId: '', // 平台id（流程不为空时必填）
        processId: '', // 	流程id（流程不为空时必填）
        scenarioId: '', // 场景id（流程不为空时必填）
        taskDependency: '', // 	任务依赖
        taskDesc: '', // 	任务描述
        taskId: '', // 	任务id（新增时为空；修改时必填）
        taskName: '', // 	任务名称
        taskSource: '', // 	任务来源
        taskType: '', // 	任务分类：1-数字化断点 2-效能优化
        platformName: '', // 平台/场景
        superiorTask: '',
        processName: '',
        fileArr: [],
        taskClass: '',
        relatedUserList: [],
        relatedUserSelect: [],
        taskClass: ''
      },
      closeDate: '',
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        taskType: [
          { required: true, message: '请选择任务分类', trigger: 'change' }
        ],
        emergency: [
          { required: true, message: '请选择紧急度', trigger: 'change' }
        ],
        importance: [
          { required: true, message: '请选择重要度', trigger: 'change' }
        ],
        expectedClosedLoop: [
          { type: 'date', required: true, message: '请选择期望闭环时间', trigger: 'change' }
        ],
        processName: [
          { required: true, message: '请选择流程名称', trigger: 'change' }
        ],
        taskClass: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ]
      },
      fileList: [],
      addChild: false,
      loading: false,
      isEdit: false,
      taskClass: [],
      cannotEdit: false
    };
  },
  props: ['taskReportDrawer', 'taskReportTitle'],
  components: {
    NameOrIdAuto,
    flowSelect,
    taskSelect,
    uploadFile,
    multipleSelect
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      debugger
      this.isEdit = false
      this.addChild = false
      this.formData = {
        bufuId: '', // 产业/企业id（流程不为空时必填）
        emergency: '', // 紧急度：10-高 20-中 30-低
        expectedClosedLoopTime: '', // 期望闭环时间（时间戳）
        expectedClosedLoop: '', // 期望闭环时间
        fileList: [ // 附件列表
        ],
        importance: '', // 	重要度：10-高 20-中 30-低
        intention: '', // 	意向（用于二期）
        parentId: '', // 	父级任务id
        platId: '', // 平台id（流程不为空时必填）
        processId: '', // 	流程id（流程不为空时必填）
        scenarioId: '', // 场景id（流程不为空时必填）
        taskDependency: '', // 	任务依赖
        taskDesc: '', // 	任务描述
        taskId: '', // 	任务id（新增时为空；修改时必填）
        taskName: '', // 	任务名称
        taskSource: '', // 	任务来源
        taskType: '', // 	任务分类：1-数字化断点 2-效能优化
        platformName: '', // 平台/场景
        superiorTask: '',
        processName: '',
        fileArr: [],
        relatedUserList: [],
        relatedUserSelect: [],
        taskClass: ''
      }
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
        // done();
      });
      this.$emit('closeTaskReportDrawer', str)
    },
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.formData.relatedUserSelect && this.formData.relatedUserSelect.length > 0) {
            let arr = []
            this.formData.relatedUserSelect.forEach((item) => {
              arr.push({
                nickName: item.split('/')[0],
                userName: item.split('/')[1]
              })
            })
            this.formData.relatedUserList = arr
          } else {
            this.formData.relatedUserList = []
          }
          console.log(this.formData)
          if (!this.isEdit) {
            taskAdd(this.formData).then((data) => {
              this.loading = false
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.handleClose('add')
            }, () => {
              this.loading = false
            })
          } else {
            taskUpdate(this.formData).then((data) => {
              this.loading = false
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.handleClose('add')
            }, () => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    initAdd (obj) {
      debugger
      if (obj) {
        this.cannotEdit = true
      }
      this.addChild = true
      // this.formData.taskId = obj.teskId
      this.$set(this.formData, 'superiorTask', `${obj.platName}/${obj.scenarioName}/${obj.processName}/${obj.taskName}`)
      // this.formData.superiorTask = `${obj.platName}/${obj.scenarioName}/${obj.processName}/${obj.taskName}`
      this.formData.parentId = obj.taskId
    },
    getFlowValue (obj) {
      this.formData.bufuId = obj.bufuId
      this.formData.platId = obj.platId
      this.formData.processId = obj.processId
      this.formData.processName = obj.processName
      this.formData.scenarioId = obj.scenarioId
      this.formData.platformName = `${obj.platName}/${obj.scenarioName}`
    },
    getTeskValue (val) {
      this.formData.parentId = val
    },
    getExpectedClosedLoop (val) {
      this.formData.expectedClosedLoopTime = val.getTime()
    },
    uploadFile (obj) { // 文件上传成功
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
    getDetail (taskId) {
      this.loading = true
      this.isEdit = true
      this.cannotEdit = false
      taskDetail(taskId).then((data) => {
        this.loading = false
        data.data.taskType = data.data.taskType === '数字化断点' ? 1 : 2
        data.data.superiorTask = data.data.parentName
        data.data.expectedClosedLoop = new Date(data.data.expectedClosedLoopTime)
        data.data.platformName = `${data.data.platName}/${data.data.scenarioName}`
        if (!data.data.fileList) {
          data.data.fileList = []
        } else {
          data.data.fileArr = [{
            name: data.data.fileList[0].fileName,
            url: data.data.fileList[0].fileUrl
          }]
        }
        if (data.data.relatedUserList && data.data.relatedUserList.length > 0) {
          let arr = []
          data.data.relatedUserList.forEach((item) => {
            arr.push(`${item.nickName}/${item.userName}`)
          })
          data.data.relatedUserSelect = arr
        } else {
          data.data.relatedUserSelect = []
        }
        debugger
        data.data.taskClass = this.getClass(data.data.taskClass)
        this.formData = data.data
      }, () => {
        this.loading = false
      })
    },
    init () {
      treeType('pmp_task_class').then((data) => {
        this.taskClass = data.data.pmp_task_class
      })
    },
    getUserValue (val) {
      // relatedUserList
      this.$set(this.formData, 'relatedUserSelect', val)
    },
    getClass (str) {
      for (let i = 0, length = this.taskClass.length; i < length; i++) {
        if (this.taskClass[i].dictLabel === str) {
          return this.taskClass[i].dictValue
        }
      }
    }
  },
  
  mounted () {},
  
  created () {
    this.init()
  },
}

</script>
<style lang='scss' scoped>
::v-deep .el-form-item {
  .el-input__prefix {
    left: auto;
    right: 5px;
  }
  .el-input__inner {
    padding-left: 12px;
  }
}
</style>