/*
 * @Author: ty-rise 
 * @Date: 2023-10-21 06:05:15 
 * @Last Modified by: ty-rise
 * @Last Modified time: 2023-10-Sa 06:06:46
 */
<template>
    <div>
        <div v-show="false">   {{MenuData.update_time}} {{UserCtr.user_version}}</div>
        <!-- 300, -->
        <TopHeader v-if="[2000].includes(+MenuData.top_menu_title.mi )">
            <template #right>
                <div class="main-menu-right" @click.stop="get_user_balance()">
                    <!-- <span class="main-menu-right-symbol">￥</span> -->
                    <img :src="compute_local_project_file_path('/image/svg/home/coin.svg')" alt="" style="margin-right: 4px;">
                    <span class="main-menu-right-money">{{ format_money2(UserCtr.balance) }}</span>
                </div>
            </template>
        </TopHeader>

        <div class="main-wrap flex" v-else>
            <!--  返回按鈕  -->
            <!-- <slot name="menu-left">
                <div class="goback-icon-wrapper column justify-center" @click="router.back()">
                    <img class="img" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/back.svg`" alt="" />
                </div>
            </slot> -->
            <div class="main-menu-container">
                <template v-for="(item, index) in menu_list" :key="lodash_.get(item, 'code')">
                    <div class="m-menu-item" :class="{ current: lodash_.get(item, 'mi') == MenuData.current_lv_1_menu_mi.value }">
                        <span class="i-title" @click="set_menu_lv1(item, index)">
                            {{ i18n_t("new_menu." + lodash_.get(item, 'mi')) || lodash_.get(item, 'mi') }}
                        </span>
                    </div>
                </template>
            </div>
            <div class="main-menu-right" @click.stop="get_user_balance()">
                <!-- <span class="main-menu-right-symbol">￥</span> -->
                <img :src="compute_local_project_file_path('image/svg/home/coin.svg')" alt="" style="margin-right: 4px;">
                <span class="main-menu-right-money">{{ format_money2(UserCtr.balance) }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import lodash_ from "lodash";
import {reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { format_money2 } from "src/output/index.js";
import MatchFold from 'src/core/match-fold'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { i18n_t,  MenuData,UserCtr } from "src/output/index.js";
import { compute_local_project_file_path } from  "src/output/index.js"
import { get_collect_count } from 'src/core/collect/collect-class.js'

import TopHeader from './top-header.vue';

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
    if(item.mi == MenuData.current_lv_1_menu_i)return;
    // 重置折叠对象
    MatchFold.clear_fold_info()
    MatchFold.set_all_csid_fold_status(true)
    MenuData.set_current_lv1_menu(item.mi);
    // MenuData.get_menu_lvmi_list(item.mi)
    // 复刻版早盘，串关需要等待时间接口返回在调用， 在这不调用set_origin_match_data
    // if ([3,6].includes(item.mi) || is_kemp.value) return
    // MatchMeta.set_origin_match_data()
    BetData.set_clear_bet_info()
    BetViewDataClass.set_clear_bet_view_config()
    // 复刻版 只有串关里面可以投注串关 
    // vr 电竞 可以单 可串 数据清空 默认为单
    if(item.mi == 6){
        BetData.set_is_bet_single('serial')
    }else{
        BetData.set_is_bet_single('single')
        get_collect_count()
    }
    if(item.mi == 400){
        //冠军盘口切换欧洲盘
        UserCtr.set_cur_odds("EU");
    }
}

// 获取余额 5s内触发一次
const get_user_balance = _.throttle(() => {
    UserCtr.get_balance()
},5000)

/**
 * 初始化数据
 */
 onMounted(()=>{
    //刷新获取收藏数量
    get_collect_count()
 })
</script>
<style scoped lang="scss">
.main-wrap {
    width: 100%;
    height: 0.44rem;
    display: flex;
    align-items: center;
    color: var(--q-gb-t-c-20);
    padding: 0 0.14rem;
    transition: padding-top 0.3s;
    // position: absolute;
    // top: 0;
    // left: 0;
    z-index: 2;
    background-color: var(--q-gb-bg-c-27);
    &.esport,
    &.is_esports {
        background-color: transparent;
    }

    .goback-icon-wrapper {
        height: 0.14rem;
                height: 0.36rem;
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
        &.is_esports {
            background-color: transparent;
        }

        .m-menu-item {
            font-family: 'PingFang SC';
            flex: 1;
            max-width: 0.44rem;
            position: relative;
            height: 0.2rem;
            // display: flex;
            text-align: center;
            font-size: 0.14rem;
            color: var(--q-gb-t-c-19);
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
}
.main-menu-right {
        z-index: 0;
        height: 0.22rem;
        line-height: 0.22rem;
        border-radius: 25px;
        float: right;
        background: var(--q-gb-bg-c-18);
        color: var(--q-gb-t-c-20);
        text-align: center;
        display: flex;
        align-items: center;
        padding: 0 0.1rem 0 0.03rem;
        .main-menu-right-symbol{
            font-family: 'ky-font';
            font-style: normal;
            font-weight: 600;
        }
        .main-menu-right-money{
            font-family: 'ky-font';
            font-size: 15px;
            letter-spacing: 0.5px;
            font-style: normal;
            font-weight: 700;
            flex: 1;
            line-height: 0.26rem;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color: var(--q-gb-t-c-18);
        }
    }
</style>