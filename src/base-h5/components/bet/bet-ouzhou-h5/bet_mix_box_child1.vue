<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}-{{items.red_green}}-{{UserCtr.user_version}} </div>
    <div class="bet-mix-show">
      <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                  <span class="icon-delete nonebox4-content-left-content-xian" @click.stop="del_bet_options"></span>
                  <div class="nonebox4-content-left-info">
                    <div class="nonebox4-content-left-content-text">
                       <!-- {{ items.ol_os }}-{{ items.hl_hs  }}-{{ items.mid_mhs }} -->
                      <div class="nonebox4-content-left-content-text-one">
                        <div class="nonebox4-content-left-content-text-one-tit">
                          <!-- vr 单独处理 222-->
                          <div class="text-flow-none" v-if="items.bet_type== 'vr_bet' && ['1002','1011','1009','1010'].includes(items.sportId) && [20033,20034,20035,20036,20037,20038].includes(items.playId*1)">
                            <div v-for="page in items.handicap" :key="page" class="f-s-c">
                              <span class="virtual-count" :class="`virtual-num-${page.hv} csid-${items.sportId}`" ></span> {{page.text}} 
                            </div>
                          </div>
                          <div class="text-flow-none" v-else>{{items.handicap}} <em v-if="items.handicap_hv" class="ty-span">{{items.handicap_hv}}</em></div> 

                          <span v-if="UserCtr.is_cur_odds(items.odds_hsw)">
                            [{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`) }}]
                          </span>
                          <span v-else>[{{ i18n_t(`odds.EU`) }}]</span>
                        </div>
                        <div class="nonebox4-content-right" v-if="items.is_serial && !BetData.is_bet_single">
                          <span class="bet-disabled">{{ i18n_t('bet.invalidation2') }}</span>
                        </div>
                        <div v-else>
                            <div class="nonebox4-content-right" v-if="!([2,3].includes(items.ol_os*1) || [1,2].includes(items.hl_hs*1) || [1,2].includes(items.mid_mhs*1))">
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
                        <span>{{items.playName}} <span v-if="ref_data.show_appoint" class="has-book">[{{i18n_t('pre_record.book')}}]</span>
                        </span>
                        {{ items.matchType == 2 && [1,2,3,8,9].includes(items.sportId *1) ? items.mark_score : '' }}
                        </span>
                      </div>

                      <div class="nonebox4-content-left-content-text-three">{{items.tid_name}}</div>
                      <div class="nonebox4-content-left-content-text-three" v-if="items.home">{{items.home}} v {{items.away}} {{items.matchType == 2? items.mark_score : ''}}</div>

                      <div v-if="ref_data.show_appoint" class="bet-odds">
                        <div class="bet-appoint-box" v-if="items.marketValue">
                          <!-- 盘口 -->
                          <div class="bet-odds-name">{{i18n_t('pre_record.handicap')}}</div>
                          <div class="bet-odds-edit">
                            <span class="bet-odds-reduce" :class="{begray:ref_pre_book.appoint_ball_value <= 0}" v-touch-repeat:0:300.mouse.enter.space="() => {sub_handle(items)}">-</span>
                            <bet-input-info3 :items="items" :readonly="items.sportId == 1" :valueModel="ref_pre_book.appoint_ball_value" :index="'pre_handicap' + index"></bet-input-info3>
                            <span class="bet-odds-add" :class="{begray:ref_pre_book.appoint_ball_value >= check_ball_maxmin(items)}" v-touch-repeat:0:300.mouse.enter.space="() => {add_handle(items)}">+</span> 
                          </div>
                        </div>                    
                        <div class="bet-appoint-box">
                          <!-- 赔率 -->
                          <div class="bet-odds-name">{{i18n_t('pre_record.odds')}}</div>
                          <div class="bet-odds-edit">
                            <span class="bet-odds-reduce" :class="{begray:ref_pre_book.appoint_odds_value == ref_pre_book.min_odds_value}" v-touch-repeat:0:300.mouse.enter.space="() => {btn_reduce(items)}">-</span>
                            <bet-input-info3 :items="items" :valueModel="ref_pre_book.appoint_odds_value" :index="'pre_odds' + index"></bet-input-info3>
                            <span class="bet-odds-add" :class="{begray:ref_pre_book.appoint_odds_value >= 355}" v-touch-repeat:0:300.mouse.enter.space="() => {btn_add(items)}">+</span> 
                          </div>
                          <span class="delete-appoint icon-delete" @click="set_no_show_appoint()"></span>
                        </div>
                      </div>
                    </div>

                    <div class="appoint-cursor" v-if="!ref_data.show_appoint && BetData.is_bet_single && BetData.bet_pre_list.includes(items.playOptionsId)" @click="set_show_appoint">
                     +{{i18n_t('pre_record.book')}}
                    </div>
                    
                  </div>
              </div>
          </div>
      </div>
     
    </div>
  </template>
  <script setup>
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { btn_reduce, btn_add, ref_pre_book,add_handle,sub_handle,set_ref_data } from "src/core/bet/common/appoint-data.js"
  import { LOCAL_PROJECT_FILE_PREFIX,i18n_t ,MARKET_RANG_FLAG_LIST,UserCtr,compute_value_by_cur_odd_type } from "src/output/index.js";
  import { get_query_bet_amount_pre } from "src/core/bet/class/bet-box-submit.js"
  import betInputInfo3 from "./bet_input_info3.vue";
  import { reactive, watch } from "vue";

  const props = defineProps({
    items:{},
    index:{}
  })
  
  const ref_data = reactive({
    show_appoint: false,
    odds_value_edit: "",
    ball_value_edit: ""
  })
  
  // 投注项变更后 重置预约编辑
  watch(()=> props.items.playOptionsId ,()=>{
    ref_data.show_appoint = false
  })

  // 删除投注项
  const del_bet_options = () =>{
    BetData.set_delete_bet_info(props.items.playOptionsId,props.index)
  }

  //
  const check_ball_maxmin = (_item) =>{
    if(MARKET_RANG_FLAG_LIST.includes(_item.playId)){
      return 10
    }else{
      return 30
    }
  }

  // 显示预约投注
  const set_show_appoint = () =>{
    get_query_bet_amount_pre()
    ref_data.show_appoint = true
    ref_data.odds_value_edit = props.items.oddFinally
    BetData.set_is_bet_pre(true)
    BetData.set_current_bet_pre_obj(props.items) // 设置当前投注items数据
    set_ref_data(props.items)
    // 设置预约投注id
    BetData.set_bet_appoint_obj_playOptionId(props.items.playOptionsId)
  }

  const set_no_show_appoint = () => {
    ref_data.show_appoint = false
    BetData.set_is_bet_pre(false)
    BetData.set_current_bet_pre_obj({})
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
    display: flex;
    :deep(.ty-span) {
      margin-left: 4px;
      color: var(--q-gb-bg-c-1);
    }
  }

  .appoint-cursor{
    position: absolute;
    top: 0.78rem;
    right: 0.2rem;
    border-radius: 0.2rem;
    padding: 0 .1rem;
    border: 0.5px solid var(--q-gb-bd-c-16);
    color: var(--q-gb-t-c-1);
    text-align: center;
    cursor: pointer;
    line-height: .24rem;
  }
  .nonebox4-content-left-content-text-three{
    font-size: 0.16rem;
    color: var(--q-gb-t-c-3);
    width: 78%;
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

    .has-book{
      color: var(--q-gb-bg-c-1);
    }
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
      padding: 0.05rem 0rem .1rem 0.40rem;
      position: relative;
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
      position: absolute;
      color: var(--q-gb-t-c-4);
      margin-right: 0.16rem;
      left: .15rem;
      top: .16rem;
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
      color: var(--q-gb-t-c-1);
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
    //margin-right:0.15rem ;
    
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
      text-align: center;
      height: .26rem;
      display: inline-block;
      border-radius: 0.02rem;
      background: var(--q-gb-bg-c-19);
      font-size: 0.12rem;
      padding: 0 .1rem;
      font-weight: 500;
      letter-spacing: 0px;
      color: var(--q-gb-t-c-3);
      margin-left: .2rem;
    }
  }

  .bet-appoint-box{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .bet-mix-show{
    position: relative;
  }
  .delete-appoint{
    margin-left: 0.08rem;
  }
  .bet-odds{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .28rem;
    margin-top: .13rem;
    margin-left: -.3rem;
    width: calc(100% + .4rem);
    .bet-odds-name{
      font-size: .12rem;
      color: var(--qq--yb-text-color4);
      margin-right: 0.08rem;
      white-space: nowrap;
    }
    .bet-odds-edit{
      display: flex;
      border: 1px solid #ccc;
      border-radius: 4px;
      .begray{
        color: #E4E4E4!important;
      }
      .bet-odds-reduce{
        padding: 0 .14rem;
        height: .28rem;
        width: .24rem;
        background: var(--q-gb-bg-c-10);
        color: var(--qq--yb-text-color4);
        font-size: .16rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: .04rem 0 0 .04rem;
      }
      .bet-odds-number{
        width: .52rem;
        color: var(--qq--theme-text-color-handicap);
        border: 0.5px solid var(--qq--theme-bd-bet-pre-input);
        background: var(--qq--theme-bg-bet-pre-input);
        height: .28rem;
        line-height: .18rem;
        display: flex;
        font-size: .12rem;
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
        padding: 0 .14rem;
        width: .24rem;
        height: .28rem;
        background: var(--q-gb-bg-c-10);
        color: var(--qq--yb-text-color4);
        font-size: .16rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0 .04rem .04rem 0 ;
      }
    }
  
  }

  .text-flow-none {
    margin-right: 0.1rem;
  }
  </style>
 