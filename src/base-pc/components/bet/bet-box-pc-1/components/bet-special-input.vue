<template>
    <div class="bet-mix-input">
        <div class="odds-wrap row">
            <div data-v-c14bfede="" class="line"></div>
            <div class="col bet-mix-info">{{ items.name}}</div>
            <span class="odds-value yb-number-bold" v-if="index==0"> @{{ items.seriesOdds}}</span>
        </div>
            <!--金额输入区域包括键盘 -->
        <div class="row ">
            <!--金额输入区-->
            <div class="bet-input-failure">
                <!--投注金额输入框-->
                <input ref="InputFocus" class="bet-input input-border" v-model="ref_data.money" type="number" @click="show_quick()"  @input="set_win_money" @keydown.enter="keydown($event)"
                :placeholder="`${i18n_t('bet.money_range')} ${format_money3(items.min_money)}~${format_money3(items.max_money)}`" maxLength="11" />
                <!--清除输入金额按钮-->
                <div class="bet-max-btn">X{{ items.count }}</div>
                <div class="bet-input-close" @click.stop="bet_clear_handle" v-if="ref_data.money">
                    <icon-wapper name="icon-failure" size="12px" />
                </div>
            </div>
            <div v-show="false">{{ UserCtr.user_version }}{{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}</div>
            <div v-show="items.show_quick" class="bet-win-key">
                <div class="row bet-win yb-fontsize12">
                    <div class="col df-jb">
                        <!--最高可赢额-->
                        {{ i18n_t('common.maxn_amount_val') }}
                    </div>
                    <!--金额-->
                    <div class="col-auto bet-win-money yb-number-bold"> {{ formatMoney(mathJs.subtract(mathJs.multiply(items.bet_amount,items.seriesOdds), items.bet_amount))  }}  RMB</div>
                </div>

                <!--键盘区域-->
                <div class="row bet-keyboard bet-keyboard-zone">
                    <bet-keyboard :oid="items.id"/>
                </div>
            </div>
        </div>
        
    </div>
    
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue"
import BetKeyboard from "../common/bet-keyboard.vue"
import { IconWapper } from 'src/components/icon'
import lodash_ from 'lodash'
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { format_odds, formatMoney,format_currency, format_currency2,format_money3 } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { UserCtr } from "src/output/index.js"

const props = defineProps({
    items: {},
    index: {
        type: Number,
        default: 0
    },
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
})

const InputFocus = ref()

onMounted(() => {
     // 监听 键盘金额变化
     ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_KEYBOARD, change_money_handle).off,
    }
    ref_data.money = props.items.bet_amount
    show_quick()
    InputFocus.value.focus()
})

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

const change_money_handle = obj => {
    if(props.items.id == obj.id) {
        // 获取当前投注金额
        let money = props.items.bet_amount 
        let money_ = obj.money
        // 设置最大投注金额
        if(obj == "MAX"){
            money_ = props.items.max_money
        }
        let items_obj = lodash_.get(props,'items',{})
        // 计算投注金额
        let money_amount = mathJs.add(money,money_)
        // 投注金额 不能大于最大投注金额 也不能大于用户余额
        if(money_amount < props.items.max_money && money_amount < UserCtr.balance){
            items_obj.bet_amount = mathJs.add(money,money_)
            ref_data.money = mathJs.add(money,money_)
        }else{
            // 最大限额不能大于余额
            money_amount = props.items.max_money
            if(UserCtr.balance < props.items.max_money){
                money_amount = UserCtr.balance
            }
            items_obj.bet_amount = money_amount
            ref_data.money = money_amount
        }
        BetViewDataClass.set_bet_special_series_item(items_obj)
    }
}

// 清空输入框金额
const bet_clear_handle = () => {
    ref_data.money = ''
    BetData.set_bet_amount('')
    BetViewDataClass.set_bet_special_series_item({bet_amount:'',id:props.items.id})
}

// 键盘回车事件
const keydown = (e) => {
    e.preventDefault();
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1){
        submit_handle()
    }
}


// 输入判断
const set_win_money = () => {

    let items_obj = lodash_.get(props,'items',{})
    // 输入控制
    if( ref_data.money < props.items.max_money &&  ref_data.money < UserCtr.balance){
        items_obj.bet_amount = ref_data.money
    }else{
        // 最大限额不能大于余额
        let money_a = props.items.max_money
        if(UserCtr.balance < props.items.max_money){
            money_a = UserCtr.balance
        }
        ref_data.money = money_a
        items_obj.bet_amount = money_a
    }
    BetViewDataClass.set_bet_special_series_item(items_obj)
}
//显示隐藏键盘

const show_quick = () => {
    let list = lodash_.cloneDeep(lodash_.get(BetViewDataClass,'bet_special_series'))
    let id = lodash_.get(props,'items.id','')
    list.filter(item => {
        item.show_quick = false
         // 显示指定投注项的快捷金额按钮
        if(item.id == id){
            item.show_quick = true
        }
    })
    BetViewDataClass.set_bet_special_series(list)
}

</script>

<style scoped lang="scss">
//谷歌
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

//火狐
input[type="number"] {
    -moz-appearance: textfield;
}

/**单关金额输入框**/
.bet-mix-input {
    margin-top: 8px;
    .odds-wrap {
        justify-content: space-between;
        align-items: center;
        .line {
            width: 3px;
            height: 14px; 
            background: var(--q-bet-box-2);
            border-radius: 1.5px 
        }
        .bet-mix-info {
            height: 18px;
            line-height: 20px;
            padding-left: 10px;
            font-size:13px;
            color: #555; 
        }
        .odds-value {
            padding: 2px 3px;
            height: 18px;
            line-height: 16px;
            font-size: 14px;
            color: var(--q-bet-box-2);
            font-weight: 700;
        }
    }
    .bet-input{
        width: 100%;
        padding: 4px 6px;
        margin-top: 2px;
        color: #191c24;
        height: 32px;
        line-height: 18px;
        outline: none;
        background: var(--q-gb-bg-c-11);
        border: 0.5px solid var(--q-gb-bd-c-7);
        border-radius: 6px;
        color: var(--q-gb-t-c-6);
        font-size: 16px;
        caret-color: var(--q-gb-t-c-16);
    }
    .input-border:focus {
        color: var(--qq--yb-text-color4);
        border: 0.5px solid #2883f9;
        border-radius: 6px
    }
    .input-border-red {
        border: 0.5px solid #ff4040!important;
    }
    .bet-input::-webkit-input-placeholder {
        font-size: 14px;
        color: rgba(108,123,168,0.5);
    }
    .bet-input::-moz-placeholder {
        font-size: 14px;
        color: rgba(108,123,168,0.5);
    }
    .bet-input::-ms-input-placeholder {
        font-size: 14px;
        color: rgba(108,123,168,0.5);
    }
    .bet-max-btn {
        position: absolute;
        right: 8px;
        bottom: 6px;
        z-index: 9;
        cursor: pointer;
    }
    .bet-input-close {
        .icon-failure:before {
            color: var(--qq--yb-text-color4);
        }

        &:hover {
            .icon-failure:before {
                color: var(--qq--y0-text-color1);
            }
        }
    }

    .bet-input-close {
        position: absolute;
        top: 7px;
        right: 25px;
        cursor: pointer;
        width: auto;
        height: auto;
    }

    .bet-win-key {
        margin-top: 10px;
        .df-jb {
            font-weight: 600;
        }
    }

    /*  投注键盘区域 */
    .bet-keyboard-zone {
        margin-top: 10px;
        margin-bottom: 10px;
        padding-left: 3px;
        padding-right: 3px
    }
}

.bet-input-failure {
    position: relative;
}
.bet-single-serve{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

</style>