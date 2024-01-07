<!-- 欧洲版冠军页面 视图组件 -->
<template>
  <div class="c-match-item tpl-118">
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
          <div class="hl-end-time">{{ `${hl_data.end_time} ${i18n_t("list.bet_close")}` }}</div>
        </div>
        <!-- 投注列表 -->
        <div class="bet-list-wrap row">
          <template v-for="(ol_data, ol_index) in hl_data.ol">
            <div
              v-if="ol_data.oid && ol_data.os != 3"
              :key="ol_index"
              class="bet-col bet-item-wrap-ouzhou"
              style="height: 46px !important"
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
import { ref,inject } from "vue";
import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue";
import {compute_match_all_handicap_data_champion} from 'src/core/match-list-pc/match-handle-data.js'
import {
  i18n_t,
  MatchDataWarehouse_PC_List_Common as MatchListData,
  time_conversion,
} from "src/output/index.js";
const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  },
});
const match =inject("match");
const is_mounted = ref(true)
const vx_main_menu_toggle = ref('')
</script>
<style lang="scss" scoped>
.c-match-item {
  display: block !important;
}
.play-info {
  height: 36px;
  line-height: 36px;
  padding: 0 15px;
  .hl-end-time {
    color: var(--q-gb-t-c-2);
  }
  .max1 {
    max-width: 530px;
    font-weight: bold
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

:deep(.bet-col.bet-item-wrap-ouzhou ){
    flex: none;
    .c-bet-item.active .handicap-value .handicap-value-text {
    // color: var(--q-gb-t-c-1);
}
    .c-bet-item {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      .handicap-value {
        justify-content: flex-start;
        height: 46px;
        line-height: 46px;
        .handicap-value-text {
          color: var(--q-gb-t-c-5);
          font-size: 13px;
        }
      }
      .odds {
        justify-content: flex-end;
      }
      >div {
        flex: 1;
        text-align: left;
      }
    }
  }



</style>