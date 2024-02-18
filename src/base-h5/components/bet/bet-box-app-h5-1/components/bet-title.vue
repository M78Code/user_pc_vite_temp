
<template>
    <div class="bet-bar row justify-between items-center" :class="{ 'fixed-bottom': $route.name != 'matchList'}">
    <div v-show="false">{{ UserCtr.user_version }} {{BetData.bet_data_class_version}}</div>
    <div class="nonebox4-first">
        <div class="nonebox4-first-left">
            <div class="nonebox4-first-left-img">{{BetData.is_bet_single? i18n_t('app_h5.bet.odd') : i18n_t('app_h5.bet.parlay')}}</div>
            <!-- <div class="nonebox4-first-left-text">{{ i18n_t('app_h5.bet.pm_sport') }}</div> -->
        </div>
        <div class="nonebox4-first-right">
            <div class="nonebox4-first-right-window" @click.stop="get_balance">
                <div class="nonebox4-first-right-window-num number_family">{{ format_money2(UserCtr.balance) }}</div>
                <div class="refesh" :class="{ 'refesh2': is_loading_balance }"></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { i18n_t } from "src/boot/i18n.js";
import { format_money2,UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"

let balance_timer = null // 延时器
const is_loading_balance = ref(false) // 金额刷新中？


// 获取用户余额
const get_balance = () => {
  if (is_loading_balance.value) { return };

  is_loading_balance.value = true;
  // 清除延时器
  clearTimeout(balance_timer);
  balance_timer = setTimeout(() => {
    is_loading_balance.value = false;
  }, 800);

  UserCtr.get_balance()
}

</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
.nonebox4-first {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    //padding: 0.12rem ;
}
.nonebox4-first-left {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.nonebox4-first-left-img {
    width: 0.22rem;
    height: 0.22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--q-gb-t-c-14);
    background: var(--q-gb-bg-c-13);
    border-radius: 50%;
}
.nonebox4-first-left-text {
    margin-left: 0.05rem;
    display: flex;
    font-size: .16rem;
    font-weight: 600;
    
    color: var(--q-gb-t-c-18);
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
    background-color: var(--q-gb-bg-c-22);
    padding: .04rem .08rem;
    border-radius: 0.2rem;
    height: 0.28rem;
}
.nonebox4-first-right-window-num {
    display: flex;
    font-size: .2rem;
    font-weight: 700;
    color: var(--q-gb-t-c-18);
}
.nonebox4-first-right-window-img {
    display: flex;
    border-radius: .3rem;
    width: .24rem;
    height: .24rem;
}
.nonebox4-first-right-window-img img {
    border-radius: .3rem;
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
    font-size: .16rem;
    font-weight: 500;
    color: rgba(48, 52, 66, 1);
    margin-left: 0.05rem;
  }
}
.bet-bar {
  width: 100%;
  padding: .12rem 0 .08rem;
  border-radius: 0.16rem 0.16rem 0 0;
  position: relative;

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

// .fixed-bottom {
//   position: fixed;
//   z-index: 400;
//   bottom: -2px;
// }

.bet-num {
  width: 0.2rem;
  line-height: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  padding-top: .01rem;
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
  width: 0.2rem;
  height: 0.2rem;
  background: url( $SCSSPROJECTPATH+"/image/svg/refresh.svg") no-repeat center / 100% 100%;
  // background: var(--q-color-com-img-bg-58) no-repeat center / 100% 100%;
  margin-left: 0.05rem
}

.refesh2 {
  animation: loading-ring-animate 0.5s linear;
}

.arrow {
  transform: scale(-1);
}
</style>