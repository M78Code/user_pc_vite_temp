<template>
    <div>
        <template v-if="leaguesMatchs.length">
            <TopLeagues :leaguesMatchs="leaguesMatchs" @leagueChange="onLeagueChange" />
        </template>
        <NoData v-else which='noMatch' class="data-get-empty2" height='400'></NoData>
    </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
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

const onLeagueChange = (league, game) => {
    console.log('league, game: ', league, game);
    emit('leagueChange', league, game)

}

onMounted(() => {
    // emit('leagueChange', leagues_matchs.value[0], leagues_matchs.value[0].children[0])
})
</script>

<style lang="scss" scoped></style>