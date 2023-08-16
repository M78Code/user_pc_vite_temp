<template>
  <div v-if="layout_left_show == 'bet_list' && main_menu_toggle != 'mini'" class="bet-view">
    <!--当前是否为虚拟投注-->
    <template v-if="get_is_virtual_bet">
      <!-- 虚拟单关 -->
      <!-- <virtual-bet-single v-if="get_virtual_bet_list.length==1" @set_scroll_this="set_scroll_this"/> -->
      <!-- 虚拟串关 -->
      <!-- <virtual-bet-mix
      v-else-if="get_virtual_bet_list.length>1"
      class="full-height"
      @set_scroll_this="set_scroll_this"
    /> -->
    </template>
    <template v-else>
      <div class="bet-mode-zone" v-if="is_bet_single">
        <div class="left">
          <!-- <span>{{$root.$t("bet.bet_one_")}}</span> -->
          <span class="bet-single-count">
            {{ bet_single_list.length }}
          </span>
        </div>
        <div class="right">
          <span class="check-box" :class="{ 'checked': is_bet_merge }" @click.stop="toggle_merge">
            <!-- <check-box :checked="is_bet_merge" /> <span>{{$root.$t('bet.merge')}}</span> -->
          </span>
          <span @mouseover="show_merge_info = true" @mouseout="show_merge_info = false">
            <!-- <icon
            id="merge-info"
            name="icon-tips"
            class="bet-info"
            size="14px"
          /> -->
          </span>
        </div>
      </div>
      <!-- 正常入口的单关 -->
      <!-- <bet-single v-if="is_bet_single" @set_scroll_this="set_scroll_this" /> -->
      <!-- 正常入口的串关 -->
      <!-- <bet-mix
      v-if="!is_bet_single"
      class="full-height"
      @set_scroll_this="set_scroll_this"
    /> -->
    </template>
  </div>
</template>

<script setup>

import { ref, reactive } from 'vue'
import { useRouter } from "vue-router";

import store from "src/store-redux/index.js";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'


const {
  layoutReducer,
  menuReducer,
  betInfoReducer
} = store.getState()

const router = useRouter()

// 菜单布局信息
const layout_left_show = ref(layoutReducer.layout_left_show)
const main_menu_toggle = ref(menuReducer.main_menu_toggle)
const get_is_virtual_bet = ref(betInfoReducer.get_is_virtual_bet)
const show_merge_info = ref(betInfoReducer.show_merge_info)




</script>