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
            <q-virtual-scroll ref="scrollRef" v-if="menuList" :items="menuList"
                virtual-scroll-horizontal v-slot="{ item, index }">
                <!-- <div v-if="menu_type==28?true:MenuData.menu_list.map((item)=>{return +item.mi}).includes(+item.mi)" @click="on_change_play(item,index)" -->
                <div @click="on_change_play(item,index)"
                    :key="index" dense clickable :class="['play_item', { active: item.mi === playValue }]">
                    <span class="icon">
                        <sport-icon size="24" :status="item.mi === playValue" :sport_id="item.mi" />
                        <span class="badge" v-if="props.is_show_badge"><q-badge rounded :label="item.ct || 0" /></span>
                    </span>
                    <div class="label">{{BaseData.menus_i18n_map[MenuData.is_vr() || (MenuData.is_results() && +item.mi >1000 && +item.mi <2000) ?`3${item.mi}`:MenuData.is_kemp()?+item.mi+300:item.mi] }} </div>
                    <!-- <div class="label">{{BaseData.menus_i18n_map[+item.mi>1000 && +item.mi<2000?`3${item.mi}`:item.mi] }} </div> -->
                    <span class="round"></span>
                </div>
            </q-virtual-scroll>
        </header>
    </div>
</template>
<script setup>
import { ref , watch ,nextTick} from "vue"
import sportIcon from "../components/left-menu/sport-icon.vue"
import BaseData from "src/core/base-data/base-data.js";
import { MenuData  } from "src/output/index.js";
import MatchFold from 'src/core/match-fold/index.js'
const emits = defineEmits(['changeMenu']);

const props = defineProps({
    menu_type: {
        type: String,
        default: "2"
    },
    menuList:{
        type: Array,
        default: []
    },
    // 当前选中的值
    current_mi:{
        type: [String, Number],
        default: ''
    },
    is_show_badge:{
        type: Boolean,
        default: true
    },
})
// /**
//  * 获取滚球数量
//  * @param {*} item 
//  */
//  const get_cont = (item) => {
//     return item.ct||item.sl.filter((n) => { return n.mi == `${item.mi}${props.menu_type}` })?.[0]?.ct || 0;
// }
// /**
//  * 列表数据
//  */
// const dataList = computed(() =>{
//     return props.menuList?props.menuList:MenuData.menu_list.filter((item)=>{
//         return get_cont(item);
//     }) || []
// })
const playValue = ref(props.current_mi);
const scrollRef = ref(null);
/**
 * 滚球选择
 * @param {*} item 
 * @param {*} index 
 */
const on_change_play = (item,index) => {
    MatchFold.clear_fold_info()
    if(playValue.value == item.mi)return;
    playValue.value = item.mi;
    emits('changeMenu',item)
    // const index = dataList.value.findIndex(n=>n.mi == item.mi);
    scrollRef.value.scrollTo(index-2, 'start-force')
}
const reset = (mi) => {
    if(mi)playValue.value = mi;
    nextTick(()=>{
        const index = props.menuList?.findIndex(n=>n.mi == playValue.value) || 0;
        scrollRef.value.scrollTo(index-2, 'start-force')
    })
}

defineExpose({
    reset
})

watch(()=>props.current_mi,()=>{
    playValue.value = props.current_mi;
})
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
                    background: linear-gradient(180deg, #FF7000 0%, #FF9440 50%);
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
  src/output