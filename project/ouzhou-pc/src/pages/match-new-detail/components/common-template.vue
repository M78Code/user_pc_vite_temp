<!--
 * @Author: cooper
 * @Date: 2023-05-20 12:13:55
 * @Description:模板5
-->

<template>
  <div v-if="[10].includes(match_info.hpt)" class="temp-simple">
    <div class="temp_grid" :style="{ gridTemplateColumns: columnTotal(item) }">
      <div v-for="o in match_info.hl[0].ol" :key="o?.oid" :class="{ 'temp-active': o.oid == current_ol.oid, 'temp': true }"
        @click="betItemClick(match_info.hl[0], o)">
        <div :style="{ color: o.oid == current_ol.oid ? '#ffffff' : '#ff7000' }" class="oid-width" :title="o.ott">{{ o.ott
        }} <span>{{ o.on }}
          </span></div>
        <div  v-show="!match_info.hl[0].hs">{{ Math.floor(o.ov / 1000) / 100 }} </div>
        <div style="text-align: center;width:100%" v-show="match_info.hl[0].hs">
          <img class="vector" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`" alt="" >
        </div>

      </div>
    </div>

  </div>
  <div v-else class="temp-simple">
    <div v-for="item in match_info.hl" :key="item.hid">
      <div class="temp_grid" :style="{ gridTemplateColumns: columnTotal(item) }">
        <div v-for="o in item.ol" :key="o?.oid" :class="{ 'temp': true, 'temp-active': o.oid == current_ol.oid }"
          @click="betItemClick(item, o)">
          <!-- hpt 为1  不需要给颜色 -->
          <div style="font-weight:500;display: flex; align-items: center;width:100%"  v-show="!item.hs">
            <span class="oid-width" :title="o.ott"> {{ o.ott }}</span>

            <span v-if="[0].includes(match_info.hpt) && match_info.title.length > 0" v-html="getOn(match_info, o)"></span>
            <span v-else :style="{ color: [1].includes(match_info.hpt) ? '' : '#1A1A1A' }" class="temp-on oid-width">{{
              o.on
            }}</span>
          </div>
          <div v-show="!item.hs" class="temp-on" :style="{ color: '#ff7000' }" style="font-weight: 500;">{{ Math.floor(o.ov / 1000) / 100 }}
          </div>

          <div style="text-align: center;width:100%" v-show="item.hs">
          <img class="vector" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vector.png`" alt="" >
        </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/core/index.js';
const bet_oid = ref('')

const props = defineProps({
  match_info: {
    type: Object,
    default: () => ({})
  },
  current_ol: {
    type: Object,
    default: () => { }
  }
})
const emit = defineEmits(['betItemClick'])


const columnTotal = (item) => {
  let total;
  const { match_info } = props
  if (match_info.title.length > 0 && match_info.hpt !== 0) {
    if (match_info.hpt === 10) {
      total = 3
    } else {
      if (['362'].includes(match_info.hpid)) {
        total = 2
      } else {
        total = match_info.title.length
      }

    }
  } else {
    total = 2
  }
  return `repeat(${total}, 1fr)`
}

const betItemClick = (item, o) => {
  bet_oid.value = o.oid
  emit('betItemClick', item, o)

}
//  模板hpt0 数字 需要给颜色
const getOn = (match_info, o) => {
  let result = ''
  if (match_info && match_info.hl[0].hv && match_info.hpt == 0 && match_info.title.length > 0) {
    const hv = match_info.hl[0].hv
    result = o.on.replace(hv, `<span>${hv}</span>`)
  }
  return result
}




// 事件执行函数

const active = ref(1)




onMounted(() => {

});
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

  &>div {
    cursor: pointer;
    min-height: 45px;
    line-height: 45px;
    //  border-top: 1px solid #E2E2E2;
    border-left: 1px solid #E2E2E2;
    border-bottom: 1px solid #E2E2E2;

    &:hover {
      background: #FFF1E6;
    }
  }

  &>div:last-child {
    border-right: none;
  }
}

.temp-simple {
  margin-left: -1px;

  &>div:first-child {
    border-top: 1px solid #E2E2E2;
  }
}

.temp-active {
  background: #ff7000;
  color: #ffffff;

  &:hover {
    background: #ff7000 !important;
    color: #ffffff;

  }

  .temp-on {
    color: #ffffff !important;
    // margin-left: 10px;
  }
}

.oid-width {
  // min-width: 50px;
  text-align: left;
  display: flex;
  max-width: 75%;
  line-height: 20px;
  align-items: center;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}

.vector {
  width: 16px;
  height: 16px;
}</style>

