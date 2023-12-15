<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <!-- 矩形框中部 -->
  <div class="item-body yb_fontsize14">
    <!-- 串关名称 -->
    <div class="item-header">
      {{ data_b.seriesValue }}
    </div>
    <div class="item-main three-more">
      <template v-for="(item, index) in show_data_orderVOS" :key="index">
        <div class="items" v-if="item.isBoolean">
          <div class="top">
            <!-- 比赛名称、赔率 -->
            <p>{{item.matchName}}<template v-if="item.sportId == 1001">{{item.matchDay}}&ensp;{{item.batchNo}}</template></p>
            <span>{{ item.oddFinally }}</span>
          </div>
          <!-- 玩法 -->
          <p class="list play">
            <span class="play-market">{{item.playName}}</span>
            <span class="play-market">{{ item.marketValue }}</span>
          </p>
          <!-- 结算页面显示 -->
          <div class="list score" v-if="BetRecordClass.selected == 3">
            <p>{{item.settleScore}}</p>
            <span :class="calc_item_bet_result(item).color">{{calc_item_bet_result(item).text}}</span>
          </div>
          <span class="info">
            {{item.matchInfo}}
          </span>
          <!--球类名称 赛前还是滚球 玩法名称 基准分 赔率类型-->
          <span class="info bot">
            {{item.sportName}}
            <span v-if="data_b.seriesType != '3' && item.matchType != 4" v-html="i18n_t(`matchtype.${item.matchType}`)"></span>
            &ensp;{{item.playName}}
            <template v-if="item.scoreBenchmark">
              ({{item.scoreBenchmark}})
            </template>
            &ensp;[{{i18n_t(`odds.${item.marketType}`)}}]
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
      <!-- 可赢额、结算, 注单状态： -->
      <item-footer :data_f="data_b"></item-footer>
    </div>
  </div>
</template>

<script setup>
import lodash from 'lodash'
import { ref, onMounted, computed } from 'vue'
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { bet_result } from "src/core/bet-record/util.js";
import { i18n_t } from 'src/output/index.js'
import { format_money2 } from 'src/output/index.js'
import { itemFooter } from "src/base-h5/components/common/cathectic-item/app-h5/index";
//按钮名字
let btn_text = ref(i18n_t("bet_record.pack_down"))
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
    btn_text.value = i18n_t("bet_record.pack_up");
  } else {
    btn_text.value = i18n_t("bet_record.pack_down");
  }
}

  // 串关每一项的输赢
  const calc_item_bet_result = (item) => {
    let text = ''
    let color = 'red'
    text = bet_result[item.betResult]
    if(item.betResult == 3 || item.betResult == 6) {
      // 输、输半
      color = 'black'
    }
    return { text, color }
  }


</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  .item-header {
    background-color: var(--q-gb-bg-c-13);
    color: var(--q-gb-bg-c-15);
    line-height: 0.4rem;
    padding-left: 0.12rem;
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
        display: flex;
        justify-content: space-between;
        font-size: 0.15rem;
        font-weight: bold;
        position: relative;
        padding-left: 0.14rem;

        span {
          color: var(--q-gb-bg-c-13);
        }
      }

      .list {
        line-height: 1.5;
        font-weight: bold;
        padding-left: 0.1rem;
        margin-left: 0.04rem;
        border-left: 1px solid var(--q-gb-bg-c-13);

        &.score {
          display: flex;
          justify-content: space-between;
        }
        &.play {
          display: flex;
          align-items: center;
        }
        .play-market {
          margin-right: 0.1rem;
          &:last-child{
            margin-right: 0;
            max-width: 2.2rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }

      .info {
        padding-left: 0.1rem;
        margin-left: 0.04rem;
        border-left: 1px solid var(--q-gb-bg-c-13);
        font-size: 0.12rem;
        color: var(--q-gb-bg-c-6);
        display: block;
        &.bot {
          padding-bottom: 0.1rem;
        }
      }
    }
  }
  .toggle {
    position: relative;
    padding-left: 0.14rem;
    .text_c {
      display: block;
      padding: 0.02rem 0.1rem;
      background-color: var(--q-gb-bg-c-13);
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
    border: 2px solid var(--q-gb-bg-c-13);
  }
  .foot-main {
    padding: 0 0.14rem 0.14rem;
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
      &.acount {
        color: var(--q-gb-bg-c-13);
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