<script setup name="Intelligence">
import NoData from "../NoData.vue"
import {api_analysis} from "src/api/index.js";      // 赛事分析接口文件
import {inject, onBeforeMount, onBeforeUnmount, reactive, nextTick} from "vue";

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const State = reactive({
    radioButtonIndex: 0,  //按钮下标
    tabRadioButton: ['曼联', '德联'], //主客队名称
    dataList: [], //详细情报数据
    is_done: false,  //数据加载完成
})

const radioButton = function (index) {
    if (State.radioButtonIndex == index) return
    State.radioButtonIndex = index
    State.dataList = []
    get_list()
}

const refresh_match_analysis = function () {
    nextTick(() => {
        radioButton(State.radioButtonIndex--)
    })
}

const getLabelText = function (label){
    const label_list = {
        0: 'analysis_football_matches.Neutral_Information',
        1: 'analysis_football_matches.Favorable_information',
        2: 'analysis_football_matches.Unfavorable_information'
    };
    return i18n_t(label_list[label] || '');
}

const _getList = async function () {
    try {
        State.is_done = false;

        const parameter = {
            standardMatchId: match_detail.value.mid,
            parentMenuId: 4,
            sonMenuId: State.radioButtonIndex + 1
        };

        const {code, data} = await api_analysis.get_match_analysise_data(parameter);
        if (!(code == 200 && data.sThirdMatchInformationDTOList && data.sThirdMatchInformationDTOList.length)) throw new Error('暂时没有更多数据')

        const msgMap = {
            0: { label: 0, msg: [] },   // 中立情报
            1: { label: 1, msg: [] },   // 有利情报
            2: { label: 2, msg: [] }    // 不利情报
        };

        data.sThirdMatchInformationDTOList.forEach(item => {
            const benefit = item.benefit;
            const radioIndex = State.radioButtonIndex;

            if (benefit === 0 || benefit === 1) {
                msgMap[0].msg.push(item.content);
            } else if ((benefit === 2 && radioIndex === 0) || (benefit === 3 && radioIndex === 1)) {
                msgMap[1].msg.push(item.content);
            } else if ((benefit === 4 && radioIndex === 0) || (benefit === 5 && radioIndex === 1)) {
                msgMap[2].msg.push(item.content);
            }
        });
        State.dataList.push(...Object.values(msgMap).filter(item => item.msg.length));
        State.is_done = true;
    } catch (error) {
        console.error(error);
    }
}

onBeforeMount(() => {
    // 添加监听 赛事分析刷新事件
    // State.$root.$on(State.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, State.refresh_match_analysis)
    State.tabRadioButton = [match_detail.value.mhn, match_detail.value.man]
    _getList()
})
onBeforeUnmount(() => {
    // State.$root.$off(State.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, State.refresh_match_analysis)
})
</script>

<template>
    <section>
<!--        <NoData></NoData>-->
        <div class="header">
            <div class="tab-radio-button" v-for="(item, index) in State.tabRadioButton" :key="index+'b'"
                 :class="{active: State.radioButtonIndex == index}" @click="radioButton(index)">
                <span class="ellipsis">{{ item }}</span>
            </div>
        </div>
        <div class="content yb_mt10" v-for="(item,index) in State.dataList" :key="index">
            <p class="tittle">
                <span :class="{'color0':item.label == 0,'color1':item.label == 1,'color2':item.label == 2}"></span>&ensp;
                {{ getLabelText(item.label) }}
            </p>
            <template v-for="(item2,index2) in item.msg" :key="index2">
                <p class="item">{{ item2 }}</p>
            </template>
        </div>
        <div v-if="!State.dataList.length && State.is_done" class="yb_py18 text-center no-list">
            {{ i18n_t('common.no_data') }}
        </div>
    </section>
</template>

<style lang="scss" scoped>
.intelligence {

    height: calc(100% - 0.4rem);

    .header {
        display: flex;
        justify-content: center;
        padding: 0.15rem 0;
        width: 100%;

        z-index: 100;

        .tab-radio-button {
            width: 1.4rem;
            height: 0.3rem;
            display: flex;
            justify-content: center;
            align-items: center;


            letter-spacing: 0;
            text-align: center;
            font-size: 0.14rem;

            .ellipsis {

                font-weight: unset;
            }

            &.active {

                border: unset;

                .ellipsis {

                    font-weight: bold;
                }
            }

            &:nth-child(1) {
                border-right: unset;
                border-radius: 0.08rem 0 0 0.08rem;
                padding: 0 0.15rem;
            }

            &:nth-child(2) {
                border-left: unset;
                border-radius: 0 0.08rem 0.08rem 0;
                padding: 0 0.15rem;
            }
        }
    }

    .content {
        .tittle {
            line-height: 0.4rem;
            padding: 0 0.2rem;

            span {
                display: inline-block;
                width: 0.08rem;
                height: 0.08rem;

                border-radius: 50%;
            }
        }

        .item {
            padding: 0.1rem 0.2rem;

            &:last-child {
                border-bottom: none;
            }
        }
    }
}
</style>
