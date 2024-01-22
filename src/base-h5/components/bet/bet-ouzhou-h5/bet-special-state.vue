<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
          <!-- 备注123 -->
        <div class="info-top row items-center justify-between">
            <p class="left-text"><span>{{items.seriesValue}}  x{{ items.seriesSum }} </span></p>
            <p class="right-text" v-if="items.orderStatusCode == 1">注单已确认</p>
        </div>
    </div>
</template>

<script setup> 
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import {UserCtr,format_money2,LOCAL_PROJECT_FILE_PREFIX,currency_code ,compute_local_project_file_path } from "src/output/index.js"
import { ref } from "vue"

const props = defineProps({
    items:{
        type: [Object] ,
        default : () => {}
    }
})

</script>

<style scoped lang="scss">
@import "./css/bet.scss";
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
  .info-top{
    width: 100%;
    height:0.56rem ;
    padding: 0.12rem;
    background: var(--q-gb-t-c-10);
    .left-text{
      font-size: 0.18rem;
      span{
        font-weight: 500;
        color: var(--q-gb-t-c-4);
      }
      :nth-child(2){
        font-weight: 700;
        color: var(--q-gb-t-c-1);
        margin-left: 0.07rem;
      }
  }
  .right-text{
    color: var(--q-gb-t-c-1);
    font-size: 16px;
    font-weight: 500;
    text-transform: capitalize;
  }
  }
</style>