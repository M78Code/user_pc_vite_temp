<!--
 * @Author: rise
 * @Date: 2023-11-02 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 17:48:28
 * @Description:  
-->
<template>
    <div class="top_events_page">
        <header class="ball_tab">
            <q-virtual-scroll ref="scrollRef" v-if="leftDataList.length" :items="leftDataList"
                virtual-scroll-horizontal v-slot="{ item, index }">
                <div v-if="![400,2000,300].includes(item.mi) && get_cont(item)" @click="on_change_play(item)"
                    :key="index" dense clickable :class="['play_item', { active: +item.mi === +playValue }]">
                    <span class="icon">
                        <sport-icon size="24" :status="+item.mi === +playValue" :sport_id="item.mi" />
                        <span class="badge" v-if="props.is_show_badge"><q-badge rounded :label="get_cont(item)" /></span>
                    </span>
                    <div class="label">{{ item.mi == '2000' ? "Esports" : BaseData.menus_i18n_map[item.mi] }} </div>
                    <span class="round"></span>
                </div>
            </q-virtual-scroll>
        </header>
    </div>
</template>
<script setup>
import lodash from 'lodash'
import { onMounted, ref ,onUnmounted, reactive,nextTick} from "vue"
import sportIcon from "../components/left-menu/sport-icon.vue"
import BaseData from "src/core/base-data/base-data.js";
import { MenuData , UserCtr} from "src/output/index.js";
import { useMittOn,MITT_TYPES } from "src/core/mitt/index.js" 
import { use_sports_play_data } from 'src/output/index.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import STANDARD_KEY from "src/core/standard-key";
import MatchFold from 'src/core/match-fold/index.js'
import { useRouter } from 'vue-router'
const menu_h5 = STANDARD_KEY.get("menu_h5");
const get_uid =  ref(UserCtr.get_uid())
const router = useRouter()
const props = defineProps({
    menu_type: {
        type: String,
    },
    is_show_badge:{
        type: Boolean,
        default: true
    },
})
const leftDataList = ref([]);
const emits = defineEmits(['changeMenu'])
const contInit = ref([]);

const ref_data = reactive({
    emit_lsit:{}
})
/**
 * 获取滚球数量
 * @param {*} item 
 */
 const get_cont = (item) => {
    return item.sl?.filter((n) => { return n.mi == `${item.mi}${props.menu_type}` })?.[0]?.ct || 0;
}
/**
 * 列表数据
 */
const dataList = () =>{
    return leftDataList.value.filter((item)=>{
        return get_cont(item);
    }) || []
} 
const playValue = ref('');
const scrollRef = ref(null);
/**
 * 初始化
 */
const get_init_data = () =>{
    const session_info = LocalStorage.get(menu_h5);
    leftDataList.value = MenuData.menu_list;
    MenuData.set_current_lv1_menu(props.menu_type);
    
    //当前激活球种id  如果本地有存储值就取本地存储的值
     MenuData.set_menu_mi(session_info?.menu_mi || MenuData.menu_mi.value || dataList()[0]?.mi)
    // ;
    playValue.value = session_info?.menu_mi ||MenuData.menu_mi.value || dataList()[0]?.mi;
    nextTick(()=>{
        const index = dataList().findIndex(n=>n.mi ==  playValue.value) || 0;
        scrollRef.value.scrollTo(index-2, 'start-force')
    })
   
}
/**
 * 获取最新列表
 * @param {*} data 
 */
// const getNewData = (data) =>{
//     leftDataList.value = leftDataList.value.map((item)=>{
//         item.sl = data.filter((n)=>{return n.mi === item.mi})?.[0]?.sl;
//         return item;
//     })
// }
/**
 * 定时器转换
 * @param {*} fn 
 * @param {*} delay 
 */
// const get_interval_menu = (fn, delay) =>{
//     let timer = null
//     const inside = () => {
//         clearTimeout(timer)
//         fn()
//         timer = setTimeout(inside, delay)
//     }
//     timer = setTimeout(inside, delay)
//     return {
//         clear() {
//             clearTimeout(timer)
//         }
//     }
// }
// /**
//  * 清除定时器
//  * @param {*} flagTimer 
//  */
// const clearInterval = (flagTimer) => {
//     flagTimer.clear()
// }
// /**
//  * 获取列表 之后更换ws
//  */
// const get_menu_list = async () =>{
//     const res = await api_base_data.get_base_data_menu_init();
//     if(res && res.code =="200" && res.data){
//         getNewData(res.data);
//     }else{
//         clearInterval(timer)
//     }
// }
// /**
//  * 定时器
//  */
// const timer = get_interval_menu(get_menu_list,3000);
/**
 * ws推送球种数量
 * @param {*} list 
 */
const get_menu_ws_list = (list) =>{
    list = list.filter((item)=>{return item.mi});
    leftDataList.value = leftDataList.value.map((item)=>{
        list.length && list.forEach((n)=>{
            if(item.mi == n.mi.slice(0,3)){
                let index = item.sl?.findIndex((k)=>{return k.mi == n.mi});
                if(index !== -1)item.sl[index].ct = n?.count || 0;
            }
        })
        return item;
    })
}
onMounted(()=>{
    get_init_data();
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_UPDATE_INIT_DATA, get_init_data).off,
        emitter_2: useMittOn(MITT_TYPES.EMIT_SET_BESE_MENU_COUNT_CHANGE, get_menu_ws_list).off,
    }
   
})
onUnmounted(()=>{
    Object.values(ref_data.emit_lsit).map((x) => x());
})
/**
 * 滚球选择
 * @param {*} item 
 * @param {*} index 
 */
const on_change_play = (item) => {
    if(playValue.value == item.mi)return;
    MatchFold.clear_fold_info()
    playValue.value = item.mi;
    MenuData.set_menu_mi(item.mi)
    const index = dataList().findIndex(n=>n.mi == item.mi);
    scrollRef.value.scrollTo(index-2, 'start-force')
    // MenuData.get_match_render_list();
    emits('changeMenu',item.mi)
    
    const csid = MenuData.menu_csid
    const sports_play_data = use_sports_play_data()
    const hpid = lodash.get(sports_play_data, `[${csid}][0].hpid`, '1')
    MatchResponsive.set_match_hpid(hpid, csid)
    // set_cont()
}

</script>
  
<style scoped lang="scss">
.top_events_page {
    // height: 100%;
    width: 100%;

    header {
        height: 66px;
        border-bottom: 10px solid #E2E2E2;

        .q-virtual-scroll {
            height: 56px;
            overflow-y: hidden;
            &::-webkit-scrollbar {
                display: none;
                /* Chrome Safari */
            }

            .play_item {
                position: relative;
                display: flex;
                padding: 2px 0 0 0;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                width: 0.85rem;

                &.active {
                    .round {
                        width: 8px;
                    }

                    .label {
                        font-weight: 500;
                        color: #1A1A1A;
                    }

                    .icon .badge {
                        :deep(.q-badge) {
                            background: #FF7000;
                        }
                    }
                }

                .round {
                    position: absolute;
                    width: 0;
                    height: 8px;
                    bottom: -4px;
                    border-radius: 50%;
                    //background: linear-gradient(180deg, #FF7000 0%, #FF9440 50%);
                    background: var(--q-gb-bg-lg-8);
                }

                .label {
                    // padding: 0 15px;
                    margin-top: 2px;
                    font-size: 14px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: #8A8986;
                    width: 100%;
                    text-align: center;
                    position: relative;

                    &::after {
                        content: "";
                        width: 1px;
                        height: 12px;
                        position: absolute;
                        right: 0;
                        top: 0.04rem;
                        background: #D9D9D9;
                    }
                }

                .icon {
                    position: relative;

                    .badge {
                        position: absolute;
                        left: 88%;
                        top: 0;
                        z-index: -1;

                        :deep(.q-badge) {
                            background: #BDBDBD;
                        }
                    }
                }
            }

            .play_item:last-child {
                .label .line {
                    width: 0;
                }
            }
        }

        :deep(.sport-img) {
            // transition: all 0.25s ease;
        }
    }

    section {
        height: calc(100% - 68px);
        overflow-y: auto;

        &::-webkit-scrollbar {
            display: none;
            /* Chrome Safari */
        }
    }
}</style>
