<!--
 * @Author: gamer
 * @Date: 2023-07-06 18:35:53
 * @Description: 模板id= --用于无盘口&2个/多个投注项玩法
-->
<template>
  <div class="temp1 mx-10 box-style">
    <!-- ms: 0开 1封 2关 11锁 -->
    <!-- hs: 0开 1封 2关 11锁 -->
    <!-- os: 1开 2封 3隐藏不显示不占地方-->
    <!-- 按ol循环，不考虑按tittle循环-->
    <div class="hairline-border" v-if="item_data.title && item_data.title.length > 0">
      <div class="temp1-ol" :style="{ gridTemplateColumns: 'repeat(3, 1fr)' }">
      <div v-for="ol in item_data.hl[0].ol" :key="ol.oid" class="temp1_ol_on">
        <div @click="go_betting({ol,hl: item_data.hl[0],payload:item_data})" :class="[{ 'is-active': ol.oid == active }, 'temp1_ol_ov']" >
            <span class="temp1_ol-on-text">{{ ol.ot || ol.on }}</span>
            <span class="temp1_ol-ov-text">{{ get_oddv(ol.ov/100000) }}</span>
        </div>
      </div>
    </div>
    </div>
    
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
// import { storage_bet_info } from 'src/public/utils/bet/bet_info.js'
// import EMITTER from  "src/global/mitt.js"
const emit = defineEmits(["bet_click_"]);
const props = defineProps({
  item_data: {
    type: Object,
    default: () => {},
  },
  active: {
    type: Number,
    default: () => 0,
  },
});
// 处理赔率截取两位小数点
const get_oddv = (num) => {
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  return num.toString().replace(re, "$1");
}
const go_betting = (data) => {
  emit("bet_click_", data);
  // storage_bet_info(payload)
  // EMITTER.emit("show_bet_dialog", true)
};
onMounted(() => {});
</script>

<style lang="scss" scoped>
.temp1 {
  .item-wrap {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    min-height: 50px;
    height: 50px;
    height: auto;
    border-radius: 4px;
    overflow: hidden;

    .item2 {
      min-height: 50px;
      height: 50px;
      border: 1px solid #F5F5F5;
      border-width: 1px 0 0 0;
      &:nth-child(2n) {
        margin-right: 0;
        border-right: 0;
      }
      .is-active {
        background: #ff7000;
        color: #fff;
        .ol-on {
          .ol-ov {
            color: #fff;
          }
        }
      }
    }
  }

  .bor-style {
  }

  .play-box-style {
    width: 100%;
    min-height: 50px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ol-on {
      .ol-ov {
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: #ff7000;
      }
    }
  }

  .play-box-sty {
    width: 100%;
    display: flex;
  }
  .temp1-ol {
    display: grid;
    .temp1_ol_on {
      background: #ffffff;
      .temp1_ol_ov {
        border: 1px solid #F5F5F5;
        border-width: 1px 1px 0 1px;
        background: #fff;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: #FF7000;
        display: flex;
        justify-content: center;
        .temp1_ol-on-text {
            font-weight: 500;
            padding-right: 5px;
            color: #1A1A1A;
            overflow: hidden;
        }
      }
      .temp1_ol_ov:nth-last-child(1) {
        border-bottom: 1px solid #F5F5F5;
      }
      .is-active {
        background: #FF7000;
        color: #fff;
        .temp1_ol-on-text {
            padding-right: 5px;
            font-weight: 500;
            color: #1A1A1A;
        }
      }
    }
  }
  
}

.first-rad {
  &:after {
  }
}
</style>

