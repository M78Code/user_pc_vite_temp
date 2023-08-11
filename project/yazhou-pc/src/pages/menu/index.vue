<template>
  <div class="c-main-menu column" :class="{ 'bet-menu-upd': layout_left_show == 'bet_history' }">
    <v-scroll-area position="menu"
    :observer_area="3"
    :observer_middle="layout_left_show == 'bet_list'"
    :class="{ 'bet-list': layout_left_show == 'bet_list' }"
    >
       <!-- 滚动：头部 --------------------------------->
       <template v-slot:header>
        <!-- 昵称、余额 -->
        <div class="header-wrap scroll-fixed-bg" :class="get_is_invalid && 'invalid'">
          <div class="user-info">
            <!-- 昵称 -->
            <div class="ellipsis">Hi, {{ _.get(userInfo, "uname") }}</div>
          </div>
          <div class="balance-wrap row justify-between relative-position">
            <div class="row items-center">
              <!-- 余额隐藏 -->
              <div v-show="!show_balance" class="balance-text-hide">
                ******
              </div>
              <!-- 余额 -->
              <div v-show="show_balance" class="balance-text-show yb-family-odds">
                {{ (userInfo.balance || 0) || format_balance(amount) }}
              </div>
              <!-- 余额是否隐藏图标 -->
              <icon :name="show_balance ? 'icon-eye_show' : 'icon-eye_hide'" size="14px"
                class="balance-btn-eye cursor-pointer" @click="show_balance = !show_balance " />
            </div>
            <!-- 刷新余额按钮 -->
            <!-- <refresh v-show="show_balance" class="refresh-btn" :other_icon="true" icon_name="icon-balance_refresh"
              :loaded="data_loaded" :disable="!userInfo" @click="set_amount_refresh" /> -->
          </div>
        </div>

      </template>
      <template>
         <!-- 体育菜单 -->
         <!-- <menu-wapper /> -->
      </template>
    </v-scroll-area>
  </div>
</template>

<script setup>
import { ref,onMounted } from "vue"
import { useRouter } from "vue-router";
import _ from "lodash"

import { api_base_data } from "src/api/index.js";
import store from "src/store-redux/index.js";

// 通屏垂直滚动
import vScrollArea from "./v-scroll-area.vue";
// import { MenuWapper } from "src/components/menu";

const router = useRouter();
const state = store.getState()

const layout_left_show = ref('menu');

// 用户信息 和
const userInfo = ref(state.userReducer.userInfo)

onMounted(()=>{
  init_mew_menu_list()
})

/**
 * @description: 菜单列表
 * @return {*}
 */
 const init_mew_menu_list = async () => {
  let res = await api_base_data.get_base_data_menu_init({});
  // console.warn('sssss',res)
 }

// 格式化用户余额保留2位小数
const format_balance = num => {
  if (num && num > 0) {
    let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/)
    // 保留两位小数
    let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00"

    let _num = _split[1] + '.' + decimal
    return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  }
  return '0.00';
}
</script>