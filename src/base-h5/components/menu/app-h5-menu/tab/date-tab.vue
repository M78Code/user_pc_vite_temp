<!--
 * @Author: rise
 * @Date: 2023-10-20 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-10-30 16:00:35
 * @Description:  
-->
<template>
  <div class="date-tab-wap">
    <div class="date-tab-content">
      <ul class="date-tab-content-ul">
        <li
          ref="dateTab"
          :class="{ active: activeOn === index }"
          v-for="(item, index) in dataList"
          :key="index"
          @click="changeTabMenu(item, index, $event)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script setup>
// import lodash from "lodash";
import { onUnmounted, ref } from "vue";
import { scrollMenuEvent } from "../utils";
import { MenuData } from "src/output/index.js";
// import { api_common } from "src/api/";
// import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
// import MatchMeta from "src/core/match-list-h5/match-class/match-meta";
// import { i18n_tc } from "src/boot/i18n";

const props = defineProps({
  defaultVal: {
    type: Number,
    default: 0,
  },
  dataList: {
    type: Array,
    default: [],
  },
});
const dateTab = ref(null);
const activeOn = ref(MenuData.data_tab_index || 0); //默认值
const emits = defineEmits(["changeDate"]);
// onMounted(() => {
//     nextTick(()=>{
//         changeTabMenu(props.dataList?.[0],0)
//     })
// })
onUnmounted(() => {
  set_active_val();
});
/**
 * 选中事件
 * @param {*} item
 * @param {*} i
 * @param {*} event
 * @param {*} type
 */
const changeTabMenu = (item, i, event, type) => {
  event = event || dateTab.value && dateTab.value[0];
  if(activeOn.value === i)return;
  activeOn.value = i;
  // 设置日期
  MenuData.set_date_time(i, props.dataList?.[i]?.val,props.dataList?.[i]?.menuType || "");
  emits("changeDate", type);
  // set_menu_match_date(type)
  scrollMenuEvent(event, ".date-tab-content-ul", ".active");
};
/**
 * 默认值
 */
const set_active_val = () => {
  activeOn.value = '';
};
// 根据菜单数据 请求接口
// const set_menu_match_date = (type) => {
//   // 获取菜单中的数据 进去接口请求
//   const {
//     menu_match_date_api_config: { api, params },
//   } = MenuData;
//   api_common[api](params).then((res) => {
//     emits("changeDate", { val: res.data || {}, type: type });
//     // if(res.code == 200 ){
//     // useMittEmit(MITT_TYPES.EMIT_SCROLL_DATE_TIME_CHANGE, {val:res.data ||{},type:type})
//     // }
//   });
// };
defineExpose({ set_active_val, changeTabMenu });
</script>
<style lang="scss" scoped>
.date-tab-wap {
  width: 100%;
  height: 0.32rem;
  overflow: hidden;
  padding: 0 0.05rem;
  position: relative;
  // background-color: var(--q-gb-bg-c-27);
  .date-tab-content {
    width: 100%;
    height: 0.32rem;
    line-height: 0.32rem;

    ul {
      width: 100%;
      overflow: hidden;
      overflow-x: auto;
      display: flex;

      &::-webkit-scrollbar {
        display: none;
      }

      li {
        width: 0.52rem;
        height: 100%;
        flex-shrink: 0;
        text-align: center;
        font-weight: 400;
        font-size: 12px;
        color: var(--q-gb-t-c-24);
        // &:first-child {
        //     width: 0.4rem;
        // }
        &.active {
          color: var(--q-gb-t-c-1);
          position: relative;
          font-weight: 500;

          &::after {
            content: "";
            position: absolute;
            width: 60%;
            height: 2px;
            background-color: var(--q-gb-t-c-1);
            bottom: 1px;
            left: 50%;
            margin-left: -30%;
            border-radius: 25px;
          }
        }
      }
    }
  }
}
</style>
  src/output/index.js