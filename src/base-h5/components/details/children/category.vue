<template>
  <div class="category relative-position" ref="category">
    <!-- loading效果 -->
    <loading
        v-if="is_loading"
        :top="get_is_hengping ? '50%' : '58%'"
        :style="get_is_hengping ? 'left: unset;width: 2.8rem;' : ''"
    ></loading>
    <!--无盘口数据时,赛事推荐-->
    <div class="match-recommend-wrapper" v-if="show_recommend">
      <!-- 无数据背景图  :src="get_is_hengping ? (`/image/wwwassets/bw3/svg/full_screen_match_odds_closed.svg`) : `/image/wwwassets/bw3/svg/match_odds_closed.svg`"-->
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match_odds_closed.svg`" />
      <!-- 背景下面文字说明 -->
      <div class="empty-m-list-w">
        <!-- 当前赛事盘口已全部关闭-->
        <span v-if="get_details_item == 0">
          {{i18n_t('detail.odd_all_closed')}}
        </span>
        <!-- 盘口已关闭 -->
        <span v-else>
          {{i18n_t('detail.odd_closed')}}
        </span>
      </div>

      <!-- 热门推荐列表 视频横屏状态下不显示热门推荐 -->
      <div v-if="!get_is_hengping && !no_recommend_match_list">
        <!-- 热门推荐国际化 -->
        <div class="h-recommend-head row items-center">
          <div class="w">
            {{i18n_t('detail.popular_recommendation')}}
          </div>
        </div>
        <!-- 热门赛事列表 -->
        <detailMatchList invoke='category' ref="detail_match_list" />
      </div>
    </div>
    <!-- 详情玩法投注项有数据 -->
    <!-- <div style="position: fixed; top: 0;color: red">11{{ is_no_data }}</div> -->
    <div v-if="!is_no_data && !is_loading" style="width:100%;height:auto;padding-bottom: 0.18rem;">
      <!-- <div slot="scrollList"> -->
      <div slot="scrollList">
        <!-- 置顶操作时增加动画 -->
        <transition-group name="transition-play-list" tag="div" class="transition-zhiding">
          <!-- 置顶 -->
          <template v-for="(item,keyscorll) in match_list_new_data">
            <template v-if="item.hton!=0">
              <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr.list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
            </template>
          </template>
          <!-- 非置顶 -->
          <template v-for="(item, keyscorll) in match_list_normal_data">
            <template v-if="item.hton==0">
              <template v-if="match_list_new_data.length == 0">
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr.list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
              </template>
              <template v-else>
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr.list" :item_data="item"></tournament-play-new>
              </template>
            </template>
          </template>
        </transition-group>
      <!-- </div> -->
      </div>
    </div>
    <!-- 详情玩法投注项无数据 -->
    <div v-if="!is_loading && is_no_data && !show_recommend" class="no-data-style">
      <!-- <no-data which='noMatch' height='500'></no-data> -->
    </div>
  </div>
</template>

<script>
// #TODO vuex
// import { mapGetters, mapMutations } from "vuex"
import tournament_play_new from "src/base-h5/components/details/components/tournament-play/tournament-play-new.vue"
// 引入接口封装文件
import { api_common, api_analysis} from 'src/api/index.js'
// 引入国际化
import { i18n_t } from "src/boot/i18n.js";;
//  无数据显示组件
import no_data from "src/base-h5/components/common/no-data.vue"

// #TODO mixins
// 引入skt_data_info
// import websocket_data from "src/base-h5/mixins/websocket/data/skt_data_info.js";
// 引入投注逻辑mixin
// import betting from "src/base-h5/mixins/betting/betting.js";

import { MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance } from "src/output/index.js";
// 引入加载中的组件
import loading from "src/components/loading/loading.vue"
// 精选赛事
import detailMatchList from 'src/base-h5/components/details/components/detail-match-list.vue';
import uid from "src/core/uuid/index.js"
import lodash from "lodash";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
// import { Level_one_detail_odd_info } from "../category-list.js";
import { category_info } from "./category.js"
import { reactive, nextTick, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "category",
  // #TODO mixins
  // mixins:[websocket_data, betting],
  components: {
    'tournament-play-new': tournament_play_new,
    'no-data':no_data,
    loading,
    detailMatchList
  },
  props: ['category_arr'],
  data() {
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  
  setup(props, evnet) {
    // 路由
    const router = useRouter();
    const route = useRoute();
    // 国际化
    ;
    const {
      component_data,
      show_recommend,
      match_list_new_data,
      match_list_normal_data,
      match_id,
      get_detail_data,
      get_details_item,
      get_goto_detail_matchid,
      get_menu_type,
      get_uid,
      get_subscript_game_index,
      get_fewer,
      get_curr_sub_menu_type,
      get_is_hengping,
      get_details_data_cache,
      get_chpid_obj,
      change_minheight,
      change_show,
      listItemAddCustomAttr,
      listItemRecoverCustomAttr,
      get_details_data_cache_fillter,
      initEvent,
      axios_api_loop,
      hide_detail_match_list,
      triggle_tabs_update,
      save_expanded_state,
      socket_upd_list,
      save_hshow,
      getdetail_cache_session,
      set_detail_data_storage,
      remove_session_storage,
      remove_detail_storage,
    } = category_info(props.category_arr);
    watch(
      () => route.params,
      (to, from) => {
        // 1. 非赛果页 且 不是通过搜索进入 2.搜索进入且已切换过玩法集
        
        if (
            get_menu_type.value != 28 && !to.search_term && to.mid == from.mid
            || to.search_term && component_data.match_play_item_changed
        ) {
          initEvent();
        }
        // 当切换玩法集的时候变为: true
        component_data.first_load = true;
        component_data.match_play_item_changed = true
      }
    );
    // 监听赛事id的变化 如果赛事id变化 及时更新调用玩法集合的接口
    watch(
      () => get_goto_detail_matchid.value,
      () => {
        if(component_data.matchInfoCtr){
          component_data.matchInfoCtr.destroy()
        }
        component_data.matchInfoCtr = new MatchInfoCtr({
          route,
          get_detail_data: {
            mid: route.params.mid
          }
        });
      }
    );
    // 监听get_fewer的值
    watch(
      () => get_fewer.value,
      (n) => {
        if(n != 3){
          if(Array.isArray(component_data.matchInfoCtr.list) && component_data.matchInfoCtr.list.length){
            for (const item of component_data.matchInfoCtr.list) {
              item.hshow = n == 1 ? 'Yes':'No'
            }
          }
        }
      }
    );
    // 横屏状态变化时
    watch(
      () => get_is_hengping.value,
      () => {
        change_minheight()
      }
    );
    // 显示推荐状态变化时
    watch(
      () => show_recommend.value,
      () => {
        change_minheight()
      }
    );
    onMounted(() => {
      // #TODO 测试假数据

      // console.log("match_list_new", match_list_normal.value)
      // 原created

      // 满足刷新页面保持向上展开的状态
      // set_fewer(1);
      // 只有赛果详情才调用相应接口
      if (get_menu_type.value === 28 && route.name === 'match_result') {
        initEvent().then(() => {
          // 获取赛果数据后，滑动到顶部
          document.querySelector('.match-header-result').scrollTop = 0
        });
      }


      //函数防抖 在500毫秒内只触发最后一次需要执行的事件
      if(!['result_details', 'match_result'].includes(route.name)){
        // socket_upd_list = debounce(socket_upd_list, 500);

        /*// 调用接口的参数
        let params = {
          // 当前选中玩法项的id
          mcid: get_details_item,
          // 赛事id
          mid: match_id,
          // userId或者uuid
          cuid: get_uid,
          round: get_menu_type == 3000 ? (get_details_tabs_list && get_details_tabs_list[get_subscript_game_index] && get_details_tabs_list[get_subscript_game_index].round) : null
        }

        cache_limiting_throttling_get_list(params, socket_upd_list, 'match_detail_odds_info')*/
      }

      // 原mounted
      nextTick(() => {
        change_minheight()
      })
    })

    /**
    *@description: 销毁前:清除回调函数
    *@param {Undefined}
    *@return {Undefined} undefined
    */
    onUnmounted(() => {
      // debounce_throttle_cancel(socket_upd_list);

      // 清除数据避免下次进来产生干扰
      // set_details_data_cache({})

      if(component_data.matchInfoCtr) {
        component_data.arr_hshow = []
        // component_data.matchInfoCtr.clearData()
        // component_data.matchInfoCtr.destroy()
      }
    })
    return {
      ...toRefs(component_data),
      i18n_t,
      show_recommend,
      match_list_new_data,
      match_list_normal_data,
      match_id,
      get_detail_data,
      get_details_item,
      get_goto_detail_matchid,
      get_menu_type,
      get_uid,
      get_subscript_game_index,
      get_fewer,
      get_curr_sub_menu_type,
      get_is_hengping,
      get_details_data_cache,
      get_chpid_obj,
      MatchDataWarehouseInstance,
      project_name,
      change_minheight,
      change_show,
      listItemAddCustomAttr,
      listItemRecoverCustomAttr,
      get_details_data_cache_fillter,
      initEvent,
      axios_api_loop,
      hide_detail_match_list,
      triggle_tabs_update,
      save_expanded_state,
      socket_upd_list,
      save_hshow,
      getdetail_cache_session,
      set_detail_data_storage,
      remove_session_storage,
      remove_detail_storage,
    }
  }
})
</script>
<style lang="scss" scoped>
.category {
  width: 100%;
  min-height: 3.38rem;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 0.06rem;

  .match-recommend-wrapper {
    width: 100%;
    padding-top: 0.11rem;
    position: relative;

    img {
      width: 2rem;
      height: 1rem;
      display: block;
      margin: auto;
    }

    .empty-m-list-w {
      text-align: center;
      color: var(--q-color-com-fs-color-49);
      position: absolute;
      width: 100%;
      top: 0.8rem;
      font-size: 0.14rem;
    }

    .h-recommend-head {
      font-size: 0.14rem;
      color: var(--q-gb-t-c-3);
      line-height: 1;
      flex-wrap: nowrap;
      justify-content: center;

      &:after, &:before {
        content: ' ';
        display: block;
        width: 1.3rem;
        height: 0.01rem;
        transform: translateY(-0.01rem);
        background-image: var(--q-color-com-img-bg-1);
      }

      &:after {
        transform: translateY(-0.01rem) scaleX(-1);
      }

      .w {
        font-family: PingFangSC-Medium sans-serif;
        margin: 0 0.19rem;
      }
    }
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

.play-list-enter, .play-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.play-list-leave-active {
  position: absolute;
}
</style>
