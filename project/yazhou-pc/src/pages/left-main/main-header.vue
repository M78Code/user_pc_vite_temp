<template>
  <!-- 昵称、余额 -->
  <div class="header-wrap scroll-fixed-bg" :class="UserCtr.is_invalid && 'invalid'">
    <div class="user-info" :token="`?token=${get(UserCtr.user_info, 'token')}`" :user-version="UserCtr.user_version">
      <!-- 昵称 -->
      <div style="display: none;"> {{ UserCtr.user_version }}</div>
      <div class="ellipsis">Hi, {{ get(UserCtr.get_user_info_data(), "nickName") }}</div>
    </div>
    <div class="balance-wrap row justify-between relative-position">
      <div class="row items-center">
        <!-- 余额隐藏 -->
        <div v-show="UserCtr.show_balance" class="balance-text-hide">******</div>
        <!-- 余额 -->
        <div v-show="!UserCtr.show_balance" class="balance-text-show yb-family-odds">
          {{ format_balance(UserCtr.balance) }}
        </div>
        <!-- 余额是否隐藏图标 -->
        <icon
          :name="UserCtr.show_balance ? 'icon-eye_show' : 'icon-eye_hide'"
          size="14px"
          class="balance-btn-eye cursor-pointer"
          @click="UserCtr.set_show_balance(!UserCtr.show_balance)"
        />
      </div>
      <!-- 刷新余额按钮 -->
      <refresh
        v-show="UserCtr.show_balance"
        class="refresh-btn"
        :other_icon="true"
        icon_name="icon-balance_refresh"
        :loaded="data_loaded"
        :disable="!UserCtr.user_info"
        @click="set_balance_refresh()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed, onMounted, reactive } from "vue";
import { get } from "lodash";
import { UserCtr,format_balance  } from "src/core/index.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt";


// 是否已加载
const data_loaded = ref(true);
// 获取最新的余额 刷新
const { off, emit: set_balance_refresh } = useMittOn(
  MITT_TYPES.EMIT_GET_USER_ACCOUNT,
  () => {
    UserCtr.get_balance()
  }
);
//默认进来获取一次用户余额
set_balance_refresh();


// 销毁事件
onBeforeUnmount(() => {
  off();
});
</script>
