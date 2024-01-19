<template>
    <div class="filter-container">
        <div class="header">
            <div class="title">
                今日
            </div>
            <div class="right">
                <div class="search">
                    <input type="text" class="search-input" placeholder="搜索" />
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/search.svg`" alt="" class="search-icon" />
                </div>
                <!-- 选择联赛 -->
                <div class="chose-league">
                    <span>选择联赛</span>
                    <span class="active">全部</span>
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/arrow.svg`" alt="" class="arrow active" />
                </div>
                <!-- 刷新 -->
                <div class="refreh-container">
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/refresh_header.svg`" alt=""
                        :class="['refresh-icon', loading ? 'rotate-ani' : '']" @click="on_refresh" />
                </div>
            </div>
        </div>
        <div class="scroll-container">
            <scroll-list>
                <div class="content">

                    <ul>
                        <li v-for="(item, i) in  data.list_data" :key="i"
                            :class="['item', i == data.list_data.length - 1 ? 'border-none' : '']">
                            <div class="item-header">
                                <check_icon @change_checked="(status) => handle_select(i)" :is_checked="item.status" />
                                <span class="title">{{ item.introduction }}</span>
                            </div>
                            <ul class="child">
                                <li class="child-item" v-for="(e, index) in item.sportVOs" :key="index">
                                    <ul class="flex">
                                        <li v-for="(_current, _index) in e.tournamentList" :key="_index"
                                            class="flex mt-16  items-center w-25 children">
                                            <check_icon @change_checked="(status) => handle_select(i, index, _index)" class="mr-6"
                                                :is_checked="_current.status" />
                                            <span class="mr-6 name-text">{{ _current.nameText }}</span>
                                            <span class="mr-6 active">{{ _current.num }}</span>
                                        </li>
                                    </ul>

                                </li>
                            </ul>
                        </li>
                    </ul>

                </div>
            </scroll-list>
            <div class="footer">
                <div class="checked-all-container">
                    <check_icon @change_checked="handle_checked_all" class="mr-6" :is_checked="data.all_select" />
                    <p class="select-all-text">选择全部赛事</p>
                </div>
                <ul class="btn-group">
                    <li class="submit">确定</li>
                    <li class="close">关闭</li>
                </ul>
                <div></div>
            </div>
        </div>
       
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import { api_filter, api_match } from "src/api/index.js";
import { LOCAL_PROJECT_FILE_PREFIX, MenuData } from "src/output/index.js"
import get_match_list_params from "src/core/match-list-pc/match-list-params.js";
import { UserCtr } from "src/output/index.js";
import check_icon from "./checked.vue";
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';

const data = reactive({
    total: null, //赛事总数
    total_league: null,
    is_active: false, //确认按钮是否激活
    all_filter_list: [],//筛选全部数据
    filter_list: [],//筛选数据
    all_select: false,// 是否全选
    load_data_state: "loading",//数据加载状态
    search_filter_data: "data",//数据加载状态
    is_suck_down: false,//确定按钮是否低吸
    hot_real_list: [], // 真正的热门数据
    un_hot_list: [], // 所有的非热门数据
    list_data: [] //接口返回数据
})

const loading = ref(false);

// 筛选的tid
const tid = computed(() => {
    if (data.list_data.length == 0) return [];
    const res = data.list_data.reduce((p, c) => {
        //大模块选择，子模块全选
        if (c.status) {
            p = p.concat(c.sportVOs.reduce((p1, c1) => {
                const current = c1.tournamentList.map(e => {
                    return e.id
                })
                return [...p1, ...current];
            },[])) 
        }else {
            // 子模块选择
           p = p.concat(c.sportVOs.reduce((p1, c1) => {
                const current = c1.tournamentList.reduce((p2, c2) => {
                    if (c2.status) {
                        p2 = [...p2, c2.id]
                    }
                    return p2;
                }, [])
                return [...p1, ...current]
            })) 
        }
        return p;
    }, [])
    return [...new Set(res)];
})


watch(tid, (value)=> {
    console.log(value, "values===");
})


function handle_checked_all() {
    data.all_select = !data.all_select;
    data.list_data = (res.data || []).map(e => {
        e.status = data.all_select;
        e.sportVOs = (e.sportVOs || []).map(p => {
            p.tournamentList = (p.tournamentList || []).map(q => ({ ...q, status: data.all_select }))
            return p;
        })
        return e;
    });
}

/**
 * 
 * @param {number} parent 最外层
 * @param {number} child  子级
 * @param {number} current 第三层
 */
function handle_select(parent, child, current) {
    console.log(parent, child, current);
    if (child && current) {

    }else {
        data.list_data = data.list_data.map((e, i) => {
            if (i == parent) {
                e.status =  !e.status ;
                e.sportVOs = (e.sportVOs || []).map(p => {
                    p.tournamentList = (p.tournamentList || []).map(q => ({ ...q, status: e.status }))
                    return p;
                })
            }
            
            return e;
        })
    }
}

async function submit() {
    // {
    //  "apiType":1,
    //  "cuid":"331188967994322944",
    //  "euid":"3020101",
    //  "orpt":"0",
    //  "pids":"",
    //  "sort":1,
    //  "tid":"1682748478869187623,1682748470622372141",
    //  "selectionHour":null
    // }
    // 热门
    // apiType: 1
    // cuid: "331188967994322944"
    // euid: "3020101"
    // orpt: "0"
    // pids: ""
    // selectionHour: null
    // sort: 1
    // tid: "217,535,1682748478869187623,1682748470622372141"
    const match_list_params = get_match_list_params();
    const current_params = match_list_params.match_list.params;
    // https://api-c.sportxxx1zx.com/yewu11/v2/w/structureTournamentMatchesPB

    // 不知道干啥的 https://api-c.sportxxx1zx.com/yewu11/v1/w/collectMatchesPB
    // 参数 {"matchType":0,"cuid":"331188967994322944"}
    const collect_matches_PB_params = {
        matchType: 0
    };
    // 不知道干啥的 https://api-c.sportxxx1zx.com/yewu11/v1/w/structureMatchBaseInfoByMidsPB
    // mids 获取路径位置
    // 参数 {"mids":"3050464,3050470,3050476","cuid":"331188967994322944","euid":"3020101","orpt":"0","sort":1,"pids":"","cos":0}
    let params = {
      // 接口类型 1非收藏  2收藏
      apiType: 1,
      // 用户ID
      cuid: UserCtr.get_uid(),
      // 菜单ID
      euid: current_params.euid,
      // 设置当前列表模板编号
      orpt: current_params.orpt,
      // 玩法ID
      pids: "",
      // 列表排序类型
      sort: 1,
      // 联赛筛选
      tid: tid.value.join(","),
      //即将开赛筛选
      selectionHour: null,
    }
    try {
        const res = await api_filter.structure_tournament_matches_PB(params)
    } catch (error) {
        
    }
}

async function init() {
    console.log(get_match_list_params(), "MenuData__");
    // const params = {
    //   // 29 是代表 赛果里边的 我的投注的选项  筛选type入参 1滚球 3今日 4早盘 滚球走index_old.vue
    //   type: MenuData.is_results(m_type) && get_curr_sub_menu_type.value == 29 ? '29' : MenuData.menu_id_map(type.value),
    //   euid: MenuData.is_jinzu(m_type) ? m_id : MenuData.get_euid(MenuData.get_current_sub_menuid()), // menuType 30竞足
    //   inputText: props.search_val,
    //   cuid: UserCtr.get_uid(),
    //   device: 'v2_h5',
    //   md: lodash.get(MenuData.current_lv_3_menu, 'field1')
    // };
    const params = get_match_list_params();
    try {
        // getFilterMatchListPB?
        // euid=3020101&
        // uuid=b9dd89606b9c4a6580479711d38ac73d&
        // pids=& 非滚球传 玩法ID
        // orpt=0& 获得当前的模板ID
        // t=1705459483196
        // https://api.lkjklkyi.com/yewu11/v1/m/getFilterMatchListPB?euid=3020101&uuid=1dd4b62fd28247fb9d1179f128cbfb11&orpt=0&pids=
        // https://api.f0sxv4zi.com/yewu11/v1/w/getFilterMatchListPB?euid=3020101&uuid=1dd4b62fd28247fb9d1179f128cbfb11&pids=&orpt=0
        console.log(params.match_list.params, "params");
        const current_params = params.match_list.params;
        const res = await api_match.get_filter_match_list_pb({
            euid: current_params.euid,
            uuid: UserCtr.get_uid(),
            orpt: current_params.orpt,
            pids: current_params.pids,
            // inputText: "",
            // cuid: current_params.cuid,

        });
        data.list_data = (res.data || []).map(e => {
            e.status = true;
            e.sportVOs = (e.sportVOs || []).map(p => {
                p.tournamentList = (p.tournamentList || []).map(q => ({ ...q, status: true }))
                return p;
            })
            return e;
        });
        console.log(res, "结果");
    } catch (error) {
        console.log(error, "errors");
    }
}

onMounted(() => {
    init();
})
</script>

<style lang="scss" scoped>
:deep(.router_scroll_layout) {
    width: 100%;
}

:deep(.v-scroll-content) {
    height: 100%;
}

.filter-container {
    height: 100%;
    position: relative;
    display: flex;
    width: 99.3%;
    flex-direction: column;
    .scroll-container {
        padding-bottom: 80px;
        flex: 1;
        background: #F6F9FF;
        /* 全局白框区投影效果 */
        box-shadow: 0px 2px 8px 0px #E2E2E4;
        margin-top: 5px;
        border-radius: 6px;
        border: 2px solid #FFF;
    }
    .header {
        // position: absolute;
        // margin-right: 10px;
        top: 0;
        display: flex;
        // width: 100%;
        height: 40px;
        padding: 0px 20px;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        border-radius: 6px;
        border: 2px solid #FFF;
        background: #F6F9FF;
        box-shadow: 0px 0px 12px 0px rgba(39, 39, 39, 0.16);

        .title {
            font-weight: 600;
            font-size: 14px;
        }

        .right {
            display: flex;
            align-items: center;

            .search {
                display: flex;
                width: 180px;
                height: 24px;
                padding: 0px 12px;
                align-items: center;
                flex-shrink: 0;
                border-radius: 40px;
                background: #FFF;

                .search-input {
                    flex: 1;
                    height: 100%;
                    border: none;

                    &:focus {
                        border: none !important;
                        outline: none;
                    }
                }

                .search-icon {
                    width: 14px;
                    height: 14px;
                }
            }

            .chose-league {
                margin-left: 8px;
                display: flex;
                min-width: 106px;
                height: 24px;
                justify-content: center;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
                border-radius: 10000px;
                border: 1px solid #179CFF;
                background: #FFF;

                .arrow {
                    width: 10px;
                    height: 10px;

                }
            }

            .refreh-container {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: #fff;
                margin-left: 6px;
                display: flex;
                align-items: center;
                justify-content: center;

                .refresh-icon {
                    width: 16px;
                    height: 16px;
                }
            }

            .rotate-ani {
                transition: 10s linear;
                transform: rotate(3600deg);
            }
        }
    }

    .content {
        width: 100%;
        display: flex;
        padding: 20px 20px 50px 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 80px;
       
       

        ul {
            width: 100%;
        }

        .item {
            padding: 10px 0 45px;
            border-bottom: 0.5px solid var(---DEE4F2, #DEE4F2);

            .item-header {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-size: 500;

                .title {
                    margin-left: 6px;
                }

                .child-item {
                    font-size: 12px;


                }
            }

            .children {
                overflow: hidden;
                text-overflow: ellipsis;
                flex-wrap: nowrap;
            }

            .name-text {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }

    .footer {
        display: flex;
        align-items: center;
        padding-left: 20px;
        justify-content: space-between;
        .checked-all-container {
            display: flex;
            align-items: center;
        }
        .select-all-text {
            color: #555;
            font-size: 14px;
            margin-left: 6px;
        }
        .btn-group {
            display: flex;
            align-items: center;
            font-size: 14px;
            
            .submit {
                display: flex;
                width: 200px;
                height: 35px;
                justify-content: center;
                align-items: center;
                border-radius: 10000px;
                background: #179CFF;
                color: #FFF;
                box-shadow: 0px 2px 2px 0px rgba(24, 81, 130, 0.12);
            }

            .close {
                margin-left: 40px;
                display: flex;
                width: 200px;
                height: 35px;
                justify-content: center;
                align-items: center;
                border-radius: 35px;
                border: 0.5px solid #D7E1FD;
                background: linear-gradient(180deg, #E5EDFE 0%, #F7FAFF 53.65%, #F6F9FF 100%);
                box-shadow: 0px 2px 2px 0px rgba(24, 81, 130, 0.12);
            }
        }
    }
}

.border-none {
    border-width: 0px !important;
}

.active {
    color: #179CFF;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.w-25 {
    width: 25%;
}

.mr-6 {
    margin-right: 6px;
}

.mt-16 {
    margin-top: 16px;
}
</style>