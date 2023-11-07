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
    <div class="hairline-border">
      <div class="item-wrap" v-if="item_data.hl[0] && item_data.hl[0].ol">
        <div
          v-for="(ol_item, index) in item_data.hl[0].ol"
          :key="index"
          class="item2"
        >
          <!-- 主程序 start -->
          <div
            @click="go_betting({ ol: ol_item, hl: item_data.hl[0], payload: item_data })"
            :class="[
              { 'is-active': ol_item.oid == active },
              'ol_ov',
              'play-box-style',
              'details_color',
              'warp',
            ]"
          >
            <div class="ellipsis remark fz_14">
              <span>
                {{ ol_item.on || ol_item.ott }}
              </span>
            </div>
            <div class="text-right ol-on">
              <span class="ol-ov">{{ get_oddv(ol_item.ov/100000) }}</span>
            </div>
          </div>
          <!-- 主程序 end -->
        </div>
        <!-- 补空缺 -->
        <!-- <div
          v-if="item_data.hl[0].ol.length % 2 != 0"
          class="details_color item2"
        ></div> -->
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
    default: () => ({}),
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
.temp3 {
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

  .remark {
    flex: 1;

    letter-spacing: 0;
  }

  .odds-wrap {
  }

  .active {
  }

  .lock-style {
    width: 100%;
    text-align: center;
    display: block;
  }

  .box-style {
  }

  .white_text {
  }

  .details_color {
  }
}

.first-rad {
  &:after {
  }
}
</style>

