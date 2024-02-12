<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <!-- 矩形框中部 -->
  <div class="item-body yb_fontsize14">
    <div class="item-header">
      <div>
        <template v-if="data_b.seriesType == '1'"> {{ data_b.orderVOS[0]?.matchName }} </template>
        <template v-else>  {{ data_b.seriesValue }}  </template>
      </div>
      <!-- 预约 -->
      <div class="header-right" v-if="BetRecordClass.selected === 2">
        <span v-if="[2,3].includes(data_b.preOrderStatus)">{{i18n_t('pre_record.booked_fail')}}</span>
        <span v-else-if="data_b.preOrderStatus == 4">{{i18n_t('pre_record.canceled')}}</span>
        <span v-else class="pre-button">
          {{i18n_t('pre_record.booking')}}
          <span class="pre-cancle-button" @click.stop="cancelPre(data_b)"> {{i18n_t('common.cancel')}} </span>
        </span>
      </div>
    </div>
    <div class="item-main three-more">
      <template v-for="(item, index) in show_data_orderVOS" :key="item.betTime">
        <div class="items" v-if="item.isBoolean">
          <div class="top" :class="{ 'gray-icon':BetRecordClass.selected === 1 }">
            <!-- 预约 -->
            <template v-if="BetRecordClass.selected === 2">
              <!-- preOrderStatus(2,3,4) -->
              <icon-wapper name="icon-failure" v-if="[2,3,4].includes(data_b.preOrderStatus)" />
              <icon-wapper name="icon-success" v-else />
            </template>
            <!-- 已结算、未结算 -->
            <template v-else>
              <!-- orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败) -->
              <icon-wapper name="icon-failure" v-if="['2','4'].includes(data_b.orderStatus)" />
              <icon-wapper name="icon-success" v-else />
            </template>
            <div class="top-info flex">
              <p>
                {{BetRecordClass.selected === 2 ? item.playOptionName: item.marketValue}}
              </p>
              <span>{{formatTime(+item.beginTime, 'mm/DD HH:MM')}}</span>
            </div>
          </div>
          <div :class="{'main-warp': true, 
                'no-border': index === show_data_orderVOS.length - 1, 
                'gray-icon': BetRecordClass.selected === 1, 
                'error': data_b.orderStatus == '2' || data_b.orderStatus == '4'}">
            <div class="list">
              <p class="col-9">
                  {{item.sportName}}
                  <span v-if="data_b.seriesType != '3' && item.matchType != 4">[{{ i18n_t(`matchtype.${item.matchType}`) }}]</span>
                  {{item.playName}}
                  [{{i18n_t(`odds.${item.marketType}`)}}]
                <!-- 优化后的赔率 -->
                <span class="oddfinally" v-if="!data_b.acCode"><span>&thinsp;@{{format_odds(item.oddFinally, item.sportId)}}</span></span>
              </p>
            </div>
            <!--球类名称 赛前还是滚球 玩法名称 基准分 赔率类型-->
            <span class="info flex">
              <div>
                <!-- {{item.sportName}}
                <span v-if="data_b.seriesType != '3' && item.matchType != 4" v-html="i18n_t(`matchtype.${item.matchType}`)"></span>
                &ensp;{{item.playName}}
                <template v-if="item.scoreBenchmark"> ({{item.scoreBenchmark}}) </template>
                &ensp;[{{i18n_t(`odds.${item.marketType}`)}}] -->
                <template v-if="data_b.seriesType == '3' && item.sportId == 50">{{item.sportName}}</template>
                <template v-else-if="[1011, 1002, 1010, 1009].includes(+item.sportId)">{{item.batchNo}}</template>
                <template  v-else-if="data_b.seriesType == '3'">{{item.matchName}}</template>
                <template v-else>{{item.matchInfo}}</template>
              </div>
              <!-- 已结算显示输赢 -->
              <span v-if="!['1', '3'].includes(data_b.seriesType)" class="result" :class="calc_text_item(item).color">
                {{ calc_text_item(item).text }} 
              </span>
            </span>
            <!-- 单关、冠军不需要下划线 -->
            <div v-if="!['1', '3'].includes(data_b.seriesType)" class="line"></div>
          </div>
        </div>
      </template>
      <!-- 串关时大于2条时,显示 展开收起按钮-->
      <div class="toggle row" v-if="data_b.orderVOS.length > 2">
        <span class="btn_style" @click.stop="toggle_box">{{ btn_text }}</span>
      </div>
    </div>
    <div class="foot-main">
      <item-footer :data_f=data_b></item-footer>
      <!-- 未结算列表 => 投注记录页提前结算的按钮、滑块 -->
      <early-settle v-if="BetRecordClass.selected == 0" :item_data="data_b"></early-settle>
      <!-- 已结算列表 => 提前兑现详情 -->
      <early-settled-detail v-if="BetRecordClass.selected == 1" :item_data="data_b" />
      <item-order :data_o=data_b></item-order>
    </div>
    
  </div>
  <!-- 取消预约 -->
  <q-dialog v-model="show_pop">
    <cancle-confirm-pop 
      v-if="show_pop" 
      :orderNo="cancle_order_no"
      :matchInfo="matchInfo"
      @cancel="show_pop=false;">
    </cancle-confirm-pop>
  </q-dialog>
</template>

<script setup>
import lodash from 'lodash'
import { ref, onMounted, computed } from 'vue'
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { bet_result } from "src/core/bet-record/h5/util.js";
import { i18n_t, project_name } from 'src/output/index.js'
import { IconWapper } from 'src/components/icon'
import { itemFooter, itemOrder, earlySettle, earlySettledDetail, cancleConfirmPop } from "src/base-h5/components/common/cathectic-item/ouzhou-h5/index";
import { formatTime, format_odds } from 'src/output/index.js'

//按钮名字
let btn_text = ref(i18n_t("bet_record.pack_down"))
//是否展开
let box_bool = ref(false)

let props = defineProps({
  data_b: {
    type: Object
  }
})


//虚拟赛马计算标识数量
const calc_num = computed(() => {
  if (/[0-9]/.test(props.data_b.playOptions)) {
    return props.data_b.playOptions.split('/')
  } else {
    return false
  }
})

const show_data_orderVOS = computed(() => {
  // orderVOS 长度大于2 且按钮是收起状态, 隐藏多于2条的
  if(box_bool.value === false && props.data_b.orderVOS.length > 2) {
    return lodash.map(props.data_b.orderVOS, (item, index) => {
      item.isBoolean = index < 2 ? true : false;
      return item;
    });
  }
  // 否则全部展示
  return lodash.map(props.data_b.orderVOS, (item, index) => {
    item.isBoolean = true;
    return item;
  });
})

//切换是否展开
const toggle_box = () => {
  box_bool.value = !box_bool.value;
  if (box_bool.value == true) {
    btn_text.value = i18n_t("bet_record.pack_up");
  } else {
    btn_text.value = i18n_t("bet_record.pack_down");
  }
}

// 串关每一项输赢展示
const calc_text_item = (item) => {
  let color = 'black'
  let text = ''
  let betresult = item.betResult
  if (betresult == 13 || betresult == 16) {
    text = i18n_t('bet_record.invalid')
  } else {
    if (betresult == 4 || betresult == 5) {
      color = 'red'
    }
    text = bet_result[betresult] || ''
  }
  return { color, text }
}

// 预约投注取消
let show_pop = ref(false)
let cancle_order_no = ref('')
let matchInfo = ref('')
const cancelPre = (data_b) => {
  cancle_order_no = lodash.get(data_b, 'orderNo', '')
  matchInfo = lodash.get(data_b, 'detailList[0].matchInfo', '')
  show_pop.value = true
}
</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  .item-header {
    // line-height: 0.42rem;
    padding: 0.10rem 0;
    padding-right: 4px;
    padding-left: 0.12rem;
    font-size: 0.16rem;
    border-bottom: 1px solid var(--q-gb-bg-c-9);
    color: var(--q-gb-bg-c-13);
    display: flex;
    justify-content: space-between;
    .header-right {
      font-size: 0.12rem;
      padding-right: 0.1rem;
      color: var(--q-gb-bg-c-1);
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .pre-button {
        .pre-cancle-button {
          padding: 0.02rem 0.1rem;
          border-radius: 0.1rem;
          color: var(--q-gb-t-c-4);
          border: 1px solid var(--q-gb-t-c-4);
          margin-left: 0.06rem;
        }
      }
    }
  }

  .item-main {
    padding: 0.12rem;

    .items {
      &:last-child {

        .list,
        .info {
          border: none;
        }
      }

      .top {
        position: relative;
        .top-info {
          justify-content: space-between;
          font-size: 0.14rem;
          font-weight: bold;
          padding-left: 0.2rem;
          p {
            max-width: 60vw;
            text-overflow: ellipsis;
            overflow: hidden;
            text-wrap: nowrap;
          }
        }
        i.q-icon {
          width: 0.1rem;
          height: 0.1rem;
          background-color: #fff;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        &.gray-icon i.q-icon::before {
            color: var(--q-gb-bg-c-14);
          }
        span {
          color: var(--q-gb-bg-c-14);
          font-weight: normal;
          font-size: 0.14rem;
        }
      }
      .main-warp {
        padding-left: 0.18rem;
        margin-left: 0.04rem;
        border-left: 1px dashed var(--q-gb-bg-c-9);
        &.gray-icon {
          border-left-color: var(--q-gb-bg-c-14);
        }
        &.error {
          border-left-color: red;
        }
      }

      .list {
        line-height: 1.5;
        font-weight: bold;
        &.score {
          display: flex;
          justify-content: space-between;

          span {
            color: var(--q-gb-bg-c-13)
          };
        }
        .oddfinally {
          color: var(--q-gb-bg-c-1)
        }
      }

      .info {
        font-size: 0.12rem;
        color: var(--q-gb-bg-c-14);
        // padding-bottom: 0.1rem;
        justify-content: space-between;
        align-items: center;
        .result {
          font-size: 0.14rem;
          font-weight: bold;
        }
      }
      .line {
        height: 1px;
        background: var(--q-gb-bg-c-9);
        margin-bottom: 0.1rem;
      }
    }
  }
  .toggle {
    justify-content: center;
    padding-top: 0.1rem;
    .btn_style {
      width: 1.3rem;
      line-height: 0.3rem;
      background: var(--q-gb-bg-c-9);
      text-align: center;
      border-radius: 0.5rem;
    }
  }
  .foot-main {
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
      &.acount {
        color: var(--q-gb-bg-c-9);
      }
    }
  }
  .green {
    color: green;
  }

  .gray {
    color: var(--q-gb-bg-c-3);
  }
  .orange {
    color:  var(--q-gb-bg-c-1);
  }
  .red {
    color: red;
  }
  .black {
    color: var(--q-gb-bg-c-13);
  }
}
</style>