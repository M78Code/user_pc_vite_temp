<!--
 * @Author: cooper
 * @Date: 2023-07-05 15:13:55
 * @Description: tabs 组件，详细请查看搜索页面跟详情页面
-->
<template>
  <div class="match-search">
    <div class="search-top" ref="wrapRef">
      <div class="btn-group relative-position" ref="itemWrapRef" :style="{left:item_wrap_left+'px'}">
        
        <div
          v-for="(item, index) in tab_options"
          :key="item.value"
          class="btn-group-item"
          @click="tab_click(item, index)"
        >
          <span
            :class="{
              'btn-group-item-ls': true,
              'btn-group-item-ls-active': active_value == item.value,
            }"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
    <div class="flod" @click="fold_odds">
      <img
        :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/down_arrow.png`"
        class="expand-icon"
        :style="{transform: `rotate(${is_fold? '180deg':'0deg'})`}"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
const props = defineProps({
  tab_options: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
  },
});

const active_value = ref(props.tab_options[0]?.value ?? '');

const wrapRef = ref(null) //item_wrap_width
const itemWrapRef = ref(null) // item_total_width
const currentIndex = ref(0)
const item_wrap_left = ref(0) //item包裹left

watch(
  () => props.modelValue,
  (val) => {
    active_value.value = val;
  }
);
const emits = defineEmits(["update:modelValue"]);
const is_fold = ref(false);

// 筛选点击
const tab_click = (item,  index) => {
  active_value.value = item.value;
  emits("update:modelValue", item.value);

  let num = index - currentIndex.value
  if(!num) return
  if(currentIndex.value > index){
    if(left_btn_show()){
      hand_cilck_move(80 + item_wrap_left.value)
    }
  }else{
    if(right_btn_show()){
      hand_cilck_move(-50 + item_wrap_left.value)
    }
  }

  currentIndex.value = index

};
// 一键折叠
const fold_odds = () => {
    is_fold.value = !is_fold.value
    useMittEmit(MITT_TYPES.EMIT_SHOW_FOLD, is_fold.value);

};

/**
 * @Description:左边按钮是否显示
 * @return {boolean}
 */
function left_btn_show() {
  return item_wrap_left.value < 0;
}

/**
 * @Description:右边按钮是否显示
 * @return {boolean}
 */
function right_btn_show() {
  return itemWrapRef.value.clientWidth > wrapRef.value.clientWidth && item_wrap_left.value > (wrapRef.value.clientWidth - itemWrapRef.value.clientWidth - 50);
}

function hand_cilck_move(left) {
  let max_left = 0 - (itemWrapRef.value.clientWidth - wrapRef.value.clientWidth + 50)
  if (left >= 0) {
    left = 0
  } else if ( left < max_left){
    left = max_left
  }
  item_wrap_left.value = left
}

</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0px;
}
.match-search {

  display: flex;
  border-bottom: 1px solid var(--q-gb-bd-c-1);
  .flod {
    // position: absolute;
    // right: 0;
    // top: 0;
    height: 50px;
    line-height: 50px;
    width: 70px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--q-gb-bg-c-4);
    cursor: pointer;
    overflow: hidden;
    &::before {
      content: "";
      display: block;
      width: 8px;
      height: 50px;
      background: linear-gradient(
        270deg,
        #f9f5f5 0%,
        rgba(241, 241, 241, 0) 100%
      );
    }
    .expand-icon {
      height: 10px;
      margin-left: 15px;
    }
  }
  .search-top {
    position: relative;
    flex:1;
    height: 50px;
    background-color: var(--q-gb-bg-c-4);
    // border-radius: 4px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    overflow: hidden;
  }

  .btn-group {
    position: absolute;
    white-space: nowrap;
    border-radius: 16px;
    box-sizing: border-box;
    align-items: center;
    .btn-group-item {
      font-size: 12px;
      // margin-right: 20px;
      padding: 4px 5px;
      height: 100%;
      display: inline-block;
      align-items: center;
      justify-content: center;

      .btn-group-item-ls {
        cursor: pointer;
        padding: 4px 10px;
        box-sizing: border-box;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0);
        margin-left: -1px;
        margin-right: -1px;
        display: inline-block;
      }

      .btn-group-item-ls-active {
        background-color: var(--q-gb-bg-c-1);
        border: 1px solid var(--q-gb-bd-c-1);
        color: var(--q-gb-t-c-1);
        font-weight: 500;
      }

      &:hover {
        .btn-group-item-ls {
          border: 1px solid var(--q-gb-bd-c-1);
        }
      }
    }
  }
}
</style>