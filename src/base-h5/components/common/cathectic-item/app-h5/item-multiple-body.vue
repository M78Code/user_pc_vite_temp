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
      {{ data_b.seriesValue }}
    </div>
    <div class="item-main three-more">
      <template v-for="(item, index) in show_data_orderVOS" :key="index">
        <div class="items" v-if="item.isBoolean">
          <div class="top">
            <p>{{item.matchName}}<template v-if="item.sportId == 1001">{{item.matchDay}}&ensp;{{item.batchNo}}</template></p>
            <span>{{ item.oddFinally }}</span>
          </div>
          <p class="list">
            <template v-if="data_b.seriesType == '3' && item.sportName">[{{item.sportName}}]</template>
            <template v-if="item.sportId == 1011 || item.sportId == 1002">{{item.batchNo}}</template>
            <template v-else>{{item.matchInfo}}</template>
          </p>
          <div class="list score">
            <!-- <p>{{item.marketValue}}</p> -->
            <!-- <span>赢</span> -->
          </div>
          <!--球类名称 赛前还是滚球 玩法名称 基准分 赔率类型-->
          <span class="info">
            {{item.sportName}}
            <span v-if="data_b.seriesType != '3' && item.matchType != 4" v-html="$i18n.messages[data_b.langCode?data_b.langCode:'zh']['matchtype'][item.matchType]"></span>
            &ensp;{{item.playName}}
            <template v-if="item.scoreBenchmark">
              ({{item.scoreBenchmark}})
            </template>
            &ensp;[{{$i18n.messages[data_b.langCode?data_b.langCode:'zh']['odds'][item.marketType]}}]
          </span>
        </div>
      </template>
      <!-- 串关时大于3条时,显示 展开收起按钮-->
      <div class="toggle row" v-if="data_b.orderVOS.length > 3">
        <span class="btn_style" @click.stop="toggle_box">
          <span class="text_c">{{ btn_text }}</span>
        </span>
      </div>
    </div>
    <div class="foot-main">
      <p><label>投注额：</label> <span>{{format_money2(data_b.orderAmountTotal)}}</span></p>
      <template>
        <!-- orderStatus 订单状态(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败) -->
        <!-- 在未结算页 -->
        <p v-if="BetRecordClass.selected !== 3" class="acount">
          <label>可赢额：</label> 
          <template v-if="data_b.orderStatus == 1 || data_b.orderStatus == 2 || data_b.orderStatus == 4">
            <span>
              <template v-if="data_b.backAmount !== null">{{format_money2(data_b.backAmount)}}</template>
              <template v-else>{{format_money2(data_b.orderAmountTotal)}}</template>
            </span>
          </template>
          <template v-else>
            <span>{{format_money2(data_b.maxWinAmount)}}</span>
          </template>
        </p>
        <!-- 在已结算页 -->
        <p v-else class="acount">
          <label>结算：</label> 
          <span>{{format_money2(data_b.backAmount)}}</span>
        </p>
      </template>
      <p>
        <label>注单状态：</label> 
        <template>
          <!-- 预约中、预约失效页 -->
          <span v-if="BetRecordClass.selected === 1 || BetRecordClass.selected === 2">
            <template v-if="[2,3].includes(data_b.preOrderStatus)">{{i18n_t('pre_record.booked_fail')}}</template>
            <template v-else-if="[4].includes(data_b.preOrderStatus)">{{i18n_t('pre_record.canceled')}}</template>
            <template v-else>{{i18n_t('pre_record.booking')}}</template>
          </span>
          <!-- 未结算、已结算页 -->
          <span v-else :class="BetRecordClass.calc_text(data_b).color"> 
            {{ BetRecordClass.calc_text(data_b).text }} 
          </span>
        </template>
      </p>
    </div>
  </div>
</template>

<script setup>
import lodash from 'lodash'
import { ref, onMounted, computed } from 'vue'
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { t } from "src/boot/i18n.js";
import { project_name } from 'src/core'
import { formatTime, format_money2 } from 'src/core/format/index.js'

//按钮名字
let btn_text = ref(t("bet_record.pack_down"))
//是否展开
let box_bool = ref(false)

let props = defineProps({
  data_b: {
    type: Object
  }
})


const show_data_orderVOS = computed(() => {
  // orderVOS 长度大于3 且按钮是收起状态, 隐藏多于3条的
  if(box_bool.value === false && props.data_b.orderVOS.length > 3) {
    return lodash.map(props.data_b.orderVOS, (item, index) => {
      item.isBoolean = index < 3 ? true : false;
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
    btn_text.value = t("bet_record.pack_up");
  } else {
    btn_text.value = t("bet_record.pack_down");
  }
}

</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  .item-header {
    background-color: var(--q-gb-bg-c-9);
    color: var(--q-gb-bg-c-15);
    line-height: 0.4rem;
    padding-left: 0.12rem;
  }

  .item-main {
    padding: 0.12rem;

    .items {
      padding-bottom: 0.1rem;

      &:last-child {

        .list,
        .info {
          border: none;
        }
      }

      .top {
        display: flex;
        justify-content: space-between;
        font-size: 0.16rem;
        font-weight: bold;
        position: relative;
        padding-left: 0.14rem;

        span {
          color: var(--q-gb-bg-c-9);
        }
      }

      .list {
        line-height: 1.5;
        font-weight: bold;
        padding-left: 0.1rem;
        margin-left: 0.04rem;
        border-left: 1px solid var(--q-gb-bg-c-9);

        &.score {
          display: flex;
          justify-content: space-between;

          span {
            color: var(--q-gb-bg-c-13)
          }

          ;
        }
      }

      .info {
        padding-left: 0.1rem;
        margin-left: 0.04rem;
        border-left: 1px solid var(--q-gb-bg-c-9);
        font-size: 0.12rem;
        color: var(--q-gb-bg-c-6);
        display: block;
      }
    }
  }
  .toggle {
    position: relative;
    padding-left: 0.14rem;
    .text_c {
      display: block;
      padding: 0.02rem 0.1rem;
      background-color: var(--q-gb-bg-c-9);
      border-radius: 0.2rem;
      font-size: 0.12rem;
      color: var(--q-gb-bg-c-15);
    }
  }
  .toggle::after, .items .top::after {
    content: '';
    width: 0.1rem;
    height: 0.1rem;
    background-color: var(--q-gb-bg-c-15);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border-radius: 100%;
    border: 2px solid var(--q-gb-bg-c-9);
  }
  .foot-main {
    padding: 0 0.14rem 0.14rem;
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
    color: #69C969
  }

  .red {
    color: #E93D3D
  }

  .black {
    color: #666666
  }

  .orange {
    color: #FFB001
  }

  .gray {
    color: #D2D2D2
  }
}
</style>
