<template>
    <div>
        <template v-if="leaguesMatchs.length">
            <TopLeagues :leaguesMatchs="leaguesMatchs" @leagueChange="onLeagueChange" />
        </template>
        <NoData v-else which='noMatch' class="data-get-empty2" height='400'></NoData>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import TopLeagues from 'project_path/src/pages/home/components/top-leagues.vue'
import { de_img, dk_img, be_img, fr_img } from 'src/base-h5/core/utils/local-image.js'
import NoData from "src/base-h5/components/common/no-data.vue";

const emit = defineEmits(['leagueChange'])

const props = defineProps({
    leaguesMatchs: {
        type: Array,
        default: () => [],
        required: true
    },
})

const onLeagueChange = (params) => {
    emit('leagueChange', params)

}
</script>

<style lang="scss" scoped></style>