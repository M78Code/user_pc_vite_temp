/*
 * @Author: ty-rise 
 * @Date: 2023-10-21 06:05:15 
 * @Last Modified by: ty-rise
 * @Last Modified time: 2023-10-Sa 06:06:46
 */
<template>
    <div class="main-wrap flex">
        <!--  返回按鈕  -->
        <slot name="menu-left">
            <div class="goback-icon-wrapper column justify-center" @click="router.back()">
                <div class="img" :style="compute_css_obj('menu-go-back-icon')"></div>
            </div>
        </slot>
       <div v-show="false"> {{MenuData.update_time}} </div> 
        <div class="main-menu-container">
            <template v-for="(item, index) in menu_list" :key="lodash_.get(item, 'code')">
                <div class="m-menu-item" :class="{ current: lodash_.get(item, 'mi') == MenuData.current_lv_1_menu_mi }">
                    <span class="i-title" @click="set_menu_lv1(item, index)">
                        {{ i18n_t("new_menu." + lodash_.get(item, 'mi')) || lodash_.get(item, 'mi') }}
                    </span>
                </div>
            </template>
        </div>
        <div class="main-menu-right">
            ￥{{ format_money2(UserCtr.balance) }}
        </div>
    </div>
</template>
<script setup>
import lodash_ from "lodash";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { format_money2 } from "src/core/format/index.js";
import { i18n_t, compute_css_obj, MenuData,UserCtr } from "src/core/index.js";
import { get_sport_menu } from "./top-list";
const router = useRouter();

//一级菜单list
const menu_list = reactive([
    {
        mi:2, // 今日
        code:"today"
    },
    {
        mi:1, //滚球
        code:"play"
    },
    {
        mi:3, // 早盘
        code:"early"
    },
    {
        mi:6, //串关
        code:"match_bet"
    },
    {
        mi:400, // 冠军
        code:"champion"
    },
])

/**
 * 点击一级菜单
 * @param {*} item 
 * @param {*} index 
 * @param {*} type 
 */
const set_menu_lv1 = item => {
    MenuData.set_current_lv1_menu(item);
}

/**
 * 初始化数据
 */

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