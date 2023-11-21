<!-- 赛事搜素结果列表页 -->
<template>
  <!-- 列表容器 -->
  <load-data :state="'data'">
    <scroll-list>
      <template>
        <match-list-card v-for="card_key in match_list_card.match_list_card_key_arr" :key="card_key"
          :card_key="card_key" />
      </template>
    </scroll-list>
  </load-data>
</template>

<script>
// import ListFilter from 'src/base-pc/components/match-list/list-filter/index.vue'
import { onMounted, onUnmounted, ref, watch, getCurrentInstance, onActivated } from "vue";
import { useRoute } from 'vue-router';
import LoadData from 'src/components/load_data/load_data.vue';
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
import useMatchListMx from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { PageSourceData, compute_css_obj, LayOutMain_pc, UserCtr } from 'src/core/index.js';
import { MatchDataWarehouse_PC_List_Common as MatchListData, GlobalAccessConfig } from "src/core/index.js";
import { api_match } from "src/api/index.js";
import * as api_websocket from "src/api/module/socket/socket_api.js";
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'

import "../match-list/match_list.scss";

const { mounted_fn, handle_destroyed, load_data_state, collect_count, is_show_hot, mx_use_list_res } = useMatchListMx();
const { page_source } = PageSourceData;
const route = useRoute();
export default {
  components: {
    // ListFilter,
    LeagueTab,
    MatchesHeader,
    MatchListCard,
    PlayVirtualMatchType,
    LoadData,
    ScrollList,
    IconWapper,
    LoadData,
    ConmingSoon
  },
  setup() {

    onMounted(() => {
      fetch_search_match_list()
    })

    /**
      * 搜索相关列表数据
      * @return {undefined} undefined
      */
    function fetch_search_match_list(is_socket = false) {
      // 更新列表模板编号 和请求参数
      // $menu.set_match_list_api_params()
      let keyword = route.params.keyword || ''
      params = {
        device: "PC",
        cuid: UserCtr.get_uid(),
        keyword: keyword.replace(/_g_/g, "/"),
        searchSportType: route.query.csid,
      };
      api_match.post_search_match(params).then(({ data }) => {
        //保存数据到数据仓库
        mx_use_list_res(data, is_socket, true);
      });
    }
  },
};
</script>

<style></style>