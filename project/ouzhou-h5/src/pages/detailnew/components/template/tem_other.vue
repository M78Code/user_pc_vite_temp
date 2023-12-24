<!--
 * @Author: gamer
 * @Date: 2023-07-06 18:35:53
 * @Description: 模板id= --用于无盘口&2个/多个投注项玩法
-->
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp3 box-style component tem-other">
    <!-- ms: 0开 1封 2关 11锁 -->
    <!-- hs: 0开 1封 2关 11锁 -->
    <!-- os: 1开 2封 3隐藏不显示不占地方-->
    <!-- 按ol循环，不考虑按tittle循环-->
    <!-- 
      垃圾,4202年还用grid, 哥们还是看看flex布局吧
      :style="{ gridTemplateColumns: columnTotal(item_data) }"
    -->
    <div class="odds-title">
      <template
        v-if="
          item_data.title &&
          item_data.title.length > 0 &&
          item_data.title.length <= 3
        "
      >
        <div v-for="opt in item_data.title" :key="opt.otd" class="odds-title-li">
          <!-- 根据UI显示hpt：7（全场让球胜平负）玩法头
          <div class="odds-title-li-text" v-if="![0, 1, 3, 5, 7, 10].includes(item_data.hpt)">
          -->
          <div class="odds-title-li-text" v-if="![0, 1, 3, 5, 10].includes(item_data.hpt)">
            <span>{{ opt.osn }}</span>
          </div>
          <template v-for="hl_item in item_data.hl" :key="hl_item.hid">
            <div v-for="ol in filter(hl_item)" :key="ol?.oid" class="ol_on">
              <template v-if="ol?.otd === opt?.otd">
                <!-- <div>{{ ol.on }}</div> -->
                <div class="ol_ov"
                  @click="go_betting(ol)" :class="[{ 'is-active': BetData.bet_oid_list.includes(ol?.oid ) }]">
                  <!-- {{ (ol.ov/100000).toFixed(2) }} -->

                  <template v-if="ol?.os == 1 && ol?._hs != 11">
                    <span class="ol-on-text">{{ ol?.on || ol?.ott }}</span>
                    <span class="ol-ov-text"> {{compute_value_by_cur_odd_type(ol.ov,ol._hpid,ol._hsw,MatchDetailCalss.params.sportId)}}</span>
                    <olStatus :item_ol_data="ol" :active="ol.oid == active" />
                  </template>
                  <span v-if="ol?.os == 2 || ol?._hs == 11">
                    <lockImg :ol_item="ol" />
                  </span>
                  <ResultOlItem :value="ol"></ResultOlItem>
                </div>
              </template>
            </div>
          </template>
         
        </div>
      </template>

      <template v-else>
        <template v-for="hl_item in item_data.hl" :key="hl_item.hid">
          <div v-for="ol in filter(hl_item)" :key="ol?.oid" class="ol_on">
            <div class="ol_ov else" @click="go_betting(ol)" :class="[{ 'is-active': BetData.bet_oid_list.includes(ol?.oid ) }]">
              <template v-if="ol?.os == 1">
                <span class="ol-on-text">{{ ol?.on || ol?.ott }}</span>
                <span class="ol-ov-text"> {{compute_value_by_cur_odd_type(ol.ov,ol._hpid,ol._hsw,MatchDetailCalss.params.sportId)}}</span>
                <olStatus :item_ol_data="ol" :active="BetData.bet_oid_list.includes(ol?.oid )" />
              </template>
              <span v-if="ol?.os == 2"> <lockImg :ol_item="ol" /></span>
              <ResultOlItem :value="ol"></ResultOlItem>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import lockImg from "../lock_img.vue";
import { onMounted, ref, computed } from "vue";
import { odd_lock_ouzhou } from "src/base-h5/core/utils/local-image.js";
import { compute_value_by_cur_odd_type,MatchDetailCalss } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
// import EMITTER from  "src/global/mitt.js"
import olStatus from "../ol_status.vue";
import ResultOlItem from "../../result/ResultOlItem.vue";

const emit = defineEmits(["bet_click_"]);
const props = defineProps({
  item_data: {
    type: Object,
    default: () => ({}),
  },
  active: {
    type: Number || String,
    default: () => 0,
  },
});
// const tabClick = (ol) => {
//     emit("bet_click_", ol);
// }

const go_betting = (data) => {
  if(data.os == 2) return 
  emit("bet_click_", data,props.item_data.hpn);
  // storage_bet_info(payload)
  // EMITTER.emit("show_bet_dialog", true)
};
// 处理赔率截取两位小数点
const get_oddv = (num) => {
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  return num.toString().replace(re, "$1");
};
const columnTotal = (item) => {
  let total;
  if (item.title.length > 0) {
    total = item.title.length > 3 ? 3 : item.title.length;
  } else {
    total = 2;
  }
  return `repeat(${total}, 1fr)`;
};

function filter(item){
  return item.ol.filter((i)=>i.result!=(void 0) || i.os !=3)
}
onMounted(() => {
  // console.error('type',props.item_data)
});
</script>

<style lang="scss" scoped>
.odds-wrap {
  background-color: var(--q-gb-bg-c-2);
  box-sizing: border-box;

  .odds-hpn {
    font-weight: 500;
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    padding: 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .odds-hpn-text {
      color: var(--q-gb-t-c-4);
      font-weight: 500;
    }
    img {
      width: 14px;
      height: 14px;
    }
  }
  .odds-title {
    // display: grid;
    display: flex;
    text-align: center;
    // height: 36px;
    // line-height: 26px;

    .odds-title-li {
      color: var(--q-gb-t-c-4);
      font-size: 12px;
      flex: 1;
      width: 0;
      // margin-bottom: 10px;
      .odds-title-li-text {
        //background: #f5f5f5;
        background-color: var(--q-gb-bg-c-10);
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-wrap: nowrap;
        width: 100%;
      }
    }
    .ol_on {
      background-color: var(--q-gb-bg-c-2);
      flex: 1;
      min-width: 25%;
      .ol_ov {
        border: 1px solid var(--q-gb-bd-c-10);
        border-width: 1px 1px 0 1px;
        background-color: var(--q-gb-bg-c-2);
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        width: 100%;
        color: var(--q-gb-t-c-1);
        display: flex;
        justify-content: center;
        .ol-on-text {
          font-weight: 500;
          padding-right: 5px;
          color: var(--q-gb-t-c-4);
          overflow: hidden;
        }
        &:nth-last-child(1) {
          border-bottom: 1px solid var(--q-gb-bd-c-10);
        }
      }
      .is-active {
        //background: #FF7000;
        background-color: var(--q-gb-bg-c-1);
        //color: #fff;
        color: var(--q-gb-t-c-2);
        .ol-on-text {
          padding-right: 5px;
          font-weight: 500;
          color: var(--q-gb-t-c-4);
        }
      }
    }
  }
  .is-expend {
    display: none;
  }
}
.lock {
  width: 16px;
  height: 16px;
  position: relative;
  top: 2px;
}
</style>