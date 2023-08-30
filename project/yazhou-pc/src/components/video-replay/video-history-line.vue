<template>
    <div ref="video_history_line" class="video-history-line" :class="[mode]">
        <div class="block-header">
            <div class="block-title">{{ $t('video.video_event_history') }}</div>
        </div>
        <div class="video-history-main">
            <div class="progress-container">
                <div class="progress" :style="`width: ${pecent}%`"></div>
                <template v-if="pecent">
                    <div
                        v-for="item in matchEvents"
                        :key="item.fragmentId"
                        class="event-item"
                        :style="`left: ${item.pecent}%`"
                        @click="showVideoHistory(item)"
                    >
                        <q-tooltip
                            anchor="top middle"
                            self="center middle"
                            :content-style="tooltip_style"
                        >{{item.desc}}</q-tooltip>
                        <div :class="['event-icon', item.eventCode]"></div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { api_details } from "src/api/index.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { format_second_ms } from "src/core/format/index.js"
// TODO hanmar后续处理--S
// import time_format_mixin from "src/public/mixins/common/time_format";
// import video from "src/public/utils/video/video.js"
// TODO hanmar后续处理--E
export default {
    mixins: [time_format_mixin],
    props: {
        mid: {
            type: [String, Number],
        },
        match_info: {
            type: [Object],
        },
        mode: {
            type: String,
            default: 'Block' // Card = 卡片 Block = 块状
        },
        matchTime: {
            type: Number,
            default: 0
        },
        mmp: {
            type: Number,
            default: 0
        }
    },
    data() {
        eventNameMap = {
            corner: i18n_t('replay_video.corner_kick'), // 角球
            goal: i18n_t('replay_video.goal'), // 进球
            yellow_card: i18n_t('icon_tips.yellow_card'), // 黄牌
            red_card: i18n_t('icon_tips.red_card'), // 红牌
            // 红黄牌，就是一个球员当收到第二张黄牌的时候变成红牌，其实就是红牌
            yellow_red_card: i18n_t('icon_tips.red_card') // 黄红牌
        }
        historyPlayTimer = null // 历史数据轮询定时器
        return {
            baseTime: 90 * 60, // 进度条标准时间
            pecent: 0,
            matchEvents: [], // 事件合集
            timer_tmp: 0, // 零时时间
        }
    },
    watch: {
        // 设置时间进度百分比
        matchTime(n) {
            console.log('matchTime', n)
            if (n) {
                start();
            }
            // 加时
            if (n > 90 * 60) {
                baseTime = 120 * 60
                // 重新获取数据格式化
                getVideoPlayHistory()
            }
        },
        // 赛事ID改变
        mid() {
            //定时计算
            start();
            // 获取精彩回放信息
            getVideoPlayHistory()
        },
        timer_tmp() {
            calcProgressLine(matchTime)
        },
        mmp(n) {
            console.log('mmp', n)
            // "31": "中场休息",
            if (n == 31) {
                calcProgressLine(45 * 60)
            }
        }
    },
    created() {
        // 设置时间进度百分比
        if (matchTime) {
            // 加时
            if (matchTime > 90 * 60) {
                baseTime = 120 * 60
            }
            start();
            calcProgressLine(matchTime)
        }
        // 获取精彩回放信息
        getVideoPlayHistory()
        historyPlayTimer && clearInterval(historyPlayTimer)
        historyPlayTimer = setInterval(() => getVideoPlayHistory(), 60 * 1000)
    },
    mounted() {
    },
    beforeDestroy() {
        // 关闭弹窗iframe
        closePopIframe()
        historyPlayTimer && clearInterval(historyPlayTimer)
        useMittOnf(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, set_date_time).off;
        clear();
    },
    methods: {
        // 关闭弹窗iframe
        closePopIframe() {
            useMittEmit('VIDEO_ZONE_EVENT_CMD', {
                cmd: 'colse',
                val: {
                    mid: mid
                }
            });
        },
        // 启动计时器
        start() {
            timer_tmp = matchTime
            if (timer) {
                clear()
            }
            timer = setInterval(() => {
                timer_tmp += 1
            }, 1000)
        },
        //销毁计时器
        clear() {
            timer && clearInterval(timer)
            timer = false;
        },
        // 播放回放视频
        showVideoHistory(item) {
            // 静音原视频
            useMittEmit('IFRAME_VIDEO_VOLUME', {volume: 0, src:'muted'});
            // 禁止原视频全屏
            useMittEmit('IFRAME_VIDEO_STATUS_CHANGE', {
                fullscreen_disabled: true
            });
            // TODO hanmar后续处理--S
            // // 禁止画中画
            // video.send_message({
            //     cmd: 'replay_video_jq_cmd',
            //     val: "$('.dplayer .pip-icon').css({'opacity':'0.5'});index.pip_click_no_run=1;"
            // });
            // TODO hanmar后续处理--E
            let ret_obj = {};
            let rect = $refs['video_history_line'].getBoundingClientRect();
            if(rect){
                ret_obj = {x:rect.x,y:rect.y,w:rect.width,h:rect.height}
            }
            // 弹出新视频
            useMittEmit('VIDEO_ZONE_EVENT_CMD', {
                cmd: 'play',
                url: item.fragmentVideo,
                rect:ret_obj,
                video_info: item,
                match:match_info,
            });
        },
        // 获取精彩回放信息
        getVideoPlayHistory() {
            if (!mid) {
                return false
            }
            const params = {
                mid: mid,
                device: 'PC',
                eventCode: 0, // 0全部 1进球 2角球 3罚牌
            }
            api_details.get_live_video_playback_info(params).then(({ data }) => {
                // eventList
                // let data = [
                //     {
                //         "eventCode": "red_card",   //事件类型
                //         "eventId": "43430462",   //事件ＩＤ
                //         "firstNum": 2,　　//第几次（角球、进球、罚牌）
                //         "homeAway": "Ulsan Hyundai",　　//主客队名称
                //         "secondsFromStart": 42 * 60,//比赛进行时长
                //         "fragmentId": 333,
                //         "fragmentVideo": "http://test-playback.d965r6f.com/video/7193bceee84347012bdead96f180ad9d.mp4",
                //         "t1": 0,　//主队比分
                //         "t2": 1　//客队比分
                //     }
                // ]
                if (data && data.code === 200 && data.data) {
                    // 格式化历史事件数据
                    formatHistoryMatchEventData(data.data.eventList)
                }
            }).catch(err => console.error(err))
        },
      
        // 格式化历史事件数据
        formatHistoryMatchEventData(data) {
            const _eventsHistory = [] // 零时事件数据
            let maxEventTime = 0 // 离当前直播时间最近的一个事件的时间
            data.map(v => {
                const desc = `${v.homeAway} ${eventNameMap[v.eventCode]}${v.firstNum} ${format_second_ms(v.secondsFromStart)}`
                _eventsHistory.push({
                    eventCode: v.eventCode,
                    eventId: v.eventId,
                    fragmentId: v.fragmentId,
                    fragmentVideo: v.fragmentVideo,
                    pecent: parseInt(v.secondsFromStart * 100 / baseTime),
                    desc
                })
                if (v.secondsFromStart > maxEventTime) {
                    maxEventTime = v.secondsFromStart
                }
            })
            calcIconPosition(_eventsHistory)
        },
        // 计算icon偏移位置
        calcIconPosition(items) {
            if (items.length < 2 || !pecent) {
                matchEvents = items
                return false
            }
            let _tempItems = [...items]
            for (let i = 1; i < items.length; i++) {
                // 当2个icon之间间距过小时，加大当前icon偏移量
                const diff = _tempItems[i].pecent - _tempItems[i-1].pecent
                if (diff < 5) {
                    _tempItems[i].pecent = _tempItems[i].pecent + (diff >= 0 ? 0 : -diff) + 5
                }
            }
            // 当最后一个大于当前百分比时，整体向前偏移差量
            const diffX = _tempItems[_tempItems.length - 1].pecent - (pecent ? pecent: 100)
            if (diffX > 0) {
                _tempItems = _tempItems.map(v => {
                    let _newPecent = v.pecent - diffX
                    if (_newPecent < 0) {
                        _newPecent = 0
                    }
                    return {
                        ...v,
                        pecent: _newPecent
                    }
                })
            }
            matchEvents = _tempItems
        },
        // 计算进度条bg的范围
        calcProgressLine(value) {
            let pecent = parseInt(value * 100 / baseTime)
            pecent = pecent > 100 ? 100 : pecent
            pecent = pecent
            if (pecent) {
                calcIconPosition(matchEvents)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.video-history-line {
    background: var(--qq--y0-bg-color12);
    &.Block {
        .block-header {
            background: var(--qq--y0-bg-color12);
            border-bottom: none;
            padding: 9px 15px 0;
        }
    }
    &.Card {
        border-radius: 6px;
        overflow: hidden;
    }
    .block-header {
        padding: 9px 15px;
        background: var(--qq--background-gradient-5);
        // border-bottom: 1px solid var(--qq--match-border-color2);
        .block-title {
            font-weight: 500;
            font-size: 13px;
            line-height: 14px;
            color: var(--qq--league-rank-title-text-color);
            font-family: 'PingFang SC';
            padding-left: 13px;
            position: relative;
            &:before {
                width: 3px;
                height: 14px;
                position: absolute;
                top: 0;
                left: 0;
                content: '';
                height: 14px;
                border-radius: 1.5px;
                background: var(--qq--theme-bg-play-name-before);
            }
        }
    }
}
.video-history-main {
    height: 24px;
    width: 100%;
    padding: 22px 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .progress-container {
        width: 100%;
        height: 4px;
        background: var(--qq--theme-bg-video-history-progress-container);
        border-radius: 15px;
        position: relative;
        .progress {
            height: 100%;
            background: var(--qq--theme-bg-video-history-progress);
            border-radius: 15px;
        }
        .event-item {
            position: absolute;
            z-index: 1;
            width: 17px;
            height: 17px;
            top: -6px;
            transform: translateX(-50%);
            border: 1px solid var(--qq--theme-border-video-history-icon);
            background: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            // transition: all 0.1s;
            &:hover {
                position: absolute;
                width: 24px;
                height: 24px;
                top: -10px;
                .event-icon {
                    background: var(--qq--bg-image-url44);
                    background-repeat: no-repeat;
                    width: 14px;
                    height: 14px;
                    background-size: 100%;
                }
            }
        }
    }

    .event-icon {
        background: url('~public/image/common/png/sports_play_icon.png');
        background-repeat: no-repeat;
        width: 10px;
        height: 10px;
        background-size: 100%;
        &.corner {
            background-position: 0 -160px;
        }
        &.yellow_card {
            background-position: 0 -100px;
        }
        &.red_card {
            background-position: 0 -130px;
        }
        &.goal {
            background-position: 0px -190px;
        }
        &.yellow_red_card {
            background-position: 0 -130px;
        }
    }
}
</style>