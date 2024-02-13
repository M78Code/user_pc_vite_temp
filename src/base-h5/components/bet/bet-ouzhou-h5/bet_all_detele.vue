<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-all-detele">
    <div v-show="false"> {{ UserCtr.user_version }}-{{ BetData.bet_data_class_version }}</div>
    <div class="del-info " @click.stop="clear">
      <span class="icon-delete del-info-icon"></span>
      <div class="del-info-name">{{ i18n_t('bet.delete_all') }}</div>
    </div>
    <div class="del-info-select" >
      <img class="select select_a" @click.stop="switch_handle()" v-if="BetData.bet_is_accept" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_a.svg`" alt="" />
      <img class="select select_b" @click.stop="switch_handle()" v-else :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/select_b.svg`" alt="" />
      <span class="del-info-name select_del-info-name"  @click.stop="switch_handle()">{{ i18n_t('bet.bet_auto_msg_1') }}</span>

      <div class="question_mark_box">
        <img class="question_mark" @click="question_handle()" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/question_mark.png`" alt="" />
      </div>
    </div>

  </div>
</template>
<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { useMittEmit, MITT_TYPES,LOCAL_PROJECT_FILE_PREFIX,UserCtr } from "src/output/index.js";
import { useQuasar } from 'quasar'

const clear = () => {
  BetData.set_clear_bet_info()
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
}

const switch_handle = () => {
  BetData.set_bet_is_accept(!BetData.bet_is_accept)
}

const $q = useQuasar()

const question_handle = ()=>{
  console.log("$q===>", $q)
  // $q.dialog({
  //       title: 'Confirm',
  //       message: 'Would you like to turn on the wifi?',
  //       cancel: true,
  //       persistent: true
  // })
}

</script>

<style lang="scss" scoped>

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
  align-items: baseline;
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
  // align-items: center;
}

.del-info-select{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .select{
    margin-left: -0.1rem;
  }

  .select_del-info-name{
    margin-left: 0.05rem;
  }

  .question_mark_box{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // background-color: red;
    .question_mark{
      width: 0.14rem;
      height: 0.1365rem;
      margin-left: .1rem;
    }
  }

}



</style>