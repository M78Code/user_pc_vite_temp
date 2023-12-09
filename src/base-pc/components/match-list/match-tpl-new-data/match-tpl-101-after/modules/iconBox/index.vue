<template>
    <div class="flex flex-start items-center ouzhou-icon-block">
        <!-- 中立图片 -->
        <div class="sr-link-icon-w" v-if="lodash.get(match, 'mng')">
            <div :style="compute_css_obj({key: 'pc-home-neutral'})"></div>
        </div>
        <!-- 先注释，功能好了才放开-->
        <!-- 提前结算 -->
        <!-- <div class="sr-link-icon-w">
            <div :style="compute_css_obj({key: 'pc-home-early-settlement'})"></div>
        </div> -->
        <!-- 统计分析 -->
        <!-- <div class="sr-link-icon-w">
            <div v-tooltip="{ content: i18n_t('common.analysis') }" 
            v-if="is_show_sr_flg(match)"
            @click.stop='details.sr_click_handle(match)'
            :style="compute_css_obj({key: 'pc-home-match-analysis'})"></div>
        </div> -->
    </div>
</template>
<script setup>
import { compute_css_obj } from 'src/core/server-img/index.js'
import lodash from 'lodash';

const props = defineProps({
  match: {
    type: Object,
    default: () => { }
  }
})

</script>
<style>
.ouzhou-icon-block {
    margin-left: 24px;
}
.sr-link-icon-w  div{
    width: 12px;
    height: 12px;
    background-size: 100% 100%;
}
</style>
