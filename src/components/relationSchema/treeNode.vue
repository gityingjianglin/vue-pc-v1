<!--  -->
<template>
  <div class="level h-view">
    <div class="vis-a-vis-line" v-show="node.hasBackFlag">
      <i class="el-icon-bottom"></i>
    </div>
    <div class="every-info-box flex-shrink" @click="isShowChild(node)" :class="{'has-children': node.children && node.children.length > 0}">
      <div class="top-info-box h-view align-center justify-space-between">
        <div class="left-box h-view align-center flex1">
          <div class="state h-view align-center" :class="{'close': node.status === 1}">{{ node.status === 1 ? '已' : '未' }}</div>
          <div class="name flex1" :title="node.processName">{{ node.processName }}</div>
        </div>
        <div class="right-box" v-show="node.children && node.children.length > 0">
          <img src="~@/assets/img/icon/icon_top.png" alt="" :class="{ 'is-show': node.isShow }">
        </div>
      </div>
      <div class="middle-info-box">
        <div class="info-box h-view align-center">
          <div class="every-info flex1 h-view align-center">
            <div class="title">业务主人：</div>
            <comName :info="item" type="biz-owner" v-for="(item, index) in node.bizOwnerList" :key="index"></comName>
          </div>
          <div class="every-info flex1 h-view align-center">
            <div class="title">科技融入：</div>
            <comName :info="item" type="tech-owner" v-for="(item, index) in node.techOwnerList" :key="index"></comName>
          </div>
        </div>
        <div class="info-box h-view align-center">
          <div class="every-info flex1 h-view align-center">
            <div class="title">未闭环任务：</div>
            <div class="num" :class="{'warn': node.unclosedLoopTaskCount > 0}">{{ node.unclosedLoopTaskCount }}</div>
          </div>
          <div class="every-info flex1 h-view align-center">
            <div class="title">逾期任务：</div>
            <div class="num" :class="{'warn': node.lateTaskCount > 0}">{{ node.lateTaskCount }}</div>
          </div>
        </div>
      </div>
      <div class="bottom-edit-box h-view align-center justify-space-between">
        <div>
          <div class="spread-click" @click.stop="addVisAVis" v-show="node.addProcessFlag">
            <!-- <i class="el-icon-plus"></i> -->
            <img src="~@/assets/img/icon/icon_add_small.png" alt="">
          </div>
        </div>
        <div v-show="node.addProcessFlag || (node.fileList && node.fileList.length > 0)">
          <el-popover
            placement="top-end"
            width="400"
            popper-class="manipulate-box"
            trigger="hover">
            <div class="manipulate">
              <div class="every-box h-view align-center" @click.stop="addNextVis" v-show="node.addProcessFlag">
                <i class="el-icon-plus"></i>
                <p>新增</p>
              </div>
              <div class="every-box h-view align-center" @click.stop="editVis" v-show="node.addProcessFlag">
                <i class="el-icon-edit"></i>
                <p>编辑</p>
              </div>
              <div class="every-box h-view align-center" @click.stop="deleteVis" v-show="node.addProcessFlag">
                <i class="el-icon-delete"></i>
                <p>删除</p>
              </div>
              <div class="every-box h-view align-center" @click.stop="seeFile" v-show="node.fileList && node.fileList.length > 0">
                <!-- <i class="el-icon-delete"></i> -->
                <img src="~@/assets/img/icon/icon_file.png" alt="" class="file">
                <img src="~@/assets/img/icon/icon_file_blue.png" alt="" class="blue-file">
                <p>附件</p>
              </div>
            </div>
            <el-button slot="reference" @click.stop="">
              <!-- <i class="el-icon-more"></i> -->
              <img src="~@/assets/img/icon/icon_more.png" alt="">
            </el-button>
          </el-popover>
        </div>
      </div>
      <!-- <div class="delete" @click="deleteNode(node)">删除</div> -->
      <div class="line" v-if="node.children && node.children.length > 0 && node.isShow">
        <i class="el-icon-right"></i>
      </div>
    </div>
    <!-- 递归调用自身，处理子节点 -->
    <div v-if="node.isShow" class="children">
      <TreeNode v-for="child in node.children" :key="child.id" :node="child" class="children-box" @addVisAVis="$emit('addVisAVis', $event)" @addNextVis="$emit('addNextVis', $event)" @editVis="$emit('editVis', $event)" @deleteVis="$emit('deleteVis', $event)"/>
    </div>
  </div>
</template>

<script>
import comName from '@/components/comName/index'
import { dToken } from '@/api/login'
export default {
  name: 'TreeNode',
  data () {
    return {
    };
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  components: {
    comName
  },

  computed: {},

  methods: {
    isShowChild(item) {
      debugger
      if (item.children && item.children.length > 0) {
        this.node.isShow = !this.node.isShow;
      }
      this.$emit('getShowLayer')
    },
    deleteNode (node) {},
    addVisAVis () {
      debugger
      this.$emit('addVisAVis', this.node)
    },
    addNextVis () {
      debugger
      this.$emit('addNextVis', this.node)
    },
    editVis () {
      debugger
      this.$emit('editVis', this.node)
    },
    deleteVis () {
      debugger
      this.$emit('deleteVis', this.node)
    },
    seeFile () {
      dToken().then((data) => {
        let dToken = data.data.dToken
        window.open(`${this.node.fileList[0].fileUrl}?dToken=${dToken}`)
      })
    }
  },

  mounted () {},

  created () {},
}

</script>
<style lang='scss' scoped>
.level {
  position: relative;
  .every-info-box {
    width: 260px;
    height: 140px;
    margin: 0 80px 16px 0;
    // border: 1px solid #0073E5;
    border-radius: 6px;
    background-color: #fff;
    .top-info-box {
      height: 40px;
      padding-right: 16px;
      .left-box {
        padding-right: 10px;
      }
      .state {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        padding: 0 8px 0 4px;
        background: #FF0000;
        border-radius: 0 100px 100px 0;
        font-size: 12px;
        color: #FFFFFF;
        &.close {
          background: #52C41A;
        }
      }
      .name {
        width: 186px;
        font-size: 16px;
        font-weight: bold;
        color: #000000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .right-box {
        img {
          width: 16px;
          height: 16px;
          transform: rotateZ(180deg);
          transition: all 0.2s;
          &.is-show {
            transform: rotateZ(0);
          }
        }
      }
    }
    .middle-info-box {
      padding: 0 16px;
      .info-box {
        height: 32px;
        &:last-child {
          margin-top: 4px;
        }
        .every-info {
          &:last-child {
            margin-left: 28px;
          }
          .title {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.65);
          }
          .name {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            font-size: 12px;
            color: #FFFFFF;
            background: #0073E5;
          }
          .num {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
            &.warn {
              color: #F35050;
            }
          }
        }
      }
    }
    .bottom-edit-box {
      padding: 0 16px;
      height: 30px;
      // .el-icon-plus:before {
      //   font-weight: bold;
      //   font-size: 14px;
      //   color: #6F82A4;
      // }
      img {
        width: 16px;
        height: 16px;
      }
      .el-popover__reference {
        padding: 0;
        border: none;
        .el-icon-more:before {
          font-size: 16px;
          color: #6F82A4;
        }
      }
    }
  }
  .has-children {
    position: relative;
  }
  .line {
    position: absolute;
    right: -48px;
    top: 50%;
    transform: translateY(-50%);
    .el-icon-right:before {
      font-size: 16px;
      font-weight: bolder;
      color: #BFBFBF;
    }
  }
}
.upright-line {
  height: calc(100% - 158px);
  position: absolute;
  top: 74px;
  left: 275px;
  border-right: 1px solid #333;
}
.vis-a-vis-line {
  // height: calc(100% - 110px);
  position: absolute;
  top: 140px;
  bottom: 0;
  left: 112px;
  border-right: 2px solid #BFBFBF;
  .el-icon-bottom {
    position: absolute;
    bottom: 0;
    left: -7px;
  }
  .el-icon-bottom:before {
    font-size: 16px;
    font-weight: bolder;
    color: #BFBFBF;
  }
}
.children {
  .children-box:first-child {
    &::before {
      display: none;
    }
  }
  .children-box:before {
    // content: '';
    // position: absolute;
    // width: 10px;
    // height: 0px;
    // border-top: 1px solid #333;
    // left: -15px;
    // top: 74px;
  }
}
</style>