<!--
 * @Author: iverson
 * @Date: 2022-09-02 19:42:45
 * @Description: 晒单记录卡片信息
-->
<template>
  <div class="common-bet-item-page">
    <!--<div class="item-wrapper" :class="{ 'item-wrapper-selected': data.isActive,'item-wrapper-hasshared': hasShared }">-->
    <div class="item-wrapper" :class="{ 'item-wrapper-selected': data.isActive }">
      <div class="item-body" :key="index" v-for="(item,index) in detailList">
        <div class="row items-center body-top yb_fontsize12 mx-12 body_top">
          <p class="p1 yb_mr4">
            <div :style="compute_css_obj('match-cup')"  class="beif_src"></div>
          </p>
          <template v-if="item.sportName">{{item.matchName}}</template>
          <template
            v-if="item.sportId == 1001 || item.sportId == 1004">&ensp;{{item.matchDay}}&ensp;{{item.batchNo}}</template>
        </div>
        <div class="body-main yb_ml12 yb_pt10 yb_pl12">
          <div class="row yb_fontsize14 justify-between box-top">
            <template v-if="data.seriesType == '3' && item.sportId == 50">{{item.sportName}}</template>
            <template v-else-if="[1011, 1002, 1010, 1009].includes(+item.sportId)">{{item.batchNo}}</template>
            <template v-else-if="data.seriesType == '3'">{{item.matchName}}</template>
            <template v-else>{{item.matchInfo}}</template>
            <p class="text-right begintime" v-if="!data.acCode">
              <!-- .Format(i18n_t('time4')) -->
              {{(format_time_zone_time(+item.beginTime))}}
            </p>
          </div>
          <div class="row box-main yb_py4">
            <p class="col-8">
              <span>
                <!--球类名称 赛前还是滚球 玩法名称-->
                {{i18n_data(item).sport_name}}<span
                  v-if="data.seriesType != '3' && item.matchType != 4 && item.sportId != 1004">&thinsp;{{i18n_data((item)).type}}&ensp;</span>
                <template
                  v-if="(item.sportId == 1001 || item.sportId == 1004) && data.seriesType != '1'">&ensp;{{item.matchName}}{{item.matchDay}}&ensp;{{item.batchNo}}</template>
                {{item.playName}}
                <!-- 基准分 -->
                <template v-if="item.scoreBenchmark">({{format_score(item.scoreBenchmark)}})</template>&thinsp;
                <span v-if="!data.acCode">[{{i18n_data((item)).mtype}}]</span>
              </span>
            </p>
            <template>
              <p class="col-4 row items-center justify-end text-right">
                <span style="flex:1"><template v-if="item.settleScore != ''"> {{calc_settle_score}}</template></span>
              </p>
            </template>
          </div>
          <div class="box-bottom row">
            <template v-if="[1011, 1002, 1010, 1009].includes(+item.sportId) && calc_num(item)">
              <span v-for="(items,i) in calc_num(item)" :key="i" :class="'num' + items" class="num yb_mr4"></span>
            </template>
            <span :style="{'font-weight':$q.platform.is.ios ? '500':'bold'}">
              <template
                v-if="!([1011, 1002, 1010, 1009].includes(+item.sportId) && calc_num(item) && calc_num(item).length > 1)">
                {{item.marketValue}}
              </template>
            </span>
            <p class="col-9"
              :class="{'dog': [1002, 1010].includes(+item.sportId),'moto': [1010].includes(+item.sportId),'nidi-moto':+item.sportId == 1009}">
              <!-- 优化后的赔率 -->
              <span class="oddfinally" v-if="!data.acCode"><span>&nbsp;@&thinsp;{{ format_odds(item.oddFinally, item.sportId)}}</span></span>
            </p>
          </div>
        </div>
      </div>
      <div class="item-footer yb_mx10 yb_px14 yb_mt10 yb_pt8 row yb_fontsize12">
        <div class="col-4">
          <p class="top-p">{{ i18n_t('bet_record.bet_val2') }}</p>
          <p class="yb_fontsize14 money-p" v-if="data.orderAmountTotal">{{ format_money2(data.orderAmountTotal) }}</p>
        </div>
        <!-- 中 -->
        <!-- 未结算页面 -->
        <div>
          <!-- 订单状态orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败) -->
          <template v-if="data.orderStatus == 1 || data.orderStatus == 2 || data.orderStatus == 4">
            <p class="top-p">{{i18n_t('bet_record.go_back')}}</p>
            <!-- 有返还金额取返还金额，没有返还金额取投注金额 -->
            <p class="yb_fontsize14 money-p" :class="is_win && 'red'">
              <template v-if="data.backAmount !== null">{{format_money2(data.backAmount)}}</template>
              <template v-else>{{format_money2(data.orderAmountTotal)}}</template>
            </p>
          </template>
          <template v-else>
            <p class="top-p">{{i18n_t('bet_record.bet_max_win')}}</p>
            <p class="yb_fontsize14 money-p">
              <!-- 留空处理 -->
              <template v-if="data.acCode">- -</template>
              <!-- 最高金额 -->
              <template v-else>{{format_money2(data.maxWinAmount)}}</template>
            </p>
          </template>
        </div>
        <!-- 右 -->
        <div class="text-right" style="margin-left:auto">
          <p class="top-p">{{calc_settle_score}}</p>
          <!-- 订单状态 -->
          <p :class="class_foter" class="yb_fontsize12" style="line-height:0.2rem">{{calc_text}}</p>
        </div>
      </div>
      <div class="item-order row mx-16 justify-between">
        <!-- 订单号 -->
        <div class="text-left ellipsis">{{i18n_t('bet.order_no')}}&thinsp;<span
            class="yb_mr4 orderno">{{data.orderNo}}</span>
        </div>
        <!-- 时间 -->
        <div class="text-right">
          {{i18n_t('bet_record.bet_time')}}
            <span class="orderno">
              <!-- .Format(i18n_t('time4')) -->
               &thinsp;{{format_time_zone_time(+data.betTime)}}
           </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { format_time_zone_time, format_money2,format_odds, format_score } from "src/output/index.js"
;
import {UserCtr,compute_css_obj} from "src/output/index.js";

//国际化


export default defineComponent({
  name: 'common_bet_item',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    hasSharedIdList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {},
  setup(props, evnet) {
    let data = reactive({
      
      is_win: false,   //这一单是否赢钱了
      class_foter: '',//订单状态的颜色类名
      bet_result: {
        // #TODO $root替换
        // // "0": i18n_t("bet_record.bet_no_status00"), //'未结算',
        // "2": i18n_t("bet_record.bet_no_status02"), //'走水',
        // "3": i18n_t("bet_record.bet_no_status03"), //'输',
        // "4": i18n_t("bet_record.bet_no_status04"), //'赢',
        // "5": i18n_t("bet_record.bet_no_status05"), //'赢半',
        // "6": i18n_t("bet_record.bet_no_status06"), //'输半',
        // "7": i18n_t("bet_record.bet_no_status07"), //'比赛取消',
        // "8": i18n_t("bet_record.bet_no_status08"), //'比赛延期',
        // "11": i18n_t("bet_record.bet_no_status11"), // '比赛延迟',
        // "12": i18n_t("bet_record.bet_no_status12"), // '比赛中断',
        // "15": i18n_t("bet_record.bet_no_status15"), // '比赛放弃'
      },
      outcome: {
        // #TODO $root替换
        // "2": i18n_t("bet_record.bet_no_status02"), //'走水',
        // "3": i18n_t("bet_record.bet_no_status03"), //'输',
        // "4": i18n_t("bet_record.bet_no_status04"), //'赢',
        // "5": i18n_t("bet_record.bet_no_status05"), //'赢半',
        // "6": i18n_t("bet_record.bet_no_status06"), //'输半',
      },
    });
    const i18n_data = (item) => {
      let txts = ''
      const lang = data.langCode ? (['zs', 'hk'].includes(data.langCode) ? 'zh' : data.langCode) : 'zh'
      return {
        // #TODO $root替换
        // sport_name: i18n_t(`common_lang.${lang}.sport2`)[item.sportId],
        // type: i18n_t(`common_lang.${lang}.matchtype`)[item.matchType],
        // mtype: i18n_t(`common_lang.${lang}.odds`)[item.marketType]
      }
    };
    const calc_num = (item) => {
      if (/[0-9]/.test(item.playOptions)) {
        return item.playOptions.split('/')
      } else {
        return false
      }
    };
    // #TODO vuex
    // computed: {

    // 该订单已晒单
    const hasShared = computed(() => {
      const { orderNo } = data || {};
      return hasSharedIdList.includes(orderNo);
    });
    // 返回订单状态
    const calc_text = computed(() => {
      let res = '';
      switch (data.orderStatus) {
        case '0':
          class_foter = 'green'
          res = i18n_t('bet_record.successful_betting')
          break;
        case '1':
          class_foter = 'black'
          let flag = data.seriesType == '1' && data.detailList[0]
          if (flag) {   //单关
            if (+data.preBetAmount > 0) {  // 提前结算的输赢单独一套逻辑算
              let difference = data.backAmount - data.orderAmountTotal
              if (difference > 0) {     // 赢
                class_foter = 'red'
                is_win = true
                res = bet_result[4]
              } else if (difference < 0) {  // 输
                res = bet_result[3]
              } else {  // 走水
                res = bet_result[2]
              }
              break;
            }
            let betresult = data.detailList[0].betResult
            if (betresult == 13 || betresult == 16) {
              res = i18n_t('bet_record.invalid');
            } else {
              if (betresult == 4 || betresult == 5) {
                class_foter = 'red'
                is_win = true
              }
              res = bet_result[betresult] || '';
            }
          } else {  //串关
            if (data.outcome == 4 || data.outcome == 5) {
              class_foter = 'red'
              is_win = true
            }
            res = outcome[data.outcome] || i18n_t('bet_record.successful_betting')
          }
          break;
        case '2':
          class_foter = 'black'
          res = i18n_t('bet_record.invalid_bet')
          break;
        case '3':
          class_foter = 'orange'
          res = i18n_t('bet_record.confirming')
          break;
        case '4':
          class_foter = 'red'
          res = i18n_t('bet.bet_err')
          break;
        default:
          res = ''
          break;
      }
      return res;
    });
    const calc_settle_score = computed(() => {
      if (data.seriesType == '1' && data.detailList[0]) {
        if (data.orderStatus == '1') {
          return data.detailList[0].settleScore
        } else if (data.orderStatus == '2') {
          let betstatus = data.detailList[0].betStatus;
          let betresult = data.detailList[0].betResult;
          let canceltype = data.detailList[0].cancelType;
          if (betstatus == 1) {
            return bet_result_1[betresult] || '';
          } else if (betstatus == 3 || betstatus == 4) {
            return bet_result_3[canceltype] || '';
          } else {
            return '';
          }
        } else {
          return ''
        }
      }
    });
    // const calc_settle_score = computed(() => {
    //   if (data.orderStatus == 1 && data.seriesType == '1') {
    //     return '';
    //   } else {
    //     return data.settleScore
    //   }
    // });
    const detailList = computed(() => {
      return data.detailList || []
    });

    return {
      ...toRefs(data),
      i18n_data,
      calc_num,
      hasShared,
      calc_text,
      calc_settle_score,
      detailList,compute_css_obj
    }
  }
})
</script>
<style lang="scss" scoped>
.common-bet-item-page {
  .item-wrapper {
    border-radius: .08rem;

    .item-body {
      .body-top {
        height: 0.38rem;
      }
    }

    .body-main {
      margin-right: .15rem;

      .box-top {
        position: relative;
      }

      .box-top::before {
        content: "";
        display: block;
        width: 0.03rem;
        height: 0.12rem;
        border-radius: 0.02rem;
        position: absolute;
        left: -0.1rem;
        top: 0.04rem;
      }
    }

    .item-order {
      font-size: 0.11rem;
      height: 0.36rem;
      line-height: 0.36rem;
      color: var(--q-gb-t-c-27);
    }

    .item-footer {
      height: .5rem;
      border-radius: 0.04rem;

      .top-p {
        margin-bottom: -0.02rem;
        min-height: 0.18rem;
      }
    }
  }

  .item-wrapper-selected, .item-wrapper-hasshared {
    position: relative;

    &::after {
      content: '';
      width: .18rem;
      height: .18rem;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
