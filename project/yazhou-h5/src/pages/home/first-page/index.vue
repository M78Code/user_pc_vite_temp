<!--
 * @Author:
 * @Date:
 * @Description: 包网3首页下边（轮播 + 跑马灯 + 赛事框）
-->
<template>
  <div class="home-wrap">
    <carousel />
    <!-- 跑马灯、余额 -->
    <div class="wrap-notice">
      <div class="money-wrap" @click="get_balance">
        <div class="balance-wrap">
          <i class="icon-balance" :style="compute_css('icon-balance')"></i>
          <span class="balance">{{ t("common.money") }}</span>
        </div>
        <div class="money">
          <span class="int">{{ balance_obj.int || "0" }}</span>
          <span class="dec">{{ balance_obj.dec || ".00" }}</span>
        </div>
      </div>

      <div class="wrap-marquee">
        <div class="marquee-left-wrap">
          <div class="marquee-icon">
            <i class="icon-notice" :style="compute_css('icon-notice')"></i>
          </div>
        </div>
        <marquee></marquee>
      </div>
    </div>
    <!-- 跑马灯、余额 -->
    <home_menu />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onUnmounted, reactive } from "vue";
import home_menu from "./components/menu.vue";
import carousel from "./components/carousel.vue";
// TODO:后续修改调整
// import { mapGetters, mapActions, mapMutations } from "vuex";
// bw3版首页websocket逻辑处理
// import skt_home_bw3 from "project_path/src/mixins/websocket/data/skt_home_bw3.js";
// 公告栏跑马灯
import marquee from 'project_path/src/components/marquee/marquee.vue'
// 无网络展示组件
// import no_data from "project_path/src/components/common/no-data.vue";
// 赛事进行中每秒变化的计时器
// import counting_down from 'project_path/src/components/common/counting-down.vue';
// 一小时以内的开赛计时器（累加计时|倒计时）
// import counting_down_start from 'project_path/src/components/common/counting-down-start.vue';
// 为赛事列表(专业版和新手版)提供逻辑方法，拆分组件复杂度
// import match_list_mixin from "project_path/src/mixins/match_list/match_list_mixin";
import { compute_css } from "src/core/";
//  一二级菜单 本地化假数据
// import { common_menu_list, secondary_menu } from "project_path/src/config/common-menu.js"
//  api1.5 菜单 本地化假数据

import { t } from "src/boot/i18n.js";
import store from "src/store-redux/index.js";
// mixins: [skt_home_bw3, match_list_mixin],
//余额
let balance_obj = ref({});
// 定时器
let home_timer1_ = ref(null);
// 请求国际化
const get_lang_v3 = () => {
  // base_data.get_load_lang_v3(get_lang.value)
};
onUnmounted(() => {
  // useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on).off;
  if (home_timer1_) {
    clearTimeout(home_timer1_);
    home_timer1_ = null;
  }
});
//首页加载时初始化数据
// set_bet_obj({});
// set_bet_list([]);
// set_show_favorite_list(false);
get_lang_v3();
</script>
<style lang="scss">
@import "project_path/src/css/pages/first_page.scss";
@import "./index.scss";
</style>
