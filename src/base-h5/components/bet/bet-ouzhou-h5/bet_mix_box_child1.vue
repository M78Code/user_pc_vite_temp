<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
      <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                  <span class="icon-delete nonebox4-content-left-content-xian" @click.stop="del"></span>
                  <div class="nonebox4-content-left-info">
                    <div class="nonebox4-content-left-content-text">
                      <div class="nonebox4-content-left-content-text-one"><div class="nonebox4-content-left-content-text-one-tit">{{items.handicap?items.handicap:items.home}}</div> 
                      <span class="text-one-span">{{ items.marketValue }}</span></div>
                      <div class="nonebox4-content-left-content-text-two">{{items.matchType == 2?'[In-play]':''}} <span class="text-two-span">{{items.playName}}</span></div>
                      <div class="nonebox4-content-left-content-text-three">{{items.home}} v {{items.away}}</div>
                    </div>
                    <div>
                        <div class="nonebox4-content-right">
                            
                            <div class="nonebox4-content-right-profit">{{compute_value_by_cur_odd_type(items.odds,'','',items.sportId)}}</div>
                        </div>
                    </div>
                    <!-- 绿升icon -->
                    <img class="hps_img" src="/ouzhou-h5/image/list/down.png" alt="" v-if="items.red_green == 'red_down'">
                    <!-- 红降icon -->
                    <img class="hps_img" src="/ouzhou-h5/image/list/up.png" alt="" v-else>

                    <!--红色箭头-->
                      <!-- <div class="top" style="display:none">
                        <div class="jiantou one"></div>
                        <div class="jiantou two"></div>
                        <div class="jiantou three"></div>
                      </div> -->
                      <!--绿色箭头-->
                      <!-- <div class="top" style="display:none">
                        <div class="jiantou onegreen"></div>
                        <div class="jiantou twogreen"></div>
                        <div class="jiantou threegreen"></div>
                      </div> -->
                  </div>
              </div>
          </div>
      </div>
     
    </div>
  </template>
  <script setup>
  import { compute_value_by_cur_odd_type } from "src/core/index.js"
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { useMittEmit, MITT_TYPES  } from "src/core/index.js";

  const props = defineProps({
    items:{}
  })

  const type = 2;//1:不涨也不少    2：增长     3：减少
  const del=()=>{
    BetData.bet_list_remove(0)
    BetData.set_clear_bet_info()
    useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
  }
  </script>
  
  <style lang="scss" scoped>
  .hps_img{
    width: 9px;
    height: 18px;
    margin-top: 6px;
    transform: rotate(180deg);
  }
  .jiantou{
    width: 0;
    height: 0;
    border: 5px solid;
    position: relative;
  }
  .one{
    border-color: rgba(255, 70, 70, .3) transparent transparent transparent;
  }
  .two{
    border-color: rgba(255, 70, 70, .6) transparent transparent transparent;
  }
  .three{
    border-color: rgba(255, 70, 70, 1) transparent transparent transparent;
  }
  .onegreen{
    border-color: rgba(23, 164, 20, 1) transparent transparent transparent;
  }
  .twogreen{
    border-color: rgba(23, 164, 20, .6) transparent transparent transparent;
  }
  .threegreen{
    border-color: rgba(23, 164, 20, .3) transparent transparent transparent;
  }
  .jiantou::after{
    content: "";
    position: absolute;
    top: -11px;
    left: -9px;
    border: 9px solid;
    border-color: white transparent transparent transparent;
  }
  .content-right-duo{
    display: inline-block;
    background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
    width: 0.14rem;
    height: 0.2rem;
    margin-top: 0.05rem;
  }
  .content-right-shao{
    display: inline-block;
    background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
    width: 0.14rem;
    height: 0.2rem;
    margin-top: 0.05rem;
  }
  .text-one-span{
    color: var(--q-gb-t-c-18);
    padding-left: 0.08rem;
  }
  .nonebox4-content-left-content-text-three{
    font-size: 0.13rem;
    color: var(--q-gb-t-c-3);
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  .nonebox4-content-left-content-text-two{
    color: var(--q-gb-t-c-15);
    font-size: 0.13rem;
  }
  .text-two-span{
    color: var(--q-gb-t-c-3);
    font-weight: 400;
  }
  .nonebox4-content-left-content-text-one{
    color: var(--q-gb-t-c-4);
    font-size: 0.15rem;
    font-weight: 600;
    display: flex;
  }
  .nonebox4-content-left-info{
    display: flex;
    justify-content: space-between;
    width: calc(100% - 0.25rem);
  }
  .nonebox4-content{
      width: 100%;
      background: var(--q-gb-bd-c-2);
      padding: 10px;
      padding: 0.05rem 0.15rem;
  }
  .nonebox4-content-left-title{
      font-size: 13px;
      color: var(--q-gb-t-c-13);
  }
  .nonebox4-content-left-content{
      min-height: 70px;
      display: flex;
      margin-top: 5px;
      width: 100%;
  }
  .nonebox4-content-left-content-xian{
      color: var(--q-gb-t-c-4);
      font-size: 0.12rem;
      width: 0.1rem;
      margin-right: 0.15rem;
      margin-top: 0.06rem;
  }
  .nonebox4-content-left-content-text{
      line-height: 0.25rem;
      margin-top: 0.02rem;
      width: calc(100% - 0.85rem);
  }
  .nonebox4-content-right-profit{
      font-size: 0.2rem;
      font-weight: bold;
      color: var(--q-gb-t-c-1);
      padding: 0 0.15rem;
  }
  .nonebox4-content-right{
    display: flex;
    flex-direction: row-reverse;
  }
  </style>
  