<!--data_b
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <!-- 矩形框中部 -->
  <div class="item-body yb_fontsize14">
    <div class="item-header">
      <img :src="compute_local_project_file_path('/image/png/chain_watch_order.png')" alt="">{{ data_b.seriesValue }}
    </div>
    <div class="item-main three-more">
      <template v-for="(item, index) in show_data_orderVOS" :key="index">
        <div class="items" v-if="item.isBoolean">
          <div class="top">
            <p>
              <template v-if="!([1011, 1002, 1010, 1009].includes(+item.sportId) && calc_num && calc_num.length > 1)">
                <!-- 预约的 显示playOptionName, 其他显示 marketValue -->
                {{(BetRecordClass.selected == 1 ||  BetRecordClass.selected == 2) ? item.playOptionName: item.marketValue}}
              </template>
            </p>
            <!-- 优化后的赔率 -->
            <span v-if="!data_b.acCode"><span>{{format_odds(item.oddFinally, item.sportId)}}</span></span>
          </div>
          <p class="list">
            <span>{{item.playName}}</span>
            <p>{{ item.matchInfo }}</p>
          </p>
          <!-- 结算页面显示 -->
          <div class="list score" v-if="BetRecordClass.selected == 3">
            <p>{{item.settleScore}}</p>
            <span :class="calc_item_bet_result(item).color">{{calc_item_bet_result(item).text}}</span>
          </div>
          <!--球类名称 赛前还是滚球 玩法名称 基准分 赔率类型-->
          <span class="info">
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
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { bet_result } from "src/core/bet-record/h5/util.js";
import { i18n_t } from 'src/output/index.js'
import { format_money2 } from 'src/output/index.js'
import { itemFooter } from "src/base-h5/components/common/cathectic-item/app-h5/index";
import { formatTime, compute_local_project_file_path, format_odds } from 'src/output/index.js'
//按钮名字
let btn_text = ref(i18n_t("bet_record.pack_down"))
//是否展开
let box_bool = ref(false)

let props = defineProps({
  data_b: {
    type: Object
  }
})
const Item = computed(() => {
  return props.data_b.orderVOS[0] || []
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
  // 文字调整
    switch (item.betResult) {
      case 4:
        text = "已结算赢";
        break;
      case 3:
        text = "已结算输";
        break;
      case 5:
        text = "已结算赢一半";
        break;
      case 6:
        text = "已结算输一半";
        break;
      case 2:
        text = "已结算和";
        break;
      default:
        text = bet_result[item.betResult]
    }
    if(item.betResult == 3 || item.betResult == 6) {
      // 输、输半
      color = 'black'
    }
    return { text, color }
    
  }

  //虚拟赛马计算标识数量
  const calc_num = computed(() => {
    if (/[0-9]/.test(props.data_b.playOptions)) {
      return props.data_b.playOptions.split('/')
    } else {
      return false
    }
  })


</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  .item-header {
    display: flex;
    align-items: center;
    background-color: var(--q-gb-bg-c-13);
    color: var(--q-gb-t-c-14);
    line-height: 0.4rem;
    padding-left: 0.12rem;
    img {
      margin-right: .04rem;
    }
  }

  .item-main {
    padding: 0.12rem;

    .items {
      line-height: 0.2rem;
      margin-bottom: 0.08rem;
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
        font-weight: 400;
        position: relative;
        padding-left: 0.14rem;

        p {
          color: var(--q-gb-t-c-17);
          padding-bottom: .04rem;
        }
        span {
          color: var(--q-gb-bg-c-13);
        }
      }
      .match-info {
        color: var(--q-gb-t-c-19);
        padding-left: 0.14rem;
         font-size: 0.12rem;
       }
      .list {
        line-height: 1.5;
        font-weight: 400;
        padding-left: 0.1rem;
        margin-left: 0.04rem;
        border-left: 1px solid var(--q-gb-bg-c-13);
        color: var(--q-gb-t-c-17);

        p {
          color: var(--q-gb-t-c-32);
          padding: .04rem 0;
        }

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
        color: var(--q-gb-t-c-33);;
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
      color: var(--q-gb-t-c-14);
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
    color: var(--q-gb-t-c-17);
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
      &.acount {
        color: var(--q-gb-bg-c-13);
      }
    }
  }
  .body-info {
    margin: 0.12rem;
    margin-bottom: 0;
    text-align: center;
    background-color: var(--q-gb-bg-c-13);
    padding: 0.12rem;
    border-radius: 0.1rem;
    color: var(--q-gb-t-c-14);
    & > div {
      display: flex;
      font-weight: bold;
      justify-content: space-around;
    }
  }
  .green {
    color: #69C969
  }

  .red {
    color: #E93D3D
  }

  .black {
    color: var(--q-gb-t-c-17)
  }

  .orange {
    color: #FFB001
  }

  .gray {
    color: #D2D2D2
  }
}
</style>