<template>
    <div class="temp0 mx-5 box-style">
        <div class="item-wrap">
            {{ void (odds_conut = 0) }}
            <div v-for="(item,index_) in item_data.hl" :key="index_">
                <div class="bor-style" :class="{'has-more': !hide_show_more_layout}" v-if="index_>0||index_==0">
                    <template v-if="item_data.title[0]"><!--有title时按照title循环，没有title时按ol循环-->
                        <div v-for="(item2,index_title) in item_data.title" :key="index_title" class="mg-4-bg">
                            <div class="row" v-for="(ol_item ,ol_index) in item.ol" :key="ol_index">
                                <template
                                    v-if=" (hide_show_more_layout || (!hide_show_more_layout && (show_more || (!show_more && ol_index<5))))">
                                    <template
                                        v-if="item2.otd == ol_item.otd && ((odds_conut<show_more_max && !show_more) || show_more)">
                                        {{ void (odds_conut++) }}
                                        <!-- ms就是外层的赛事级别状态 mhs: 0开 2关 1封 11锁 -->
                                        <!-- 开盘or锁盘 正常显示 -->
                                        <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                                            <!-- hs是盘口级别状态: 0开 2关 1封 11锁 -->
                                            <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                                                <!-- os: 1、开盘 2、封盘 3、隐藏不显示，不占地方-->
                                                <template v-if="ol_item.os == 1">
                                                    <!-- 主程序 start -->
                                                    <!-- <div
                                                      class="play-box-style details_color"
                                                      @click="go_to_bet(ol_item)"
                                                      :class="[get_bet_list.includes(ol_item.id_)?'details-bg5':'',{'win':calc_win(ol_item.result),'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}]"
                                                    > -->
                                                    <div
                                                        class="play-box-style details_color"
                                                        @click="go_to_bet(ol_item)"
                                                        :class="[get_bet_list.includes(ol_item.id_)?'details-bg5':'',{'win':true,'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}]"
                                                    >
                                                        <div class="ellipsis remark details_t_color6 fz_13 odds-on">
                                                            <span :class="[{'white_text':get_bet_list.includes(ol_item.id_)}]">
                                                                <!-- {{ol_item.on || ol_item.otv || ol_item.ott}} -->
                                                                <!-- 修改为: ott+on的值 来显示  下面的用法相同 -->
                                                                {{ ol_item.ott }}{{ ol_item.on }}
                                                            </span>
                                                        </div>
                                                        <div class="text-right odds-wrap">
                                                            <odds-new :item_data="item_data" :ol_data="ol_item"></odds-new>
                                                        </div>
                                                    </div>
                                                    <!-- 主程序 end -->
                                                </template>
                                                <template v-if="ol_item.os == 2">
                                                    <!-- lock 锁状态 start -->
                                                    <div class="play-box-style details_color"
                                                         :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                                        <div class="ellipsis remark details_t_color7 fz_13"
                                                             v-show="get_detail_data.csid != 1">
                                                            {{ ol_item.on || ol_item.ott }}
                                                        </div>
                                                        <div class="text-left">
                                                            <img class="icon-lock"
                                                                 :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"/>
                                                        </div>
                                                    </div>
                                                    <!-- lock 锁状态 end -->
                                                </template>
                                                <template v-if="ol_item.os == 3"></template>
                                            </template>
                                            <template v-if="ol_item._hs == 1">
                                                <template v-if="ol_item.os == 3"></template>
                                                <template v-else>
                                                    <!-- lock 锁状态 start -->
                                                    <div class="play-box-style details_color"
                                                         :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                                        <div class="ellipsis remark details_t_color6 fz_14"
                                                             v-show="get_detail_data.csid != 1">
                                                            {{ ol_item.on || ol_item.ott }}
                                                        </div>
                                                        <div class="text-left">
                                                            <img class="icon-lock"
                                                                 :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"/>
                                                        </div>
                                                    </div>
                                                </template>
                                                <!-- lock 锁状态 end -->
                                            </template>
                                            <template v-if="ol_item._hs == 2">
                                                <!-- 盘口级别状态关盘时，要占位 -->
                                                <div class="play-box-style details_color"
                                                     :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                                </div>
                                            </template>
                                        </template>
                                        <!-- 封盘，一把锁的居中显示 -->
                                        <template v-if="ol_item._mhs == 1">
                                            <!-- lock 锁状态 start -->
                                            <div class="play-box-style details_color"
                                                 :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                                <div class="ellipsis remark details_t_color7 fz_13"
                                                     v-show="get_detail_data.csid != 1">{{ ol_item.on || ol_item.ott }}
                                                </div>
                                                <div class="text-left">
                                                    <img class="icon-lock"
                                                         :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"/>
                                                </div>
                                            </div>
                                            <!-- lock 锁状态 end -->
                                        </template>
                                        <!-- 关盘 -->
                                        <template v-if="ol_item._mhs == 2"></template>
                                    </template>
                                </template>
                            </div>
                        </div>
                    </template>
                    <!-- 没有title时按ol循环 -->
                    <template v-if="!item_data.title[0]">
                        <div class="row mg-4-bg" v-for="(ol_item,ol_index) in item.ol" :key="ol_index">
                            <template
                                v-if=" (hide_show_more_layout || (!hide_show_more_layout && (show_more || (!show_more && ol_index<5))))">
                                <template v-if="((odds_conut<show_more_max && !show_more) || show_more)">
                                    {{ void (odds_conut++) }}
                                    <!-- ms: 0开 2关 1封 11锁 -->
                                    <!-- 开盘or锁盘 正常显示 -->
                                    <template v-if="ol_item._mhs == 0 || ol_item._mhs == 11">
                                        <!-- hs: 0开 2关 1封 11锁 -->
                                        <template v-if="ol_item._hs == 0 || ol_item._hs == 11">
                                            <!-- os: 1、开盘 2、封盘 3、隐藏不显示，不占地方-->
                                            <template v-if="ol_item.os == 1">
                                                <!-- 主程序 start -->
                                                <div
                                                    class="play-box-style details_color"
                                                    @click="go_to_bet(ol_item)"
                                                    :class="[get_bet_list.includes(ol_item.id_)?'details-bg5':'',{'win':calc_win(ol_item.result),'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}]"
                                                >
                                                    <div class="ellipsis remark details_t_color6 fz_13">
                        <span class="size-color" :class="[{'white_text':get_bet_list.includes(ol_item.id_)}]">
                          {{ ol_item.ott }}{{ ol_item.on }}
                        </span>
                                                    </div>
                                                    <div class="text-right odds-wrap">
                                                        <odds-new :item_data="item_data" :ol_data="ol_item"></odds-new>
                                                    </div>
                                                </div>
                                                <!-- 主程序 end -->
                                            </template>
                                            <template v-if="ol_item.os == 2">
                                                <!-- lock 锁状态 start -->
                                                <div class="play-box-style details_color"
                                                     :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                                    <div class="ellipsis remark details_t_color7 fz_13"
                                                         v-show="get_detail_data.csid != 1">
                                                        {{ ol_item.on || ol_item.ott }}
                                                    </div>
                                                    <div class="text-left">
                                                        <img class="icon-lock"
                                                             :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"/>
                                                    </div>
                                                </div>
                                                <!-- lock 锁状态 end -->
                                            </template>
                                            <template v-if="ol_item.os == 3"></template>
                                        </template>
                                        <template v-if="ol_item._hs == 1">
                                            <template v-if="ol_item.os == 3"></template>
                                            <template v-else>
                                                <!-- lock 锁状态 start -->
                                                <div class="play-box-style details_color"
                                                     :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                                    <div class="ellipsis remark details_t_color6 fz_14"
                                                         v-show="get_detail_data.csid != 1">
                                                        {{ ol_item.on || ol_item.ott }}
                                                    </div>
                                                    <div class="text-left">
                                                        <img class="icon-lock"
                                                             :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"/>
                                                    </div>
                                                </div>
                                                <!-- lock 锁状态 end -->
                                            </template>
                                        </template>
                                        <template v-if="ol_item._hs == 2">
                                            <!-- 盘口级别状态关盘时，要占位 -->
                                            <div class="play-box-style details_color"
                                                 :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                            </div>
                                        </template>
                                    </template>
                                    <!-- 封盘，一把锁的居中显示 -->
                                    <template v-if="ol_item._mhs == 1">
                                        <!-- lock 锁状态 start -->
                                        <div class="play-box-style details_color"
                                             :class="{'bor-btm':ol_index != item.ol.length-1 || index_ != item_data.hl.length-1}">
                                            <div class="ellipsis remark details_t_color7 fz_13"
                                                 v-show="get_detail_data.csid != 1">{{ ol_item.on || ol_item.ott }}
                                            </div>
                                            <div class="text-left">
                                                <img class="icon-lock"
                                                     :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`"/>
                                            </div>
                                        </div>
                                        <!-- lock 锁状态 end -->
                                    </template>
                                    <!-- 关盘 -->
                                    <template v-if="ol_item._mhs == 2"></template>
                                </template>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <!-- 显示更多 -->
            <div v-if="!hide_show_more_layout" class="show-more play-box-style" :class="{'pack-up': show_more}"
                 @click="change_show">
        <span class="fz_13">{{ show_more ? i18n_t('match_info.pack_up') : i18n_t('match_info.show_more') }}
        </span>
            </div>
        </div>
    </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex";
 
// #TODO mixins
import lodash from "lodash";
import store from "src/store-redux";
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import { LOCAL_PROJECT_FILE_PREFIX,calc_win} from "src/output/index.js";
import {reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, ref} from "vue";
import {useRoute} from "vue-router"
import {i18n_t} from "src/boot/i18n.js";
import BetData from "src/core/bet/class/bet-data-class.js"
import {useMittEmit, MITT_TYPES} from "src/core/mitt"
//国际化


export default defineComponent({
    // #TODO mixins
    // mixins:[odd_convert],
    name: "temp0",
    components: {
        "odds-new": {}
    },
    props: ["item_data", "title"],
    setup(props, evnet) {
        const store_state = store.getState()
        const route = useRoute()
        let data = reactive({
            
            // 最大显示行数
            show_more_max: 5,
            show_more_switch: false,
            // 显示加载更多
            show_more: true,
            len: 0,  //一共有多少个投注项
        })
        // #TODO vuex
        // computed: {
        // ...mapGetters(["get_bet_list","get_cur_odd","get_detail_data"]),
        const get_bet_list = ref(BetData.bet_list)
        const get_cur_odd = computed(() => {
            return ""
        });
        const get_detail_data = computed(() => {
            return store_state.detailsReducer.details_data || {}
        });
        /**
         * @description: 判断是否隐藏加载更多和收起功能
         */
        const hide_show_more_layout = computed(() => {
            let ret = true;
            let len_hl = lodash.get(props.item_data, 'hl.length');
            let len = 0;
            let len_temp = 0;
            if (len_hl) {
                for (let i = 0; i < len_hl; i++) {
                    len_temp = lodash.get(props.item_data, `hl[${i}].ol.length`)
                    if (len_temp) {
                        len += len_temp;
                    }
                }
            }

            if (!len) {
                len = 0;
            }
            if (len > 10) {
                ret = false;
            } else {
                ret = true;
            }
            return ret;
        });
        onMounted(() => {
            // 根据指定模板,对模板下数据量大的玩法进行折叠处理
            if (props.item_data.hpt == 0) {
                // 获取玩法下的数量
                let len_hl = lodash.get(props.item_data, 'hl.length');
                let len = 0;
                let len_temp = 0;
                if (len_hl) {
                    for (let i = 0; i < len_hl; i++) {
                        len_temp = lodash.get(props.item_data, `hl[${i}].ol.length`)
                        if (len_temp) {
                            len += len_temp;
                        }
                    }
                }
                if (len && len > 10) {
                    data.show_more = false;
                }
                len = len
            }
            ;
        })
        /**
          *@description: 判断首位是否是数字
          *@param {String} 投注项值
          *@return {boolean}
          */
        const is_number = (val) => {
            const reg = new RegExp(/^[0-9]/);
            return reg.test(val)
        };
        /**
         *@description 0号模板点击收起的时候，要调整滚动距离
         *@return {Undefined} undefined
         */
        const change_show = () => {
            if (data.show_more) {
                let distance = (data.len - 5) * rem(0.52)
                if (route.name == 'virtual_sports_details') {
                    document.documentElement.scrollTop -= distance
                } else {
                    // #TODO emit
                    useMittEmit(MITT_TYPES.EMIT_SET_DETAILDS_SCROLL, distance)
                }
            }
            data.show_more = !data.show_more
        };
        return {
            ...toRefs(data),
            get_bet_list,
            get_cur_odd,
            get_detail_data,
            i18n_t,
            is_number,
            change_show,
            hide_show_more_layout,
            LOCAL_PROJECT_FILE_PREFIX,
            calc_win
        }
    }
})
</script>

<style lang="scss" scoped>
.item-wrap {
    min-height: 0.32rem;
    height: auto;
}

.bor-style {
    border-radius: 4px;
    overflow: hidden;
    padding: 0.08rem;
}

.show-more {
    margin-top: 1px;
    color: var(--q-color-com-fs-color-11);
    align-items: center;
    justify-content: center;
}

.play-box-style {
    width: 100%;
    height: 0.52rem;
    line-height: 0.52rem;
    padding: 0 0.15rem;
    display: flex;
    font-size: 0.12rem;
    justify-content: center;
}

.remark {
    flex: 1;
    letter-spacing: 0;
}

.odds-wrap {
    width: 0.55rem;
}

.lock-style {
    width: 100%;
    height: 0.3rem;
    line-height: 0.3rem;
    border-radius: 0.02rem;
    padding: 0 0.1rem;
    text-align: center;
    display: block;
}

.icon-lock {
    width: 0.16rem;
    height: 0.16rem;
    vertical-align: middle;
}
</style>