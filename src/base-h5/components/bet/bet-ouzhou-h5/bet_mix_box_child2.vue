<!--
* @Author: Router
* @Description: 合并
-->

<template>
  <div class="bet-mix-show">
    <div v-show="false"> {{ UserCtr.user_version }} --
      {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
    {{ console.log('BetData.bet_single_list!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', BetData.bet_single_list) }}
    <template v-if="BetData.bet_single_list[0]">
      <div v-for="(items, index) in BetData.bet_single_list" :key="index">
        <div class="nonebox4-content">
          <div class="nonebox4-content-left">
            <div class="nonebox4-content-left-content">
              <span class="icon-delete nonebox4-content-left-content-xian" @click.stop="set_delete(items, index)"></span>
              <div class="nonebox4-content-left-info">
                <div class="nonebox4-content-left-content-text">
                  <div class="nonebox4-content-left-content-text-one">
                    <div class="nonebox4-content-left-content-text-one-tit">
                      <span class="text-flow-none">{{ items?.handicap }} <em v-if="items?.handicap_hv" class="ty-span">{{
                        items?.handicap_hv }}</em></span>
                    </div>
                    <div>
                      <div class="nonebox4-content-right"
                        v-if="items.ol_os == 1 && items.hl_hs == 0 && items.mid_mhs == 0">
                        <div class="nonebox4-content-right-profit"
                          :class="{ 'red-up': items.red_green == 'red_up', 'green-down': items.red_green == 'green_down' }">
                          {{ compute_value_by_cur_odd_type(items.odds, items.playId, items.odds_hsw, items.sportId) }}
                        </div>
                        <div class="show_img">
                          <img v-if="items.red_green == 'red_up'"
                            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/icon_up.png`" alt="" />
                          <img v-if="items.red_green == 'green_down'"
                            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/icon_down.png`" alt="" />
                        </div>
                      </div>
                      <div class="nonebox4-content-right" v-else>
                        <span class="bet-disabled">{{ i18n_t('bet.disabled') }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="nonebox4-content-left-content-text-two">
                    {{ items.matchType == 2 ? '[' + i18n_t("bet.bet_inplay") + ']' : '' }}
                    <span class="text-two-span">{{ items.playName }}
                      <span v-if="[4, 19, 143, 113].includes(items.playId * 1)">{{ items.matchType == 2 ? items.mark_score
                        :
                        '' }}</span>
                    </span>
                    <span v-if="UserCtr.is_cur_odds(items.odds_hsw)">[{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`)
                    }}]</span>
                    <span v-else>[{{ i18n_t(`odds.EU`) }}]</span>

                  </div>
                  <div class="nonebox4-content-left-content-text-three">{{ items.tid_name }}</div>
                  <div class="nonebox4-content-left-content-text-three" v-if="items.home">{{ items.home }} v {{ items.away
                  }} {{
  items.matchType == 2 ? items.mark_score : '' }}</div>
                </div>


              </div>
            </div>
          </div>
        </div>
        <!-- 输入框 -->
        <bet-input-info :item="items" :index="index"></bet-input-info>
      </div>
    </template>
    <!-- 合并单关最下面的多个输入框 -->

  </div>
</template>
<script setup>
import betInputInfo from "./bet_input_info.vue";
import { compute_value_by_cur_odd_type } from "src/output/index.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { UserCtr } from "src/output/index.js"
import keyBoard from './keyboard.vue';

const set_delete = (items, index) => {
  BetData.set_delete_bet_info(items.playOptionsId, index)
}

</script>
  
<style lang="scss" scoped>
.hps_img {
  width: .08rem;
  height: .13rem;
  margin-top: .06rem;
  transform: rotate(180deg);
}

.jiantou {
  width: 0;
  height: 0;
  border: 5px solid;
  position: relative;
}

.one {
  border-color: rgba(255, 70, 70, .3) transparent transparent transparent;
}

.two {
  border-color: rgba(255, 70, 70, .6) transparent transparent transparent;
}

.three {
  border-color: rgba(255, 70, 70, 1) transparent transparent transparent;
}

.onegreen {
  border-color: rgba(23, 164, 20, 1) transparent transparent transparent;
}

.twogreen {
  border-color: rgba(23, 164, 20, .6) transparent transparent transparent;
}

.threegreen {
  border-color: rgba(23, 164, 20, .3) transparent transparent transparent;
}

.jiantou::after {
  content: "";
  position: absolute;
  top: -11px;
  left: -9px;
  border: 9px solid;
  border-color: white transparent transparent transparent;
}

.content-right-duo {
  display: inline-block;
  background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
  width: 0.14rem;
  height: 0.2rem;
  margin-top: 0.05rem;
}

.content-right-shao {
  display: inline-block;
  background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
  width: 0.14rem;
  height: 0.2rem;
  margin-top: 0.05rem;
}

.text-one-span {
  color: var(--q-gb-t-c-1);
  padding-left: 0.08rem;
}

.nonebox4-content-left-content-text-one-tit {
  :deep(.ty-span) {
    margin-left: 4px;
    color: var(--q-gb-bg-c-1);
  }
}

.nonebox4-content-left-content-text-three {
  font-size: 0.16rem;
  color: var(--q-gb-t-c-3);
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}

.nonebox4-content-left-content-text-two {
  color: var(--q-gb-t-c-15);
  font-size: 0.16rem;
  margin: .08rem 0;
  font-weight: 500;
  word-break: keep-all;
}

.text-two-span {
  color: var(--q-gb-bg-c-4);
  font-weight: 400;
}

.nonebox4-content-left-content-text-one {
  color: var(--q-gb-t-c-4);
  font-size: 0.18rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
}

.nonebox4-content-left-info {
  display: flex;
  width: calc(100% - 0.25rem);
}

.nonebox4-content {
  width: 100%;
  background: var(--q-gb-bd-c-2);
  padding: 10px;
  padding: 0.05rem 0.15rem;
  border-bottom: 1px solid #ccc;
}

.nonebox4-content-left-title {
  font-size: 13px;
  color: var(--q-gb-t-c-13);
}

.nonebox4-content-left-content {
  min-height: 70px;
  display: flex;
  margin-top: 5px;
  width: 100%;
}

.nonebox4-content-left-content-xian {
  color: var(--q-gb-t-c-4);
  margin-right: 0.16rem;
  margin-top: 0.08rem;
  font-size: 0.12rem;

  &::before {
    font-size: 0.14rem;
  }
}

.nonebox4-content-left-content-text {
  line-height: 0.25rem;
  margin-top: 0.02rem;
  width: 100%;
}

.nonebox4-content-right-profit {
  font-size: 0.2rem;
  font-weight: 700;
  color: var(--q-gb-t-c-1);

  &.red-up {
    color: var(--q-gb-t-c-17);
  }

  &.green-down {
    color: var(--q-gb-t-c-16);
  }
}

.nonebox4-content-right {
  display: flex;
  //flex-direction: row-reverse;
  height: 0.26rem;
  list-style: 0.26rem;

  .show_img {
    display: flex;
    height: 0.26rem;
    align-items: center;
    width: 0.24rem;
    justify-content: center;

    img {
      width: 0.08rem;
    }
  }

  .bet-disabled {
    padding: 0 0.2rem;
    height: .26rem;
    display: inline-block;
    border-radius: 0.02rem;
    background: var(--q-gb-bg-c-19);
    font-size: 0.12rem;
    font-weight: 500;
    letter-spacing: 0px;
    color: var(--q-gb-t-c-3);
  }
}</style>
  