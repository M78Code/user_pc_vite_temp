

<template>
    <div v-if="(!BetData.is_bet_single && BetData.bet_s_list.length >1) || BetData.is_bet_single">
        <div class="px-12 bet-money" >
            <div class="f-b-c pl-18 bet-input-info">
                <div>
                    <div class="font14">{{i18n_t('bet.bet_one_')}}</div>
                    <div class="font12 h12">
                        <span class="font400 mr-10 text-8A8986-i"> {{ i18n_t('common.maxn_amount_val') }}</span>
                        <span class="text-8A8986-i font500" >
                            {{ bet_win_money() }}
                        </span>
                    </div>
                </div>
        
                <div class="input-border">  
                    <input class="bet-input" v-model="ref_data.money" type="text" @input="set_win_money" @click="show_quick_amount(true)" @focus="stop_drap_fn(false)" @blur="stop_drap_fn(true)" @keydown.enter="keydown($event)"
                    :placeholder="placeholder" maxLength="11"  />
                    <img class="del_btn_money" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/delete-input.svg`" @click="del_btn_money()" alt="" />

                </div>
            
            </div>
            <div v-show="false">{{ UserCtr.user_version }}--{{BetData.bet_data_class_version}}--{{BetViewDataClass.bet_view_version}}</div>
        </div>
        <div>
            <ul class="bet-bet-money f-b-c" v-show="items.ol_os == 1">
                <li class="bet-money-li f-c-c font14" @click="set_bet_money(obj)" v-for="(obj, index) in ref_data.money_list" :key="obj" :class="bet_money_btn_class(obj, index)" >
                    {{index == 'max' ? '' : '+' }}{{obj}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup> 
import { reactive,onMounted,onUnmounted,computed } from "vue"
import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { compute_value_by_cur_odd_type,useMittOn,MITT_TYPES,UserCtr,formatMoney, format_money3 ,format_money2,LOCAL_PROJECT_FILE_PREFIX} from "src/output/index.js"
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { ref_pre_book } from "src/core/bet/common/appoint-data.js"
import { odds_table } from "src/core/constant/common/module/csid.js"

const props = defineProps({
    items:{},
})

const ref_data = reactive({
    min_money: '', // 最小投注金额
    max_money: '', // 最大投注金额
    win_money: 0.00, // 最高可赢
    money: '', // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    seriesOdds: '', // 赔率
    show_quick: false, // 显示快捷金额
    emit_lsit: {},
    show_money: true,
})

// 复式连串过关投注
const special_series = reactive({
  id: '',
  name: '',
  count: "",
})

// 开启/停止拖拽
const stop_drap_fn = (state) => {
    let obj = {
        ...BetData.bet_box_draggable,
        draggable: state
    }
    BetData.set_bet_box_draggable(obj)

}

onMounted(() => {
    // 刷新后有问题 
    // set_ref_data_bet_money()
    show_quick_amount(true)
    // // 单关 单注可以默认展开
    // if(BetData.is_bet_single && !BetData.is_bet_merge){
    //     show_quick_amount(true)
    // }

    ref_data.money = props.items.bet_amount || ''
      // 监听 限额变化
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
        emitter_2: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY_UPDATE, set_ref_data_bet_money_update).off,
    }
})

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

// 快捷金额 显示隐藏
const set_show_quick_money = (obj = {}) => {
    ref_data.show_money = obj.show
    obj.money_list.max = 'MAX'
    ref_data.money_list = obj.money_list
    ref_data.max_money = obj.max_money
}


// 判断快捷金额按钮是否可点击
const bet_money_btn_class = (obj, index) => {
    let className = '';
    if(ref_data.max_money > 0) {
        // if(index === 'max') obj = UserCtr.balance
        const lastAmount = mathJs.subtract(UserCtr.balance, props.items.bet_amount)
        if(index != 'max' && (ref_data.max_money < obj || ref_data.max_money < props.items.bet_amount || UserCtr.balance < obj) || obj > lastAmount) {
            className = 'disabled'
        }
        
    }
    return className;
}
const del_btn_money = () => {
    ref_data.money = null
    BetData.set_bet_obj_amount(null,props.items.playOptionsId)
    BetData.set_bet_amount(null)
}
// 快捷金额
const set_bet_money = obj => {
    // 获取当前投注金额
    let money = props.items.bet_amount
    let money_ = obj
    // 设置最大投注金额
    if(obj == "MAX"){
        money_ = ref_data.max_money
    }
    // 计算投注金额
    let money_amount = mathJs.add(money,money_)
    // 投注金额 不能大于最大投注金额 也不能大于用户余额
    if(money_amount < ref_data.max_money && money_amount < UserCtr.balance){
        BetData.set_bet_obj_amount(mathJs.add(money,money_),props.items.playOptionsId)
        ref_data.money = money_amount
    }else{
        // 最大限额不能大于余额
        let money_a = ref_data.max_money
        if(UserCtr.balance < ref_data.max_money){
            money_a = UserCtr.balance
        }  
        BetData.set_bet_obj_amount(money_a,props.items.playOptionsId)

        ref_data.money = money_a
    }
    
}

// 键盘回车事件
const keydown = (e) => {
    e.preventDefault();
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1){
        submit_handle()
    }
}

// 输入金额数据更新
const set_ref_data_bet_money_update = () => {
    ref_data.money = props.items.bet_amount || ''
}

// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
    let value = props.items.playOptionsId
    // 串关获取 复试连串
    if (!BetData.is_bet_single) {

        // 复式连串关投注
        const { id, name, count } = lodash_.get(BetViewDataClass.bet_special_series, `[${props.index}]`, {}) 
        special_series.id = id
        special_series.name = name
        special_series.count = count
        // 串关 type
        value = id
    }
  
    const { min_money = 10, max_money = 8888, seriesOdds } = lodash_.get(BetViewDataClass.bet_min_max_money, `${value}`, {})
 
    // 最小限额
    ref_data.min_money = min_money
    // 最大限额
    ref_data.max_money = max_money
    // 复试串关赔率
    ref_data.seriesOdds = seriesOdds
    // 限额改变 重置投注金额
    ref_data.money = props.items.bet_amount || ''

    if(ref_data.show_quick){
        show_quick_amount(ref_data.show_quick)
    }
}

// 输入判断
const set_win_money = () => {
    ref_data.money = Number(ref_data.money) ? Number(ref_data.money) : ''
    // 输入控制
    if( ref_data.money < ref_data.max_money &&  ref_data.money < UserCtr.balance){
        BetData.set_bet_obj_amount(ref_data.money,props.items.playOptionsId)
    }else{
        // 最大限额不能大于余额
        let money_a = ref_data.max_money
        if(UserCtr.balance < ref_data.max_money){
            money_a = UserCtr.balance
        }
        ref_data.money = money_a || ''
        BetData.set_bet_obj_amount(money_a,props.items.playOptionsId)
    }
}

// 快捷金额 state true   false
const show_quick_amount = state => {
    ref_data.show_quick = state
    let money_list = []
    if(state){
        if (BetData.bet_is_single) {
           money_list = lodash.get(UserCtr, 'cvo.series', { qon: 10, qtw: 50, qth: 100, qfo: 200 })
        } else {
           money_list = lodash.get(UserCtr, 'cvo.single', { qon: 100, qtw: 500, qth: 1000, qfo: 2000 })
        }
    }
    let obj = {
        show: state,    
        money_list,
        max_money: ref_data.max_money,
    }
    set_show_quick_money(obj)
}

const placeholder = computed(() => {
   
        return `${i18n_t('bet.money_range')} ${ref_data.min_money ? format_money3(ref_data.min_money):''}~${ref_data.max_money ? format_money3(ref_data.max_money) : ''}`
   
})


const bet_win_money = computed(()=> status => {
  // 获取单关投注的数据
  let { bet_amount ='', oddFinally = '', odds_hsw = '',odds,playId,sportId } = lodash_.get(props,'items',{})
  let bet_win = bet_amount
  oddFinally = compute_value_by_cur_odd_type(odds,playId,odds_hsw,sportId)
  // 香港赔 不用减去投注金额
  if(odds_hsw.includes(odds_table[UserCtr.odds.cur_odds]) && UserCtr.odds.cur_odds == 'HK' ){
    bet_win = 0
  }
  // 预约投注 赔率
  if(BetData.is_bet_pre){
    oddFinally = ref_pre_book.appoint_odds_value
  }
  // 计算出可赢金额
  return format_money2(mathJs.subtract(mathJs.multiply(bet_amount,oddFinally), bet_win)) 
})


</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">


.bet-bet-money {
    width: 100%;
    padding: 10px 12px;
    background: var(--q-gb-bg-c-15);
    border-top: 1px solid var(--q-gb-bd-c-6);

    .bet-money-li {
        width: 76px;
        height: 30px;
        border: 0.5px solid var(--q-gb-bd-c-5);
        background: var(--q-gb-bg-c-4);
        color: #505050;
        border-radius: 2px;
        transition: .3s;
        cursor: pointer;

        &:hover {
            // border: 1px solid #FF7000;
            border: 1px solid var(--q-gb-bd-c-1);
        }
        &.disabled{
            background: var(--q-gb-bg-c-19);
            pointer-events: none;
        }
    }
}

.bet-money{
    background: var(--q-gb-bg-c-15);
    .bet-input-info{
        height: 58px;
        .input-border{
            position: relative;
        }
        .del_btn_money{
            position: absolute;
            top: calc(50% - 6px);
            right: 10px;
        }
    }
    .text-8A8986-i {
        color: var(--q-gb-t-c-8) !important
    }
}
.bet-input-focus{
    position: relative;
    background: var(--q-gb-bg-c-18);
    transition: .3s;
}
.bet-input{
    width: 160px;
    height: 34px;
    background: none;
    border: 0.5px solid var(--q-gb-bd-c-5);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 0 0 0 8px;
    display: flex;
    align-items: center;
    transition: .3s;
    caret-color:var(--q-gb-t-c-2) ;
     
    &:focus,&:focus-visible{
        transition: .02s;
        outline: none;   
       // padding-left: 14px;
        border: 0.5px solid var(--q-gb-bd-c-1);
        box-shadow: 0px 1px 4px rgba(255, 112, 0, 0.1);
        background: var(--q-gb-bg-c-18);
    }
    &::-webkit-input-placeholder {/*Chrome/Safari*/
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: var(--q-gb-t-c-8);
    }
    &::-moz-placeholder {/*Firefox*/
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: var(--q-gb-t-c-8);
    }
    &::-ms-input-placeholder {/*IE*/
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: var(--q-gb-t-c-8);
    }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>