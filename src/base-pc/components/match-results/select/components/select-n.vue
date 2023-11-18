<!--
 * @Date: 2021-10-07 07:57:16
 * @FilePath: /user-pc-vite/src/components/match-results/select/select-n/index.vue
 * @Description: 下拉框
 * @Author: Echo
-->
<template>
  <div
    class="e-select relative-position"
    :class="optionsIsShow ? 'up' : 'down'"
    @click.stop
  >
    <input
      v-if="showInput"
      type="text"
      v-model="sport"
      class="select-value select-input handel-select ellipsis"
      @focus="showOption"
    />
    <div v-else class="select-value ellipsis" @click.stop="showOption">
      {{ sportType }}
    </div>
    <div class="opitons-wrap" v-if="optionsIsShow">
      <q-scroll-area
        ref="scrollArea"
        class="rule-scroll-area"
        :style="{ height: '100%' }"
      >
        <template v-for="(item, index) in options">
          <p
            v-if="item !== ''"
            class="item ellipsis"
            v-tooltip="{ content: item, overflow: 1, m_width: 15 }"
            :class="{ active: value == item }"
            :key="index"
            @click.stop="selectSport(item)"
          >
            {{ item }}
          </p>
        </template>
      </q-scroll-area>
    </div>
  </div>
</template>
<script setup>
// import { mapGetters } from "vuex";
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt";
import { onMounted, onUnmounted, ref,watch } from "vue";
const props = defineProps({
  // 当前选中的球种
  sportType: String,
  // 球种名字列表
  options: Array,
  // 是否展示输入框
  showInput: {
    type: Boolean,
    default: false,
  },
  isChampion: {
    type: Number,
    default: 0,
  },
});
console.log(props.options,'sportType');
const optionsIsShow = ref(false);
const sport = ref(props.sportType);
const { off } = useMittOn(MITT_TYPES.EMIT_HIDE_SPORT_SElECT, (e)=>{
  showOption(e)
});
onUnmounted(off);
watch(props.sportType,(val)=>{
  console.log(val,'val');
}
)

// 全局点击事件
// get_global_click(){
//   this.optionsIsShow = false
// }

/**
 * 展示或隐藏下拉框
 */
const showOption = (type) => {
  if (type == "close") {
    if (optionsIsShow.value == true) {
      optionsIsShow.value = false;
      return;
    }
    
  } else {
    optionsIsShow.value = !optionsIsShow.value;
    useMittEmit(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT);
  }
};
/**
 * @description 下拉框选择球种
 * @param String item 球种名称
 */
const selectSport = (item) => {
  sport.value = item;
  showOption();
  useMittEmit(MITT_TYPES.EMIT_CHANGE_SPORT,{ currentItem: item, isChampion: props.isChampion })
  useMittEmit(MITT_TYPES.EMIT_SElECT_SPORT, props.isChampion);
};
</script>
<style lang="scss" scoped>
.e-select {
  width: 120px;
  height: 28px;
  color: #5a6074;
  border-radius: 2px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  position: relative;
  .select-value {
    width: 100%;
    height: 28px;
    line-height: 28px;
    padding: 0 15px;
    position: relative;
    border: 1px solid #d0d8de;
    cursor: pointer;
    &:hover {
      // border: 1px solid #ff7000;
      border: 1px solid var(--q-gb-bd-c-1);
    }
  }
  .select-input {
    cursor: text;
    outline: none;
  }
  .opitons-wrap {
    width: 100%;
    height: 420px;
    max-height: 65vh;
    position: absolute;
    left: 0;
    z-index: 1;
    background: var(--q-gb-bg-c-4);
    border-bottom: 1px solid #d0d8de;
    .item {
      width: 100%;
      height: 30px;
      line-height: 30px;
      margin: 0;
      padding-left: 15px;
      cursor: pointer;
      color: #1d1d1d;
      border-left: 1px solid #d0d8de;
      border-right: 1px solid #d0d8de;
      &:first-child {
        border-top: 1px solid #d0d8de;
      }
      &:hover {
        background: #e3e9ee;
      }
    }
    .active {
      background: #e3e9ee;
    }
    .rule-scroll-area {
      :deep(.q-scrollarea__content) {
        width: 100%;
      }
    }
  }
}
.down::after {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  border-right: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  transform: rotate(45deg);
  position: absolute;
  top: 10px;
  right: 10px;
}
.up::after {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  border-top: 1px solid #d1d1d1;
  border-left: 1px solid #d1d1d1;
  transform: rotate(45deg);
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
