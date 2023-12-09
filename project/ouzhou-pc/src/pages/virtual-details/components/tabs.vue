<!--
 * @Author: cooper
 * @Date: 2023-07-05 15:13:55
 * @Description: tabs 组件，详细请查看搜索页面跟详情页面
-->
<template>
  <div class="match-search">
    <div class="search-top">
      <div class="btn-group" ref="BtnGroupRef" >
        <div
          v-for="item in tab_options"
          :key="item.value"
          class="btn-group-item"
          @click="tab_click(item)"
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
    type: String || Number,
  },
});

const active_value = ref("");
const BtnGroupRef = ref(null)

watch(
  () => props.modelValue,
  (val) => {
    active_value.value = val;
  }
);
const emits = defineEmits(["update:modelValue"]);
const is_fold = ref(false);

// 筛选点击
const tab_click = (item) => {
  active_value.value = item.value;
  emits("update:modelValue", item.value);
};
// 一键折叠
const fold_odds = () => {
    is_fold.value = !is_fold.value
    useMittEmit(MITT_TYPES.EMIT_SHOW_FOLD, is_fold.value);

};

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
    border-radius: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow-x: auto;

    .btn-group-item {
      flex-shrink: 0;
      flex-grow: 0;
      font-size: 12px;
      // margin-right: 20px;
      padding: 4px 5px;
      height: 100%;
      display: flex;
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