<!--
 * @Author       : pasta
 * @Date         : 2021-01-16 15:17:38
 * @Description  : 
 * @FilePath: /src/pages/game_event_new/components/timeline.vue
-->
<template>
    <div class="show-scrollbar-y">
        <div
            v-for="(item, index) in list"
            :key="index"
            class="row items-center item justify-center"
        >
            <!-- 左 -->
            <div class="q-mr-md col line-item">
                <eventContent :item="item" v-if="item.homeAway == 'home'" />
            </div>
            <!--中-->
            <div>
                <div class="q-mr-md col line-item bg-color-4 lost_connection_box text-panda-text-light"  
                    v-if="item.eventCode=='lost_connection' || item.eventCode=='active_connection_checking_status'"
                >
                    <div class="row justify-between item_text">
                        <div class="RobotoBold1">{{ item.currentTime }}</div>
                        <div>{{i18ns == 'zs'? item.eventName: item.eventEnName }}</div>
                    </div>
                    <!-- <eventContent :item="item" v-if="item.eventCode=='lost_connection'" /> -->
                </div>
                <div class="full-height row" :class="item == 3 ? 'col':''" style="flex-direction: column;" v-else>
                    <div class="col line line-top" :class="get_dotted(item.homeAway)" :style="{ opacity: index == 0 ? 0: 1}">
                    </div>
                    <div  v-if="item.homeAway == 'none' || !item.homeAway">
                        <div class="no-team" :class="get_bg_c(item)">
                            <eventContent1 :item="item" />
                        </div>
                    </div>
                    <div class="line-center" :class="`bg-color-${item.eventType}`" v-else></div>
                    <div class="col line line-bottom" :class="get_dotted(item.homeAway)" :style="{ opacity: index == list.length-1 ? 0: 1}">
                    </div>
                </div>
            </div>
            <!-- 右 -->
            <div class="q-ml-md col line-item">
                <eventContent :item="item" v-if="item.homeAway == 'away'" />
            </div>
        </div>
        <div v-if="list.length == 0" class="text-center q-py-lg">
            no data
            <!-- {{i18n_t('common.noMatchingData')}}	 -->
        </div>
    </div>
</template>

<script>
// 事件模板
import eventContent from "project/animation/src/pages/components/event_content.vue"
// 事件模板1（无队伍）
import eventContent1 from "project/animation/src/pages/components/event_content1.vue"
export default {
components: { eventContent, eventContent1 },
props: {
    list: {
        type: Array,
        default: () => []
    },
},
data() {
    return {
        i18ns: sessionStorage.getItem("i18n") || "zs"
    }
},
methods: {
    get_dotted(homeAway) {
        return (homeAway == 'none' || !homeAway) ? 'border-dotted' : ''
    },
    get_bg_c(item) {
        if(item.remark) {
            if(item.eventCode == 'reject_event'){
                return `bg-color-none-6`
            }else{
                if(item.eventType == 2) {
                return `bg-color-none-2`
            }else{
                return `bg-color-none-3`
            }
            }

        }
    }
}
}
</script>

<style lang="scss" scoped>
.item {
    height: 45px;
}
.line{
    border-right: 1px solid var(--q-color-panda-base-light5)
    margin auto
}
.border-dotted {
    border-right: 1px dotted var(--q-color-panda-base-light5)
}
.line-center {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: var(--q-color-panda-base-light5);
}
.line-item {
    max-width :260px;
}
.no-team {
    max-width: 380px;
    min-width: 80px;
    margin: auto;
}
.bg-color-2 {
background: #DB6372
}
.bg-color-3, .bg-color-4 {
background: #683B48
}
.bg-color-none-2 {
    background: #f59a23;
}
.bg-color-none-3,.bg-color-none-4, .bg-color-none-5 {
    background: #4b7902;
}
.bg-color-none-6{
    background: #683B48;
}
.lost_connection_box{
    font-size: 14px;
height: 42px;
padding: 0 10px;
border-radius: 3px;
overflow:hidden
}
.item_text{
    line-height: 42px;
}
</style>