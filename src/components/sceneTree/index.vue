<!-- 场景树结构 -->
<template>
  <div class="scene-tree">
    <div class="total-note">
      <treeNode v-for="node in treeData" :key="node.id" :node="node" @checkScenario="checkScenario" @addVisAVisOpt="$emit('checkScenarioItem', $event)" @editScene="editSceneInfo" @deleteScene="deleteSceneInfo" @editSceneInfo="$emit('editSceneInfo', $event)" @deleteSceneInfo="$emit('deleteSceneInfo', $event)"/>
    </div>
  </div>
</template>

<script>
import treeNode from './treeNode';
export default {
  name: '',
  data () {
    return {
    };
  },
  
  components: {
    treeNode
  },
  props: ['treeData'],
  computed: {},
  
  methods: {
    checkScenario (node) {
      debugger
      this.$emit('checkScenarioItem', node)
    },
    editSceneInfo (node) {
      this.$emit('editSceneInfo', node)
    },
    deleteSceneInfo (node) {
      this.$emit('deleteSceneInfo', node)
    }
  },
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
</style>