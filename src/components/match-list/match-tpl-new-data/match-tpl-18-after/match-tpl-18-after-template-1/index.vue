<template>
  <div class="c-match-item tpl-18">
    <!-- ++++ 玩法 loop ------>
    <template
      v-for="(hl_data, hl_index) in compute_match_all_handicap_data_champion(match)"
    >
      <div
        v-if="hl_data.hid && hl_data.hs != 2"
        :key="hl_index"
        class="play-wrap"
      >
        <!-- 显示玩法名称 -->
        <div class="play-info row items-center yb-flex-between">
          <div
            class="ellipsis"
            :class="vx_main_menu_toggle == 'mini' ? 'max2' : 'max1'"
            v-tooltip="{ content: hl_data.hpn, overflow: 1 }"
          >
            {{ hl_data.hpn }}
          </div>
          <!--盘口结束时间-->
          <div>{{ `${hl_data.end_time} ${i18n_t("list.bet_close")}` }}</div>
        </div>
        <!-- 投注列表 -->
        <div class="bet-list-wrap row">
          <template v-for="(ol_data, ol_index) in hl_data.ol">
            <div
              v-if="ol_data.oid && ol_data.os != 3"
              :key="ol_index"
              class="bet-col"
              style="height: 35px !important"
            >
              <bet-item v-if="is_mounted && ol_data.oid" :ol_data="ol_data" />
            </div>
          </template>
          <!-- 投注项列表单数 补一个空div 占位 -->
          <div
            v-if="lodash.get(hl_data, 'ol.length') % 2 !== 0"
            class="bet-col null-bet-col"
          ></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import lodash from "lodash";
import { defineProps, ref } from "vue";
import betItem from "src/components/bet-item/bet-item-list-new-data.vue";
import {
  i18n_t,
  MatchDataWarehouse_PC_List_Common as MatchListData,
  time_conversion,
} from "src/core/index.js";
import MatchListCardData from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from "src/core/match-list-pc/list-template/index.js";
const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  },
});
let match_style_obj = MatchListCardDataClass.all_card_obj[props.mid + "_"];
const match_list_tpl_size =
  MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`]
    .width_config;
const match_tpl_info =
  MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`];
const match = MatchListData.list_to_obj.mid_obj[props.mid + "_"];
const is_mounted = ref(true)
/**
 * @Description 计算赛事所有盘口数据--冠军玩法
 * @param {undefined} undefined
 */
function compute_match_all_handicap_data_champion(match) {
  // 主盘口列表
  let main_handicap_list = [];
  // 遍历主盘口数据
  lodash.each(match.hpsData, (hpsData) => {
    lodash.each(hpsData.hps, (item) => {
      let hl_obj = lodash.get(item, "hl", {});
      if (hl_obj.hid) {
        hl_obj.end_time = time_conversion(hl_obj.hmed);
        hl_obj.hpn = match.hpsPns.find(option => option.hid == hl_obj.hid).hpn
        console.log(match, 'qweqweqweqweqweqweqweqwe');
        main_handicap_list.push(hl_obj);
      }
    });
  });
  console.log('main_handicap_list', main_handicap_list);
  return main_handicap_list;
}
</script>
<style lang="scss" scoped>
.c-match-item {
  display: block !important;
}
.play-info {
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  .max1 {
    max-width: 530px;
  }
  .max2 {
    max-width: 700px;
  }
}
.bet-col {
  width: 50%;
  .c-bet-item {
    justify-content: space-between;
    padding: 0 15px;
    :deep(.handicap-value) {
      justify-content: flex-start !important;
    }
    :deep(.odds) {
      justify-content: flex-end;
    }
  }
}
</style>
