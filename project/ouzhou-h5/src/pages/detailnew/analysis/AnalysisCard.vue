<script setup name="AnalysisCard">
const props = defineProps(['title'])
</script>


<template>
    <section class="AnalysisCard">
        <nav class="AnalysisCard-title">{{ title }}</nav>
        <div class="AnalysisCard-body">
            <slot name="body"></slot>
        </div>
    </section>
</template>

<style scoped lang="scss">
.AnalysisCard{
    width: 100%;
    min-height: 100px;
    &-title{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        position: relative;
        border-top: 1px solid #E2E2E2;
        border-bottom: 1px solid #E2E2E2;
        text-indent: 10px;
        color: #1A1A1A;
        font: {
            size: 14px;
            weight: 600;
        };
        &:before{
            content: '';
            position: absolute;
            width: 6px;
            height: 16px;
            left: -3px;
            background: #FF7000;
            border-radius: 8px;
        }
    }
}
</style>