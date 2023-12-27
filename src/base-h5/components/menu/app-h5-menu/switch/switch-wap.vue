<!--
 * @Author: rise
 * @Date: 2023-10-22 17:03:22
 * @LastEditors: rise
 * @LastEditTime: 2023-10-30 15:44:07
 * @Description:  
-->
<template>
    <div class="switch-wap">
        <div class="switch-content" v-for="(item, index) in switchData" :key="index">
            <SwitchNav :list="item.list" :defaultVal="item.defaultVal" />
        </div>
    </div>
</template>
<script setup>
import SwitchNav from "./switch-nav.vue";
import { ref, computed, onUnmounted, watch, nextTick, onMounted } from "vue";
import { theme_list, theme_map } from "src/core/theme/"
import UserCtr from "src/core/user-config/user-ctr.js"
import { lang } from "src/base-h5/mixin/userctr";
import {  useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import { project_name, MenuData } from "src/output/index.js";
import { set_menu_init,sort_type,standard_edition } from 'src/base-h5/mixin/userctr.js'
import { is_esports } from 'src/base-h5/mixin/menu.js'

/**
 * 首页switch wap
 */
const get_switch_data = () => {
    return [
        {
            defaultVal:UserCtr.standard_edition,
            mark:'standard_edition',
            list:[
                {
                    name:i18n_t('footer_menu.pro_v'),
                    val:1,
                    changeFun:(val)=>{
                        useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
                        UserCtr.set_standard_edition(val)
                        if (project_name === 'app-h5') {
                            nextTick(() => {
                                // !MenuData.is_collect() && MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
                                if (MenuData.is_collect()) {
                                    MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
                                } else {
                                    MatchMeta.clear_match_info()
                                    MatchMeta.set_origin_match_data({})
                                }
                            })
                        }
                    }
                },
                {// 1 新手版
                    name:i18n_t('footer_menu.new_v'),
                    val:1,
                    changeFun:(val)=>{
                        useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
                        nextTick(()=>{
                            UserCtr.set_standard_edition(val)
                            VirtualList.set_is_show_ball(true)
                            if (MenuData.is_collect()) {
                                MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
                            } else {
                                MatchMeta.clear_match_info()
                                MatchMeta.set_origin_match_data({})
                            }
                            // MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
                        })
                    }
                }
            ]
        },
        {
            defaultVal:sort_type,
            mark:'sort_type',
            list:[
                {
                    //热门
                    name:i18n_t('footer_menu.hot'),
                    val:1,
                    isSort:1,
                    disabled:is_esports,
                    changeFun:(val,sort)=>{
                        if(is_esports.value){//电竞 不会热门排序 和 盘口
                            return;
                        }
                        return UserCtr.set_sort_type(val);
                    }
                },
                {
                    //时间
                    name:i18n_t('footer_menu.time'),
                    val:2,
                    isSort:2,
                    changeFun:(val,sort)=>{
                        return UserCtr.set_sort_type(val);
                    }
                }
            ]
        },
        {
            defaultVal: UserCtr.theme,
            mark:'theme',
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
}

const switchData = ref(get_switch_data())

/**
 * @description 监听设置菜单里面 菜单的改变
 * @param {set_menu_init} number
 * @return 
 */
watch(()=>set_menu_init.value,()=>{
    switchData.value = get_switch_data()
    const mark = ['standard_edition','sort_type','theme']
      switchData.value = switchData.value.map((item,index)=>{
        item.defaultVal = UserCtr[mark[index]];
        return item
      })
},{immediate:true,deep:true})

</script>
<style scoped lang="scss">
.switch-wap {
    width: 100%;
    height: 0.24rem;
    display: flex;
    margin: 0.05rem 0;

    .switch-content {
        flex: 1;
        margin: 0 0.1rem;
    }
}
</style>
