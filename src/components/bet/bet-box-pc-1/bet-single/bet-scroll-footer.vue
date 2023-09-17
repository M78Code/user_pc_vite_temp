<!--
 * @Description: 左侧菜单 投注相关 尾部
-->
<template>
  <div class="bet-menu-wrap" :class="{ 'bet-menu-wrap-mix': !BetData.is_bet_single }">
    <div v-if="BetViewDataClass.bet_order_status == 2">投注中</div>
    <div v-if="BetViewDataClass.bet_order_status == 3">投注成功</div>
    <div v-if="BetViewDataClass.bet_order_status == 4">{{ BetViewDataClass.error_message }}</div>


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

    

    <div style="margin-top:20px">{{ BetViewDataClass.bet_view_version }} -- {{ BetViewDataClass.bet_order_status }} -- {{ BetViewDataClass.error_code }}</div>

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

.bet-submit{
  width: 100%;
  margin-top: 30px;
  text-align: center;
  background: #000;
  height: 40px;
  line-height: 40px;
  color: #fff;
}
</style>