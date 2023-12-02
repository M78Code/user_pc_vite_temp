<script setup name="detail-top-ms-options">
import teamImg from 'src/base-h5/components/details/team-img.vue'    // 详情页蓝色背景上的大型字母图标
import countingDown from 'src/base-h5/components/common/counting-down.vue'   // 赛事进行中每秒变化的计时器
import EventDateStandard from "./event-date-standard.vue"
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';

import {computed, defineProps, defineEmits} from "vue"
import { useRouter,useRoute } from "vue-router"
import { format_total_score } from "src/core/format/index.js"
import { MenuData } from 'src/core/'


const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    },
    math_list_data: {
        type: Object,
        default: () => ({})
    },
    active:{
        type: [Number,String],
        default: 0
    },
    index: 0
})

const router = useRouter()
const route = useRoute()

/* 是否赛果详情页面 */
// matchResults 欧洲 H5
const is_match_result = computed(()=>{
    return ['matchResults'].includes(route.name)
})
setTimeout(function () {
    console.log(props.detail_data, "props.detail_data")
}, 1200)

const is_eports_scoring = function (item) {
    //计算主分和客分，用全局的分支处理方法进行处理
    const home = format_total_score(item, 0)
    const away = format_total_score(item, 1)
    //比分判断处理
    let scoring = false
    //如果是电竞，则进行比分判定处理
    if(MenuData.menu_type == 3000) {
        const mmp_state = item.mmp || 1
        if(mmp_state != (Number(home) + Number(away) +1)) {
            scoring = true
        }
    }
    return scoring
}

const calc_score = function (val){
    try {
        let {groups:{m,s}} = /S1\|(?<m>\d+):(?<s>\d+)/.exec(val.msc.toString())
        return m + '-' + s
    } catch (error) {
        console.error(error)
        return "0-0"
    }
}
const emits = defineEmits(['ChangeActive'])
const ChangeActive = function (){
    emits('ChangeActive')
}
</script>

<template>
    <span v-show="false"></span>
    <nav class="option" @click="ChangeActive">
        <figure class="mhn team-image item">
            <img :src="detail_data?.mhlu[0]" alt="">
            <figcaption class="tips textOverflow2">{{ detail_data?.mhn }}</figcaption>
        </figure>
        <div class="time item">
            <!-- 赛事日期标准版 -->
            <EventDateStandard :ms_info="detail_data" :index="index" />

            <div class="show-font-style-b">
                <span v-if="detail_data.ms == 0 && !is_match_result">
                    <show-start-time :detail_data="detail_data" />
                </span>
                <span class="score" v-if="[1,2,3,4].includes(detail_data.ms) || is_match_result">
                    <!-- 增加比分判定中的判断和显示 -->
                    <template v-if="is_eports_scoring(detail_data)">
                        {{ i18n_t('mmp.eports_scoring') }}
                    </template>
                    <template v-else-if="is_match_result">
                        {{ calc_score(detail_data) }}
                    </template>
                    <template v-else>
                        {{ format_total_score(detail_data,0) }} - {{ format_total_score(detail_data,1) }}
                    </template>
                </span>
            </div>
        </div>
        <figure class="man team-image item">
            <img :src="detail_data?.malu[0]" alt="">
            <figcaption class="tips textOverflow2">{{ detail_data?.man }}</figcaption>
        </figure>
    </nav>
</template>

<style scoped lang="scss">
.option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 104px;

    .item {
        flex: 1;
        height: 88px;
    }

    .team-image {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        img {
            width: 32px;
            height: 32px;
            display: block;
            margin-top: 16px;
        }

        figcaption.tips {
            width: 80%;
            height: 48px;
            margin-top: 8px;
            color: var(--q-color-fs-color-14);
            font-size: 0.13rem;
            text-align: center;
        }
    }

    .time{
        position: relative;
        display: flex;
        align-self: center;
        justify-self: center;
        flex-direction: column;
        .score{
            display: flex;
            align-self: center;
            justify-content: center;
        }
    }
}

.textOverflow1 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.textOverflow2 {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.show-font-style-b {
    line-height: normal;
    font-size: 0.26rem;
    font-weight: bold;
}
</style>