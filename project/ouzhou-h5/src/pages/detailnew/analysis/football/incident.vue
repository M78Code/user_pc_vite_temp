<!--
    足球事件 时间轴
-->
<script setup name="incident">

</script>

<template>
    <div class="incident">
        <template v-if="!no_data">
            <div class="title">{{ $root.$t('match_result.event') }}</div>
            <div class="incident_event" v-for="(item, index) in event_data" :key="index">
                <div
                    class="incident_event_title"
                    v-if="title_calculation(item) != '' && item.eventCode == 'match_status'"
                    :class="{start_line: item.matchPeriodId == 0}"
                >
                    <span v-html="title_calculation(item)" :class="{midfield: item.matchPeriodId == 31}"></span>
                </div>
                <match-results-stage v-else>
                    <div slot="left" class="left" v-if="item.home">
                        <div class="substitution">
                            <p>
                                <span v-if="item.eventCode == 'corner'"  v-html="translation_switch(item)"></span>
                                <span v-else>{{ item.home.playName ? item.home.playName :  get_detail_data.mhn }}</span>
                                <span v-if="item.home.eventCode == 'goal'">{{item.home.score}}</span>
                            </p>
                            <span v-if="item.home.playChangedName" style="margin-top: .03rem">{{ item.home.playChangedName }}</span>
                        </div>
                        <img v-if="item.matchPeriodId == 50" :src="item.home.eventCode == 'goal_penalty' ? penalty_img : penalty_missed_img">
                        <span v-else>{{item.home.secondsFromStart}}</span>
                    </div>
                    <div class="middle" :class="{intermission : item.intermission}">
                        <template v-if="item.matchPeriodId == 50">{{item.numPlace}}p</template>
                        <img v-else :src="picture_conversion(item)" :class="imgWidth(item)">
                    </div>
                    <div slot="right" class="right" v-if="item.away">
                        <img v-if="item.matchPeriodId == 50" :src="item.away.eventCode == 'goal_penalty' ? penalty_img : penalty_missed_img">
                        <span v-else>{{item.away.secondsFromStart}}</span>
                        <div class="substitution">
                            <p>
                                <span v-if="item.eventCode == 'corner'" v-html="translation_switch(item)"></span>
                                <span v-else>{{ item.away.playName ? item.away.playName : get_detail_data.man }}</span>
                                <span v-if="item.away.eventCode == 'goal'">{{item.away.score}}</span>
                            </p>
                            <span v-if="item.away.playChangedName" style="margin-top: .03rem">{{ item.away.playChangedName }}</span>
                        </div>
                    </div>
                </match-results-stage>
            </div>
            <!-- 底部图片文字说明 -->
<!--            <results-footer :cds="get_detail_data.cds" />-->
        </template>
        <div v-else class="no-data-footer"></div>
    </div>
</template>

<style scoped lang="scss">
.title {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.24rem;

    font-size: 0.14rem;

    letter-spacing: 0;
    font-weight: bold;
    margin-bottom: 0.15rem;
    position: relative;

    &:before {
        content: '';
        width: 0.03rem;
        height: 0.12rem;
        position: absolute;
        left: 0.16rem;
        top: 0.14rem;

        border-radius: 1.5px;
    }
}

.incident_event {
    padding: 0 0.15rem;
    margin-bottom: 0.16rem;

    .incident_event_title {
        height: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        position: relative;
        text-align: center;
        margin-bottom: 0.22rem;

        > span {
            text-align: center;
            width: fit-content;
            width: -webkit-fit-content;

            width: -moz-fit-content;

            font-size: 0.1rem;

            border-radius: 4px;
            height: 100%;
            line-height: 0.19rem;
            padding: 0 0.1rem;
            position: relative;

            &.midfield {
                &:after {
                    content: "";
                    width: 1.43rem;
                    height: 1px;
                    position: absolute;
                    left: unset;
                    right: -1.5rem;
                    top: 0.09rem;

                    opacity: unset;
                    bottom: unset;
                    transform: unset;
                }

                &:before {
                    content: "";
                    width: 1.43rem;
                    height: 1px;
                    position: absolute;
                    left: -1.5rem;
                    top: 0.09rem;
                }
            }
        }

        &:after {
            content: "";
            width: 0.01rem;
            height: 0.2rem;
            opacity: 0.4;
            position: absolute;
            top: 0.21rem;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            color: var(--q-color-com-fs-color-24);
        }

        &.start_line {
            &:after {
                display: none !important;
            }
        }
    }
}

.no-list {
    padding-top: unset !important;
}

.intermission {
    &:after {
        display: none;
    }
}

.no-data-footer {
    height: 0.3rem;
}

.icon-w7 {
    width: 0.07rem;
}

.icon-w11 {
    width: 0.11rem;
}

.icon-w14 {
    width: 0.14rem;
}

.icon-w15 {
    width: 0.15rem;
}
</style>