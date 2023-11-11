<template>
  <div class="match-detail-odds">
    <template v-if="match_odds_info && match_odds_info.length > 0" >
      <div v-for="(item, index) in match_odds_info" :key="item.topKey" class="odds-wrap">
        <q-separator color="orange" v-if="index != 0" />
        <div class="odds-hpn" @click="expend_toggle(item)">
          <span class="odds-hpn-text">{{ item.hpn }}</span>
          <!-- <img :src="downUrl" alt=""> -->
          <span v-if="topKey_active.includes(item.topKey)" class="odds-hpn-up-icon"></span>
          <span v-else class="odds-hpn-down-icon"></span>
        </div>
        
        <div
          :class="[{ 'is-expend': topKey_active.includes(item.topKey) }, 'odds-expend']"
        >
        {{ `tem${[0, 1, 5, 10].includes(item.hpt) ? tem_choice(item.hpt) : '_other'}   ${ index }` }}
          <component
              :is="componentArr[`tem${[0, 1, 5, 10].includes(item.hpt) ? tem_choice(item.hpt) : '_other'}`]"
              :item_data="item"
              :active="active"
              @bet_click_="bet_click_"
          />
        </div>
      </div>
      <!-- <div class="match-detail-odds-bottom"></div> -->
    </template>
    <template v-else>
      <div v-if="!loading">
        <img class="no-data" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/no_data.png`" alt="">
        <div class="no-data-text">No Data</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, markRaw } from "vue";
import temp0 from "./template/tem0.vue";
import temp1 from "./template/tem1.vue";
import temp3 from "./template/tem3.vue";
import temp5 from "./template/tem5.vue";
import tem_other from "./template/tem_other.vue";
import { storage_bet_info } from "src/core/bet/module/bet_info.js"; //#TODO core/index.js not export storage_bet_info
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js" 
// import EMITTER from "src/global/mitt.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core";
const props = defineProps({
  match_odds_info: {
    type: Array,
    default: () => [],
  },
  match_detail: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: () => false,
  }
});
const emit = defineEmits(["change"]);
const active = ref(1);
const componentArr = ref({
    tem0: markRaw(temp0),
    tem1: markRaw(temp1),
    tem3: markRaw(temp3),
    tem5: markRaw(temp5),
    tem_other: markRaw(tem_other),
});
const tem_choice = (hpt) => {
  if ([0, 1, 5].includes(hpt)) {
    return hpt;
  }
  return 3;
}
// 事件执行函数
const topKey_active = ref([]);
const expend_toggle = (item) => {
  if (topKey_active.value.includes(item.topKey)) {
    topKey_active.value.splice(topKey_active.value.indexOf(item.topKey), 1);
  } else {
    topKey_active.value.push(item.topKey);
  }
}
const bet_click_ = (data) => {
  active.value = +data.oid;
  // storage_bet_info({
  //   payload: {
  //     ...data.payload,
  //     ...props.match_detail,
  //   },
  //   ol: {
  //     ...data.ol,
  //     hps: {
  //       ...data.payload
  //     },
  //     ...data.hl,
  //     ov: get_oddv(data.ol.ov / 100000)
  //   },
  // })
  // useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true)
  let params = {
    oid: data.oid, // 投注项id ol_obj
    _hid: data._hid, // hl_obj 
    _hn: data._hn,  // hn_obj
    _mid: data._mid,  //赛事id mid_obj
  }
  console.log("odds_info.vue", data, params);
  let other = {
    is_detail: true,
    // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
    // 根据赛事纬度判断当前赛事属于 那种投注类型
    bet_type: 'common_bet',
    // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
    device_type: 1, 
    // 数据仓库类型
    match_data_type: "h5_detail", // h5_detail
    // match_data_type: "h5_list", // h5_detail
  }
  set_bet_obj_config(params,other)
}
// 处理赔率截取两位小数点
const get_oddv = (num) => {
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  return num.toString().replace(re, "$1");
}
/**
 *@description 监听到关闭投注框
 *@param {*} 
 *@return {*}
*/
const clear_score_active = () => {
  active.value = 0;
}
onMounted(() => {
  // EMITTER.on("clear_score_active", () => {
  //   clear_score_active()
  // })
});
</script>

<style lang="scss" scoped>
.match-detail-odds {
  // background: #F1F1F1;
  min-height: calc(100vh - 150px);
  border-bottom: 40px solid #F1F1F1;
  .no-data {
    width: 140px;
    height: 140px;
    margin-left: 50%;
    transform: translate(-70px);
  }
  .no-data-text {
    text-align: center;
    color: #A1A3A5;
    font-size: 16px;
  }
}
.odds-wrap {
  background: #ffffff;
  box-sizing: border-box;

  .odds-hpn {
    font-weight: 500;
    font-size: 14px;
    line-height: 45px;
    height: 45px;
    padding: 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .odds-hpn-text {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #1A1A1A;
      font-weight: 500;
    }
    .odds-hpn-down-icon {
      width: 14px;
      height: 14px;
      background: url($SCSSPROJECTPATH+"/image/detail/down.png") no-repeat center;  
    }
    .odds-hpn-up-icon {
      width: 14px;
      height: 14px;
      transform: rotate(180deg);
      background: url($SCSSPROJECTPATH+"/image/detail/down.png") no-repeat center;
    }
  }
  .is-expend {
    display: none;
  }
  .match-detail-odds-bottom {
    width: 100vw;
    height: 30px;
    background: red;
  }
}
</style>
