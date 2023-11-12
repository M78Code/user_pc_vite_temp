<!--
 * @Author: land land@itcom888.com
 * @Date: 2023-11-11 14:01:08
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-12 17:02:31
 * @FilePath: \user-pc-vite\project\ouzhou-h5\src\pages\match-page\match-first-step.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
            <template v-if="leagues_matchs.length > 0">
                <TopLeagues :leagues_matchs="leagues_matchs" @leagueChange="onLeagueChange" />
            </template>
        </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import TopLeagues from './components/top-leagues.vue'
import { de_img, dk_img, be_img, fr_img } from 'src/base-h5/core/utils/local-image.js'

const emit = defineEmits(['leagueChange'])

// 国家赛事
const leagues_matchs = ref([{
    national: 'Germany',
    nationalIcon: de_img,
    visible: true,
    children: [{
        isCollect: false,
        value: '6',
        title: 'Liga de primera división'
    }, {
        isCollect: false,
        value: '8',
        title: 'Liga de primera división'
    }]
}, {
    national: 'Denmark',
    nationalIcon: dk_img,
    visible: false,
    children: [{
        isCollect: false,
        value: '6',
        title: 'Liga de primera división'
    }, {
        isCollect: false,
        value: '8',
        title: 'Liga de primera división'
    }, {
        isCollect: false,
        value: '8',
        title: 'Liga de primera división'
    }]
}, {
    national: 'Belgium',
    nationalIcon: be_img,
    visible: false,
    children: [{
        isCollect: false,
        value: '6',
        title: 'Liga de primera división'
    }, {
        isCollect: false,
        value: '8',
        title: 'Liga de primera división'
    }]
}, {
    national: 'France',
    nationalIcon: fr_img,
    visible: false,
    children: [{
        isCollect: false,
        value: '6',
        title: 'Liga de primera división'
    }, {
        isCollect: false,
        value: '8',
        title: 'Liga de primera división'
    }]
}])

const onLeagueChange = (league, game) => {
    console.log('league, game: ', league, game);
    emit('leagueChange', league, game)

}

onMounted(() => {
    // emit('leagueChange', leagues_matchs.value[0], leagues_matchs.value[0].children[0])
})
</script>

<style lang="scss" scoped></style>