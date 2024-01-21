

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetViewDataClass.bet_view_version}}</div>
  <div class="bet_single_info f-b-c">
    <div class="alert-rules">
      <div class="item-left font14 font500">
        {{ items.name }} x{{ items.count }}
        <span class="multiple-text" v-if="index == 0">@{{items.seriesOdds }}</span>
      </div>
     <div class="font14">
      <span class="font400 item-left-btm">最高可赢</span>
      <span v-if="items.seriesOdds">
        <em class="total-money number_family font500" > {{ formatMoney(mathJs.subtract(mathJs.multiply(items.bet_amount,items.seriesOdds), items.bet_amount)) }}</em>
      </span>
      <span v-else><em class="number_family font500">0.00</em> </span>
    </div>
    </div>
    
    <div class="bet_single_detail f-b-c">
      <div class="content-b" @click="input_click">
        <span v-if="ref_data.money" class="yb_fontsize20 money-number">{{ ref_data.money }}</span>
        <span class="yb_fontsize14 limit-txt" v-show="!ref_data.money">{{ i18n_t('app_h5.bet.limit')}}<em class="number_family">{{ items.min_money }}-{{ format_money3(items.max_money) }}</em></span>
        <span class="money-span" ref="money_span" v-if="items.show_quick" :style="{ opacity: '1' }"></span>
      </div>
    </div>
  </div>
  <div>
  </div>
</template>

<script setup> 
import { reactive,onMounted,onUnmounted,ref, computed } from "vue"
import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { UserCtr,formatMoney,format_money2,currency_code, compute_local_project_file_path, format_money3 } from "src/output/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'

const props = defineProps({
    items:{},
    index:{}
})
const emits = defineEmits(['input_click'])

let flicker_timer = null
let money_span = ref('')

const ref_data = reactive({
    min_money: '', // 最小投注金额
    max_money: '', // 最大投注金额
    win_money: 0.00, // 最高可赢
    money: '', // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    seriesOdds: '', // 赔率
    show_quick: false, // 显示快捷金额
    emit_lsit: {},
    show_money_span:false,
    add_num: {} // 快捷金额
})

const tooltipbox = ref(false)
const itemid = ref()

onMounted(() => {
  ref_data.money = props.items.bet_amount
  //监听键盘金额改变事件
  ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).off,
  }
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
 const change_money_handle = (new_money) => {
  if(props.items.id == new_money.params.id){
    if( new_money.money*1 > props.items.max_money *1){
      ref_data.money =  props.items.max_money
    }else{
      ref_data.money = new_money.money
    }
    BetData.set_bet_amount(ref_data.money)
    set_special_series('edit',new_money.params.id)
  }
}

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

/**
 *@description 光标闪动，animation有兼容问题，用函数替代
 *@return {Undefined} undefined
 */
 const cursor_flashing = () => {
  clearInterval(flicker_timer)
  flicker_timer = setInterval(() => {
    money_span.value && money_span.value.classList.toggle('money-span3')
  }, 700);
}

// 修改数据内容
const set_special_series = (money,ty_id) => {
  let list = lodash_.cloneDeep(lodash_.get(BetViewDataClass,'bet_special_series'))
  // 键盘输入会传修改的数据id
  let id = ty_id ? ty_id : lodash_.get(props,'items.id','')
  list.filter(item => {
    item.show_quick = false
      // 显示指定投注项的快捷金额按钮
    if(item.id == id){
        item.show_quick = true
        if(money == 'edit'){
          item.bet_amount = ref_data.money
        }
        
    }
  })
  BetViewDataClass.set_bet_special_series(list)
}
/**
 *@description 金额输入框点击
 *@param {Undefined}
 *@return {Undefined} undefined
 */
 const input_click = (evnet) => {
  event.preventDefault()
  set_special_series()
  BetData.set_bet_keyboard_show(true)

  cursor_flashing()

  // 串关 设置键盘需要设置当前的金额
  BetData.set_bet_amount(ref_data.money)
  BetData.set_bet_keyboard_config(props.items)
  emits("input_click",event)
  add_or_remove_active(evnet)
}

// 获取商户配置的 快捷金额
const addnum = computed(()=> {
  if (BetData.is_bet_single) {
    const { qon,qtw,qth,qfo,qfi } = lodash.get(UserCtr, 'user_info.cvo.single', { qon: 200, qtw: 500, qth: 1000, qfo: 2000, qfi: 5000 })  
    ref_data.add_num = {qon,qtw,qth,qfo,qfi} 
    return ref_data.add_num
  } else {
    const {qtw,qth,qfo,qfi,qsi } = lodash.get(UserCtr, 'user_info.cvo.series', {  qtw: 50, qth: 100, qfo: 200, qfi: 500, qsi: 1000 })
    ref_data.add_num = { qtw,qth,qfo,qfi,qsi}
    return ref_data.add_num
  }
})

// 添加或去掉active选中框
const add_or_remove_active = (e) => {
  let dom = document.querySelectorAll('.nonebox4-fourth-a-son');
  for(let i = 0; i < dom.length; i++) {
    dom[i].classList.remove('active')
  }
  // 选中输入框时判断当前金额是否是快捷金额中的其中一个，是就在对应的快捷金额上加选中状态
  let flag = Object.values(addnum.value).some((item) => item === (+e.target.innerText));
  if(flag) {
    let index = Object.values(addnum.value).findIndex((item) => item === (+e.target.innerText));
    dom[index].classList.add('active')
  }
}

// 弹出规则
const alertRules = (id) => {
  itemid.value = id
  tooltipbox.value = !tooltipbox.value
}

</script>

<style scoped lang="scss">
@import "./css/bet.scss";
</style>

<style scoped lang="scss">
  .bet_single_info{
    width: 100%;
    height: 0.68rem;
    //margin-left: .08rem;
    padding: 0 .12rem;
    border-bottom: 1px solid var(--q-gb-bd-c-17);
    background: var(--q-gb-bg-c-10);
    .item-left-btm{
      margin-right: 0.04rem;
      color: var(--q-gb-t-c-3);
      font-size: 14px;
    }
    .item-odds{
      color: var(--q-gb-t-c-1);
      font-size: 20px;
      font-weight: 700;
    }
    .item-left{
      display: flex;
      align-items: center;
      color: var(--q-gb-t-c-4);
      font-size: 16px;
      .multiple-text{
        color: var(--q-gb-t-c-1);
        font-size: 0.2rem;
        font-weight: 700;
        text-transform: capitalize;
        margin-left: 0.08rem;
      }
    }
  }
  .bet_single_detail{
    //margin-top: 0.08rem;
    height: 0.44rem;
    //width: 1.68rem;
    font-size: 0.14rem;
  }

  /* ************** 右边内容 ************** -S */
  .content-b {
    height: 0.44rem;
    min-width: 1.52rem;
    padding-left: 0.16rem;
    border-radius: 0.08rem;
    font-size: 0.16rem;
    overflow: hidden;
    //padding-left: 0.1rem;
    position: relative;
    display: flex;
    align-items: center;
    padding-right: 0.1rem;
    background: var(--q-gb-bg-c-25);
    margin-left: 0.05rem;
    border-radius: 2px;
    border: 0.5px solid var(--q-gb-bd-c-12);
    background: var(--q-gb-bg-c-2);
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
    .limit-txt {
      color: #8A8986;
      //font-size: 0.16rem;
    }
    &:hover {
      border-color: var(--q-gb-t-c-1);
    }
  }
  /* ************** 右边内容 ************** -E */
  .set-opacity {
    opacity: 0.2;
    pointer-events: none;
  }
  .money-number {
    margin-top: .01rem;
    font-weight: 700;
  }
  .money-span {
    width: 0.02rem;
    height: 0.16rem;
    margin: 0 .01rem;
    background: var(--q-gb-t-c-1);
    &.money-span3{
      background: transparent;
    }
  }
  .money-close {
    position: absolute;
    top: 50%;
    right: 0.08rem;
    width: 0.15rem;
    height: 0.15rem;
    line-height: 0.15rem;
    text-align: center;
    margin-top: -0.09rem;
    background: gray;
    color: #FFFFFF;
    border-radius: 50%;
    font-size: .13rem;
  }
  /* ************** 左边内容 ************** -S */
  .content-t {
    padding-left: 0.12rem;
    margin-right: auto;
  
    p:nth-child(1) {
      position: relative;
  
      &::after {
        content: "";
        width: .03rem;
        height: 0.12rem;
        border-radius: .02rem;
        position: absolute;
        left: -0.08rem;
        top: 50%;
        transform: translateY(-58%);
      }
    }
  
    p:nth-child(2) {
      font-size: 0.11rem;
      line-height: 0.14rem;
    }
  }

</style>