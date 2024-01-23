

<!--
 * @Author: lamp
 * @Description: 投注栏收起后的底部条
-->
<template>
  <!-- 头部 -->
  <div class="bet-bar row justify-between items-center" @touchmove.prevent @click="menu_click"
    :class="{ 'fixed-bottom': $route.name != 'matchList' && get_bet_status == 0 }">
    <div v-show="false">{{ BetData.bet_data_class_version }} {{BetViewDataClass.bet_view_version}}-{{BetData.is_bet_single}}-{{BetData.is_bet_merge}}</div>
    <div class="nonebox4-first">
        <div class="nonebox4-first-left">
            <div class="nonebox4-first-left-img">{{BetData.is_bet_single ? BetData.bet_single_list.length : BetData.bet_s_list.length}}</div>
            <div class="nonebox4-first-left-text">{{i18n_t("bet.bet_record")}}</div>
        </div>
        <div class="nonebox4-first-right">
            <div class="nonebox4-first-right-window">
                <div class="nonebox4-first-right-window-num">{{ format_money2(userData.balance) }}</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import lodash from "lodash"
import { format_money2 } from 'src/output/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { ref,computed,onUnmounted } from 'vue';
import userData from "src/core/user-config/user-ctr.js"
import { get_query_bet_amount_common,set_market_id_to_ws } from "src/core/bet/class/bet-box-submit.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";


const get_bet_status = ref(true)

// 悬浮条点击 
const menu_click = () => {
  // get_query_bet_amount_common()
  // set_market_id_to_ws()
  
  BetData.set_bet_state_show(true)

}



</script>


<style lang="scss" scoped>
.nonebox4-first {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.02rem 0;
}
.nonebox4-first-left {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.nonebox4-first-left-img {
    display: flex;
    width: 0.24rem;
    height: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--q-gb-t-c-2);
    background: var(--q-gb-bg-c-1);
    border-radius: 50%;
}
.nonebox4-first-left-text {
    margin-left: 0.08rem;
    display: flex;
    font-size: 0.16rem;
    color: var(--q-gb-t-c-2);
    font-weight: 500;
}
.nonebox4-first-right {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
}
.nonebox4-first-right-window {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 3px;
    padding-left: 10px;
    border-radius: 30px;
}
.nonebox4-first-right-window-num {
    display: flex;
    font-size: 18px;
    font-weight: 500;
    margin-right: -0.03rem;
    color: var(--q-gb-t-c-1);
    font-family: DIN;
}
.nonebox4-first-right-window-img {
    display: flex;
    border-radius: 30px;
    width: 24px;
    height: 24px;
}
.nonebox4-first-right-window-img img {
    border-radius: 30px;
    width: 100%;
    height: 100%;
}



.yb-right{
  display: flex;
  padding: 0.01rem 0.02rem 0.01rem 0.06rem;
  border-radius: 0.2rem;
  background: red;
}
.yb-left{
  display: flex;
  width: 100%;
  .yb-left-tag{
    background: linear-gradient(0deg, #179CFF, #179CFF);
    linear-gradient: (0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2));
    border: 2.4rem solid rgba(255, 255, 255, 0.2);
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 50%;
    border: 2.4rem;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yb-left-title{
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
    color: rgba(48, 52, 66, 1);
    margin-left: 0.05rem;
  }
}
.bet-bar {
  width: 100%;
  height: 0.54rem;
  border-width: 1px 1px 0 1px;
  //border-style: solid;
  position: relative;
  background: var(--q-gb-bg-c-12);
  padding: 0 0.15rem !important;
  border-top: 3px solid var(--q-gb-bg-c-1);

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    right: 0.48rem;
    transform: translateY(-50%);
    width: 1px;
    height: 0.2rem;
    border-radius: 0.5px;
    background: rgba(0, 0, 0, 0.1);
  }

  .odds-wrapper {
    display: inline-flex;
    align-items: center;

    .odds {
      margin-left: 0.04rem;
    }
  }

  img {
    width: 0.12rem;
    height: 0.12rem;
    opacity: 0.7;
  }
}

.fixed-bottom {
  position: fixed;
  z-index: 400;
  bottom: -2px;
}

.bet-num {
  width: 0.2rem;
  line-height: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  padding-top: 1px;
  text-align: center;
  font-size: 0.14rem;
  border-radius: 100%;
  display: inline-block;
}

.account-p {
  font-size: 0.11rem;
  margin-bottom: -0.04rem;
}

// 刷新按钮
@keyframes loading-ring-animate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.refesh {
  width: 0.13rem;
  height: 0.13rem;
  background: url( $SCSSPROJECTPATH+"/image/bet/shuaxin.svg") no-repeat center / 100% 100%;
  // background: var(--q-color-com-img-bg-58) no-repeat center / 100% 100%;
  margin-left: 0.05rem
}

.refesh2 {
  animation: loading-ring-animate 0.5s linear;
}

.arrow {
  transform: scale(-1);
}</style>
src/core/format/common/module/format-money.js