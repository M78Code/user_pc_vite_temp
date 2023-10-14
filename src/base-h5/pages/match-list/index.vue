<!--
 * @Description: 列表页主内容
-->
<template>
    <match-list
      :source="invok_source ? invok_source : 'match_main'"
      :data_get_empty="match_is_empty" 
      :window_scrolly="window_scrolly" 
      :style="page_style" 
      :match_list_wrapper_height="match_list_wrapper_height">
    </match-list>
    <!-- 到底了容器原加载更多容器-->
    <div :class="['loading-more-container', { home_hot: is_hot }]" v-if="!match_is_empty && match_mids.length > 3">
      <div style="color:#AAAEB8;font-size:.12rem;"> {{ $t("scroll_wrapper.is_footer") }} </div>
    </div>
</template>
 
<script setup>
import { ref, watch, onMounted } from "vue";
import lodash from "lodash";
import matchList from "./components/match-list.vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import store from "src/store-redux/index.js";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import { is_hot, menu_type } from 'src/base-h5/mixin/menu.js'
import { match_mids } from 'src/base-h5/mixin/userctr.js'
import { compute_css_variables } from "src/core/css-var/index.js"

const props = defineProps({
  invok_source: String,
  wrapper_scroll_top: Number,
});

const page_style = ref(null);
const emitters = ref({});
let timer_super = null
let subscription_timer = null

// TODO: 下面需要替换
const invok_source = ref('')
const  ws_invoke_key = ref('match_main')
const match_is_empty = ref(false)
const window_scrolly = ref(0)
const match_list_wrapper_height = ref(0)

onMounted(() => {
  // 页面css变量植入
  page_style.value = compute_css_variables({ category: 'component', module: 'match' })
  // 移除相关事件监听
  off_listeners();
  // 绑定相关事件监听
  on_listeners();
})

// 早盘时，并且是 足球时，执行下边操作
watch(() => menu_type.value, (val) => {
  if ( menu_type.value == 4 && val == "40303") {
    clearTimeout(subscription_timer);
    subscription_timer = setTimeout(() => {
      // 订阅新赛事列表
      subscription();
    }, 3000);
  }
}, { deep: true } );

// 详情若无热门推荐赛事，则隐藏相应内容
watch(() => match_is_empty.value, () => {
  if (props.invok_source === "detail_match_list" && is_empty) {
    useMittEmit(MITT_TYPES.EMIT_HIDE_DETAIL_MATCH_LIST, true);
  }
});

// 罚牌说明展开后会跟随列表滑动，且切换页面再次进入依旧显示在列表页
watch(() => props.wrapper_scroll_top, () => {
  // window_scrolly.value = c;
});

// 投注栏弹层显示非0否则0
// watch(() => get_bet_status.value, () => {
//   if (c_status == 0) {
//     const has_pre = lodash.findKey(BetData.bet_obj, function (o) {
//       return o.show_pre;
//     });
//     if (has_pre) {
//       //当投注框收起时，清空预约相关信息
//       let temp_bet_obj = lodash.cloneDeep(BetData.bet_obj);
//       temp_bet_obj[has_pre].show_pre = false;
//       delete temp_bet_obj[has_pre].pre_odds;
//       delete temp_bet_obj[has_pre].pre_market_value;
//       delete temp_bet_obj[has_pre].min_odds;
//       // store.dispatch({ type: 'matchReducer/set_pre_market_data',  payload: [] })
//       set_bet_obj(temp_bet_obj);
//     }
//     clearTimeout(timer_super6.value);
//     timer_super6.value = setTimeout(() => {
//       local_bet_status.value = c_status;
//     }, 400);
//   } else {
//     local_bet_status.value = c_status;
//   }
// }
// );

/**
 * @Description 次要玩法展开加载数据
 * @param {Object} match 赛事
 * @param {String} key 指定的hps
 */
const special_hps_load_handle = (match, key) => {
  if (["category"].includes(route.name)) {
    return;
  }
  if (matchCtr.value.list_to_obj.mid_obj[`${match.mid}_`] && match[key] && match[key].length) {
    matchCtr.value.list_to_obj.mid_obj[`${match.mid}_`] = match[key];
    // matchCtr.value.addMatchInfo(match);
    // websocket_store.SCMD_SPECIAL_C8(1,'list',key,match);
  }
};

/**
 * @description: 赛事列表为空通知事件函数
 */
const upd_match_is_empty = (result) => {
  // 当是赛果菜单,三级菜单数据没有时,发送列表赛事数据为空消息,收到消息后页面显示为空页面
  match_is_empty.value = result;
}

// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_4: useMittOn(MITT_TYPES.EMIT_SPECIAL_HPS_LOADED, special_hps_load_handle).off,
    emitter_10: useMittOn(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, upd_match_is_empty).off,
    emitter_9: useMittOn(MITT_TYPES.EMIT_TAB_HOT_CHANGING, MatchListCard.tab_changing_handle).off,
    emitter_6: useMittOn(MITT_TYPES.EMIT_BET_ODD_SYNCHRONIZE, MatchPage.bet_odd_synchronize_handle).off,
    emitter_8: useMittOn(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, MatchListCard.secondary_play_unfold_change_handle).off,
  };
};
// 移除相关事件监听
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x());
};

// 批量清除定时器
const clear_timer = () => {
  const timer_arr = [ timer_super, subscription_timer, ];

  for (let timer of timer_arr) {
    clearTimeout(timer);
    timer = null;
  }
};


</script>
 
<style scoped lang="scss">
 
</style>