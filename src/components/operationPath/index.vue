<!-- 添加/编辑路径 operationPath -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      title="解决路径"
      :visible.sync="operationPathDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData" label-position="top">
              <div v-for="(item, index) in formData.items" :key="index" class="every-item-info">
                <div class="top-info h-view justify-space-between" @click="showOrHidden(index)">
                  <div class="left h-view">
                    <div class="show-hidden" :class="{'is-hidden': !item.isShow}">
                      <i class="el-icon-arrow-up"></i>
                    </div>
                    <div class="path-title-box">
                      <div class="title">{{ item.stepName ? item.stepName : '路径阶段名称' }}</div>
                      <div class="desc over-dot">{{ item.stepDesc }}</div>
                    </div>
                  </div>
                  <div class="right h-view align-center">
                    <div class="flex1">
                      <div class="name">目标开始/完成时间</div>
                      <div class="time" v-if="item.expectedStartTime">
                        {{ item.expectedStartTime|getTime('yyyy/mm/dd') }}/{{ item.expectedFinishTime|getTime('yyyy/mm/dd') }}
                      </div>
                    </div>
                    <div class="delete spread-click" @click.stop="deleteItem(index)" v-show="formData.items.length > 1">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </div>
                <div class="detail-box" v-show="item.isShow">
                  <el-form-item label="路径阶段名称：" :prop="'items.' + index + '.stepName'" :rules="getDynamicRules(index, '路径阶段名称')" class="mast-fill">
                    <div class="icon">*</div>
                    <el-input v-model="item.stepName" maxlength="60"></el-input>
                  </el-form-item>
                  <el-form-item label="描述：">
                    <el-input
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="item.stepDesc"
                      maxlength="200"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                  <div class="h-view show-double justify-space-between">
                    <el-form-item label="目标开始/完成时间：" :prop="'items.' + index + '.targetTime'" :rules="getDynamicRules(index, '目标开始/完成时间')" class="mast-fill">
                      <div class="icon">*</div>
                      <el-date-picker
                        v-model="item.targetTime"
                        type="daterange"
                        :clearable="false"
                        @change="(arr) => {getTargetTime(arr, index)}"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="实际完成时间：">
                      <el-date-picker
                        v-model="item.actualFinish"
                        type="date"
                        @change="(time) => {getActualTime(time, index)}"
                        :clearable="false"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                  <div class="h-view show-double justify-space-between">
                    <el-form-item label="里程碑：" :prop="'items.' + index + '.milestoneFlag'" class="mast-fill">
                      <div class="icon">*</div>
                      <el-radio-group v-model="item.milestoneFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                  <el-form-item label="协同人：" v-if="operationPathDrawer">
                    <multipleSelect @getUserValue="(arr) => {getUserValue(arr, index, 'partnerSelect')}" :owner="item.partnerSelect"></multipleSelect>
                  </el-form-item>
                  <el-form-item label="负责人：" v-if="operationPathDrawer">
                    <multipleSelect @getUserValue="(arr) => {getUserValue(arr, index, 'ownerSelect')}" :owner="item.ownerSelect"></multipleSelect>
                  </el-form-item>
                  <el-form-item label="附件：" class="upload-box">
                    <uploadFile @uploadFile="(obj) => {uploadFile(obj, index)}" @removeFile="() => {removeFile(index)}" :fileList="item.fileArr"></uploadFile>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="add-box">
            <el-button @click="addItem" icon="el-icon-plus" v-show="formData.items.length < 10">添加</el-button>
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
import multipleSelect from '@/components/getOrgTree/multipleSelect'
import NameOrIdAuto from '@/components/NameOrIdAuto/index'
import uploadFile from '@/components/uploadFile/index'
import { taskSolutionStep } from '@/api/task'
export default {
  name: '',
  data () {
    return {
      formData: {
        items: [
          {
            actualFinishTime: '', // 	实际完成时间（时间戳）
            actualFinish: '',
            expectedFinishTime: '', // 	预计完成时间（时间戳）
            expectedStartTime: '', // 	预计开始时间（时间戳）
            fileList: [],
            stepDesc: '', // 	阶段描述
            stepName: '', // 	阶段名称
            targetTime: '',
            fileArr: [],
            isShow: true,
            ownerList: [],
            partnerList: [],
            ownerSelect: [],
            partnerSelect: []
          }
        ]
      },
      closeDate: '',
      rules: {
      },
      fileList: []
    };
  },
  props: ['operationPathDrawer', 'operationPathTitle', 'list', 'taskId'],
  components: {
    NameOrIdAuto,
    uploadFile,
    multipleSelect
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      debugger
      // this.formData = {
      //   items: [
      //     {
      //       actualFinishTime: '', // 	实际完成时间（时间戳）
      //       actualFinish: '',
      //       expectedFinishTime: '', // 	预计完成时间（时间戳）
      //       expectedStartTime: '', // 	预计开始时间（时间戳）
      //       fileList: [],
      //       stepDesc: '', // 	阶段描述
      //       stepName: '', // 	阶段名称
      //       targetTime: '',
      //       fileArr: [],
      //       isShow: true,
      //       ownerList: [],
      //       partnerList: [],
      //       ownerSelect: [],
      //       partnerSelect: []
      //     }
      //   ]
      // }
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
        // done();
      });
      this.$emit('closeOperationPathDrawer', str)
    },
    getDynamicRules(index, field) {
      // 动态生成每个表单项的验证规则
      return [
        { validator: (rule, value, callback) => this.validateField(rule, value, callback, index, field), trigger: ['blur', 'change'] }
      ];
    },
    validateField(rule, value, callback, index, field) {
      // 自定义验证函数，验证每个表单项的字段
      if (!value) {
        callback(new Error(`${field}不能为空`));
      } else {
        // 其他自定义验证逻辑
        callback();
        // ...
        // if (field === '目标开始/完成时间') {
        //   if (value.length === 0) {
        //     callback(new Error(`${field}不能为空`));
        //   } else {
        //     callback();
        //   }
        // } else {
        //   callback();
        // }
      }
    },
    validateForm (formName) {
      debugger
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.formData.items.forEach((item) => {
            let arr = []
            let list = []
            if (item.ownerSelect && item.ownerSelect.length > 0) {
              item.ownerSelect.forEach((item) => {
                arr.push({
                  nickName: item.split('/')[0],
                  userName: item.split('/')[1]
                })
              })
              item.ownerList = arr
            } else {
              item.ownerList = []
            }
            if (item.partnerSelect && item.partnerSelect.length > 0) {
              item.partnerSelect.forEach((item) => {
                list.push({
                  nickName: item.split('/')[0],
                  userName: item.split('/')[1]
                })
              })
              item.partnerList = list
            } else {
              item.partnerList = []
            }
          })
          console.log(this.formData.items)
          taskSolutionStep(this.taskId, this.formData.items).then(() => {
            this.handleClose('edit')
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
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    uploadFile (obj, index) {
      this.formData.items[index].fileList = [ // 附件列表
        {
          fileName: obj.fileName,
          filePath: obj.filePath,
          fileUrl: obj.fileUrl
        }
      ]
      this.$set(this.formData.items[index], 'fileArr', [{
        name: obj.fileName,
        url: obj.fileUrl
      }])
      // this.formData.items[index].fileArr = [{
      //   name: obj.fileName,
      //   url: obj.fileUrl
      // }]
    },
    // 删除上传文件
    removeFile (index) {
      debugger
      this.formData.items[index].fileList = []
      this.formData.items[index].fileArr = []
    },
    addItem () {
      this.formData.items.push(
        {
          actualFinishTime: '',
          actualFinish: '',
          expectedFinishTime: '',
          expectedStartTime: '',
          fileList: [],
          stepDesc: '',
          stepName: '',
          targetTime: '',
          isShow: true,
          ownerList: [],
          partnerList: [],
          ownerSelect: [],
          partnerSelect: []
        }
      );
    },
    init (list) {
      debugger
      let arr
      if (list.length > 0) {
        debugger
        arr = JSON.parse(JSON.stringify(list))
        arr.forEach((item) => {
          item.targetTime = [new Date(item.expectedStartTime), new Date(item.expectedFinishTime)]
          item.actualFinish = item.actualFinishTime ? new Date(item.actualFinishTime) : ''
          if (item.fileList && item.fileList.length > 0) {
            item.fileArr = [
              {
                name: item.fileList[0].fileName,
                url: item.fileList[0].fileUrl
              }
            ]
          }
          item.milestoneFlag = item.milestoneFlag.toString()
          debugger
          if (item.partnerList && item.partnerList.length > 0) {
            let arr = []
            item.partnerList.forEach((item) => {
              arr.push(`${item.nickName}/${item.userName}`)
            })
            item.partnerSelect = arr
          } else {
            item.partnerSelect = []
          }
          if (item.ownerList && item.ownerList.length > 0) {
            let list = []
            item.ownerList.forEach((item) => {
              list.push(`${item.nickName}/${item.userName}`)
            })
            item.ownerSelect = list
          } else {
            item.ownerSelect = []
          }
          item.isShow = false
        })
        arr.push(
          {
            actualFinishTime: '',
            actualFinish: '',
            expectedFinishTime: '',
            expectedStartTime: '',
            fileList: [],
            stepDesc: '',
            stepName: '',
            targetTime: '',
            isShow: true,
            ownerList: [],
            partnerList: [],
            ownerSelect: [],
            partnerSelect: []
          }
        )
        // this.formData.items = list
        this.$set(this.formData, 'items', arr)
      } else {
        debugger
        this.$set(this.formData, 'items', [
          {
            actualFinishTime: '', // 	实际完成时间（时间戳）
            actualFinish: '',
            expectedFinishTime: '', // 	预计完成时间（时间戳）
            expectedStartTime: '', // 	预计开始时间（时间戳）
            fileList: [],
            stepDesc: '', // 	阶段描述
            stepName: '', // 	阶段名称
            targetTime: '',
            fileArr: [],
            isShow: true,
            ownerList: [],
            partnerList: [],
            ownerSelect: [],
            partnerSelect: []
          }
        ])
      }
    },
    // 转换目标时间格式
    getTargetTime (arr, index) {
      this.formData.items[index].expectedStartTime = arr[0].getTime()
      this.formData.items[index].expectedFinishTime = arr[1].getTime()
    },
    getActualTime (time, index) {
      this.formData.items[index].actualFinishTime = time.getTime()
    },
    showOrHidden (index) {
      debugger
      // this.formData.items[index].isShow = !this.formData.items[index].isShow
      let isShow = this.formData.items[index].isShow
      this.$set(this.formData.items[index], 'isShow', !isShow)
    },
    deleteItem (index) {
      this.$confirm('确认删除该条数据？')
        .then(_ => {
          this.formData.items.splice(index, 1)
        })
        .catch(_ => {});
    },
    getUserValue (val, index, str) {
      // relatedUserList
      this.$set(this.formData.items[index], str, val)
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
.every-item-info {
  .top-info {
    height: 72px;
    padding: 10px 8px;
    cursor: pointer;
    [class*=" el-icon-"], [class^=el-icon-] {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.45);
    }
    .left {
      [class*=" el-icon-"], [class^=el-icon-] {
        margin-top: 3px;
        transition: all 0.2s;
      }
      .show-hidden {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
      .is-hidden {
        [class*=" el-icon-"], [class^=el-icon-] {
          transform: rotate(180deg);
        }
      }
      .path-title-box {
        .title {
          height: 22px;
          line-height: 22px;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: bold;
          color: rgba(0, 0, 0, 0.85);
        }
        .desc {
          line-height: 22px;
          width: 382px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
    .right {
      width: 235px;
      line-height: 22px;
      font-size: 14px;
      .name {
        margin-bottom: 8px;
        color: rgba(0, 0, 0, 0.45);
      }
      .time {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
.detail-box {
  padding: 1px 16px 16px 16px;
  // margin: 16px;
  background: #F6F9FD;
}
::v-deep .el-form-item {
  .el-input__prefix {
    left: auto;
    right: 5px;
  }
  .el-input__inner {
    padding-left: 12px;
  }
}
.show-double {
  ::v-deep .el-form-item {
    width: 318px !important;
    .el-input {
      width: 318px !important;
    }
  }
}
.add-box {
  margin-top: 16px;
  padding: 0 16px;
  .el-button {
    width: 100%;
    height: 32px;
    padding: 0;
    border: 1px dashed #D7DFE9;
    border-radius: 2px;
  }
}
</style>