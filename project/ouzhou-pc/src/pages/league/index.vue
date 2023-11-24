<template>
  <LeaguesHeader />
  <div class="yb-match-list full-height relative-position">
    <load-data :state="'data'" v-if="match_list_card_key_arr.length" :style="{ width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,}">
      <scroll-list>
        <div v-for="card_key in match_list_card_key_arr" :key="card_key" :card_key="card_key" :data-card-key="card_key"
          :class="`card_key_${card_key}`">
          <match-list-card :card_key="card_key" />
        </div>
      </scroll-list>
    </load-data>
    <ConmingSoon v-show="!match_list_card_key_arr.length" :style="{
      width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,
    }" />
  </div>
</template>

<script>
// import ListFilter from 'src/base-pc/components/match-list/list-filter/index.vue'
import { onMounted, ref, watch } from "vue";
import { useRoute } from 'vue-router';
import LoadData from 'src/components/load_data/load_data.vue';
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import useMatchListMx from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import LeaguesHeader from "src/base-pc/components/leagues-header/index.vue";
import { LayOutMain_pc, UserCtr } from 'src/core/index.js';
import { api_match } from "src/api/index.js";
import ConmingSoon from "src/base-pc/components/conming_soon/conming_soon.vue";

import "../match-list/match_list.scss";

const { mx_use_list_res } = useMatchListMx();
export default {
  components: {
    MatchListCard,
    LoadData,
    ScrollList,
    LoadData,
    LeaguesHeader,
    ConmingSoon
  },
  setup() {

    const match_list_card_key_arr = ref([])
    const route = useRoute();
    onMounted(() => {
      LayOutMain_pc.set_oz_show_right(false);
      LayOutMain_pc.set_oz_show_left(true);
    })

    watch(() => route.params, () => {
      fetch_league_match_list()
    }, { immediate: true, deep: true })

    function MatchListCardDataClass_match_list_card_key_arr() {
      match_list_card_key_arr.value = MatchListCardDataClass.match_list_card_key_arr
    }

    /**
      * 搜索相关列表数据
      * @return {undefined} undefined
      */
    function fetch_league_match_list(is_socket = false) {
      // 更新列表模板编号 和请求参数
      // $menu.set_match_list_api_params()
      let sportId = route.params.sportId || ''
      let params = {
        sportId,
        tid: route.params.tid,
      };
      api_match.get_leagues_list_match(params).then((res) => {
        //保存数据到数据仓库
        mx_use_list_res(res, is_socket, true);
        MatchListCardDataClass_match_list_card_key_arr()
      });
    }

    return {
      match_list_card_key_arr,
      MatchListCardDataClass,
      LayOutMain_pc
    }
  },
};
</script>

<style lang="scss">

.scroll {
  overflow-y: scroll;
  padding-right: 3px;

  /* 火狐滚动条无法自定义宽度，只能通过此属性使滚动条宽度变细 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--q-gb-bg-c-11);
    border-radius: 4px;
  }
}

.leagues-tabs {
  height: 40px;
  position: sticky;
  top: 133px;
  z-index: 200;
  font-size: 13px;
}
</style>