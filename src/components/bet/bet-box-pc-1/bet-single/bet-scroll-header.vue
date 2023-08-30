<!--
 * @Description: 左侧菜单 投注相关 头部 正常
-->
<template>
  <div class="bet-scorll-header">
    <q-separator v-if='!is_free' class="bet-top-separator"
      :class="{ 'shijiebei-separator': $route.name.includes('world_cup') }"></q-separator>
    <div class="row bet-back-btn yb-flex-between" :class="{ 'free-style': !is_free }"
      @click.stop="BetDataCtr.set_layout_left_show('menu')">
      <!-- 返回菜单（投注记录、单/串关投注栏） -->
      <div class="col yb-flex cursor-pointer" v-if="is_free">
        <!--箭头图标-->
        <icon name="icon-back" size="14px" />
        <!--返回菜单-->
        <div class="back-text ellipsis" v-if="BetDataCtr.is_bet_single">{{ $t('common.return_sports') }}</div>
        <div class="back-text2 ellipsis"
          v-tooltip="{ content: '&n b sp;'+i18n_t('common.return_spo r ts') +'&nbsp;' , overflow:1}" v-else>
          {{ $t('common.return_sports') }}</div>
      </div>
      <div v-else>
        <!-- <q-separator class="bet-top-separator" :class="{'shijiebei-separator': $route.name.includes('world_cup')}"></q-separator> -->
        <!--bet-zone-head-width虚拟体育投注框宽度-->
        <div class="bet-zone-head justify-between align-items center cursor-pointer" @click.stop="toggle_handle"
          :class="{ 'bet-zone-head-width': BetData.is_virtual_bet }">
          <template v-if="BetData.is_virtual_bet">
            <div>
              <template v-if="BetData.virtual_bet_list.length == 1">
                {{ $t('bet.bet_one_') }}
              </template>
              <template v-else-if="BetData.virtual_bet_list.length > 1">
                {{ $t('menu.match_bet') }}<span class="bet-count">{{ bet_count }}</span>
              </template>
            </div>
            <span>
              <icon class="mr15" :name="`img:${iocn_img_unfold}`" size="14px" v-if="is_expand" />
              <icon class="mr15" :name="`img:${iocn_img_fold}`" size="14px" v-else />
            </span>
          </template>
          <template v-else>
            <div>
              <template v-if="!$route.name.includes('world_cup')"> <!--世界杯rn-->
                <icon class="mr15" :name="`img:${iocn_img_unfold}`" size="14px"
                  v-if="BetData.theme.includes('y0') ? is_expand : !is_expand" />
                <icon class="mr15" :name="`img:${iocn_img_fold}`" size="14px" v-else />
                <span>{{ $t('bet.bet_order') }}</span> <!--投注单-->
              </template> <!--世界杯rn-->
              <template v-else> <!--世界杯rn-->
                <icon class="mr15" :name="`img:${require('public/yabo/shijiebei_unfold.svg')}`" size="14px"
                  v-if="is_expand" />
                <icon class="mr15" :name="`img:${require('public/yabo/shijiebei_fold.svg')}`" size="14px" v-else />
                <!--世界杯rn-->
                <span>{{ $t('bet.bet_order') }}</span>
              </template>
            </div>
          </template>

        </div>
      </div>
      <!--右边的单关或者复式串关按钮-->
      <template v-if="computed_show_btn && !BetData.is_virtual_bet && (vx_layout_left_show != 'bet_history')">
        <div class="col-auto bet-series yb-flex-between" @click.stop="change_series">
          <template v-if="BetDataCtr.is_bet_single">
            <!--复式串关已改为串关-->
            <span class="series_style"
              :class="{ 'vi_th_series_style': ['vi', 'th', 'ad'].includes(UserCtr.lang) }">{{ $t('bet.bet_series') }}</span>
            <span>+</span>
          </template>
          <!--单关-->
          <template v-else>
            <span>{{ $t('bet.bet_one_') }}</span>
            <span class="bet-single-btn">
              <!--单关数量-->
              <span class="bet-single-count">{{ bet_count }}</span>
              <span class="add">+</span>
            </span>
          </template>
        </div>
      </template>
    </div>
    <div class="row bg-white"></div>
    <!-- 供投注项定位时 获取头部定位 -->
    <div class="bet-header-position"></div>
    <!-- 投注记录 未结算&已结算$ 预约 tab bar -->
    <div v-if="bet_recode_this && vx_layout_left_show == 'bet_history'" class="full-width bet-type" style="margin-top:0">
      <div class="row bet-record-item cursor-pointer">
        <!--点选未结算0-->
        <div class="col text-center" :class="{ 'active': bet_recode_selected == 0 }" @click.stop="bet_recode_selected = 0">
          {{ $t('common.no_settlement') }}
          <!--未结算-->
        </div>
        <!--点选预约2-->
        <div class="col-auto menu-tab-line" v-if="bet_recode_selected == 2">
          <div class="line"></div>
        </div>
        <!--点选已结算1-->
        <div class="col text-center" :class="{ 'active': bet_recode_selected == 1 }" @click.stop="bet_recode_selected = 1">
          {{ $t('common.settlement_') }}
          <!--已结算-->
        </div>
        <div class="col-auto menu-tab-line" v-if="bet_recode_selected == 0">
          <div class="line"></div>
        </div>
        <div class="col text-center" :class="{ 'active': bet_recode_selected == 2 }" @click.stop="bet_recode_selected = 2">
          {{ $t('bet.bet_book2') }}
          <!--预约-->
        </div>
      </div>
      <template v-if="bet_recode_selected == 2">
        <div class="row cursor-pointer appoint-order-status">
          <div class="col text-center" :class="{ 'active': bet_recode_appoint_order_status == 0 }"
            @click.stop="bet_recode_appoint_order_status = 0">
            {{ $t('bet.bet_process') }}
            <template v-if="bet_recode_appoint_order_status == 0">
              <div class="tabs-line"></div>
            </template>
          </div>
          <div class="col-auto menu-tab-line">
            <div class="line"></div>
          </div>
          <div class="col text-center" :class="{ 'active': bet_recode_appoint_order_status == 2 }"
            @click.stop="bet_recode_appoint_order_status = 2">
            {{ $t('bet.bet_invalid') }}
            <template v-if="bet_recode_appoint_order_status == 2">
              <div class="tabs-line"></div>
            </template>
          </div>
        </div>
        <q-separator class="appoint-separator"></q-separator>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { UserCtr } from "src/core/index.js";
const props = defineProps({
  bet_recode_this: Object,
  //是不是内嵌框,默认不是
  is_free: {
    type: Boolean,
    default: true
  },
  //是不是展开
  is_expand: Boolean,
})

onMounted(() => {
  if (vx_cur_menu_type.pre_name == 'virtual_sport' && vx_cur_menu_type.type_name == 'play' && BetData.bet_single_list.length == 0) {
    BetDataCtr.set_is_bet_single(true)
  }
  console.log('is_free===', is_free);
})

// //获取当前盘口类型
// BetData.cur_odd: "get_cur_odd",
// // 左侧布局
// vx_layout_left_show: "get_layout_left_show",
// // 菜单类型
// vx_cur_menu_type: "get_cur_menu_type",
// // 是否为单关
// BetDataCtr.is_bet_single: 'is_bet_single',
// // 单关列表
// BetData.bet_single_list: "get_bet_single_list",
// // 单关投注对象
// BetData.bet_single_obj: "get_bet_single_obj",
// // 串关列表
// BetData.bet_list: "get_bet_list",
// // 串关投注对象
// BetData.bet_obj: "get_bet_obj",
// // 是否合并
// BetData.is_bet_merge: "get_is_bet_merge",
// // 被预约的投注项id
// BetData.bet_appoint_obj: "get_bet_appoint_obj",

/**
 * @description:是否显示右边的单关或者复式串关按钮
 * @param {undefined} undefined
 * @return {undefined} undefined
*/
const computed_show_btn = () => {
  let type_name = vx_cur_menu_type.type_name;
  if (!BetData.is_bet_merge) {
    // 获取单关id
    let id = BetData.bet_single_list[0];
    // 是否为冠军投注
    let match_type = _.get(BetData.bet_single_obj, `${id}.cs.match_type`, 1);
    // 冠军不显示按钮
    if (match_type == 3) {
      return false;
    }
  }
  // 冠军不显示按钮
  if (type_name == 'winner_top') {
    return false;
  }
  return true;
}

/**
 * @description:投注数量  默认是单关数量
 * @param {undefined} undefined
 * @return {undefined} undefined
*/
const bet_count = () => {
  if (BetData.is_virtual_bet) {
    return BetData.virtual_bet_list.length;
  }
  if (BetDataCtr.is_bet_single) {
    return BetData.bet_single_list.length;
  }
  if (BetData.is_bet_merge) {
    return BetData.bet_list.length;
  } else {
    return BetData.bet_single_list.length;
  }
}
/**
 * @description:串关/单关按钮切换
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const show_series_btn = () => {
  // 获取当前菜单类型
  let { type_name } = vx_cur_menu_type;
  // 获取单关id
  let id = BetData.bet_single_list[0];
  // 是否为冠军投注
  let has_winner = _.get(BetData.bet_single_obj, `${id}.cs.match_type`, 3) != 3;
  // 数据来源
  let source = _.get(BetData.bet_single_obj, `${id}.cs.source`, 'match_list');
  // 数据是从投注列表并且为单关并且为冠军
  return BetDataCtr.is_bet_single &&
    has_winner &&
    (!['bet', 'virtual_sport'].includes(type_name) ||
      (type_name == 'winner_top' && source != 'match_list')) &&
    vx_layout_left_show == 'bet_list';
}
/**
* 正常体育赛事展开 ICON
*/

const iocn_img_unfold = () => {
  return require(`public/image/yabo/${BetData.theme}/${BetData.theme}_unfold.svg`)
}
/**
 * 正常体育赛事折叠  ICON
 */

const iocn_img_fold = () => {
  return require(`public/image/yabo/${BetData.theme}/${BetData.theme}_fold.svg`)

}

/**
 * @description:单串关切换
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const change_series = () => {
  // 恢复预约投注项id为初始值
  if (!_.isNull(BetData.bet_appoint_obj)) {
    // 置空预约投注项
    BetDataCtr.set_bet_appoint_obj(null);
  }
  let is_bet_single = !BetDataCtr.is_bet_single;
  // 串关数量小于10 如果是合并
  if (BetData.is_bet_merge) {
    if (is_bet_single) {
      // 串关投注列表拷贝出来
      let bet_single_list = [...BetData.bet_list];
      // 串关投注项对象拷贝出来
      let bet_single_obj = { ...BetData.bet_obj };
      // 设置拷贝出来的数据放到单关投注项列表中
      BetDataCtr.set_bet_single_list(bet_single_list);
      _.forEach(bet_single_list, item => {
        // 根绝单关列表中的投注项id，获取拷贝出来的对象
        let obj = _.get(bet_single_obj, `${item}`);
        // 设置key值为投注项id
        obj.key = item;
        // 存储对象到单关对象中
        BetDataCtr.bet_single_obj_attr(obj);
      });
    } else {
      // 单关投注列表拷贝出来
      let bet_list = [...BetData.bet_single_list];
      // 单关投注项对象拷贝出来
      let bet_obj = { ...BetData.bet_single_obj };
      // 设置拷贝出来的数据放到串关投注项列表中
      BetDataCtr.set_bet_list(bet_list);
      _.forEach(bet_list, item => {
        // 根绝串关列表中的投注项id，获取拷贝出来的对象
        let obj = _.get(bet_obj, `${item}`);
        // 设置key值为投注项id
        obj.key = item;
        // 存储对象到串关对象中
        BetDataCtr.bet_obj_add_attr(obj);
      });
      // 检查是否可以串关
      yabo_common.check_mix();
    }
  } else if (!is_bet_single) { // 若为串关
    // 克隆单关列表以及单关对象
    let id = BetData.bet_single_list[0];
    let bet_single_obj = { ...BetData.bet_single_obj };
    let obj = _.get(bet_single_obj, `${id}`);
    // 设置拷贝出来的数据放到串关投注项列表中
    BetDataCtr.set_bet_list([id]);
    obj.key = id;
    BetDataCtr.bet_obj_add_attr(obj);
    yabo_common.check_mix();
  }
  BetDataCtr.set_is_bet_single(is_bet_single);
  //获取投注数据(内嵌mini切换或者语言发生变化时调用)
  useMittEmit(MITT_TYPES.EMIT_UPDATE_BET_DATA_CMD);
}
/**
 * @description: 点击加或者减图标需要重新计算高度
 * @param {undefined} undefined
 * @return {undefined} undefined
*/
const toggle_handle = () => {
  //重新计算投注框高度
  useMittEmit("toggle-handle");
}
</script>

<style lang="scss" scoped>
.add {
  font-size: 16px;
}

.mr15 {
  margin-right: 15px;
}

.free-style {
  padding-left: 0px !important;
  height: 44px !important;
}

/* 返回体育项目 */
.bet-back-btn {
  padding-left: 15px;
  height: 34px;
  cursor: pointer;

  /**返回菜单文字样式*/
  .back-text {
    width: 100px;
    padding-left: 10px;
  }

  /**返回菜单文字样式2*/
  .back-text2 {
    width: 65px;
    padding-left: 10px;
  }

  .bet-zone-head {
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
  }

  /**虚拟体育投注框宽度*/
  .bet-zone-head-width {
    width: 300px;
  }

  /** 右边的单关或者复式串关按钮*/
  .bet-series {
    display: flex;
    padding: 8px;
    margin-right: 5px;
    min-width: 86px;
    height: 28px;
    font-size: 12px;

    /**单关按钮*/
    .bet-single-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;

      /**单关数量*/
      .bet-single-count {
        font-size: 14px;
        text-align: center;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 50%;
        transform: scale(0.7);
      }
    }

    /** 串关按钮不可用*/
    &.bet-series-disabled {
      background: #f0f5fc;
      color: rgba(45, 45, 45, 0.3);
      border: 1px solid #e4ebf1;
      border-radius: 4px;
    }
  }
}

/* 投注记录相关 */
.bet-type {

  /** 行样式*/
  .row {
    height: 34px;
    line-height: 34px;
  }

  /* 未结算,已结算中间分割线设置 */
  .tabs-line {
    margin-left: auto;
    margin-right: auto;
    margin-top: -4px;
    height: 2px;
    width: 39px;
    border-radius: 2px;
    transition: all 0.3s;
  }
}

.yb-flex {
  display: flex;
}

/** 切换按钮样式 */
.series_style {
  padding-left: 10px;
}

.vi_th_series_style {
  padding-left: 5px
}</style>
