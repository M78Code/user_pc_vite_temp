<!--
 * @Description: 左侧菜单 投注相关 尾部
-->
<template>
  <div class="bet-menu-wrap" :class="{ 'bet-menu-wrap-mix': !BetData.is_bet_single }">
    <!-- 错误信息 -->
    <div class="bet-message">{{ i18n_t(BetViewDataClass.error_message) }}</div>

    <div class="full-width cursor-pointer bet-submit" @click.stop="submit_handle('submit')">
      <template
        v-if="['0400459', '0400475', '0400486', '0400517', '0400519', '0400540'].includes(BetViewDataClass.error_code)">
        <!--确定按钮-->
        {{ i18n_t('common.confirm') }}
      </template>
      <template v-else>
        <!-- 投注 -->
        {{ i18n_t('common.betting') }}
      </template>
    </div>

    <div class="full-width cursor-pointer bet-delete-all" @click.stop="cancel_handle">
      <!-- 取消投注 -->
      {{ i18n_t('bet.bet_cancel') }}
    </div>

    <div class="bet-footer-check">
      <span class="check-box" >
        <span class="check-wrap relative-position" :class="{ 'active': BetData.is_bet_merge }" />
        <span>{{i18n_t('bet.bet_auto_msg_1')}}</span>
      </span>
    </div>

    <div>
      <span class="check-box" >
        <span class="check-wrap relative-position" :class="{ 'active': BetData.is_bet_merge }" />
        <span>{{ i18n_t('bet.common_amount') }}</span>
      </span>
    </div>


    <div style="display:none">{{ BetViewDataClass.bet_view_version }}</div>

  </div>
</template>

<script setup>

import { ref, onMounted } from "vue"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import BetData from "src/core/bet/class/bet-view-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import { LayOutMain_pc } from "src/output/index.js";

//是否失效
const lock_btn = ref(false)

onMounted(() => {
  useMittEmit(MITT_TYPES.EMIT_BTN_CHANGE, set_lock_btn())
})

/*** @description: 设置按钮失效
 * @param {boolean} value 是否锁定
 * @return {undefined} undefined
*/
const set_lock_btn = value => {
  lock_btn.value = value;
}
// 取消投注 返回菜单
const cancel_handle = () => {
  LayOutMain_pc.set_layout_left_show('menu')
}

</script>

<style scoped lang="scss">
.bet-menu-wrap {
  padding: 10px 10px 20px;
  background: var(--q-gb-bg-c-11);
  border-right: 1px solid var(--q-gb-bd-c-6);
  .bet-footer-check{
    margin-top: 20px;
  }

  .bet-submit {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: var(--q-gb-t-c-1);
    text-align: center;
    font-weight: 600;
    border-radius: 4px;
    background: var(--q-gb-bg-lg-1);
  }

  .bet-delete-all {
    margin-top: 10px;
    text-align: center;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    font-weight: 400;
    font-size: 12px;
    border: 0.5px solid var(--q-gb-bd-c-8);
    color: var(--q-gb-t-c-5);
  }
  .bet-message {
    text-align: center;
    color: #ff4040;
    height: 30px;
    line-height: 30px;
    background: transparent;
    font-size: 12px;
  }
}
.check-box {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;

  .check-wrap {
    padding: 0;
    margin-right: 5px;
  }
}
/** 选择框样式 -S*/
.check-wrap {
  width: 14px;
  min-width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid var(--q-gb-bd-c-7);
  margin-right: 10px;
  position: relative;

  &.active {
    border: none;
    background: var(--q-gb-bg-c-16);

    &::before {
      position: absolute;
      content: "";
      left: 4px;
      width: 6px;
      height: 4px;
      top: 4px;
      border-top: 2px solid transparent;
      border-right: 2px solid transparent;
      transform: rotate(135deg);
      border-color: var(--q-gb-bd-c-13);
    }
  }
}

/** 选择框样式 -E*/
</style>