
<!--
 * @Author: cooper
 * @Date: 2023-06-06 14:13:55
 * @Description: 动画，比分榜组件
-->
<template>
  <div>
    <div class="analysis-body">
      <div class="analysis-top">
        <div class="analysis-top-l">
          <!-- <div class="v-icon switch-icon"></div> -->
          <!-- <sport_icon :sport_id="detail_info.csid" :status="false" size="18px" class="icon" style="margin:0 10px"/> -->
          <span class="analysis-top-txt">{{ detail_info.tn }}</span>
        </div>
        <div class="analysis-top-right">
           <!-- 动画图标 -->
          <img
            v-if="detail_info.mvs > -1"
            :src="show_type&&show_type=='animal' ? animal_active : animal"
            alt=""
            srcset=""
            style="margin-right: 15px"
            @click="tab_click('animal')"
          />
           <!-- 视频图标 -->
          <img
            v-if="cur_video_icon.type"
            :src="show_type&&show_type!='animal'?video_active: video"
            alt=""
            srcset=""
            style="margin-right: 15px"
            @click="tab_click(cur_video_icon.type)"
          />
           <!-- 比分榜图标 -->
          <img
            :src="score_key ? score_active : score"
            alt=""
            srcset=""
            @click="tab_click('score')"
          />
        </div>
      </div>
      <!-- 动画视频 -->
      <animal_box v-if="animal_key" :show_type="show_type"  :detail_info="detail_info" />
      <!-- 比分 -->
      <score_info
        v-show="score_key&&!lodash_.isEmpty(score_list)"
        :score_list="score_list"
        :detail_info="detail_info"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import animal_box from "./animal_box.vue";

import score_info from "./score_info.vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js";
import { get_match_status } from "src/core/utils/index";
import lodash_ from "lodash";


const animal = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`;
const animal_active = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal_active.png`;
const score = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/score.png`;
const score_active = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/score_active.png`;
const video_active = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/video_active.png`;
const video = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/video.png`;

const props = defineProps({
  detail_info: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
  score_list: {
    //比分详情
    type: Object,
    default: () => {},
  },
});

const animal_key = ref(false);
const score_key = ref(true);
const show_type = ref('');

watch(
  () => props.detail_info,
  (val) => {
    animal_key.value = false;
    score_key.value = true;
  }
);

/**
 * @Description 计算当前视频图标
 * @return {Object}
 */
const cur_video_icon = computed(() => {
  let {
    lvs = -1,
    mms = -1,
    lss = -1,
    tvs = -1,
    ms,
    varl = "",
    vurl = "",
  } = props.detail_info;
  let cur_video_icon = {
    type: "",
    text: "",
  };
  //电竞
  // let is_esports = this.menu_data.is_esports;
  //滚球状态
  let is_play = get_match_status(ms);
  // 包含的语言
  // let status = ["zh", "tw"].includes(this.get_lang);
  //演播厅
  if (lvs == 2  && [1, 0].includes(lss)) {
    if (lss === 1) {
      cur_video_icon = {
        type: "studio",
      };
      //专题
    } else if (lss === 0 && !is_play) {
      cur_video_icon = {
        type: "topic",
        // text: this.$root.$t("common.topic"),
      };
    }
    //主播
  } else if (tvs == 2) {
    cur_video_icon = {
      type: "anchor",
      // text: this.$root.$t("common.anchor"),
    };
    //源视频                       非电竞 或者电竞有url
  } 
 if (mms == 2 && is_play) {
    cur_video_icon = {
      type: "video",
      // text: this.$root.$t("common.o_video"),
    };
  }
  return cur_video_icon;
});


const tab_click = (type) => {
  show_type.value = type=='score'?'':type

  if (type == "animal"||type == "video") {
    animal_key.value = true;
    score_key.value = false;
  } else {
    animal_key.value = false;
    score_key.value = true;
  }
};
</script>

<style lang="scss" scoped>
.analysis-body {
  // background: #ffffff;
  margin-bottom: 10px;
  .analysis-top {
    background: #ffffff;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .switch-icon {
      background-image: url("../../../../assets/images/football_icon.png");
      height: 16px;
      width: 16px;
      margin: 0 6px 0 12px;
    }
    .analysis-top-txt {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      text-transform: capitalize;
      color: #1a1a1a;
    }
    .analysis-top-l {
      display: flex;
    }
    .analysis-top-right {
      display: flex;
      margin-right: 15px;
      img {
        height: 16px;
        cursor: pointer;
      }
      .switch-icon-1 {
        background-image: url("../../../../assets/images/switch_active.png");
        background-repeat: no-repeat;
        height: 16px;
        width: 16px;
        margin-right: 14px;
      }
      .switch-icon-2 {
        background-image: url("../../../../assets/images/score.png");
        background-repeat: no-repeat;
        height: 16px;
        width: 16px;
        margin-right: 14px;
      }
    }
  }
}
</style>
