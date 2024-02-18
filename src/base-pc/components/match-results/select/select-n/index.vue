<!--
 * @Date: 2021-10-07 07:57:16
 * @FilePath: /user-pc-vite/src/components/match-results/select/select-n/index.vue
 * @Description: 下拉框
 * @Author: Echo
-->
<template>
<div>
  <div v-if="!showInput">
      <q-tabs class="select_n_tabs" inline-label
        outside-arrows
        mobile-arrows
        no-caps
>
        <q-tab v-for="(item ,index) in option" :key="index "
                @click.stop="selectSport(item,index)"
                :class="active_sport === index ? 'active' : ''"
                 class="tabs_item"
                >
          <div>
            {{ item }}
          </div>
        </q-tab>
      </q-tabs>
  </div>
  <div
    class="e-select relative-position"
    :class="optionsIsShow ? 'up' : 'down'"
    @click.stop
    v-else
  >
    <input
      type="text"
      v-model="sport"
      v-if="showInput"
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
        <div v-for="(item, index) in options" :key="index">
        <!-- v-tooltip="{ content: item, overflow: 1, m_width: 15 }" -->
          <p
            v-if="item !== ''"
            class="item ellipsis"
            :class="{ active: value == item }"
            :key="index"
            @click.stop="selectSport(item)"
          >
            {{ item }}
          </p>
        </div>
      </q-scroll-area>
    </div>
  </div>
  </div>
</template>
<script setup>
// import { mapGetters } from "vuex";
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt";
import { onMounted, onUnmounted, ref,watch,computed } from "vue";
import { GlobalSwitchClass} from "src/output/index.js";
import { throttle } from "lodash";
const props = defineProps({
  // 当前选中的球种
  sportType: {
    type: String,
    default: '1'
  },
  value: {
    type: String,
    default: ''
  },
  // 球种名字列表
  options: {
    type: Array,
    default: () => [],
  },
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
// console.log(props.options,'sportType');
const optionsIsShow = ref(false);
const sport = ref(props.sportType);
//激活数据
const active_sport = ref(0);
const { off } = useMittOn(MITT_TYPES.EMIT_HIDE_SPORT_SElECT, (e)=>{
  showOption(e)
});
onUnmounted(off);
//筛选出空数据
const option = computed(() => {
  return props.options.filter(item =>  item !== '')
})

// 全局点击事件
watch(
  () => GlobalSwitchClass.global_switch_version,
  (new_) => {
  optionsIsShow.value = false;
  },
  {deep:true, immediate: true }
);
//初始化下拉框数据
watch(
  () => props.sportType,
  (new_) => {
    sport.value = new_;
  },
  {deep:true, immediate: true }
);

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

const selectSport = lodash.throttle((item,index) => {
  sport.value = item;
  active_sport.value = index;
  // console.error('sportsport',sport)
  showOption();
  useMittEmit(MITT_TYPES.EMIT_CHANGE_SPORT,{ currentItem: item, isChampion: props.isChampion })
  useMittEmit(MITT_TYPES.EMIT_SElECT_SPORT, props.isChampion);
}, 1000)
// const selectSport = (item,index) => {
//   sport.value = item;
//   active_sport.value = index;
//   // console.error('sportsport',sport)
//   showOption();
//   useMittEmit(MITT_TYPES.EMIT_CHANGE_SPORT,{ currentItem: item, isChampion: props.isChampion })
//   useMittEmit(MITT_TYPES.EMIT_SElECT_SPORT, props.isChampion);
// };

</script>
<style lang="scss" scoped>
html,body{
  height: 100%;
}
.select_n_tabs{
  background: #ffffff;
  
  color: #8A8986;
  .tabs_item{
    position: relative;
    &::before{
      content: '';
      width: 2px;
      height: 12px;
      background: #D9D9D9;
      position: absolute;
      right:  0px;
      top: 18px;
    }
  }
  .active{
    color: #1A1A1A;
    position: relative;
      &::after{
      content: '';
      background: linear-gradient(180deg, #FF7000 0%, rgba(255, 112, 0, 0) 100%);
      position: absolute;
      width: 8px;
      height: 8px;
      top: 42px;
      left: 44%;
      border-radius: 4px;
    }

  }

}
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
      border: 1px solid #ff7000;
      -border: 1px solid var(--q-gb-bd-c-1);
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