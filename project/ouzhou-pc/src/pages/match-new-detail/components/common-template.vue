<!--
 * @Author: cooper
 * @Date: 2023-05-20 12:13:55
 * @Description:模板5
-->

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}</div>
  <div v-if="[10].includes(match_info.hpt)" class="temp-simple">
    <div
      class="temp_grid"
      :style="{ gridTemplateColumns: columnTotal(match_info.hl[0]) }"
    >
      <div
        v-for="o in match_info.hl[0].ol"
        :key="o?.oid"
        :class="{
          'temp-active': BetData.bet_oid_list.includes(o.oid),
          temp: true,
        }"
        @click="betItemClick(match_info.hl[0], o)"
      >
        <div
          :title="o.ott"
          :style="{
            color: '#484848',
          }"
          v-show="!match_info.hl[0].hs"
          class="oid-width"
        >
          {{ o.ott }}
          <span>{{ o.on }} </span>
        </div>
        <div v-show="!match_info.hl[0].hs">
          <bet-item
            :key="`bet_0_${o.hild}`"
            :ol_data="o"
            :current_ol="current_ol"
          >
          </bet-item>
          <!-- {{ Math.floor(o.ov / 1000) / 100 }} -->
        </div>
        <div
          style="text-align: center; width: 100%"
          v-show="match_info.hl[0].hs"
        >
          <img
            class="vector"
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="temp-simple">
    <div v-for="item in match_info.hl" :key="item.hid">
      <div
        class="temp_grid"
        :style="{ gridTemplateColumns: columnTotal(item) }"
      >
        <template v-for="(o, index) in item.ol" :key="index">
          <div v-if="o && o.oid">
            <div
              :class="{
                'temp-active':
                  current_ol && BetData.bet_oid_list.includes(o.oid),
                temp: true,
                'temp-right':
                  item.ol.length % 2 !== 0 &&
                  index == item.ol.length - 1 &&
                  columnNum == 2,
                  'close-temp-hover': o._mhs !=0 || o._hs != 0 || o.os != 1,
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
                <span class="oid-width" :title="o.ott">{{ o.ott }}</span>
                <!-- <span
                  v-if="
                    [0].includes(match_info.hpt) && match_info.title.length > 0
                  "
                  v-html="getOn(match_info, o)"
                ></span> -->
                <div
                
                  :style="{
                    color: [1].includes(match_info.hpt) ? '' : '#1A1A1A',
                  }"
                  class="temp-on oid-width"
                >
                <!-- vr 体育才有的图片 -->
                <img :src="get_icon(o.otn)" alt="" v-if="o.otn" style="margin-right: 4px;">
                  <span>{{ o.on }}</span>
                </div>
              </div>
              <div
                v-show="!item.hs||item.hs==11"
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

              <div style="text-align: right; width: 100%" v-show="item.hs&&item.hs!=11">
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
  if (match_info.title?.length > 0 && ![0, 3].includes(match_info.hpt)) {
    if (match_info.hpt === 10) {
      total = 3;
    } else {
      if (["362"].includes(match_info.hpid)) {
        total = 2;
      } else {
        total = match_info.title?.length;
      }
    }
  } else {
    total = 2;
  }
  columnNum.value = total;
  return `repeat(${total}, 1fr)`;
};

const betItemClick = (item, o) => {
  console.log(11111111111111,o)
  // 挂锁不可点击
  // if (o.os != 1&&(o._hs>0&&o._hs!=11)) {
  //   return;
  // }
  // console.log(111111111111133,o)
  bet_oid.value = o.oid;
   emit("betItemClick", item, o, props.match_info.hpn);
};
//  模板hpt0 数字 需要给颜色
const getOn = (match_info, o) => {
  let result = "";
  if (
    match_info &&
    match_info.hl[0].hv &&
    match_info.hpt == 0 &&
    match_info.title?.length > 0
  ) {
    const hv = match_info.hl[0].hv;
    result = o.on.replace(hv, `<span>${hv}</span>`);
  }
  return result;
};

// 事件执行函数

const active = ref(1);

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
  display: grid;
  text-align: center;

  .temp {
    cursor: pointer;
    min-height: 45px;
    line-height: 45px;
    //  border-top: 1px solid #E2E2E2;
    border-left: 1px solid var(--q-gb-bd-c-2);
    border-bottom: 1px solid var(--q-gb-bd-c-2);

    &:hover {
      background: var(--q-gb-bg-c-5);
    }
    &.close-temp-hover  {
      &:hover {
        background: unset;
      }
    }
  }

  & > div:last-child {
    // border-right: none;
  }
}

// 两列展示最后一列为左边的数据的话应给加一个有边框
.temp-right {
  border-right: 1px solid var(--q-gb-bd-c-2);
  margin-right: -1px;
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
  // border-bottom-color: var(--q-gb-bg-c-1) !important;
  &:hover {
    background-color: var(--q-gb-bg-c-5) !important;
    // color: var(--q-gb-t-c-1);
  }

  .temp-on {
    // color: var(--q-gb-t-c-1) !important;
    // margin-left: 10px;
  }
}

.oid-width {
  // min-width: 50px;
  text-align: left;
  display: flex;
  // max-width: 85%;
  line-height: 20px;
  align-items: center;
  margin: 0 4px;
  // height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}

.vector {
  width: 16px;
  height: 16px;
}
</style>
