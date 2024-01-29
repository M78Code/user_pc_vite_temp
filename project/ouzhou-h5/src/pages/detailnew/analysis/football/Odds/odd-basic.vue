<script setup name="odd-basic">
// import {
//   odd_lock_ouzhou,
//   ouzhou_hps_up,
//   ouzhou_hps_down,
//   ouzhou_white_down,
//   ouzhou_white_up
// } from "src/base-h5/core/utils/local-image.js";
// <img class="odd-image" v-show="status != 'none'"
//             :src="oddUp ? ouzhou_hps_up : ouzhou_hps_down" />
const props = defineProps({
    tableData:{
        type: Array,
        default: ()=> []
    },
    selectedTabIndex:{
        type: [Number,String],
        default: ''
    }
})
</script>

<template>
    <ul class="table">
        <li class="table-header table-item table-bottom-border">
            <div class="t1">
                <div class="ellipsis">
                    {{ i18n_t('analysis_football_matches.company') }}
                </div>
            </div>
            <div class="t2">
                <i >{{ i18n_t('analysis_football_matches.home_win1') }}</i>
                <i >{{ i18n_t('analysis_football_matches.flat') }}</i>
            </div>
            <div class="t3">
                <i class="t4">{{ i18n_t('analysis_football_matches.away_win') }}</i>
                <i class="t4">{{ i18n_t('analysis_football_matches.Main_win_rate') }}</i>
            </div>
            <div class="t4">
                <i >{{ i18n_t('analysis_football_matches.Customer_win_rate') }}</i>
                <i class="t4">{{ i18n_t('analysis_football_matches.Return_rate') }}</i>
            </div>
        </li>
        <li class="table-header table-item table-bottom-border" v-else>
            <span class="t1">{{ i18n_t('analysis_football_matches.company') }}</span>
            <span class="t2"> {{selectedTabIndex == 2 ? i18n_t('analysis_football_matches.big') : i18n_t('analysis_football_matches.Main_win')}}</span>
            <span class="t3">{{ i18n_t('analysis_football_matches.handicap') }}</span>
            <span class="t4">{{selectedTabIndex == 2 ? i18n_t('analysis_football_matches.small') : i18n_t('analysis_football_matches.away_win') }}</span>
        </li>
        <template v-if="tableData.length">
            <li class="table-body table-item table-bottom-border" v-for="(item,index) in tableData" :key="index">
                <div class="t1">
                    <div class="name ellipsis table-right-border">{{ item.bookName }}</div>
                    <div class="options table-right-border">
                        <span class="table-bottom-border">{{ i18n_t('analysis_football_matches.Initial_offer') }}</span>
                        <span>{{ i18n_t('analysis_football_matches.immediate') }}</span>
                    </div>
                </div>
                <div class="t2 basic table-right-border">
                    <div class="basic-item table-bottom-border">{{ item.handicapOddsDTOList[0].value0 }}</div>
                    <div
                        class="basic-item"
                        :class="{'red':item.handicapOddsDTOList[1].directions.value0 == 1,'green':item.handicapOddsDTOList[1].directions.value0 == -1}">
                        {{ item.handicapOddsDTOList[1].value0 }}
                        <i class="odd yb_ml4"></i>
                    </div>
                </div>
                <div class="t3 basic table-right-border">
                    <div class="basic-item table-bottom-border">{{ item.handicapOddsDTOList[0].handicapVal }}</div>
                    <div
                        class="basic-item table-bottom-border"
                        :class="{'red':item.handicapOddsDTOList[1].directions.handicapVal == 1,'green':item.handicapOddsDTOList[1].directions.handicapVal == -1}">
                        {{ item.handicapOddsDTOList[1].handicapVal }}
                        <i class="odd yb_ml4"></i>
                    </div>
                </div>
                <div class="t4 basic table-right-border">
                    <div class="basic-item table-bottom-border">{{ item.handicapOddsDTOList[0].value }}</div>
                    <div
                        class="basic-item table-bottom-border"
                        :class="{'red':item.handicapOddsDTOList[1].directions.value == 1,'green':item.handicapOddsDTOList[1].directions.value == -1}">
                        {{ item.handicapOddsDTOList[1].value }}
                        <i class="odd yb_ml4"></i>
                    </div>
                </div>
            </li>
        </template>
        <NoData v-else></NoData>
    </ul>
</template>

<style scoped>

</style>