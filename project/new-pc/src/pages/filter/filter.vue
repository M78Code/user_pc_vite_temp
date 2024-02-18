<!--
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 联赛筛选页面
-->

<template>
    <div class="filter-content" :class="is_suck_down && 'suck_down'" id="filter-content" @click.stop>
        <load-data :state="load_data_state" class="full-height">
            <v-scroll-area :observer_area="1" ref="v_scroll">
                <template v-slot:header>
                    <!-- 列表头 -->
                    <list-header @filter_league_data="filter_league_data" :is_show_input="true"
                        load_type="filter"></list-header>
                </template>
                <!-- 筛选数据 -->
                <div class="filter-list no-data" v-if="search_filter_data == 'empty'">
                    <load-data :state="search_filter_data" class="full-height"></load-data>
                </div>
                <div class="filter-list" v-for="(item, index) in filter_list" :key="index" v-show="item.id">
                    <template v-for="(sportVO, i) in item.sportVOs" :key="`-${i}`">
                        <div class="filter-title" >
                            <div @click.stop="group_click(sportVO)" class="yb-flex-center cursor-pointer">
                                <fliter-checkbox :checked="sportVO.select" />
                                <div class="country-name">{{ is_play ? sportVO.nameText : item.introduction }}</div>
                            </div>
                        </div>

                        <div class="filter-item-content"  >
                            <div class="filter-item cursor-pointer" :class="items.select && 'active'"
                                v-for="(items, i_) in sportVO.tournamentList" :key="`items_${index}_${i}_${i_}`"
                                @click.stop="redio_checked(items)">
                                <fliter-checkbox :checked="items.select" />
                                <div class="filter-item-title ellipsis" v-tooltip="{ content: items.nameText, overflow: 1 }">
                                    {{ items.nameText }}</div>
                                <div class="filter-item-num">{{ items.num }}</div>
                            </div>
                        </div>
                    </template>
                </div>
                <load-callback @onload="set_botton_top" />
                <div class="botton-box" v-if="!is_suck_down">
                    <!-- 选择全部赛事 -->
                    <div class="cursor-pointer width140" @click.stop="all_click()">
                        <fliter-checkbox :checked="all_select" />
                        <div class="country-name">{{ i18n_t('common.match_checked_all') }}</div>
                        <div class="all-count">{{ total }}</div>
                    </div>
                    <div class="col yb-flex-center">
                        <!-- 确定 -->
                        <div class="btn btn1 btn3" :class="!is_active && 'dis'" @click="ok_click()"
                            :id="DOM_ID_SHOW && `but-enter-filter`">{{ i18n_t('common.confirm') }}</div>
                        <!-- 关闭 -->
                        <div class="btn btn2" @click="colse_filter" :id="DOM_ID_SHOW && `but-close-filter`">
                            {{ i18n_t('common.close') }}</div>
                    </div>
                    <div class="width140"></div>
                </div>
            </v-scroll-area>
            <div class="botton-box suck_down" v-if="is_suck_down">
                <!-- 选择全部联赛 -->
                <div class="cursor-pointer width140 border1" @click.stop="all_click()">
                    <fliter-checkbox :checked="all_select" />
                    <div class="country-name">{{ i18n_t('common.match_checked_all') }}</div>
                    <div class="all-count">{{ total }}</div>
                </div>
                <div class="col yb-flex-center">
                    <!-- 确定 -->
                    <div class="btn btn1 btn3" :class="!is_active && 'dis'" @click="ok_click()"
                        :id="DOM_ID_SHOW && `but-enter-filter`">{{ i18n_t('common.confirm') }}</div>
                    <!-- 关闭 -->
                    <div class="btn btn2" @click="colse_filter" :id="DOM_ID_SHOW && `but-close-filter`">
                        {{ i18n_t('common.close') }}</div>
                </div>
                <div class="width140 border1"></div>
            </div>
        </load-data>
    </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted, watch,nextTick } from "vue";
// import { api_filter } from "src/api/index";
// import global_mixin from "src/core/global/mixin/global_mixin.js"; 需替换
// import { mapGetters, mapActions } from "vuex"; 需替换
// import LoadData from "src/public/components/load_data/load_data.vue";
import vScrollArea from "src/base-pc/components/v-scroll-area/v-scroll-area.vue";
//赛事总数
const total = ref()
const total_league = ref()
//确认按钮是否激活
const is_active = ref(false)
//筛选全部数据
const all_filter_list = ref([])
//筛选数据
const filter_list = ref([])
//是否全选
const all_select = ref(false)
//数据加载状态
const load_data_state = ref("loading")
//数据加载状态
const search_filter_data = ref("data")
//确定按钮是否低吸
const is_suck_down = ref(false)

//       mounted(){
//         this.$emit('onload')
//       }
//   created () {
//     // 显示部分dom ID
//     this.DOM_ID_SHOW =  window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.DOM_ID_SHOW;
//   },

//   computed: {
//     ...mapGetters({
//       //当前菜单类型
//       vx_cur_menu_type: "get_cur_menu_type",
//       //用户id
//       get_uuid: "get_uuid",
//       //是否显示联赛筛选框
//       vx_get_show_filter_popup: "get_show_filter_popup",
//       //选择的筛选数据
//       vx_get_filter_select_obj: "get_filter_select_obj",
//       //全局点击事件
//       get_global_click:'get_global_click',
//       vx_get_checked_count: "get_checked_count",
//       //上次的联赛筛选信息
//       vx_get_pre_filter_select_obj:"get_pre_filter_select_obj",
//       //筛选是否全选
//       vx_filter_checked_all: "get_filter_checked_all",
//        //上次的筛选是否全选
//       vx_pre_filter_checked_all: "get_pre_filter_checked_all",
//     }),
//     // 是否滚球
//     is_play(){
//       let { sportId, euid } = $menu.match_list_api_params
//       let type_name = this.vx_cur_menu_type.type_name
//       if(type_name == 'play' || (type_name == 'winner_top' && sportId == '') || (type_name == 'hot' && euid == 30199)){
//         return true
//       }else{
//         return false
//       }
//     }
//   },

//   methods: {
// ...mapActions({
//   //设置是否显示联赛筛选框
//   vx_set_show_filter_popup: "set_show_filter_popup",
//   //设置选择的筛选数据
//   vx_set_filter_select_obj: "set_filter_select_obj",
//   //设置是否全选
//   set_filter_checked_all: "set_filter_checked_all",
//   // 获取选中的赛事数量(列表右上角赛选功能)
//   vx_set_checked_count: "set_checked_count",

// }),
/**
 *  @Description:模糊匹配联赛数据
 */
const filter_league_data = (text) => {
    //去除所有空格
    text = text.replace(/^\s+|\s+$/g, "");
    if (text) {
        let arr = []
          all_filter_list.value.forEach(item1 => {
            if (item1.sportVOs) {
                let obj = { ...item1 }
                let arr1 = []
                item1.sportVOs.forEach(item2 => {
                    if (item2.tournamentList) {
                        let arr2 = item2.tournamentList.filter(item3 => item3.nameText.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) != -1)
                        if (arr2.length > 0) {
                            let obj1 = { ...item2 }
                            obj1.tournamentList = arr2
                            arr1.push(obj1)
                        }
                    }
                })
                if (arr1.length > 0) {
                    obj.sportVOs = [...arr1]
                    arr.push(obj)
                }
            }
        });
        filter_list.value = arr
    } else {
        filter_list.value = [...all_filter_list.value]
    }
    this.compute_league_count(filter_list.value, 1)
}

/**
* @Description:计算联赛数量
*
*/
const compute_league_count = (list, type) => {
    let total = 0;
    let checked_count = 0;
    total_league.value = 0
    //初始化item是否选中
    list.forEach(item => {
        item.select = false;
        if (!item.sportVOs || !item.sportVOs.length) return
        item.sportVOs.forEach(item2 => {
            item2.select = false
            if (!item2.tournamentList || !item2.tournamentList.length) return
            if (type != 1) {
                total_league.value += item2.tournamentList.length;
            }
            item2.tournamentList.forEach(item3 => {
                if (this.vx_get_filter_select_obj.includes(item3.tournamentId.toString())) {
                    item3.select = true;
                    if (checked_count >= 0) {
                        checked_count += 1;
                    }
                } else {
                    item3.select = false;
                }
                total += item3.num * 1;
            });
        });
    });
    this.vx_set_checked_count(checked_count);
    this.set_filter_checked_all(total_league.value == checked_count)
    total.value = total;
    if (list.length > 0) {
        this.load_data_state = "data";
        if (type == 1) {
            this.search_filter_data = 'data'
        }
        this.set_is_active();
    } else {
        if (type == 1) {
            this.search_filter_data = 'empty'
        } else if (type == 2) {
            this.load_data_state = "api_limited";
        } else {
            this.load_data_state = "empty";
        }

    }
}
/**
 * 关闭联赛筛选
 *
 */
const colse_filter = () => {
    //还原全选状态
    if (this.vx_pre_filter_checked_all || this.vx_get_pre_filter_select_obj.length == 0) {
        this.set_filter_checked_all(this.vx_pre_filter_checked_all);
        // 点击关闭清空选中count
        this.vx_set_checked_count(0);
    } else {
        this.vx_set_checked_count(this.vx_get_pre_filter_select_obj.length);
    }
    //关闭筛选层
    this.vx_set_show_filter_popup(false)
}
/**
 * @Description:获取联赛筛选数据
 * @param {object} res 接口返回的数据
 * @return {array} 赛筛选数据
 */
const get_filter_list = (res) => {
    let list = _.get(res, 'data.data') || []
    // 如果是滚球  并且有热门联赛
    if (this.is_play && _.get(list, '[0].id') == 0) {
        let hot = list.splice(0, 1);
        let hot_tournamentList = []
        _.each(hot[0].sportVOs, item => {
            _.each(item.tournamentList, item2 => {
                hot_tournamentList.push(item2)
            })
        })
        if (hot_tournamentList.length > 0 && list[0]) {
            let hot_obj = {
                id: hot[0].id,
                nameText: hot[0].introduction,
                select: hot[0].select,
                tournamentList: hot_tournamentList
            }
            if (list[0].sportVOs) {
                list[0].sportVOs.unshift(hot_obj)
            } else {
                list[0].sportVOs = [
                    hot_obj
                ]
            }
        }
    }

    return list
}

/**
 * @Description:确定筛选
 * @return {undefined} undefined
 */
const ok_click = () => {
    if (!is_active.value) return
    let type_name = this.vx_cur_menu_type.type_name
    // 今日早盘串关 全选的时候 不做筛选
    if (['today', 'early'].includes(type_name) && this.vx_filter_checked_all) {
        this.vx_set_filter_select_obj([]);
        this.vx_set_show_filter_popup(false); //关闭筛选弹层
        return
    }
    let obj_vux = [];
    filter_list.value.forEach(item => {
        if (!item.sportVOs || !item.sportVOs.length) return
        item.sportVOs.forEach(item2 => {
            if (!item2.tournamentList || !item2.tournamentList.length) return
            item2.tournamentList.forEach(item3 => {
                if (item3.select) {
                    obj_vux.push(item3.tournamentId.toString())
                }
            });
        });
    });
    this.vx_set_filter_select_obj(obj_vux);
    this.vx_set_show_filter_popup(false); //关闭筛选弹层
}
/**
 * @Description:选择全部筛选项
 * @return {undefined} undefined
 */
const all_click = () => {
    all_select.value = !all_select.value;
    is_active.value = all_select.value;
    let checked_count = 0;
    filter_list.value.forEach(item => {
        item.select = all_select.value;
        item.sportVOs && item.sportVOs.forEach(item2 => {
            item2.select = all_select.value;
            item2.tournamentList && item2.tournamentList.forEach(item3 => {
                item3.select = all_select.value;
                if (item3.select) {
                    checked_count += 1;
                }
            });
        });
    });
    // 同步选中的联赛数量
    this.vx_set_checked_count(checked_count);
    this.set_filter_checked_all(total_league.value == checked_count)
}
/**
 * @Description:组选项点击
 * @param {object} item2 选择的组对象
 * @return {undefined} undefined
 */
const group_click = (item2) => {
    item2.select = !item2.select
    this.$forceUpdate();
    let checked_count = this.vx_get_checked_count;
    item2.tournamentList.forEach(item3 => {
        if (item3.select && !item2.select && checked_count > 0) {
            checked_count -= 1;
        }
        item3.select = item2.select;
        if (item3.select) {
            checked_count += 1;
        }
    });
    this.set_is_active();
    // 同步选中的联赛数量
    this.vx_set_checked_count(checked_count);
}
/**
 * @Description:单选项点击
 * @param {object} item 选项对象
 * @return {undefined} undefined
 */
const redio_checked = (item) => {
    item.select = !item.select;
    this.$forceUpdate();
    this.set_is_active(item);
}
/**
 * @Description:设置是否已有筛选项选中
 * @return {undefined} undefined
 */
const set_is_active = (obj) => {
    let all_select = true
    let is_active = false
    let checked_count = this.vx_get_checked_count;
    filter_list.value.forEach(item => {
        item.select = false
        if (!item.sportVOs || !item.sportVOs.length) return
        item.sportVOs.forEach(item2 => {
            item2.select = false
            if (!item2.tournamentList || !item2.tournamentList.length) return
            item2.tournamentList.forEach(item3 => {
                if (item3.select) {
                    item.select = true
                    item2.select = true;
                    is_active = true
                    // 增加选中数量
                    if (obj && obj.id == item3.id) {
                        checked_count += 1;
                    }
                } else {
                    all_select = false;
                    // 减少选中数量
                    if (obj && obj.id == item3.id && checked_count > 0) {
                        checked_count -= 1;
                    }
                }
            });
        });
    });
    is_active.value = is_active;
    if (obj) {
        // 同步选中的联赛数量
        if (total_league.value == checked_count) {
            all_select = true
        } else {
            all_select = false
        }
    }
    all_select.value = all_select;
    this.set_filter_checked_all(this.all_select)
    this.vx_set_checked_count(checked_count);
}
/**
 * @Description:请求接口获取联赛筛选数据
 * @return {undefined} undefined
 */
const fetch_filter_match = () => {
    let params = {
        euid: $menu.match_list_api_params.euid,
    };
    let _menu_type_name = this.vx_cur_menu_type.type_name;

    if (["early"].includes(_menu_type_name)) {
        params.md = $menu.match_list_api_params.md
    }

    if (this.get_account && this.get_account.userId) {
        params.userId = this.get_account.userId;
    } else {
        params.uuid = this.get_uuid;
    }
    // 非滚球传 玩法ID
    if (_menu_type_name != "play") {
        params.pids = $menu.match_list_api_params.pids
    }
    // 获得当前的模板ID
    let orpt = $menu.menu_data.match_tpl_number
    if (orpt) {
        params.orpt = orpt;
    }
    let api = api_filter.get_fetch_filter_matchall_filter_list

    // 如果是冠军页面
    if (this.vx_cur_menu_type.type_name == 'winner_top') {
        api = api_filter.get_fetch_filter_match_winner
        let sportId = $menu.match_list_api_params.sportId
        params = {
            sportId,
            cuid: this.get_uuid,
        }
    }
    api(params).then(res => {
        all_filter_list.value = this.get_filter_list(res)
        filter_list.value =  all_filter_list.value
        let type
        if (_.get(res, 'data.code') == '0401038') {
            type = 2
        }
        this.compute_league_count(filter_list.value, type)
    }).catch(err => {
        console.error(err)
        load_data_state.value = "empty";
    });
}
/**
 * @Description:设置确定按钮是否吸低
 * @return {undefined} undefined
 */
const set_botton_top = () => {
    nextTick(() => {
        let content = document.getElementById("filter-content") || {}
        let container = document.querySelector("#filter-content .middle-content") || {};
        if (container.clientHeight > (content.clientHeight - 36)) {
            is_suck_down.value = true
        } else {
            is_suck_down.value = false
        }
    })

}
// watch(()=>{
//    //筛选组件是否显示
//     vx_get_show_filter_popup:{
//       handler(curr) {
//         if (curr === true) {
//           this.fetch_filter_match();
//         }else{
//           this.load_data_state = 'loading'
//         }
//       }
//       immediate: true,
//     }
//     //点击任何地方关闭筛选组件
//     get_global_click(){
//       this.vx_set_show_filter_popup(false)
//     }
  
// })
//   watch: {
//     //筛选组件是否显示
//     vx_get_show_filter_popup:{
//       handler(curr) {
//         if (curr === true) {
//           this.fetch_filter_match();
//         }else{
//           this.load_data_state = 'loading'
//         }
//       },
//       immediate: true,
//     },
//     //点击任何地方关闭筛选组件
//     get_global_click(){
//       this.vx_set_show_filter_popup(false)
//     }
//   }

// };
</script>

<style lang="scss" scoped>
/** 筛选内容 -S*/
.filter-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 503;
    background: #191c24;
    height: 100%;
    color: #99a3b1;

    :deep(.scroll-inner-wrap) {
        padding-bottom: 30px;
    }
}

.v-scroll-area.yb-match-list .filter-content :deep(.q-scrollarea__thumb) {
    right: -10.5px !important;
}

.country-name {
    font-size: 14px;
    color: #fff;
}

.no-data {
    height: 600px;
}

.filter-list {
    padding: 0 20px;

    .filter-title {
        height: 50px;
        display: flex;
        align-items: center;
    }

    .filter-item-content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 8px 0;
        margin-bottom: 20px;

        .filter-item {
            width: 20%;
            height: 30px;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .filter-item-num {
                margin-left: 10px;
                margin-right: 30px;
            }
        }
    }
}

/** 筛选内容 -E*/
.suck_down .filter-list:last-child .filter-item-content:last-child {
    border-bottom: none;
    margin-bottom: 60px;
}

/** 小屏适配 -S*/
@media screen and (max-width: 1650px) {
    .filter-list .filter-item-content .filter-item {
        width: 25%;
    }
}

@media screen and (max-width: 1450px) {
    .filter-list .filter-item-content .filter-item {
        width: 33.33%;
    }
}

/** 小屏适配 -E*/
/** 选择按钮 -S*/
.botton-box {
    padding: 0 20px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 60px;

    &.suck_down {
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .all-count {
        font-size: 14px;
        color: var(--q-gb-t-c-2);
        margin-left: 10px;
    }

    .btn {
        width: 40%;
        max-width: 184px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: var(--q-gb-t-c-1);
        background: var(--q-gb-bg-c-1);
        cursor: pointer;
        margin: 0 10px;
        border-radius: 4px;
    }

    .btn1:hover {
        background: #ffc443;
    }

    .btn.btn2 {
        background-color: #272a33;
        color: #99a3b1;

        &:hover {
            color: #fff;
        }
    }

    .btn.dis {
        background-color: #5a6074;
        color: #99a3b1;

        &:hover {
            background-color: #272a33;
            color: #fff;
        }
    }

    .width140 {
        width: 150px;
        display: flex;
        align-items: center;
    }
}

/** 选择按钮 -E*/</style>
