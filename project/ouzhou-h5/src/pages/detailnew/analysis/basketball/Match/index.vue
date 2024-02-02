<!-- 赛况 -->
<script setup name="Match">
import Statistics from "../../Statistics.vue"       // 统计
import incident from "./incident.vue"
</script>

<template>
    <div class="Match">
        <!-- 统计 -->
        <Statistics></Statistics>       
        <!-- 事件 -->
        <incident></incident>
    </div>
</template>

<style scoped lang="scss">

</style>