
<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}-{{BetData.bet_data_class_version}}- {{UserCtr.user_version}}</div>
        <!-- 单关 盘口关闭状态 -->
        <!-- {{ items.ol_os }}-{{ items.hl_hs  }}-{{ items.mid_mhs }} -->
        <!-- 投注项状态 1：开 2：封 3：关 4：锁 -->
        <!-- 盘口状态，玩法级别 0：开 1：封 2：关 11：锁 -->
        <!-- 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态） -->
        <div class="handicap-closed" v-if="[2,3].includes(items.ol_os*1) || [1,2].includes(items.hl_hs*1) || [1,2].includes(items.mid_mhs*1)">
            <img :src="compute_local_project_file_path('/image/bet/handicap-closed.png')" alt="">
            <p class="font14">{{ i18n_t('bet.close') }}</p>

            <!--  串关 投注 删除投注项 -->
            <div class="bet-delete" v-if="BetViewDataClass.bet_order_status == 1 && !BetData.is_bet_single" @click="set_delete">
                <img :src="compute_local_project_file_path('/image/svg/delete4.svg')" alt="">
            </div>
        </div>
        <!-- 串关 盘口展示 及 盘口关闭状态 -->
        <div v-else class="f-b-s bet-content" :class="[
                items.is_serial && !BetData.is_bet_single ? 'not-chain-bet' : '',
            ]">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c font14 font500">
                    <!-- vr 单独处理 -->
                    <div class="text-flow-none" v-if="items.bet_type== 'vr_bet' && ['1002','1011','1009','1010'].includes(items.sportId) && [20033,20034,20035,20036,20037,20038].includes(items.playId*1)">
                        <div v-for="page in items.handicap" :key="page" class="f-s-c">
                            <span class="virtual-count" :class="`virtual-num-${page.hv} csid-${items.sportId}`" ></span> {{page.text}} 
                        </div>
                    </div>
                    
                    <div class="text-flow-none" v-else>{{items.handicap}} <em v-if="items.handicap_hv && !items.is_guanjun" class="ty-span">{{items.handicap_hv}}</em></div> 
                </div>
                <div class="my-left">
                    <div class="w-100 handicap">
                        <span class="mr-4 text-009 text-flow-none" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bet_inplay") + ']'}}</span>
                        <span class="text-a1a text-flow-none mr-4 font400">{{ items.playName }}
                            <span v-if="items.sportId == 1">{{items.matchType == 2? items.mark_score : ''}}</span>
                        </span>
                        <!-- 盘口 -->
                        <span class="text-a1a text-flow-none text-009 font400" v-if="UserCtr.is_cur_odds(items.odds_hsw)">[{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`) }}] </span> 
                        <span class="text-a1a text-flow-none text-009 font400" v-else>[{{ i18n_t(`odds.EU`) }}]</span> 
                    </div>
                    <div class="w-100 fon12 font400 mt-4" v-if="items.home">{{ items.home }} <span class="mx-4">v</span> {{ items.away }} {{ items.matchType == 2 && items.sportId == 1 ? items.mark_score : ''}}
                    </div>
                    <div class="w-100 fon12 font400 mt-4" v-if="BetData.is_bet_single">{{ items.tid_name }}</div>
                </div>
            </div>
            
            <div class="fw-e-s bet-right" :class="{'width100': items.is_serial && !BetData.is_bet_single}" >
                <div class="f-c-c bet-money">
                    <span class="font14 font700 bet-odds-value f-c-c" :class="{'red-up':items.red_green == 'red_up','green-down':items.red_green == 'green_down'}">
                       <span class="font14">@</span>
                       <em class="number_family">{{ compute_value_by_cur_odd_type(items.odds,items.playId,items.odds_hsw,items.sportId) }}</em>
                    </span>

                    <div class="show_img" v-if="items.red_green">
                        <img v-if="items.red_green == 'red_up'" :src="is_up_app" alt=""/>
                        <img v-if="items.red_green == 'green_down'" :src="is_down_app" alt=""/>
                    </div>
                </div>
                <!-- 锁盘状态下 提示 赔率已变更  -->
                <div v-if="items.ol_os == 4 || items.hl_hs == 11 || items.mid_mhs == 11" :class="items.red_green" class="bet-serial font12">赔率已变更</div>
                <!-- 电子赛事不支持串关 -->
                <div v-if="items.is_serial && !BetData.is_bet_single" class="bet-serial font12">不支持串关投注</div>
            </div>

            <!-- <div class="fw-e-s bet-right bet-invalid" v-else>
                <div class="bet-disabled">
                    <span>{{ i18n_t('bet.close') }}</span>
                </div>
            </div> -->

            <div v-if="items.is_serial && !BetData.is_bet_single" class="bet-layer-serial"></div>

            <!--  串关 投注 删除投注项 -->
            <div class="bet-delete" v-if="BetViewDataClass.bet_order_status == 1 && !BetData.is_bet_single" @click="set_delete">
                <img :src="compute_local_project_file_path('/image/svg/delete4.svg')" alt="">
            </div>
          
        </div>
        
        <div v-if="BetData.is_bet_single">
            <!-- 输入框 -->
            <bet-single-input :item="items"></bet-single-input>
        </div>
       
    </div>
</template>

<script setup>

import {LOCAL_PROJECT_FILE_PREFIX,compute_local_project_file_path,compute_value_by_cur_odd_type,useMittOn,MITT_TYPES,useMittEmit,UserCtr,i18n_t,formatMoney } from "src/output/index.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { is_up_app, is_down_app } from 'src/base-h5/core/utils/local-image.js'
import betSingleInput from "./bet-single-input.vue"
import { watch } from "vue";

const props = defineProps({
    items:{
        default: () => {},
    },
    index:{}
})

const set_delete = () => {
    BetData.set_delete_bet_info(props.items.playOptionsId,props.index)
}
// 修改bug 54961 同测试沟通 要求在锁盘 hs = 11 时 提示弹出框 赔率更新中
// 为不影响其他版本 估写watch于此处
watch(
  () => props.items,
  (val) => {
    // console.log('！！！这里！！！', val)
    if (val.mid_mhs == 11 || val.hl_hs == 11 || val.ol_os == 4) {
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.odd_upd')}`);
    }
  }
);


</script>

<style scoped lang="scss">
@import "../css/bet.scss";
@import "../css/vr-bet.scss";
</style>

<style scoped lang="scss">
.font22{
    font-size: 0.2rem;
}
.bet-list {
   
    .bet-content {
        min-height: .76rem;
        padding: 0.12rem;
        margin-bottom: .04rem;
        //padding-left: .34rem;
        font-size: .13rem;
        font-weight: 500;
        font-style: normal;
        position: relative;
        background: var(--q-gb-bg-c-22);
       // margin-top: .1rem;
        border-radius: 0.12rem;
        color: var(--q-gb-t-c-18);
        &.bet-disable{
            align-items: center;
        }

        &.not-chain-bet {
            background-color: var(--q-gb-bg-c-38);
        }

        .bet-money {
            height: .34rem;
            margin-bottom: .06rem;
        }

        .bet-odds {
            height: .34rem;
        }

        .bet-right {
            width: 0.9rem;
            display: flex;
            flex-wrap: wrap;

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
                        // padding: 0 .2rem;
                        height: .26rem;
                        display: inline-block;
                        border-radius: .02rem;
                        line-height: .26rem;
                        // background: var(--q-gb-bg-c-10);
                        font-size: .12rem;
                        font-weight: 500;
                        letter-spacing: 0;
                        color: #949AB6;
                    }
                }
            }
            &.width100 {
                width: 1rem;
            }
        }

        .bet-left {
            width: 2.70rem;
            .my-left{
                padding-left: 0.04rem;
                border-left: 2px solid var(--q-gb-bg-c-13);
                margin-top: 0.06rem;
                color: var(--q-gb-t-c-11);
                font-size: 0.12rem;
            }
        }

        .bet-serial {
            color: var(--q-gb-bd-c-2);
        }

        .bet-layer-serial{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--q-gb-bg-c-21);
            opacity: 0.5;
            z-index: 80;
        }
       
    }

    .bet-delete {
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        width: 0.3rem;
        height: 0.2rem;
        background-color: var(--q-gb-bg-c-19);
        border-radius: .16rem 0 .12rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;

        img {
            width: .1rem;
            height: .1rem;
        }

        &.bet-icon {
            cursor: auto;
        }
    }

    .bet-market{
        font-size: .13rem;
        font-weight: 500;
        line-height: .16rem;
        letter-spacing: 0;
        //http://api.sportxxxvo3.com/
    }
    .text-flow{
        max-width: 90%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :deep(.ty-span) {
            margin-left: .04rem;
            //color: var(--q-gb-t-c-2);
        }
    }
    .handicap{
        max-width: 1.90rem;
    }
    .text-flow-none{
        max-width: 84%;
        line-height: .16rem;
        word-wrap: break-word;
        :deep(.ty-span) {
            margin-left: .04rem;
            //color: var(--q-gb-t-c-2);
        }
    }
    .bet-odds-change{
        width: 100%;
        &.red_up{
            color:#F53F3F;
        }
        &.green_down{
            color: #00B42A
        }
    }
    .bet-odds-value{
       
        font-size: .22rem;
    }
    .show_img{
        width: .10rem;
        margin-left: .02rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
.handicap-closed {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--q-gb-bd-c-6);
    border-radius: 0.12rem;
    color: var(--q-gb-t-c-10);
    padding: .12rem;
    position: relative;
    img {
        width: 0.74rem;
        height: 0.74rem;
    }
}

.red-up{
    color:#F53F3F;
}
.green-down{
    color: #00B42A
}
</style>