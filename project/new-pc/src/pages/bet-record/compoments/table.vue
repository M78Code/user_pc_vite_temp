<template>
  <div class="custome-table">
    <div class="thead">
      <div
        class="td"
        v-for="item in columns"
        :key="item.name"
        :style="calcStyle(item)"
      >{{ item.label }}
      </div>
    </div>
    <div class="tbody">
      <div class="tr" v-for="(row, index) in rows.slice(0, 2)">
        <!--        编号-->
        <div class="td" :style="{
          width: tdWidth()
        }">
        <span>
                {{ getRowIndex(index) }}
              </span>
        </div>
        <!-- 投注详情 -->
        <div class="td" :style="{
          width: tdWidth()
        }">
              <span>{{
                  formatTime(row.betTime, 'yyyy-mm-dd hh:MM:ss')
                }}</span>
          <div>
            <span class="datails-order">{{ row.orderNo }}</span>
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/bet_copy.png`" alt="" class="copy_icon"
                 :title="i18n_t('ouzhou.record.copy')" @click="hand_copy(row.orderNo)">
            <!-- <img :src="bet_copy" alt="" class="copy_icon" title="copy"  @click="copy(row.orderNo)" > -->
            <!-- <i class="icon-icon_copy copy" color="red" @copy_iconclick="copy(row.orderNo)"></i> -->
          </div>
        </div>

        <!-- 投注玩法 -->
        <div class="td" :style="{
          width: tdWidth()
        }">
          <!-- 串关 -->
          <template v-if="row.seriesType != '1' || row.seriesType == '3'">{{row.seriesValue}}</template>
          <!-- 单关 -->
          <template v-else>
            <template v-for="(item, index) in row.orderVOS" :key="index">
              <div>{{matchType(item.matchType, row.langCode)}}</div>
              <span>
                  {{ item.playName }}
                  <span
                    v-if="item.matchType != 1 && item.scoreBenchmark && item.playId != '334'"
                    :key="index"
                  >({{format_score(item.scoreBenchmark) }})</span>
                </span>
            </template>
          </template>
        </div>
        <!-- 投注选项 -->
        <div class="td" :style="{
          width: tdWidth()
        }">
          <div class="detail-options">
            <div class="record-detail-list">
              <div v-for="(item, index) in row.orderVOS" :key="index" class="record-detail">
                <div class="record-detail-item">
                  <div class="record-detail-icon">

                    <sport-icon :sport_id="cts_mid.includes(row.managerCode*1) ? item.sportId == 1 ? '90': 91  : item.sportId" key_name="pc-left-menu-bg-image" size="18" class="icon"  style="margin:0 10px"/>
                  </div>
                  <span> {{ item.matchName }}</span>
                  <span v-if="item.matchType !=3" style="color:#8A8986">{{ item.matchInfo }}</span>
                  <span>
                          <span v-if="item.matchType != 3 && ![1001,1002,1009,1010,1011].includes(item.sportId*1)">{{matchType(item.matchType, row.langCode)}}</span>
                        {{ item.playName }}
                    <!-- （1-1） -->
                          <span v-if="item.matchType != 1 && item.scoreBenchmark && item.playId != '334'">({{format_score(item.scoreBenchmark)}})</span>
                    <!-- [欧洲盘]-->
                          <span>[{{marketType(item.marketType, row.langCode)}}]</span></span>
                  <div>
                    <span>{{ item.marketValue }}</span>
                    <span style="margin-left:15px;color:#ff7000">@{{ item.oddFinally }}</span>
                  </div>

                  <div class="play-type settle-score" v-if="current_tab === 'settled' && item.settleScore">
                    <!-- 赛果比分 -->
                    <span>{{item.settleScore}}</span>
                  </div>
                  <!-- 10/20 15:30 -->
                  <span
                    class="time"
                    v-if="!row.acCode && item.beginTime&&row.seriesType!=3"
                  >{{formatTime(item.beginTime, lang=='vi'?'hh:MM dd/mm':'mm/dd hh:MM')}}</span>

                  <!-- <span style="color:#8A8986">bet closed:{{
                    formatTime(item.beginTime, "yyyy-mm-dd hh:MM:ss")
                  }}
                  </span> -->
                </div>
                <!-- 赢 -->
                <!-- 投注项结算状态展示条件，未处理，已处理，注单无效
                未结算串关、已结算串关
                已结算+单关+betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输)
                已结算注单无效
                v-if="data.outcome"如果outcome等于null或者undefined就不显示
                -->
                <div class="item-result" v-if="row.outcome">
                  <!--                    <span-->
                  <!--                      class="bet-result"-->
                  <!--                      :class="{-->
                  <!--                        'win-color': 0-->
                  <!--                      }"-->
                  <!--                    >-->
                  <!--                      win-->
                  <!--                    </span>-->
                  <!-- 未结算串关、已结算串关 -->
                  <template v-if="['0','1'].includes(row.orderStatus) && row.seriesType != '1'">
                    <!-- betstatus无效 -->
                    <template v-if="[3, 4].includes(item.betStatus)">
                            <span
                              v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                              class="bet-result lose-color"
                            >
                              {{item_cancelType(item.cancelType)}}
                            </span>
                      <span v-else class="bet-result lose-color">{{i18n_t("bet.invalid")}}</span>
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
                  <template v-if="row.preBetAmount>0">
                          <span
                            v-if="row.orderStatus=='1' && row.seriesType =='1'"
                            class="bet-result"
                            :class="item_class(row.outcome)"
                          >{{item_status(row.outcome)}}</span>
                  </template>
                  <template v-else>
                          <span
                            v-if="row.orderStatus=='1' && row.seriesType =='1'"
                            class="bet-result"
                            :class="item_class(item.betResult)"
                          >{{item_status(item.betResult)}}</span>
                  </template>
                  <!-- 已结算 单关 betresult字段显示(2-走水，3-输，4-赢，5-半赢，6-半输) -->

                  <!-- 已结算注单无效 -->
                  <template v-if="row.orderStatus=='2'">
                    <template v-if="[3, 4].includes(item.betStatus)">
                            <span
                              v-if="[1, 2, 3, 4, 5, 6, 17, 20].includes(item.cancelType)"
                              class="bet-result lose-color"
                            >
                              {{item_cancelType(item.cancelType)}}
                            </span>
                      <span v-else class="bet-result lose-color">{{row.seriesType =='1'?'':`${i18n_t("bet.invalid")}`}}</span>
                    </template>
                    <template v-if="item.betStatus ==1">
                            <span
                              v-if="[7,8,11,12,15].includes(item.betResult)"
                              class="bet-result lose-color"
                            >{{item_status(item.betResult)}}</span>
                      <span
                        v-else
                        class="bet-result lose-color"
                      >{{row.seriesType =='1'?'':`${i18n_t("bet.invalid")}`}}</span>
                    </template>
                  </template>
                  <!-- 已结算注单无效 -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 投注额 -->
        <div class="td" :style="{
          width: tdWidth()
        }">
              <span>
                {{ format_balance(row.orderAmountTotal) }}</span>
        </div>
        <!-- 最高可赢 -->
        <div class="td" :style="{
          width: tdWidth()
        }">
          <span> {{ format_balance(row.maxWinAmount) }}</span>
        </div>
        <!-- 返回金额 return -->
        <div class="td" :style="{
          width: tdWidth()
        }">
               <span
                 :class="{'win-color': [4,5].includes(row.outcome)}"
               >
                 {{ format_balance(current_tab === 'unsettled' ? row.maxWinAmount : row.backAmount) }}
               </span>
          <!--              <span v-else>- -</span>-->
        </div>
        <!-- 状态 -->
        <div class="td" :style="{
          width: tdWidth()
        }">
          <!--
               0:待处理,1:已处理,2:取消交易,3:待确认,4:已拒绝
               0、3未结算
               1、2、4已结算
             -->
          <span :class="status_class(row.orderStatus)">{{ order_status(row.orderStatus) }}</span>
          <!--显示部分提前结算或者全额提前结算-->
          <!--              <span v-if="current_tab=='settled'" class="bet-pre-color">-->
          <!--                      <template v-if="row.settleType==4">{{i18n_t('bet_record.settlement_pre_part2')}}</template>-->
          <!--                      <template v-else-if="row.settleType==5">{{i18n_t('bet_record.settlement_pre_all2')}}</template>-->
          <!--                    </span>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/core/file-path/file-path.js'
import { i18n_t } from 'src/boot/i18n.js'
import { copyToClipboard } from 'quasar'
import UserCtr from "src/core/user-config/user-ctr.js";
import { format_balance, formatTime } from 'src/core/format/common/index.js'
import { computed, ref } from 'vue'
import sportIcon from "src/components/sport_icon/sport-icon.vue";
const cts_mid = ref([15,27,28,23,31,32,24,33,34])

const lang = computed(() => {
  return UserCtr.lang;
})
const props = defineProps({
  current_tab: {
    type: String,
    default: ''
  },
  columns: {
    type: Array,
    default: []
  },
  rows: {
    type: Array,
    default: []
  },
  BetRecordHistory: {
    type: Object,
    default () {
      return {
        params: {}
      }
    }
  }
})
/**
 * 复制id
 * @param data
 */
const hand_copy = (data) => {
  copyToClipboard(data)
  GlobalSwitchClass.set_tip_show_state(true, {
    text: i18n_t('bet_record.copyed')
  })
}
const getRowIndex = (rowIndex) => {
  const { BetRecordHistory } = props
  return (BetRecordHistory.params.page - 1) * BetRecordHistory.params.size + rowIndex + 1
}
const calcThWidth = () => {
  const len = props.columns.length
  if (!len) return
  const w = (100 / len).toFixed(4)
  return w + '%'
}
const tdWidth = () => {
  return calcThWidth()
}
const calcStyle = (item) => {
  const { align = 'left' } = item
  return {
    textAlign: align,
    width: tdWidth()
  }
}
/**
 * @下注赛事阶段
 * @param type: records.matchType
 */
const matchType = (type, langCode=UserCtr.lang) => {
  let res = "";
  // if(type && langCode) {
  //   res = match_type[type]
  // }

  if(type && langCode) {
    switch (parseInt(type)) {
      case 1:
        res = i18n_t(`odds.${langCode}.morning_session`); //"赛前";
        break;
      case 2:
        res = i18n_t(`odds.${langCode}.list_today_play_title`);//"滚球";
        break;
      case 3:
        res =i18n_t(`odds.${langCode}.match_winner`); //"冠军";
        break;
    }
  }
  return res;

}/**
 * 比分格式设置
 */
const format_score = (res) => {
    let str = "";
    if (res.indexOf("|") != -1) {
      let arr = res.split("|");
      str = arr[1].split(":");
    } else if (res.indexOf(":") != -1) {
      str = res.split(":");
    }
    return `${str[0]} - ${str[1]}`;
  }
/**
 * @description:盘口类型
 * @param {sting} type: records.marketType字段
 * @param {sting} langCode: 多语言 默认是中文
 * @return{string} 盘口类型
 */
const marketType = (type, langCode='zh') => {
  var res = "";
  if(type && langCode) {
    switch (type) {
      case "EU":
        res = i18n_t(`odds.${langCode}.EU`); //"欧洲盘";
        break;
      case "HK":
        res = i18n_t(`odds.${langCode}.HK`); //"香港盘";
        break;
      case "US":
        res = i18n_t(`odds.${langCode}.US`); //"美式盘";
        break;
      case "ID":
        res = i18n_t(`odds.${langCode}.ID`); //"印尼盘";
        break;
      case "MY":
        res = i18n_t(`odds.${langCode}.MY`); //"马来盘";
        break;
      case "GB":
        res = i18n_t(`odds.${langCode}.GB`); //"英式盘";
        break;
      default:
        res = "";
        break;
    }
  }
  return res;
}
/**
 * @description: 取消原因
 * @param {srting} cancelType: 取消类型
 * @return {string}
 */
const item_cancelType = (cancelType) =>{
  switch (parseInt(cancelType)) {
    case 1:
      return i18n_t("bet_record.match_cancel2"); //"比赛取消";;
    case 2:
      return i18n_t("bet_record.match_delay"); //"比赛延期";
    case 3:
      return i18n_t("bet_record.match_interrupt"); //"比赛中断";
    case 4:
      return i18n_t("bet_record.match_rematch"); //比赛重赛
    case 5:
      return i18n_t("bet_record.match_waist"); //"比赛腰斩";
    case 6:
      return i18n_t("bet_record.match_give_up"); //"比赛放弃";
    case 17:
      return i18n_t("bet_record.match_advance"); //"赛事提前";
    case 20:
      return i18n_t("bet_record.match_delay2"); //"比赛延迟";
    default:
      return i18n_t("bet.invalid") //注单无效
  }
}
/**
 * @description:输赢状态
 * @param {srting} type: records.orderVOS.betResult
 * @return{string} 盘口类型
 */
const item_status =(type) => {
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
  }
}
const status_class = (orderStatus) => {
  let str = ''
  switch (parseInt(orderStatus)) {
    case 0:
      str = '' //"投注成功";
      break
    case 1:
      str = '' //"投注成功";
      break
    case 2:
      str = 'lose-color' //"注单无效";
      break
    case 3:
      str = '' //确认中
      break
    case 4:
      str = 'win-color' //投注失败
      break
    default:
      break
  }
  return str
}
/**
 * 投注状态
 * @param orderStatus
 * @returns {string}
 */
const order_status = (orderStatus) => {
  let str = ''
  switch (parseInt(orderStatus)) {
    case 0:
    case 1:
      str = i18n_t("bet.bet_suc"); //"投注成功";
      break;
    case 2:
      str = i18n_t("bet.betting_cancel"); //"注单无效";
      break;
    case 3:
      str = i18n_t("bet.bet_loading"); //"确认中";
      break;
    case 4:
      str = i18n_t("bet.bet_fail"); //"投注失败";
      break
    default:
      break
  }
  return str
}
</script>
<style scoped lang="scss">
.thead {
  display: flex;
}

.tbody {
  .tr {
    display: flex;
  }
}
</style>