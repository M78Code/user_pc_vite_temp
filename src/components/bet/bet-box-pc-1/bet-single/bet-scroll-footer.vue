<!--
 * @Description: 左侧菜单 投注相关 尾部
-->
<template>
  <div class="bet-menu-wrap" :class="{ 'bet-menu-wrap-mix': !BetData.is_bet_single }">
    <!-- 错误信息 -->
    <div class="bet-message">{{ BetViewDataClass.error_message }}</div>

    <div class="full-width cursor-pointer bet-submit" @click.stop="submit_handle('submit')">
      <template
        v-if="['0400459', '0400475', '0400486', '0400517', '0400519', '0400540'].includes(BetViewDataClass.error_code)">
        <!--确定按钮-->
        {{ $t('common.confirm') }}
      </template>
      <template v-else>
        <!-- 投注 -->
        {{ $t('common.betting') }}
      </template>
    </div>

    <div class="full-width cursor-pointer bet-delete-all" @click.stop="bet_this.cancel_handle">
      <!-- 取消投注 -->
      {{ $t('bet.bet_cancel') }}
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
import lodash from 'lodash'

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
</script>

<style scoped lang="scss">
.bet-menu-wrap {
  padding: 10px 10px 0;

  .bet-submit {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #fff;
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
</style>