<!--
 * @Author: Cable
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页——详情页热门赛事专用
-->
<template>
  <div
    data-template="match_list_zhuanye"
    class="yb-match-list hot-match-list  relative-position column"
    v-if="load_data_state == 'data'"
  >
    <div class="detais-hot-head">
      <img :src="compute_local_project_file_path('/image/svg/hot.svg')" />
      <div>{{ i18n_t('list.hot_match')}}</div>
    </div>
     <!-- 列表容器 -->
    <load-data :state="load_data_state">
        <match-list-card
          v-for="card_key in match_list_card_key_arr"
          :key="card_key"
          :card_key="card_key"
        />
    </load-data>

  </div>
</template>

<script>

import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import loadData from "src/base-pc/components/load-data/load-data.vue"
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

import { useMittEmit,MITT_TYPES, compute_local_project_file_path } from "src/output/index.js";
export default {
  name: "HotMatchList",
  components: {
    loadData,
    MatchListCard,
  },
  data() {
    return {
      compute_local_project_file_path,
      load_data_state:'data',
      match_list_card_key_arr:[]
    }
  },
  mounted () {
    //同步热门接口
    useMittEmit(MITT_TYPES.EMIT_HOT_COLLECT)
    this.MatchListCardDataClass_match_list_card_key_arr();
  },
  watch: {
    'MatchListCardDataClass.list_version'(newValue, oldValue) {
      this.MatchListCardDataClass_match_list_card_key_arr()
       this.$forceUpdate()
    }
  },
  methods: {
    MatchListCardDataClass_match_list_card_key_arr() {
      this.match_list_card_key_arr= MatchListCardDataClass.match_list_card_key_arr
    }
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