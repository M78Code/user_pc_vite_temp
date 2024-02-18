<template>
    <template v-if="store.leaguesMatchs.length">
        <TopLeagues/>
    </template>
    <NoData v-else which='noMatch' class="data-get-empty2" height='400'></NoData>
</template>

<script setup>
import TopLeagues from './top-leagues.vue'
import NoData from "src/base-h5/components/common/no-data.vue";
import { store } from "project_path/src/pages/match-page/index.js"

</script>

<style lang="scss" scoped></style>