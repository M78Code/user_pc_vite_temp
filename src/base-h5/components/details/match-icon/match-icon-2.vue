
<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 赛事icon操作
-->
<template>
  <div class='match-icon'>
    <!-- 动画或视频按钮 由父组件的传值：icon_class控制 -->
    <div
      class="row mx-8 items-center"
      @click.stop="icon_click($event)"
    >
      <!-- 动画或视频icon -->
      <template v-if="icon_class == 'donghua'">
          <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/new_ani.png`"
          alt=""
          class="icon-style"
        >
      </template>
      <template v-if="icon_class == 'shipin'">
        <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/video_1.png`"
          alt=""
          class="icon-style"
        >
      </template>
      <template v-if="icon_class == 'lvs'">
        <img
          :src="lvs_state_obj.icon_path"
          alt=""
          class="icon-style"
        >
      </template>
      <!-- 对应显示国际化文字(视频/动画) -->
      <div class="col text-left">
        <span class="tx-style">{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import lodash from 'lodash';
import { useRoute } from 'vue-router';
import { project_name } from "src/output/index.js";
import { api_common } from 'src/api/index.js';
import video from "src/core/video/video.js"   // 视频相关公共方法
import { i18n_t } from "src/boot/i18n.js";
import store from "src/store-redux/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { MatchDetailCalss, useMittEmit, MITT_TYPES,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"

import { useIconInfo } from "./hooks";

const props = defineProps({
  // 按钮：视频/动画 get_mvs：动画 get_mms:视频
  status: {
    type: [Number, String],
    default: ''
  },
  // 按钮icon：视频/动画
  icon_class: {
    type: String,
    default: ''
  },
  // 国际化文字(视频/动画)
  text: {
    type: String,
    default: ''
  },
  // 按钮是视频/动画 muUrl:视频 animationUrl:动画
  which: {
    type: String,
    default: ''
  },
  // 详情数据
  detail_data: {
    type: Object,
    default: {},
  },
})


const hd_sd = ref()

// 正在直播的
const lvs_icon_ing = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/zhibo-l.png`
// 赛前直播的
const lvs_icon_pre = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/zhibo-before.svg`
// 演播厅的图标
const lvs_state_obj = reactive({ lvs: '', icon_path: '' })
const get_detail_data = reactive(props.detail_data)


// 赛事id
const match_id = computed(() => route.params.mid || get_detail_data.mid)

const {icon_click_animationUrl,icon_click_muUrl,icon_click_lvs} =  useIconInfo(get_detail_data,match_id);




/**
 * 计算真正回落的点击按钮   直播 视频  动画
 * @param {*} button_type
 */
const media_button_button_type_check = (button_type = 'lvs') => {
  if (props.icon_class != 'lvs') return
  let state_obj = {
    lvs: lodash.get(get_detail_data, 'lvs') != -1,
    icon_path: '',
  }
  // 赛前图标
  if (lodash.get(get_detail_data, 'lss') == 0) {
    state_obj.icon_path = lvs_icon_pre
  } else if (lodash.get(get_detail_data, 'lss') == 1) {
    // 正在直播的图标
    state_obj.icon_path = lvs_icon_ing
  }
  Object.assign(lvs_state_obj, state_obj)
}
onMounted(media_button_button_type_check)

const route = useRoute()


const icon_click = (e) => {
  console.log(e, "whichwhichwhichwhich", props.which);
  e.stopPropagation()
  switch (props.which) {
    case 'lvs':
      icon_click_lvs(props.which)
      break;
    case 'muUrl':
      icon_click_muUrl()
      break;
    case 'animationUrl':
      icon_click_animationUrl()
      break;

    default:
      break;
  }
}

// Bug: 52301
// 视频或者动画是否播放
// 给进入详情自动播放使用
// 0 否 1是
const play_video = ref(1);

// 播放的类型
// lvs, muUrl, animationUrl
const is_in_play = 'muUrl';

onMounted(() => {
  // icon_click_animationUrl()
})


</script>

<script>

export default defineComponent({
  name: 'match_icon',
})
</script>

<style lang="scss" scoped>
.tx-style {
  font-size: 0.12rem;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 0.24rem;
  white-space: nowrap;
}

.icon-style {
  width: 0.2rem;
  height: 0.2rem;
  margin-right: 0.04rem;
}
.match-icon{
  display: flex;
  // width: 0.80rem;
  height: 0.24rem;
  // padding: 0.045rem 0.10rem 0.055rem 0.10rem;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 48px;
  // background: rgba(0, 0, 0, 0.50);
  // backdrop-filter: blur(2px);
  // background: linear-gradient(180deg, #179CFF 0%, #127DCC 100%);
  margin-right:4px;
  &:after {
    background:none !important
  }
}
</style>