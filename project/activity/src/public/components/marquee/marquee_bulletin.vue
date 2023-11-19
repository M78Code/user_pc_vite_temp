<template>
  <div class="lucky-user"> 
    <ul class="user-list" ref="user_list" :style="`animation-duration: ${notice_animation_duration}s;`">    <!-- 内容区容器 -->
      <li v-html="bulletinInfo"></li>      <!-- 公告内容 -->
      <li v-html="bulletinInfo"></li>    <!-- 公告复制的内容 -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "marqueeBulletin",
  props: {
    // 公告内容
    bulletinInfo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      notice_animation_duration: 0,
    };
  },
  mounted() {
    this.get_marquee_data();
  },
  methods: {
    /**
     * @Description:获取公告栏数据
     * @return {undefined} undefined
     */
    get_marquee_data() {
      // 通过内容滚动宽度来计算对应的动画时间
      this.$nextTick(() => {
        this.notice_animation_duration = _.get(this.$refs, 'user_list.scrollWidth', 0) / 30 / 2
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.lucky-user {
  flex: 1;
  overflow: hidden; //超出内容隐藏
  position: absolute;
  z-index: 100;
  left: 0.32rem;
  width: 2.2rem;

  .user-list {
    width: fit-content;// Q1
    white-space: nowrap;// 内容不换行
    animation-name: seamless-scrolling;// Q3
    animation-timing-function: linear;// 动画速度曲线，匀速
    animation-iteration-count: infinite;// 动画循环无限次播放

    li {
      display: inline-block;
      margin-right: 0.3rem;
    }
  }
}


@include keyframes(seamless-scrolling) {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-50%);/* Q2 */
  }
}
</style>
