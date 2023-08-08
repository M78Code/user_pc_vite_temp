<!--
 * @Description: 串关组件
-->
<template>
  <div class="bet-mix relative-position height-full" :class="!bet_flag?'bet-layout':''">  
    <div class="auto-wrap no-wrap column">
      <div class="scroll-wrap" :class="{'record-scoll-wrap': bet_flag}">
        <!--未投注-->
        <template v-if="bet_flag">
          <bet-mix-info ref="bet-mix-info" :view_ctr_obj="view_ctr_obj"></bet-mix-info>
          <template v-if="vx_get_virtual_bet_list.length>1">
            <div class="row bet-toggle" :class="{'bet-border-radius': vx_get_virtual_bet_list.length==2,'bet-toggle-down':!is_expend, 'bet-toggle-up':is_expend}">
              <div
                class="col bet-toggle-text cursor-pointer" 
                :class="{'disabled-toggle': expend_disable, 'active': is_expend}"              
                @click="mix_toggle_handle"
              >
                {{$root.$t('bet.bet_n_')}}
                <!-- 复式连串过关投注 -->
              </div>
              <div class="col-auto">
                <!--折叠/展开按钮-->
                <span :class="{'disabled-toggle': expend_disable}">
                  <icon
                    name="icon-triangle"
                    size="16px"
                    color="#99A3B1"
                    :class="{'icon-pull-down': !is_expend, 'icon-pull-up': is_expend}"
                    @click="mix_toggle_handle"
                  />
                </span>
              </div>
            </div>
            <div v-show="is_expend">
              <!--金额输入框-->
              <template v-for="(item, index) in vx_get_virtual_bet_s_list">
                <bet-mix-input
                  :ref="`bet-mix-input-${item}`"
                  :index="index"
                  :id="item"
                  :view_ctr_obj="view_ctr_obj"
                  :key="item"
                  @set_min_max_money="set_min_max_money"
                  v-if="index>0"
                  :class="{'bet-mix-input-last': ((index+1)==vx_get_virtual_bet_s_list.length)}"
                ></bet-mix-input>               
              </template>
            </div>
          </template>
        </template>
        <!--已投注-->
        <template v-else>
          <!--投注结果-->
          <bet-mix-record :view_ctr_obj="view_ctr_obj"></bet-mix-record>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
// import bet_mix from "src/public/mixins/virtual_bet/bet_mix.js";
import BetMixInfo from "./bet-mix-info.vue";
import BetMixInput from "./bet-mix-input.vue";
import BetMixRecord from "./bet-mix-record.vue";
</script>
<style lang="scss" scoped>
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
      ::v-deep .scroll {
        height: auto !important;
        min-height: 100px;
        max-height: 100%;
      }
      ::v-deep .absolute {
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