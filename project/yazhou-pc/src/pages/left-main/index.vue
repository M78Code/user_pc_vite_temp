<!--
 * @Description: 主菜单
-->
<template>
  <div class="c-main-menu column" :class="{ 'bet-menu-upd': layout_left_show == 'bet_history' }">
    <v-scroll-area ref="ref_bet_scroll_area" position="menu" :observer_area="3"
      :observer_middle="layout_left_show == 'bet_list'" :class="{ 'bet-list': layout_left_show == 'bet_list' }">
      <!-- 滚动：头部 --------------------------------->
      <template v-slot:header>

        <!-- 昵称、余额 -->
        <main-header />

        <div class="menu-wrap scroll-fixed-bg relative-position bet_history">
          <!-- 投注记录 入口 -->
          <div v-show="layout_left_show != 'bet_history'" @click="change_left_menu('bet_history')"
            class="menu-item menu-top menu-border item" :class="[bet_count > 0 ? 'justify-end' : 'justify-start']">
            <!-- <img class="hot-icon"  src="~public/image/yabo/png/bet-record.png" /> -->
            <div class="col">
              投注记录
              <!-- {{ $root.$t("common.betting_record") }} -->
            </div>
            <span class="bet-count" v-show="count > 0">{{ count }}</span>
          </div>
          <!-- 单/串关投注栏 入口 -->
          <template v-if="show_bet_menu && !['bet_history'].includes(layout_left_show)">
            <div @click="change_left_menu('bet_list')" class="menu-item menu-top item-bet menu-border">
              <span class="text">
                <!-- {{$root.$t("bet.bet_my_count")}} -->
              </span>
              <!-- <span class="bet-count">{{ bet_count }}</span> -->
              <!-- <span class="text">
              <template v-if="is_bet_single && ['today','play','early','hot_one','winner_top','hot'].includes(cur_menu_type.type_name)">{{
                $root.$t("bet.bet_one")
              }}</template>
              <template v-else-if="cur_menu_type.type_name=='bet'">{{ $root.$t("bet.bet_n") }}</template>
            </span>
            <span class="bet-count">{{ bet_count }}</span> -->
            </div>
          </template>
        </div>
        <!-- 返回菜单|单关串关按钮切换 -->
        <template v-if="['bet_list', 'bet_history'].includes(layout_left_show)">
          <template v-if="get_is_virtual_bet">
            <!-- <virtual-bet-scroll-header :bet_recode_this="bet_recode_this"/> -->
          </template>
          <template v-else>
            <!-- <bet-scroll-header :bet_recode_this="bet_recode_this"/> -->
          </template>
        </template>
      </template>

      <!-- 滚动：内容 --------------------------------->
      <!-- 菜单项 -->
      <left-main-menu />

      <!-- 历史记录 -->
      <div v-if="layout_left_show == 'bet_history'" class="col">
        <bet-record-view @set_scroll_this="set_scroll_this" />
      </div>
      <!-- 投注栏 -->
      <left-main-bet />
      
      <!-- 滚动：尾部 --------------------------------->
      <template v-slot:footer v-if="!['bet_history'].includes(layout_left_show)">
        <template v-if="get_is_virtual_bet">
          <!-- <virtual-bet-scroll-footer
          v-show="layout_left_show != 'menu'"
          :bet_recode_this="bet_recode_this"
          :bet_this="bet_this"
        /> -->
        </template>
        <template v-else>
          <!-- <bet-scroll-footer
          v-show="layout_left_show != 'menu'"
          :bet_recode_this="bet_recode_this"
          :bet_this="bet_this"
        /> -->
        </template>
      </template>
    </v-scroll-area>
    <!--提示区域-->
    <q-tooltip content-class="bet-bg-tooltip" anchor="bottom left" self="top left" :offset="[181, 10]" target="#merge-info"
      v-if="show_merge_info">
      <div style="width:170px;min-height:60px;padding-top:5px;padding-bottom:10px;padding-left:5px;word-break:break-all;">
        <!-- {{$root.$t('bet.merge_info')}} -->
      </div>
    </q-tooltip>
  </div>
</template>

<script setup>

// import { mapGetters, mapActions } from "vuex";
// //单关组件
// import betSingle from "src/project/yabo/components/bet/bet_single.vue";
// //虚拟体育单关组件
// import virtualBetSingle from "src/project/yabo/components/virtual_bet/bet_single.vue";
// //虚拟体育串关组件
// import virtualBetMix from "src/project/yabo/components/virtual_bet/bet_mix.vue";
// // 串关组件
// import betMix from "src/project/yabo/components/bet/bet_mix.vue";
// // 左侧菜单 投注相关 头部
// import bet_scroll_header from "src/public/components/bet/bet_scroll_header.vue";
// //左侧菜单 投注相关 尾部
// import bet_scroll_footer from "src/public/components/bet/bet_scroll_footer.vue";
//  //虚拟体育左侧菜单 投注相关 头部
// import virtualBetScrollHeader from "src/public/components/virtual_bet/bet_scroll_header.vue";
// //虚拟体育左侧菜单 投注相关 尾部
// import virtualBetScrollFooter from "src/public/components/virtual_bet/bet_scroll_footer.vue";
// // 通屏垂直滚动
import vScrollArea from "../../components/v-scroll-area/v-scroll-area.vue";
// //体育菜单
// //球种对应的 icon
// import sportIcon from "src/public/components/sport_icon/sport_icon.vue"
// import refresh from "src/public/components/refresh/refresh.vue";
// import { api_betting } from "src/public/api/index.js";






import { ref, onMounted } from "vue"
import _ from "lodash"

import MainHeader from "./main-header.vue"
import LeftMainMenu from "./menu/index.vue"
import LeftMainBet from "./bet/index.vue"
// import betRecordView from "../bet-record/index.vue";




import store from "src/store-redux/index.js";

import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'

const state = store.getState()

// 菜单布局信息
const layout_left_show = ref(state.layoutReducer.layout_left_show)
// 当前菜单类型
const cur_menu_type = ref(state.menuReducer.cur_menu_type)

// 获取是否为虚拟投注
const is_virtual_bet = ref(state.betInfoReducer.is_virtual_bet)
// 串关列表
const bet_list = ref(state.betInfoReducer.bet_list)
// 是否单关投注
const is_bet_single = ref(state.betInfoReducer.is_bet_single)

// 单关投注列表
const bet_single_list = ref(state.betInfoReducer.bet_single_list)

// 获取虚拟投注列表
const virtual_bet_list = ref(state.betInfoReducer.virtual_bet_list)
// 上次盘口类型
const get_pre_odd = ref(state.globalReducer.odds.pre_odds)
// 当前盘口类型
const get_cur_odd = ref(state.globalReducer.odds.cur_odds)


onMounted(() => {
  get_unsettle_tickets_count_config();
})

// 是否显示投注菜单
const show_bet_menu = () => {
  if (layout_left_show != 'bet_list' && bet_count > 0) {
    // today今日 play滚球 early早盘 hot_one热门赛事  winner_top冠军  hot热门赛事
    if (is_bet_single &&
      ['today', 'play', 'early', 'hot_one', 'winner_top', 'hot'].includes(cur_menu_type.type_name)) {
      return true;
    } else if (bet_list.length > 0) {
      return true;
    }
    /**
      else if(cur_menu_type.type_name=='bet' && bet_series_list.length>0) {
      return true;
    }
     */
  }
  return false;
}
// 投注数量
const bet_count = () => {
  // 是否虚拟体育投注
  if (is_virtual_bet) {
    return virtual_bet_list.length;
  }
  // 是否单关投注
  if (is_bet_single) {
    return bet_single_list.length;
  }
  return bet_list.length;
}
/**
 * @description 左侧菜单与投注栏切换时调用
 * @param  {string} page  类似类型
 * @return {undefined} undefined
 */
const change_left_menu = page => {
  // 设置左侧显示
  useMittEmit(MITT_TYPES.EMIT_LAYOUT_LIST_TYPE, page)
}


//诸葛埋点事件
const record_zhuge_point = menu_type => {
  let eventLabel = 'PC_现场滚球盘'
  if (menu_type == 'hot') {
    eventLabel = 'PC_热门赛事'
  }
  // 发送埋点事件
  // $utils.send_zhuge_event(eventLabel);
}
/**
 * @Description 设置用户偏好
 * @param {undefined} undefined
*/
const set_user_preference = (cur, old) => {
  let userMarketPrefer;
  if (cur == 18) {
    userMarketPrefer = 'EU'
  } else if (old == 18) {
    userMarketPrefer = get_pre_odd;
  }
  if (!userMarketPrefer || userMarketPrefer == get_cur_odd) {
    return
  }
  // 设置用户偏好
  api_betting.record_user_preference({ userMarketPrefer }).then((res) => {
    let code = _.get(res, 'data.code');
    if (code == 200) {
      if (cur == 18) {
        // 设置盘口类型
        // set_pre_odd(get_pre_odd);
        // set_cur_odd('EU');
      } else if (old == 18) {
        // set_pre_odd(get_pre_odd);
      }
    }
  });
}
/**
 * @description 设置滚动数据
 * @param  {string} type  类型
 * @param  {oject} _this  上下文对象
 * @return {undefined} undefined
 */
const set_scroll_this = ({ type, _this }) => {
  // this[type] = _this
}
const get_unsettle_tickets_count_config = () => {
  let param = {};
  // console.log('get_unsettle_tickets_count====',param);
  return
  api_betting.get_unsettle_tickets_count(param).then(response => {
    let count = _.get(response, 'data.data') || 0;
    let status = _.get(response, 'status');
    if (status == 200) {
      count = count;
    }
  }).catch(error => {
    console.error(error);
  });
}
</script>

<style lang="scss">
.c-main-menu {
  font-size: 13px;
  /* *** 头部 ************ -S */
  z-index: 211;
  width: 100%;

  .header-wrap {
    padding: 4px 10px 4px 15px;
    height: 40px;
    font-weight: 500;
    line-height: 1.3;

    /*  用户信息 */
    .user-info {
      padding-right: 10px;
      font-size: 12px;
    }

    /*  用户余额 */
    .balance-wrap {
      width: 100%;
      height: 15px;
      font-size: 14px;

      /*  用户余额隐藏 */
      .balance-text-hide {
        font-size: 16px;
        // color: var(--qq--theme-color-icon-eye);
        /* 是否显示余额图标 */
      }

      .balance-btn-eye {
        margin-left: 10px;
      }

      /*  刷新余额按钮 */
      .refresh-btn {
        position: absolute;
        top: -8px;
        right: 10px;
        bottom: 11px;
        width: auto !important;

        .icon-refresh:before {
          font-size: 14px;
        }
      }
    }
  }

  /* *** 头部 ************ -E */
  .scroll-inner-wrap {
    margin-bottom: 10px;
  }

  /* *** 体育 ************ -S */
  .c-menu-sports {
    font-size: 13px;

    .menu-item {
      &.menu-tab {
        font-size: 13px;
        justify-content: space-around;
        padding: 10px 4px;

        .item {
          height: 30px;
          border-radius: 8px;
          margin-right: 10px;
          flex: 1;
          white-space: nowrap;
          max-width: 95px;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            font-weight: 600;
            font-size: 14px;
          }

          &.active1 {
            margin-left: 152px;
          }
        }
      }
    }
  }

  /* *** 体育 ************ -E */
  /* *** 公共 ************ -S */
  .menu-wrap {
    cursor: pointer;

    .no-click {
      cursor: auto;

      &:hover {
        background: none !important;
      }
    }

    .menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.active {
        font-weight: 700;
        border-bottom: 0;
      }

      .hot-icon {
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }

      .menu-new-icon {
        margin: 0 0 3px 4px;
      }

      .match-count {
        padding-right: 15px;
        display: inline-block;
        width: 40px;
        text-align: right;
        max-width: 45px;
      }

      &.disable-hover {
        &:hover {
          background-color: transparent !important;
        }
      }

      &.menu-top {
        padding: 0 15px 0 16px;
        height: 40px;
        border-right: 2px solid transparent;

        .match-count {
          padding-right: 0;
        }

        &.menu-virtual {
          .menu-name {
            margin-left: 10px;
          }
        }

        &.hot-menu {
          &:hover {
            background: none;
          }
        }

        &.item-bet {
          width: 200px;
          height: 36px;
          border-radius: 10px;
          border-right: 0;
          margin-left: 10px;
        }

        &.no-click {
          font-size: 12px;
        }
      }

      &.menu-fold1,
      &.menu-fold2 {
        padding-left: 16px;
        height: 36px;

        &.active {
          border-bottom: 0;

          & .items-right.menu-border {
            border-bottom: 1px solid transparent;
          }

          & .menu-border {
            border-bottom: 1px solid transparent;
          }
        }

        .league-logo {
          width: 18px;
          height: 18px;
        }

        .items-right {
          margin-left: 10px;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          height: 100%;

          .live-text {
            position: relative;
            top: 2px;
            ;
            display: inline-block;
            width: 26px;
            height: 12px;
          }
        }
      }
    }

    /*  玩法 菜单项 */
    .menu-fold2-wrap {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.2s;

      &.open {
        max-height: 500px;
      }

      .menu-fold2 {
        padding: 0 0 0 43px;
        border-right: 2px solid transparent;

        .menu-border {
          position: absolute;
          width: 128px;
          height: 1px;
          right: 0;
          bottom: 0;
        }

        .menu-point {
          position: absolute;
          left: -18px;
          width: 4px;
          height: 4px;
          border-radius: 100%;
        }

        .menu-text {
          max-width: 130px;
        }

        .match-count {
          padding-right: 13px;
        }

        &.menu-virtual {
          padding-left: 34px;
        }
      }
    }
  }

  .hot-menu-wrap {
    margin-top: 15px;

    .level2 {
      .menu-text {
        max-width: 170px;
      }
    }
  }

  .menu-normal-fixed-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    cursor: pointer;

    .left {
      padding-left: 15px;

      .icon-menu_show_normal {
        margin-right: 5px;
      }
    }

    .right {
      padding-right: 15px;
      height: 100%;

      .icon-close {
        transform: scale(0.7);
      }
    }

    &.normal-close {
      height: 32px;
      justify-content: center;

      .icon-close {
        transform: scale(0.7);
      }
    }
  }

  .bet-mode-zone {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 40px;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      padding-left: 15px;

      .bet-single-count {
        border-radius: 10px;
        color: #ffffff;
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-left: 5px;
        text-align: center;
        transform: scale(0.8);
      }
    }

    .right {
      display: flex;
      flex-wrap: nowrap;
      margin-right: 10px;

      .check-box {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        padding-left: 5px;
        padding-right: 5px;

        .check-wrap {
          padding: 0;
          margin-right: 5px;
        }
      }
    }
  }

  .tip-content {
    width: calc(100% - 20px);
    height: 100px;
    position: absolute;
    bottom: 0;
    z-index: 500;
    top: 40px;
    left: 10px;

    &.top-content {
      top: 5px;
    }

    .content-wrap {
      position: absolute;
      top: 6px;
      width: 100%;
      background: #fff;
      border: 2px solid #ff781d;
      border-radius: 5px;

      .content {
        padding: 10px;
        font-size: 12px;

        .row-1,
        .row-2,
        .row-3 {
          color: #2d2d2d;
          text-align: center;
        }

        .row-1 {
          margin-bottom: 10px;
          font-size: 14px;
          color: #ff781d;
          font-weight: bold;
        }
      }

      .triangle,
      .triangle1 {
        position: absolute;
        background: #fff;
        border: 2px solid #ff781d;
        border-top: 0;
        border-left: 0;
        width: 15px;
        height: 15px;
        transform: rotate(45deg);
        top: 81px;
        right: 22px;
      }

      .triangle1 {
        top: 116px;
      }

      .icon-del {
        position: absolute;
        top: 16px;
        right: 10px;
        cursor: pointer;
      }
    }
  }

  /* *** 公共 ************ -E */

}

.bet-view {
  width: 220px;
}

.bet-bg-tooltip {
  background: #A3AFBF;
  color: #FFFFFF;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
