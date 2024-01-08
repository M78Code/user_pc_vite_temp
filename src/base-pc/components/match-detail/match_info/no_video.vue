<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 右侧视频播放组件
-->
<template>
  <div class="c-no-video yb-flex-center">
    <div class="no-video-inner">
      <div class="top-wrap">
        <div class="img img1"></div>
        <!-- 暂无直播视频，请耐心等待 -->
        <div class="text1">{{ i18n_t('video.novideo1')}}</div>
      </div>
      <div class="img-list">
        <div class="item">
          <div class="img img2"></div>
          <!-- 快速结算注单 -->
          <div class="text">{{ i18n_t('video.novideo2')}}</div>
        </div>
        <div class="item">
          <div class="img img3"></div>
          <!-- 支持多种语言&货币 -->
          <div class="text" v-html="i18n_t('video.novideo3')"></div>
        </div>
        <div class="item">
          <div class="img img4"></div>
          <!-- 极致用户体验 -->
          <div class="text">{{ i18n_t('video.novideo4')}}</div>
        </div>
        <div class="item">
          <div class="img img5"></div>
          <!-- 极致服务团队 -->
          <div class="text">{{ i18n_t('video.novideo5')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n_t} from "src/output/index.js"
export default {
  props:{
    show_type: String
  },
  data(){
    return{
      i18n_t
    }
  }
};
</script>

<style lang="scss" scoped>
.c-no-video {
  width: 100%;
  height: 100%;
  background-image: url($SCSSPROJECTPATH+"/image/png/novideobg.jpg");
  background-size: 100% 100%;
  text-align: center;
}
.no-video-inner {
  width: 100%;
  height: 95%;
  max-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .top-wrap {
    padding-top: 15px;
  }
  .text1 {
    font-size: 14px;
    color: var(--q-gb-t-c-18);
  }
  .img-list {
    display: flex;
    width: 95%;
    max-width: 500px;
    .item {
      flex: 1;
    }
    .img {
      width: 40px;
      height: 40px;
      margin: auto;
      margin-bottom: 5px;
    }
    .text {
      color: var(--q-gb-t-c-1);
      padding: 0 5px;
    }
  }
  .img {
    background-size: 100% 100%;
  }
  .img1 {
    width: 180px;
    height: 79px;
    margin: auto;
    margin-bottom: 6px;
    background-image: url($SCSSPROJECTPATH+"/image/png/novideo1.png");
  }
  .img2 {
    background-image: url($SCSSPROJECTPATH+"/image/png/novideo2.png");
  }
  .img3 {
    background-image: url($SCSSPROJECTPATH+"/image/png/novideo3.png");
  }
  .img4 {
    background-image: url($SCSSPROJECTPATH+"/image/png/novideo4.png");
  }
  .img5 {
    background-image: url($SCSSPROJECTPATH+"/image/png/novideo5.png");
  }
}
</style>