<template>
  <div v-show="false">
    {{ UserCtr.user_version }} -- {{ BetData.bet_data_class_version }}-{{
      BetViewDataClass.bet_view_version
    }}-{{ BetData.bet_box_h5_show }}
  </div>
  <div v-if="BetData.bet_box_h5_show">
    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <div class="bet-box-info">
      <!-- 头部信息 -->
      <betTitle />
      <!-- 展开项 -->
      <div class="bet-box-content">
        <!-- {{BetData.is_bet_single}}-{{BetViewDataClass.bet_order_status}}-{{ BetViewDataClass.orderNo_bet_obj}}-{{ BetData.bet_s_list.length > 1 }}-{{ BetViewDataClass.bet_special_series }} -->
        <!-- 单关 投注 -->
        <div class="bet-scroll">
          <div v-if="BetViewDataClass.bet_order_status == 1">
            <template v-if="BetData.is_bet_single">
              <div
                v-for="(item, index) in BetData.bet_single_list"
                :key="item.playOptionsId"
              >
                <betItem :items="item" :key="index" :index="index" />
              </div>
            </template>
            <!-- 串关 投注 -->
            <template v-else>
              <div
                v-for="(item, index) in BetData.bet_s_list"
                :key="item.playOptionsId"
              >
                <betItem :items="item" :key="index" :index="index" />
              </div>

              <!-- 串关投注 限额 -->
              <template v-if="BetData.bet_s_list.length > 1">
                <betSpecialInput
                  :items="BetViewDataClass.bet_special_series[0]"
                />

                <div
                  class="f-s-c cursor h44 pl-30 bor-b"
                  @click="set_show_single()"
                >
                  <sapn class="fon12 font400 text-8a8">{{
                    i18n_t("bet.bet_n_")
                  }}</sapn>
                  <span
                    class="icon-arrow icon-arrow-series"
                    :class="ref_data.show_single ? 'arrow' : ''"
                  ></span>
                </div>
                <!-- 复式连串过关投注 限额 -->
                <template
                  v-if="BetData.bet_s_list.length > 1 && ref_data.show_single"
                >
                  <template
                    v-for="(item, index) in BetViewDataClass.bet_special_series"
                    :key="index"
                  >
                    <div class="bor-b" v-if="index != 0">
                      <betSpecialInput :items="item" />
                    </div>
                  </template>
                </template>
              </template>
            </template>
          </div>

          <!-- 投注后的结果 -->
          <template v-else>
            <template v-if="BetData.is_bet_single">
              <div
                v-for="(item, index) in BetViewDataClass.orderNo_bet_obj"
                :key="item.orderNo"
              >
                <betResult :items="item" :key="index" :index="index" />
              </div>
            </template>
            <template v-else>
              <div
                v-for="(item, index) in BetViewDataClass.orderNo_bet_single_obj"
                :key="item.orderNo"
              >
                <betResult :items="item" :key="index" :index="index" />
              </div>
            </template>
          </template>
        </div>

        <!-- 底部投注信息 -->
        <betFooter />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { UserCtr } from "src/output/index.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import betTitle from "./components/bet-title.vue"; // 投注头部
import betItem from "./components/bet-item.vue"; // 投注列表
import betFooter from "./components/bet-footer.vue"; // 投注底部信息
import betResult from "./components/bet-result.vue"; // 投注结果
import betSpecialInput from "./components/bet-special-input.vue";

const ref_data = reactive({
  show_single: false,
});

// BetData.set_bet_box_h5_show(true)
// 隐藏投注栏
const pack_up = () => {
  let sss = !BetData.bet_box_h5_show;
  console.error("sss", sss);
  BetData.set_bet_box_h5_show(sss);
};

// 复合式串关 开关
const set_show_single = () => {
  // 串关数 大于3条才可以开启 复式串关
  if (BetData.bet_s_list.length > 2) {
    ref_data.show_single = !ref_data.show_single;
  }
};

// 单关/串关 切换
const show_single_change = () => {
  if (BetData.is_bet_single) {
    return BetData.set_is_bet_single("series");
  }
  BetData.set_is_bet_single("single");
};

// 单关/ 合并切换
const show_merge_change = () => {
  if (BetData.is_bet_merge) {
    return BetData.set_is_bet_merge("no");
  }
  BetData.set_is_bet_merge("merge");
};
</script>

<style scoped lang="scss">
@import "./css/bet.scss";

.bet-box-info {
  position: fixed;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 600;
  overflow: hidden;
  width: 100%;
  padding: 0 0.14rem;
  -webkit-overflow-scrolling: touch;
  border-radius: 24px 24px 0 0;
  //border: 1px solid;
  background-color: var(--q-gb-bg-c-15);
  z-index: 1999;
  padding-bottom: .2rem;
}

.bet-scroll {
  max-height: 400px;
  overflow-y: auto;
}

.bet-box-content {
  background: var(--q-gb-bg-c-15);
  border-top: none;
}

.bet-text {
  color: var(--q-gb-t-c-8);
}

.full-shadow {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 550;
  // backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.5);
}
</style>
