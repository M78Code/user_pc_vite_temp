<!--
 * @Author: Yellow
 * @Date: 2020-11-15 21:26:55
 * @Description: 公告栏跑马灯
-->
<template>
  <div class="lucky-user" @click.stop="to_notice">   <!-- 容器 -->
    <!--<ul class="user-list" ref="user_list" :style="`animation-duration: ${luckyUsers.length * 0.25}s;`">    &lt;!&ndash; 内容区容器 &ndash;&gt;-->
    <ul class="user-list" ref="user_list" :style="`animation-duration: ${notice_animation_duration}s;`">    <!-- 内容区容器 -->
      <li v-html="luckyUsers"></li>      <!-- 公告内容 -->
      <li v-html="luckyUsers"></li>    <!-- 公告复制的内容 -->
    </ul>
  </div>
</template>

<script>
import { api_home } from "src/project/api/index";
export default {
  name: "marquee",
  mounted() {
    this.get_marquee_data();
  },
  data() {
    return {
      parameters: null, // 传参到公告携带的参数
      luckyUsers : '', // 公告内容
      notice_animation_duration: 0,
    };
  },
  methods: {
    // 跳转到公告页面
    to_notice() {
      if (!this.parameters) return;
      this.$router.push({
        name: "notice",
        query: { noticeTypeName: this.parameters },
      });
    },
    /**
     * @Description:获取公告栏数据
     * @return {undefined} undefined
     */
    get_marquee_data() {
      api_home.post_marquee_data().then((res) => {
        let { code, data } = res || {};
        if (code == 200 && data && data[0]) {
          this.parameters = data[0].noticeTypeName;
          data.forEach((item) => {
            // 单行显示 需去掉 换行标签
            if(item.context){
              this.luckyUsers += item.context.replace(/<br\/>/g, '')
            }
          });
          
          // 通过内容滚动宽度来计算对应的动画时间
          this.$nextTick(() => {
            this.notice_animation_duration = _.get(this.$refs, 'user_list.scrollWidth', 0) / 30 / 2
          })
        }
      });
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
  left: 0.35rem;
  // width: 80%;
  // margin-right: 0.3rem;
  right: 0.25rem;

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
