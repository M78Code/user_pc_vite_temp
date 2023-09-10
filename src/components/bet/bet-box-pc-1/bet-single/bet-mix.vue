<!--
 * @Description: 正常赛事 左侧菜单里面的串关组件
-->
<template>
  <!--整个串关容器-->
  <div class="bet-mix height-full" :class="bet_flag?'bet-layout':''">
    <div class="auto-wrap no-wrap column">
      <!-- 下注标识 -->
      <div> ------ {{ BetData.bet_data_class_version }} -- {{  BetData.bet_s_list.length }} ---- </div>
      <div class="scroll-wrap" :class="{'record-scoll-wrap': !bet_flag}">    

        <!--未投注就是bet-mix-info组件-->
        <bet-mix-info></bet-mix-info>
        <template v-if="BetData.bet_s_list.length > 0">
          <!--复式连串过关投注-->
          <div class="row bet-toggle" :class="{'bet-border-radius': BetData.bet_s_list.length==2,'bet-toggle-down':!is_expend, 'bet-toggle-up':is_expend}">
            <div
              class="col bet-toggle-text cursor-pointer" 
              :class="{'disabled-toggle': expend_disable}"              
              @click="mix_toggle_handle"
            >
              {{ $t('bet.bet_n_')}}
              <!-- 复式连串过关投注 -->
            </div>
            <div class="col-auto">
              <!--折叠/展开按钮-->
              <span :class="{'disabled-toggle': expend_disable}">
                <icon
                  name="icon-triangle"
                  size="16px"                     
                  :class="{'icon-pull-down': !is_expend, 'icon-pull-up': is_expend}"
                  @click="mix_toggle_handle"
                />
              </span>
            </div>
          </div>
          <div v-show="is_expend">
            <!--金额输入框-->
            <template v-for="(item, index) in BetData.bet_s_list">
              <!--2串1以及输入框-->
              <bet-mix-input
                :index="index"
                :item="item"
                :key="item.custom_id"
                @set_min_max_money="set_min_max_money"
                v-if="BetViewDataClass.bet_order_success_success && ((BetViewDataClass.bet_order_success_success.length==0 && index>0) || (BetViewDataClass.bet_order_success_success.length>0))"
                :class="{'bet-mix-input-last': ((index+1)==BetData.bet_s_list.length)}"
              ></bet-mix-input>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue"
// import bet_mix from "src/public/mixins/bet/bet_mix.js"; // 下注混入js
import BetMixInfo from "./bet-mix-info.vue"; // 下注混入信息组件
import BetMixInput from "./bet-mix-input.vue"; // 下注输入框

import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";

const bet_flag = ref(true)
const expend_disable = ref('')
const is_expend = ref(false)

const mix_toggle_handle = () => {

}

</script>
<style lang="scss" scoped>
/**串关组件**/
.bet-mix {
  .auto-wrap {
    display: flex;
    flex-direction: column;
    height: calc(100% - 34px);
    overflow: hidden;
    .scroll-wrap,
    .record-scoll-wrap {
      height: auto;
      min-height: 0;
      max-height: 100%;
      overflow: hidden;
      :deep(.scroll )  {
        height: auto !important;
        min-height: 100px;
        max-height: 100%;
      }
      :deep(.absolute) {
        position: static;
      }
    }

    /*  布局设置 */
    &.bet-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
  /**复式连串过关投注**/
  .bet-toggle {
    height: 34px;
    line-height: 34px;
    font-size: 13px;
    padding: 0 13px;
    .rules-info {
      margin-right: 5px;
      display: flex;
      align-items: center;
    }
    &.bet-border-radius {
      border-radius: 0px 0px 4px 4px;
      /*  失效的样式 */
    }
    /* 复式连串过关投注 */
    .disabled-toggle {
      pointer-events: none;
      cursor: default;
    }
    /*  箭头向下样式 */
    .icon-pull-down:before {
      transform: rotate(180deg);
      margin-left: 6px;
    }
    /*  箭头向上样式 */
    .icon-pull-up:before {
      transform: rotate(0deg);
      margin-left: 6px;
    }
  }
}
</style>