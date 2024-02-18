<template>
    <!-- 投注记录 未结算&已结算$ 预约 tab bar -->
    <div class="full-width bet-type" style="margin-top:0">
      <div style="display: none;">{{ BetRecordLeft.bet_record_version }}</div>
      <div class="row bet-back-btn yb-flex-between" @click="set_menu_back('menu')">
        <!--bet-zone-head-width虚拟体育投注框宽度-->
        <div class="bet-zone-head justify-between align-items center cursor-pointer">
          <!--箭头图标-->
          <icon-wapper name="icon-back" size="14px" />
          <!--返回菜单-->
          <div class="back-text ellipsis">{{ i18n_t('common.return_sports') }}</div>
        </div>
      </div>

      <div style="display: none;">{{ BetRecordLeft.bet_record_version }}</div>
      
      <div class="row bet-record-item cursor-pointer">
        <!--点选未结算0-->
        <div class="col text-center" :class="{'active': BetRecordLeft.selected==0}" @click.stop="set_record_selected(0)">
          {{i18n_t('common.no_settlement')}}
          <!--未结算-->
        </div>
        <!--点选预约2-->
        <div class="col-auto menu-tab-line" v-if="BetRecordLeft.selected==2">
          <div class="line"></div>
        </div>
        <!--点选已结算1-->
        <div class="col text-center" :class="{'active': BetRecordLeft.selected==1}" @click.stop="set_record_selected(1)">
          {{i18n_t('common.settlement_')}}
          <!--已结算-->
        </div>
        <div class="col-auto menu-tab-line" v-if="BetRecordLeft.selected==0">
          <div class="line"></div>
        </div>
        <div class="col text-center"  :class="{'active': BetRecordLeft.selected==2}"  @click.stop="set_record_selected(2)">
          {{ i18n_t('bet.bet_book2') }}
          <!--预约-->
        </div>
      </div>
      <template v-if="BetRecordLeft.selected==2">
        <div class="row cursor-pointer appoint-order-status">
          <div class="col text-center"
            :class="{'active': appoint_order_status==0}"
            @click.stop="set_record_appoint_order_status(0)">
            {{ i18n_t('bet.bet_process') }}
            <template v-if="appoint_order_status==0">
              <div class="tabs-line"></div>
            </template>
          </div>
          <div class="col-auto menu-tab-line">
            <div class="line"></div>
          </div>
          <div class="col text-center"
            :class="{'active': appoint_order_status==1}"
            @click.stop="set_record_appoint_order_status(1)">
            {{ i18n_t('bet.bet_invalid') }}
            <template v-if="appoint_order_status==1">
              <div class="tabs-line"></div>
            </template>
          </div>
        </div>
        <q-separator class="appoint-separator"></q-separator>
      </template>
    </div>
</template>

<script setup>
import { ref } from "vue"
import  BetRecordLeft  from "src/core/bet-record/pc/bet-record-left.js"
import {LayOutMain_pc} from "src/output/project/index.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import { IconWapper } from 'src/components/icon'

// tab切换 未结算 已结算 预约
const set_record_selected = number => {
  appoint_order_status.value = 0
  BetRecordLeft.set_selected(number)
}
// tab切换 预约-》 进行中 已失效
let appoint_order_status = ref(0)
const set_record_appoint_order_status = number => {
  appoint_order_status.value = number
  const params = [
    {
      jumpFrom: 1,
      preOrderStatusList: [1]
    },
    {
      jumpFrom: 1,
      preOrderStatusList: [2,3,4]
    }
  ]
  // 通知 重新获取数据 
  useMittEmit(MITT_TYPES.EMIT_GET_RECORD_LIST, params[number])
}

// 返回菜单列表
const set_menu_back = val => {
  LayOutMain_pc.set_layout_left_show(val)
}

</script>

<style scoped lang="scss">
.bet-type {
  .row {
    height: 34px;
    line-height: 34px;
  }
  .menu-tab-line {
    display: flex;
    justify-content: center;
    align-items: center;
    .line {
      width: 1px;
      height: 14px;
      background: var(--q-gb-t-c-13);
    }
  }
}
  /* 返回体育项目 */
.bet-back-btn {
  padding-left: 15px;
  height: 34px;
  cursor: pointer;
  background: var(--q-gb-bg-lg-6);
  border-bottom: 1px solid var(--q-gb-bd-c-8);
  border-right: 1px solid var(--q-gb-bd-c-6);

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
    font-size: 12px;
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
      background: var(--q-gb-bg-c-21);
      color: rgba(45, 45, 45, 0.3);
      border: 1px solid var(--q-gb-bd-c-7);
      border-radius: 4px;
    }
  }
}

.bet-record-item {
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      margin-left: 5px;
      margin-right: 5px;
      background: var(--q-gb-bg-c-11);
      box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.1);
      border-radius: 16px;
      border-radius: 16px;
      margin-top: 10px;
      div.col {
        &.active {
          color: var(--q-gb-t-c-18);
          width: 77px;
          height: 32px;
          background:var(--q-gb-bg-c-4);
          border-radius: 16px;
        }
      }
    }
    .appoint-order-status {
        margin-left: 6px;
        margin-top: 5px;
        width: 208px;

      .active {
        margin-top: -2px;
        color: var(--q-gb-bg-c-4);
      }
      /*  未结算,已结算中间分割线设置 */
      .tabs-line {
        width: 39px;
        height: 2px;
        background: var(--q-gb-bg-c-4);
        border-radius: 100px 100px 0px 0px;
        margin-left: auto;
        margin-right: auto;
        margin-top: -4px;
      }
    }    
</style>