<!-- 无数据状态 noDataState -->
<template>
  <div class="no-data v-view align-center justify-center">
    <img src="~@/assets/img/icon/icon_no_data.png" alt="">
    <div class="info">{{ info }}</div>
    <div class="goto" v-show="gotoInfo">{{ gotoInfo }}</div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
    };
  },
  props: ['info', 'gotoInfo'],
  components: {},
  
  computed: {},
  
  methods: {},
  
  mounted () {},
  
  created () {},
}

</script>
<style lang='scss' scoped>
.no-data {
  height: 100%;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}
img {
  width: 156px;
  height: 120px;
}
.info, .goto {
  line-height: 22px;
}
.goto {
  margin-top: 8px;
  color: #0073E5;
  cursor: pointer;
}
</style>