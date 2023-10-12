<!--  -->
<template>
  <div class="node-box">
    <div class="every-node-info-box" @click.stop="isShowChild(node)">
      <div class="platform-box h-view align-center justify-space-between" v-if="node.label" :class="{'no-child': !(node.children && node.children.length > 0)}">
        <div class="left h-view align-center">
          <div class="show-or-hidden h-view align-center justify-center" :class="{'gray-box': !(node.children && node.children.length > 0)}">
            <i class="el-icon-minus" v-show="node.isShow"></i>
            <i class="el-icon-plus" v-show="!node.isShow"></i>
          </div>
          <div class="name">{{ node.label }}</div>
        </div>
        <div class="right">共{{ node.scenarioNum }}个场景</div>
      </div>
      <div class="vocational-work-box" v-else :class="{'checked-flag': node.checkedFlag === 1}" @click.stop="chooseScenarioId">
        <div class="manage-name">{{ node.scenarioName }}</div>
        <div class="info-box h-view align-center">
          <div class="every-info flex1 h-view align-center">
            <div class="title">业务主人：</div>
            <!-- <div class="name h-view align-center justify-center">{{ node.tibao }}</div> -->
            <div v-if="node.bizOwnerList && node.bizOwnerList[0]">
              <comName :info="node.bizOwnerList[0]" type="biz-owner"></comName>
            </div>
          </div>
          <div class="every-info flex1 h-view align-center">
            <div class="title">科技融入：</div>
            <!-- <div class="name h-view align-center justify-center">{{ node.keji }}</div> -->
            <div v-if="node.techOwnerList && node.techOwnerList[0]">
              <comName :info="node.techOwnerList[0]" type="tech-owner"></comName>
            </div>
          </div>
        </div>
        <div class="info-box bottom-info">
          <div class="every-info h-view align-center">
            <div class="title">场景数字化覆盖度：</div>
            <div class="num">{{ node.digitalCoverage }}{{ node.digitalCoverage !== '-' ? '%' : '' }}</div>
          </div>
          <div class="h-view align-center justify-space-between">
            <div class="every-info h-view align-center">
              <div class="title">流程占比：</div>
              <div class="num">{{ node.processProportion }}{{ node.processProportion !== '-' ? '%' : '' }}</div>
            </div>
            <div v-show="node.addScenarioFlag">
              <el-popover
                placement="top-end"
                width="400"
                popper-class="manipulate-box"
                trigger="hover">
                <div class="manipulate">
                  <div class="every-box h-view align-center" @click.stop="editScene">
                    <i class="el-icon-edit"></i>
                    <p>编辑</p>
                  </div>
                  <div class="every-box h-view align-center" @click.stop="deleteScene">
                    <i class="el-icon-delete"></i>
                    <p>删除</p>
                  </div>
                </div>
                <el-button slot="reference" @click.stop="">
                  <!-- <i class="el-icon-more"></i> -->
                  <img src="~@/assets/img/icon/icon_more.png" alt="">
                </el-button>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 递归调用自身，处理子节点 -->
    <div v-if="node.isShow" class="children">
      <TreeNode v-for="child in node.children" :key="child.id" :node="child" class="children-box" @checkScenario="$emit('checkScenario', $event)" @editScene="$emit('editScene', $event)" @deleteScene="$emit('deleteScene', $event)"/>
    </div>
  </div>
</template>

<script>
import comName from '@/components/comName/index'
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
    isShowChild (item) {
      debugger
      if (item.children && item.children.length > 0) {
        this.node.isShow = !this.node.isShow;
      }
    },
    chooseScenarioId () {
      debugger
      this.$emit('checkScenario', this.node)
    },
    editScene () {
      this.$emit('editScene', this.node)
    },
    deleteScene () {
      this.$emit('deleteScene', this.node)
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
.node-box {
  &.children-box {
    .platform-box {
      margin-left: 16px;
    }
  }
  .platform-box {
    height: 40px;
    cursor: pointer;
    &.no-child {
      cursor: default;
    }
    .left {
      .show-or-hidden {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        background: #0073E5;
        border-radius: 2px;
        [class*=" el-icon-"], [class^=el-icon-] {
          font-size: 10px;
          color: #fff;
        }
        &.gray-box {
          background-color: #D7DFE9;
        }
      }
      .name {
        font-size: 14px;
        font-weight: bold;
        color: #000000d9;
      }
    }
    .right {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .vocational-work-box {
    margin: 8px 0 0 24px;
    padding: 8px;
    background: #F6F9FD;
    border-radius: 6px;
    border: 1px solid #F6F9FD;
    cursor: pointer;
    &.checked-flag {
      border: 1px solid #0073E5;
    }
    .manage-name {
      height: 24px;
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
    .info-box {
      // &:first-child {
      //   margin-bottom: 5px;
      // }
      .every-info {
        &:last-child {
          padding-left: 10px;
        }
      }
      .title {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
      .name  {
        width: 28px;
        height: 28px;
        background: #0073E5;
        font-size: 12px;
        color: #FFFFFF;
        border-radius: 50%;
      }
      .num {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.85);
      }
      &.bottom-info {
        margin-top: 5px;
        .every-info {
          &:first-child {
            margin-bottom: 5px;
          }
          &:last-child {
            padding-left: 0;
          }
      }
      }
    }
  }
}
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
</style>