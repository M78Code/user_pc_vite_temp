
<template>
  <div class="keyboard-zone background-color-bet-box">
    <div class="keyboard-btn" v-for="(item, index) in ref_data.user_max_min_money" :key="index" @click="set_click_keybord(item)" 
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
import { onMounted, reactive } from "vue"
import { UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"


const props = defineProps({
  oid: 0
})

const ref_data = reactive({
  user_max_min_money:{}
})

onMounted(()=>{
  let arr = []
  if (BetData.bet_is_single) {
    arr = lodash.get(UserCtr, 'cvo.series', { qon: 10, qtw: 50, qth: 100, qfo: 200 })
  } else {
    arr = lodash.get(UserCtr, 'cvo.single', { qon: 100, qtw: 500, qth: 1000, qfo: 2000 })
  }
  // 添加max按钮
  ref_data.user_max_min_money = Object.assign(arr, {max: 'MAX'})
  BetData.set_bet_keyboard_config(Object.assign(BetData.bet_keyboard_config, {ids: props.oid}))
})


// 快捷金额
const set_click_keybord = obj => {
  let  money = obj
  if(obj === 'MAX') {
    UserCtr.balance < obj ? money = UserCtr.balance : money = obj
  }
  let keyboard = { money: money, ids: props.oid }
  console.log('-----------------------------------------------------------------', keyboard, props)
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
  }
  
}


/*  按键间距设置 */
// .big_keyboard-btn {
//   margin-right: 10px;
// }
</style>