<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 押注记录表单  左边菜单里面那个
-->
<template>
  <!--表单-->
  <div class="record-table col" :class="{'no-record-data': early_settlement_data.length == 0}">
    <!--表格-->
    <div class="data-table column">
      <!--表单头部标题-->
      <div class="row head">
        <!--列-->
        <div class="ceil">
          {{ i18n_t('bet_record.number')}}
          <!-- 编号 -->
        </div>
        <!--列-->
        <div class="ceil">
          {{ i18n_t('bet_record.betting_details')}}
          <!-- 投注详情 -->
        </div>
        <!--列-->
        <div class="ceil">
          {{ i18n_t('bet_record.betting_play')}}
          <!-- 投注玩法 -->
        </div>
        <!--列-->
        <div class="ceil">
          {{ i18n_t('bet_record.options')}}
          <!-- 选项 -->
        </div>
        <!--列-->
        <div class="ceil">
          {{ i18n_t('bet.bet_book_stake')}}
          <!-- 预约投注额 -->
        </div>
        <!--列-->
        <div class="ceil" v-if="is_book_status[0]==='0'">
          {{ i18n_t('common.maxn_amount_val')}}
          <!--最高可赢 -->
        </div>
        <!--列-->
        <div class="ceil">
          {{ i18n_t('bet_record.status')}}
          <!-- 状态 -->
        </div>
      </div>
      <!--表单内容-->
      <div class="data-table-content" ref="table">
        <load-data class="fit" color="light" :state="data_state.load_data_state">
          <!--quasar自定义滚动条-->
          <q-scroll-area
            ref="scrollArea"
            class="rule-scroll-area"
            :style="{height: '100%'}"
          >
          <!--表格内容-->
            <div class="r-table">
              <!--early_settlement_data用于预约的数据-->
              <template v-for="(data, index_) in early_settlement_data" :key= "index_">
                <div class="row" :class="`status-${data.orderStatus} outcome-${data.orderOutCome}`">
                  <!-- 编号 -->
                  <div class="ceil">{{recordData.size*(recordData.current-1) + index_ + 1}}</div>
                  <!-- 投注详情 -->
                  <div class="ceil">
                    <div>{{formatTime(data.betTime, lang=='vi'?'hh:MM:ss dd/mm/yyyy':'yyyy-mm-dd hh:MM:ss')}}</div>
                    <!-- 订单号 -->
                    <div class="order-no">
                      <span>{{data.orderNo}} {{data.copy_color}}</span>
                      <!-- 复制 -->
                      <span
                        class="copy"
                        @click="copy(data.orderNo)"
                      >
                        <icon name="icon-icon_copy"/>
                      </span>  
                    </div>
                  </div>
                  <!-- 投注玩法名称 -->
                  <div class="ceil c134 play-name">
                    <div>
                      <!-- 串关 -->
                      <template v-if="data.seriesType != '1' || data.seriesType == '3'">{{data.seriesValue}}</template>
                      <!-- 单关 -->
                      <template v-else>
                        <template v-for="(item, index) in data.detailList">
                          {{matchType(item.matchType, data.langCode)}} {{item.playName}}
                          <span
                            v-if="item.matchType != 1 && item.scoreBenchmark"
                            :key="index"
                          >({{format_score(item.scoreBenchmark )   }})</span>
                        </template>
                      </template>
                    </div>
                  </div>
                  <!-- 选项 -->
                  <div class="ceil c135">
                    <div class="ceil-options" v-for="(item, j) in data.detailList" :key="j">
                      <div style="flex:1;">
                        <!-- [足球]  世界杯2022亚洲外围赛 item.outrightYear-->
                        <div>
                          <div class="row appoint-status">
                            <div class="col">[{{item.sportName}}]{{item.matchName}}&nbsp;&nbsp;</div>
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
                              <span class="market_value">{{item.playOptionName}}</span>
                            </template>
                          </div>
                          <!-- 云达不莱梅 -0.5 -->
                          <span v-else class="market_value">{{item.playOptionName}}</span>
                          <!-- 1.98 -->
                          <span
                            class="market-value-text"
                            :class="{
                              'text-blue': (item.oddFinally.indexOf('-')!=-1)&&(data.marketType=='MY'||data.marketType=='ID'),
                              'text-orange': (item.oddFinally.indexOf('-')>-1)&&(data.marketType=='MY'||data.marketType=='ID'),
                            }"
                          >
                            <span>{{ format_odds(item.oddFinally)  }}</span>
                          </span>
                        </div>
                        <!-- 赛前 全场赛果 -->
                        <div class="play-type" v-if="!data.acCode">
                          <span v-if="item.matchType != 3 && ![1001,1002,1009,1010,1011].includes(item.sportId*1)">{{matchType(item.matchType, data.langCode)}}</span>
                          <!-- 玩法名称 -->
                          <span>{{item.playName}}</span>
                          <!-- （1-1） -->
                          <span v-if="item.matchType != 1 && item.scoreBenchmark">({{  format_score(item.scoreBenchmark) }})</span>
                          <!-- [欧洲盘]-->
                          <span>[{{marketType(item.marketType, data.langCode)}}]</span>
                        </div>
                        
                        <div class="play-type both-item" v-if="item.matchType != 3">
                          <!-- 拜仁慕尼黑 v 云达不莱梅 -->
                          <span v-if="item.sportId*1 < 1002||item.sportId == '1004'">{{item.matchInfo}}</span>
                          <!-- 赛事开始时间10/20 15:30 -->
                          <span v-if="!data.acCode">{{formatTime(item.beginTime, lang=='vi'?'hh:MM dd/mm':'mm/dd hh:MM')}}</span>
                        </div>
                        <div class="play-type settle-score" v-if="tool_selected == 1 && item.settleScore">
                          <!-- 赛果比分 -->
                          <span>{{item.settleScore}}</span>
                        </div> 
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
                            <span v-else class="bet-result lose-color">{{ i18n_t("bet.invalid")}}</span>
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
                          <!-- 输赢状态calss -->
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
                            <!-- 取消原因 -->
                            <span 
                              v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)" 
                              class="bet-result lose-color"
                            >
                              {{item_cancelType(item.cancelType)}}
                            </span>
                            <span v-else class="bet-result lose-color">{{data.seriesType =='1'?'':`${i18n_t("bet.invalid")}`}}</span>
                          </template>
                          <template v-if="item.betStatus ==1">
                            <span
                              v-if="[7,8,11,12,15].includes(item.betResult)"
                              class="bet-result lose-color"
                            >{{item_status(item.betResult)}}</span>
                            <span
                              v-else
                              class="bet-result lose-color"
                            >{{data.seriesType =='1'?'':`${i18n_t("bet.invalid")}`}}</span>
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
                  <!-- 最高可赢 -->
                  <div class="ceil font-family" v-if="is_book_status[0]==='0'">
                    <span> {{format_balance(data.maxWinAmount)}}</span>
                  </div>
                  <!-- 状态 -->
                  <!-- appoint_order_status为投注预约时取值为 0: 进行中 2: 已失效
                  appoint_status(0预约中 ;1预约成功;2.风控预约失败;3.风控取消预约注单.4.用户手动取消预约投注) -->
                  <div class="ceil">
                      <span v-if="data.preOrderStatus==0" class="book_status">
                        {{ i18n_t('bet.bet_booking')}}
                      </span>
                      <span v-if="data.preOrderStatus==0" class="book_cancel cursor-pointer" @click.stop="cancel_appoint(data)">
                        {{ i18n_t('select.cancel')}}
                      </span>
                      <span v-if="[2, 3].includes(data.preOrderStatus)" class="book_status book_failed">
                        {{ i18n_t('bet.bet_book_failed')}}
                      </span>
                      <span v-if="data.preOrderStatus==4" class="book_status">
                        {{ i18n_t('bet.bet_book_canceled')}}
                      </span>
                  </div>
                </div>
              </template>
            </div>
          </q-scroll-area>
        </load-data>
      </div>
    </div>
    <template v-if="parseInt(recordData.total)">
      <!--分页组件-->
      <pagination-wapper
        class="record-pagination"
        :count="recordData.total"
        :betTotalAmount="recordData.betTotalAmount"
        :effectiveFlow="recordData.effectiveFlow"
        :profit="recordData.profit"
        :toolSelected="tool_selected"
        :random="random"
        @pageChange="changePage(arguments)"
      ></pagination-wapper>
    </template>
    <!--复制样式 已复制-->
    <div class="toast fit-center" v-if="toast">{{toast_msg}}</div>
    <!-- 预约取消弹窗窗 -->
    <q-dialog v-model="bookShow" persistent>
        <q-card class="book-dialog">
          <q-card-section class="row items-center">
            <div class="book-msg">{{ cancel_book_msg(matchInfo, i18n_t('bet.bet_book_cancel_msg')) }}</div>
          </q-card-section>

          <q-card-actions align="center">
            <div class="cursor-pointer book-record book-record-cancel" :disabled="book_loading" @click="close_book_dialog">
              <!--确认中-->
              {{ i18n_t('select.cancel')}}
            </div>
            <div class="cursor-pointer book-record book-record-submit" :disabled="book_loading" @click="cancel_book_handle">
              <!--确认中-->
              {{ i18n_t('select.confirm')}}
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
  </div>  
</template>

<script setup>

// import formatmixin from "src/public/mixins/common/time_format";
// import Pagination from "project_path/src/components/bet_record/Pagination.vue";
import { PaginationWapper } from "src/components/pagination/index.js";
import { onMounted, onUnmounted, ref, watch } from "vue";
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'
import lodash from "lodash";
import { format_score ,format_odds,formatTime  } from "src/core/format/index.js";
import { i18n_t } from "src/boot/i18n.js"
import BetCommonHelper from "src/core/bet/common-helper/index.js";


  // mixins: [formatmixin],
  const props = defineProps({
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
    is_book_status: {
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
  })
    const toolIndex = ref(0)
    const recordData = ref({})
    const current = ref(1)
    const toPage = ref(1)
    const selectOptions = ref([
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
      ]) 
    const toast = ref(false) 
    const toast_msg = ref('') 
    const isShow = ref(true) 
    const timeout_toast = ref(null) // 定时器
    const early_settlement_data = ref([])  // 用于预约的数据
    const pup_data = ref({}) //赛事信息数据
    const moreStyle = ref({
				left: 0,
				top: 0
			})
    const bookShow = ref(false) // 取消预约投注弹窗
    const orderNo = ref('') // 取消预约投注订单号
    const book_loading = ref(false) // 取消预约投注确认中
    const matchInfo = ref("") 
onMounted(() => {
      // 防抖
    cancel_book_handle.value = lodash.debounce(cancel_book_handle,100)
    recordData.value = props.order_list;
})
 watch(() => props.order_list, (val) => {
  // let scroll_area =  BetCommonHelper.get_refs_info('scrollArea', null, this);
  //       if (scroll_area && scroll_area.setScrollPosition) {
  //         scroll_area.setScrollPosition(0);
  //       }
        recordData.value = val;
        init_data();

 })

    /**
     * @盘口类型
     * @param type: records.marketType字段
     */
    const marketType = (type, langCode='zh') => {
      var res = "";
      if(type && langCode) {
        switch (type) {
          case "EU":
            res = i18n_t(`${langCode}.odds.EU`); //"欧洲盘";
            break;
          case "HK":
            res = i18n_t(`${langCode}.odds.HK`); //"香港盘";
            break;
          case "US":
            res = i18n_t(`${langCode}.odds.US`); //"美式盘";
            break;
          case "ID":
            res = i18n_t(`${langCode}.odds.ID`); //"印尼盘";
            break;
          case "MY":
            res = i18n_t(`${langCode}.odds.MY`); //"马来盘";
            break;
          case "GB":
            res = i18n_t(`${langCode}.odds.GB`); //"英式盘";
            break;
          default:
            res = "";
            break;
        }
      }      
      return res;
    }

    /**
     * @输赢状态
     * @param type: records.detailList.betResult
     */
    const item_status = (type) => {
      switch (parseInt(type)) {
        case 2:
          return i18n_t("bet_record.effective_water_"); //"走水";
        case 3:
          return i18n_t("bet_record.lose"); //输
        case 4:
          return i18n_t("bet_record.win"); //赢
        case 5:
          return i18n_t("bet_record.win_half"); //"赢半";
        case 6:
          return i18n_t("bet_record.lose_half"); //"输半";
        case 7:
          return i18n_t("bet_record.match_cancel2"); //"赛事取消";
        case 8:
          return i18n_t("bet_record.match_delay"); //"赛事延期";
        case 11:
          return i18n_t("bet_record.match_delay2"); //"比赛延迟";
        case 12:
          return i18n_t("bet_record.match_interrupt"); //"比赛中断";
        case 13:
          return i18n_t("bet.invalid"); //"无效";
        case 16:
          return i18n_t("bet.invalid"); //"无效";
        case 15:
          return i18n_t("bet_record.match_give_up"); //"比赛放弃";
        default:
          return '';
      }
    }

    /**
    * @description: 取消原因
    * @return {}
    */
    const item_cancelType = (cancelType)=> {
      let str = '';
      switch (parseInt(cancelType)) {
        case 1:
          str =  i18n_t("bet_record.match_cancel2"); //"比赛取消";
          break;
        case 2:
          str = i18n_t("bet_record.match_delay"); //"比赛延期";
          break;
        case 3:
          str = i18n_t("bet_record.match_interrupt"); //"比赛中断";
          break;
        case 4:
          str = i18n_t("bet_record.match_rematch"); //比赛重赛
          break;
        case 5:
          str = i18n_t("bet_record.match_waist"); //"比赛腰斩";
          break;
        case 6:
          str = i18n_t("bet_record.match_give_up"); //"比赛放弃";
          break;
        case 17:
          str = i18n_t("bet_record.match_advance"); //"赛事提前";
          break;
        case 20:
         str = i18n_t("bet_record.match_delay2"); //"比赛延迟";
         break;
        default: 
          str = i18n_t("bet.invalid") //注单无效
          break;
      }
      return str;
    }

    /**
     * @输赢状态calss
     * @param betResult: records.detailList.betResult
     */
    const item_class = (betResult) => {
      let str = '';
      switch (parseInt(betResult)) {
        case 2:
          str = "lose-color"; //"走水";
          break;
        case 3:
          str = "lose-color"; //输
          break;
        case 4:
          str = "win-color"; //赢
          break;
        case 5:
          str = "win-color"; //"赢半";
          break;
        case 6:
          str = "lose-color"; //"输半";
          break;
        case 7:
          str = "lose-color"; //"赛事取消";
          break;
        case 8:
          str = "lose-color"; //"赛事延期";
          break;
        case 11:
          str = "lose-color"; //"比赛延迟";
          break;
        case 12:
          str = "lose-color"; //"比赛中断";
          break;
        case 13:
          str = "lose-color"; //"无效";
          break;
        case 16:
          str = "lose-color"; //"无效";
          break;
        case 15:
          str = "lose-color"; //"比赛放弃";
          break;
      }
      return str;
    }

    /**
     * @订单状态
     * @param orderStatus: records.orderStatus
     */
    const order_status = (orderStatus) => {
      switch (parseInt(orderStatus)) {
        case 0:
          return i18n_t("bet.bet_suc"); //"投注成功";
        case 1:
          return i18n_t("bet.bet_suc"); //"投注成功";
        case 2:
          return i18n_t("bet.betting_cancel"); //"注单无效";
        case 3:
          return i18n_t("bet.bet_loading"); //"确认中";
        case 4:
          return i18n_t("bet.bet_fail"); //"投注失败";
        default:
          return '';
      }
    }
    /**
     * @订单状态class
     * @param orderStatus: records.orderStatus
     */
    const status_class = (orderStatus) => {
      switch (parseInt(orderStatus)) {
        case 0:
          return ""; //"投注成功";
        case 1:
          return ""; //"投注成功";
        case 2:
          return "lose-color"; //"注单无效";
        case 3:
          return ""; //确认中
        case 4:
          return "win-color"; //投注失败
      }
      return "";
    }

    /**
     * @下注赛事阶段
     * @param type: records.matchType
     */
    const matchType = (type, langCode=$i18n.locale) => {
      let res = "";
      if(type && langCode) {
        switch (parseInt(type)) {
          case 1:
            res = i18n_t(`bet.morning_session`); //"早盘赛事";
            break;
          case 2:
            res = i18n_t(`bet.bowls`);//"滚球盘赛事";
            break;
          case 3:
            res = i18n_t(`bet.champion_handicap`); //"冠军盘赛事";
            break;
        }
      }
      return res;
    }

    /**
     * @翻页
     * @param data: 分页组件传值
     * size：每页条数
     * page：当前页码
     */
    const changePage = (data) => {
      $emit("choosePage", data);
    }

    /**
     * @点击复制单号
     * @param data：单号
     */
    const copy = (data) => {
      let oInput = document.createElement("input");
      oInput.value = data;
      document.body.appendChild(oInput);
      oInput.select();
      let msg = i18n_t("bet_record.copyed")
      toast_tips(msg)
      toast.value = true;
      document.execCommand("Copy");
      oInput.remove();
    }
    // 提示弹出窗
    const toast_tips = (msg) => {
      toast_msg.value = msg
      toast = true;
      clearTimeout(timeout_toast.value);
      timeout_toast.value = setTimeout(() => {
        toast = false;
      }, 1500);
    }
    /**
     * 初始化滑块以及预约数据
     */
    const init_data = () => {
      // 预约数据获取
      early_settlement_data.value = lodash.get(recordData.value, 'records', []);
      // 重置显示操作
      if(early_settlement_data.value.length>0) {
        // 设置页面加载状态
        props.data_state.load_data_state = "data";
      }
    }
    /**
     * 金额格式设置
     */
    const format_balance = (num) => {
      if(num) {
				let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
				// 保留两位小数
				let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
				let _num = _split[1] + '.' + decimal
				return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
			}
			return '0.00';
    }
    /**
    /**
     * 打开弹窗，关闭预约中定时器
     */
     const cancel_appoint = (item) => {
      bookShow.value = true
      orderNo.value = item.orderNo || ''
      matchInfo.value = item.detailList[0].matchInfo
      $emit('delete_book_record', 0, bookShow.value)
      }
    /**
     * 关闭弹窗，重启预约中定时器
     */
      const close_book_dialog = () => {
        bookShow.value = false
        orderNo.value = ''
        matchInfo.value = ''
        $emit('delete_book_record', 0, bookShow.value)
      }
      const cancel_book_handle = () => {
      // 调用接口取消注单后在回调投注记录接口
      book_loading.value = true
      const params = { orderNo: orderNo.value }
      cancel_book_record_order(params, (code, data, msg) => {
        if (code == 200) {
          toast_tips(i18n_t('bet.bet_book_canceled'))
          $emit('delete_book_record', orderNo.value, bookShow.value)
          bookShow.value = false
          orderNo.value = ''
          matchInfo.value = ''
        } else if (code == '0400546') {
          toast_tips(i18n_t('bet.bet_book_error_msg_0400546'))
          close_book_dialog()
        } else if (code == '0400547') {
          toast_tips(i18n_t('bet.bet_book_error_msg_0400547'))
          close_book_dialog()
        } else {
          toast_tips(msg)
          close_book_dialog()
        }
        book_loading.value = false
      })
    }
      const cancel_book_msg = (match, msg) => {
        if(match) {
          let match_ = match.replace(/ v /i, ' VS ')
          const arr = msg.split('[x]')
          return arr[0] + match_ + arr[1];
        }
      }
  onUnmounted(() => {
    // debounce_throttle_cancel(cancel_book_handle)
    // 清除定时器
    clearTimeout(timeout_toast.value);
    // 恢复预约数据
    early_settlement_data.value = null;
  })
</script>

<style lang="scss" scoped>
/* *表单* */
.record-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 12px;
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
  /* *表格* */
  .data-table {
    flex: 1;
    width: 100%;
    border-right: none;
    border-bottom: none;
    font-size: 12px;
    /* *表单内容* */
    .data-table-content {
      flex: 1;
      ::v-deep {
        .full-width {
          /* *表格内容样式* */
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
      /* *表单头部标题* */
      &.head {
        padding: 0;
        height: 30px;
        /* *列* */
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
        &:nth-child(1) {
          align-items: center;
          padding-left: 0;
          width: 50px;
        }
        &:nth-child(2) {
          width: 160px;
          user-select: text;
        }
        &:nth-child(3) {
          padding: 12px 20px;
          width: 130px;
        }
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
        &:nth-child(5) {
          width: 105px;
        }
        &:nth-child(6) {
          width: 105px;
        }
        &:nth-child(7) {
          padding-left: 0;
          width: 106px;
          text-align: center;
        }
        /*  订单号 */
        .order-no {
          display: flex;
          margin-top: 2px;
          /*  复制 */
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
</style>