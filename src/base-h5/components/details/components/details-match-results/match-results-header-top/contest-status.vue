<script setup>
import { computed } from "vue"
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
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

<template>
    <div class="team-text" :class="{baseball: detail_data.csid == '3' }">
        {{ match_status }}
        <!-- mng 是否中立场 1:是中立场，0:非中立场 --- 仅足球  这里注释掉，与match-score.vue 组件的中立图标冲突-->
        <!--
        <span class="style_icon" v-if="detail_data.mng == 1">
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/zhonglichang.svg`" alt />
        </span>
        -->
    </div>
</template>

<style lang="scss" scoped>
.team-text {
    left: 0.19rem;
    bottom: 0.11rem;
    font-size: 0.12rem;
    //color: var(--q-gb-t-c-5);
    color: var(--q-gb-t-c-14);

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
</style>