<!-- 流程新增编辑 -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      :title="editFlowPathTitle"
      :visible.sync="editFlowPathDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box" v-loading="loading">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
              <el-form-item label="流程名称：" prop="processName" :rules="getDynamicRules('流程名称')" class="mast-fill">
                <el-input v-model="ruleForm.processName" maxlength="60"></el-input>
                <div class="icon">*</div>
              </el-form-item>
              <el-form-item label="流程描述：">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="ruleForm.processDesc"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="所属平台/场景：">
                  <el-input disabled v-model="ruleForm.platform"></el-input>
                </el-form-item>
                <el-form-item label="上级/父级流程：">
                  <el-select
                    v-model="ruleForm.parentId"
                    filterable
                    clearable
                    placeholder="请输入关键词">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.processName"
                      :value="item.processId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="前置流程：">
                  <el-select
                    v-model="ruleForm.preId"
                    filterable
                    clearable
                    placeholder="请输入关键词">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.processName"
                      :value="item.processId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="业务主人：" prop="bizOwnerSelect" :rules="getDynamicRules('业务主人')" class="mast-fill">
                  <div class="icon">*</div>
                  <getOrgTree @getUserValue="(value) => {getUserValue(value, 'bizOwnerSelect')}" :owner="ruleForm.bizOwnerSelect"></getOrgTree>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="科技融入：" prop="techOwnerSelect" :rules="getDynamicRules('科技融入')" class="mast-fill">
                  <div class="icon">*</div>
                  <getOrgTree @getUserValue="(value) => {getUserValue(value, 'techOwnerSelect')}" :owner="ruleForm.techOwnerSelect"></getOrgTree>
                </el-form-item>
                <el-form-item label="流程状态：" prop="status" :rules="getDynamicRules('流程状态')" class="mast-fill">
                <div class="icon">*</div>
                  <el-radio-group v-model="ruleForm.status" :disabled="isEdit">
                    <el-radio label="0">有数字化断点</el-radio>
                    <el-radio label="1">无数字化断点</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <el-form-item label="流程类型：" prop="processType" :rules="getDynamicRules('流程类型')" class="mast-fill">
                <div class="icon">*</div>
                <el-radio-group v-model="ruleForm.processType">
                  <el-radio :label="1">流程</el-radio>
                  <el-radio :label="2">节点</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="附件：" class="upload-box">
                <uploadFile @uploadFile="uploadFile" @removeFile="removeFile" :fileList="ruleForm.fileArr"></uploadFile>
              </el-form-item>
              <!-- <div class="h-view show-double justify-space-between">
                <el-form-item label="是否系统自动：" prop="sysAutoFlag" :rules="getDynamicRules('是否系统自动')" class="mast-fill">
                  <div class="icon">*</div>
                  <el-radio-group v-model="ruleForm.sysAutoFlag">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="系统名称：" v-show="ruleForm.sysAutoFlag === '1'">
                  <el-input v-model="ruleForm.sysName" maxlength="60"></el-input>
                </el-form-item>
              </div> -->
            </el-form>
          </div>
        </el-scrollbar>
        <div class="bottom-edit-box h-view align-center justify-end">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="validateForm('ruleForm')" type="primary">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import uploadFile from '@/components/uploadFile/index'
import NameOrIdAuto from '@/components/NameOrIdAuto/index'
import getOrgTree from '@/components/getOrgTree/index'
// import flowSelect from '@/components/getOrgTree/flowSelect'
import { processList, processAdd, processDetail, processUpdate } from '@/api/editScene'
export default {
  name: '',
  data () {
    return {
      ruleForm: {
        bizOwnerSelect: '', // 业务主人
        bizOwnerList: [], // 业务主人
        bufuId: '', // 产业/企业id
        platId: '', // 平台id
        parentId: '', // 父级流程id
        preId: '', // 前置流程id
        scenarioId: '', // 场景id（新增时为空；修改时必填）
        techOwnerSelect: '', // 科技融入
        techOwnerList: [], // 科技融入
        platform: '',
        sysName: '', // 系统名称：如果系统自动，则填写系统名称
        sysAutoFlag: '', // 是否系统自动：0-否 1-是
        status: '', // 流程状态：0-有数字化断点/1-无数字化断点
        processName: '', // 流程名称
        processId: '',
        processDesc: '', // 流程描述
        fileList: [],
        processType: 1,
        fileArr: []
      },
      rules: {
      },
      loadingBizOwner: false,
      userList: [],
      loading: false,
      isEdit: false
    };
  },
  props: ['editFlowPathDrawer', 'state', 'editFlowPathTitle', 'scenarionInfo'],
  components: {
    NameOrIdAuto,
    getOrgTree,
    uploadFile
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      this.isEdit = false
      this.ruleForm = {
        bizOwnerSelect: '', // 业务主人
        bizOwnerList: [], // 业务主人
        bufuId: '', // 产业/企业id
        platId: '', // 平台id
        parentId: '', // 父级流程id
        preId: '', // 前置流程id
        scenarioId: '', // 场景id（新增时为空；修改时必填）
        techOwnerSelect: '', // 科技融入
        techOwnerList: [], // 科技融入
        platform: '',
        sysName: '', // 系统名称：如果系统自动，则填写系统名称
        sysAutoFlag: '', // 是否系统自动：0-否 1-是
        status: '', // 流程状态：0-有数字化断点/1-无数字化断点
        processName: '', // 流程名称
        processId: '',
        processDesc: '', // 流程描述
        fileList: [],
        processType: 1,
        fileArr: []
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
        // done();
      });
      this.$emit('closeFlowPathDrawer', str)
    },
    getDynamicRules(field) {
      // 动态生成每个表单项的验证规则
      return [
        { validator: (rule, value, callback) => this.validateField(rule, value, callback, field), trigger: ['blur', 'change'] }
      ];
    },
    validateField(rule, value, callback, field) {
      // 自定义验证函数，验证每个表单项的字段
      if (!value && field !== '所属平台') {
        callback(new Error(`${field}不能为空`));
      } else {
        // 其他自定义验证逻辑
        // ...
        if (field === '所属平台') {
          if (value.length === 0) {
            callback(new Error(`${field}不能为空`));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    },
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          // alert('submit!');
          this.ruleForm.bizOwnerList[0] = {
            nickName: this.ruleForm.bizOwnerSelect.split('/')[0],
            userName: this.ruleForm.bizOwnerSelect.split('/')[1]
          }
          this.ruleForm.techOwnerList[0] = {
            nickName: this.ruleForm.techOwnerSelect.split('/')[0],
            userName: this.ruleForm.techOwnerSelect.split('/')[1]
          }
          let params = JSON.parse(JSON.stringify(this.ruleForm))
          params.status = +params.status
          params.sysAutoFlag = +params.sysAutoFlag
          console.log(this.ruleForm)
          if (!this.isEdit) {
            processAdd(params).then((data) => {
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
            processUpdate(params).then((data) => {
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
    getUserValue (value, str) {
      this.$set(this.ruleForm, str, value)
    },
    getUser(scenarioId) {
      const params = {
        scenarioId: scenarioId
      }
      processList(params).then(data => {
        this.loading = false
        this.userList = data.data
      })
    },
    init (scenarionInfo) {
      this.$set(this.ruleForm, 'platform', `${scenarionInfo.platName}/${scenarionInfo.scenarioName}`)
      this.$set(this.ruleForm, 'bufuId', scenarionInfo.bufuId)
      this.$set(this.ruleForm, 'scenarioId', scenarionInfo.scenarioId)
      this.$set(this.ruleForm, 'platId', scenarionInfo.platId)
    },
    // 新增同级回显
    addVisAVisInfo (node) {
      this.$set(this.ruleForm, 'parentId', node.parentId)
      this.$set(this.ruleForm, 'preId', node.processId)
      // this.ruleForm.parentId = node.parentId
      // this.ruleForm.preId = node.processId
    },
    // 新增下级回显
    addNextVisInfo (node) {
      this.ruleForm.parentId = node.processId
    },
    // 修改回显
    getEditInfo (processId, scenarionInfo) {
      this.loading = true
      this.isEdit = true
      processDetail(processId).then((data) => {
        this.loading = false
        data.data.bizOwnerSelect = `${data.data.bizOwnerList[0].nickName}/${data.data.bizOwnerList[0].userName}`
        data.data.techOwnerSelect = `${data.data.techOwnerList[0].nickName}/${data.data.techOwnerList[0].userName}`
        data.data.status = data.data.status.toString()
        if (data.data.fileList && data.data.fileList.length > 0) {
          data.data.fileArr = [{
            name: data.data.fileList[0].fileName,
            url: data.data.fileList[0].fileUrl
          }]
        } else {
          data.data.fileArr = []
        }
        this.ruleForm = data.data
        this.init(scenarionInfo)
      }, () => {
        this.loading = false
      })
    },
    // 删除上传文件
    removeFile () {
      debugger
      this.ruleForm.fileList = []
      this.ruleForm.fileArr = []
    },
    uploadFile (obj) {
      this.ruleForm.fileList = [{
        fileName: obj.fileName,
        filePath: obj.filePath,
        fileUrl: obj.fileUrl
      }]
      this.$set(this.ruleForm, 'fileArr', [{
        name: obj.fileName,
        url: obj.fileUrl
      }])
      // this.ruleForm.fileArr = [{
      //   name: obj.fileName,
      //   url: obj.fileUrl
      // }]
    }
  }, 
  
  mounted () {
  },
  
  created () {},
  watch: {
  }
}

</script>
<style lang='scss' scoped>
// ::v-deep .el-form-item.mast-fill {
//   position: relative;
//   .el-form-item__label {
//     padding-left: 10px !important;
//   }
//   .icon {
//     position: absolute;
//     top: -35px;
//     left: 0;
//     color: #F35050;
//   }
// }
</style>