<script setup name="NoData">
import {LOCAL_PROJECT_FILE_PREFIX} from "src/output/index.js";
</script>

<template>
    <div class="nodata-box">
        <img class="no-data" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/coming_soon.png`" alt="">
        <div class="no-data-text">{{ i18n_t("ouzhou.no_data.coming_soon") }}</div>
    </div>
</template>

<style scoped lang="scss">
.nodata-box{
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .no-data {
        width: 140px;
        height: 140px;
        margin-left: 50%;
        margin-top: 30%;
        transform: translate(-70px);
    }
    .no-data-text {
        text-align: center;
        color: #A1A3A5;
        font-size: 16px;
    }
}

</style>