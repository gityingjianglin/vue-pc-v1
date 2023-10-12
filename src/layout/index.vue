<!--  -->
<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
name: '',
data () {
  return {
  };
},

components: {
},

computed: {},

methods: {},

mounted () {},

created () {},
}

</script>
<style lang='scss' scoped>
</style>