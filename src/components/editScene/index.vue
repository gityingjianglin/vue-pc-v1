<!-- 场景新增编辑 -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      :title="editSceneTitle"
      :visible.sync="editSceneDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-scene-drawer"
      :before-close="handleClose">
      <div class="content-box" v-loading="loading">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form ref="form" :model="formData" :rules="rules" label-position="top">
              <div class="h-view show-double justify-space-between">
                <el-form-item label="场景名称：" prop="scenarioName" :rules="getDynamicRules('', '场景名称')" class="mast-fill">
                  <div class="icon">*</div>
                  <el-input v-model="formData.scenarioName" placeholder="请输入场景名称" maxlength="60"></el-input>
                </el-form-item>
                <el-form-item label="所属平台：" prop="platform" :rules="getDynamicRules('', '所属平台')" class="mast-fill" v-if="!isEdit">
                  <div class="icon">*</div>
                  <el-cascader
                    clearable
                    v-model="formData.platform"
                    placeholder="请选择"
                    :options="options"
                    :props="{ expandTrigger: 'hover' }"
                    filterable></el-cascader>
                </el-form-item>
                <el-form-item label="所属平台：" class="mast-fill" v-if="isEdit">
                  <div class="icon">*</div>
                  <el-input v-if="isEdit" disabled v-model="formData.platName"></el-input>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <el-form-item label="业务主人：" prop="bizOwnerSelect" :rules="getDynamicRules('', '业务主人')" class="mast-fill">
                  <div class="icon">*</div>
                  <getOrgTree @getUserValue="(value) => {getUserValue(value, 'bizOwnerSelect')}" :owner="formData.bizOwnerSelect"></getOrgTree>
                </el-form-item>
                <el-form-item label="科技融入：" prop="techOwnerSelect" :rules="getDynamicRules('', '科技融入')" class="mast-fill">
                  <div class="icon">*</div>
                  <getOrgTree @getUserValue="(value) => {getUserValue(value, 'techOwnerSelect')}" :owner="formData.techOwnerSelect"></getOrgTree>
                </el-form-item>
              </div>
              <div class="title-box h-view align-center">
                <div class="title h-view align-center">
                  <!-- <span>*</span> -->
                  支撑系统名称：
                </div>
                <div class="title platform h-view align-center">
                  <!-- <span>*</span> -->
                  系统建设方式：
                </div>
                <!-- <div class="title h-view align-center">
                  <span>*</span> 业务主人
                </div>
                <div class="title h-view align-center">
                  <span>*</span> 科技融入
                </div> -->
                <!-- <div class="title h-view align-center">
                  <span>*</span> 是否数字化闭环
                </div> -->
                <div class="title edit h-view align-center">
                  操作
                </div>
              </div>
              <div class="h-view every-form-box" v-for="(item, index) in formData.sysList" :key="index">
                <!-- <el-form-item :prop="'sysList.' + index + '.sysName'" :rules="getDynamicRules(index, '支撑系统名称')"> -->
                <el-form-item>
                  <el-input v-model="item.sysName" placeholder="请输入场景名称" maxlength="60"></el-input>
                </el-form-item>
                <!-- <el-form-item class="platform" :prop="'sysList.' + index + '.sysConstruction'" :rules="getDynamicRules(index, '系统建设方式')"> -->
                <el-form-item class="platform">
                  <el-select v-model="item.sysConstruction" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in constructionList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="edit">
                  <p class="h-view align-center justify-center" @click="deleteItem(index)" v-show="formData.sysList.length > 1"><i class="el-icon-delete"></i></p>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="add-box">
            <el-button @click="addItem" icon="el-icon-plus" v-show="formData.sysList.length < 10">添加</el-button>
          </div>
        </el-scrollbar>
        <div class="bottom-edit-box h-view align-center justify-end">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="validateForm" type="primary">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import NameOrIdAuto from '@/components/NameOrIdAuto/index'
import getOrgTree from '@/components/getOrgTree/index'
import { scenarioTreeList, batchAdd, treeType, scenarioDetail, scenarioUpdate } from '@/api/editScene'
export default {
  name: '',
  data () {
    return {
      formData: {
        scenarioName: '', // 场景名称	
        scenarioId: '', // 场景id（新增时为空；修改时必填）	
        bufuId: '', // 产业/企业id
        platId: '', // 平台id
        platform: '', // 所属平台
        bizOwnerSelect: '', // 业务主人
        techOwnerSelect: '', // 科技融入
        bizOwnerList: [],
        techOwnerList: [],
        sysList: [
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          }
        ]
      },
      rules: {
        // 表单验证规则
        items: [
          { type: 'array', required: true, message: '请添加场景', trigger: 'blur' }
        ]
      },
      options: [],
      userList: [],
      loading: false,
      constructionList: [],
      isEdit: false,
      scenarioId: ''
    };
  },
  props: ['editSceneDrawer', 'state', 'editSceneTitle'],
  components: {
    NameOrIdAuto,
    getOrgTree
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      this.isEdit = false
      this.$emit('closeSceneDrawer', str)
      this.formData = {
        scenarioName: '', // 场景名称	
        scenarioId: '', // 场景id（新增时为空；修改时必填）	
        bufuId: '', // 产业/企业id
        platId: '', // 平台id
        platform: '', // 所属平台
        bizOwnerSelect: '', // 业务主人
        techOwnerSelect: '', // 科技融入
        bizOwnerList: [],
        techOwnerList: [],
        sysList: [
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          },
          {
            sysConstruction: '', // 系统建设方式名称
            sysName: '' // 支撑系统名称
          }
        ]
      }
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        // done();
      });
    },
    addItem() {
      // if (this.formData.sysList.length >= 10) {
      //   this.$message({
      //     message: '最大支持添加10条',
      //     type: 'warning'
      //   });
      //   return
      // }
      this.formData.sysList.push({
        sysConstruction: '', // 系统建设方式名称
        sysName: '' // 支撑系统名称
      })
    },
    getDynamicRules(index, field) {
      // 动态生成每个表单项的验证规则
      return [
        { validator: (rule, value, callback) => this.validateField(rule, value, callback, index, field), trigger: ['blur', 'change'] }
      ];
    },
    validateField(rule, value, callback, index, field) {
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
    validateForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formData.bizOwnerList[0] = {
            nickName: this.formData.bizOwnerSelect.split('/')[0],
            userName: this.formData.bizOwnerSelect.split('/')[1]
          }
          this.formData.techOwnerList[0] = {
            nickName: this.formData.techOwnerSelect.split('/')[0],
            userName: this.formData.techOwnerSelect.split('/')[1]
          }
          this.loading = true
          // 新增
          if (!this.isEdit) {
            this.formData.bufuId = this.formData.platform[0]
            this.formData.platId = this.formData.platform[1]
            console.log(this.formData)
            batchAdd(this.formData).then((data) => {
              this.loading = false
              this.scenarioId = data.data
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.handleClose({
                state: 'addBatch',
                scenarioId: this.scenarioId
              })
            }, () => {
              this.loading = false
            })
          } else {
            // 编辑
            scenarioUpdate(this.formData).then((data) => {
              this.loading = false
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.handleClose({
                state: 'addBatch',
                scenarioId: this.scenarioId
              })
            }, () => {
              this.loading = false
            })
          }
          
        } else {
          // 表单验证不通过，进行错误处理
          // ...
        }
      });
    },
    deleteItem (i) {
      debugger
      this.$confirm('确认删除该条数据？')
        .then(_ => {
          this.formData.sysList.splice(i, 1)
        })
        .catch(_ => {});
    },
    // 获取员工
    // getUser(query) {
    //   const params = {
    //     status: '0',
    //     pageSize: 10000,
    //     userType: '01',
    //     queryName: query
    //   }
    //   listQuery(params).then(data => {
    //     this.loadingBizOwner = false
    //     this.userList = data.rows
    //     this.userList.forEach((item) => {
    //       item.selectLable = item.nickName + '/' + item.userName
    //     })
    //   })
    // },
    // remoteMethod(query) {
    //   if (query !== '') {
    //     clearTimeout(this.timeout)
    //     this.loadingBizOwner = true;
    //     this.getUser(query)
    //   } else {
    //     this.userList = [];
    //   }
    // },
    init () {
      // 所属平台
      scenarioTreeList({myOwnerFlag: 1}).then((data) => {
        debugger
        this.options = data.data
        // 判断是否有添加场景权限
        this.$emit('platformList', data.data)
      })
      treeType('pmp_sys_construction').then((data) => {
        this.constructionList = data.data.pmp_sys_construction
      })
    },
    getUserValue (value, str) {
      this.$set(this.formData, str, value)
    },
    getDetailInfo (scenarioId) {
      this.loading = true
      this.isEdit = true
      this.scenarioId = scenarioId
      scenarioDetail(scenarioId).then((data) => {
        this.loading = false
        data.data.bizOwnerSelect = `${data.data.bizOwnerList[0].nickName}/${data.data.bizOwnerList[0].userName}`
        data.data.techOwnerSelect = `${data.data.techOwnerList[0].nickName}/${data.data.techOwnerList[0].userName}`
        this.formData = data.data
      }, () => {
        this.loading = false
      })
    }
  },
  
  mounted () {},
  
  created () {
    this.init()
    // this.formData.items = JSON.parse(JSON.stringify(this.list))
  },
}

</script>
<style lang='scss' scoped>
.content-box {
  .title-box {
    height: 44px;
    margin-top: 10px;
    // padding: 0 16px;
    color: #000000;
    font-size: 14px;
    border-bottom: 2px solid #264077;
    .title {
      width: 316px;
      margin-left: 8px;
      &.edit {
        width: 36px;
      }
      // &.platform {
      //   width: 140px;
      // }
    }
    span {
      color: #F35050;
    }
  }
  .scroll-container {
    height: calc(100vh - 120px);
  }
  .edit-content-box {
    padding: 0 24px;
    .every-form-box {
      padding: 8px 0;
      border-bottom: 1px solid #D7DFE9;
      ::v-deep .el-form-item {
        margin: 0 0 0 8px;
        width: 316px;
        // .el-autocomplete {
        //   width: 160px !important;
        // }
        // &.platform {
        //   width: 140px;
        // }
        &.edit {
          width: 36px;
          p {
            width: 36px;
            height: 32px;
            cursor: pointer;
          }
          [class*=" el-icon-"], [class^=el-icon-] {
            font-size: 16px;
          }
        }
        .el-form-item__content, .el-cascader {
          line-height: 32px;
        }
        .el-form-item__error {
          position: relative;
          padding-top: 2px;
        }
        .el-radio {
          margin-right: 16px;
          .el-radio__label {
            padding-left: 4px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
    ::v-deep .el-input {
      height: 32px;
      width: 300px;
      .el-input__inner {
        height: 32px;
      }
    }
  }
  .add-box {
    margin-top: 16px;
    padding: 0 16px 16px 16px;
    .el-button {
      width: 100%;
      height: 32px;
      padding: 0;
      border: 1px dashed #D7DFE9;
      border-radius: 2px;
    }
  }
  .bottom-edit-box {
    height: 64px;
    padding-right: 24px;
    .el-button {
      width: 57px;
      height: 32px;
      padding: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .el-button--primary {
      color: #FFF;
      background-color: #0073E5;
      border-color: #0073E5;
    }
  }
}
</style>