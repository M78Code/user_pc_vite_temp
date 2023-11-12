<!-- @Description: 空空如也这些信息展示 -->
<template>
    <div class="no-data">
    <section v-for="item in arr_const" :key="item.key">
        <div v-if="code === item.code" class="no-data_centent">
        <img class="no_data_img" :src="compute_local_project_file_path('image/png/not_found.png')" alt="">
        <p class="title">{{item.txt}}</p>
        </div>
        </section>
    </div>
</template>

<script setup>
import {onMounted,ref} from 'vue'
import { compute_local_project_file_path } from 'src/core/'
const is_detail = ref(false)

const arr_const = [
     {
        key:'No Data',
        txt: 'No Data',
        url: "image/png/not_found.png",
        code: 100 
    },
    { 
        key:'No network',
        txt: 'No network',
        url: "image/png/not_found.png",
        code: 200 
    },
    {
        key:'404',
        txt: '404',
        url: "image/png/not_found.png",
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
        code: 500 
    },
    {
        key:'coming soon',
        txt: 'coming soon',
        code: 600 
    },
    {
        key:'Close the Handicap',
        txt: 'Close the Handicap',
        code: 700 
    }
]

const props = defineProps({
    which: {
        type: String,
        required: true
    },
    height: {
        required: true
    },
    code:{
        type: Number,
        required: true
    }
})

// onMounted(init)

</script>

<style lang="scss" scoped>
.no-data {
    .title {
        color: #1A1A1A;
        font-size: 16px;
    }
}
</style>
