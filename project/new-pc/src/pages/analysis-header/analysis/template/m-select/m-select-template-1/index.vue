<template>
  <div class="select-wrap">
    <div class="tab-menu">
      <span v-for="(item, index) in typeData" :key="index" @click="select_option(index, 'typeSelected')"
        :class="{ 'active': typeSelected == index }">
        {{ item }}
      </span>
    </div>

    <div class="selct-menu relative-position" :class="{ 'open_select': time }">
      <div class="select-lable" @click="show_select('time')">
        <span class="label">{{ timeData[timeSelected] }}</span>
        <span class="yb-icon-arrow"></span>
      </div>
      <div class="select-page">
        <div class="options" v-for="(item, index) in timeData" :key="index" @click="select_option(index, 'timeSelected')"
          :class="{ 'selected': timeSelected == index }">{{ item }}</div>
      </div>
    </div>

    <!-- <div class="selct-menu" :class="{'open_select':type}">
      <div class="select-lable" @click="show_select('type')">
        <span class="label">{{typeData[typeSelected]}}</span>
        <span class="yb-icon-arrow"></span>
      </div>
      <div class="select-page">
        <div class="options" 
          v-for="(item,index) in typeData" 
          :key="index" @click="select_option(index, 'typeSelected')"
          :class="{'selected': typeSelected==index}">{{item}}</div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
import { i18n_t } from "src/output/index.js";
import lodash from 'lodash'
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps(need_register_props)

const time = ref(false);
const type = ref(false);
const timeData = ref([]);
const typeData = ref([]);
const timeSelected = ref(0);
const typeSelected = ref(0);
const timer = ref(null);

const emit = defineEmits('click')

// 最近5场 最近10场 最近15场
timeData.value = [i18n_t("analysis.record_clashes_1"), i18n_t("analysis.record_clashes_2"), i18n_t("analysis.record_clashes_3")]
// '默认'，'同赛事','同主客','同赛事+同主客'
typeData.value = [i18n_t("analysis.original"), i18n_t("analysis.same_game"), i18n_t("analysis.same_host_guest"), i18n_t("analysis.same_all")]

/** @type {['time','type']:Ref<boolean>}  */
const _this = {
  'time': time,
  'type': type
}
/**
 * 展示下拉框
 * @param {'time'|'type'} _type
 */
function show_select(_type) {
  if (!_this[_type].value) {
    /**清除定时器 */
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    timer.value = setTimeout(() => {
      _this[_type].value = !_this[_type].value
    }, 20)
  }
}

// computed:{
//   ...mapGetters(['get_global_click']),
// },
// get_global_click: 原项目vuex中的获取全局点击事件
// watch(get_global_click, () => {
//   time.value = false;
//   type.value = false;
// })

/**
 * 选择查询的数据类型
 * @param {'timeSelected'|'typeSelected'} type
 */
function select_option(index, type) {
  if (type === 'timeSelected') {
    timeSelected.value = index;
  } else {
    typeSelected.value = index;
  }
  let _timeSelected = lodash.cloneDeep(timeSelected.value)
  useMittEmit(MITT_TYPES.EMIT_M_SELECT_CLICK, { name: props.name, cps: _timeSelected * 5 + 5, flag: typeSelected })
  time.value = false;
}

onUnmounted(() => {
  /**清除定时器 */
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  timeData.value = null;
  typeData.value = null;
})

</script>

<style lang="scss" scoped>
.select-wrap {
  display: flex;
  align-items: center;

  .selct-menu {
    width: 160px;
    height: 24px;
    background: var(--q-analysis-color-16);
    border: 1px solid var(--q-analysis-color-10);
    cursor: pointer;

    &:first-child {
      margin-right: 10px;
    }

    .select-lable {
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;

      .yb-icon-arrow {
        transition: transform 0.3s;
        transform: rotate(90deg);
      }
    }

    .select-page {
      display: none;
      width: 160px;
      border: 1px solid var(--q-analysis-color-10);
      background: var(--q-analysis-color-16);
      padding: 5px 0;
      position: absolute;
      z-index: 1;

      .options {
        padding: 0 15px;
        cursor: pointer;

        &:hover,
        &.selected {
          background: var(--q-analysis-color-15);
        }
      }
    }

    &.open_select {
      .yb-icon-arrow {
        transform: rotate(270deg);
      }

      .select-page {
        display: block;
      }
    }
  }

  .tab-menu {
    display: flex;

    span {
      line-height: 24px;
      min-width: 64px;
      text-align: center;
      padding: 0 7px;
      border: var(--q-analysis-color-10);
      background: var(--q-analysis-color-16);
      cursor: pointer;
      margin-right: 10px;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      color: var(--q-analysis-color-3);

      &.active {
        background-image: var(--q-analysis-bg-gradient-2);
        color: var(--q-analysis-color-13);
      }
    }
  }
}
</style>