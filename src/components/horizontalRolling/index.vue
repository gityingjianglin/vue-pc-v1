<!-- 横向滚动 -->
<template>
  <div class="home-swiper-box">
    <swiper class="swiper" :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="(item, index) in srcs" :key="index">
        <div class="aaa">{{ item }}</div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      swiperOption: {
        slidesPerView: "auto",
        freeMode: true,
        mousewheel: true,
        pagination: {
          el: ".swiper-pagination",
          type: "progressbar",
        }
      }
    };
  },

  components: {},

  computed: {},

  methods: {},

  mounted () {},

  created () {},
}

</script>
<style lang='scss' scoped>
.home-swiper-box {
  // height: 30px;
  // padding-bottom: 10px;
  .swiper-slide {
    width: 300px;
    height: 50px;
    cursor: pointer;
  }
  .swiper-pagination-progressbar {
    width: 100%;
    height: 4px;
    left: 0;
    bottom: 0;
  }
}
</style>