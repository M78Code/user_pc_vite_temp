<!--
 * @Author: rise
 * @Date: 2023-10-22 17:03:22
 * @LastEditors: rise
 * @LastEditTime: 2023-10-30 15:44:07
 * @Description:  
-->
<template>
    <div class="switch-wap">
        <div class="switch-content" v-for="(item , index) in switchData" :key="index">
            <SwitchNav :list = "item.list" :defaultVal="item.defaultVal"/>
        </div>
    </div>
</template>
<script setup>
import SwitchNav from "./switch-nav.vue";
import { ref, computed, onUnmounted, watch, nextTick } from "vue";
import { theme_list, theme_map } from "src/core/theme/"
import UserCtr from "src/core/user-config/user-ctr.js"
import { lang } from "src/base-h5/mixin/userctr";
import {  useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import { project_name, MenuData } from "src/output/index.js";

/**
 * 首页switch wap
 */
const switchData = [
    {
        defaultVal:2,
        list:[
            {
                name:"专业版",
                val:2,
                changeFun:(val)=>{
                    // 1 新手版 2 专业版
                    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
                    nextTick(()=>{
                        UserCtr.set_standard_edition(val)
                        VirtualList.set_is_show_ball(true)
                        MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
                    })
                }
            },
            {
                name:"新手版",
                val:1,
                changeFun:(val)=>{
                    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
                    UserCtr.set_standard_edition(val)
                    if (project_name === 'app-h5') {
                        nextTick(() => {
                            !MenuData.is_collect() && MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
                        })
                    }
                }
            }
        ]
    },
    {
        defaultVal:1,
        list:[
            {
                name:"热门",
                val:1,
                isSort:1,
                changeFun:(val,sort)=>{
                    return UserCtr.set_sort_type(val);
                }
            },
            {
                name:"时间",
                val:2,
                isSort:1,
                changeFun:(val,sort)=>{
                    return UserCtr.set_sort_type(val);
                }
            }
        ]
    },
    {
        defaultVal: UserCtr.theme,
        list:theme_list.map((item)=>{
            item.name = item.i18n[lang.value];
            item.val = item.key;
            item.changeFun = (val)=>{
                // 切换主题色
                UserCtr.set_theme(val)
                return useMittEmit(MITT_TYPES.EMIT_THE_THEME_CHANGE)
            }
            return item;
        }).reverse()
    },
]
</script>
<style scoped lang="scss">
    .switch-wap{
        width: 100%;
        height: 0.24rem;
        display: flex;
        margin: 0.05rem 0;
        .switch-content{
            flex: 1;
            margin: 0 0.1rem;
        }
    }
</style>
