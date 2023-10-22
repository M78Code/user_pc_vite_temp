/*
 * @Author: ty-rise 
 * @Date: 2023-10-21 06:05:15 
 * @Last Modified by: ty-rise
 * @Last Modified time: 2023-10-Sa 06:06:46
 */
<template>
    <div class="main-wrap flex" :class="{ is_export }">
        <!--  返回按鈕  -->
        <slot name="menu-left">
            <div class="goback-icon-wrapper column justify-center" @click="router.back()">
                <div class="img" :style="compute_css('menu-go-back-icon')"></div>
            </div>
        </slot>
        <div class="main-menu-container" :class="{ is_export }">
            <template v-for="(item, index) in menu_list" :key="lodash.get(item, 'mi')">
                <div class="m-menu-item" :class="{ current: lodash.get(item, 'mi') == menu_type, esport: is_export }"
                    v-show="show_dianjing(item, index)">
                    <span class="i-title" @click="set_menu_lv1(item, index)">
                        {{ i18n_t("new_menu." + lodash.get(item, 'mi')) || lodash.get(item, 'mi') }}
                    </span>

                </div>
            </template>
        </div>
        <div class="main-menu-right">
            ￥{{ format_money2(user_info.balance) }}
        </div>
    </div>
</template>
<script setup>
import lodash from "lodash";
import { ref, watch } from "vue";
import base_data from "src/core/base-data/base-data.js";
import { useRouter,useRoute } from "vue-router";
import { format_money2 } from "src/core/format/index.js";
import { i18n_t, compute_css, MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js";
import { update_time, is_export, menu_type } from 'src/base-h5/mixin/menu.js';
import { user_info } from "src/base-h5/mixin/userctr";
import { get_sport_menu } from "./top-list";
const router = useRouter();
const route = useRoute();
let menu_list = ref([]);//一级菜单list
/**
 * 点击一级菜单
 * @param {*} item 
 * @param {*} index 
 * @param {*} type 
 */
const set_menu_lv1 = (item, index, type = "click") => {
    MenuData.set_current_lv1_menu(item, index);
//     if (MenuData.is_scroll_ball(item.mi)) {
//     //滚球第一个是全部
//     if (type == "click") {
//       //表示点击的是全部
//       MenuData.set_current_lv2_menu(item.sl, -1, type);
//     } else {
//       MenuData.set_current_lv2_menu(item.sl[0], 0, type);
//     }
//   } else if (MenuData.is_results(item.mi)) {// "赛果",
//   } else if (MenuData.is_vr(item.mi)) {// "VR",
//     router.push({
//       name: "virtual_sports",
//       query: {
//         from: route.name,
//       },
//     });
//   } else {
//     if (item.sl && item.sl[0]) {
//       MenuData.set_current_lv2_menu(item.sl[0], 0, type);
//     }
//   }
}

/**
 * 判断后台是否展示 VR / 电竞  原逻辑
 * @param {*} item 
 * @param {*} index 
 */
const show_dianjing = (item, index) => {
    if (MenuData.is_export(item.mi)) return base_data.is_mi_2000_open; // 电竞tob后台关闭隐藏
    if (MenuData.is_vr(item.mi)) return base_data.is_mi_300_open; // VRtob后台关闭隐藏
    return ![2, 3, 6, 7].includes(index);
};

watch(update_time, (v) => {
    const [menu_lv1] = get_sport_menu(MenuData.menu_list)
    menu_list.value = menu_lv1; //一级
});

</script>
<style scoped lang="scss">
.main-wrap {
    width: 100%;
    height: 0.44rem;
    display: flex;
    align-items: center;
    color: #414655;
    padding: 0 0.05rem;
    transition: padding-top 0.3s;
    // position: absolute;
    // top: 0;
    // left: 0;
    z-index: 2;

    &.esport,
    &.is_export {
        background-color: transparent;
    }

    .goback-icon-wrapper {
        height: 0.14rem;
        padding-left: 0.15rem;

        .img {
            width: 0.08rem;
            height: 0.14rem;
            background-size: cover;
            opacity: .6;
        }
    }

    .goback-icon-wrapper2 {
        visibility: hidden;
    }

    .main-menu-container {
        flex: 1;
        height: 0.27rem;
        line-height: 1;
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-radius: 0 0 0.05rem 0.05rem;
        padding-top: 1px;
        padding-right: 0.04rem;
        width: 60%;
        overflow: hidden;
        overflow-x: auto;
        //   margin-left: 0.15rem;

        &.esport,
        &.is_export {
            background-color: transparent;
        }

        .m-menu-item {
            flex: 1;
            max-width: 0.5rem;
            position: relative;
            height: 0.2rem;
            font-size: 0.16rem;
            display: flex;
            justify-content: center;
            font-size: 14px;
            color: var(--q-gb-t-c-4);
            &.current {
                .i-title {
                    font-weight: 500;
                    font-size: 18px;
                    color: var(--q-gb-t-c-1);

                    &:after {
                        content: " ";
                        position: absolute;
                        /* right: 0.03rem; */
                        width: 0.22rem;
                        height: 0.03rem;
                        border-radius: 0.015rem;
                        display: block;
                        left: 50%;
                        transform: translateX(-50%);
                        // background-color: #ffb001;
                    }
                }

                .m-menu-count {
                    font-weight: bold;
                }

                //   &.esport {

                //     .i-title,
                //     .m-menu-count {
                //       color: #ffffff;
                //     }
                //   }
            }

            .i-title {
                text-overflow: ellipsis;
                white-space: nowrap;
                //overflow: hidden;
                line-height: 0.2rem;
                position: relative;
            }

            &.main_menu_407 {
                &.is_favorite {
                    visibility: hidden;
                }
            }

            &.main_menu_410 {
                margin-right: 0;
                position: relative;
                left: 0.06rem;
            }

            .m-menu-count {
                width: 0.14rem;
                height: 0.18rem;
                position: relative;
                top: -0.04rem;
                left: 0.01rem;
                padding-left: 0.02rem;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;

                .count {
                    font-size: 0.11rem;

                    &.is_unit {
                        min-width: 15px;
                        text-align: center;
                    }
                }
            }

            // &.current {

            //   .i-title,
            //   .m-menu-count {
            //     font-weight: bold;
            //   }

            //   &.esport {

            //     .i-title,
            //     .m-menu-count {
            //       color: #ffffff;
            //     }
            //   }
            // }

            .dir-triangle {
                width: 0;
                height: 0;
                border-left: 0.04rem solid transparent;
                border-right: 0.04rem solid transparent;
                margin-top: 0.03rem;
                transition: transform 0.3s;
                position: absolute;
                top: 0.1rem;
                left: 0.03rem;

                &.open {
                    transform: rotateZ(180deg);
                }

                &.arrow_esport {
                    border-top: 0.04rem solid #fff;
                }
            }
        }
    }

    .main-menu-right {
        width: 0.87rem;
        height: 0.22rem;
        line-height: 0.22rem;
        border-radius: 25px;
        background: var(--q-gb-bg-c-10);
        color: var(--q-gb-bd-c-2);
        text-align: center;
        margin-right: 0.14rem;
    }

    .activity-logo {
        display: block;
        width: 0.4rem;
        height: 0.3rem;
        margin: 0 0.1rem 0 0;
        border: none;
        position: relative;
        left: -0.05rem;
    }

    .red-dot {
        width: 0.05rem;
        height: 0.05rem;
        border-radius: 50%;
        background: #b11e33;
        position: absolute;
        right: 0.42rem;
        top: 0.06rem;
    }
}</style>