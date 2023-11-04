<!--
 * @Author: cooper
 * @Date: 2023-05-20 12:13:55
 * @Description:模板5
-->

<template>
  <div class="temp-simple">
    <div v-for="(value, key) in matchInfo" :key="key" class="temp_grid" :class="{ temp_grid: true }">
      <div class="temp5-hv">{{ key }}</div>
      <div v-if="value.length == 1" style="width: 200%" @click="betItemClick(key, value[0])" :class="{
        'temp-active': value[0].oid === current_ol.oid,
        temp_grid_item: true,
      }">
        <span v-show="value[0].hs"> {{ Math.floor(value[0].ov / 1000) / 100 }}</span>
        <div style="text-align: center; width: 100%"  v-show="value[0].hs">
            <img class="vector" src="../../../../assets/images/vector.png" alt="" />
          </div>
      </div>
      <template v-else>
        <div v-for="o in value" :class="{
          temp_grid_item: true,
          'temp-active': o.oid === current_ol.oid,
        }" :key="o.oid" @click="betItemClick(key, o)">
          <span  v-show="!o.hs"> {{ Math.floor(o.ov / 1000) / 100 }}</span>
          <div style="text-align: center; width: 100%"  v-show="o.hs">
            <img class="vector" src="../../../../assets/images/vector.png" alt="" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";

const props = defineProps({
  match_info: {
    type: Array,
    default: () => [],
  },
  current_ol: {
    type: Object,
    default: () => { },
  },
});
const matchInfo = computed(() => {
  let obj = {};
  props.match_info.forEach((item) => {
    if (item && item.ol.length > 0) {
      item.ol.forEach((i) => {
        i.hs = item.hs;
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
  bet_oid.value = o.oid;

  let obj = "";
  if (props.match_info.length == 1) {
    obj = props.match_info[0];
  } else {
    obj = props.match_info.find((item) => item.hv === key);
  }
  emit("betItemClick", obj, o);
};

onMounted(() => { });
</script>

<style lang="scss" scoped>
.temp_grid {
  cursor: pointer;
  display: grid;
  text-align: center;
  color: #484848;
  grid-template-columns: repeat(3, 1fr);

  &>div {
    // cursor: pointer;
    height: 45px;
    line-height: 45px;
    //  border-top: 1px solid #E2E2E2;
    border-left: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;
  }

  &>div:last-child {
    border-right: none;
  }
}

.temp-simple {
  margin-left: -1px;

  &>div:first-child {
    border-top: 1px solid #e2e2e2;
  }
}

.temp-active {
  background-color: #ff7000;
  color: #ffffff !important;

  &:hover {
    background: #ff7000 !important;
    color: #ffffff;
  }
}

.temp5-hv {
  background-color: #f5f5f5;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
}

.temp_grid_item {
  color: #ff7000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #fff1e6;
  }
}

.vector {
    width: 16px;
    height: 16px;
  }
</style>
