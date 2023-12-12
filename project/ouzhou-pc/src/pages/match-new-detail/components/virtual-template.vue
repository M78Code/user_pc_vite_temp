<!--
 * @Author: cooper
 * @Date: 2023-05-20 12:13:55
 * @Description:vr模版
-->

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}</div>

  <div class="temp-simple">
    <div v-for="item in match_info.hl" :key="item.hid">
      <div class="temp_grid">
        <template v-for="(o, index) in item.ol" :key="index">
          <div v-if="o && o.oid" style="width: 20%">
            <div
              :class="{
                'temp-active':
                  current_ol && BetData.bet_oid_list.includes(o.oid),
                temp: true,
                'temp-right':
                  item.ol.length % 2 == 0 && index == item.ol.length - 1,
              }"
              @click="betItemClick(item, o)"
            >
              <!-- hpt 为1  不需要给颜色 -->
              <div
                style="
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  width: 100%;
                "
              >
                <!-- <span class="oid-width" :title="o.ott">{{ o.ott }}</span> -->
                <div
                  :style="{
                    color: [1].includes(match_info.hpt) ? '' : '#1A1A1A',
                  }"
                  class="temp-on oid-width"
                >
                <div  style="margin-right: 4px;">
                  <img :src="get_icon(o.otv.split('/')[0])" alt=""  style="margin-right: 4px;">
                  <img :src="get_icon(o.otv.split('/')[1])" alt="" >
                </div>
                  <!-- <span>{{ o.on }}</span> -->
                </div>
              </div>
              <div
                v-show="!item.hs"
                class="temp-on"
                :style="{ color: '#ff7000' }"
                style="font-weight: 500"
              >
                <bet-item
                  :key="`bet_0_${o.hild}`"
                  :ol_data="o"
                  :current_ol="current_ol"
                >
                </bet-item>
              </div>

              <div style="text-align: right; width: 100%" v-show="item.hs">
                <img
                  class="vector"
                  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`"
                  alt=""
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, ref, computed, watch } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import betItem from "./bet-item-list-new-data.vue";
const bet_oid = ref("");

const props = defineProps({
  match_info: {
    type: Object,
    default: () => ({}),
  },
  current_ol: {
    type: Object,
    default: () => {},
  },
  get_icon: {
    type: Function,
    default: () => {},
  },
});
const emit = defineEmits(["betItemClick"]);
const columnNum = ref(0); // 获取当前分成几列展示

const columnTotal = (item) => {
  let total;
  const { match_info } = props;
  total = 5;
  columnNum.value = total;
  return `repeat(${total}, 1fr)`;
};

const betItemClick = (item, o) => {
  if (o.os != 1) {
    return;
  }
  bet_oid.value = o.oid;
  emit("betItemClick", item, o, props.match_info.hpn);
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.temp {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  padding: 0 20px;
  color: #484848;
  font-size: 14px;
  font-weight: 500;
}

.temp_grid {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  justify-content: space-between;

  .temp {
    cursor: pointer;
    min-height: 45px;
    line-height: 45px;
    border-bottom: 1px solid var(--q-gb-bd-c-2);
    border-right: 1px solid var(--q-gb-bd-c-2);

    &:hover {
      background: var(--q-gb-bg-c-5);
    }
  }

 
}

// 两列展示最后一列为左边的数据的话应给加一个有边框
.temp-right {
  border-left: 1px solid var(--q-gb-bd-c-2);
}

.temp-simple {
  margin-left: -1px;

  & > div:first-child {
    border-top: 1px solid var(--q-gb-bd-c-2);
  }
}

.temp-active {
  background-color: var(--q-gb-bg-c-5) !important;
  // color: var(--q-gb-t-c-1);
  border-bottom-color: var(--q-gb-bg-c-1) !important;
  &:hover {
    background-color: var(--q-gb-bg-c-5) !important;
    // color: var(--q-gb-t-c-1);
  }


}

.oid-width {
  // min-width: 50px;
  text-align: left;
  display: flex;
  max-width: 75%;
  line-height: 20px;
  align-items: center;
  margin: 0 4px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}

.vector {
  width: 16px;
  height: 16px;
}
</style>
