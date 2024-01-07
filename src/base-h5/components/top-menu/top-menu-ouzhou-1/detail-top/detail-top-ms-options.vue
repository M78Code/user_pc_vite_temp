<script setup name="detail-top-ms-options">
import teamImg from 'src/base-h5/components/details/team-img.vue'    // 详情页蓝色背景上的大型字母图标
import EventDateStandard from "./event-date-standard.vue"

import {useRouter, useRoute} from "vue-router"
import {format_total_score} from "src/output/index.js"
import {MenuData} from "src/output/index.js"


const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    },
    math_list_data: {
        type: Object,
        default: () => ({})
    },
    active: {
        type: Boolean,
        default: false
    },
    index: 0
})

const router = useRouter()
const route = useRoute()

const is_eports_scoring = function (item) {
    //计算主分和客分，用全局的分支处理方法进行处理
    const home = format_total_score(item, 0)
    const away = format_total_score(item, 1)
    //比分判断处理
    let scoring = false
    //如果是电竞，则进行比分判定处理
    if (MenuData.menu_type == 3000) {
        const mmp_state = item.mmp || 1
        if (mmp_state != (Number(home) + Number(away) + 1)) {
            scoring = true
        }
    }
    return scoring
}

const calc_score = function (val) {
    try {
        let {groups: {m, s}} = /S1\|(?<m>\d+):(?<s>\d+)/.exec(val.msc.toString())
        return m + '-' + s
    } catch (error) {
        console.error(error)
        return "0-0"
    }
}
const emits = defineEmits(['ChangeActive'])
const ChangeActive = function () {
    emits('ChangeActive')
}

</script>

<template>
    <span v-show="false"></span>
    <nav class="option" :class="{active}" @click="ChangeActive">
        <aside class="mhn team-image">
            <p class="tips textOverflow1">{{ detail_data?.mhn }}</p>
            <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
            <div class="figure">
                <teamImg :type="0" :url="detail_data.mhlu[0]" :fr="detail_data.frmhn[0]" :size="22"
                         :csid="detail_data.csid"/>
                <!-- <teamImg v-if="detail_data.mhlu.length > 1" :type="0" :url="detail_data.mhlu[1]"
                         :fr="detail_data.frmhn[1]"
                         :size="22" :csid="detail_data.csid" style="margin-left:-0.08rem;"/> -->
            </div>

        </aside>

        <div class="time">
            <p class="score-point">{{ format_total_score(detail_data, 0) }}</p>
            <!-- 赛事日期标准版 -->
            <EventDateStandard :ms_info="detail_data" :index="index"/>
            <p class="score-point">{{ format_total_score(detail_data, 1) }}</p>
        </div>
        <aside class="man team-image">
            <div class="figure">
                <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
                <team-img :type="1" :url="detail_data.malu[0]" :fr="detail_data.frman[0]" :size="22"
                          :csid="detail_data.csid"/>
                <!-- <team-img v-if="detail_data.malu.length > 1" :type="1" :url="detail_data.malu[1]"
                          :fr="detail_data.frman[1]"
                          :csid="detail_data.csid"
                          :size="22"/> -->
            </div>
            <p class="tips textOverflow1">{{ detail_data?.man }}</p>
        </aside>
    </nav>
</template>

<style scoped lang="scss">
.option {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    background: var(--q-gb-bg-c-16);
    position: relative;
    &.active::before{
        content: '';
        display: block;
        position: absolute;
        pointer-events: none;
        inset: 0;
        background: #FF70001A;
    }
    .team-image {
        flex: 1;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        .figure {
            width: 32px;
            height: 32px;
            display: block;
        }

        .tips {
            //color: var(--q-color-fs-color-14);
            color: #fff;
            flex: 1;
            font-size: 0.13rem;
        }
    }

    .mhn {
        .tips {
            text-align: right;
            padding-left: .1rem;
        }

        .figure {
            margin-left: 8px;
        }
    }

    .man {
        .tips {
            text-align: left;
            padding-right: .1rem;
        }

        .figure {
            margin-right: 8px;
        }
    }

    .time {
        width: 32%;
        position: relative;
        display: flex;
        align-self: center;
        justify-content: space-between;

        .score-point {
            width: 20px;
            //color: var(--q-color-fs-color-14);
            color: #fff;
            font-size: 0.16rem;
            text-align: center;
            font-weight: 600;
            margin: 0 4px;
            flex-shrink: 0;
            line-height: 40px;
            height: 40px;
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

:deep(.event-date-standard) {
    color: #fff;
}

:deep(.match_stage) {
    width: 72px;
    height: 40px;
    color: #fff;
    text-align: center;
    line-height: 20px;
}
</style>