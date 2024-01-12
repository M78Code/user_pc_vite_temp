<!--
 * @Description: 串关信息
-->
<template>
  <div>
    <div class="c-bet-mix-info">
      <div v-show="false"> {{ BetData.bet_data_class_version }}-{{BetViewDataClass.bet_view_version}}</div>
        <!---串关投注项部分-->
        <bet-mix-item
          :item="item"
          :index="index"
          :key="`${item}-${index}`"
          v-for="(item, index) in BetData.bet_s_list"
        ></bet-mix-item>
      <template v-if="BetViewDataClass.bet_order_success_success && BetViewDataClass.bet_order_success_success.length>0">
        <!--投注结果部分-->
        <!-- <bet-mix-result 
          :series_obj="item" 
          v-for="(item, index) in BetViewDataClass.bet_order_success_success" 
          :key="index"
          :class="{'bet-mix-result-first':(index==0)}"
        ></bet-mix-result> -->
      </template>
      <template v-else>
        <!-- <div id="bet_input_defaut_one" class="bet_input_defaut_one" v-if="BetData.bet_s_list.length > 0"> -->
          <!--第一个输入框的-->
          <!-- <bet-input
            ref="bet-mix-input-0"
            class="bet-input"
            :index="0"
            :item="BetData.bet_s_list[0]"
            :key="`0-${BetData.bet_s_list[0].custom_id}`"
          ></bet-input>
        </div> -->
        <div v-if="BetData.bet_s_list.length > 1">
          <q-card flat class="bet-mix-item-card">
            <div v-show="false"> {{BetViewDataClass.bet_view_version}}</div>
            <betSpecialInput  :items="BetViewDataClass.bet_special_series[0]"  />
          </q-card>
        </div>
       
      </template>
    </div>
    
  </div>
 
</template>
<script setup>
import BetMixItem from "./bet-mix-item.vue";
import BetInput from "./bet-input.vue";
import BetMixResult from "./bet-mix-result.vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import betSpecialInput from "./bet-special-input.vue"
 

</script>
<style lang="scss" scoped>
/*  第一个输入框距离顶部样式 */
#bet_input_defaut_one {
  .bet-mix-input-card {
    border-top: 0 !important;
  }
}
/*  卡片样式 总的*/
.bet-mix-item-card {
  padding: 15px 10px;
  padding-bottom: 0px;

  /* *卡片组件样式重写* */
  :deep(.q-card__section) {
    margin: 0;
    padding: 0;
    line-height: 1;

    .row {

      /*  玩法及队名部分样式 */
      .bet-play-game {
        display: flex;
        align-item: flex-start;
        padding: 0;
        margin: 0;
        word-break: break-word;

        /*  弹出tips的样式 */
        .bet-play-text {
          .bet-match-playing {
            margin-right: 5px;
            margin-top: 2px;
            white-space: nowrap;
          }

          /*  盘口名称设置 */
          .bet-handicap-name {
            margin-top: 2px;
            white-space: pre-wrap;
          }
        }
      }

      /*  队伍名称 */
      .bet-play-team {
        display: flex;
        align-item: center;
        padding-right: 5px !important;
        min-height: 20px;

        /*  队伍名称 和 盘口值 */
        .bet-team-handicap {
          display: block;
          word-break: break-all;
          line-height: 1.3;

          /* 盘口值 -0.5 */
          label {
            margin-left: 0;
            word-break: break-word;

            &.bet-handicap {
              text-align: center;
              padding: 0px 5px;
            }

            &.margin-left-0 {
              margin-left: 0px;
            }

            &.bet-text-nowrap {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

  /*  删除按钮  */
  .bet-del {
    z-index: 20;
    top: 0px;
  }
}
</style>