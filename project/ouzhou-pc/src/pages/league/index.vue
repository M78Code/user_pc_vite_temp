<template>
  <LeaguesHeader />
  <div class="yb-match-list full-height relative-position">
    <load-data :state="load_data_state"
      :style="{ width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`, }">
      <scroll-list>
        <div v-for="card_key in match_list_card_key_arr" :key="card_key" :card_key="card_key" :data-card-key="card_key"
          :class="`card_key_${card_key}`">
          <match-list-card :card_key="card_key" />
        </div>
      </scroll-list>
    </load-data>
  </div>
</template>

<script>
// import ListFilter from 'src/base-pc/components/match-list/list-filter/index.vue'
import { onMounted, ref, watch,onUnmounted } from "vue";
import { useRoute } from 'vue-router';
import LoadData from 'src/components/load_data/load_data.vue';
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import { mx_use_list_res } from 'src/core/match-list-pc/composables/match-list-processing.js'
import MatchLeagueData from 'src/core/match-list-pc/match-league-data.js'
import {
  mounted_fn,
  load_data_state,
  handle_destroyed,set_load_data_state 
} from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import LeaguesHeader from "src/base-pc/components/leagues-header/index.vue";
import { LayOutMain_pc, useMittOn,MITT_TYPES } from 'src/output/index.js';
import { api_match_list } from "src/api/index.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import "../match-list/match_list.scss";
export default {
  components: {
    MatchListCard,
    LoadData,
    ScrollList,
    LoadData,
    LeaguesHeader,
  },
  setup() {
    const match_list_card_key_arr = ref([])
    const route = useRoute();

    onMounted(() => {
      LayOutMain_pc.set_oz_show_right(false);
      LayOutMain_pc.set_oz_show_left(true);
      MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15, 'px'), false)
    })
   const off= useMittOn(MITT_TYPES.EMIT_LANG_CHANGE,fetch_league_match_list).off
    watch(() => route.params, () => {
      fetch_league_match_list()
    }, { immediate: true, deep: true })

    mounted_fn()
    
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
        selectionHour: route.params.type == 1 ? localStorage.getItem('league_hours') : 12
      };
      set_load_data_state("loading")
      api_match_list.get_leagues_list_match(params).then((res) => {
        set_load_data_state(lodash.get(res, 'data.data.length', 0) ? "data" : "empty")
        //保存数据到数据仓库
        mx_use_list_res(res);
        MatchListCardDataClass_match_list_card_key_arr()
      }).catch(e => {
        set_load_data_state('refresh')
      });
    }
    onUnmounted(() => {
      handle_destroyed()
      off()
    })
    return {
      match_list_card_key_arr,
      MatchListCardDataClass,
      LayOutMain_pc, load_data_state
    }
  },
};
</script>

<style lang="scss" scoped>
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
.yb-match-list {
  padding-bottom: 100px;
}

.leagues-tabs {
  height: 40px;
  position: sticky;
  top: 133px;
  z-index: 200;
  font-size: 13px;
}
</style>