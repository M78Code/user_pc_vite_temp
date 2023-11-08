<!--
 * @Author: gamer
 * @Date: 2023-07-06 18:35:53
 * @Description: 模板id= --用于无盘口&2个/多个投注项玩法
-->
<template>
  <div class="temp3 mx-10 box-style">
    <!-- ms: 0开 1封 2关 11锁 -->
    <!-- hs: 0开 1封 2关 11锁 -->
    <!-- os: 1开 2封 3隐藏不显示不占地方-->
    <!-- 按ol循环，不考虑按tittle循环-->
    <div :style="{ gridTemplateColumns: columnTotal(item_data) }" class="odds-title">
      <template v-if="item_data.title && item_data.title.length > 0 && item_data.title.length < 3">
        <div v-for="opt in item_data.title" :key="opt.otd" class="odds-title-li">
          <div class="odds-title-li-text" v-if="![0, 1, 3, 5, 7, 10].includes(item_data.hpt)">
            <span>{{
              opt.osn
            }}</span>
          </div>
          
          <div v-for="ol in item_data.hl[0].ol" :key="ol.oid" class="ol_on">
            <template v-if="ol.otd === opt.otd">
              <!-- <div>{{ ol.on }}</div> -->
              
              <div @click="go_betting({ol,hl: item_data.hl[0],payload:item_data})" :class="[{ 'is-active': ol.oid == active }, 'ol_ov']" >
                  <!-- {{ (ol.ov/100000).toFixed(2) }} -->
                  <span class="ol-on-text">{{ ol.on || ol.ott }}</span>
                  <span class="ol-ov-text">{{ get_oddv(ol.ov/100000) }}</span>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="ol in item_data.hl[0].ol" :key="ol.oid" class="ol_on">
          <div @click="go_betting({ol,hl: item_data.hl[0],payload:item_data})" :class="[{ 'is-active': ol.oid == active }, 'ol_ov']" >
              <span class="ol-on-text">{{ ol.on || ol.ott }}</span>
              <span class="ol-ov-text">{{ get_oddv(ol.ov/100000) }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { storage_bet_info } from "src/core/bet/module/bet_info.js"; //#TODO core/index.js not export storage_bet_info
// import EMITTER from  "src/global/mitt.js"
const emit = defineEmits(["bet_click_"])
const props = defineProps({
  item_data: {
    type: Object,
    default: () => ({}),
  },
  active: {
    type: Number|String,
    default: () => 0,
  },
});
// const tabClick = (ol) => {
//     emit("bet_click_", ol);
// }

const go_betting = (data) => {
  emit("bet_click_", data);
  storage_bet_info(payload)
  // EMITTER.emit("show_bet_dialog", true)
}
// 处理赔率截取两位小数点
const get_oddv = (num) => {
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  return num.toString().replace(re, "$1");
}
const columnTotal = (item) => {
  let total;
  if (item.title.length > 0) {
    total = item.title.length > 3 ? 3 : item.title.length;
  } else {
    total = 2;
  }
  return `repeat(${total}, 1fr)`;
};
onMounted(() => {
  // console.error('type',props.item_data)
});
</script>

<style lang="scss" scoped>
.odds-wrap {
  background: #ffffff;
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
      color: #1A1A1A;
      font-weight: 500;
    }
    img {
      width: 14px;
      height: 14px;
    }
  }
  .odds-title {
    
    display: grid;
    text-align: center;
    // height: 36px;
    // line-height: 26px;

    .odds-title-li {
      
      color: #1a1a1a;
      font-size: 12px;
      
      // margin-bottom: 10px;
      .odds-title-li-text {
        background: #f5f5f5;
        height: 30px;
        line-height: 30px;
      }
    }
    .ol_on {
      background: #ffffff;
      .ol_ov {
        border: 1px solid #F5F5F5;
        border-width: 1px 1px 0 1px;
        background: #fff;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: #FF7000;
        display: flex;
        justify-content: center;
        .ol-on-text {
            font-weight: 500;
            padding-right: 5px;
            color: #1A1A1A;
            overflow: hidden;
        }
      }
      .ol_ov:nth-last-child(1) {
        border-bottom: 1px solid #F5F5F5;
      }
      .is-active {
        background: #FF7000;
        color: #fff;
        .ol-on-text {
            padding-right: 5px;
            font-weight: 500;
            color: #1A1A1A;
        }
      }
    }
  }
  .is-expend {
    display: none;
  }
}
</style>

