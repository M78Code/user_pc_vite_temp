<template>
    <div class="flex flex-start items-center ouzhou-icon-block">
        <!-- 中立图片 -->
        <div class="sr-link-icon-w">
            <div :style="compute_css_obj({key: 'pc-home-neutral'})"></div>
        </div>
        <!-- 图标1 -->
        <div class="sr-link-icon-w">
            <div :style="compute_css_obj({key: 'pc-home-early-settlement'})"></div>
        </div>
        <!-- 图标2 -->
        <div class="sr-link-icon-w">
            <div :style="compute_css_obj({key: 'pc-home-match-analysis'})"></div>
        </div>
    </div>
</template>
<script setup>
import { compute_css_obj } from 'src/core/server-img/index.js'

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