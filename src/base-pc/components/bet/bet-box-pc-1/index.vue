<template>
  <!--当前投注-->
  <div class="relative-position bet-list-info" :style="bet_style">
    <!-- 投注栏 1 -->
    <v-scroll-area ref="ref_bet_scroll_area_bet_list" position="bet_list" :observer_area="3" :observer_middle="true"
      class="bet-list">
      <!-- 滚动：头部 --------------------------------->
      <template v-slot:header>
        <div class="left-bg-box"></div>
        <bet-scroll-header />
      </template>
      <div>
        <!-- 滚动：内容 --------------------------------->
        <div style="display: none;"> {{ BetData.bet_data_class_version }} </div>

        <div class="bet-mode-zone" v-if="BetData.is_bet_single">
          <div class="left">
            <span>{{ i18n_t("bet.bet_one_") }}</span>
            <span class="bet-single-count">
              {{ BetData.bet_single_list.length }}
            </span>
          </div>
          <div class="right">
            <!-- 单关 合并 -->
            <span class="check-box" @click="toggle_merge">
              <span class="check-wrap relative-position" :class="{ 'active': BetData.is_bet_merge }" />
              <span>{{ i18n_t('bet.merge') }}</span>
            </span>

            <span class="icon-info" @mouseover="show_merge_info = true" @mouseout="show_merge_info = false">
              <icon-wapper id="merge-info" name="icon-tips" class="bet-info" size="14px" />
            </span>
          </div>
        </div>

        <div class="bet-view">
          <!-- 正常入口的单关 -->
          <bet-single v-show="BetData.is_bet_single" @set_scroll_this="set_scroll_this" />
          <!-- 正常入口的串关 -->
          <bet-mix v-show="!BetData.is_bet_single" class="full-height" @set_scroll_this="set_scroll_this" />
        </div>
      </div>
      <template v-slot:footer>
        <bet-scroll-footer />
      </template>
    </v-scroll-area>

    <!--提示区域-->
    <q-tooltip content-class="bet-bg-tooltip" anchor="bottom left" self="top left" :offset="[181, 10]" target="#merge-info"
      v-if="show_merge_info">
      <div style="width:170px;min-height:60px;padding-top:5px;padding-bottom:10px;padding-left:5px;word-break:break-all;">
        {{ i18n_t('bet.merge_info') }}
      </div>
    </q-tooltip>
  </div>
</template>

<script setup>
import { ref } from "vue"

import BetData from "src/core/bet/class/bet-data-class.js";

// // 通屏垂直滚动
import vScrollArea from "./v-scroll-area.vue";

import BetScrollHeader from './components/bet-scroll-header.vue'
import BetScrollFooter from './components/bet-scroll-footer.vue'
import BetSingle from "./components/bet-single.vue"
import BetMix from "./components/bet-mix.vue"

import { IconWapper } from 'src/components/icon'
import { compute_css_variables } from "src/core/css-var/index.js"

const bet_style = ref('')
bet_style.value = compute_css_variables({ category: 'component', module: 'bet-box' })
console.error('page_style.value',bet_style.value)

// 是否显示合并信息A
const show_merge_info = ref(false)

const set_scroll_this = val => {
  console.error('val', val)
}

// 单关 合并切换
const toggle_merge = () => {
  BetData.set_is_bet_merge()
}


</script>

<style lang="scss">
@import "./css/bet_single.scss";
</style>

<style scoped lang="scss">
.left-bg-box{
  width: 100%;
  height: 80px;
}
.bet-list-info{
  width: 100%;
  height: 100%;
}
.bet-mode-zone {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 40px;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
    padding-left: 15px;

    .bet-single-count {
      border-radius: 10px;
      color: var(--q---q-bet-box-8);
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-left: 5px;
      text-align: center;
      transform: scale(0.8);
      background: var(--q-gb-bg-c-18);
    }
  }

  .right {
    display: flex;
    flex-wrap: nowrap;
    margin-right: 10px;

    .check-box {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      padding-left: 5px;
      padding-right: 5px;
      cursor: pointer;

      .check-wrap {
        padding: 0;
        margin-right: 5px;
      }
    }
  }
}

/** 选择框样式 -S*/
.check-wrap {
  width: 14px;
  min-width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid var(--q-gb-bd-c-7);
  margin-right: 10px;
  position: relative;

  &.active {
    border: none;
    background: var(--q-gb-bg-c-16);

    &::before {
      position: absolute;
      content: "";
      left: 4px;
      width: 6px;
      height: 4px;
      top: 4px;
      border-top: 2px solid transparent;
      border-right: 2px solid transparent;
      transform: rotate(135deg);
      border-color: var(--q-gb-bd-c-13);
    }
  }
}

/** 选择框样式 -E*/
</style>