<script setup>
import { defineProps, onMounted, nextTick } from "vue"
const props = defineProps({
    betInfor: {
        type: Object,
        default: () => {},
    },
    active: {
        type: Number,
        default: () => 0,
    },
});
onMounted(()=>{
    nextTick(()=>{
        if(props.betInfor.chpid == '347') console.log(props.betInfor,"props.betInfor")
    })
})
</script>
<!--
双重机会&进球大小
-->
<template>
    <div class="tempalte0">
        <li v-for="ol in betInfor.hl[0].ol.filter(i=>i.os != 3)">

        </li>
    </div>
</template>

<style scoped lang="scss">
.template0{
    width: 100%;
    height: 200px;
    background: #0E1014;
}
</style>