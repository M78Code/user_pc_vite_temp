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
            <div class="mask" v-if="is_show_mask"></div>
        </div>
    </div>
</template>
<script setup>
import SwitchNav from "./switch-nav.vue";
import { ref, computed, onUnmounted, watch, nextTick, onMounted } from "vue";
import { theme_list, theme_map } from "src/core/theme/"
import UserCtr from "src/core/user-config/user-ctr.js"
import { lang } from "src/base-h5/mixin/userctr";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list' 
import { project_name, MenuData } from "src/output/index.js";
import { set_menu_init,sort_type,standard_edition } from 'src/base-h5/mixin/userctr.js'
import { is_esports } from 'src/base-h5/mixin/menu.js'
import MatchFold from 'src/core/match-fold/index.js'
import { api_account } from "src/api/index.js";

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
                    val:2,
                    changeFun:(val)=> handler_version_change(2)
                },
                {// 1 新手版
                    name:i18n_t('footer_menu.new_v'),
                    val:1,
                    changeFun:(val)=> handler_version_change(1)
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
                    changeFun: (val) => handler_sort_change(1)
                },
                {
                    //时间
                    name:i18n_t('footer_menu.time'),
                    val:2,
                    isSort:2,
                    changeFun: (val) => handler_sort_change(2)
                }
            ]
        },
        {
            defaultVal: UserCtr.theme || theme_list.find(n=>{return n.is_default === 1}).key,
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
!UserCtr.theme && UserCtr.set_theme(theme_list.find(n=>{return n.is_default === 1}).key)
const switchData = ref(get_switch_data())

const emitters = ref({})
const is_show_mask = ref(false)

// 版本切换
const handler_version_change = (val = 2) => {
    change_is_show_mask(true)
    useMittEmit(MITT_TYPES.EMIT_SHOW_SKELETON_DIAGRAM, true)
    UserCtr.set_standard_edition(val)
    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
    // MatchFold.clear_fold_info()
    let timer = setTimeout(() => {
        VirtualList.set_is_show_ball(true)
        MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
        clearTimeout(timer)
        timer = null
        // if (MenuData.is_collect()) {
        //     MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
        // } else {
        //     MatchMeta.clear_match_info()
        //     MatchMeta.set_origin_match_data({})
        // }
        // MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
    }, 350)
    reset_is_show_mask()
}

// 排序切换
const handler_sort_change = async(val) => {
    //电竞 不会热门排序 和 盘口
    if(val === 1 && is_esports.value) return;
    change_is_show_mask(true)
    const param = {
        sort: val
    }
    UserCtr.set_sort_type(val);
    reset_is_show_mask()
    api_account.get_remember_select(param)
}

// 是否显示蒙层
const change_is_show_mask = (val) => {
    is_show_mask.value = val
}

// 遮罩层兜底
const reset_is_show_mask = lodash.debounce(() => {
    change_is_show_mask(false)
}, 8000)

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


onMounted(() => {
    emitters.value = {
        emitter: useMittOn(MITT_TYPES.EMIT_IS_SHOW_MASK, (val) => change_is_show_mask(val)).off,
    }
})

onUnmounted(() => {
    Object.values(emitters.value).map((x) => x());
})

</script>
<style scoped lang="scss">
.switch-wap {
    width: 100%;
    // height: 0.24rem;
    display: flex;
    padding: 0.05rem 0;
    background-color: var(--q-gb-bg-c-27);
    .switch-content {
        flex: 1;
        position: relative;
        margin: 0 0.1rem;
        .mask{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.25rem;
            background: var(--q-gb-bd-c-5);
            opacity: 0.6;
        }
    }

}
</style>
