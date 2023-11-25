<!--
 * @Author: gamer
 * @Date: 2023-07-06 18:35:53
 * @Description: 模板id= --用于无盘口&2个/多个投注项玩法
-->
<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}</div>
  <div class="temp3 box-style component tem5">
    <!-- ms: 0开 1封 2关 11锁 -->
    <!-- hs: 0开 1封 2关 11锁 -->
    <!-- os: 1开 2封 3隐藏不显示不占地方-->
    <!-- 按ol循环，不考虑按tittle循环-->
    <template v-if="item_data.title && item_data.title.length > 0">
      <div
        :style="{ gridTemplateColumns: columnTotal(item_data) }"
        class="odds-title"
      >
        <!-- <span class="odds-title-li"></span> -->
        <div
          v-for="opt in item_data.title"
          :key="opt.otd"
          class="odds-title-li"
        >
          <span class="odds-title-li-text">{{ opt.osn }}</span>
        </div>
      </div>
      <div v-for="(value, key) in matchInfo" :key="key" class="temp_grid ol_on">
        <!-- <div class="temp5-hv">{{ value.hv || key }}</div> -->
        <!-- <div >
          <div
              v-for="o in value.ol"
              :key="o.oid"
              @click="go_betting({ ol: o, hl: value, payload: item_data })"
              :class="[{ 'is-active': o.oid == active }, 'ol_ov']"
            >
            <span>{{ (o.ov / 100000).toFixed(2) }}</span>
          </div>
        </div>
        <div></div> -->
        <div
          v-if="value.length == 1"
          @click="go_betting(value[0])"
          :class="{
            'is-active': value[0].oid === active,
            temp_grid_item: true,
            ol_ov: true,
          }"
        >
          <template v-if="value[0].os == 1">
            <span class="o_hv">{{ value[0].hv || key }}</span>
            <span>{{compute_value_by_cur_odd_type(value[0]?.ov,'','',MatchDetailCalss.params.sportId)}}</span>
            <olStatus :item_ol_data="value[0]" />
          </template>
          <span v-else
            ><img class="lock" :src="odd_lock_ouzhou" alt="lock"
          /></span>
        </div>
        <template v-else>
          <div
            v-for="o in value"
            :class="{
              temp_grid_item: true,
              'is-active': o.oid == active,
              ol_ov: true,
            }"
            :key="o.oid"
            @click="go_betting(o)"
          >
            <template v-if="o.os == 1">
              <span class="o_hv">{{ o.on || key }}</span>
              <span>{{compute_value_by_cur_odd_type(o.ov,'','',MatchDetailCalss.params.sportId)}}</span>
              <olStatus :item_ol_data="o" />
            </template>
            <span v-else
              ><img class="lock" :src="odd_lock_ouzhou" alt="lock"
            /></span>
          </div>
        </template>
      </div>
    </template>

    <template v-else>
      <template v-for="hl_item in item_data.hl" :key="hl_item.hid">
        <div v-for="ol in hl_item.ol" :key="ol.oid" class="ol_on">
          <div
            @click="go_betting(ol)"
            :class="[
              { 'is-active': BetData.bet_oid_list.includes(ol?.oid) },
              'ol_ov',
            ]"
          >
            <template v-if="ol.os == 1">
              <span class="ol-on-text">{{ ol.on }}</span>
              <span class="ol-ov-text">{{compute_value_by_cur_odd_type(ol?.ov,'','',MatchDetailCalss.params.sportId)}}</span>
              <olStatus
                :item_ol_data="ol"
                :active="BetData.bet_oid_list.includes(ol?.oid)"
              />
            </template>
            <span v-if="ol.os == 2"
              ><img class="lock" :src="odd_lock_ouzhou" alt="lock"
            /></span>
          </div>
        </div>
      </template>
      
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import { odd_lock_ouzhou } from "src/base-h5/core/utils/local-image.js";
import olStatus from "../ol_status.vue";
import { compute_value_by_cur_odd_type,MatchDetailCalss } from "src/core/index.js"
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

const go_betting = (data) => {
  if (data.os == 2) return;
  // console.log("payload", data);
  // storage_bet_info(payload)
  emit("bet_click_", data,props.item_data.hpn);
  // EMITTER.emit("show_bet_dialog", true);
};
const matchInfo = computed(() => {
  let obj = {};
  props.item_data.hl.forEach((item) => {
    if (item && item.ol.length > 0) {
      item.ol.forEach((i) => {
        if (!obj[i.on]) {
          obj[i.on] = [];
          obj[i.on] = [i];
        } else {
          obj[i.on] = [...obj[i.on], i];
        }
      });
    }
  });
  return obj;
});
const columnTotal = (item) => {
  let total;
  if (item.title.length > 0) {
    total = item.title.length > 3 ? 3 : item.title.length;
  } else {
    total = 2;
  }
  return `repeat(${total}, 1fr)`;
};
// 处理赔率截取两位小数点
const get_oddv = (num) => {
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  return num.toString().replace(re, "$1");
};
onMounted(() => {
  // console.error("type", props.item_data);
  setTimeout(() => {
    // console.log("matchInfo", matchInfo);
  }, 100);
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
    display: grid;
    text-align: center;
    font-weight: 500;
    // height: 26px;
    // line-height: 26px;

    .odds-title-li {
      //background: #f5f5f5;
      background-color: var(--q-gb-bg-c-10);
      color: var(--q-gb-t-c-4);
      font-size: 12px;
      height: 30px;
      line-height: 30px;
      // margin-bottom: 10px;
    }
  }
  .is-expend {
    display: none;
  }
  .ol_on {
    background-color: var(--q-gb-bg-c-2);
    .o_hv {
      color: var(--q-gb-t-c-4);
      padding-right: 5px;
    }
    .ol_ov {
      border: 1px solid var(--q-gb-bd-c-10);
      border-width: 1px 1px 0 0;
      background-color: var(--q-gb-bg-c-2);
      height: 50px;
      line-height: 50px;
      font-weight: 500;
      //color: #ff7000;
      color: var(--q-gb-t-c-1);
      display: flex;
      justify-content: center;
      align-items: center;
      .ol-on-text {
        font-weight: 500;
        padding-right: 5px;
        color: var(--q-gb-t-c-4);
        overflow: hidden;
      }
    }
    .is-active {
      //background: #ff7000;
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
  .temp_grid {
    cursor: pointer;
    display: grid;
    text-align: center;
    color: #484848;
    font-weight: 500;
    grid-template-columns: repeat(2, 1fr);

    & > div {
      // cursor: pointer;
      height: 50px;
      line-height: 50px;
      //  border-top: 1px solid #E2E2E2;
      border-left: 1px solid #f5f5f5;
      border-bottom: 1px solid var(--q-gb-bd-c-10);
    }

    & > div:last-child {
      border-right: none;
    }
  }

  .temp-simple {
    margin-left: -1px;

    & > div:first-child {
      border-top: 1px solid #f5f5f5;
    }
  }

  .temp-active {
    //background-color: #ff7000;
    background-color: var(--q-gb-bg-c-1);
    //color: #ffffff;
    color: var(--q-gb-t-c-2);

    &:hover {
      background: var(--q-gb-bd-c-1) !important;
      //olor: #ffffff;
      color: var(--q-gb-t-c-2);
    }
  }

  .temp5-hv {
    // background-color: #f5f5f5;
    color: #484848;
    border-right: 1px solid #f5f5f5;
  }

  .temp_grid_item {
    cursor: pointer;
    font-weight: 500;

    &:hover {
      background: #fff1e6;
    }
  }
}
.lock {
  width: 16px;
  height: 16px;
  position: relative;
  top: 2px;
}
</style>
