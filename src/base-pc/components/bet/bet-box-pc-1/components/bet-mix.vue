<!--
 * @Description: 正常赛事 左侧菜单里面的串关组件
-->
<template>
  <!--整个串关容器-->
  <div class="bet-mix height-full">
    <div class="auto-wrap no-wrap column">
      <!-- 下注标识 -->
      <div v-if="false"> -{{ BetData.bet_data_class_version }} -- {{  BetData.bet_s_list.length }} -{{BetViewDataClass.bet_view_version}} </div>
      <div class="scroll-wrap">    

        <!--未投注就是bet-mix-info组件-->
        <bet-mix-info></bet-mix-info>

        <template v-if="BetData.bet_s_list.length > 1">
          <!--复式连串过关投注-->
          <div class="row bet-toggle">
            <div
              class="col bet-toggle-text cursor-pointer" 
              :class="{'disabled-toggle':BetData.bet_s_list.length==2}"              
              @click="mix_toggle_handle"
            >
              {{ i18n_t('bet.bet_n_')}}
              <!-- 复式连串过关投注 -->
            </div>
            <div class="col-auto">
              <!--折叠/展开按钮-->
              <span :class="{'disabled-toggle': BetData.bet_s_list.length==2}">
                <icon-wapper
                  name="icon-triangle"
                  size="16px"                     
                  :class="{'icon-pull-down': !is_expend, 'icon-pull-up': is_expend}"
                  @click="mix_toggle_handle"
                />
              </span>
            </div>
          </div>
          
          <div class="bet-single-mix-input" v-show="is_expend">
            <template v-if="BetData.bet_s_list.length > 2">
              <!--金额输入框-->
              <template v-for="(item, index) in BetViewDataClass.bet_special_series" :key="index">
                <!--2串1以及输入框-->
              
                <q-card flat class="bet-mix-item-card">
                  <betSpecialInput :index="index" :items="item"  v-if="index!= 0"/>
                </q-card>
              </template>
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
import BetInput from "./bet-input.vue"; // 下注输入框
import { IconWapper } from 'src/components/icon'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import betSpecialInput from "./bet-special-input.vue"

const bet_flag = ref(true)
const expend_disable = ref('')
const is_expend = ref(false)

// 复式连串过关投注 切换
const mix_toggle_handle = () => {
  if(BetData.bet_s_list.length > 2){
    is_expend.value = !is_expend.value
    // 通知页面更新 
    useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
  }
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
    padding-bottom: 20px;
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
    &.disabled-toggle {
      pointer-events: none;
      cursor: default;
      opacity: 0.3;
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