<script name="event-date-standard" setup>
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import { format_time_zone  } from "src/output/index.js";
import { get_mmp_name } from 'src/core/format/project/module/format-msc.js'
import {
    get_match_status,
    format_string,
    is_eports_csid
} from "src/output/index.js"
import PageSourceData from "src/core/page-source/page-source.js";
// import { defineProps, computed } from "vue"
import { computed } from "vue"
const props = defineProps({
    ms_info:{
        type: Object,
        default:()=>({})
    },
    index: 0
})

const show_start_counting_down = function (item)  {
    if (typeof item.mcg == 'undefined') {
        return false;
    }
    let r = false;
    // 滚球中不需要显示多少分钟后开赛
    if (item && item.ms == 1) {
        return r;
    }
    let start_time = item.mgt * 1;
    let init_server = PageSourceData.init_time.server_time * 1;
    let init_local = PageSourceData.init_time.local_time;
    let now_local = new Date().getTime();
    let sub_local_time = now_local - init_local;
    let now_server_time = init_server + sub_local_time;
    let sub_time = start_time - now_server_time;

    // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
    r = item.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
    return r;
}

const show_counting_down = function (item) {
    return [1, 2, 10].includes(item.ms * 1);
}

// 获取阶段名称
const computed_process_name = computed(() => {
    // debugger
    let match = props?.ms_info ?? {}
    if(!match){
        return '';
    }
    const {csid, mmp, mle} = match
    let process_name = get_mmp_name(csid, mmp) || "";
    // 即将开赛
    if (lodash.get(props, 'ms') == 110) {
        process_name = i18n_t("common.match_soon");
    }
    // 滚球 && 未开赛
    else if (get_match_status(lodash.get(match, 'ms')) && match.mmp == 0) {
        switch (Number(match.csid)) {
            // 足
            case 1:
                process_name = i18n_t("common.up_half");
                break;
            // 篮
            case 2:
                process_name =
                    match.mle == 17 ? i18n_t("common.up_half") : i18n_t("common.first_match");
                break;
            //棒球
            case 3:
                process_name = i18n_t("mmp.3.401");
                break;
            //冰球
            case 4:
                process_name = i18n_t("mmp.4.1");
                break;
            // 网球
            case 5:
                process_name = i18n_t("mmp.5.8");
                break;
            // 美式足球
            case 6:
                process_name = i18n_t("mmp.6.13");
                break;
            // 斯诺克
            case 7:
                process_name = covert_mct(match);
                break;
            // 乒乓球
            case 8:
            // 排球
            case 9:
            // 羽毛球
            case 10:
                process_name = i18n_t("mmp.10.8");
                break;
        }

        // 电竞
        if (is_eports_csid(match.csid)) {
            process_name = i18n_t("mmp.100.1");
        }
    } else {
        // 篮球(2) && 赛制为 17分钟 && 第四节(100) ====> 阶段名称显示 "下半场"
        if (csid == 2 && mle == 17 && mmp == 100) {
            process_name = i18n_t("mmp.2.2");
        }

        // 斯诺克(7) 的滚球(21)
        if (csid == 7 && mmp == 21) {
            process_name = covert_mct(match);
        }
    }

    // 篮球3X3滚球时显示"全场"
    if (csid == 2 && mle == 73 && get_match_status(lodash.get(props, 'match.ms'))) {
        process_name = i18n_t("mmp.2.21");
    }
    //是否列表页棒球第X局，换行显示
    if (
        lodash.get(match, 'csid')== 3 &&
        props.show_page == "match-list" &&
        process_name?.indexOf("第") == 0
    ) {
        //欧洲版，不用换行
        return props.date_show_type === 'inline' ? process_name : process_name.replace(" ", "<br/>");
    } else {
        return process_name;
    }
});

const covert_mct = ({ mct, mmp, ms }) => {
    // 已开赛但接口没给 mmp 时显示第一局
    if (ms == 1 && mmp == 0) {
        mct = "1";
    } else {
        mct = mct.toString();
    }

    let lang = lodash.get(window.vue, "lang") || "en";
    // console.error(lang)

    let new_num = mct;

    if (lang == "zh") {
        new_num = numberToChinese(mct);
    }
    let rs = format_string(i18n_t("mmp.7.x"), new_num);
    return rs;
};

</script>

<template>
    <div class="event-date-standard">
        <!--即将开赛 ms = 110-->
        <div class="coming-soon" v-if="ms_info?.ms" v-show="ms_info?.ms == 110">
            {{ i18n_t(`ms[${ms_info?.ms}]`) }}
        </div>
        <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
        <div class="date-time" v-show="ms_info?.ms != 110 && !show_start_counting_down(ms_info) && !show_counting_down(ms_info)">
            {{ format_time_zone(+ms_info?.mgt).Format(i18n_t('time4')) }}
        </div>
        <!--一小时内开赛 -->
        <div class="start-counting-down" v-show="ms_info?.ms != 110 && show_start_counting_down(ms_info)">
            <CountingDownStart :match="ms_info" :index="index" :mgt_time="ms_info?.mgt"></CountingDownStart>
        </div>
        <!--倒计时或正计时-->
        <div v-if="ms_info?.ms != 110 && show_counting_down(ms_info)" class="ongoing">
            <div class="process_name" v-if="!!computed_process_name">{{ computed_process_name }}</div>
            <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
            <CountingDownSecond ref="counting-down-second"  :mmp="ms_info?.mmp"
                                :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+ms_info?.csid)" :m_id="ms_info?.mid"
                                :second="ms_info?.mst" :match="ms_info" >
            </CountingDownSecond>
        </div>
    </div>
</template>

<style scoped lang="scss">
.event-date-standard{
    display: flex;
    align-self: center;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    :deep(.counting-down-wrap){
        position: relative !important;
        width: auto !important;
    }

    .ongoing{
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .process_name{
        font-size: 0.15rem;
    }
}
</style>