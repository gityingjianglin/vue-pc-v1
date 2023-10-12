<!-- 评价反馈 evaluativeFeedback -->
<template>
  <div class="edit-scene-box">
    <el-drawer
      title="评价/反馈"
      :visible.sync="evaluativeFeedbackDrawer"
      direction="rtl"
      :wrapperClosable="false"
      custom-class="edit-flow-path-drawer"
      :before-close="handleClose">
      <div class="content-box">
        <el-scrollbar class="scroll-container">
          <div class="edit-content-box">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData" label-position="top">
              <div class="h-view show-double justify-space-between">
                <el-form-item label="实际完成时间：">
                  <el-input v-model="formData.actualFinish" placeholder="" disabled></el-input>
                </el-form-item>
                <el-form-item label="实际费用：" class="cost-box">
                  <el-input v-model="formData.actualCost" placeholder="" disabled></el-input>
                  <div class="unit">元</div>
                </el-form-item>
              </div>
              <div class="h-view show-double justify-space-between">
                <div class="predict-content-box h-view justify-space-between">
                  <el-form-item label="实际人/天：" class="predict-box cost-box">
                    <el-input v-model.number="formData.actualPeople" placeholder="" disabled></el-input>
                    <div class="unit">人</div>
                  </el-form-item>
                  <el-form-item label="实际人/天：" class="predict-box day cost-box">
                    <el-input v-model.number="formData.actualDays" placeholder="" disabled></el-input>
                    <div class="unit">天</div>
                  </el-form-item>
                </div>
              </div>
              <el-form-item :label="evaluate[0].evaluateType" prop="satisfy" v-if="evaluate[0]">
                <el-radio-group v-model="formData.satisfy">
                  <el-radio v-for="(item, index) in evaluate[0].content" :key="index" :label="item.evaluateType + ':' + item.evaluateScore + ':' + item.evaluateDesc">{{ item.evaluateScore }}分:{{ item.evaluateDesc }}</el-radio>
                  <!-- <el-radio label="效果意度:4:问题基本解决，用户对结果比较满意">4分:问题基本解决，用户对结果比较满意</el-radio>
                  <el-radio label="效果意度:3:问题部分解决，用户对结果尚可接受">3分:问题部分解决，用户对结果尚可接受</el-radio>
                  <el-radio label="效果意度:2:问题解决不彻底，用户对结果不太满意">2分:问题解决不彻底，用户对结果不太满意。</el-radio>
                  <el-radio label="效果意度:1:问题未解决，用户对结果非常不满意">1分:问题未解决，用户对结果非常不满意。</el-radio> -->
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="evaluate[1].evaluateType" prop="speed" v-if="evaluate[1]">
                <el-radio-group v-model="formData.speed">
                  <el-radio v-for="(item, index) in evaluate[1].content" :key="index" :label="item.evaluateType + ':' + item.evaluateScore + ':' + item.evaluateDesc">{{ item.evaluateScore }}分:{{ item.evaluateDesc }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="evaluate[2].evaluateType" prop="process" v-if="evaluate[2]">
                <el-radio-group v-model="formData.process">
                  <el-radio v-for="(item, index) in evaluate[2].content" :key="index" :label="item.evaluateType + ':' + item.evaluateScore + ':' + item.evaluateDesc">{{ item.evaluateScore }}分:{{ item.evaluateDesc }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="evaluate[3].evaluateType" prop="level" v-if="evaluate[3]">
                <el-radio-group v-model="formData.level">
                  <el-radio v-for="(item, index) in evaluate[3].content" :key="index" :label="item.evaluateType + ':' + item.evaluateScore + ':' + item.evaluateDesc">{{ item.evaluateScore }}分:{{ item.evaluateDesc }}</el-radio>
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
import NameOrIdAuto from '@/components/NameOrIdAuto/index'
import { taskEvaluateInfo, evaluateAdd } from '@/api/task'
export default {
  name: '',
  data () {
    return {
      formData: {
        actualFinishTime: '',
        actualFinish: '',
        actualCost: '',
        actualDays: '',
        actualPeople: '',
        level: '',
        process: '',
        speed: '',
        satisfy: ''
      },
      closeDate: '',
      fileList: [],
      rules: {
        satisfy: [
          { required: true, message: '请选择效果意度', trigger: 'change' }
        ],
        speed: [
          { required: true, message: '请选择服务响应速度', trigger: 'change' }
        ],
        process: [
          { required: true, message: '请选择问题解决过程', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择专业水平', trigger: 'change' }
        ]
      },
      evaluate: []
    };
  },
  props: ['evaluativeFeedbackDrawer', 'taskId'],
  components: {
    NameOrIdAuto
  },
  
  computed: {},
  
  methods: {
    handleClose (str) {
      debugger
      this.$emit('closeEvaluativeFeedbackDrawer', str)
    },
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          let satisfyChoose = this.formData.satisfy.split(':')
          let speedChoose = this.formData.speed.split(':')
          let processChoose = this.formData.process.split(':')
          let levelChoose = this.formData.level.split(':')
          let arr = [satisfyChoose, speedChoose, processChoose, levelChoose]
          let dtoList = []
          arr.forEach((item) => {
            dtoList.push({
              evaluateDesc: item[2],
              evaluateScore: +item[1],
              evaluateType: item[0]
            })
          })
          console.log(dtoList)
          evaluateAdd(this.taskId, dtoList).then(() => {
            this.handleClose('add')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    init (taskId) {
      debugger
      taskEvaluateInfo(taskId).then((data) => {
        this.formData = data.data
        this.formData.actualFinish = this.$options.filters.getTime(data.data.actualFinishTime, 'yyyy/mm/dd');
        this.evaluate = data.data.evaluate
        // this.evaluate = [
        //   {
        //     "evaluateType": "1.效果意度",
        //     "content": [
        //       {
        //         "evaluateType": "1.效果意度",
        //         "evaluateDesc": "问题完全解决，用户对结果非常满意。",
        //         "evaluateScore": 5
        //       },
        //       {
        //         "evaluateType": "1.效果意度",
        //         "evaluateDesc": "问题基本解决，用户对结果比较满意",
        //         "evaluateScore": 4
        //       },
        //       {
        //         "evaluateType": "1.效果意度",
        //         "evaluateDesc": "问题部分解决，用户对结果尚可接受",
        //         "evaluateScore": 3
        //       },
        //       {
        //         "evaluateType": "1.效果意度",
        //         "evaluateDesc": "问题解决不彻底，用户对结果不太满意。",
        //         "evaluateScore": 2
        //       },
        //       {
        //         "evaluateType": "1.效果意度",
        //         "evaluateDesc": "问题未解决，用户对结果非常不满意。",
        //         "evaluateScore": 1
        //       }
        //     ]
        //   },
        //   {
        //     "evaluateType": "2.服务响应速度",
        //     "content": [
        //       {
        //         "evaluateType": "2.服务响应速度",
        //         "evaluateDesc": "快速响应并解决问题，用户感到非常满意。",
        //         "evaluateScore": 5
        //       },
        //       {
        //         "evaluateType": "2.服务响应速度",
        //         "evaluateDesc": "相对较快地响应并解决问题，用户感到满意",
        //         "evaluateScore": 4
        //       },
        //       {
        //         "evaluateType": "2.服务响应速度",
        //         "evaluateDesc": "响应时间略长，但仍能解决问题，用户尚可接受",
        //         "evaluateScore": 3
        //       },
        //       {
        //         "evaluateType": "2.服务响应速度",
        //         "evaluateDesc": "响应时间过长，导致用户对服务不太满意",
        //         "evaluateScore": 2
        //       },
        //       {
        //         "evaluateType": "2.服务响应速度",
        //         "evaluateDesc": "无响应或响应时间极长，用户对服务非常不满意。",
        //         "evaluateScore": 1
        //       }
        //     ]
        //   },
        //   {
        //     "evaluateType": "3.问题解决过程",
        //     "content": [
        //       {
        //         "evaluateType": "3.问题解决过程",
        //         "evaluateDesc": "解决过程清晰明了，用户容易理解并参与其中",
        //         "evaluateScore": 5
        //       },
        //       {
        //         "evaluateType": "3.问题解决过程",
        //         "evaluateDesc": "解决过程较为顺利，用户能够较好参与其中。",
        //         "evaluateScore": 4
        //       },
        //       {
        //         "evaluateType": "3.问题解决过程",
        //         "evaluateDesc": "解决过程存在一些困难，用户需要付出较多努力。",
        //         "evaluateScore": 3
        //       },
        //       {
        //         "evaluateType": "3.问题解决过程",
        //         "evaluateDesc": "解决过程复杂且不够清晰，用户感到困惑和不满意。",
        //         "evaluateScore": 2
        //       },
        //       {
        //         "evaluateType": "3.问题解决过程",
        //         "evaluateDesc": "解决过程混乱或无明显的解决方案，用户非常不满意。",
        //         "evaluateScore": 1
        //       }
        //     ]
        //   },
        //   {
        //     "evaluateType": "4.专业水平",
        //     "content": [
        //       {
        //         "evaluateType": "4.专业水平",
        //         "evaluateDesc": "提供专业、准确的信息或建议，用户感到非常满意。",
        //         "evaluateScore": 5
        //       },
        //       {
        //         "evaluateType": "4.专业水平",
        //         "evaluateDesc": "提供基本准确的信息或建议，用户感到满意。",
        //         "evaluateScore": 4
        //       },
        //       {
        //         "evaluateType": "4.专业水平",
        //         "evaluateDesc": "提供一定程度上准确的信息或建议，用户尚可接受。",
        //         "evaluateScore": 3
        //       },
        //       {
        //         "evaluateType": "4.专业水平",
        //         "evaluateDesc": "提供不够准确或有误导性的信息或建议，用户不太满意",
        //         "evaluateScore": 2
        //       },
        //       {
        //         "evaluateType": "4.专业水平",
        //         "evaluateDesc": "提供错误或明显误导性的信息或建议，用户非常不满意。",
        //         "evaluateScore": 1
        //       }
        //     ]
        //   }
        // ]
      })
      // this.formData = obj
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
.el-radio {
  margin: 10px;
  display: block;
}
</style>