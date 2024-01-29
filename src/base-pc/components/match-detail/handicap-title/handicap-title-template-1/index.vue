<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:13:55
 * @Description:详情页玩法列表标题
-->
<template>
  <div
    :class="[
      'row items-center template-title',
      'is_fold',
      { 'is-fold': !is_show },
    ]"
    @click="toggle_downMenu"
  >
    <div class="play-name col">
      <span class="ellipsis">
        <!-- 玩法名称 -->
        <!-- 上半场下半场tag -->
        <div 
          class="play-btn" 
          :style="{background:item_details.halfLg==1?'#EFBB01':'#04C100'}"  
          v-if="lodash.get(item_details,'halfLg') && lodash.get(item_details,'hpn2')"
          >
          {{item_details.halfLg==1 ? i18n_t('common.half_1') : i18n_t('common.half_2')}}
        </div>
        {{getHpn(item_details) }}
        <template
          v-if="
            ![0, 110].includes(lodash.get(match_info, 'ms')) &&
            !corner_dist.includes(lodash.get(item_details, 'hpid') * 1)
          "
        >
          <!-- 让球比分 -->
          {{ score_formate }}
        </template>
        <template
          v-if="
            ![0, 110].includes(lodash.get(match_info, 'ms')) &&
            [33, 306, 308, 324, 327, 113, 121].includes(
              lodash.get(item_details, 'hpid') * 1
            )
          "
        >
          <!-- 角球比分 -->
          ({{ score_formate }})
        </template>
      </span>
      <tips1 :playId="item_details.hpid" :tipstatus="item_details.tipstatus" />
    </div>
    <span style="color: red; font-size: 15px" v-if="wsl">{{
      `模板 ———————— ${lodash.get(
        item_details,
        "hpt"
      )} ~~~~~~~~~  玩法id ———————— ${lodash.get(item_details, "hpid")}`
    }}</span>
    <div
      v-if="
        ![0, 110].includes(lodash.get(match_info, 'ms')) &&
        corner_dist.includes(lodash.get(item_details, 'hpid') * 1) &&
        ![33, 306, 308, 324, 327, 113, 121].includes(
          lodash.get(item_details, 'hpid') * 1
        )
      "
    >
      <!-- 当前总分： -->
      {{ i18n_t("match_info.current_score") }}：{{ score_formate }}
    </div>
    <!-- 置顶排序 -->
    <div style="width: 37px">
      <span
        @click.stop="set_top(lodash.get(item_details, 'hton') != '0')"
        class="set_top"
        v-show="lodash.get(item_details, 'hton') != '0'"
      >
        <icon-wapper name="icon-set_top" />
      </span>
    </div>
  </div>
</template>

<script setup>
// tips1 组件待引入

import tips1 from "src/base-pc/components/match-detail/tips1/tips1.vue"
import lodash from "lodash";
import { computed,ref } from "vue";
import { IconWapper } from 'src/components/icon'
//角球玩法hpid
const corner_dist = [
  111, 113, 114, 115, 116, 117, 118, 119, 121, 122, 123, 124, 125, 226, 227,
  228, 229, 230, 33, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317,
  318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329,
];
const wsl= sessionStorage.getItem("wsl")
const props = defineProps({
  item_details: Object,
  index: Number,
  isplus: Boolean,
  is_show: Boolean,
  match_info: Object, //赛事详情
});
const is_fold = ref(!props.is_show)

/**
 * @description: 格式化玩法名称比分
 * @return {undefined} undefined
 */
const score_formate = computed(() => {
  // 比分信息 "S1|1:0"
  let score = lodash.get(props.item_details, "hps");
  // 是否包含特定比分格式 "S1|1:0"
  if (score && score.includes("|") && score.includes(":")) {
    // ['S1', '1:0']
    score = score.split("|");
    // 如果包含比分
    if (score[1]) {
      // 获取主客队分数 [1, 0]
      let score2 = score[1].split(":");
      if (corner_dist.includes(lodash.get(props.item_details, "hpid") * 1)) {
        return `${score2[0]}-${score2[1]}`;
      } else {
        return `(${score2[0]}-${score2[1]})`;
      }
    }
  }
  return "";
});

const emit = defineEmits(["sort_index", "click"]); //弃用 sort_index 事件, 置顶逻辑于本组件内处理
const getHpn = (item_details) => {
  if(item_details.hpn2 && item_details.halfLg){
    return item_details.hpn2
  }else{
    return item_details.hpn
  }

}
/**
 * @description: 置顶
 * @param {Boolean} type true取消置顶, false置顶
 * @return {undefined} undefined
 */
const set_top = (type) => {
  emit("sort_index", type, props.index, props.isplus);
};

/**
 * @description: 展开折叠玩法
 * @return {undefined} undefined
 */
const toggle_downMenu = () => {
  // 记录用户的展开/折叠操作
  emit("click", { isplus:props.isplus, match_info: props.match_info });
  is_fold.value = !is_fold.value;
};
</script>
<style lang="scss" scoped>
/*  玩法模板 title */
.template-title {
  .icon-triangle {
    visibility: hidden;
    margin: 2px 0 0 15px;
    margin-right: 10px;
  }
  &:hover {
    .icon-triangle {
      visibility: visible;
    }
  }
}
.is_fold {
  .icon-triangle {
    visibility: visible;
    margin-right: 10px;
    transform: rotate(180deg);
  }
}
.ellipsis{
  color: var(--q-gb-t-c-3);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .play-btn {
    text-align: center;
    padding: 3px 8px;
    line-height: 15px;
    border-radius: 15px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    display: inline-block;
    margin-right: 6px;
  }
  .play-btn {
    color: #ffffff;
  }
}
</style>