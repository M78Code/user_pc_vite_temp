<script setup name="line-up-table">

import {computed, reactive} from "vue";
import UserCtr from "src/core/user-config/user-ctr";

const props = defineProps({
    lineupData:{
        type: Array,
        default: ()=> []
    },
    defaultUrl:{
        type: String,
        default: ''
    }
})

const State = reactive({
    tableHeader:[
        {
            labelName: i18n_t('analysis_football_matches.name'),
            className: 'name'
        },
        {
            labelName: i18n_t('analysis_football_matches.position'),
            className: 'position'
        },
        {
            labelName: i18n_t('analysis_football_matches.number'),
            className: 'number'
        }
    ]
})

const lang = computed(() => {
    return UserCtr.lang
})

const get_file_path = function (){}

</script>
<template>
    <ul class="table table-line-up">
        <li class="table-item table-header">
            <div v-for="item of State.tableHeader" :key="item.className" :class="item.className">
                {{ item.labelName }}
            </div>
        </li>
        <li class="table-item table-body" v-for="(item, index) in lineupData"
            :key="index + 'a'">
            <!-- 联赛icon -->
            <figure class="user-info">
                <img class="user-info-avatar"
                     :src="item.thirdPlayerPicUrl ? get_file_path(item.thirdPlayerPicUrl) : defaultUrl"
                />
                <figcaption class="user-info-name">
                    <template v-if="lang == 'en'">&ensp;</template>
                    {{ item.thirdPlayerName || '-' }}
                </figcaption>
            </figure>
            <div>{{ item.positionName || '-' }}</div>
            <div>
                <span>{{ item.shirtNumber }}</span>
            </div>
        </li>
    </ul>
</template>

<style scoped lang="scss">
.table {
    width: 100%;

    .table-header {
        width: 100%;
        height: .32rem;
        grid-template-rows: .32rem;
        background: #FFF8F3;
        .name {
            text-align: left;
        }
    }

    .table-item {
        width: 100%;
        display: grid;
        grid-template-columns: 4fr 1fr 1fr;
        align-items: center;
        border-bottom: 1px solid #E2E2E2;
        padding: 0 .08rem;
        box-sizing: border-box;
        text-align: center;
    }

    .table-body {
        height: .4rem;
        grid-template-rows: .4rem;

        .user-info {
            display: flex;
            align-items: center;
            &-avatar{
                width: .3rem;
                height: .3rem;
                border-radius: .15rem;
                overflow: hidden;
            }
            &-name{
                color: #484848;
                margin-left: .04rem;
            }
        }
    }
}
</style>