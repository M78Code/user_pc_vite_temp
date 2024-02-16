
<template>
    <div class="bet-list bor-b">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}-{{BetData.bet_data_class_version}}- {{UserCtr.user_version}}</div>
         <!--这个地方是个遮罩层，单关合并只能有一个能预约，其余用遮罩遮住-->
        <div v-if="!is_bet_appoint_disable()" class="cathectic-appoint"></div>

        <div class="f-b-s bet-content" :class="items.ol_os != 1 ? 'bet-disable' : ''">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1 ">
                     <!-- vr 单独处理 -->
                     <div class="text-flow-none" v-if="items.bet_type== 'vr_bet' && ['1002','1011','1009','1010'].includes(items.sportId) && [20033,20034,20035,20036,20037,20038].includes(items.playId*1)">
                        <div v-for="page in items.handicap" :key="page" class="f-s-c">
                            <span class="virtual-count" :class="`virtual-num-${page.hv} csid-${items.sportId}`" ></span> {{page.text}} 
                        </div>
                    </div>
                    <div class="text-flow-none" v-else>{{items.handicap}} <em v-if="items.handicap_hv" class="ty-span">{{items.handicap_hv}}</em></div> 

                </div>
                <div class="w-100 handicap my-4">
                    <span class="mr-4 text-009 text-flow-none" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bowls") + ']'}}</span>
                    <span class="text-a1a text-flow-none mr-4 font400 text-a1a-i">{{ items.playName }}
                        <span>{{items.matchType == 2 && [1,2,3,8,9].includes(items.sportId *1) ? items.mark_score : ''}}</span>
                    </span>
                    <!-- 盘口 -->
                    <span class="text-a1a text-flow-none text-009 font400" v-if="UserCtr.is_cur_odds(items.odds_hsw)">[{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`) }}]</span> 
                    <span class="text-a1a text-flow-none text-009 font400" v-else>[{{ i18n_t(`odds.EU`) }}]</span> 
                </div>
                <div class="w-100 fon12 font400 text-8a8">{{ items.tid_name }}</div>
                <div class="w-100 fon12 font400 text-8a8" v-if="items.home">{{ items.home }} <span class="mx-4">v</span> {{ items.away }} {{ items.matchType == 2? items.mark_score : ''}}
                    <span class="mx-4">({{ items.score_home_away }})</span>
                </div>
            
            </div>
            <div class="fw-c-e-e bet-right" v-if="[1,4].includes(items.ol_os*1) && [0,11].includes(items.hl_hs*1) && [0,11].includes(items.mid_mhs*1)">
                <div class="f-c-c bet-money">
                    <span class="font14 font700 bet-odds-value" :class="{'red-up':items.red_green == 'red_up','green-down':items.red_green == 'green_down'}">
                        @{{ compute_value_by_cur_odd_type(items.odds,items.playId,items.odds_hsw,items.sportId) }}
                    </span>

                    <div class="show_img">
                        <img v-if="items.red_green == 'red_up'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/icon_up.png`" alt=""/>
                        <img v-if="items.red_green == 'green_down'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/icon_down.png`" alt=""/>
                    </div>
                </div>

                <div class="appoint appoint_cursor" v-if="!ref_data.show_appoint && BetData.is_bet_single && BetData.bet_pre_list.includes(items.playOptionsId)" @click="set_show_appoint">
                    +{{ `${i18n_t('bet.bet_book2')}` }}
                </div>
            </div>

            <div class="fw-e-s bet-right bet-invalid" v-else>
                <div class="bet-disabled">
                    <span>{{ i18n_t('bet.bet_invalid') }}</span>
                </div>
            </div>

            <div class="fw-e-s bet-right bet-invalid" v-if="!BetData.is_bet_single && items.is_serial ">
                <div class="bet-serial bet-disabled">
                    <span>不支持串关</span>
                </div>
            </div>

            <div class="bet-delete" v-if="BetViewDataClass.bet_order_status == 1" @click="set_delete">
                <span class="icon-delete"></span>
            </div>

            <div class="bet-delete bet-icon" v-else>
                <!-- 投注确认中 -->
                <img v-if="BetViewDataClass.bet_order_status == 2" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
                <!-- 投注失败 -->
                <img v-if="BetViewDataClass.bet_order_status == 3" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
                <!-- 投注成功 -->
                <img v-if="BetViewDataClass.bet_order_status == 4" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
            </div>
           
        </div>

        <div v-if="ref_data.show_appoint">
            <bet-pro-appoint :item="items" @cancel_operate="cancel_operate" />
        </div>
        
        <div v-if="BetData.is_bet_single">
            <betInput :items="items"></betInput>
        </div>
       
    </div>
</template>

<script setup>

import { reactive, computed } from "vue"
import {LOCAL_PROJECT_FILE_PREFIX,compute_value_by_cur_odd_type,UserCtr } from "src/output/index.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import betInput from "./bet-input.vue"
import { get_query_bet_amount_pre } from "src/core/bet/class/bet-box-submit.js"
import BetProAppoint from "./bet-pre-appoint.vue"
import { set_ref_data } from "src/core/bet/common/appoint-data.js"

const props = defineProps({
    items:{},
    index:{}
})

const ref_data = reactive({
  show_appoint: false, // 是否显示预约 点击预约后其他地方需要显示
})

const set_delete = () => {
    BetData.set_delete_bet_info(props.items.playOptionsId,props.index)
    // 删除后 重新计算是否可以 串关的数据
    if(!BetData.is_bet_single){
        BetData.check_bet_s_list_special()
    }
    // 如果删除的刚好是开启预约的投注项 
    if(props.items.playOptionsId == BetData.bet_pre_appoint_id) {
        BetData.set_is_bet_pre(false)
    }
}

// 预约投注
const set_show_appoint = () =>{
  // 预约投注点击后展示后 需要请求预约限额接口

    get_query_bet_amount_pre()
    ref_data.show_appoint = true
    BetData.set_is_bet_pre(true)
    BetData.set_current_bet_pre_obj(props.items) // 设置当前投注items数据
    set_ref_data(props.items)
    // 设置预约投注id
    BetData.set_bet_appoint_obj_playOptionId(props.items.playOptionsId)

}

const cancel_operate = () =>{
  ref_data.show_appoint = !ref_data.show_appoint
  BetData.set_is_bet_pre(false)
}

const is_bet_appoint_disable = computed(() => state => {
    // 是否进入了预约 是否当前投注项为进入预约的投注项
    if (BetData.is_bet_pre && BetData.bet_pre_appoint_id) {
        return BetData.bet_pre_appoint_id == props.items.playOptionsId
    }
    if(!BetData.is_bet_pre) {
        return true
    }
})

</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet-list {
    position: relative;

    .cathectic-appoint {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
        background: rgba(225,225,225,0.5)
    }
    
    .bet-content {
        min-height: 76px;
        padding: 12px;
        padding-left: 34px;
        font-size: 13px;
        font-weight: 500;
        font-style: normal;
        position: relative;
        &.bet-disable{
            align-items: center;
        }

        .bet-money {
            height: 26px;
        }

        .bet-delete {
            position: absolute;
            top: 11px;
            left: 12px;
            cursor: pointer;
            z-index: 11;

            img {
                width: 12px;
                height: 12px;
            }

            &.bet-icon {
                cursor: auto;
            }
        }

        .bet-odds {
            height: 34px;
        }

        .bet-right {
           // width: 160px;

            .appoint {
                display: flex;
                padding: 5px 10px;
                justify-content: center;
                align-items: center;
                border-radius: 20px;
                border: 0.5px solid var(--q-gb-t-c-16);
                color: var(--q-gb-t-c-16);
                margin-right: 16px;
            }
            .appoint_cursor{
                cursor: pointer;
            }
            &.bet-invalid{
                height: 100%;
                .bet-disabled{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-content: center;
                    align-items: center;
                    span{
                        display: inline-block;
                        padding: 0 12px;
                        height: 26px;
                        display: inline-block;
                        border-radius: 2px;
                        line-height: 26px;
                        background: var(--q-gb-bg-c-10);
                        font-size: 12px;
                        font-weight: 500;
                        letter-spacing: 0px;
                        color: var(--q-gb-t-c-8);
                    }
                    &.bet-serial{
                        span{
                            padding: 0 12px;
                            background: var(--q-gb-bg-c-16);
                            color: var(--q-gb-t-c-7);
                        }
                    }
                }
                
            }
        }

        .bet-left {
            width: 230px;
            .text-a1a-i {
                color: var(--q-gb-t-c-5) !important;
            }
        }

       
    }

    .bet-market{
        font-family: DIN;
        font-size: 13px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        //http://api.sportxxxvo3.com/
    }
    .text-flow{
        max-width: 90%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :deep(.ty-span) {
            margin-left: 4px;
            color: var(--q-gb-t-c-2);
        }
    }
    .handicap{
        max-width: 190px;
    }
    .text-flow-none{
        max-width: 84%;
        line-height: 16px;
        word-wrap: break-word;
        :deep(.ty-span) {
            margin-left: 4px;
            color: var(--q-gb-t-c-2);
        }
    }
    .bet-odds-value{
        color: var(--q-gb-t-c-2);
        margin-right: 7px;
    }
    .red-up{
        color: var(--q-gb-t-c-7);
    }
    .green-down{
        color: var(--q-gb-t-c-6);
    }
    .show_img{
        width:12px;
        padding: 3px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}


</style>