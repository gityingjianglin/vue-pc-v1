<template>
  <div class="legend-wrap h-view justify-center flex-wrap">
    <div class="legend-item h-view align-center">
      <div class="icon"></div>
      <span>流程数</span>
    </div>
    <div class="legend-item h-view align-center">
      <div class="icon c-01"></div>
      <span>数字化覆盖度=100%</span>
    </div>
    <div class="legend-item h-view align-center">
      <div class="icon c-02"></div>
      <span>数字化覆盖度＜100%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComLegend',
  data () {
    return {
    };
  },
  props: {
  },

  components: {},

  computed: {},

  methods: {},

  mounted () {},

  created () {},
}

</script>
<style lang='scss' scoped>
  .legend-wrap {
    position: relative;
    margin: auto;
  }
  .legend-item {
    margin-right: 13px;
    .icon {
      width: 8px;
      height: 8px;
      margin-right: 7px;
      background: #184EAD;
      border-radius: 2px;
    }
    .c-01 {
      background: #52C41A;
    }
    .c-02 {
      background: #F35050;
    }
    span {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
      letter-spacing: 0;
      text-align: left;
      line-height: 20px;
    }
  }
</style>