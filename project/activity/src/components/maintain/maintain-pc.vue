<!--
 * @Date: 2021-10-26 11:58:44
 * @FilePath: /user-pc/project/activity/src/pages/yazhou-pc/activity_aegis.vue
 * @Description: 活动维护页面
 * @Author: Echo
-->

<template>
  <q-scroll-area class="activity_aegis_scroll">
    <load-data :state="allPageState">
      <div class="activity_aegis">
        <div class="banner">
          <img :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/activity_aegis_banner.png`" alt="">
        </div>
        <div class="text text-center">
          <h3>{{ title }}</h3>
          <div class="content">{{ content }}</div>
        </div>
      </div>
    </load-data>
  </q-scroll-area>
</template>
<script>
import { mapGetters } from "vuex";
import utils from 'project/activity/src/utils/utils.js'
//头部引入  
import { useMittOn, useMittEmit, useMittEmitterGenerator, MITT_TYPES } from "src/core/index.js";
export default {
  data() {
    return {
      imgUrl: '', // 人物图片链接
      title: '', // 公告标题
      content: '', // 公告内容
      allPageState: "loading", // 覆盖整个页面的 laoding 状态
    }
  },
  computed: {
    ...mapGetters({
      vx_get_user: "get_user"
    })
  },
  created() {
    useMittEmit("upd_user_data");
    let _url = _.get(this.vx_get_user, 'maintainingPCUrl');
    _url = window.vue.get_file_path(_url);
    this.imgUrl = _url;
    this.title = _.get(this.vx_get_user, 'maintainingTitle');
    let _content = _.get(this.vx_get_user, 'maintainingContent');
    this.content = _content.replace(/\//g, '\n');
  },
  watch: {
    vx_get_user: {
      handler(e) {
        this.allPageState = "data";
        document.querySelector('.activity_aegis_scroll').style.backgroundImg =
          require('/activity/yazhou-pc/activity_imgs/imgs/activity_aegis_bg.jpg');
        // 如果活动处于维护状态，就切换到维护页面
        if (e.maintaining == false) {
          utils.redirect_router('/activity');
          return;
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.activity_aegis_scroll {
  min-width: 1200px;
  height: 100vh;
  background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/activity_aegis_bg.jpg");
  background-color: #dbdce1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
  color: #5e637e;

  .relative-position {
    .full-width {
      .load-data-wrap {
        :deep(.loading-wrap) {
          margin-top: 400px;
        }
      }
    }
  }

  :deep(.q-scrollarea__thumb) {
    right: 3.5px;
    background: #d1d5d8;
    border-radius: 4px;
    opacity: 1;
  }
}

.activity_aegis {
  height: 100vh;
  min-width: 800px;
  min-height: 700px;

  .banner {
    height: 55vh;
    min-height: 450px;
    max-height: 565px;
    margin-top: 2%;

    img {
      display: block;
      margin: 0 auto;
      height: 100%;
      max-height: 565px;
    }
  }

  .text {
    color: #424d68;

    h3 {
      font-weight: 600;
      margin: 30px 0 20px;
    }

    .content {
      margin: 0 auto;
      font-size: 15px;
      max-width: 800px;
      white-space: pre-line;
      line-height: 30px;
    }
  }
}</style>
