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
      <span>瓦伦西亚 VS 罗斯托拉夫U20</span>
    </div>
    <div class="body-info">
      <div>
        <p>投注项:角球:滚球</p>
        <p>大/小-上半场</p>
      </div>
      <span>大3.5 @2.16</span>
    </div>
    <div class="body-main">
      <p><label>投注单号：</label> <span>{{data_b.orderNo}}</span></p>
      <p><label>投注时间：</label> <span>{{formatTime(+data_b.betTime, 'YYYY-mm-DD HH:MM')}}</span></p>
      <p><label>{{data_b.matchName}}</label></p>
      <p><label>投注额：</label> <span>{{format_money2(data_b.orderAmountTotal)}}元</span></p>
      <template>
        <p v-if="main_item != '1'" class="acount"><label>可赢额：</label> <span>{{format_money2(data_b.maxWinAmount)}}元</span></p>
        <p v-else class="acount"><label>结算：</label> <span>赢 5.60元</span></p>
      </template>
      <p><label>注单状态：</label> <span :class="class_foter">{{calc_text}}</span></p>
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
  //订单状态的颜色类名
  const class_foter = ref('')
  
  onMounted(() => {
    console.log(props);
    rules_normal();
    rules_a();
    rules_b();
    rules_c()

  })

  onUnmounted(() => {
    // for (const key in $data) {
    //   $data[key] = null
    // }
  })
 //返回订单状态
 const calc_text = computed(() => {
      let res = '';
      switch (props.data_b.orderStatus) {
        case '0':
          class_foter.value = 'green'
          res = i18n_t('bet_record.successful_betting')
          break;
        case '1':
          class_foter.value = 'black'
          let flag = props.data_b.seriesType == '1' && props.data_b.orderVOS[0]
          //单关
          if (flag) {
            if (+props.data_b.preBetAmount > 0) {
               // 提前结算的输赢单独一套逻辑算
              let difference = props.data_b.backAmount - props.data_b.orderAmountTotal
              // 赢
              if (difference > 0) {
                class_foter.value = 'red'
                is_win.value = true
                res = bet_result.value[4]
              } else if (difference < 0) {
                 // 输
                res = bet_result.value[3]
              } else {  // 走水
                res = bet_result.value[2]
              }
              break;
            }
            let betresult = props.data_b.orderVOS[0].betResult
            if (betresult == 13 || betresult == 16) {
              res = i18n_t('bet_record.invalid');
            } else {
              if (betresult == 4 || betresult == 5) {
                class_foter.value = 'red'
                is_win.value = true
              }
              res =  bet_result.value[betresult] || '';
            }
          } else {
            //串关
            if (props.data_b.outcome == 4 || props.data_b.outcome == 5) {
              class_foter.value = 'red'
              is_win.value = true
            }
            res = outcome[props.data_b.outcome] || i18n_t('bet_record.successful_betting')
          }
          break;
        case '2':
          class_foter.value = 'black'
          res = i18n_t('bet_record.invalid_bet')
          break;
        case '3':
          class_foter.value = 'orange'
          res = i18n_t('bet_record.confirming')
          break;
        case '4':
          class_foter.value = 'red'
          res = i18n_t('bet.bet_err')
          break;
        default:
          res = ''
          break;
      }
      return res;
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
}
</style>
