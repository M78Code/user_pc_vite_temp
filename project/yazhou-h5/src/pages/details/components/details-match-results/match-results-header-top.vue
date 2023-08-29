<template>
  <div class="match-results-header-top">
    <div class="team_name">
      <span class="ellipsis">
        {{ data_list.mhn }} v {{ data_list.man }}
      </span>
      <span>
        {{ format_total_score(data_list, 0)}}-{{ format_total_score(data_list, 1)}}
      </span>
    </div>
    <!-- 描述比赛进度相关start -->
    <div class="team-text" :class="{baseball: detail_data.csid == '3' }">
        {{ match_status }}
      <span class="style_icon" v-if="detail_data.mng == 1">
        <img  src="image/wwwassets/bw3/svg/zhonglichang.svg" alt />
      </span>
    </div>
  </div>
</template>

<script>
import lodash from "lodash";
// import msc from "project_path/src/mixins/common/msc.js";  // 国际化比赛阶段比分转换工具
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { format_total_score } from "src/core/format/index.js"
export default defineComponent({
  // #TODO vuex
  // mixins: [msc],
  name: "",
  components: {
  },
  props: {
    detail_data: {
      type: Object
    }
  },
  // #TODO mixins
  // mixins: [chatroom_mixin],
  setup(props, evnet) {
    const data = reactive({
      data_list: ''
    });
    watch(
      () => detail_data,
      (n,o) => {
        data_list = lodash.cloneDeep(detail_data)
      },
      {
        immediate: true,
        deep: true
      }
    );
    const match_status = computed(() => {
      const { mmp, ms } = detail_data
      // mmp赛事阶段对应展示文案map
      const detail_data_mmp_map = {
        '90': 'mmp.3.90',
        '61': 'mmp.5.61',
        '80': 'mmp.5.80',
        '100': 'mmp.2.100',
        '999': 'mmp.3.999',
      }

      // 赛事中断 单独判断
      if (ms === 10) {
        return t('ms.10')
      } else if (detail_data_mmp_map[mmp]) {
        return t(detail_data_mmp_map[mmp])
      } else {
        return ''
      }

    });
    return {
      ...toRefs(data),
      match_status
    }
  }
})
</script>

<style lang="scss" scoped>
.match-results-header-top {
  .team_name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.51rem;
    padding: 0 0.15rem;

    span {
      letter-spacing: 0;
      font-size: 0.16rem;
      color: var(--q-color-com-fs-color-8);

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
    color: var(--q-color-com-fs-color-8);

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
}
</style>
