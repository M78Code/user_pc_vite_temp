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

// 国家赛事
// const leagues_matchs = ref([{
//     national: 'Germany',
//     nationalIcon: de_img,
//     visible: true,
//     children: [{
//         isCollect: false,
//         value: '6',
//         title: 'Liga de primera división'
//     }, {
//         isCollect: false,
//         value: '8',
//         title: 'Liga de primera división'
//     }]
// }, {
//     national: 'Denmark',
//     nationalIcon: dk_img,
//     visible: false,
//     children: [{
//         isCollect: false,
//         value: '6',
//         title: 'Liga de primera división'
//     }, {
//         isCollect: false,
//         value: '8',
//         title: 'Liga de primera división'
//     }, {
//         isCollect: false,
//         value: '8',
//         title: 'Liga de primera división'
//     }]
// }, {
//     national: 'Belgium',
//     nationalIcon: be_img,
//     visible: false,
//     children: [{
//         isCollect: false,
//         value: '6',
//         title: 'Liga de primera división'
//     }, {
//         isCollect: false,
//         value: '8',
//         title: 'Liga de primera división'
//     }]
// }, {
//     national: 'France',
//     nationalIcon: fr_img,
//     visible: false,
//     children: [{
//         isCollect: false,
//         value: '6',
//         title: 'Liga de primera división'
//     }, {
//         isCollect: false,
//         value: '8',
//         title: 'Liga de primera división'
//     }]
// }])

const onLeagueChange = (league, game) => {
    console.log('league, game: ', league, game);
    emit('leagueChange', league, game)

}

onMounted(() => {
    // emit('leagueChange', leagues_matchs.value[0], leagues_matchs.value[0].children[0])
})
</script>

<style lang="scss" scoped></style>