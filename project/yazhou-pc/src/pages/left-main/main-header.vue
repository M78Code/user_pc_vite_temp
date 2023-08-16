<template>
  <!-- 昵称、余额 -->
  <div class="header-wrap scroll-fixed-bg" :class="is_invalid && 'invalid'">
    <div class="user-info" :token="`?token=${ get(get_user, 'token') }`">
      <!-- 昵称 -->
      <div class="ellipsis">Hi, {{ get(get_user, "uname") }}</div>
    </div>
    <div class="balance-wrap row justify-between relative-position">
      <div class="row items-center">
        <!-- 余额隐藏 -->
        <div v-show="!show_balance" class="balance-text-hide">
          ******
        </div>
        <!-- 余额 -->
        <div v-show="show_balance" class="balance-text-show yb-family-odds">
          {{ (get_user.balance || 0) || format_balance }}
        </div>
        <!-- 余额是否隐藏图标 -->
        <icon :name="show_balance ? 'icon-eye_show' : 'icon-eye_hide'" size="14px" class="balance-btn-eye cursor-pointer"
          @click="set_show_balance(!show_balance)" />
      </div>
      <!-- 刷新余额按钮 -->
      <refresh v-show="show_balance" class="refresh-btn" :other_icon="true" icon_name="icon-balance_refresh"
        :loaded="data_loaded" :disable="!get_user" @click="set_balance_refresh()" />
    </div>
  </div>
</template>

<script setup>
import { ref,onBeforeUnmount,computed } from "vue"
import { get } from "lodash"
import store from "src/store-redux/index.js";
import { get_balance } from "src/store-redux/module/user-info.js";

import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt";

const {
  userReducer
} =  store.getState()

// 用户信息是否失效
const is_invalid = userReducer.is_invalid
// 获取用户信息
const get_user = userReducer.user
// 显示余额
const show_balance = userReducer.show_balance

  // 更新用户余额
  useMittOn(MITT_TYPES.EMIT_GET_BALANCE_CMD, get_user_balance).off

// 是否已加载
const data_loaded = ref(true)

// 显示 / 隐藏余额
const set_show_balance = status => {
  store.dispatch({ type: 'SET_SHOW_BALANCE',  data: status  })
}

// 获取最新的余额 刷新
const set_balance_refresh = () => {
  useMittEmit(MITT_TYPES.EMIT_GET_BALANCE_CMD)
}

/**
 * @description 获取用户余额
 * @return {undefined} undefined
 */
 const get_user_balance = () => {
  let uid = get( get_user, "uid");
  store.dispatch(get_balance(uid));
}

// 格式化用户余额保留2位小数
const format_balance = computed( num => {
  if (num && num > 0) {
    let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/)
    // 保留两位小数
    let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00"

    let _num = _split[1] + '.' + decimal
    return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  }
  return '0.00';
})

// 销毁事件
onBeforeUnmount(()=>{

})

</script>
