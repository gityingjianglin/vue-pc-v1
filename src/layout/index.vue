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
import TagsView from './components/TagsView'
import comHeader from '@/components/comHeader'
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