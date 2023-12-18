<!--
 * @Author: gamer
 * @Date: 2023-07-06 18:35:53
 * @Description: 模板id= --用于无盘口&2个/多个投注项玩法
-->
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
  <div class="temp3 box-style component tem3">
    <!-- ms: 0开 1封 2关 11锁 -->
    <!-- hs: 0开 1封 2关 11锁 -->
    <!-- os: 1开 2封 3隐藏不显示不占地方-->
    <!-- 按ol循环，不考虑按tittle循环-->
    <div class="hairline-border">
      <template v-for="hl_item in item_data.hl" :key="hl_item.hid">
        <div class="item-wrap" v-if="hl_item && hl_item.ol">
          <div v-for="(ol_item, index) in hl_item.ol" :key="index" class="item2">
            <template v-if="ol_item.result != (void 0)">
              <ResultOlItem :value="ol_item" :hpt="3"></ResultOlItem>
            </template>
            <template v-else>
            <!-- 主程序 start -->
            <div class="ol_ov play-box-style details_color warp"
              @click="go_betting(ol_item)"
              :class="[{ 'is-active': BetData.bet_oid_list.includes(ol_item?.oid ) }]"
            >
              <div class="ellipsis remark fz_14">
                <span>{{ ol_item.on || ol_item.ott }}</span>
              </div>
              <div class="text-right ol-on">
                <template v-if="ol_item.os == 1 && hl_item?.hs != 11">
                  <span class="ol-ov">{{compute_value_by_cur_odd_type(ol_item.ov,ol_item._hpid,ol_item._hsw,MatchDetailCalss.params.sportId)}}</span>
                  <olStatus :item_ol_data="ol_item" :active="BetData.bet_oid_list.includes(ol_item?.oid )"/>
                </template>
                <span v-if="ol_item.os == 2 || hl_item?.item == 11"> <lockImg :ol_item="ol" /></span>
              </div>
            </div>
            <!-- 主程序 end -->
          </template>
          </div>
          <!-- 补空缺 -->
          <!-- <div
            v-if="item_data.hl[0].ol.length % 2 != 0"
            class="details_color item2"
          ></div> -->
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import lockImg from "../lock_img.vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, ref, computed } from "vue";
import olStatus from "../ol_status.vue";
import { odd_lock_ouzhou } from "src/base-h5/core/utils/local-image.js";
import { compute_value_by_cur_odd_type,MatchDetailCalss } from "src/output/index.js"
import ResultOlItem from "../../result/ResultOlItem.vue";
// import { storage_bet_info } from 'src/public/utils/bet/bet_info.js'
// import EMITTER from  "src/global/mitt.js"

const emit = defineEmits(["bet_click_"]);
const props = defineProps({
  item_data: {
    type: Object || Array,
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
};
const go_betting = (data) => {
  if(data.os == 2) return
  emit("bet_click_", data,props.item_data.hpn);
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
      border: 1px solid var(--q-gb-bd-c-10);
      border-width: 1px 0 0 0;
      &:nth-child(2n) {
        margin-right: 0;
        border-right: 0;
      }
      .is-active {
        //background: #ff7000;
        background-color: var(--q-gb-bg-c-1);
        //color: #fff;
        color: var(--q-gb-t-c-2);
        .ol-on {
          .ol-ov {
            //color: #fff;
            color: var(--q-gb-t-c-2);
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
        //color: #ff7000;
        color: var(--q-gb-t-c-1);
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
.lock {
  width: 16px;
  height: 16px;
  position: relative;
  top: 2px;
}
</style>