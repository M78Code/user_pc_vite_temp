<template>
  <div class="match-results-header-top">
    <div class="team_name">
      <span class="ellipsis">
        {{ data.data_list.mhn }} v {{ data.data_list.man }}
      </span>
      <span>
        {{ format_total_score(data.data_list, 0)}}-{{ format_total_score(data.data_list, 1)}}
      </span>
    </div>
    <template v-if="project_name == 'app-h5'">
      <span class="team-time" v-if="['result_details', 'match_result'].includes(Route.name)">
        {{ formatTime(+detail_data.mgt, 'mm/dd HH:MM')}}
      </span>
    </template>
    <!-- 描述比赛进度相关start -->
    <div class="team-text" :class="{baseball: detail_data.csid == '3' }">
        {{ match_status }}
         <!-- mng 是否中立场 1:是中立场，0:非中立场 --- 仅足球  这里注释掉，与match-score.vue 组件的中立图标冲突-->
      <!-- <span class="style_icon" v-if="detail_data.mng == 1">
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/zhonglichang.svg`" alt />
      </span> -->
    </div>
  </div>
</template>

<script setup>
import lodash from "lodash";
// import msc from "src/base-h5/mixins/common/msc.js";  // 国际化比赛阶段比分转换工具
import { reactive, computed, watch } from "vue";
import { i18n_t } from "src/boot/i18n.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { useRoute } from "vue-router";
import { format_total_score, format_time_zone_time, format_time_zone, formatTime } from "src/output/index.js"
import {project_name } from 'src/output/module/constant-utils-common.js'

const props = defineProps({
  detail_data: {
    type: Object
  }
});

const data = reactive({
  data_list: ''
});

const Route = useRoute()

watch(
  () => props.detail_data,
  (n, o) => {
    data.data_list = lodash.cloneDeep(props.detail_data)
  },
  {
    immediate: true,
    deep: true
  }
);

const match_status = computed(() => {
  const { mmp, ms } = props.detail_data
  // mmp赛事阶段对应展示文案map
  const detail_data_mmp_map = {
    '90': 'mmp.3.90',
    '61': 'mmp.5.61',
    '80': 'mmp.5.80',
    '100': 'mmp.2.100',
    // '999': 'mmp.3.999',
    '999': 'mmp.3.999_app_h5',
  }
  // 只在足球详情页面 显示

  // 赛事中断 单独判断
  if (ms == 10) {
    return i18n_t('ms.10')
  } else if (detail_data_mmp_map[mmp]) {
    return i18n_t(detail_data_mmp_map[mmp])
  } else {
    return ''
  }
});

</script>

<style lang="scss" scoped>
.match-results-header-top {
  .team_name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.51rem;
    padding: 0 0.15rem;
    font-weight: 600;
    span {
      letter-spacing: 0;
      font-size: 0.16rem;
      color: var(--q-gb-t-c-5);

      &:nth-child(2) {
        min-width: 0.5rem;
        text-align: right;
        white-space: nowrap;
      }
    }
  }

  .team-text {
    position: absolute;
    left: 0.19rem;
    bottom: 0.11rem;

    font-size: 0.12rem;
    color: var(--q-gb-t-c-5);

    &.baseball {
      bottom: 0.28rem;
    }

    .style_icon {
      position: absolute;
      top: 0.02rem;
      margin-right: 0.05rem;
      right: -0.25rem;
    }
  }

  .team-time{
    position: absolute;
    left: 0.18rem;
    bottom: 0.3rem;
    color: var(--q-gb-t-c-5);
  }
}
</style>