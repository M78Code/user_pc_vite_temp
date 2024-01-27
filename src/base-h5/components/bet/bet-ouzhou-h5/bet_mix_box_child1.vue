<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}-{{items.red_green}}{{UserCtr.user_version}} </div>
    <div class="bet-mix-show">
      <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                  <span class="icon-delete nonebox4-content-left-content-xian" @click.stop="del_bet_options"></span>
                  <div class="nonebox4-content-left-info">
                    <div class="nonebox4-content-left-content-text">
                      <div class="nonebox4-content-left-content-text-one">
                        <div class="nonebox4-content-left-content-text-one-tit">
                          <span class="text-flow-none">{{items.handicap}}  
                            
                            <em v-if="items.handicap_hv" class="ty-span">{{items.handicap_hv}}</em>
                            
                            <span v-if="UserCtr.is_cur_odds(items.odds_hsw)">
                              [{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`) }}]
                            </span>
                            <span v-else>[{{ i18n_t(`odds.EU`) }}]</span>
                          </span> 
                        </div>
                        <div>
                            <div class="nonebox4-content-right" v-if="items.ol_os == 1 && items.hl_hs == 0 && items.mid_mhs == 0">
                              <div class="nonebox4-content-right-profit" :class="{'red-up':items.red_green == 'red_up','green-down':items.red_green == 'green_down'}">
                                {{compute_value_by_cur_odd_type(items.odds,items.playId,items.odds_hsw,items.sportId)}}
                              </div>
                              <div class="show_img">
                                <img v-if="items.red_green == 'red_up'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/icon_up.png`" alt=""/>
                                <img v-if="items.red_green == 'green_down'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/icon_down.png`" alt=""/>
                              </div>
                            </div>
                            <div class="nonebox4-content-right" v-else>
                              <span class="bet-disabled">{{ i18n_t('bet.disabled') }}</span>
                            </div>
                        </div>
                      </div>
                      <div class="nonebox4-content-left-content-text-two">
                       {{items.matchType == 2? '['+i18n_t("bet.bet_inplay")+']' :''}} 
                       <span class="text-two-span">
                        <span>{{items.playName}} </span>
                        {{ items.matchType == 2 && [1,2,3,8,9].includes(items.sportId *1) ? items.mark_score : '' }}
                        </span>
                      </div>

                      <div class="nonebox4-content-left-content-text-three">{{items.tid_name}}</div>
                      <div class="nonebox4-content-left-content-text-three" v-if="items.home">{{items.home}} v {{items.away}} {{items.matchType == 2? items.mark_score : ''}}</div>

                      <div v-if="ref_data.show_appoint" class="bet-odds">
                        <div class="bet-odds-name">赔率</div>
                        <div class="bet-odds-edit">
                          <span class="bet-odds-reduce" @click="btn_reduce_click({odds:ref_data.odds_value_edit})">-</span>
                          <input class="bet-odds-number" type="number" v-model="ref_data.odds_value_edit" />
                          <span class="bet-odds-add" @click="btn_add_click(ref_data.odds_value_edit)">+</span> 
                        </div>
                      </div>
                  
                    </div>

                    <div class="appoint-cursor" v-if="!ref_data.show_appoint && BetData.is_bet_single && BetData.bet_pre_list.includes(items.playOptionsId)" @click="set_show_appoint">
                      +预约
                    </div>
                    
                  </div>
              </div>
          </div>
      </div>
     
    </div>
  </template>
  <script setup>
  import { compute_value_by_cur_odd_type } from "src/output/index.js"
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { btn_reduce, btn_add } from "src/core/bet/common/appoint-data.js"
  import { useMittEmit, MITT_TYPES,LOCAL_PROJECT_FILE_PREFIX,i18n_t ,UserCtr,only_win } from "src/output/index.js";
import { reactive } from "vue";

  const props = defineProps({
    items:{},
    index:{}
  })
  
  const ref_data = reactive({
    show_appoint:false,
    odds_value_edit:""
  })

  const del_bet_options = () =>{
    BetData.set_delete_bet_info(props.items.playOptionsId,props.index)
  }


  const set_show_appoint = () =>{
    ref_data.show_appoint = true
    ref_data.odds_value_edit = props.items.oddFinally
  }

  const btn_reduce_click = (obj)=>{
    obj.min = props.items.oddFinally
    ref_data.odds_value_edit = btn_reduce(obj)
  }


  const  btn_add_click = (odds)=>{
    ref_data.odds_value_edit = btn_add(odds)
}


  </script>
  
  <style lang="scss" scoped>
  .hps_img{
    width: .08rem;
    height: .13rem;
    margin-top: .06rem;
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
    color: var(--q-gb-t-c-1);
    padding-left: 0.08rem;
  }
  .nonebox4-content-left-content-text-one-tit {
    :deep(.ty-span) {
      margin-left: 4px;
      color: var(--q-gb-bg-c-1);
    }
  }

  .appoint-cursor{
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .nonebox4-content-left-content-text-three{
    font-size: 0.16rem;
    color: var(--q-gb-t-c-3);
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  .nonebox4-content-left-content-text-two{
    color: var(--q-gb-t-c-15);
    font-size: 0.16rem;
    margin: .08rem 0;
    font-weight: 500;
    word-break: keep-all;
  }
  .text-two-span{
    color: var(--q-gb-bg-c-4);
    font-weight: 400;
  }
  .nonebox4-content-left-content-text-one{
    color: var(--q-gb-t-c-4);
    font-size: 0.18rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }
  .nonebox4-content-left-info{
    display: flex;
    width: calc(100% - 0.25rem);
  }
  .nonebox4-content{
      width: 100%;
      background: var(--q-gb-bd-c-2);
      padding: 0.05rem 0.15rem;
      padding-right: 0;
      //border-bottom: 1px solid #ccc;
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
      margin-right: 0.16rem;
      margin-top: 0.08rem;
      font-size: 0.12rem;
      &::before{
       font-size: 0.14rem;
      }
  }
  
  .nonebox4-content-left-content-text{
      line-height: 0.25rem;
      margin-top: 0.02rem;
      width: 100%;
  }
  .nonebox4-content-right-profit{
      font-size: 0.2rem;
      font-weight: 700;
      color: var(--q-gb-t-c-4);
      &.red-up{
          color: var(--q-gb-t-c-17);
      }
      &.green-down{
          color: var(--q-gb-t-c-16);
      }
  }
  .nonebox4-content-right{
    display: flex;
    //flex-direction: row-reverse;
    height: 0.26rem;
    list-style: 0.26rem;
    margin-right:0.15rem ;
    
    .show_img{
      display: flex;
      height: 0.26rem;
      align-items: center;
      width: 0.24rem;
      justify-content: center;
      img{
        width: 0.08rem;
      }
    }
    .bet-disabled{
      width: .5rem;
      text-align: center;
      height: .26rem;
      display: inline-block;
      border-radius: 0.02rem;
      background: var(--q-gb-bg-c-19);
      font-size: 0.12rem;
      font-weight: 500;
      letter-spacing: 0px;
      color: var(--q-gb-t-c-3);
      margin-left: .2rem;
    }
  }

  .bet-mix-show{
    position: relative;
  }
  
  .bet-odds{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 38px;
    width: 200px;
    .bet-odds-name{
      font-size: 12px;
      color: var(--qq--yb-text-color4);
    }
    .bet-odds-edit{
      display: flex;
      border: 1px solid #ccc;
      border-radius: 4px;
     
      .bet-odds-reduce{
        padding: 0 14px;
        height: 26px;
        background: var(--q-gb-bg-c-10);
        color: var(--qq--yb-text-color4);
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px 0 0 4px;
      }
      .bet-odds-number{
        width: 70px;
        color: var(--qq--theme-text-color-handicap);
        border: 0.5px solid var(--qq--theme-bd-bet-pre-input);
        background: var(--qq--theme-bg-bet-pre-input);
        height: 26px;
        line-height: 18px;
        display: flex;
        font-size: 12px;
        justify-content: center;
        align-items: center;
        text-align: center;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
        }
        &:focus{
         outline: none;
        }
        
      }
      .bet-odds-add{
        padding: 0 14px;
        height: 26px;
        background: var(--q-gb-bg-c-10);
        color: var(--qq--yb-text-color4);
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0 4px 4px 0 ;
      }
    }
  
  }
  </style>
 