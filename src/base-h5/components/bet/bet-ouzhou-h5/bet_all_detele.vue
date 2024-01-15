<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-all-detele">
    <div v-show="false"> {{ UserCtr.user_version }} --
      {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
    <div class="del-info " @click.stop="clear">
      <span class="icon-delete del-info-icon"></span>
      <div class="del-info-name">{{ i18n_t('bet.delete_all') }}</div>
    </div>
    <div class="del-info">
      <div class="dropdown">
        <div class="f-a-c">
          <button class="dropbtn" @click.stop="is_dropdown = !is_dropdown">
            {{ bet_type_text() }}
          </button>
          <span class="icon-arrow icon-arrow-merge ml-4"></span>
        </div>
   
        <div v-if="is_dropdown" class="dropdown-content">
          <div :class="[bet_type_class() === 'single' && 'active']" @click.stop="switch_handle('single')">
            {{ i18n_t('bet.bet') }}
          </div>
          <div :class="[bet_type_class() === 'merge' && 'active']" @click.stop="switch_handle('merge')">
            {{ i18n_t('bet.merge') }}
          </div>
          <div :class="[bet_type_class() === 'series' && 'active']" @click.stop="switch_handle('series')">
            {{ i18n_t('bet.kushikatsu') }}
          </div>
        </div>
      </div>
      <div class="mask" v-if="is_dropdown" @click.stop="is_dropdown = !is_dropdown"></div>
      <!-- <div class="del-info-dui">√</div> -->
    </div>
  </div>
</template>
<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import { useMittEmit, MITT_TYPES } from "src/output/index.js";
import { ref, computed } from 'vue';
import { UserCtr } from "src/output/index.js"


const is_dropdown = ref(false)

const clear = () => {
  BetData.set_clear_bet_info()
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
}

const switch_handle = (state) => {
  switch (state) {
    case 'single':
      BetData.set_is_bet_merge('no')
      BetData.set_is_bet_single('single')
      break;
    case 'series':
      BetData.set_is_bet_single('series')
      break;
    case 'merge':
      BetData.set_is_bet_merge('merge')
      break;
  }
}

const bet_type_text = computed(()=> state =>{
  if (BetData.is_bet_single) {
    if (BetData.is_bet_merge) {
      return  i18n_t('bet.merge') 
    }
    return i18n_t('bet.bet')
  }
  if (!BetData.is_bet_single) {
    return i18n_t('bet.kushikatsu')
  }
})

const bet_type_class = computed(()=> state =>{
  if (BetData.is_bet_single) {
    if (BetData.is_bet_merge) {
      return  'merge'
    }
    return 'single'
  }
  if (!BetData.is_bet_single) {
    return 'series'
  }
})
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  border: none;
  cursor: pointer;
  background: none;
}

.dropdown-content {
  display: block;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 9;
  // margin-left: -0.7rem;
  width: 1.45rem;
  right: 0;
  top: 30px;
}

.dropdown-content div {
  color: var(--q-gb-t-c-12);
  text-decoration: none;
  display: block;
  margin: 0 0.2rem;
  padding: 0.1rem 0;
  border-bottom: .01rem solid rgba(88, 88, 88, 0.2);
  font-size: 0.12rem;
}

.dropdown-content div:last-child {
  border-bottom: none;
}

// .dropdown:hover .dropdown-content {
//   display: block;
// }
.active {
  color: var(--q-gb-t-c-18) !important;
}

.del-info-dui {
  color: var(--q-gb-t-c-2);
  width: 0.15rem;
  height: 0.15rem;
  background: var(--q-gb-t-c-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.15rem;
  border-radius: 50%;
  margin-left: 0.12rem;
  margin-top: 0.02rem;
}

.del-info-name {
  margin-left: 0.16rem;
  color: var(--q-gb-bg-c-4);
  // margin-top: -.03rem;
  font-size: .14rem;
}

.del-info-icon {
  color: var(--q-gb-bg-c-4);
  // width: 0.12rem;
  // height: 0.12rem;
}

.del-info {
  display: flex;
  font-size: 0.14rem;
  align-items: center;
}

.bet-type {
  font-weight: 500;
  font-size: .14rem;
  margin-top: -.03rem;
}

.bet-all-detele {
  display: flex;
  justify-content: space-between;
  padding: 0 0.15rem;
  background: var(--q-gb-bg-c-10);
  height: 0.4rem;
  align-items: center;

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    right: 0;
    bottom: 0;
    z-index: 8;
  }
}

.icon-arrow-merge {
  background: var(--q-gb-bg-c-1);
  width: 20px;
  height: 20px;
  border-radius: 20px;
  display: flex;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  color: var(--q-gb-t-c-2);
  transition: 0.3s;
  transform: rotate(180deg);
  margin-left: 8px;

  &.arrow {
    transform: rotate(0deg);
  }
}
.icon-arrow:before {
  color: var(--q-gb-t-c-2) !important;
}

.f-a-c {
  display: flex;
  align-items: center;
}
</style>