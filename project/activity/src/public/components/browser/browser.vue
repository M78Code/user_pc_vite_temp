<!--
 * @Author: Cable
 * @Date: 2020-12-15 17:13:55
 * @Description: 浏览器兼容页面
-->
<template>
  <div class="browser">
    <div class="content">
      <div class="logo">
        <div class="img custom-format-img-logo-04"></div>
      </div>
      <!-- 抱歉，您的浏览器版本过低，暂时无法访问本站点 -->
      <div class="text1">{{$root.$t('browser.text1')}}</div>
      <!-- 为了给你带来更好的投注体验，我们强烈建议您升级到以下浏览器后进行下注 -->
      <div class="text2">- {{$root.$t('browser.text2')}} -</div>
      <div class="imgs">
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser1.png">
          <div class="text">Safari</div>
        </div>
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser2.png">
          <!-- 谷歌 -->
          <div class="text">{{$root.$t('browser.browser1')}}</div>
        </div>
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser3.png">
          <!-- 火狐 -->
          <div class="text">{{$root.$t('browser.browser2')}}</div>
        </div>
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser4.png">
          <div class="text">QQ</div>
        </div>
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser5.png">
          <!-- 搜狗 -->
          <div class="text">{{$root.$t('browser.browser3')}}</div>
        </div>
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser6.png">
          <!-- 360安全 -->
          <div class="text">{{$root.$t('browser.browser4')}}</div>
        </div>
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser7.png">
          <!-- 360极速 -->
          <div class="text">{{$root.$t('browser.browser5')}}</div>
        </div>
        <div class="img-wrap">
          <img src="~public/image/yabo/png/browser8.png">
          <div class="text">Edge</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <!-- 体育用户体验中心 -->
      <!-- <div class="text1">@{{com_name.name}}{{$root.$t('browser.text3')}}</div>
      <div class="text2">{{com_name.nameEn}} Sports User Experience Center</div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      com_name: window.env.config.html_info
    };
  }
};
</script>
<style lang="scss" scoped>
.browser {
  height: 100vh;
  text-align: center;
  color: #99a3b1;
  background-image: url("~public/image/yabo/png/background.png");
  background-size: cover;
  overflow: hidden;
  background-color: rgb(20, 23, 29);
}
.logo .img {
  margin: auto;
  margin-top: 200px;
  width: 200px;
  height: 53.33px;
  background-size: 100%;
  background-repeat: no-repeat;
}
.content .text1 {
  margin-top: 80px;
  font-size: 18px;
}
.content .text2 {
  margin-top: 20px;
  font-size: 14px;
  color: #5a6074;
}
.img-wrap {
  margin-top: 41px;
  display: inline-block;
  width: 86px;
}
.img-wrap img {
  display: block;
  margin: auto;
  width: 43px;
  margin-bottom: 12px;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
  color: #5a6074;
}
.footer .text1 {
  margin-bottom: 10px;
}
</style>
