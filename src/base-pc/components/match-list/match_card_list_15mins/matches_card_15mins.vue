<template>
  <div class="sport">
    <div v-show="false">{{ BetData.bet_data_class_version }}</div>
    <div class="competing-time">
      <sport_icon :size="'12px'" :status="true" :sport_id="current_tab.csid" class="sport-icon" />
      <div class="matches-time">
        <div class="begin-time din_font">{{ get_mmp(current_tab.mst) }}</div>
      </div>
    </div>
    <div class="club-name">
      {{ current_tab.mhn }}
    </div>
    <div class="union-name">
      {{ current_tab.man }}
    </div>
    <div class="odds-box din_font" v-if="col_ols_data.length">
      <div class="odds-box-item" 
        v-for="(col, col_index) in col_ols_data" :key="col._hpid + col_index"
        :class="{checked: BetData.bet_oid_list.includes(item.oid) }"
      >
        <div :class="['bet-item-wrap-ouzhou', (col.ols).length === 2 && 'bet-item-wrap-ouzhou-bigger']"
          v-for="(ol_data, ol_index) in (col.ols)" :key="ol_index + '_' + ol_data._hpid + '_' + ol_data._ot">
          <!-- 投注项组件 -->
          <bet-item :ol_data="ol_data" warehouse_name="ten_five_mins" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

  import { onMounted, ref, watch, computed } from 'vue';
  import {get_match_to_map_obj} from 'src/core/match-list-pc/match-handle-data.js'
  // import { get_15mins_odds_list } from "src/core/match-list-pc/list-template/module/template-101.js"
  import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
  import { MenuData, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common as MatchListDataInfo, i18n_t } from "src/core/index.js"

  import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
  import sport_icon from "src/base-pc/components/match-list/sport_icon.vue";

  const props = defineProps({
    current_tab: {
      type: [ Object, Array ],
      default: () => {},
    },
  });
  const current_check_betId = ref(MenuData.current_check_betId.value);
  let match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`]
  let odds_list = match_tpl_info.get_15mins_odds_list()
  // const ols = ref([])

  // // 监听 当前投注项ID的变化
  watch(
    MenuData.current_check_betId,
      () => {
        current_check_betId.value= MenuData.current_check_betId.value
      },
    )

  const get_mmp = (mst) => {
    let difference =  Math.floor(mst / 60 / 15);
    if (difference >= 6) difference = 5;
    return i18n_t('ouzhou.15minutes_bet_col')[difference]
  }

  const col_ols_data = computed(() => {
    try {
      let { hn, mid } = props.current_tab
      let handicap_type = hn || 1
      const many_obj = get_match_to_map_obj(props.current_tab); //非坑位对象
      const hn_obj = lodash.get(MatchListDataInfo, "list_to_obj.hn_obj", {})
      odds_list.ols = odds_list.ols.map(item => {
        if (item.empty) { return }
        // 投注项数据拼接
        let hn_obj_config = MatchListDataInfo.get_list_to_obj_key(mid, `${mid}_${item._hpid}_${handicap_type}_${item.ot}`, 'hn')
        // 获取投注项内容 
        let ols_data = lodash.get(hn_obj, hn_obj_config) || many_obj[hn_obj_config] || {};
        // 15mins 和 featured赛事展示的投注项名称
        ols_data['otb'] = item.otb
        return ols_data;
      })
      return odds_list
    } catch (e) {
      console.error('deal_width_handicap_ols', e)
      return []
    }
  })

  // 选中当前td 使td高亮 且将投注信息存储到数据仓库中
  const checked_current_td = payload => {
    MenuData.current_check_betId.value = payload.ol.oid
    let params = {
      oid: payload.ol.oid, // 投注项id ol_obj
      _hid: payload.hps.hid, // hl_obj 
      _hn: payload.hps.hn,  // hn_obj
      _mid: payload.payload.mid  //赛事id mid_obj
    }
    console.log(params, 'params', payload)
    set_bet_obj_config(params,{})
  }
  
</script>

<style lang="scss" scoped>
  .sport {
    height: 100%;
    width: 250px;
  }
  .competing-time {
    display: flex;
    align-items: center;
    margin: 0 0 5px 16px;
  }
  .sport-icon {
    margin-right: 5px;
  }
  .matches-time {
    color: var(--q-gb-t-c-2);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    .begin-time {
      font-family: DIN;
      line-height: 17px;
      letter-spacing: 0px;
    }
    .end-time {
      font-family: PingFang SC;
      line-height: 20px;
      letter-spacing: 0px;
    }
  }
  .club-name {
    color: #3D3B37;
    font-size: 14px;
    margin-bottom: 6px;
    font-family: "Roboto";
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0px;
    margin-left: 16px;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .union-name {
    color: var(--q-gb-t-c-5);
    font-size: 14px;
    margin-bottom: 8px;
    font-family: "Roboto";
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0px;
    margin-left: 16px;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .odds-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: DIN;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0px;
    .odds-box-item {
      cursor: pointer;
      width: 73px;
      height: 40px;
      line-height: 17px;
      letter-spacing: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      // &:hover {
      //   background: rgba(255, 112, 0, 0.1);
      // }
    }
    div:last-of-type {
      margin: 0;
    }
    span {
      font-size: 14px;
      &:first-child {
        color: var(--q-gb-t-c-8);
        margin-right: 7px;
      }
      &:last-child {
        color: var(--q-gb-t-c-2);
      }
    }
    .checked {
      background: var(--q-gb-bg-c-1);
      color: var(--q-gb-t-c-1);
      span {
        color: var(--q-gb-t-c-1);
      }
      &:hover {
        background: var(--q-gb-bg-c-1);
      }
    }
  }
</style>
