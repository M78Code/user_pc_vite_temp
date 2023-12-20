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
import { ref, nextTick, onUnmounted, watch } from "vue";
import { theme_list, theme_map } from "src/core/theme/"
import UserCtr from "src/core/user-config/user-ctr.js"
import { lang } from "src/base-h5/mixin/userctr";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MenuData,useMittEmit,MITT_TYPES} from "src/output/index.js";
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
/**
 * 首页switch wap
 */
const switchData = [
    {
        defaultVal: 0,
        list: [
            {
                name: "专业版",
                val: 2,
                changeFun: (val) => {
                    UserCtr.set_standard_edition(2)
                    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
                    // 1 新手版 2 专业版
                    nextTick(() => {
                        VirtualList.set_is_show_ball(true)
                        MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
                    })
                }
            },
            {
                name: "新手版",
                val: 1,
                changeFun: (val) => {
                    UserCtr.set_standard_edition(1)
                    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);

                    nextTick(() => {
                        !MenuData.is_collect() && MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
                    })
                }
            }
        ]
    },
    {
        defaultVal: 0,
        list: [
            {
                name: "热门",
                val: 0,
                isSort: 1,
                changeFun: (val, sort) => {
                    return console.log(`执行热门-${val}-${sort}`)
                }
            },
            {
                name: "时间",
                val: 1,
                isSort: 1,
                changeFun: (val, sort) => {
                    return console.log(`执行时间-${val}-${sort}`)
                }
            }
        ]
    },
    {
        defaultVal: theme_list.findIndex((item) => { return item.is_default === 1; }),
        list: theme_list.map((item) => {
            item.name = item.i18n[lang.value];
            item.val = item.key;
            item.changeFun = (val) => {
                console.log(val)
                return UserCtr.set_theme(val)
            }
            return item;
        }).reverse()
    },
]
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
