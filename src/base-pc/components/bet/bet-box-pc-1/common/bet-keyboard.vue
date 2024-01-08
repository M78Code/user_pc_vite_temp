
<template>
  <div class="q-gutter-xs keyboard-zone">
    <div class="keyboard-btn" v-for="(item, index) in BetData.user_max_min_money" :key="index" @click="set_click_keybord(item)" 
    :class="{'disable-key-btn disabled': item > UserCtr.balance}">
      <!--键盘按键文本显示 如果无效则置灰 以及MAX按钮文本显示-->
      <div class="keyboard-btn-text">
        <template v-if="item != 'MAX'">+</template>{{ item }}
      </div>
    </div>
    <div v-show="false">{{ UserCtr.user_version }}{{BetData.bet_data_class_version}}</div>
  </div>
</template>

<script setup>
// 公共主题文件引入
import { onMounted } from "vue"
import { UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"


const props = defineProps({
  oid:0
})

onMounted(()=>{
  // 添加max按钮
  BetData.user_max_min_money = Object.assign(BetData.user_max_min_money, {max: 'MAX'})
  BetData.set_bet_keyboard_config('',props.oid)
})


// 快捷金额
const set_click_keybord = obj => {
  let  money = obj
  if(obj === 'MAX') {
    UserCtr.balance < obj ? money = UserCtr.balance : money = obj
  }
  let keyboard = { money: money, id: props.oid }
  useMittEmit(MITT_TYPES.EMIT_INPUT_BET_MONEY_KEYBOARD, keyboard)
}


</script>



<style lang="scss" scoped>
 /*  键盘按钮之间的间距 */
 .bet-keyboard-content {
  margin-left: 10px !important;
  margin-right: 12px !important;
}
/*  键盘区域样式设置 */
.keyboard-zone {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.is_big_vedio {
  justify-content: initial;
}

/*  键盘按钮样式 */
.keyboard-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 58px;
  height: 26px;
  margin-bottom: 2px;
  margin-left: 0px;
  margin-right: -2px;
  /*  键盘文本前面加号的样式 */
  .keyboard-btn-add {
    margin-right: 20px;
  }
  .text-disabled {
    color: rgba(108,123,168,0.5);
  }
  /*  按钮文字样式 */
  .keyboard-btn-text {
    line-height: 24px;
  }
  
}


/*  按键间距设置 */
.big_keyboard-btn {
  margin-right: 10px;
}
</style>
<style lang="scss" scoped>
@import "../css/bet_keyword.scss";
</style>