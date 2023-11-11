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
      <div
        v-for="(value, key) in matchInfo"
        :key="key"
        class="temp_grid ol_on"
        >
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
        <div v-if="value.length==1" @click="go_betting(value)"   :class="{ 'is-active': value[0].oid === active, 'temp_grid_item': true, 'ol_ov': true }">
          <span class="o_hv">{{ value.hv || key }}</span>
          <span>{{ get_oddv(value?.ov/100000) }}</span>{{value.ov}}
        </div>
        <template v-else>
          <div v-for="o in value" :class="{'temp_grid_item': true, 'is-active': o.oid == active, 'ol_ov': true }" :key="o.oid"
            @click="go_betting( o)">
            <span class="o_hv">{{ o.on || key }}</span>
            <span>{{ get_oddv(o?.ov/100000) }}</span>
          </div>
        </template>
      </div>
    </template>

    <template v-else>
      <div v-for="ol in item_data.hl[0].ol" :key="ol.oid" class="ol_on">
        <div
          @click="go_betting(ol)"
          :class="[{ 'is-active': ol.oid == active }, 'ol_ov']"
        >
          <span class="ol-on-text">{{ ol.on }}</span>
          <span
            class="ol-ov-text"
            >{{ get_oddv(ol.ov/100000) }}</span
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
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
  // console.log("payload", data);
  // storage_bet_info(payload)
  emit("bet_click_", data);
  // EMITTER.emit("show_bet_dialog", true);
};
const matchInfo = computed(() => {
   let obj = {}
  props.item_data.hl.forEach(item => {
    if (item&& item.ol.length > 0) {
    item.ol.forEach(i => {
      if (!obj[i.on]) {
        obj[i.on] = []
        obj[i.on] = [i]
      } else {
        obj[i.on] = [...obj[i.on], i]
      }
    });
  }
    
  });
   return obj
})
const columnTotal = (item) => {
  let total;
  if (item.title.length > 0) {
    total = item.title.length > 3 ? 3 : item.title.length;;
  } else {
    total = 2;
  }
  return `repeat(${total}, 1fr)`;
};
// 处理赔率截取两位小数点
const get_oddv = (num) => {
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  return num.toString().replace(re, "$1");
}
onMounted(() => {
  // console.error("type", props.item_data);
  setTimeout(() => {
    // console.log("matchInfo", matchInfo);
  }, 100)
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
      color: #1a1a1a;
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
      background: #f5f5f5;
      color: #1a1a1a;
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
      background: #ffffff;
      .o_hv {
        color: #1a1a1a;
        padding-right: 5px;
      }
      .ol_ov {
        border: 1px solid #f5f5f5;
        border-width: 1px 1px 0 0;
        background: #fff;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: #ff7000;
        display: flex;
        justify-content: center;
        .ol-on-text {
          font-weight: 500;
          padding-right: 5px;
          color: #1a1a1a;
          overflow: hidden;
        }
      }
      .is-active {
        background: #ff7000;
        color: #fff;
        .ol-on-text {
          padding-right: 5px;
          font-weight: 500;
          color: #1a1a1a;
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
      border-left: 1px solid #F5F5F5;
      border-bottom: 1px solid #F5F5F5;
    }

    & > div:last-child {
      border-right: none;
    }
  }

  .temp-simple {
    margin-left: -1px;

    & > div:first-child {
      border-top: 1px solid #F5F5F5;
    }
  }

  .temp-active {
    background-color: #ff7000;
    color: #ffffff;

    &:hover {
      background: #ff7000 !important;
      color: #ffffff;
    }
  }

  .temp5-hv {
    // background-color: #f5f5f5;
    color: #484848;
    border-right: 1px solid #F5F5F5;
  }

  .temp_grid_item {
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      background: #fff1e6;
    }
  }
}
</style>

