<!--
 * @Author: Supermark
 * @Date: 2020-12-23 20:19:33
 * @Description: 虚拟体育玩法投注项区域
-->
<template>
  <div class='category virtual-sport'>
    <odds_list_contrainer :match_detail="current_match || {}" :match_odds_info="current_match.odds_info" :loading="loading"/>
  </div>
</template>

<script>
import virtual_sports_category_mixin from "src/core/vr/mixin/pages/virtual/details/children/virtual-sports-category-mixin.js";
// 引入加载中的组件
import loading from 'src/components/loading/loading.vue';
import tournament_play_new from "src/base-h5/components/details/components/tournament-play/tournament-play-new-2.vue"
import odds_list_contrainer from "project_path/src/pages/detailnew/components/OddsListContrainer.vue";
export default {
  mixins:[virtual_sports_category_mixin],
  name:'virtual_sports_category',
  components: {
    'tournament-play-new': tournament_play_new,
    loading,
    odds_list_contrainer
  },
  data(){
    return {
      loading: false,
    }
  },
}
</script>
<style lang="scss" scoped>
.category {
  width: 100%;
  height: auto;
  max-width: 7rem;

  .scrollList {
    &::-webkit-scrollbar {
      display: none;
    }

    overflow-x: scroll;
    overflow-y: hidden;
  }
}

.no-data-style {
  position: absolute;
  left: 0;
  right: 0;
}

.max-width {
  max-width: 7rem;
}

.dom_play {
  width: 100%;
  height: 0.47rem;
  max-width: 7rem;
}

.empty-box {
  height: 0.18rem;
}
</style>
