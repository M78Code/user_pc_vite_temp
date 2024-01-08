<!-- 赛事搜素结果列表页 -->
<template>
  <!-- 列表容器 -->
  <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
  <div class="yb-match-list full-height relative-position">
    <load-data :state="'data'" :style="{ width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,}">
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
import { onMounted, ref, watch,nextTick } from "vue";
import { useRoute } from 'vue-router';
import LoadData from 'src/components/load_data/load_data.vue';
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import {mx_use_list_res} from "src/core/match-list-pc/composables/match-list-processing.js";

import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { LayOutMain_pc, UserCtr, PageSourceData } from 'src/output/index.js';
import { api_match } from "src/api/index.js";
import "../match-list/match_list.scss";
export default {
  components: {
    // ListFilter,
    MatchListCard,
    LoadData,
    ScrollList,
    LoadData,
  },
  setup() {

    const match_list_card_key_arr = ref([])
    const route = useRoute();
    onMounted(() => {
      MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15, 'px'), false)
    })

    watch(() => route.params, () => {
      nextTick(()=>{
        fetch_search_match_list()
      })
    }, { immediate: true, deep: true })

    function MatchListCardDataClass_match_list_card_key_arr() {
      match_list_card_key_arr.value = MatchListCardDataClass.match_list_card_key_arr
    }

    /**
      * 搜索相关列表数据
      * @return {undefined} undefined
      */
    function fetch_search_match_list(is_socket = false) {
      // 更新列表模板编号 和请求参数
      // $menu.set_match_list_api_params()
      let keyword = route.params.keyword || ''
      let params = {
        device: "PC",
        cuid: UserCtr.get_uid(),
        keyword: keyword.replace(/_g_/g, "/"),
        searchSportType: route.params.csid,
      };
      api_match.post_search_match(params).then((res) => {
        PageSourceData.set_route_name(route.name)
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