<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
        <div class="bet-info">
            <div class="f-b-c px-12">
                <div class="f-s-c">
                    <img :src="compute_local_project_file_path('/image/bet/request.svg')" alt="" @click="alertRules(items.seriesValue)">
                    <span class="font14 font500 text-18">{{ items.seriesValue}}</span> 
                    <span class="text-45B0FF ml-4" v-if="items.orderStatusCode == 1">注单已确认</span>
                </div>
                <div class="">
                    <span class="bet-amount-box font700">{{ format_money2(mathJs.divide(items.betAmount,100))}}</span>
                    <span class="left-rx"> x{{ items.seriesSum }} </span>
                </div>
            </div>
        </div>
        <div class="toltal f-b-c">
            <div >
                <span>预计可赢：{{ format_money2(mathJs.divide(items.maxWinAmount,100))}} {{currency_code[UserCtr.currency]}}</span>
            </div>
            <div>
                <span>小计：{{ format_money2(mathJs.divide(items.seriesBetAmount,100))}} {{currency_code[UserCtr.currency]}}</span>
            </div>
        </div>
        <bet-dialog  @close="tooltipbox=false" :item="items" :id="itemid" :tooltipboxs="tooltipbox" v-model="tooltipbox"></bet-dialog>
    </div>
</template>

<script setup> 
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import betDialog from "./bet-dialog.vue"
import {UserCtr,format_money2,LOCAL_PROJECT_FILE_PREFIX,currency_code ,compute_local_project_file_path } from "src/output/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { ref } from "vue"

const props = defineProps({
    items:{
        type: [Object] ,
        default : () => {}
    }
})
const tooltipbox = ref(false)
const itemid = ref()
// 弹出规则
const alertRules = (id) => {
    if(id && id.includes(i18n_t(`app_h5.bet.toltipc`))){
        itemid.value =  id.replace('串','00')
    }else{
        itemid.value =  id
    } 
    tooltipbox.value = !tooltipbox.value
}
</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet-list {
    .bet-content {
        min-height: .76rem;
        padding: .12rem;
        padding-bottom: .06rem;
        font-size: .13rem;
        font-weight: 500;
        font-style: normal;
        position: relative;
        background: var(--q-gb-bg-c-22);
        border-radius: 0.12rem;
        margin-bottom: 0.05rem;
        
        .left{
            font-size: 0.14rem;
            display: flex;
            justify-content: space-between;
            .left-l{
                font-size: 0.14rem;
                font-weight: 500;
                margin-top: 0.04rem;
                .left-l-typ{
                    font-size: 0.12rem;
                    color: var(--q-gb-t-c-1);
                    margin-left: 0.05rem;
                }
            }
            .left-r{
                text-align: right;
                font-weight: 700;
                font-size: 0.2rem;
                
            }
        }
        .right{
            display: flex;
            justify-content: space-between;
            font-size: 0.12rem;
            color: var(--q-gb-t-c-3);
            margin-top: 0.05rem;
            .red{
                color: var(--q-gb-bd-c-8);
            }
        }

        .bet-money {
            height: .34rem;
        }

    }
    
    .bet-info {
        // text-indent: .2rem;
        height: 0.44rem;
        border-radius: .12rem .12rem 0 0;
        background: var(--q-gb-bg-c-22);
        // background: url($SCSSPROJECTPATH + "/image/bet/rules3.svg") no-repeat .12rem / .15rem var(--q-gb-bg-c-22);
        .f-b-c {
            height: 0.44rem;
        }
        .f-a-c {
            color: var(--q-gb-t-c-17);
            display: flex;
        }
        .text-18{
            color:var(--q-gb-t-c-18)
        }
        .bet-amount-box {
            font-size: 0.2rem;
            color: var(--q-gb-t-c-17);
        }
        .left-rx{
            font-size: 0.14rem;
            font-style: normal;
            font-weight: 500;
            color: var(--q-gb-t-c-10);
        }
        .text-45B0FF {
            color: #45B0FF;
        }
    }
    
    .toltal {
        border-top: 1px solid var(--q-gb-bg-c-18);
        background: var(--q-gb-bg-c-22);
        border-radius: 0 0 .12rem .12rem;
        height: 0.24rem;
        line-height: .24rem;
        color: var(--q-gb-t-c-11);
        padding: 0 .12rem;
        margin-bottom: .04rem;
    }
}
</style>