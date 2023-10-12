<!-- 关系图 -->
<template>
  <div class="relation-schema" v-show="isChooseSecen">
    <scrollx :scrollX="true" class="title-scroll" ref="titleScroll" :listenScroll='true' :probeType='3' @scroll='scrollTitle'>
      <div :style="noteContentStyle">
        <div class="bg-box h-view">
          <div class="every-bg-content flex-shrink h-view align-center justify-space-between" v-for="(item, index) in maxDepth" :key="index">
            <div class="title h-view align-center">流程L{{ index + 1 }}</div>
            <img src="~@/assets/img/icon/icon_add.png" alt="" v-if="index === 0 && canAddLevelOneSecen" @click="addLevel(treeData[index])">
          </div>
        </div>
      </div>
    </scrollx>
    <scrollx class='scroll-relation' :scrollX="true" ref='scrollWrap' :showScrollBar="true" :listenScroll='true' :probeType='3' @scroll='scroll'>
      <div class="note-content-box" :style="noteContentStyle">
        <div class="bg-box h-view">
          <div class="every-bg-content" v-for="(item, index) in maxDepth" :key="index">
            <!-- <div class="title h-view align-center">流程L{{ index + 1 }}</div> -->
            <div class="no-data v-view align-center" v-show="index === 0 && !treeData[index] && hasGetDate">
              <img src="~@/assets/img/icon/icon_no_data.png" alt="">
              <p>当前场景无任何流程</p>
              <div @click="addLevel(treeData[index])" v-show="canAddLevelOneSecen">立即新增流程</div>
            </div>
          </div>
        </div>
        <div class="total-note">
          <treeNode v-for="node in treeData" :key="node.id" :node="node" @getShowLayer="getDepth" @addLevel="$emit('addLevel', $event)" @addVisAVis="addVisAVis" @editVis="editVis" @deleteVis="deleteVis" @addNextVis="addNextVis" @addVisAVisOpt="$emit('addVisAVisOpt', $event)" @addNextVisOpt="$emit('addNextVisOpt', $event)" @editVisOpt="$emit('editVisOpt', $event)" @deleteVisOpt="$emit('deleteVisOpt', $event)"/>
        </div>
      </div>
    </scrollx>
    <!-- <div @click="addNote">新增</div>
    <div @click="openOrHide(treeData, true)">展开</div>
    <div @click="openOrHide(treeData, false)">收起</div> -->
  </div>
</template>

<script>
import treeNode from './treeNode'
import scrollx from '@/base/scroll/scrollx'
export default {
  name: '',
  data () {
    return {
      maxDepth: 0,
      noteContentStyle: {}
    };
  },

  components: {
    treeNode,
    scrollx
  },

  computed: {},
  props: ['treeData', 'hasGetDate', 'isChooseSecen', 'canAddLevelOneSecen'],
  methods: {
    getHtml (arr) {

    },
    addNote () {
      let arr = [
        {
          name: '第一层',
          isShow: true,
          children: [
            {
              name: '第二层',
              isShow: false,
              children: [
                {
                  name: '第三层',
                  children: []
                },
                {
                  name: '第三层1',
                  isShow: false,
                  hasNextLevel: true,
                  children: [
                    {
                      name: '第四层',
                      children: []
                    },
                    {
                      name: '第四层1',
                      children: []
                    }
                  ]
                },
                {
                  name: '第三层2',
                  isShow: false,
                  hasNextLevel: true,
                  children: [
                    {
                      name: '第四层2',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
      this.getLastState(arr, this.treeData)
      this.treeData = arr
    },
    openOrHide(arr, bool) {
      function changeState(data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children && data[i].children.length > 0) {
            data[i].isShow = bool
            changeState(data[i].children);
          }
        }
      }
      changeState(arr);
    },
    getLastState(arr, treeData) {
      function changeState(data, tree) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children && data[i].children.length > 0) {
            if ((tree[i].children && tree[i].children.length === 0) || !tree[i].children) {
              data[i].isShow = true
            } else {
              data[i].isShow = tree[i].isShow
            }
            changeState(data[i].children, tree[i].children);
          }
        }
      }
      changeState(arr, treeData);
    },
    initEvent (scroll) {
      setTimeout(() => {
        if (this.$refs.scrollWrap && this.$refs.scrollWrap.refresh) {
          this.$refs.scrollWrap.refresh()
        }
      }, 100)
    },
    getShowLayer(arr) {
      let maxDepth = 0;
      function traverse(arr, depth) {
        for (const obj of arr) {
          if (obj.isShow) {
            if (Array.isArray(obj.children) && obj.children.length > 0) {
              maxDepth = Math.max(maxDepth, depth + 1);
              traverse(obj.children, depth + 1);
            }
          }
        }
      }
      traverse(arr, 0);
      this.maxDepth = maxDepth + 1
      console.log(this.maxDepth)
      let width = 292 * this.maxDepth + (48 * maxDepth) + 20
      this.$set(this.noteContentStyle, 'width', width + 'px')
    },
    getDepth () {
      if (this.treeData && this.treeData.length > 0) {
        this.getShowLayer(this.treeData)
        this.initEvent()
      } else {
        this.maxDepth = 1
        let width = document.querySelector('.relation-schema').clientWidth
        this.$set(this.noteContentStyle, 'width', width + 'px')
      }
    },
    scroll (obj) {
      this.$refs.titleScroll.scrollTo(obj.x, 0, 0)
    },
    scrollTitle (obj) {
      this.$refs.scrollWrap.scrollTo(obj.x, 0, 0)
    },
    addLevel (node) {
      this.$emit('addLevel', node)
    },
    addVisAVis (node) {
      debugger
      console.log('addVisAVis')
      this.$emit('addVisAVisOpt', node)
    },
    addNextVis (node) {
      debugger
      this.$emit('addNextVisOpt', node)
    },
    editVis (node) {
      debugger
      this.$emit('editVisOpt', node)
    },
    deleteVis (node) {
      debugger
      this.$emit('deleteVisOpt', node)
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.getDepth()
    })
  },

  created () {
  },
  watch: {
    treeData: {
      deep: true,
      handler(newVal, oldVal) {
        // 数据发生变化时的处理逻辑
        this.$nextTick(() => {
          debugger
          this.getDepth()
        })
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.relation-schema {
  position: relative;
  overflow: hidden;
  .title-scroll {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 2;
    height: 40px;
    background-color: #fff;
    cursor: pointer;
    .bg-box {
      height: 40px;
      // position: absolute;
      // top: 0;
      // left: 0;
    }
    .every-bg-content {
      width: 292px;
      height: 100%;
      margin-right: 48px;
      padding: 0 16px;
      background-color: #F6F9FD;
      border-radius: 4px 4px 0 0;
      .title {
        height: 40px;
        font-size: 14px;
        color: #000000;
      }
      img {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
  }
  
  .scroll-relation {
    position: absolute;
    top: 40px;
    right: 0;
    left: 0;
    bottom: 0;
    cursor: pointer;
  }
  .note-content-box {
    padding: 8px 16px 24px 16px;
    // position: relative;
    width: auto;
    .bg-box {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      .every-bg-content {
        width: 292px;
        // height: 100%;
        min-height: calc(100vh - 120px);
        margin-right: 48px;
        background-color: #F6F9FD;
        border-radius: 0 0 4px 4px;
        .title {
          height: 40px;
          padding-left: 14px;
          font-size: 14px;
          color: #000000;
        }
        .no-data {
          padding-top: 36px;
          img {
            width: 156px;
            height: 120px;
          }
          p {
            line-height: 22px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
          }
          div {
            margin-top: 8px;
            line-height: 22px;
            font-size: 14px;
            color: #0073E5;
            cursor: pointer;
          }
        }
      }
    }
    .top-title {
      div {
        width: 292px;
        margin-right: 48px;
      }
    }
    .total-note {
      // position: relative;
    }
  }
}
</style>