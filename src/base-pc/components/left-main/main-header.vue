<template>
  <!-- 昵称、余额 -->
  <div class="header-wrap scroll-fixed-bg" :class="UserCtr.is_invalid && 'invalid'">
    <div class="user-info" :token="`?token=${get(UserCtr.user_info, 'token')}`" >
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
        <icon-wapper class="icon balance-btn-eye cursor-pointer" name="icon-eye_show" size="14px" @click="set_show_balance" />
      </div>
      <!-- 刷新余额按钮 -->
      <refrech-blance
        v-show="!UserCtr.show_balance"
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
import { UserCtr,format_balance  } from "src/output/index.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import { IconWapper } from 'src/components/icon'
import RefrechBlance from "src/components/refresh/refresh.vue"


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

//隐藏显示用户余额
const set_show_balance = () => {
  UserCtr.set_show_balance(!UserCtr.show_balance)
}
// 销毁事件
onBeforeUnmount(() => {
  off();
});
</script>

<style scoped lang="scss">
.header-wrap {
  padding: 4px 10px 4px 15px;
  height: 40px;
  font-weight: 500;
  line-height: 1.3;
  border-top: 1px solid var(--q-gb-bd-c-6);
  border-right: 1px solid var(--q-gb-bd-c-6);
  border-radius: 0 6px 0 0;
  background: var(--q-gb-bg-c-14);
  border-bottom: 1px solid var(--q-gb-bd-c-8);

  /*  用户信息 */
  .user-info {
    padding-right: 10px;
    font-size: 12px;
    .ellipsis{
      color: var(--q-gb-t-c-3);
    }
  }

  /*  用户余额 */
  .balance-wrap {
    width: 100%;
    height: 15px;
    font-size: 14px;
    .balance-text-show {
      color: var(--q-gb-t-c-16);
      font-weight: 700;
    }

    /*  用户余额隐藏 */
    .balance-text-hide {
      font-size: 16px; // color: var(--qq--theme-color-icon-eye);
      /* 是否显示余额图标 */
    }

    .balance-btn-eye {
      margin-left: 10px;
    }

    /*  刷新余额按钮 */
    .refresh-btn {
      position: absolute;
      top: -8px;
      right: 10px;
      bottom: 11px;
      width: auto !important;

      .icon-refresh:before {
        font-size: 14px;
      }
    }
  }
}
</style>