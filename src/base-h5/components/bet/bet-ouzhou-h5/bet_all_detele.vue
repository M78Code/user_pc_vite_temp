<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-all-detele">
    <div class="del-info" @click.stop="clear">
      <span class="icon-delete del-info-icon"></span>
      <div class="del-info-name">{{ i18n_t('bet.delete_all')}}</div>
    </div>
    <div class="bet-type">{{i18n_t('bet.bet')}}</div>
    <div class="del-info" style="display:none">
      <div class="dropdown">
        <button class="dropbtn">{{BetData.is_bet_single?i18n_t('bet.bet'):i18n_t('bet.kushikatsu')}}</button>
        <div class="dropdown-content">
          <a href="#" :class="BetData.is_bet_single?'dropdown-content-che':''" @click.stop="set_is_bet_single(true)">{{i18n_t('bet.bet')}}</a>
          <!-- <a href="#" :class="BetData.is_bet_merge?'dropdown-content-che':''" @click.stop="set_is_bet_merge">{{ i18n_t('bet.single_more') }}</a> -->
          <a href="#" :class="!BetData.is_bet_single?'dropdown-content-che':''" @click.stop="set_is_bet_single(false)">{{i18n_t('bet.kushikatsu')}}</a>
        </div>
      </div>

      <!-- <div class="del-info-dui">√</div> -->
      <span class="icon-sort_settle_time del-info-dui"></span>
    </div>
  </div>
</template>
<script setup>
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { useMittEmit, MITT_TYPES  } from "src/output/index.js";
  const type = 1//1:Betting Type  2:  3:System

  const clear = () =>{
    BetData.set_clear_bet_info()
    useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
  }

  // 单关 串关切换
  const set_is_bet_single = (type) =>{
    BetData.set_is_bet_single()
    useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, type);
  }
  const set_is_bet_merge = () => {
    if(BetData.is_bet_merge){
      BetData.set_is_bet_single()
      useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
    }
    BetData.set_is_bet_merge()
    // useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, type);
  }
</script>

<style lang="scss" scoped>

.dropdown {
  position: relative;
  display: inline-block;
}
 
.dropbtn {
  border: none;
  cursor: pointer;
  background: none;
}
 
.dropdown-content {
  display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    margin-left: -0.7rem;
    width: 1.45rem;
}
 
.dropdown-content a {
  color: var(--q-gb-t-c-12);
    text-decoration: none;
    display: block;
    margin: 0 0.2rem;
    padding: 0.1rem 0;
    border-bottom: 1px solid #999;
    font-size: 0.12rem;
}
.dropdown-content a:last-child {
  border-bottom: none;
}
 
.dropdown:hover .dropdown-content {
  display: block;
}
.dropdown-content-che{
  color: var(--q-gb-t-c-18) !important;
}

    .del-info-dui{
      color: var(--q-gb-t-c-2);
      width: 0.15rem;
      height: 0.15rem;
      background: var(--q-gb-t-c-1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.15rem;
      border-radius: 50%;
      margin-left: 0.12rem;
      margin-top: 0.02rem;
    }
    .del-info-name{
      margin-left: 0.16rem;
      color: var(--q-gb-bg-c-4);
      margin-top: -.03rem;
      font-size: .14rem;
    }
    .del-info-icon{
      color: var(--q-gb-bg-c-4);
      width: 0.12rem;
      height: 0.12rem;
    }
    .del-info{
      display: flex;
      font-size: 0.14rem;
    }
    .bet-type {
      font-weight: 500; 
      font-size: .14rem;
      margin-top: -.03rem;
    }
    .bet-all-detele{
      display: flex;
      justify-content: space-between;
      padding: 0.15rem;
      background: var(--q-gb-bg-c-10);
      height: 0.4rem;
    }
</style>