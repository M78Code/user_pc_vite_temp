
<template>
  <div class="q-gutter-xs keyboard-zone bet-keyboard-content">
    <div class="keyboard-btn " v-for="(item, index) in ref_data.keyboard_data" :key="index" @click="set_click_keybord(item)">
      <!--键盘按键文本显示 如果无效则置灰 以及MAX按钮文本显示-->
      <div class="keyboard-btn-text" :class="{ 'text-disable': item.disabled }">
        <template v-if="item != 'MAX'">+</template>{{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
// 公共主题文件引入
import { onMounted, reactive, ref } from "vue"
import { UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"

const ref_data = reactive({
  // 键盘数据以及默认键盘数据
  keyboard_data: [],
})

onMounted(()=>{
  addnum()
})

// 获取商户配置的 快捷金额
const addnum = () => {
  if (BetData.is_bet_single) {
    const { qon,qtw,qth,qfo,qfi } = lodash.get(UserCtr, 'user_info.cvo.single', { qon: 200, qtw: 500, qth: 1000, qfo: 2000, qfi: 5000 })  
    ref_data.keyboard_data = {qon,qtw,qth,qfo,qfi,max:'MAX'} 
  } else {
    const {qtw,qth,qfo,qfi,qsi } = lodash.get(UserCtr, 'user_info.cvo.series', {  qtw: 50, qth: 100, qfo: 200, qfi: 500, qsi: 1000 })
    ref_data.keyboard_data = { qtw,qth,qfo,qfi,qsi,max:'MAX'}
  }
}

// 快捷金额
const set_click_keybord = obj => {
  // 快捷金额 max 使用限额最大金额作为投注金额
  let key_board_obj = lodash.get(BetData,'bet_keyboard_config',{})
  let money = ''
  if (obj == 'MAX') {
      money = key_board_obj.max_money
  } else {
    // 投注金额 = 快捷金额 加上 原有的投注金额
    let max_money = money * 1 + obj
    // 投注金额 大于 最大投注限额 则 使用最大限额作为投注金额
    if (max_money > key_board_obj.max_money) {
        money = key_board_obj.max_money
    } else {
        money = max_money
    }
    // 记录投注金额 单关 不合并
    BetData.set_bet_amount(money)
  }
  let keyboard = { params:key_board_obj, money: money }
  useMittEmit(MITT_TYPES.EMIT_INPUT_BET_MONEY_KEYBOARD,keyboard)
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