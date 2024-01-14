<!--
 * @Author: cooper
 * @Date: 2023-05-20 12:13:55
 * @Description:模板5
-->

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}</div>
  <div class="temp-simple">
    <div
      v-for="(value, key) in matchInfo"
      :key="key"
      class="temp_grid"
      :class="{ temp_grid: true }"
    >
      <div class="temp5-hv">{{ key > 0 && hpid == 39 ? "+" + key : key }}</div>
      <div
        v-if="
          value.length == 1 &&
          !hpidList.includes(props.match_info.hpid)
        "
        style="width: 200%"
        @click="betItemClick(key, value[0])"
        :class="{
          'temp-active': BetData.bet_oid_list.includes(value[0].oid),
          temp_grid_item: true,
          'close-temp5-hove': value[0]._hs !=0 || value[0]._mhs !=0 || value[0].os !=1,
        }"
      >
        <span v-show="value[0].hs">
          <bet-item :ol_data="value[0]" :current_ol="current_ol"> </bet-item>
        </span>
        <div style="text-align: center; width: 100%" v-show="value[0].hs">
          <img
            class="vector"
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`"
            alt=""
          />
        </div>
      </div>
      <template v-else>
        <div
          v-for="o in value"
          :class="{
            temp_grid_item: true,
            'temp-active': BetData.bet_oid_list.includes(o.oid),
            'close-temp5-hove': value[0]._hs !=0 || value[0]._mhs !=0 || value[0].os !=1,
          }"
          :style="{ width: value.length > 1 ? '100%' : '200%' }"
          :key="o.oid"
          @click="betItemClick(key, o)"
        >
          <span>
            <bet-item
              :key="`bet_0_${o.hild}`"
              :ol_data="o"
              :current_ol="current_ol"
            >
            </bet-item>
          </span>
          <!-- <div style="text-align: center; width: 100%" v-show="o.hs">
            <img
              class="vector"
              :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`"
              alt=""
            />
          </div> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, ref, computed } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import betItem from "./bet-item-list-new-data.vue";

const props = defineProps({
  match_info: {
    type: Object,
    default: () => {},
  },
  current_ol: {
    type: Object,
    default: () => {},
  },
  hpid: {
    type: String,
    default: "",
  },
});
const hpidList = ["340","339", "359", "383","200","209","211","212",'238','20024']
const matchInfo = computed(() => {
  let obj = {};
  props.match_info.hl.forEach((item) => {
    if (item && item.ol.length > 0) {
      item.ol.forEach((i) => {
        i.hs = item.hs;
        if (!hpidList.includes(props.match_info.hpid)) {
          i.on = item.hv;
        }

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
const emit = defineEmits(["betItemClick"]);

const bet_oid = ref("");

// 事件执行函数

const active = ref(1);

const betItemClick = (key, o) => {
  if (o.os != 1) {
    return;
  }
  bet_oid.value = o.oid;

  let obj = "";
  if (props.match_info.hl.length == 1) {
    obj = props.match_info.hl[0];
  } else {
    obj = props.match_info.hl.find((item) => item.hv === key);
  }
  emit("betItemClick", obj, o, props.match_info.hpn);
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.temp_grid {
  cursor: pointer;
  display: grid;
  text-align: center;
  color: #484848;
  grid-template-columns: repeat(3, 1fr);

  & > div {
    // cursor: pointer;
    height: 45px;
    line-height: 45px;
    //  border-top: 1px solid #E2E2E2;
    border-left: 1px solid var(--q-gb-bd-c-2);
    border-bottom: 1px solid var(--q-gb-bd-c-2);
  }

  & > div:last-child {
    border-right: none;
  }
}

.temp-simple {
  margin-left: -1px;

  & > div:first-child {
    border-top: 1px solid var(--q-gb-bd-c-2);
  }
}

.temp-active {
  background-color: var(--q-gb-bg-c-5) !important;
  color: var(--q-gb-t-c-1) ;
  // border-bottom: none !important;
  &:hover {
    background-color: var(--q-gb-bg-c-5) !important;
    color: var(--q-gb-t-c-1);
  }
}
.odds-lift {
  color: var(--q-gb-t-c-5) !important;
  background-color: var(--q-gb-bg-c-5) !important;
}

.temp5-hv {
  // background-color: #f5f5f5;
  color: var(--q-gb-t-c-5);
  font-size: 14px;
  font-weight: 500;
}

.temp_grid_item {
  color: var(--q-gb-t-c-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: var(--q-gb-bg-c-5);
  }
  &.close-temp5-hove {
    &:hover {
      background: unset;
    }
  }
}

.vector {
  width: 16px;
  height: 16px;
}
</style>