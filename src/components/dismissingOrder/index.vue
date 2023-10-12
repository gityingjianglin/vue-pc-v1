<!-- 任务驳回 dismissingOrder -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      title="任务驳回"
      :visible.sync="dismissingOrderDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData" label-position="top">
              <el-form-item label="驳回原因" prop="rejectReason">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="formData.rejectReason"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
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
import { finishReject } from '@/api/task'
export default {
  name: '',
  data () {
    return {
      formData: {
        rejectReason: ''
      },
      rules: {
        rejectReason: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' }
        ]
      }
    };
  },
  props: ['dismissingOrderDrawer', 'taskId'],
  components: {
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      debugger
      this.$emit('finishRejectOpt', str)
    },
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            taskId: this.taskId,
            rejectReason: this.formData.rejectReason
          }
          // alert('submit!');
          finishReject(params).then((data) => {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.handleClose('edit')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
.edit-content-box {
  padding: 0 24px !important;
}
.el-radio {
  margin-top: 30px;
  display: block;
}
</style>