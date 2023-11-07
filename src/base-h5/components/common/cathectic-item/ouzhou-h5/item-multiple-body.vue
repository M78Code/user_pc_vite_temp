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
      <template v-if="data_b.seriesType == '1'">
        {{ data_b.orderVOS[0]?.matchName }}
      </template>
      <template v-else>
        {{ data_b.seriesValue }}
      </template>
    </div>
    <div class="item-main three-more">
      <template v-for="(item, index) in show_data_orderVOS" :key="index">
        <div class="items" v-if="item.isBoolean">
          <div class="top">
            <template>
              <icon-wapper name="icon-success" />
            </template>
            <div class="top-info flex">
              <p>
                <!-- 冠军趣味玩法特殊对应 -->
                <!-- managerCode=4 代表电竞  -->
                <!-- matchType=3 是冠军  -->
                <!-- managerCode=3 代表虚拟体育 -->
                <!-- seriesType = 3 表示冠军 -->
                <!-- matchType= 4 表示虚拟体育(尽量不要用这个字段) -->
                <template v-if="data_b.seriesType == '3' && item.sportId == 50">{{item.sportName}}</template>
                <template v-else-if="[1011, 1002, 1010, 1009].includes(+item.sportId)">{{item.batchNo}}</template>
                <template  v-else-if="data_b.seriesType == '3'">{{item.matchName}}</template>
                <template v-else>{{item.matchInfo}}</template>
              </p>
              <span>{{formatTime(+item.beginTime, 'mm/DD HH:MM')}}</span>
            </div>
          </div>
          <div :class="['main-warp', index === show_data_orderVOS.length - 1 ? 'no-border':'']">
            <div class="list">
              <p class="col-9">
              <span>
                <template v-if="!([1011, 1002, 1010, 1009].includes(+item.sportId) && calc_num && calc_num.length > 1)">
                  <!-- {{is_pre ? item.playOptionName: item.marketValue}} -->
                  {{item.marketValue}}
                </template>
              </span>
              <!-- 优化后的赔率 -->
              <span class="oddfinally" v-if="!data_b.acCode"><span>&nbsp;@&thinsp;{{format_odds(item.oddFinally, item.sportId)}}</span></span>
            </p>
            <!-- managerCode=4 代表电竞 orderStatus=1 是已结算 -->
            <p class="col-8 text-left yb_fontsize10 item-order" v-if="data_b.managerCode == 4&&data_b.orderStatus == 1">
              <!-- {{i18n_t('bet_record.result_score')}}： -->
              {{item.settleScore}}
            </p>
            </div>
            <!--球类名称 赛前还是滚球 玩法名称 基准分 赔率类型-->
            <span class="info flex">
              <div>
                {{item.sportName}}
                <span v-if="data_b.seriesType != '3' && item.matchType != 4" v-html="i18n_t(`matchtype.${item.matchType}`)"></span>
                &ensp;{{item.playName}}
                <template v-if="item.scoreBenchmark"> ({{item.scoreBenchmark}}) </template>
                &ensp;[{{i18n_t(`odds.${item.marketType}`)}}]
              </div>
              <!-- 已结算显示输赢 -->
              <span v-if="BetRecordClass.selected === 1" class="result" :class="BetRecordClass.calc_text(data_b).color">
                {{ BetRecordClass.calc_text(data_b).text }} 
              </span>
            </span>
            <div class="line"></div>
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
      <!-- 未结算列表 => 投注记录页提前结算的按钮、滑块、提前结算详情 -->
      <early-settle :item_data="data_b"></early-settle>
      <item-order :data_o=data_b></item-order>
    </div>
    
  </div>
</template>

<script setup>
import lodash from 'lodash'
import { ref, onMounted, computed } from 'vue'
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { i18n_t, project_name } from 'src/core/index.js'
import { IconWapper } from 'src/components/icon'
import { itemFooter, itemOrder, earlySettle, earlySettledDetail } from "src/base-h5/components/common/cathectic-item/ouzhou-h5/index";
import { formatTime, format_odds } from 'src/core/format/index.js'

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
    console.log(props.data_b);
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

</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  .item-header {
    line-height: 0.5rem;
    padding-left: 0.12rem;
    font-size: 0.18rem;
    border-bottom: 1px solid var(--q-gb-bg-c-18);
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
          font-size: 0.16rem;
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
          background-color: var(--q-gb-bg-c-15);
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        span {
          color: var(--q-gb-bg-c-9);
        }
      }
      .main-warp {
        padding-left: 0.18rem;
        margin-left: 0.04rem;
        border-left: 1px dashed var(--q-gb-bg-c-9);
      }

      .list {
        line-height: 1.5;
        font-weight: bold;
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
        font-size: 0.12rem;
        color: var(--q-gb-bg-c-6);
        padding-bottom: 0.1rem;
        justify-content: space-between;
        .result {
          font-size: 0.16rem;
          font-weight: bold;
        }
      }
      .line {
        height: 1px;
        background: var(--q-gb-bg-c-18);
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
      background: var(--q-gb-bg-c-18);
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
