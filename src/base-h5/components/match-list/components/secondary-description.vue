<!--
 * @Description: 次要玩法描述
-->

<template>
  <!-- 次要玩法描述 -->
  <div class="pg-wrapper" v-show="other_way_info_show" @click="close_other_w_info" ref="other_way_info">
    <div class="other-way-info-wrapper" :class="arr_top_down"
      :style="{ left: `${other_way_style.left}px`, top: `${other_way_style.top}px` }">
      <div class="row justify-between info-head">
        <div class="o-title">
          {{ current_way_name }}
        </div>
        <img class='close-o-info-icon' @click="close_other_w_info"
          :src="compute_img_url('icon-close')" />
      </div>
      <!-- 次要玩法如果是数组 例如15分钟展开 -->
      <div v-if="Array.isArray(play_way_info)">
        <template v-if="!(show_Xth_title && index === 5)">
          <div class="s-table" v-for="(item, index) in play_way_info" :key="index">
            <template v-if="item.title == '5min-icon'">
              <div class="wrap-box yb-flex-center">
                <div :class="['item-icon', `item-icon-${index}`]" v-for="index in 4" :key="`${index}_before`"></div>
                <div class="item-content">{{ item.content }}</div>
                <div :class="['item-icon', `item-icon-${index}`]" v-for="index in [4, 3, 2, 1]" :key="`${index}_after`">
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="show_15min_data">
                <div>{{ show_Xth_title && index === 4 ? item.Xth_title : item.title }}</div>
                <div>{{ item.content }}</div>
              </div>
              <div v-else>
                <div :class="{ 'full-width': index > 3 }">{{ show_Xth_title && index === 4 ? item.Xth_title : item.title }}
                </div>
                <div v-if="index < 4">{{ item.content }}</div>
              </div>
            </template>
          </div>
        </template>
      </div>
      <div v-else v-html="play_way_info" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt"
import {  i18n_t, compute_img_url} from "src/output/index.js"
import { standard_edition } from 'src/base-h5/mixin/userctr.js'

const emitters = ref({})
// 默认箭头向上
const arr_top_down = ref('arr-top')
// 罚牌 玩法信息展示
const other_way_info_show = ref(false)
const other_way_style = ref({
  left: 0,
  top: 0,
})
const pre_info_clicked_mid = ref('')
const show_15min_data = ref('')
const play_way_info = ref('')
const current_way_name = ref('')
// 次要玩法info tips----当前展开的次要玩法tab信息
const curr_play_info = ref({
  // 当前赛事状态，默认为滚球
  ms: 1,
  // 当前展开的次要玩法tab
  menu_id: '',
  show_15min_data: false // 15分钟玩法数据
})

watch(() => other_way_info_show.value, (curr) => {
  useMittEmit(MITT_TYPES.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE, curr);
})

watch(() => standard_edition.value, (newValue) => {
  if (newValue == 1) {
    other_way_info_show.value = false
  }
})

// 是否显示无第 {X} 个进球 title----次要玩法tips(5分钟次要玩法)
const show_Xth_title = computed(() => {
  return [1, 2, 7, 10].includes(+curr_play_info.value.ms) && curr_play_info.value.menu_id === 19
})

const tab_changing_handle = () => {
  close_other_w_info();
}
/**
 * 关闭玩法描述
 */
const close_other_w_info = () => {
  other_way_info_show.value = false;
}
/**
 * 玩法信息图标点击
 */
const info_icon_click_h = (params = {}) => {
  console.log(params)
  const { e = null, mid = '', item = '', match = {} } = params
  if (!e) {
    other_way_info_show.value = false;
    return;
  }

  // 获取当前赛事状态
  curr_play_info.value = {
    ms: lodash.get(match, 'ms', 1),
    menu_id: item.id
  }

  current_way_name.value = item.title;
  let menu_id = item.id;
  other_way_style.value.left = rem(0.1);
  other_way_style.value.top = e.clientY + rem(.16);
  if (mid != pre_info_clicked_mid.value) {
    other_way_info_show.value = true;
  }
  else {
    other_way_info_show.value = !other_way_info_show.value;
  }

  let arr_top_off_set = 0; //偏移量  滑动到快底部时 显示不下,向上显示
  let arr_to_down = false; // 默认向上显示
  if ([19, 17, 5].includes(menu_id)) { // 如果是17 15分钟玩法 // 后续可能会加新玩法 所以大判断在前
    // 5分钟
    if (19 == menu_id) {
      arr_top_off_set = 2 // 单位rem
      show_15min_data.value = false
    }
    // 15分钟
    else if (17 == menu_id) {
      arr_top_off_set = 1.8 // 单位rem
      show_15min_data.value = true
    }
    // 罚牌
    else if (5 == menu_id) {
      arr_top_off_set = 1.1 // 单位rem
    }

    if (document.body.offsetHeight - e.clientY < rem(arr_top_off_set) + rem(0.1)) {
      // 如果当前点击的位置超过 弹框本身的大小 则变成向上显示
      other_way_style.value.top = e.clientY - rem(.16) - rem(arr_top_off_set);
      arr_to_down = true;
    }
  }
  arr_top_down.value = arr_to_down ? 'arr-down' : 'arr-top'; // 箭头向上向下显示 // 赋值给this

  play_way_info.value = i18n_t(`play_way_info.${menu_id}`);
  pre_info_clicked_mid.value = mid;
}

const rem = (value) => {
  let font_size = window.innerWidth * 100 / 375;
  return Math.ceil(value * font_size);
}

onMounted(() => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_INFO_ICON_CLICK, info_icon_click_h).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_TAB_HOT_CHANGING, tab_changing_handle).off,
  }
})

onUnmounted(() => {
  Object.values(emitters.value).map((x) => x())
})

</script>src/output/index.js