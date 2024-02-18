<!--
 * @Author: 
 * @Date: 2022-08-26 16:56:56
 * @Description: 聊天室中晒单列表
-->
<template>
    <div class="bet-saidan-list" :class="{'basketball-height':get_match_details_params.sportId == '2'}">
      
      <div class="header">
          <div class="left"></div>
          <tab :list="tabs" is_show_line :currentIndex="currentIndex" @onclick="on_switch"></tab>
          <div class="right-span" @click="clear_handler">
            <span>{{ i18n_t('sandan.btn') }}</span>
            <i class="icon-arrow q-icon c-icon" size="14px"></i>
          </div>
      </div>
      <span class="span flex justify-center">{{ i18n_t('sandan.title') }}</span>
       <!--确认中转圈圈-->
       <div class="loading-wrap" v-if="show_loading">
                <div class="img-loading"></div>
                <div class="text-center loading-text flex items-end justify-center">
                  {{i18n_t('common.loading') + '...'}}
                  <!-- 内容加载中... -->
                </div>
        </div>
        <div v-else>
          <div class="bet-list-content" v-if="bet_records.length>0">
          <scroll ref="myScroll" :on-pull="onPull">
            <div
                v-for="(item, key) in bet_records"
                :key="key"
                class="show-bet-wrapper"
                :class="{'is-select':select_arr.includes(key), }"
                @click="click_select(key)"
                >
                <!-- 'is-saidan': item.isSaidan -->
                <div 
                class="head_name">
                  <img class="img-style" v-img="([lodash.get(item, 'detailList[0].tournamentPic')])"  alt />
                  <div>{{ lodash.get(item, 'detailList[0].matchName') }}</div>
                </div>
                <div class="content-middle"
                    :class="{'content-middle-is-saidan':item.isSaidan}"
                >
                  <div class="item-top flex">
                    <div class="home-vs-away">
                        {{ lodash.get(item, 'detailList[0].matchInfo') }}
                    </div>
                    <div>
                      <!-- <span class="middle-span">08/23</span>
                      <span>03:00</span> -->
                      <span v-if="!item.acCode" class="middle-span">{{(new Date(format_time_zone_time(+ lodash.get(item, 'detailList[0].beginTime')))).Format('MM/dd hh:mm')}}</span>
                    </div>
                  </div>
                  <div class="item-middle">
                            <div class="item-row">
                              <div class="item-row-left item-bet-handicap">
                                
                                {{match_type(lodash.get(item, 'detailList[0].matchType'), lang)}}{{ lodash.get(item, 'detailList[0].playName') }}
                                [{{ handicap_name(lodash.get(item, 'detailList[0].marketType'), lang) }}]
                              </div>
                            </div>
                            <div class="item-row">
                              <div class="item-row-left item-bet-name">
                                <template v-if="lodash.get(item, 'detailList[0].playOptionName','  ').includes('  ')">
                                  <span class="part1">{{ lodash.get(item, 'detailList[0].playOptionName').split('  ')[0] }}</span>
                                  <span class="part2">{{ lodash.get(item, 'detailList[0].playOptionName').split('  ')[1] }}</span>
                                </template>
                                <template v-else>
                                  {{ lodash.get(item, 'detailList[0].playOptionName') }}
                                </template>
                              </div>
                               <!-- 已结算状态，赢|输 -->
                              <div class="item-row-suc" :class="[get_class(item)]">{{calc_text(item)}}</div>
                            </div>
                            <div class="item-row">
                              <div class="item-row-left item-bet-odds">
                                @ {{ lodash.get(item, 'detailList[0].oddFinally') | format_odds}}
                              </div>
                          
                            </div>
                  </div>
          
                  
                  <div class="item-bottom">
                    <div class="flex">
                      <div class="item-row-left">
                        <template v-if="item.orderStatus == 1 || item.orderStatus == 2 || item.orderStatus == 4 || item.orderStatus == 0">
                          <span>{{ i18n_t('common.bets_val') }}:</span>
                          <span v-if=" lodash.get(item, 'detailList[0].backAmount')">{{ lodash.get(item, 'detailList[0].backAmount') | format_currency }}</span>
                          <span v-else>{{lodash.get(item, 'orderAmountTotal')}}</span>
                        </template>
                        <template v-else>
                          <span>{{ i18n_t('common.bets_val') }}:</span>
                          <!-- 留空处理 -->
                          <span v-if="item.acCode">- -</span>
                          <!-- 最高金额 -->
                          <span v-else>{{item.maxWinAmount | format_money2}}</span>
                        </template>
                      </div>
                      <!-- 最高可赢||返还金额 -->
                      <div class="item-row-rght">
                        <span>{{item.orderStatus == 1 ?i18n_t('common.donate_win') :i18n_t('common.maxn_amount_val') }}:</span>
                        <span v-if="item.orderStatus != 1">{{ item.maxWinAmount | format_currency }}</span>
                        <span v-else>{{ item.backAmount | format_currency }}</span>
                      </div>   
                    </div>
                  </div>
                </div>
                <div class="content-bottom flex">
                    <div class="bottom-left">
                      <span>注单号:</span><span> {{ lodash.get(item, 'orderNo') }}</span>
                      <span
                          class="follow-heart"
                          @click="copy(lodash.get(item, 'orderNo'))"
                        >
                          <icon name="icon-icon_copy"/>
                        </span>
                    </div>
                    <div class="bottom-right">
                      <span>投注时间:</span> 
                      <!-- <span>{{(new Date(format_time_zone_time(+data.betTime))).Format(i18n_t('time4'))}}</span>MM/dd hh:mm -->
                      <span>{{(new Date(format_time_zone_time( +lodash.get(item, 'betTime') ))).Format('MM/dd hh:mm')}}</span>
                      <!-- <span>08/20</span><span>17:28</span> -->
                    </div>
                </div>
            </div>
          </scroll>
        </div>
      <div v-else class="load-data-wrap row justify-center">
        <no-data
        :msg="i18n_t('common.empty_data')"
        :marginBottom="'0px'"
        class="empty-wrap"
        width="280px"
        height="280px"
        :color="color"
        :class="{filter_img:$store.state.filter.open_select_time}"
      >
      </no-data>
      </div>

        </div>
      <div class="btn-footer">
        <div class="clear-btn" @click="clear_select_handler">
          <span 
          class="text" 
          :class="{'is-clear-unclick':is_clear_unclick}"
          >{{ i18n_t('sandan.clean') }}</span>
        </div>
        <div 
        class="saidan-btn"
        :class="{'is-saidan-unclick':is_saidan_unclick}"
        @click="saidan_handler()"
        >{{ i18n_t('sandan.saidan') }}</div>
      </div> 
       <!--复制样式 已复制-->
    <div class="toast fit-center" v-if="toast">{{i18n_t("bet_record.copyed")}}</div>
  </div>
</template>
<script>
import saidan_list from 'src/project/yabo/components/match_details/panel/saidan/saidan_list'
import scroll from 'src/project/yabo/components/match_details/panel/saidan/scroll.vue'
import tab from "src/public/components/tab/tab.vue"
import no_data from "src/public/components/no_data/no_data";
export default {
   mixins: [saidan_list],
   components:{
     'scroll':scroll,
     "no-data": no_data,
     tab
   }
}
</script>
<style scoped lang="scss">
/**聊天室中晒单列表*/
.bet-saidan-list {
    top:0;
    position: absolute;
    width: 100%;
    z-index: 100;
    height: 720px;
    overflow:visible;
    /**border:1px solid gray;**/
    border-radius: 8px 8px 0 0;
    /**头部*/
    .item-top {
    height: 28px;
    padding: 7px 0 7px 14px;
    justify-content: space-between;
    /**主客队名称*/
    
    .home-vs-away {
      font-size: 14px;
      color: #2D2D2D;
      line-height: 14px;
      font-weight: 600;
      &::before {
        content: '';
        width: 2px;
        height: 12px;
        display: inline-block;
        margin-right: 5px;
        border-radius: 1.5px;
        vertical-align: middle;
      }
    }
    /**中间文本*/
    .middle-span {
      font-size: 12px;
      color: #2D2D2D;
      text-align: right;
      line-height: 12px;
      font-weight: 400;
      margin-right: 15px;
    }
  }
  /**晒单列表内容*/
  .bet-list-content {
    height: 614px;
    overflow: scroll;
    width: 103%;
  }

  .show-bet-wrapper {
    border-radius: 6px 6px 6px 6px;
    margin:0 20px;
    margin-bottom: 10px;
    .item-top {
      &::before {
        background: var(--q-gb-bg-c-1);
      }
    }
    /**中间内容*/
    .content-middle{
      padding-bottom: 10px
    }
    /**内容底部*/
    .content-bottom{
      height: 28px;
      line-height: 28px;
      justify-content: space-between;
      border-radius: 0px 0px 8px 8px;
      font-size: 12px;
      /**底部左边*/
      .bottom-left{
        /**花的图标样式*/
        .follow-heart{
          margin-left: 5px;
          cursor: pointer;
        }
        /**第一个文本*/
        span:first-child{
          
          margin: 5px;
          line-height: 12px;
          font-weight: 400;
        }

      }
      /**底部右边*/
      .bottom-right{
        margin-right: 10px;
        /**右边文本*/
        span{
          margin-right: 10px;
        }
        /**右边文本第一个*/
        span:first-child{
          font-size: 12px;
          line-height: 12px;
          font-weight: 400;
        }
      }
    }
    /**结算部分样式*/
    .item-settlemented {   
      /**赢图标样式*/   
      .win {
        background: var(--qq--theme-bg-win);
        border: 1px solid var(--qq--theme-bd-win);
        color: var(--q-gb-t-c-1);
      }
      /**输图标样式*/   
      .lose {
        background: var(--qq--theme-bg-lose);
        border: 1px solid var(--qq--theme-bd-lose);
        color: var(--q-gb-t-c-1);
      }
    }
    .head_name {
      display: flex;
      height: 28px;
      
      
      border-radius: 6px 6px 0px 0px;
      align-items: center;
      margin-left: 10px;
      .img-style{
        width: 16px;
        height: 16px;
      }
      .league-icon{
        margin-right: 5px;
      }
    }
  }
  .header {
      height: 32px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      line-height: 32px;
      font-weight: 500;
      border-radius: 8px 8px 0px 0px;
      display: flex;
      justify-content: space-between;
      div{
        flex: 1;
      }
      .icon-arrow{
        font-size: 20px;
        left: 10px;
        top: -1px;
        transition: transform 0.3s;
        transform: rotate(180deg);
      }
      .icon-arrow:before {
        content: "";
      }
      .right-span {
        font-size: 14px;
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 30px;
      }
  }
  .span {
    font-size: 12px;
    color: #999999;
    text-align: center;
    line-height: 14px;
    font-weight: 400;
    margin: 7px 0;
  }
  .item-middle {
    height: 66px;
    padding: 2px 16px 8px 20px;
    .follow-order {
      height: 18px;
      line-height: 18px;
      
      padding: 0 12px;
      box-shadow: 0px 2px 4px 0px rgba(255,112,0,0.5);
      border-radius: 6px;
    }
    .item-bet-handicap {
      align-self: flex-start;
      font-size: 13px;
    }
    .item-bet-name {
      font-size: 14px;
      margin-top: 5px;
      font-weight: 600;
      .part1 {
        height: 14px;
        margin-right: 5px;
        font-size: 14px;
        
        line-height: 14px;  
      }
      .part2 {
        height: 12px;
        line-height: 12px;
      }
    }
    .item-bet-odds {
      font-size: 14px !important;
      font-weight: 700;
      margin-top: 3px;
    }
    .item-follow-heart {
      display: flex;
      margin-top: 10px;
      align-items: center;
      .follow-heart {
        margin-right: 3px;
        font-size: 12px !important;
        transform: scale(0.8);
      }
      .follow-count {
        height: 12px;
        line-height: 12px;
        margin-top: 1px;
      }
    }
  }
  .item-bottom {
    height: 28px;
    border-radius: 8px;
    line-height: 28px;
    margin: 0 15px;
    padding:0 10px;
    .item-row-left {
      span:last-child{
        font-size: 12px;
        text-align: right;
        line-height: 12px;
        font-weight: 500;
      }
    }
    .item-row-rght {
      margin-left: 77px;
      span:last-child{
        font-size: 12px;
        text-align: right;
        line-height: 12px;
        font-weight: 500;
      }
    }
  }
  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item-row-left  {
      line-height: 14px;
      font-size: 12px;
    }
  }
  .item-row-suc {
    font-size: 12px;
    color: #64C258;
    text-align: right;
    line-height: 12px;
    font-weight: 500;
  }
  .btn-footer {
    display: flex;
    position: absolute;
    bottom: 0px;
    
    width: 100%;
    height: 64px;
    justify-content: center;
    align-items: center;
   
    .clear-btn{
      margin: 0 50px;
      width: 160px;
      height: 32px;
     
      border-radius: 16px;
      text-align: center;
      line-height: 32px;
    }
    .saidan-btn {
      width: 160px;
      height: 32px;
      border-radius: 16px;
      text-align: center;
      line-height: 32px;
      font-size: 12px;
      color: var(--q-gb-t-c-1); 
    }
  }
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 0 20px;
    height: 36px;
    border-radius: 2px;
    text-align: center;
    line-height: 36px;
    transform: translate(-50%, -50%);
    color: var(--q-gb-t-c-1);
    background-color: #414655;
  }
  .color-0{
    color: green;
  }
  .color-1{
    color: green;
  }
  .color-2{
    color: black;
  }
  .color-3{
    color: orange;
  }
  .color-4{
    color: red;
  }
}
.basketball-height{
  top: 44px;
}
.content-border{
  height: 100%;
  overflow: scroll;
}
.loading-wrap {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--qq--theme-text-color-handicap);
          margin-top: 10%;
          padding-top: 0px;
          .img-loading {
            position: relative;
            margin-bottom: 10px;
            width: 100px;
            height: 100px;
            background-size: 100%;
            background-image: var(--qq--bg-image-url10); 
          }
        }
</style>