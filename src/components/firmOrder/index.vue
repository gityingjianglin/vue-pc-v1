<!-- 确认订单 firmOrder -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      title="确认订单"
      :visible.sync="firmOrderDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData" label-position="top">
              <el-form-item label="选择抢单人" prop="grabId">
                <el-radio-group v-model="formData.grabId">
                  <el-radio :label="item.grabId" v-for="(item, index) in list" :key="index">{{ item.grabUser ? item.grabUser.userName : '' }} {{ item.grabUser ? item.grabUser.nickName : '' }}</el-radio>
                </el-radio-group>
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
import { taskGrabConfirm } from '@/api/task'
export default {
  name: '',
  data () {
    return {
      formData: {
        grabId: ''
      },
      rules: {
        grabId: [
          { required: true, message: '请选择抢单人', trigger: 'change' }
        ]
      }
    };
  },
  props: ['firmOrderDrawer', 'list', 'taskId'],
  components: {
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      debugger
      this.$emit('closeFirmOrderDrawer', str)
    },
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            taskId: this.taskId,
            grabId: this.formData.grabId
          }
          // alert('submit!');
          taskGrabConfirm(params).then((data) => {
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