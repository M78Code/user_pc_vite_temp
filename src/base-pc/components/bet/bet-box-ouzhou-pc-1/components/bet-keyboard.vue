
<template>
  <div class="keyboard-zone background-color-bet-box">
    <div class="keyboard-btn" v-for="(item, index) in BetData.user_max_min_money" :key="index" @click="set_click_keybord(item)" 
     :class="bet_money_btn_class(item, index)">
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
import { onMounted, reactive, watch } from "vue"
import { UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"


const props = defineProps({
  oid: 0,
  max_money: 0
})

const ref_data = reactive({
  user_max_min_money:{},
  max_money: 8888
})

onMounted(()=>{
  BetData.set_user_max_min_money()
  delete BetData.user_max_min_money?.qfi
  BetData.set_bet_keyboard_config(Object.assign(BetData.bet_keyboard_config, {ids: props.oid}))
  ref_data.max_money = props.max_money
})

watch(
  () => props.max_money,
  (val) => {
    ref_data.max_money = val
  }
);

// 判断快捷金额按钮是否可点击
const bet_money_btn_class = (obj, index) => {
    let className = '';
    if(ref_data.max_money > 0) {
        if(index === 'max') obj = UserCtr.balance
        if(ref_data.max_money < obj || UserCtr.balance < obj) {
            className = 'disabled'
        }
        
    }
    return className;
}


// 快捷金额
const set_click_keybord = obj => {
  let  money = obj
  if(obj === 'MAX') {
    UserCtr.balance < obj ? money = UserCtr.balance : money = obj
  }
  let keyboard = { money: money, ids: props.oid }
  useMittEmit(MITT_TYPES.EMIT_INPUT_BET_MONEY_KEYBOARD, keyboard)
}


</script>



<style lang="scss" scoped>
.background-color-bet-box {
    background: var(--q-gb-bg-c-15);
}

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
  padding: 10px 12px;
}

.is_big_vedio {
  justify-content: initial;
}

/*  键盘按钮样式 */
.keyboard-btn {
  width: 76px;
  height: 30px;
  border: 0.5px solid var(--q-gb-bd-c-5);
  background: var(--q-gb-bg-c-4);
  color: #505050;
  border-radius: 2px;
  transition: .3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .14rem;

  &:hover {
      // border: 1px solid #FF7000;
      border: 1px solid var(--q-gb-bd-c-1);
  }
  &.disabled{
      background: var(--q-gb-bg-c-19);
      pointer-events: none;
  }
  
}


/*  按键间距设置 */
// .big_keyboard-btn {
//   margin-right: 10px;
// }
</style>