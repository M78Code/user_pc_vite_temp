<!--
 * @Author: Cable
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页——详情页热门赛事专用
-->
<template>
  <div
    data-template="match_list_zhuanye"
    class="yb-match-list hot-match-list  relative-position"
    v-if="load_data_state == 'data'"
  >
    <div class="detais-hot-head">
      <img src="/yazhou-pc/image/svg/hot.svg" />
      <div>{{ $t('list.hot_match')}}</div>
    </div>
     <!-- 列表容器 -->
    <load-data :state="load_data_state">
      <template >
        <match-list-card
          v-for="card_key in match_list_card.match_list_card_key_arr"
          :key="card_key+match_list_card.match_list_render_key"
          :card_key="card_key"
        />
      </template>
    </load-data>

  </div>
</template>

<script>
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import LoadData from "src/base-pc/components/load-data/load-data.vue"
// import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js"; //模板引入及主要业务逻辑
// import skt_data_list from "src/public/mixins/websocket/data/skt_data_list_new_data.js";// 发送websocket命令时使用
import { useMittEmit,MITT_TYPES } from "src/core";
export default {
  name: "HotMatchList",
  components:{MatchListCard,LoadData},
  // mixins: [match_list_version_mixin,skt_data_list],
  mounted() {
    //同步热门接口
    useMittEmit(MITT_TYPES.EMIT_HOT_COLLECT)
  },
};
</script>

<style lang="scss" scoped>
/*  -赛事列表头部——滚球——联赛信息 定位 */
.no-sticky {
  position: relative !important;
  top: 0 !important;
  z-index: 1 !important;
  /* 热门图标容器 */
}
.sticky-wrap{
  position: relative !important;
  top: unset !important;
}
.detais-hot-head {
  font-size: 14px;
  height: 34px;
  display: flex;
  align-items: center;
  font-weight: bold;
  /* 热门图标宽度 位置调整 */
  img {
    width: 14px;
    margin: 0 15px 0 11px;
  }
}
.yb-match-list:after {
  display: none;
}
.yb-match-list {
  margin-bottom: 5px;
}
</style>
