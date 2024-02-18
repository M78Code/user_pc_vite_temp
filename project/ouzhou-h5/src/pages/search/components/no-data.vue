<!-- @Description: 空空如也这些信息展示 -->
<template>
    <div class="no-data">
    <section v-for="item in arr_const" :key="item.key">
        <div v-if="code === item.code" class="no-data_centent">
        <img class="no_data_img" :src="compute_local_project_file_path(item.url)" alt="">
        <p class="title">{{ i18n_t(`ouzhou.search.${item.txt}`) }}</p>
        </div>
        </section>
    </div>
</template>

<script setup>
import { compute_local_project_file_path } from "src/output/index.js"

const arr_const = [
     {
        key:'No Data',
        txt: 'No Data',
        url: "image/png/no_data_new.png",
        code: 100 
    },
    { 
        key:'No network',
        txt: 'No network',
        url: "image/png/no_network.png",
        code: 200 
    },
    {
        key:'404',
        txt: '404',
        url: "image/png/no_found_new.png",
        code: 300 
    },
    {
        key:'No results',
        txt: 'No results',
        url: "image/png/not_found.png",
        code: 400 
    },
    {
        key:'Lock disc',
        txt: 'Lock disc',
        url: "image/png/lock-disc.png",
        code: 500 
    },
    {
        key:'coming soon',
        txt: 'coming soon',
        url: "image/png/coming_soon.png",
        code: 600 
    },
    {
        key:'Close the Handicap',
        txt: 'Close the Handicap',
        url: "image/png/close_Handicap.png",
        code: 700 
    }
]

const props = defineProps({
    code:{
        type: Number,
        required: true
    }
})


</script>

<style lang="scss" scoped>
.no-data {
    .title {
        color: var(--q-gb-t-c-4);
        font-size: 16px;
    }
}
</style>