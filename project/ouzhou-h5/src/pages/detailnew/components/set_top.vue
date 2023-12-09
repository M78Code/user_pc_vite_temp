<template>
  <span
    class="component"
    @click.stop="set_hton"
    :class="show_top ? 'icon_zd_select' : 'icon_zd_default'"
  ></span>
</template>
<script setup>
import {
  useMittOn,
  useMittEmit,
  MITT_TYPES,
  MatchDetailCalss,
  MatchDataWarehouse_H5_Detail_Common,
} from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { useRoute } from "vue-router";
import { api_details } from "src/api/index";
import { computed } from "vue";
import { SessionStorage } from "src/output/module/constant-utils.js";;
const route = useRoute();
const props = defineProps({
  match_odds_info: {
    type: Array,
    default: () => [],
  },
  match_detail: {
    type: Object,
    default: () => {},
  },
  item_data: {
    type: Object,
    default: () => {},
  },
});
let timer2_ = null;
const get_details_data_cache = computed(() => {
  //从缓存获取玩法集数据
  return JSON.parse(
    JSON.stringify(SessionStorage.get("DETAILS_DATA_CACHE") || {})
  );
});
const show_top = computed(() => {
  //从缓存获取玩法集数据
  return props.item_data.hton != 0
});
/**
 *@description 点击置顶或者取消置顶
 *@param {Object} 单个投注项的数据集合
 *@return {Undefined}
 */
const set_hton = () => {
  if (timer2_) {
    clearTimeout(timer2_);
  }
  timer2_ = setTimeout(() => {
    // item_data = lodash.cloneDeep(item_data)
    // 取消置顶
    if (props.item_data.hton != 0) {
      props.item_data.hton = "0";
    } else {
      useMittEmit(MITT_TYPES.EMIT_ANIMATE_RESET_MYSCROLL_TOP, 100);
      useMittEmit(MITT_TYPES.EMIT_RESET_SET_HTON);
      // 获取最大置顶排序值
      var hton_ = 0;
      let arr = MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(
        route.params.mid
      )?.odds_info;
      for (let i = 0; i < arr.length; i++) {
        var hton = parseInt(arr[i].hton);
        if (hton > hton_) {
          hton_ = hton;
        }
      }
      // 将点击置顶的hton设置为:最大置顶排序值+1
      props.item_data.hton = Date.now() + "";
    }
    // 置顶状态变化时，更新相应玩法存储状态  todo  后续再优化
    MatchDataWarehouse_H5_Detail_Common.set_match_details(
      MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(route.params.mid),
      MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(route.params.mid)
        .odds_info
    );
    const key = `${props.item_data.mid}-0`;
    const all_list_data =
      lodash.cloneDeep(get_details_data_cache.value[key]) || [];
    const target_play_id = props.item_data.chpid || props.item_data.hpid;
    all_list_data.forEach((item, i) => {
      if ([item.chpid, item.hpid].includes(target_play_id)) {
        item.hton = props.item_data.hton;
        // 置顶时hton为即时时间戳，如果hton长度与时间戳长度相同，则将目标玩法放在数组第一个位置
        if (item.hton.length === 13) {
          all_list_data.splice(i, 1);
          all_list_data.unshift(lodash.cloneDeep(item_data));
        }
      }
    });
    // 更新当前赛事所有玩法状态
    MatchDetailCalss.set_details_data_cache({
      [key]: all_list_data,
    });
    // 当前玩法集下数据缓存
    SessionStorage.set("DETAILS_DATA_CACHE", { [key]: all_list_data });
    // MatchDataWarehouse_H5_Detail_Common.set_match_details(MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(route.params.mid),all_list_data)
    let status = props.item_data.hton != 0 ? "0" : "1",
      playId = props.item_data.hpid,
      matchId = props.match_detail.mid,
      cuid = UserCtr.get_uid(),
      // 玩法置顶接口增加topKey字段
      topKey = props.item_data.topKey;
    let params = { status, playId, matchId, cuid, topKey };
    handle_zhiding(params);
  }, 50);
};
/**
 *@description 发送置顶接口请求 可参考:/api/module/common/index.js
 *@param {String} 请求参数
 *@return {Undefined}
 */
const handle_zhiding = (params) => {
  api_details
    .get_category_playTop(params)
    .then(() => {})
    .catch((err) => console.error(err));
};
</script>
<style scoped lang="scss">
.icon_zd_select {
  width: 0.14rem;
  height: 0.14rem;
  background: url($SCSSPROJECTPATH + "/image/detail/set_top_active.png") no-repeat
    center / 100% 100% !important;
  margin-right: 0.06rem;
}

.icon_zd_default {
  width: 0.14rem;
  height: 0.14rem;
  background: url($SCSSPROJECTPATH + "/image/detail/set_top.png") no-repeat
    center / 100% 100% !important;
  margin-right: 0.06rem;
}
</style>