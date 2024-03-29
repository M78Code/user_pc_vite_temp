<!--
 * @Author: Cooper
 * @Date: 2021-08-04 17:14:23
 * @Description: 投注项优化
-->
<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}</div>
  <div
    :style="page_style"
    v-if="
      ol_data_item &&
      odds_state != 'close' &&
      lodash.get(ol_data_item, '_hs') != 2
    "
    class="component c-bet-item yb-flex-center relative-position"
    :class="[
      bet_source == 'match_list' && 'list-show',
      bet_tpl,
      odds_lift,
      version_name,
      BetData.bet_oid_list.includes(ol_data_item.oid) ? 'active' : '',
      `csid${match?.csid}`,
      ![367, 368, 369, 7, 20, 74, 103, 241, 341, 342, 343, 236, 344].includes(
        lodash.get(play_data, 'hpid') * 1
      ) ||
      (odds_state !== 'seal' &&
        [367, 368, 369, 7, 20, 74, 103, 241, 341, 342, 343, 236, 344].includes(
          lodash.get(play_data, 'hpid') * 1
        ))
        ? odds_state
        : 'odds_state',
    ]"
   @click="bet_click_ol()"
    :id="DOM_ID_SHOW && `${bet_source}-${ol_data_item.oid}`"
  >
    <div
      class="bet-inner yb-flex-center fit"
      :class="
        odds_state == 'seal' &&
        [367, 368, 369, 7, 20, 74, 103, 241, 341, 342, 343, 236, 344].includes(
          lodash.get(play_data, 'hpid') * 1
        )
          ? 'seal_on'
          : ''
      "
    >
      <!-- 盘口 -->
      <div class="handicap-wrap" :class="bet_tpl">
        <slot>
          <div class="handicap-value" v-if="handicap_value">
            {{ handicap_value }}
          </div>
          <div
            class="handicap-value yb-number-font yb-family-odds"
            :class="handicap_highlight && 'color-highlight'"
            v-else
          >
            <span v-show="ol_data_item.onbl" class="handicap-more">{{
              ol_data_item.onbl
            }}</span>
            <div class="ellipsis">{{ score }} {{ ol_data_item.onb }}</div>
          </div>
        </slot>
      </div>
    
      <!-- 赔率 -->
      <div :class="['odds yb-number-font', odds_lift]" >
        <div
          v-if="odds_state == 'seal'"
          class="lock"
          :class="
            [
              367, 368, 369, 7, 20, 74, 103, 241, 341, 342, 343, 236, 344,
            ].includes(lodash.get(play_data, 'hpid') * 1)
              ? 'seal_lock'
              : ''
          "
        ></div>
        <div
          v-show="odds_state != 'seal'"
          :class="is_odds_value_red && 'color-red'"
        >
          <!-- ['match_details', 'hot','recent', 'match_list'].includes(bet_source)?  -->
          <span class="yb-family-odds yb-number-bold" :class="bet_source">
              {{ compute_value_by_cur_odd_type(ol_data_item.ov, ol_data_item._hpid, ol_data_item._hsw, ol_data_item.csid) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash from "lodash";
import { useGetItem } from "./bet_item_hooks.js";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import { MenuData } from 'src/output/project/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { compute_value_by_cur_odd_type, compute_css_variables } from "src/output/index.js";
import {ref} from "vue";
const page_style = ref(null);
page_style.value = compute_css_variables({
  category: "component",
  module: "match-details",
});
const props = defineProps({
  // 当前玩法信息
  play_data: Object,

  // 投注项来源 match_list:主列表、match_details：详情、hot：热门推荐、recent：近期关注
  bet_source: {
    type: String,
    default: "match_list",
  },

  // 投注项对象
  bet_info: {
    type: Object,
    default: () => {
      return {
        mid_obj: {},
        hl_obj: {},
        ol_obj: {},
      };
    },
  },

  //投注项队名
  team_name: {
    type: String,
    default: "",
  },

  /** 仅主列表拥有***********************/
  // 投注项 index
  ol_index: Number,
  // 投注项 id
  oid: String,
  // 是否显示盘口
  bet_tpl: {
    type: String,
    default: "",
  },
  //盘口
  handicap_value: {
    type: String,
    default: "",
  },
  // 盘口是否高亮
  handicap_highlight: {
    type: Boolean,
    default: true,
  },

  /** 仅非主列表拥有***********************/
  // 投注项所在赛事的信息
  match_info: Object,
  bet_ids: Object,

  // 选中的投注项路径
  bet_path: {
    type: Object,
    default: () => {
      return {
        hps_index: 0,
        hl_index: 0,
        ol_index: 0,
      };
    },
  },
  // 投注项
  bet_data: [Object, String],

  /** 虚拟体育***********************/
  // tpl2 行 index
  row_index: {
    type: Number,
    default: -1,
  },
});
const {
  DOM_ID_SHOW,
  ol_data_item,
  odds_state,
  odds_lift,
  version_name,
  match = {},
  score,
  is_odds_value_red,
  match_odds,
  bet_click,
  format_odds_value
} = useGetItem({ props });

/**
 * @description 投注项点击
 * @return {undefined} undefined  组装投注项的数据
 */
 const bet_click_ol = () => {
  // 如果不是串关应清空原来保存的数据
  if (!MenuData.is_mix()) {
    BetData.bet_oid_list = []
  }
  const {oid,_hid,_hn,_mid,_mhs,_hs,os } = ol_data_item.value
  if ( (_mhs > 0 && _mhs != 11) || (_hs > 0&& _hs != 11)) {
    return;
  }
  if (os != 1) {
      return;
  }
  let bet_type = 'common_bet'
    if(MenuData.is_esports()){
        bet_type ="esports_bet"
    }else if(MenuData.is_kemp()){
        bet_type ="guanjun_bet"
    }else if(MenuData.is_vr()){
        bet_type ="vr_bet"
    }
  // 投注项来源 match_list:主列表、match_details：详情、hot：热门推荐、recent：近期关注
  let match_data_type ="pc_detail"
   if(props.bet_source !=  'match_details') {
    match_data_type ="pc_list"
   }

    let params = {
      oid, // 投注项id ol_obj
      _hid, // hl_obj 
      _hn,  // hn_obj
      _mid,  //赛事id mid_obj
    }
    let other = {
      is_detail:  true,
      // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
      // 根据赛事纬度判断当前赛事属于 那种投注类型
      bet_type,
      // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
      device_type: 2,  
      // 数据仓库类型
      match_data_type,
  }
  set_bet_obj_config(params,other)
};

</script>

<style lang="scss" scoped>

.c-bet-item {
  border-radius: 4px;
  width: 100%;
  height: 100%;
}
  .bet-inner{
  // background: var(--q-gb-bg-c-19);
}
.lock {
  width: 12px;
  height: 12px;
  background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/lock.svg") 
}
.has-hv {
  .handicap-value {
    display: none !important;
  }
}
.handicap-value,
.yb-family-odds {
  line-height: 34px;
}
.odds.hv {
  justify-content: flex-start !important;
}
.no-handicap,
.no-handi,
.null-handicap {
  .handicap-wrap {
    display: none;
  }
  .odds {
    justify-content: center;
    margin-left: 0;
  }
}
.null-handicap {
  .handicap-value {
    display: none;
  }
  .odds {
    margin-left: 0;
    justify-content: center;
  }
}
.seal_on {
  justify-content: space-around;
}
.seal_lock {
  margin-left: -20px;
}
.bet-front {
  color: var(--qq--theme-color-handicap-item-title);
  font-size: 12px;
}
.active {
  //background: var(--q-gb-t-c-16);
  // 投注项选中颜色
  background: var(--q-match-details-active) !important;
  color: var(--q-gb-bg-c-11);
}
</style>
