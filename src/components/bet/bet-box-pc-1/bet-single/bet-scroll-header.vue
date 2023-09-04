<!--
 * @Description: 左侧菜单 投注相关 头部 正常
-->
<template>
  <div class="bet-scorll-header">
   sssaasdadada
    <div class="row bet-back-btn yb-flex-between" :class="{ 'free-style': !LayOutMain_pc.is_iframe }"
      @click.stop="MenuData.set_layout_left_show('menu')">
      <!-- 返回菜单（投注记录、单/串关投注栏） -->
      <div class="col yb-flex cursor-pointer" v-if="LayOutMain_pc.is_iframe">
        <!--箭头图标-->
        <icon name="icon-back" size="14px" />
        <!--返回菜单-->
        <div class="back-text ellipsis" v-if="BetData.is_bet_single">{{ $t('common.return_sports') }}</div>
        <div class="back-text2 ellipsis"
          v-tooltip="{ content: '&n b sp;'+i18n_t('common.return_spo r ts') +'&nbsp;' , overflow:1}" v-else>
          {{ $t('common.return_sports') }}</div>
      </div>
      <div v-else>
        <!-- <q-separator class="bet-top-separator" :class="{'shijiebei-separator': $route.name.includes('world_cup')}"></q-separator> -->
        <!--bet-zone-head-width虚拟体育投注框宽度-->
        <div class="bet-zone-head justify-between align-items center cursor-pointer" @click.stop="toggle_handle"
          :class="{ 'bet-zone-head-width': BetData.is_virtual_bet }">
            <div>
                <!-- <icon class="mr15" :name="`img:${require('public/yabo/shijiebei_unfold.svg')}`" size="14px" v-if="is_expand" /> -->
                <!-- <icon class="mr15" :name="`img:${require('public/yabo/shijiebei_fold.svg')}`" size="14px" v-else /> -->
                <!-- <span>{{ $t('bet.bet_order') }}</span> -->
                <span>ssss</span>
            </div>

        </div>
      </div>

      <!--右边的单关或者复式串关按钮-->
      <template v-if="computed_show_btn && !BetData.is_virtual_bet && (MenuData.layout_left_show != 'bet_history')">
        <div class="col-auto bet-series yb-flex-between" @click.stop="change_series">
          <template v-if="BetData.is_bet_single">
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

  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { UserCtr,MenuData,LayOutMain_pc } from "src/core/index.js";
import BetData from "src/core/bet/class/bet-data-class.js";

import lodash from 'lodash'

/**
 * @description:是否显示右边的单关或者复式串关按钮
 * @param {undefined} undefined
 * @return {undefined} undefined
*/
const computed_show_btn = computed(()=>{
  if (!BetData.is_bet_merge) {
    // 获取单关id
    let id = BetData.bet_single_list[0];
    // 是否为冠军投注
    let match_type = lodash.get(BetData.bet_single_obj, `${id}.cs.match_type`, 1);
    // 冠军不显示按钮
    if (match_type == 3) {
      return false;
    }
  }
  // 冠军不显示按钮
  if (400 == MenuData.menu_root) {
    return false;
  }
  return true;
}) 

/**
 * @description:投注数量  默认是单关数量
 * @param {undefined} undefined
 * @return {undefined} undefined
*/
const bet_count = () => {
  if (BetData.is_virtual_bet) {
    return BetData.virtual_bet_list.length;
  }
  if (BetData.is_bet_single) {
    return BetData.bet_single_list.length;
  }else{
    return BetData.bet_s_list.length;
  }
}
/**
 * @description:串关/单关按钮切换
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const show_series_btn = () => {
  // 获取当前菜单类型
  let { menu_root } = MenuData;
  // 获取单关id
  let id = BetData.bet_single_list[0];
  // 是否为冠军投注

  // 数据来源
  
  // 数据是从投注列表并且为单关并且为冠军
  return true
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
  if (!lodash.isNull(BetData.bet_appoint_obj)) {
    // 置空预约投注项
    BetData.set_bet_appoint_obj(null);
  }
  let is_bet_single = !BetData.is_bet_single;
  // 串关数量小于10 如果是合并
  if (BetData.is_bet_merge) {
    if (is_bet_single) {
      // 串关投注列表拷贝出来
      let bet_single_list = [...BetData.bet_list];
      // 串关投注项对象拷贝出来
      let bet_single_obj = { ...BetData.bet_obj };
      // 设置拷贝出来的数据放到单关投注项列表中
      BetData.set_bet_single_list(bet_single_list);
      lodash.forEach(bet_single_list, item => {
        // 根绝单关列表中的投注项id，获取拷贝出来的对象
        let obj = lodash.get(bet_single_obj, `${item}`);
        // 设置key值为投注项id
        obj.key = item;
        // 存储对象到单关对象中
        BetData.bet_single_obj_attr(obj);
      });
    } else {
      // 单关投注列表拷贝出来
      let bet_list = [...BetData.bet_single_list];
      // 单关投注项对象拷贝出来
      let bet_obj = { ...BetData.bet_single_obj };
      // 设置拷贝出来的数据放到串关投注项列表中
      BetData.set_bet_list(bet_list);
      lodash.forEach(bet_list, item => {
        // 根绝串关列表中的投注项id，获取拷贝出来的对象
        let obj = lodash.get(bet_obj, `${item}`);
        // 设置key值为投注项id
        obj.key = item;
        // 存储对象到串关对象中
        BetData.bet_obj_add_attr(obj);
      });
      // 检查是否可以串关
      yabo_common.check_mix();
    }
  } else if (!is_bet_single) { // 若为串关
    // 克隆单关列表以及单关对象
    let id = BetData.bet_single_list[0];
    let bet_single_obj = { ...BetData.bet_single_obj };
    let obj = lodash.get(bet_single_obj, `${id}`);
    // 设置拷贝出来的数据放到串关投注项列表中
    BetData.set_bet_list([id]);
    obj.key = id;
    BetData.bet_obj_add_attr(obj);
    yabo_common.check_mix();
  }
  BetData.set_is_bet_single(is_bet_single);
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
