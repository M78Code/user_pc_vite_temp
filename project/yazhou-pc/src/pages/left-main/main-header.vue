<template>
  <!-- 昵称、余额 -->
  <div class="header-wrap scroll-fixed-bg" :class="is_invalid && 'invalid'">
    <div class="user-info" :token="`?token=${get(get_user, 'token')}`">
      <!-- 昵称 -->
      <div class="ellipsis">Hi, {{ get(get_user, "nickName") }}</div>
    </div>
    <div class="balance-wrap row justify-between relative-position">
      <div class="row items-center">
        <!-- 余额隐藏 -->
        <div v-show="!show_balance" class="balance-text-hide">******</div>
        <!-- 余额 -->
        <div v-show="show_balance" class="balance-text-show yb-family-odds">
          {{ format_balance(user_balance) }}
        </div>
        <!-- 余额是否隐藏图标 -->
        <icon
          :name="show_balance ? 'icon-eye_show' : 'icon-eye_hide'"
          size="14px"
          class="balance-btn-eye cursor-pointer"
          @click="set_show_balance(!show_balance)"
        />
      </div>
      <!-- 刷新余额按钮 -->
      <refresh
        v-show="show_balance"
        class="refresh-btn"
        :other_icon="true"
        icon_name="icon-balance_refresh"
        :loaded="data_loaded"
        :disable="!get_user"
        @click="set_balance_refresh()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed, onMounted, reactive } from "vue";
import { get } from "lodash";
import store from "src/store-redux/index.js";
import { get_balance } from "src/store-redux/module/user-info.js";
import { format_balance } from "src/core/formart/";
import { useMittOn, MITT_TYPES } from "src/core/mitt";

const { userReducer } = store.getState();
// 用户信息是否失效
const is_invalid = ref(userReducer.is_invalid);
// 获取用户信息
const get_user = ref(userReducer.user_info || {});
// 显示余额
const user_balance = ref(userReducer.amount);
// 显示余额
const show_balance = ref(userReducer.show_balance);

// 是否已加载
const data_loaded = ref(true);
// 获取最新的余额 刷新
const { off, emit: set_balance_refresh } = useMittOn(
  MITT_TYPES.EMIT_GET_USER_ACCOUNT,
  () => {
    store.dispatch(get_balance());
  }
);
console.log(get_user);
//默认进来获取一次用户余额
set_balance_refresh();
//用户余额更新
useMittOn(MITT_TYPES.EMIT_USER_AMOUNT_CHAUNGE, function (amount) {
  user_balance.value = amount;
});
//用户信息更新
useMittOn(MITT_TYPES.EMIT_USER_CHAUNGE, function (user) {
  get_user.value = user;
});
// 显示 / 隐藏余额
const set_show_balance = (status) => {
  store.dispatch({ type: "SET_SHOW_BALANCE", data: status });
};
// 销毁事件
onBeforeUnmount(() => {
  off();
});
</script>
