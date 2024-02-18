<template>
    <div class="activity-icon" v-if="GlobalAccessConfig.get_activitySwitch() && UserCtr.user_info?.inActivity &&
        get_lang == 'zh'" @click="openActivity">
        <!-- 活动图标 -->
        <img v-if="activity_default" class="activity-logo animate-bounce-up"
            :src="get_server_file_path(UserCtr.user_info?.activityList[0].h5Url)" @error="activity_icon_error" alt="">
        <div v-else :style="compute_css_obj('menu-activity-entrance')" class="activity-logo animate-bounce-up"></div>

        <!-- 活动图标红点 -->
        <div class="red-dot" v-show="task_list > 0 && UserCtr.user_info?.inActivity &&
            get_lang == 'zh' && !UserCtr.user_info?.maintaining">
        </div>

    </div>
</template>
<script setup>
import { i18n_t, compute_css_obj, UserCtr, get_server_file_path } from "src/output/index.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { ref } from 'vue'
import { api_activity } from "src/api";
import lodash from 'lodash'
import { useRouter } from "vue-router";
const router = useRouter()
const get_lang = ref(UserCtr.lang)
//任务列表
const task_list = ref(0)
// 出错时，活动默认图片
const activity_default = ref(false)
/**
   * 进入活动页
   */
function openActivity() {
    if (!GlobalAccessConfig.get_activitySwitch()) {
        $toast(i18n_t(`common.temporarily_unavailable`), 2000)
        return
    }

    // $send_zhuge_event('H5_任务中心', user_info);
    router.push({ name: 'activity_task', query: { rdm: new Date().getTime() } })
    alert("跳活动页面")
}
function activity_icon_error($event) {
    if ($event.target.src.indexOf(activity_default) > 0) return
    activity_default.value = true;
}
// 是否有活动可领取的任务数量
function get_task_list(id = 1) {
    if (['zh', 'hk'].includes(UserCtr.lang) && UserCtr.user_info && !UserCtr.user_info?.maintaining && UserCtr.user_info?.activityList) {
        let isMaintaining = lodash.get(UserCtr.user_info, 'maintaining');
        // 如果活动处于维护状态，直接去掉小红点
        if (isMaintaining == true) {
            if (task_list.value == true) {
                task_list.value = false;
            }
            return
        };
        // 判断是否有活动
        let activityList = lodash.get(UserCtr.user_info, 'activityList');
        // 检测两个活动是否存在以及活动状态不能是未开始和已结束
        let daily = activityList.find(item => item.activityId == '10007' && item.period == 2) || null;
        let growup = activityList.find(item => item.activityId == '10008' && item.period == 2) || null;
        if (!daily && !growup) { return; }
        // 1 每日任务 2成长任务
        const param = {
            actId: id
        }
        api_activity.get_activity_list_details(param, { type: 1 }).then(res => {
            let code = lodash.get(res, 'code');
            let data = lodash.get(res, 'data');
            if (code == 200 && data && data.length > 0) {
                // 判断是否有可领取奖券的任务
                task_list.value = data.some(item => item.bonusType == 3) || false;
                if (!task_list.value && id == 1) {
                    get_task_list(2)
                };
            }
        });
    }
}
get_task_list()
</script>

<style lang="scss">
.activity-icon {
    width: .4rem;
    height: .3rem;

    .activity-logo {
        position: relative;
        display: block;
        width: .4rem;
        height: .3rem;
        margin: 0 .1rem 0 0;
        border: none;
        position: relative;
        left: -0.05rem;
    }

    .red-dot {
        width: .05rem;
        height: .05rem;
        border-radius: 50%;
        background: #B11E33;
        position: absolute;
        right: .42rem;
        top: .06rem;
    }
}
</style>