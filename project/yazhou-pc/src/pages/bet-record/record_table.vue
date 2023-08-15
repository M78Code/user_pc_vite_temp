<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 押注记录表单 注单历史表格弹出的那个
-->
<template>
  <!--押注记录表单-->
  <div class="record-table col" :class="{'no-record-data': early_settlement_data.length == 0}">
    <div class="data-table column">
      <!--表单头部标题-->
      <div class="row head">
        <!--每一行-->
        <div class="ceil">
          {{$root.$t('bet_record.number')}}
          <!-- 编号 -->
        </div>
        <!--每一行-->
        <div class="ceil">
          {{$root.$t('bet_record.betting_details')}}
          <!-- 投注详情 -->
        </div>
        <!--每一行-->
        <div class="ceil">
          {{$root.$t('bet_record.betting_play')}}
          <!-- 投注玩法 -->
        </div>
        <div class="ceil">
          {{$root.$t('bet_record.options')}}
          <!-- 选项 -->
        </div>
        <!--每一行-->
        <div class="ceil">
          {{$root.$t('bet_record.bets_forehead')}}
          <!-- 投注额 -->
        </div>
        <!--每一行-->
        <div class="ceil">
          {{ tool_selected===0? $root.$t('common.maxn_amount_val'): $root.$t('common.donate_win')}}
          <!--返还金额 -->
        </div>
        <!--每一行-->
        <div class="ceil">
          {{$root.$t('bet_record.status')}}
          <!-- 状态 -->
        </div>
      </div>
      <!--表单内容-->
      <div class="data-table-content" ref="table">
        <!--加载组件-->
        <load-data class="fit" color="light" :state="data_state.load_data_state">
          <!--quasar自定义滚动条-->
          <q-scroll-area
            ref="scrollArea"
            class="rule-scroll-area"
            :style="{height: '100%'}"
          >
            <!---表单内容-->
            <div class="r-table">
              <template  v-for="(data, i) of early_settlement_data" :key="i">
                <div class="row" :class="`status-${data.orderStatus} outcome-${data.orderOutCome}`">
                  <!-- 编号 -->
                  <div class="ceil" :class="{'bottom-hiden': _.get(cur_bet_pre, `${i}.show_detail`, false) && _.get(pre_order_list_obj, i)}">{{recordData.size*(recordData.current-1) + i + 1}}</div>
                  <!-- 投注详情 -->
                  <div class="ceil">
                    <div>{{formatTime(data.betTime, lang=='vi'?'hh:MM:ss dd/mm/yyyy':'yyyy-mm-dd hh:MM:ss')}}</div>
                    <!--注单号-->
                    <div class="order-no">
                      <span>{{data.orderNo}} {{data.copy_color}}</span>
                      <span
                        class="copy"
                        @click="copy(data.orderNo)"
                      >
                        <!--copy图标-->
                        <icon name="icon-icon_copy"/>
                      </span>
                    </div>
                    <!--单关，部分获取全额提前结算显示详情展示按钮-->
                    <template v-if="data.seriesType=='1' && [3,4,5].includes(data.settleType)">
                      <div class="bet-pre-detail" @click="show_bet_pre_info(data.orderNo, i)">
                        <!--提前结算详情-->
                        <span>{{$root.$t('bet_record.settlement_pre_info')}}</span>
                        <span>
                          <!--详情展示部分箭头-->
                          <icon
                            name="icon-triangle"
                            size="16px"
                            color="#99A3B1"
                            :class="{'icon-pull-down':_.get(cur_bet_pre, `${i}.show_detail`, false), 'icon-pull-up': !_.get(cur_bet_pre, `${i}.show_detail`, true)}"
                          />
                        </span>
                      </div>
                    </template>
                  </div>
                  <!-- 投注玩法 -->
                  <div class="ceil c134 play-name">
                    <div>
                      <!-- 串关 -->
                      <template v-if="data.seriesType != '1' || data.seriesType == '3'">{{data.seriesValue}}</template>
                      <!-- 单关 -->
                      <template v-else>
                        <template v-for="(item, index) in data.orderVOS">
                          {{matchType(item.matchType, data.langCode)}} {{item.playName}}
                          <span
                            v-if="item.matchType != 1 && item.scoreBenchmark && item.playId != '334'"
                            :key="index"
                          >({{item.scoreBenchmark | format_score}})</span>
                        </template>
                      </template>
                    </div>
                  </div>
                  <!-- 选项 -->
                  <div class="ceil c135">
                    <div class="ceil-options" v-for="(item, j) in data.orderVOS" :key="j">
                      <div style="flex:1;">
                        <!-- [足球]  世界杯2022亚洲外围赛 item.outrightYear-->
                        <div>
                          <div class="row appoint-status">
                            <div class="col">[{{item.sportName}}]{{item.matchName}}&nbsp;&nbsp;</div>
                            <div v-if="data.preOrder" class="col text-right">{{$root.$t('bet.bet_book_confirm')}}</div>
                          </div>

                          <template v-if="[1001,1004].includes(item.sportId*1)">{{item.matchDay}} {{item.batchNo}}</template>
                          <template v-if="[1011,1002,1009,1010].includes(item.sportId*1)">{{item.batchNo}}</template>
                        </div>
                        <!--赛马信息-->
                        <div class="match-name-wrap">
                          <!-- 赛马名字 -->
                          <div v-if="[1011,1002,1009,1010].includes(item.sportId*1)" class="ranking-bg">
                            <template v-if="!isNaN(item.playOptions) || item.playOptions.indexOf('/')!=-1">
                              <div v-for="(list, i) in item.playOptions.split('/')" :key="i" :class="`ranking-bg-style1-${list} csid-${item.sportId}`"></div>
                            </template>
                            <template v-else>
                              <span class="market_value">{{item.marketValue}}</span>
                            </template>
                          </div>
                          <!-- 云达不莱梅 -0.5 -->
                          <span v-else class="market_value">{{item.marketValue}}</span>
                          <!-- 1.98 -->
                          <span
                            class="market-value-text"
                            :class="{
                              'text-blue': (item.oddFinally.indexOf('-')!=-1)&&(data.marketType=='MY'||data.marketType=='ID'),
                              'text-orange': (item.oddFinally.indexOf('-')>-1)&&(data.marketType=='MY'||data.marketType=='ID'),
                            }"
                          >
                            <span>{{item.oddFinally | format_odds}}</span>
                          </span>
                        </div>
                        <!-- 赛前 全场赛果 -->
                        <div class="play-type" v-if="!data.acCode">
                          <span v-if="item.matchType != 3 && ![1001,1002,1009,1010,1011].includes(item.sportId*1)">{{matchType(item.matchType, data.langCode)}}</span>
                          <span>{{item.playName}}</span>
                          <!-- （1-1） -->
                          <span v-if="item.matchType != 1 && item.scoreBenchmark && item.playId != '334'">({{item.scoreBenchmark | format_score}})</span>
                          <!-- [欧洲盘]-->
                          <span>[{{marketType(item.marketType, data.langCode)}}]</span>
                           <!--冠军玩法 截止投注 -->
                          <!-- <div v-show="item.matchType === 3">
                            <span>{{ $root.$t("list.bet_close") }}:</span>
                            <span style="margin:0 5px">
                            {{
                              formatTime(
                                ['zh','tw'].includes(lang) ? "yyyy-mm-dd hh:MM" : "dd/mm/yyyy hh:MM"
                              )
                            }}</span>                     
                          </div> -->
                        </div>

                        <div class="play-type both-item" v-if="item.matchType != 3">
                          <!-- 拜仁慕尼黑 v 云达不莱梅 -->
                          <span v-if="item.sportId*1 < 1002||item.sportId == '1004'">
                            {{item.matchInfo.indexOf('(') ?(item.matchInfo.split('(')[0]):item.matchInfo}}
                            <span v-if="item.matchInfo.indexOf('(') > -1" 
                              @mouseover="show_score_info=true"
                              @mouseout="show_score_info=false"
                              >{{'('+item.matchInfo.split('(')[1]}}</span>
                              <!--对阵信息后面需加上一个提示  当鼠标移上去显示，移出去就消失-->
                              <q-tooltip
                                content-class="bet-bg-tooltip"
                                anchor="bottom left"
                                self="top left"
                                :offset="[-30,5]"
                                v-if="show_score_info==true"
                              >
                                <div class="score_info_style">
                                  {{$root.$t('bet.score_info')}}
                                </div>
                              </q-tooltip>
                          </span>
                          <!-- 10/20 15:30 -->
                          <span v-if="!data.acCode && item.beginTime">{{formatTime(item.beginTime, lang=='vi'?'hh:MM dd/mm':'mm/dd hh:MM')}}</span>
                        </div>
                        <div class="play-type settle-score" v-if="tool_selected == 1 && item.settleScore">
                          <!-- 赛果比分 -->
                          <span>{{item.settleScore}}</span>
                        </div>
                        <!--提前结算按钮-->
                        <template v-if="tool_selected == 0 && vx_get_user.settleSwitch && data.enablePreSettle && data.initPresettleWs && data.cash_out_status != -2 &&  data.seriesType == '1'">
                          <!-- 全场比分 2-0 -->
                          <div class="info-wrap">
                            <!--
                              计算金额大于1
                              cash_out_status = 1
                              盘口状态 hs=0
                              show_operate!=invalid(有效)
                            -->
                            <template v-if="data.computed_bet_amount>1 && _.get(data,'orderVOS.0.hs')==0 && data.cash_out_status==1">
                              <template v-if="_.get(cur_bet_pre, `${i}.bet_pre_code`)!='0400524' || [3,4,5].includes(data.settleType) || data.pre_settle_order_status==2">
                                <div class="text-center">
                                  <template v-if="_.get(cur_bet_pre, `${i}.bet_pre_code`)>1 && _.get(cur_bet_pre, `${i}.bet_pre_code`)!='0400524'">
                                    <span style="color:red">
                                      <template v-if="_.get(cur_bet_pre, `${i}.bet_pre_code`)=='0400527'">
                                        <!--功能暂停中，请稍后再试-->
                                        {{$root.$t('bet_record.pre_suspend')}}
                                      </template>
                                       <template v-else-if="_.get(cur_bet_pre, `${i}.bet_pre_code`)=='0400537'">
                                        <!--提前结算金额调整中，请再试一次-->
                                        {{$root.$t('bet_record.pre_amount_change')}}
                                      </template>
                                      <template v-else>
                                        <!--提前结算申请未通过-->
                                        {{$root.$t('bet_record.pre_not_approved')}}
                                      </template>
                                    </span>
                                  </template>
                                  <template v-else>
                                    <!--提前结算金额已包含本金-->
                                    <span>{{$root.$t('bet_record.pre_bet_include_money')}}</span>
                                  </template>
                                </div>
                              </template>
                              <!--提前结算按钮-->
                              <div class="bet-pre-wrap" v-if="!data.bet_status || data.bet_status == 'default'">
                                <div class="bet-pre-btn" @click.stop="start_bet_pre(i)">
                                  <!-- 提前结算 -->
                                  <div class="bet-row-1">{{$root.$t("bet_record.settlement_pre")}}</div>
                                  <!--提前结算金额展示-->
                                  <div class="bet-row-2">{{format_btn_balance(data.computed_bet_amount)}}</div>
                                </div>
                                <!--提前结算按钮后面那个两杠的图标-->
                                <div @click.stop="show_bet_pre(data, i)"
                                  :ref="`bet_pre_${data.orderNo}`"
                                  @mouseover.stop="bet_pre_over(i)"
                                  @mouseout.stop="bet_pre_out(i)" class="bet-pre-handle"
                                  v-if="vx_get_user.pcs=='1'">
                                    <icon name="icon-bet_pre" class="bet-pre-info" :class="{'bet-pre-over':_.get(cur_bet_pre,`${i}.show_operate`) == 'bet_pre'}" size="14px"/>
                                </div>
                                <!--去掉移入事件，一直保持高亮-->
                                <!-- <div @click.stop="show_bet_pre(data, i)"
                                  :ref="`bet_pre_${data.orderNo}`"
                                  class="bet-pre-handle"
                                  v-if="vx_get_user.pcs=='1'">
                                    <icon name="icon-bet_pre" :class="['bet-pre-info','bet-pre-over']"  size="14px"/>
                                </div> -->
                              </div>
                              <template v-if="_.get(cur_bet_pre,`${i}.show_operate`) == 'bet_pre'">
                                <template v-if="data.setBetAmount > _.get(money_obj, `${i}.min_money`, 0)">
                                  <!-- 结算投注额 -->
                                  <div>{{$root.$t("bet_record.settlement_bet_money")}}<span class="bet-money">{{format_balance(_.get(money_obj,`${i}.money`))}}</span></div>
                                  <div class="bet-compute-money">
                                    <!--提前结算滑块展示-->
                                    <vue-slider
                                      :ref="`vue-slider-${i}`"
                                      :adsorb="true"
                                      :minRange="money_obj[i].min_money"
                                      :maxRange="money_obj[i].max_money"
                                      v-model="money_obj[i].money"
                                      :data="money_obj[i].bet_amount_data"
                                      :data-value="'id'"
                                      :data-label="'name'"
                                      :dot-options="[{tooltip:'none'}]"
                                      @change="change_slider($event, i)"
                                      >
                                      <template v-slot:label="{ label, active }">
                                        <div :class="['vue-slider-mark-label', 'custom-label', {active}]">{{ label }}%</div>
                                      </template>
                                    </vue-slider>
                                  </div>

                                </template>

                                <!-- TIPS:部分结算后,剩余本金不支持再次提前结算! -->
                                <!-- <template v-if="[4,5].includes(data.settleType) || data.setBetAmount<=_.get(money_obj, `${i}.min_money`, 0)"> -->
                                <template>
                                <div class="mt5">
                                    <!-- 注单剩余本金 -->
                                    {{$root.$t("bet_record.settlement_bet_remaining")}}: {{format_balance(betPreRemaining(data)) }}
                                  </div>
                                  <div class="mt10">
                                    <!-- 提前结算可用次数 -->
                                    {{$root.$t("bet_record.settlement_bet_count")}}: {{ betPreCount(data, i) }}
                                  </div>
                                  <div v-if="data.setBetAmount<=_.get(money_obj, `${i}.min_money`, 0)" class="bet-tips-info">
                                    <icon
                                        name="icon-tips"
                                        class="bet-info"
                                        size="14px"
                                      />
                                    <span class="tips-info">
                                      <template>
                                        <!--仅支持全额结算-->
                                        {{$root.$t('bet_record.settlement_only_full')}}
                                      </template>
                                    </span>
                                  </div>
                                </template>

                              </template>
                              <!--提前结算确认中 、确认提前结算 -->
                              <div class="bet-pre-confirming-btn" v-if="data.bet_status=='start_bet_pre'"  @click="bet_handle(i, data.orderNo)">
                                <div class="bet-pre-left">
                                  <!-- 确认中...|确认提前结算 -->
                                  <div class="bet-row-1">{{data.bet_confirm?$root.$t("bet_record.confirm"):$root.$t("bet_record.confirm_bet_pre")}}</div>
                                  <!--data.amount存在的话优先使用，否则使用计算后的-->
                                  <div class="bet-row-2">{{format_btn_balance(data.computed_bet_amount)}}</div>
                                </div>
                                <div class="bet-pre-right" v-if="data.bet_confirm">
                                  <template v-if="['theme01','theme02'].includes(vx_get_theme)">
                                    <img :src="(`${$g_image_preffix}/image/wwwassets/yabo/gif/${vx_get_theme}/${vx_get_theme}_confirming.gif`)" style="height:18px;width:18px"/>
                                  </template>
                                  <template v-else>
                                    <img :src="(`${$g_image_preffix}/image/wwwassets/yabo/gif/${vx_get_theme}/${vx_get_theme}_pre_confirming.gif`)" style="height:18px;width:18px"/>
                                  </template>
                                </div>
                              </div>
                              <div class="bet-pre-complete-btn" v-if="data.bet_status=='end_bet_pre'">
                                <div class="bet-pre-left">
                                  <!-- 已提前结算 -->
                                  <div class="bet-row-1">{{$root.$t("bet_record.finish_bet_pre")}}</div>
                                  <div class="bet-row-2">{{format_btn_balance(data.computed_bet_amount)}}</div>
                                </div>
                                <div class="bet-pre-right">
                                  <icon name="icon-success" size="18px" color="#FFF"/>
                                </div>
                              </div>
                            </template>
                            <template v-else-if="data.computed_bet_amount<1 || _.get(data,'orderVOS.0.hs')!=0 || data.cash_out_status==-1">
                              <!--暂停提前结算-->
                              <div class="bet-pre-wrap bet-pre-stop">
                                <div class="bet-pre-btn">
                                  {{$root.$t('bet_record.pre_bet_stop')}}
                                </div>
                                <div :ref="`bet_pre_${data.orderNo}`" class="bet-pre-handle" v-if="vx_get_user.pcs=='1'">
                                  <icon name="icon-bet_pre" class="bet-pre-info" size="14px" color="#99A3B1"/>
                                </div>
                              </div>
                            </template>
                          </div>
                        </template>
                      </div>
                      <!-- 赢 -->
                      <!-- 投注项结算状态展示条件，未处理，已处理，注单无效
                      未结算串关、已结算串关
                      已结算+单关+betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输)
                      已结算注单无效
                      -->
                      <div class="item-result">
                        <!-- 未结算串关、已结算串关 -->
                        <template v-if="['0','1'].includes(data.orderStatus) && data.seriesType != '1'">
                          <!-- betstatus无效 -->
                          <template v-if="[3, 4].includes(item.betStatus)">
                            <span
                              v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                              class="bet-result lose-color"
                            >
                              {{item_cancelType(item.cancelType)}}
                            </span>
                            <span v-else class="bet-result lose-color">{{$root.$t("bet.invalid")}}</span>
                          </template>
                          <!-- 其他 -->
                          <span
                            v-if="item.betStatus==1"
                            class="bet-result"
                            :class="item_class(item.betResult)"
                          >{{item_status(item.betResult)}}</span>
                        </template>
                        <!-- 未结算串关、已结算串关 -->

                        <!-- 已结算 单关 betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输) -->
                        <template v-if="data.preBetAmount>0">
                          <span
                            v-if="data.orderStatus=='1' && data.seriesType =='1'"
                            class="bet-result"
                            :class="item_class(data.outcome)"
                          >{{item_status(data.outcome)}}</span>
                        </template>
                        <template v-else>
                          <span
                            v-if="data.orderStatus=='1' && data.seriesType =='1'"
                            class="bet-result"
                            :class="item_class(item.betResult)"
                          >{{item_status(item.betResult)}}</span>
                        </template>
                        <!-- 已结算 单关 betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输) -->

                        <!-- 已结算注单无效 -->
                        <template v-if="data.orderStatus=='2'">
                          <template v-if="[3, 4].includes(item.betStatus)">
                            <span
                              v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                              class="bet-result lose-color"
                            >
                              {{item_cancelType(item.cancelType)}}
                            </span>
                            <span v-else class="bet-result lose-color">{{data.seriesType =='1'?'':`${$root.$t("bet.invalid")}`}}</span>
                          </template>
                          <template v-if="item.betStatus ==1">
                            <span
                              v-if="[7,8,11,12,15].includes(item.betResult)"
                              class="bet-result lose-color"
                            >{{item_status(item.betResult)}}</span>
                            <span
                              v-else
                              class="bet-result lose-color"
                            >{{data.seriesType =='1'?'':`${$root.$t("bet.invalid")}`}}</span>
                          </template>
                        </template>
                        <!-- 已结算注单无效 -->
                      </div>
                    </div>
                  </div>
                  <!-- 投注额 -->
                  <div class="ceil font-family">
                    {{format_balance(data.orderAmountTotal)}}
                    <span
                      class="order-addtion"
                      v-if="data.addition>0"
                    >{{`[+${format_balance(data.addition)}]`}}</span>
                  </div>
                  <!-- 返还金额 -->
                  <div class="ceil font-family">
                    <!-- :class="outcome_class(data.orderOutCome)" -->
                    <span
                      :class="{'win-color': [4,5].includes(data.outcome)}"
                      v-if="tool_selected===0||tool_selected===1"
                    >{{format_balance(tool_selected===0?data.maxWinAmount:data.backAmount)}}</span>
                    <span v-else>- -</span>
                  </div>
                  <!-- 状态 -->
                  <div class="ceil">
                    <!--
                      0:待处理,1:已处理,2:取消交易,3:待确认,4:已拒绝
                      0、3未结算
                      1、2、4已结算
                    -->
                    <span :class="status_class(data.orderStatus)">{{order_status(data.orderStatus)}}</span>
                    <!--显示部分提前结算或者全额提前结算-->
                    <span v-if="tool_selected==1" class="bet-pre-color">
                      <template v-if="data.settleType==4">{{$root.$t('bet_record.settlement_pre_part2')}}</template>
                      <template v-else-if="data.settleType==5">{{$root.$t('bet_record.settlement_pre_all2')}}</template>
                    </span>
                  </div>
                </div>
                <!--提前结算详情Start-->
                <template v-if="data.seriesType == '1' && [3,4,5].includes(data.settleType) && _.get(cur_bet_pre, `${i}.show_detail`, false) && _.get(pre_order_list_obj, i)">
                  <div class="row detail-row head" :key="`detail-title-${i}-${_.get(cur_bet_pre, `${i}.show_detail`, false)}`">
                    <div class="ceil first-title top-hiden bottom-hiden">
                    </div>
                    <div class="ceil">
                    </div>
                    <div class="ceil">
                    </div>
                    <div class="ceil">
                    </div>
                    <div class="ceil">
                      {{$root.$t('bet_record.settlement_money')}}
                    </div>
                    <div class="ceil">
                      {{$root.$t('common.donate_win')}}
                    </div>
                    <div class="ceil">
                      {{$root.$t('bet_record.lose_win')}}
                    </div>
                  </div>
                  <!--详情数据显示-->
                  <template v-for="(obj, order_index) in _.get(pre_order_list_obj, i)">
                    <div class="row" :key="`detail-content-${i}-${order_index}`" :class="{'show-bottom': order_index==_.get(pre_order_list_obj, i,[]).length - 1}">
                      <div class="ceil first-title top-hiden bottom-hiden">
                      </div>
                      <div class="ceil right-hiden bottom-hiden" :class="{'top-dashed': order_index > 0,'shadow-bg': order_index%2 != 0}">
                        <div>{{formatTime(obj.createTime, lang=='vi'?'hh:MM:ss dd/mm/yyyy':'yyyy-mm-dd hh:MM:ss')}}</div>
                        <template v-if="obj.preOrderNo">
                           <!--注单号-->
                          <div class="order-no">
                            <span>{{obj.preOrderNo}} {{data.copy_color}}</span>
                            <span
                              class="copy"
                              @click="copy(obj.preOrderNo)"
                            >
                              <!--copy图标-->
                              <icon name="icon-icon_copy" :color="color_list[i]" />
                            </span>
                          </div>
                        </template>
                      </div>
                      <div class="ceil right-hiden bottom-hiden" :class="{'top-dashed': order_index > 0,'shadow-bg': order_index%2 != 0}">
                      </div>
                      <div class="ceil right-hiden bottom-hiden" :class="{'top-dashed': order_index > 0,'shadow-bg': order_index%2 != 0}">
                        <template v-if="obj.orderStatus == 2">
                          <template v-if="obj.type == 1">
                            <span>{{$root.$t('bet_record.settlement_pre_part')}}<span class="red-bg">{{$root.$t("common.cancel")}}</span></span>
                          </template>
                          <template v-else-if="obj.type == 2">
                            <span>{{$root.$t('bet_record.settlement_pre_all')}}<span class="red-bg">{{$root.$t("common.cancel")}}</span></span>
                          </template>
                        </template>
                        <template v-else>
                          <span>
                            <span class="pre-bet-part">
                              <!---部分结算金额--->
                              <template v-if="obj.type==1">
                                <div>{{$root.$t('bet_record.settlement_pre_part')}}</div>
                                <div>[{{$root.$t('bet_record.surplus')}}{{format_balance(obj.remainingBetAmount)}}]</div>
                              </template>
                              <!--全额结算-->
                              <template v-else-if="obj.type==2">
                                <div>{{$root.$t('bet_record.settlement_pre_all')}}</div>
                              </template>
                              <!--剩余本金结算-->
                              <template v-else-if="obj.type==3">
                                <div>{{$root.$t('bet_record.settlement_pre_surplus')}}</div>
                              </template>
                            </span></span>
                        </template>
                      </div>
                      <div class="ceil right-hiden bottom-hiden" :class="{'top-dashed': order_index > 0,'shadow-bg': order_index%2 != 0}">
                        {{obj.orderStatus == 2? 0.00 : format_balance(obj.preBetAmount)}}
                      </div>
                      <div class="ceil right-hiden bottom-hiden" :class="{'top-dashed': order_index > 0,'shadow-bg': order_index%2 != 0}">
                        {{obj.orderStatus == 2 ? 0.00 : format_balance(obj.settleAmount)}}
                      </div>
                      <div class="ceil bottom-hiden" :class="{'top-dashed': order_index > 0,'shadow-bg': order_index%2 != 0}">
                        {{obj.orderStatus == 2 ? 0.00 : format_balance(obj.profit)}}
                      </div>
                    </div>
                  </template>
                </template>
                <!--提前结算详情End-->
              </template>
            </div>
          </q-scroll-area>
        </load-data>
      </div>
    </div>
    <template v-if="parseInt(recordData.total)">
      <!--分页组件-->
      <Pagination
        class="record-pagination"
        :count="recordData.total"
        :betTotalAmount="recordData.betTotalAmount"
        :effectiveFlow="recordData.effectiveFlow"
        :profit="recordData.profit"
        :recordType="recordData.orderStatus"
        :random="random"
        @pageChange="changePage(arguments)"
      ></Pagination>
    </template>
    <!--复制样式 已复制-->
    <div class="toast fit-center" v-if="toast">{{$root.$t("bet_record.copyed")}}</div>
  </div>
</template>

<script>
import { api_betting } from "src/public/api/index";
import formartmixin from "src/public/mixins/common/time_format";
import Pagination from "src/project/yabo/components/bet_record/Pagination.vue";
import { mapGetters } from "vuex";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { uid } from 'quasar';
export default {
  name: "RecordTable",
  components: {
    VueSlider,
    Pagination,
  },
  mixins: [formartmixin],
  props: {
    record_obj: {
      type: Object,
      default: {}
    },
    order_list: {
      type: [Object, Array],
      default: () => {
        return {
          records: [],
        };
      },
    },
    orderNo_data_obj: {
      type: Array,
      default: () => [],
    },
    orderNo_data_list: {
      type: Array,
      default: () => [],
    },
    data_state: {
      type: Object,
      default: () => {
        return {
          load_data_state: "loading",
        };
      },
    },
    tool_selected: {
      type: Number,
      default: 0,
    },
    random: Number,
    // lang:{
    //   type: String,
    //   default: "zh"
    // }
  },
  data() {
    return {
      toolIndex: 0,
      recordData: {},
      toolWords: [],
      current: 1,
      toPage: 1,
      selectOptions: [
        {
          label: "10",
          value: 10,
        },
        {
          label: "20",
          value: 20,
        },
        {
          label: "50",
          value: 50,
        },
      ],
      toast: false,
      color_list: [],
      isShow: true,
      timeout_toast:null, // 定时器
      early_settlement_data: [], // 用于提前结算的数据
 
      // more_wrap_data: {},//更多弹框数据
      // show_bet_order: {}, //是否查看提前结算
      pre_order_list_obj: {}, //查看提前结算详情
			cur_bet_pre: {},
      moreStyle: {
				left: 0,
				top: 0
			},
      money_obj: {},
      setup_single_info: {},
      timer_obj: {},
      is_cancel: false, // 是否被拒单过（ws）
      show_score_info:false //比分提示默认隐藏
    };
  },
  filters: {
    //赔率展示格式化
    format_odds(val) {
      if (val == '' || val == undefined) {
        return '';
      }
      val = (val || '0').toString();
      let ret = val;
      if (val.includes('.')) {
        if (val >= 100) {
          if (val.split('.')[1] == '00') {
            ret = val.split('.')[0];
          } else {
            let len = val.length;
            if (val.indexOf('.0') == (len - 2)) {
              ret = val.substring(0, len - 2);
            } else {
              ret = val;
            }
          }
        } else if (val >= 10) {
          if (val.split('.')[1][1] == '0') {
            ret = val.slice(0, val.length - 1);
          } else {
            ret = val;
          }
        }
      }
      return ret;
    },
    /**
     * 比分格式设置
     */
    format_score(res) {
      let str = "";
      if (res.indexOf("|") != -1) {
        let arr = res.split("|");
        str = arr[1].split(":");
      } else if (res.indexOf(":") != -1) {
        str = res.split(":");
      }
      return `${str[0]} - ${str[1]}`;
    }
  },
  created() {
    this.recordData = this.order_list;
    // 提前结算订单设施
    this.$root.$on(this.emit_cmd.EMIT_SET_PRE_ORDER_STATUS_CMD, this.set_pre_order_status);
    // 提前结算ws推送的数据设置
    this.$root.$on(this.emit_cmd.EMIT_SET_WS_INFO_DATA_CMD, this.set_ws_info_data);
    // 统计未结算订单数量
    this.$root.$emit(this.emit_cmd.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
  },
  computed: {
    ...mapGetters({
      // 用户信息
      vx_get_user: "get_user",
      vx_get_theme: "get_theme"
    })
  },
  watch: {
    order_list: {
      handler(val) {
        let scroll_area =  this.yabo_common.get_refs_info('scrollArea', null, this);
        if (scroll_area && scroll_area.setScrollPosition) {
          scroll_area.setScrollPosition(0);
        }
        this.recordData = val;
        this.init_data();
      },
      immediate: true,
    },
    /**
     * 提前结算实时查询返回最新数据
     */
    orderNo_data_list: {
      handler(val) {
        if(val && val.length>0) {
          // 提前结算实时查询 更新数据
          this.get_max_cashout()
        }
      }
    }
  },
  methods: {
    /**
     * @description:盘口类型
     * @param {sting} type: records.marketType字段
     * @param {sting} langCode: 多语言 默认是中文
     * @return{string} 盘口类型
     */
    marketType(type, langCode='zh') {
      var res = "";
      if(type && langCode) {
        switch (type) {
          case "EU":
            res = this.$root.$t(`common_lang.${langCode}.odds.EU`); //"欧洲盘";
            break;
          case "HK":
            res = this.$root.$t(`common_lang.${langCode}.odds.HK`); //"香港盘";
            break;
          case "US":
            res = this.$root.$t(`common_lang.${langCode}.odds.US`); //"美式盘";
            break;
          case "ID":
            res = this.$root.$t(`common_lang.${langCode}.odds.ID`); //"印尼盘";
            break;
          case "MY":
            res = this.$root.$t(`common_lang.${langCode}.odds.MY`); //"马来盘";
            break;
          case "GB":
            res = this.$root.$t(`common_lang.${langCode}.odds.GB`); //"英式盘";
            break;
          default:
            res = "";
            break;
        }
      }
      return res;
    },

    /**
     * @description:输赢状态
     * @param {srting} type: records.orderVOS.betResult
     * @return{string} 盘口类型
     */
    item_status(type) {
      switch (parseInt(type)) {
        case 2:
          return this.$root.$t("bet_record.effective_water_"); //"走水";
        case 3:
          return this.$root.$t("bet_record.lose"); //输

        case 4:
          return this.$root.$t("bet_record.win"); //赢
        case 5:
          return this.$root.$t("bet_record.win_half"); //"赢半";
        case 6:
          return this.$root.$t("bet_record.lose_half"); //"输半";
        case 7:
          return this.$root.$t("bet_record.match_cancel2"); //"赛事取消";
        case 8:
          return this.$root.$t("bet_record.match_delay"); //"赛事延期";
        case 11:
          return this.$root.$t("bet_record.match_delay2"); //"比赛延迟";
        case 12:
          return this.$root.$t("bet_record.match_interrupt"); //"比赛中断";
        case 13:
          return this.$root.$t("bet.invalid"); //"无效";
        case 16:
          return this.$root.$t("bet.invalid"); //"无效";
        case 15:
          return this.$root.$t("bet_record.match_give_up"); //"比赛放弃";
      }
    },

    /**
    * @description: 取消原因
    * @param {srting} cancelType: 取消类型
    * @return {string}
    */
    item_cancelType(cancelType){
      switch (parseInt(cancelType)) {
        case 1:
          return this.$root.$t("bet_record.match_cancel2"); //"比赛取消";;
        case 2:
          return this.$root.$t("bet_record.match_delay"); //"比赛延期";
        case 3:
          return this.$root.$t("bet_record.match_interrupt"); //"比赛中断";
        case 4:
          return this.$root.$t("bet_record.match_rematch"); //比赛重赛
        case 5:
          return this.$root.$t("bet_record.match_waist"); //"比赛腰斩";
        case 6:
          return this.$root.$t("bet_record.match_give_up"); //"比赛放弃";
        case 17:
          return this.$root.$t("bet_record.match_advance"); //"赛事提前";
        case 20:
          return this.$root.$t("bet_record.match_delay2"); //"比赛延迟";
        default: 
          return this.$root.$t("bet.invalid") //注单无效
      }
    },

    /**
     * @输赢状态calss
     * @param betResult: records.orderVOS.betResult
     */
    item_class(betResult) {
      switch (parseInt(betResult)) {
        case 2:
          return "lose-color"; //"走水";
        case 3:
          return "lose-color"; //输
        case 4:
          return "win-color"; //赢
        case 5:
          return "win-color"; //"赢半";
        case 6:
          return "lose-color"; //"输半";
        case 7:
          return "lose-color"; //"赛事取消";
        case 8:
          return "lose-color"; //"赛事延期";
        case 11:
          return "lose-color"; //"比赛延迟";
        case 12:
          return "lose-color"; //"比赛中断";
        case 13:
          return "lose-color"; //"无效";
        case 16:
          return "lose-color"; //"无效";
        case 15:
          return "lose-color"; //"比赛放弃";
      }
      return "";
    },

    /**
     * @订单状态
     * @param orderStatus: records.orderStatus
     */
    order_status(orderStatus) {
      let str = '';
      switch (parseInt(orderStatus)) {
        case 0:
          str =  this.$root.$t("bet.bet_suc"); //"投注成功";
          break;
        case 1:
          str = this.$root.$t("bet.bet_suc"); //"投注成功";
          break;
        case 2:
          str = this.$root.$t("bet.betting_cancel"); //"注单无效";
          break;
        case 3:
          str = this.$root.$t("bet.bet_loading"); //"确认中";
          break;
        case 4:
          str = this.$root.$t("bet.bet_fail"); //"投注失败";
          break;
        default:
          break;
      }
      return str;
    },

    /**
     * @订单状态class
     * @param orderStatus: records.orderStatus
     */
    status_class(orderStatus) {
      let str = "";
      switch (parseInt(orderStatus)) {
        case 0:
          str = ""; //"投注成功";
          break;
        case 1:
          str = ""; //"投注成功";
          break;
        case 2:
          str = "lose-color"; //"注单无效";
          break;
        case 3:
          str = ""; //确认中
          break;
        case 4:
          str = "win-color"; //投注失败
          break;
        default:
          break;
      }
      return str;
    },

    /**
     * @下注赛事阶段
     * @param type: records.matchType
     */
    matchType(type, langCode=this.$i18n.locale) {
      let res = "";
      if(type && langCode) {
        switch (parseInt(type)) {
          case 1:
            res = this.$root.$t(`common_lang.${langCode}.bet.morning_session`); //"早盘赛事";
            break;
          case 2:
            res = this.$root.$t(`common_lang.${langCode}.bet.bowls`);//"滚球盘赛事";
            break;
          case 3:
            res = this.$root.$t(`common_lang.${langCode}.bet.champion_handicap`); //"冠军盘赛事";
            break;
        }
      }
      return res;
    },

    /**
     * @翻页
     * @param data: 分页组件传值
     * size：每页条数
     * page：当前页码
     */
    changePage(data) {
      this.$emit("choosePage", data);
    },

    /**
     * @点击复制单号
     * @param data：单号
     */
    copy(data) {
      let oInput = document.createElement("input");
      oInput.value = data;
      document.body.appendChild(oInput);
      oInput.select();
      this.toast = true;
      clearTimeout(this.timeout_toast);
      this.timeout_toast = setTimeout(() => {
        this.toast = false;
      }, 1500);
      document.execCommand("Copy");
      oInput.remove();
    },
    /**
		* @description: 展开调整结算金额滑动
		*/
		show_bet_pre(data, index){
      // 如果当前是展开的则进行折叠设置
			if(_.get(this.cur_bet_pre,`${index}.show_operate`)){
        this.$set(this.cur_bet_pre,`${index}.show_operate`, '');
				return false;
			}
      this.$set(this.early_settlement_data[index], "amount", 0);
      // 金额改变设置为true
			this.$set(this.early_settlement_data[index],"changeMoney", true);
      // 设置结算按钮
      this.$set(this.cur_bet_pre,`${index}.show_operate`, 'bet_pre');
      // 当金额存在时无需重新设置值
      if(_.get(this.money_obj,`${index}.money`)) {
        this.$nextTick(()=>{
          let frontSettleAmount = _.get(this.early_settlement_data[index], 'frontSettleAmount');
          let slider = this.yabo_common.get_refs_info(`vue-slider-${index}`, null, this);
          if(_.isArray(slider)) {
            // 滑块当前的所在节点
            let slider_index = slider[0].getIndex();
            // 最小结算金额获取
            let money = _.get(this.money_obj, `${index}.money`);
            let min_money = _.get(this.money_obj,`${index}.min_money`);
            // 最大结算金额获取
            let max_money = _.get(this.money_obj,`${index}.max_money`);
            // 如果滑块所在的index值为-1则需要对默认设置重新设置值
            // 根据金额算滑块的当前应该所处的比率
            let rat = (money/max_money) * 100;
            rat = Math.floor(rat); // 对所算的比率向下取整
            // 组件百分比和索引的映射关系
            let obj_index = {
              "25": 1,
              "50": 2,
              "75": 3,
              "100": 4
            }
            let computed_bet_amount;
            if(obj_index[rat]) {
              slider_index = obj_index[rat];
              computed_bet_amount = frontSettleAmount * rat/100;
            } else {
              slider_index = 0;
              computed_bet_amount = frontSettleAmount * (min_money/max_money);
            }
            this.$set(this.early_settlement_data[index], "computed_bet_amount", computed_bet_amount);
            // 设置组件默认选中的进度
            slider[0].setIndex(slider_index);
            slider = null;
          }
        });
        return false;
      }
      // 设置当前金额为的投注金额
      this.$set(this.money_obj,`${index}.money`, _.round(data.setBetAmount));
		},
    /**
     * 提前结算移入样式
     */
    bet_pre_over(index) {
      // 设置提前结算移入样式
      this.$set(this.early_settlement_data[index], "mouseover_info", true);
    },
    /**
     * 提前结算移除样式
     */
    bet_pre_out(index) {
      // 设置提前结算移除样式
      this.$set(this.early_settlement_data[index], "mouseover_info", false);
    },
		/**
		* @description: 滑动投注金额，计算结算金额
		* @param {}
		* @return {}
		*/
		change_slider(val,index){
      // 获取最小结算金额
      let min_money = _.get(this.money_obj,`${index}.min_money`, 0);
      // 获取最大结算金额
      let max_money = _.get(this.money_obj,`${index}.max_money`, 0);
      // 当前提前结算对象
      let settlment_data = this.early_settlement_data[index];
      let frontSettleAmount = _.get(settlment_data, 'frontSettleAmount');
      // 根据金额计算结算比率
      let rat = (val/_.get(this.money_obj,`${index}.max_money`)) * 100;
      // 对所算的比率向下取整
      rat = Math.floor(rat);
      this.$nextTick(()=>{
        let slider = this.yabo_common.get_refs_info(`vue-slider-${index}`, null, this);
        if(slider && slider[0] && _.isFunction(slider[0].getIndex)) {
          // 获取当前滑块所在的节点
          let slider_index = slider[0].getIndex();
          // 未获取到滑块节点
          if(slider_index==-1) {

            // 组件百分比和索引的映射关系
            let obj_index = {
              "25": 1,
              "50": 2,
              "75": 3,
              "100": 4
            }
            // 滑块的计算节点
            if(obj_index[rat]) {
              slider_index = obj_index[rat];
              this.$set(settlment_data, "computed_bet_amount", frontSettleAmount * rat/100);
            } else {
              slider_index = 0;
              this.$set(settlment_data, "computed_bet_amount", frontSettleAmount * (min_money/max_money));
            }
            // 设置组件默认选中的进度
            slider[0].setIndex(slider_index);
          }
          // 存储滑块的选中节点
          this.money_obj[index].slider_index = slider_index;
        }
      });
      // 概率
      let computed_bet_amount = 0;
      if(val < min_money && (settlment_data.setBetAmount > min_money) && val != max_money) {
        this.$set(this.money_obj, `${index}.money`, Math.round(min_money));
        computed_bet_amount = frontSettleAmount * (min_money/max_money);

      } else {
        this.$set(this.money_obj, `${index}.money`, rat===100?max_money:Math.round(val));
        let money_ = _.get(this.money_obj,`${index}.money`)
        computed_bet_amount = this.get_btn_amount(rat, frontSettleAmount, settlment_data, money_)
      }
      // 设置当前的计算金额
      this.$set(settlment_data,'computed_bet_amount', computed_bet_amount);
		},
    /**
     * 按钮显示金额
     */
    get_btn_amount(ratio, frontSettleAmount, settlment_data, money_) {
      if(ratio===100) {
        return frontSettleAmount * ratio/100;
      } else {
        let maxCashout = _.get(settlment_data,'maxCashout')
        let preSettleBetAmount = _.get(settlment_data,'preSettleBetAmount')
        let money = money_ * maxCashout/preSettleBetAmount
        return money;
      }
    },
		/**
		* @description: 初次点击提前结算
		* @param {}
		* @return {}
		*/
		start_bet_pre(index){
      // 设置按钮为开始结算按钮
      this.$set(this.cur_bet_pre, `${index}.show_operate`, 'start_bet_pre');
      // 由于此时按钮处于开始结算状态，确认按钮设置默认状态为false
      this.$set(this.early_settlement_data[index], "bet_confirm", false);
      // 设置结算状态
			this.$set(this.early_settlement_data[index], "bet_status", "start_bet_pre");
      clearTimeout(this.timer_obj[`${index}_pre_timer`]);
      // 清除过滤未结算和是提前结算定时器
      this.$emit('clear_timer_get_cashout')
       // 如果按钮指点过一次，一直处于开始结算状态，5s后恢复为结算按钮初态
			this.timer_obj[`${index}_pre_timer`] = setTimeout(()=>{
        // 设置按钮为开始结算按钮
        this.$set(this.cur_bet_pre, `${index}.show_operate`, '');
				this.$set(this.early_settlement_data[index], "bet_status", "default");
        // 重置过滤未结算和是提前结算定时器
        this.$emit('res_timer_get_cashout')
			}, 5000)
		},
		/**
		* @description: 确认提前结算
		* @return {}
		*/
		bet_handle(index,orderNo){
			clearTimeout(this.timer_obj[`${index}_pre_timer`]);
      let selttle_data = this.early_settlement_data[index];
      // 如果当前结算状态处于确认中，那么按钮还是保持原状态(放置重复提交)
			if(selttle_data.bet_confirm) return;
      // 记录当前结算的订单号
      this.$set(this.cur_bet_pre, `${index}.orderNo`, orderNo);
      // 设置结算状态
			this.$set(selttle_data, "bet_confirm", true);
      // 清除过滤未结算和是提前结算定时器
      this.$emit('clear_timer_get_cashout')
      // 结算状态为3:结算中
      this.$set(selttle_data, "settle_status", 3);
      let settleAmount = "0.00";
      // 如果结算金额没有改变则却默认的结算金额，如果有改变则从money_obj中取值
      if(_.get(selttle_data,'changeMoney', false)) {
        settleAmount = _.get(this.money_obj, `${index}.money`).toFixed(2);
      } else {
        settleAmount = _.get(selttle_data,'setBetAmount').toFixed(2);
      }
      // 设置提交金额
      selttle_data.submit_amount = settleAmount;
      let amount
      // 计算金额
      if(selttle_data.computed_bet_amount) {
        amount = selttle_data.computed_bet_amount;
      }
      // 计算金额格式设置
      if(amount) {
				let _split = amount.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
				// 保留两位小数
				let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
				amount = _split[1] + '.' + decimal;
			}
      // 提前结算接口请求参数
			let params = {
				orderNo,
				settleAmount,
        deviceType:2,
        frontSettleAmount: amount
			}
      // 设置按钮显示的金额
      this.$set(this.early_settlement_data[index],'frontSettleAmount', amount);
      // 调用提前结算接口
			api_betting.post_pre_bet_order(params).then(res =>{
				const code = _.get(res, "data.code");
        const data = _.get(res, "data.data");
				if(code == 200){
          this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 1);
          // 确认按钮状态恢复
          this.$set(this.early_settlement_data[index], "bet_confirm", false);
          // 显示结算成功按钮
					this.$set(this.early_settlement_data[index], "bet_status", "end_bet_pre");
          // 重置过滤未结算和是提前结算定时器
          this.$emit('res_timer_get_cashout')
          this.show_bet_slide(index)
          this.re_settlement(code, orderNo);
			  } else if(['0400500','0400527', '0400537'].includes(code)) {
          this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, code);
          // 确认按钮状态恢复
          this.$set(this.early_settlement_data[index], "bet_confirm", false);
          // 恢复默认按钮状态
					this.$set(this.early_settlement_data[index], "bet_status", "default");
          // 重置过滤未结算和是提前结算定时器
          this.$emit('res_timer_get_cashout')
          if(code=='0400537' && data) {
            let computed_bet_amount = Number(data).toFixed(2);
            this.$set(this.early_settlement_data[index],'computed_bet_amount', computed_bet_amount);
          }
          this.reset_bet_code(`${index}_bet_pre_${code}`);
        } else if(code!=='0400524') {
          this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, code);
          // 恢复默认按钮状态
					this.$set(this.early_settlement_data[index], "bet_status", "default");
          // 重置过滤未结算和是提前结算定时器
          this.$emit('res_timer_get_cashout')
          // 确认按钮状态恢复
          this.$set(this.early_settlement_data[index], "bet_confirm", false);
          this.reset_bet_code(`${index}_bet_pre_${code}`);
				}
        if(code == '0400524') {
          clearTimeout(this.timer_obj[`${index}_settle_status`]);
          // 提前结算接口如果超过310S后ws没有返回最终状态 拉取一次接口进行最终状态更改
          this.timer_obj[`${index}_settle_status`] = setTimeout(() => {
            this.order_pre_settle_confirm((code,data)=>{
               let obj = _.find(data, item=>item.orderNo == orderNo);
               if(obj) {
                  if(obj.preSettleOrderStatus==1) {
                    this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 1);
                    // 确认按钮状态恢复
                    this.$set(this.early_settlement_data[index],'bet_confirm',false);
                    // 显示结算成功按钮
                    this.$set(this.early_settlement_data[index], "bet_status", "end_bet_pre");
                    // 重置过滤未结算和是提前结算定时器
                    this.$emit('res_timer_get_cashout')
                    this.show_bet_slide(index)
                    this.re_settlement(code, orderNo);
                  } else if(obj.preSettleOrderStatus==2) { // 拒单
                    this.is_cancel = true
                    this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, '0400500');
                    // 恢复默认按钮状态
                    this.$set(this.early_settlement_data[index],'bet_status','default');
                    // 确认按钮状态恢复
                    this.$set(this.early_settlement_data[index],"bet_confirm", false);
                  }
                }
            });
          }, 310 * 1000);
        }
			}).catch(err=>{
        // 提前结算code设置为 999
        this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 999);
        // 状态恢复
				this.$set(this.early_settlement_data[index], "bet_status", "default");
        // 重置过滤未结算和是提前结算定时器
        this.$emit('res_timer_get_cashout')
        // 恢复确认按钮状态
        this.$set(this.early_settlement_data[index], "bet_confirm", false);
        // 恢复提前就是那code
        this.reset_bet_code(`${index}_bet_pre_error`);
				console.log(err);
			})
		},
    // 计算下拉icon是否显示
    show_bet_slide(index) {
      let preSettleBetAmount = this.early_settlement_data[index].preSettleBetAmount
      let money = this.money_obj[index].money
			this.$set(this.early_settlement_data[index], "pre_settle_bet_amount_2", this.$mathjs.subtract(preSettleBetAmount, money||0));
    },
    /**
     * 部分结算后显示提前结算详情
     */
		show_bet_pre_info(orderNo, index) {
      // 提前结算详情折叠
			if(_.get(this.cur_bet_pre,`${index}.show_detail`, false)){
        this.$set(this.cur_bet_pre,`${index}.show_detail`, false);
				return false
			}
      // 展开提前结算详情
      this.get_info_data(orderNo, index);
		},
    /**
     * 获取提前结算详情数据
     */
		get_info_data(orderNo, index){
			api_betting.get_pre_settle_order_detail({orderNo}).then(res=>{
				const code = _.get(res, 'data.code')
				let result= _.get(res, 'data.data')
				if(code == 200){
          // 提前结算接口投注详情数据设置
          this.pre_order_list_obj[index]  = result;
          // 设置显示提前结算详情
          this.$set(this.cur_bet_pre, `${index}.show_detail`, true);
				}
			})
		},
    /**
     * 提前结算状态更改
     */
    query_settle_status(orderNo, index) {
      api_betting.query_pre_settle_order_status({orderNo}).then(res=>{
        const code = _.get(res, "data.code");
        // 回复按钮状态
        this.$set(this.early_settlement_data[index], "bet_status", "default");
        // 重置过滤未结算和是提前结算定时器
        this.$emit('res_timer_get_cashout')
        // 恢复确认按钮状态
        this.$set(this.early_settlement_data[index], "bet_confirm", false);
        // 设置结算状态码(页面会根据状态码显示对应的提示信息)
        if(code == 200) {
          // 设置提前结算code码
          this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 1);
          // 设置按钮提前结算状态为结束提前结算
          this.$set(this.early_settlement_data[index], "bet_status", "end_bet_pre")
          // 重置过滤未结算和是提前结算定时器
          this.$emit('res_timer_get_cashout')
          this.show_bet_slide(index)
          this.re_settlement(orderNo, index);
          // 拉取用户金额接口
          this.$root.$emit(this.emit_cmd.EMIT_GET_BALANCE_CMD);
        } else if(['0400525','0400526'].includes(code)) {
          this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, code);
          this.$set(this.early_settlement_data[index], "bet_status", "default");
          // 重置过滤未结算和是提前结算定时器
        this.$emit('res_timer_get_cashout')
        }
        // 调用回复状态码(5s后才会回复)
        this.reset_bet_code(`${index}_bet_pre_${code}`);
      });
    },
    /**
     * 初始化滑块以及提前结算数据
     */
    init_data() {
      // 提前结算开关打开时处理
      if(this.tool_selected) {
        this.$emit('clear_timer_get_cashout');
        this.get_init_data();
      } else if(this.tool_selected == 0 && this.vx_get_user.settleSwitch) {
        let param = {};
        this.send_gcuuid = uid();
        param.gcuuid = this.send_gcuuid;
        // console.log('init_data====',JSON.stringify(param));

        //获取提前结算确认中的数据
        api_betting.query_order_pre_settle_confirm(param).then(res => {
        // console.log('init_data====res===', this.send_gcuuid == res.config.gcuuid);
        // if(this.send_gcuuid != res.config.gcuuid) return;

        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && this.send_gcuuid != gcuuid) {
          return;
        }

          let code = _.get(res, "data.code");
          let confirm_data = {};
          if (code == 200) {
            let  data = _.get(res, 'data.data');
            if(_.isArray(data)) {
              _.forEach(data, item=>{
                if(item && item.orderNo && item.frontSettleAmount) {
                  // 提交数据按钮显示金额设置
                  confirm_data[item.orderNo] = item
                }
              });
            }
          }
          // 获取出初始化数据
          this.get_init_data(confirm_data);
        });
      } else {
        // 获取出初始化数据
        this.get_init_data();
      }
    },
    get_init_data(data) {
       // 默认为10元
      let min_money = 10;
      if(_.isEmpty(this.setup_single_info)) {
        // 获取用户的配置
        this.setup_single_info = _.get(this.vx_get_user, 'cvo.single');
      }
      // 从用户配置中获取配置的最小金额
      if(!_.isEmpty(this.setup_single_info) && _.isPlainObject(this.setup_single_info)) {
        min_money = this.setup_single_info.min;
      }
      // 提前结算数据获取
      this.early_settlement_data = _.get(this.recordData, 'records', []);
      _.forEach(this.early_settlement_data, (item,index)=>{
        // 总的投注金额
        let order_amount_total = item.orderAmountTotal;
        // 如果做过提前结算
        if(item.preBetAmount) {
          // 重新计算最新的可提前结算金额
          order_amount_total = item.orderAmountTotal - item.preBetAmount;
        }
        // 设置最新的投注额四舍五入保留两位小数
        item.setBetAmount = _.round(order_amount_total, 2);
        // 最新的可提前结算金额四舍五入保留两位小数
        order_amount_total = _.round(order_amount_total, 2);
        /* // 盘口类型获取
        let market_type = _.get(item,'orderVOS.0.marketType');
        // 欧洲盘赔率
        let odds_value = _.get(item,'orderVOS.0.oddFinally') * 1000;
        // 获取对应的欧赔
        let odd = market_type=='EU'? odds_value : (1000 + odds_value); */
        // 概率
        // let probabilities = _.get(item,'orderVOS.0.probabilities');
        let computed_bet_amount;
        computed_bet_amount = _.get(item,'maxCashout') || 0;
        item.settle_status = 0;
        // 结算状态 1:(AVAILABLE)可以正常提前结算 -1, UNAVAILABLE-2:CLOSE
        item.cash_out_status = 1;
        // 确认的数据存在
        if(data && data[item.orderNo]) {
          let confirm_obj = data[item.orderNo];
          if(confirm_obj.preSettleOrderStatus==0) {
            // 设置状态为开始结算
            item.bet_status = 'start_bet_pre';
            // 设置确认状态
            item.bet_confirm = true;
            // 清除过滤未结算和是提前结算定时器
            this.$emit('clear_timer_get_cashout')
          } else if(confirm_obj.preSettleOrderStatus==2) {
            item.bet_status = 'default';
            item.bet_confirm = false;
          }
          item.pre_settle_order_status = confirm_obj.preSettleOrderStatus;
          if(confirm_obj.frontSettleAmount>0&&confirm_obj.preSettleOrderStatus!=1) {
            // 上次按钮上的金额  提前结算状态为确认中或拒单才使用上次数据
            item.frontSettleAmount = confirm_obj.frontSettleAmount;
          } else {
            item.frontSettleAmount = computed_bet_amount || 0;
          }
        } else {
          item.frontSettleAmount = computed_bet_amount || 0;
        }
        // 计算金额
        item.computed_bet_amount = computed_bet_amount || 0;
        // 计算金额步长
        let step = order_amount_total/4;
        //  滑块上五个点数据设置
        let bet_amount_data = [
          {id: 0, name: '0'},
          {id: step * 1, name: '25'},
          {id: step * 2, name: '50'},
          {id: step * 3, name: '75'},
          {id: step * 4, name: '100'}
        ];

        // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
        let money_obj_ = {
          min_money,
          max_money: order_amount_total,
          money: order_amount_total,
          step,
          bet_amount_data
        };
        // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
        this.$set(this.money_obj, `${index}`,money_obj_);
      });
      // 重置显示操作
      this.reset_show_operate();
      if(this.early_settlement_data.length>0) {
        // 设置页面加载状态
        this.data_state.load_data_state = "data";
      }
    },
    // 提前结算实时查询最高返还批量后初始化数据
    get_init_cash_out_data(num) {
       // 默认为10元
      let min_money = 10;
      if(_.isEmpty(this.setup_single_info)) {
        // 获取用户的配置
        this.setup_single_info = _.get(this.vx_get_user, 'cvo.single');
      }
      // 从用户配置中获取配置的最小金额
      if(!_.isEmpty(this.setup_single_info) && _.isPlainObject(this.setup_single_info)) {
        min_money = this.setup_single_info.min;
      }
      // 提前结算数据获取
      this.early_settlement_data = _.get(this.recordData, 'records', []);
      let item = this.early_settlement_data[num]
        // 总的投注金额
        let order_amount_total = item.orderAmountTotal;
        // 如果做过提前结算
        if(item.preBetAmount) {
          // 重新计算最新的可提前结算金额
          order_amount_total = item.orderAmountTotal - item.preBetAmount;
        }
        // 设置最新的投注额四舍五入保留两位小数
        item.setBetAmount = _.round(order_amount_total, 2);
        // 最新的可提前结算金额四舍五入保留两位小数
        order_amount_total = _.round(order_amount_total, 2);
        let computed_bet_amount;
        computed_bet_amount = _.get(item,'maxCashout') || 0;
        item.settle_status = 0;
        // 结算状态 1:(AVAILABLE)可以正常提前结算 -1, UNAVAILABLE-2:CLOSE
        item.cash_out_status = 1;
        item.frontSettleAmount = computed_bet_amount || 0;
        // 计算金额
        item.computed_bet_amount = computed_bet_amount || 0;
        // 计算金额步长
        let step = order_amount_total/4;
        //  滑块上五个点数据设置
        let bet_amount_data = [
          {id: 0, name: '0'},
          {id: step * 1, name: '25'},
          {id: step * 2, name: '50'},
          {id: step * 3, name: '75'},
          {id: step * 4, name: '100'}
        ];

        // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
        let money_obj_ = {
          min_money,
          max_money: order_amount_total,
          money: order_amount_total,
          step: this.money_obj[num].step,
          bet_amount_data
        };
        // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
        this.$set(this.money_obj, `${num}`,money_obj_);
        this.$forceUpdate();
    },
    /**
     * 推送后根据订单号设置提前结算按钮转台
     */
    set_pre_order_status({orderNo='', settle_status=0}) {
      if(orderNo) {
        let index = _.findIndex(this.early_settlement_data, item=>item.orderNo==orderNo);
        if(index>-1) {
          // 设置确认状态默认false
          this.$set(this.early_settlement_data[index], "bet_confirm", false);
          // 结算成功
          if(settle_status==1) {
            clearTimeout(this.timer_obj[`${index}_settle_status`]);
            // 设置提前结算code码
            this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 1);
            // 设置结算状态
            this.$set(this.early_settlement_data[index], "bet_status", "end_bet_pre");
            // 重置过滤未结算和是提前结算定时器
            this.$emit('res_timer_get_cashout')
            this.show_bet_slide(index)
            // 重置提前结算数据
            this.re_settlement(orderNo, index);
          } else if(settle_status==2) {
            clearTimeout(this.timer_obj[`${index}_settle_status`]);
            // 设置错误码
            this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 999);
            // 设置提前结算按钮状态
            this.$set(this.early_settlement_data[index], "bet_status", "default");
            // 重置过滤未结算和是提前结算定时器
            this.$emit('res_timer_get_cashout')
            // 恢复计算金额
            this.$set(this.early_settlement_data[index], "frontSettleAmount",0);
            // 提前结算单被拒
            this.is_cancel = true
          }
          // 设置提前结算状态(推送状态)
          this.$set(this.early_settlement_data[index], "settle_status", settle_status);
          // 获取提前结算code吗
          let code = _.get(this.cur_bet_pre,`${index}.bet_pre_code`);
          // 5S后恢复默认code
          this.reset_bet_code(index, `${index}_bet_pre_${code}`);
        }
      }
    },
    // 设置ws推送过来的消息
    set_ws_info_data(obj) {
      if(!_.isEmpty(obj)) {
        for(let [orderNo, record] of Object.entries(obj)) {
          let index = _.findIndex(this.early_settlement_data, item=>item.orderNo==orderNo);
          if(index > -1) {
            let early_obj = this.early_settlement_data[index];
            // 盘口id
            let hid = _.get(record, 'orderVOS.0.marketId');
            // 投注项id
            let oid = _.get(record, 'orderVOS.0.playOptionsId');
            // 订单上的概率
            // let probabilities = _.get(early_obj, 'orderVOS.0.probabilities');
            if(early_obj) {
              // 提前结算盘口id和投注项id
              let { marketId, playOptionsId } = early_obj.orderVOS[0];
              // 盘口匹配上则合并状态
              if(hid == marketId) {
                // cashOutStatus值合并
                early_obj.cash_out_status = record.cash_out_status;
                // 盘口状态合并
                early_obj.orderVOS[0].hs = record.hs;
              }
              // 设置提前结算开关状态
              if(!early_obj.enablePreSettle && record.cash_out_status==1) {
                early_obj.enablePreSettle = true;
              }
              // 获取提前就是那按钮状态
              // let bet_status = early_obj.bet_status;
              // 订单总投注额
              let order_amount_total = early_obj.orderAmountTotal;
              early_obj.setBetAmount = order_amount_total;
            }
          }
        }
        this.$forceUpdate();
      }
    },
    /**
     * 恢复默认code
     */
    reset_bet_code(index,filed='') {
      // 清除定时器
      clearTimeout(this.timer_obj[filed]);
      // 设置定时器
      this.timer_obj[filed] = setTimeout(()=>{
        this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 0);
      },5000);
    },
    /**
     * 恢复默认操作
     */
    reset_show_operate() {
      // 当前操作做非空判断
      if(!_.isEmpty(this.cur_bet_pre)) {
        // 对所欲的操作进行充值
        for(let key of Object.keys(this.cur_bet_pre)) {
          if(key>-1) {
            // 显示操作复位
            this.$set(this.cur_bet_pre,`${key}.show_operate`, '');
            // 查看详情做复位
            this.$set(this.cur_bet_pre, `${key}.show_detail`, false);
          }
        }
      }
      // 当前提前结算对象初始化
      this.cur_bet_pre = {};
      // 提前结算订单列表初始化
      this.pre_order_list_obj = {};
    },
    /**
     * 重新结算
     * code 接口返回的状态码
     */
    re_settlement(orderNo, code) {
      let index = -1;
      for(let key in Object.keys(this.cur_bet_pre)) {
        if(_.get(this.cur_bet_pre,`${key}.orderNo`)==orderNo) {
          index = key;
          break;
        }
      }
      if(index==-1) return;
      clearTimeout(this.timer_obj[`bet_pre_${code}`]);
      // 第一次部分结算后按钮回复出事状态
      let settlment_data = this.early_settlement_data[index];
      // 获取提前结算提交的金额
      let submit_amount = settlment_data.submit_amount;
      // 提前结算的金额
      let order_amount = settlment_data.setBetAmount;
      // 计算金额重置
      this.$set(settlment_data, 'amount', '');
      // 金额变化 并且提交金额小于投注额 并且提前结算金额不为空
      if(_.get(settlment_data,'changeMoney', false) &&
        settlment_data.setBetAmount>submit_amount &&
        !settlment_data.preBetAmount) {
        // 被ws推送拒单过，是二次结算，不走下面逻辑
        if(this.is_cancel||settlment_data.preBetAmount==0) return;
        // 5S后回复出事状态
        this.timer_obj[`bet_pre_${code}`] = setTimeout(()=>{
          // 重置提前结算code吗
          this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 0);
          // 重新计算剩余金额
          order_amount = order_amount - submit_amount;
          // 金额保留两位小数
          let money = _.round(order_amount, 2);
           // 提前结算计算金额
          let computed_bet_amount;
          // 获取提前结算概率
            computed_bet_amount = _.get(settlment_data,'maxCashout') - _.get(settlment_data,'computed_bet_amount');
          // 设置提前结算计算金额
          this.$set(settlment_data,'computed_bet_amount', computed_bet_amount);
          // 按钮显示金额
          this.$set(settlment_data, 'frontSettleAmount', computed_bet_amount);
          // 提前结算类型设置为部分提前结算
          this.$set(settlment_data, 'settleType', 4);
          // 提前结算金额设置为提交金额
          this.$set(settlment_data, 'preBetAmount', submit_amount);
          // 提前结算状态设置为默认
          this.$set(settlment_data, 'bet_status','default');
          // 提前结算推送状态设置为默认
          this.$set(settlment_data, 'settle_status',0);
          // 组件步长金额的计算
          let step = _.round(money,2)/4;
          //  滑块上五个点数据设置
          let bet_amount_data = [
            {id: 0, name: '0'},
            {id: step * 1, name: '25'},
            {id: step * 2, name: '50'},
            {id: step * 3, name: '75'},
            {id: step * 4, name: '100'}
          ];
          // 金额对象组装
          let money_obj_ = {
            money,
            max_money: money,
            step,
            bet_amount_data
          };
          // 金额对象更新
          Object.assign(this.money_obj[index], money_obj_);
          // 设置当前操作的金额
          this.$set(this.money_obj, `${index}.money`, money);
          // 设置当前操作的最大金额
          this.$set(this.money_obj, `${index}.max_money`, money);
          // 设置最新的步长值
          this.$set(this.money_obj, `${index}.step`, step);
          // 设置滑块数据对象
          this.$set(this.money_obj, `${index}.bet_amount_data`, bet_amount_data);
          // 重置显示的操作
          this.reset_show_operate();
        },5000);
      }
    },
    /**
     * 金额格式设置
     */
    format_balance(num) {
      if(num) {
				let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
				// 保留两位小数
				let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
				let _num = _split[1] + '.' + decimal
				return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
			}
			return '0.00';
    },
    /**
     * 提前结算按钮金额格式设置
     */
    format_btn_balance(num) {
      if(num) {
        let _num = Number(num).toFixed(2)
				return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
			}
			return '0.00';
    },
    /**
		* @description: 提前结算实时查询 更新数据
		*/
    get_max_cashout() {
      let list = this.early_settlement_data
       _.forEach(list, (item, index)=> {
         // 提前结算实时查询 是否包含该条数据
         let num = _.findIndex(this.orderNo_data_obj, { 'orderNo': item.orderNo })
         let bet_status = _.get(this.early_settlement_data[index], "bet_status")
         if(bet_status != 'end_bet_pre') {
            if(num>-1) {
            let maxCashout = _.get(this.orderNo_data_obj,`${num}.preSettleMaxWin`) || 0;
            let preBetAmount = _.get(this.orderNo_data_obj,`${num}.preBetAmount`);
            let orderStatus = _.get(this.orderNo_data_obj,`${num}.orderStatus`);
            let preSettleBetAmount = _.get(this.early_settlement_data,`${index}.preSettleBetAmount`)
            let maxCashout_ = _.get(this.early_settlement_data,`${index}.maxCashout`)
            let preBetAmount_ = _.get(this.early_settlement_data,`${index}.preBetAmount`)
            let orderStatus_ = _.get(this.early_settlement_data,`${index}.orderStatus`)
            // 投注总金
            let orderAmountTotal = _.get(this.early_settlement_data,`${index}.orderAmountTotal`)
            // 数据是否有更新，有更新则替换数据
            if(maxCashout != maxCashout_ || orderStatus != orderStatus_ || preBetAmount != preBetAmount_) {
                this.$set(this.early_settlement_data[index], 'maxCashout', maxCashout)
                // 注单剩余本金
                this.$set(this.early_settlement_data[index], 'preSettleBetAmount', this.$mathjs.subtract(orderAmountTotal, preBetAmount_||preBetAmount||0))
                this.$set(this.early_settlement_data[index], 'preBetAmount', preBetAmount)
                this.$set(this.early_settlement_data[index], 'orderStatus', orderStatus)
                this.$set(this.money_obj, `${index}.money`, _.get(this.early_settlement_data,`${index}.preSettleBetAmount`))
                this.get_init_cash_out_data(index)
            }
            }
        }
         
       })
    },
    /**
		* @description: 提前结算可用次数
		*/
    betPreCount(item, index) {
      let min_money = _.get(this.money_obj,`${index}.min_money`);
      let preSettleBetAmount = item.preSettleBetAmount
      if (preSettleBetAmount<=min_money) {
        return 1;
      } else {
        return item.preBetAmount?1:2;
      }
    },
    /**
		* @description: 单剩余本金
		*/
    betPreRemaining(item) {
      return this.$mathjs.subtract(item.orderAmountTotal, item.preBetAmount || 0)
    }
  },
  mounted() {
    this.toolWords = this.$root.$t("time.time_date_list_1"); // ["今天", "昨天", "七天内", "一个月内"]
  },
  destroyed(){
    // 关闭设置提前结算状态事件
    this.$root.$off(this.emit_cmd.EMIT_SET_PRE_ORDER_STATUS_CMD, this.set_pre_order_status);
    // 关闭ws推送数据事件
    this.$root.$off(this.emit_cmd.EMIT_SET_WS_INFO_DATA_CMD, this.set_ws_info_data);
    // 清除定时器
    clearTimeout(this.timeout_toast);
    this.money_obj = {};
    for(let key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    // 恢复提前结算订单对象
    this.pre_order_list_obj = {};
    // 恢复操作天前结算对象
		this.cur_bet_pre = {};
    // 恢复单关设置对象
    this.setup_single_info = {};
    // 恢复定时器对象
    this.timer_obj = {};
    this.color_list = null;
    // 恢复提前结算数据
    this.early_settlement_data = null;
  }
};
</script>

<style lang="scss" scoped>
//押注记录表单
.record-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 12px;
  //无数据
  &.no-record-data {
    padding-bottom: 0!important;
  }

  .tool {
    display: flex;
    width: 100%;
    height: auto;
    user-select: none;
    .tool-item {
      padding: 10px 30px;
      border-radius: 1px 1px 0 0;
      cursor: pointer;
    }
  }
  //整个表单内容
  .data-table {
    flex: 1;
    width: 100%;
    border-right: none;
    border-bottom: none;
    font-size: 12px;
    //表单内容
    .data-table-content {
      flex: 1;
      ::v-deep {
        .full-width {
          //表单内容
          .r-table {
            width: 100%;
            height: 100%;
            .load-data-wrap {
              height: 100%;
            }
          }
        }
      }
    }
    .row {
      //标题
      &.head {
        padding: 0;
        height: 30px;
        .ceil {
          padding: 0 0 0 20px !important;
          border: none;
          height: 100%;
          &:first-child,
          &:last-child {
            display: flex;
            justify-content: center;
            padding: 0 !important;
          }
        }
      }
      .ceil {
        display: flex;
        flex-flow: column;
        justify-content: center;
        padding: 12px 0 12px 20px;
        border-top: none;
        border-left: none;
        //第一个子元素
        &:nth-child(1) {
          align-items: center;
          padding-left: 0;
          width: 50px;
        }
        //第二个子元素
        &:nth-child(2) {
          width: 160px;
          user-select: text;
        }
        //第三个子元素
        &:nth-child(3) {
          padding: 12px 20px;
          width: 130px;
        }
        //第四个子元素
        &:nth-child(4) {
          flex: 1;
          flex-flow: column;
          align-items: flex-start;
          .ceil-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            width: 100% !important;
            line-height: 23px;
            //赛马信息
            .match-name-wrap {
              display: flex;
              align-items: center;
              .ranking-bg {
                margin-right: 7px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                div {
                  width: 12px;
                  height: 12px;
                  margin-right: 2px;
                }
              }
              .market_value {
                margin-right: 20px;
              }
            }
            .both-item {
              line-height: 16px;
            }
            .item-result {
              margin-right: 20px;
              width: 48px;
              text-align: right;
            }
            &:last-child {
              margin: 0;
            }
          }
        }
        //第五个子元素
        &:nth-child(5) {
          width: 105px;
        }
        //第六个子元素
        &:nth-child(6) {
          width: 105px;
        }
        //第七个子元素
        &:nth-child(7) {
          padding-left: 0;
          width: 106px;
          text-align: center;
        }
        //注单号
        .order-no {
          display: flex;
          margin-top: 2px;
          .copy {
            display: flex;
            align-items: center;
            margin-left: 5px;
            cursor: pointer;
          }
        }
        .bet-pre-detail {
          cursor: pointer;

          /*  箭头向下样式 */
          .icon-pull-down:before {
            transform: rotate(180deg);
            margin-left: 6px;
          }
          /*  箭头向上样式 */
          .icon-pull-up:before {
            transform: rotate(0deg);
            margin-left: 6px;
          }
        }
      }
    }
    //标题
    .head {
      .ceil {
        &:first-child {
          border: none;
        }
      }
    }
    .bottom-hiden {
      border-bottom: 0px !important;
    }
    .top-hiden {
      border-top: 0px !important;
    }
    .left-hiden {
      border-left: 0px !important;
    }
    .right-hiden {
      border-right: 0px !important;
    }
    .pre-bet-part {
      font-size: 12px;
      font-weight: 400;
    }
    .red-bg {
      display: inline-block;
      margin-left: 5px;
      width: 38px;
      height: 16px;
      font-size: 12px;
      text-align: center;
      border-radius: 2px;
    }
    .bet-info {
      cursor: pointer;
      margin-left: 5px;
      margin-top: -2px;
    }
  }
  .bet-tips-info {
    display: flex;
    font-size: 12px;
    .tips-info {
      margin-left: 5px;
    }
  }

  ::v-deep .load-data-wrap {
    .refresh {
      padding-top: 5%;
    }
  }
}
.play-type {
  & > span {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.info-wrap {
  width: 190px;
  line-height: 1;
  div {
    margin-top: 10px;
  }
  .bet-pre-wrap {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 0px;
    .bet-pre-btn {
      flex: 1;
      height: 40px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;

      div {
        height: 20px;
        &.bet-row-1 {
          margin-top: 4px;
        }
        &.bet-row-2 {
          margin-top: -3px;
        }
      }
    }
    .bet-pre-handle {
      width: 30px;
      cursor: pointer;
      .bet-pre-info {
        margin-left: 10px;
      }
    }
    &.bet-pre-stop {
      .bet-pre-btn {
        border: 0px;
        border-radius: 4px;
        line-height: 40px;
      }
    }
  }
  .bet-money {
    margin-left: 5px;
  }
  .bet-compute-money {
    margin-bottom: 25px;
    ::v-deep .vue-slider {
      cursor: pointer;
      .vue-slider-rail {
        .vue-slider-marks {
          .vue-slider-mark {
            .custom-label {
              width: 22px;
              height: 10px;
              font-family: PingFangSC-Regular;
              font-size: 10px;
            }
            &:first-child {
              .custom-label {
                opacity: 0;
              }
            }
          }
        }
      }
      .vue-slider-mark-step {
        background-color: #D8D8D8;
        width: 1px;
        height: 3px;
        margin-top: 6px;
        border-radius: 0;
      }
    }
  }
  .bet-pre-confirm-btn {
    flex: 1;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;

    div {
      text-align: center;
      height: 20px;
      &.bet-row-1 {
        padding-top: 6px;
      }
      &.bet-row-2 {
        margin-top: 3px;
      }
    }
  }
  .bet-pre-confirming-btn,
  .bet-pre-complete-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    column-count: 3;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    .bet-pre-left {
      width: 80%;
      height: 100%;
      text-align: center;
      div {
        height: 20px;
        &.bet-row-1 {
          margin-top: 2px;
        }
        &.bet-row-2 {
          margin-top: -3px;
        }
      }
    }
    .bet-pre-right {
      margin-top: 3px;
    }
  }
  .bet-pre-complete-btn {
    cursor: unset;
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
  color: #fff;
  background-color: #414655;
}

/*  赢 */
.win-color {
  color: #e93d3d;
}

/*  赛事取消 */
.cancel-color {
  color: #b58400;
}
.bet-pre-color {
  color: #ff7000;
}
.font-family {
  font-weight: 500;
}
</style>
<style lang="scss">
div.q-menu {
  border: 0 none !important;
}
div.select-item {
  border-left: 1px solid rgb(208, 216, 222);
  border-right: 1px solid rgb(208, 216, 222);
  &:first-child {
    border-top: 1px solid rgb(208, 216, 222);
  }
  &:last-child {
    border-bottom: 1px solid rgb(208, 216, 222);
  }
}

//对阵信息后面需加上一个提示
.bet-bg-tooltip {
  background: #A3AFBF;
  color: #FFFFFF;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  /**提示信息样式*/
  .score_info_style{
    padding-top:5px;
    padding-bottom:5px;
    padding-left:5px;
    word-break:break-all;
  }
}
</style>
