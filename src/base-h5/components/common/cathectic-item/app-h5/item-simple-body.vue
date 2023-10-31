<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
<!-- 矩形框中部 -->
  <div class="item-body yb_fontsize14">
    <div class="body-title">
      <span>
        <template v-if="data_b.seriesType == '3' && Item.sportName">[{{Item.sportName}}]</template>
        <template v-if="Item.sportId == 1011 || Item.sportId == 1002">{{Item.batchNo}}</template>
        <template v-else>{{Item.matchInfo}}</template>
      </span>
    </div>
    <div class="body-info">
      <div>
        <p>投注项: [{{Item.sportName}}
        </p>
        <p>{{Item.playName}} - {{$i18n.messages[data_b.langCode?data_b.langCode:'zh']['odds'][Item.marketType]}}</p>
      </div>
      <span>
        <!-- 大3.5  -->
        @{{ Item.oddFinally }}</span>
    </div>
    <div class="body-main">
      <p><label>投注单号：</label> <span>{{data_b.orderNo}}</span></p>
      <p><label>投注时间：</label> <span>{{formatTime(+data_b.betTime, 'YYYY-mm-DD HH:MM')}}</span></p>
      <p><label>[{{Item.sportName}}] {{Item.matchName}}</label></p>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { i18n_t } from "src/boot/i18n.js";;
import { project_name } from 'src/core'
import { formatTime, format_money2 } from 'src/core/format/index.js'

let props = defineProps({
    data_b: {
      type: Object
    },
    data_value: {
      type: Object
    },
    main_item: {
      type: [String, Number],
    }
  })
  //按钮名字
  let btn_text = ref('')
  //按钮图标的方向
  let direction = ref('')
  //是否展开
  let box_bool = ref('')

  const Item = computed(() => {
    return props.data_b.orderVOS[0] || []
  })
  
  onMounted(() => {
    rules_normal();
    rules_a();
    rules_b();
    rules_c()

  })

    //切换是否展开
  const toggle_box = () => {
      box_bool = !box_bool;
      if (box_bool == true) {
        [btn_text, direction] = [
          i18n_t("bet_record.pack_down"),
          "down"
        ];
        toggle_rule_b();
      } else {
        [btn_text, direction] = [
          i18n_t("bet_record.pack_up"),
          ""
        ];
        toggle_rule_a();
      }
    }
  const rules_normal = () => {
      [btn_text, direction, box_bool] = [
        // i18n_t("bet_record.pack_up"),
        "",
        false
      ];
    }
    // 串关并且长度大于等于3,默认收起,展示一条;
  const rules_a = () => {
      if (props.data_b.orderVOS.length >= 3)
        [btn_text, direction, box_bool] = [
          i18n_t("bet_record.pack_down"),
          "down",
          true
        ];
    }

  const rules_b = () => {
      if (props.data_b.orderVOS.length <= 2) toggle_rule_a();
    }
  const rules_c = () => {
      if (props.data_b.orderVOS.length >= 3) toggle_rule_b();
    }
    //小于2个时都展开
  const toggle_rule_a = () => {
      lodash.map(props.data_b.orderVOS, (item, index) => {
        item.isBoolean = true;
        return item;
      });
    }
    //大于等于3个时，第一个和第二个展开
  const toggle_rule_b = () => {
      lodash.map(data_b.orderVOS, (item, index) => {
        item.isBoolean = false;
        if (index == 0 || index == 1) {
          item.isBoolean = true;
        }
        return item;
      });
    }
</script>

<style lang="scss" scoped>
template {
  display: block;
}
.item-body {
  padding: 0.12rem;
  .body-title {
    display: flex;
    justify-content: space-around;
    font-weight: bold;
    font-size: 0.14rem;
    line-height: 3;
    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .body-info {
    text-align: center;
    background-color: var(--q-gb-bg-c-9);
    padding: 0.1rem;
    border-radius: 0.1rem;
    color: var(--q-gb-t-c-14);
    & > div {
      display: flex;
      font-weight: bold;
      justify-content: space-around;
    }
  }
  .body-main {
    margin-top: 0.1rem;
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
