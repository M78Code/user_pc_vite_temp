import { MenuData, GlobalAccessConfig, UserCtr, useMittEmit, MITT_TYPES, t, BaseData } from 'src/core/index.js'
import filterHeader from "src/core/filter-header/filter-header.js";

/**
 * 早盘接口逻辑参数请求
 */
function match_list_today_params() {
    let base_params = {
        cuid: UserCtr.get_uid(),
        selectionHour: null,
        sort: 1,
    }
    //设置当前的root
    // root = MenuData.menu_root
    // euid  早盘今日  玩法级别 传参 传 euid 为 父级的
    // 今日 早盘

    const { lv1_mi, lv2_mi, menu_root } = MenuData.left_menu_result
    let api_name = 'post_league_list'
    if ([1, 2, 3].includes(Number(menu_root))) {
        if (lv1_mi == 118) {
            euid = '3020212'
        }
        base_params = {
            apiType: 1,
            orpt: -1,
            ...base_params,
            ...params,
            md,
        }
    }
    if (menu_root == 2000) {
        api_name = 'post_fetch_esports_matchs'
        base_params = {
            tid: "",
            ...base_params,
            ...params,
            category: 1,
            csid: ('' + lv2_mi).substring(1),
            md
        }
        // 电竞 日期冠军 
        if (md == 100) {
            base_params.category = 1
            base_params.md = ''
        }
    }

    match_list = {
        api_name,
        params: {
            ...base_params,
            index: final_index.value, // 当前选中的时间 接口用不上 只是存储下一使用
        },
    };

    return {
        begin_request: true,
        is_collect,
        route,
        root,
        sports,
        guanjun,
        match_list,
        bymids,
    };
}
/**
 * vr 请求参数
*/
function match_list_vr_params() {
    const { menu_root } = MenuData.left_menu_result
    const { csid, tid } = MenuData.mid_menu_result
    return {
        begin_request: true,
        is_collect: false,
        route: "list",
        root: menu_root,
        sports: "vr",
        guanjun: "",
        match_list: {
            api_name: "post_fetch_virtual_matchs",
            params: {
                csid,
                selectionHour: null,
                tid,
            },
        },
        bymids: {},
    }
}
/**
 * @description 切换列表展示是的收藏还是非收藏
 *
 * @param  {string} type
 * @return {undefined} undefined
 */
function match_list_all_params() {
    let { lv2_mi, lv1_mi, jinri_zaopan, menu_root, guanjun } = MenuData.left_menu_result;
    let { mid_menu_result, match_list_api_config, is_collect } = MenuData
    const enable_collect_api = window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.ENABLE_COLLECT_API;
    let apiType = 1
    const api_params = {
        2000: {
            match: "post_fetch_esports_matchs",
            colloet: "post_collect_list_es"
        },  //
        400: {
            match: "post_champion_list",
            colloet: "post_fetch_collect_list"
        },
        1: {
            match: "post_fetch_match_list",
            colloet: "post_fetch_collect_list"
        },
        500: {
            match: "post_fetch_match_list",
            colloet: "post_fetch_collect_list"
        },
        other: {
            match: "post_league_list",
            colloet: "post_fetch_collect_list"
        }
    }
    let api_name = api_params.other.match
    if ([1, 500, 300, 400, 2000].includes(Number(menu_root))) {
        api_name = api_params[menu_root]?.match
    }
    // type === "collect"
    if (is_collect) {
        // 前端开    后台开       >开
        // 前端开    后台关       >关
        // 前端关    后台开       >关
        // 前端关    后台关       >关
        if (!enable_collect_api || !GlobalAccessConfig.get_collectSwitch()) {
            return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("msg.msg_09"));
        }
        apiType = 2
        api_name = api_params.other.colloet
        if ([1, 500, 300, 2000].includes(Number(root))) {
            api_name = api_params[root].colloet
        }
    }
    // 调用列表接口
    // 当前 pid 和 orpt
    let lv2_mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`];
    // 父级euid
    let euid;
    if ([2, 3].includes(Number(menu_root))) {
        // 今日 早盘 常规赛事
        if (lv1_mi == 118) {
            // 娱乐下只有冠军 直接写死
            euid = root == 3 ? '3020212' : '3020112'
        } else {
            euid = BaseData.mi_info_map[`mi_${lv1_mi}${jinri_zaopan}`].euid
        }
        lv2_mi_info = {
            apiType,
            "orpt": "0",
            "pids": "",
            ...lv2_mi_info,
            euid,
        }
        if (root == 3) {
            // 早盘获取选中的时间
            let { match_list: { params: { md, index } } } = match_list_api_config
            lv2_mi_info.md = md
            lv2_mi_info.index = index || 0 // 早盘收藏 切换后回到原来的
        }
    } else if (menu_root == 400) {
        guanjun = "guanjun"
        // 冠军
        lv2_mi_info = {
            ...lv2_mi_info,
            apiType,
            "sportId": (1 * mid_menu_result.mi - 400) || '',
            "outrightMatches": 1,
            "orpt": 18,
        }
    } else if (menu_root == 2000) {
        // 电子竞技
        let dianjing_sublist = BaseData.dianjing_sublist
        let current_menu = dianjing_sublist.find(item => item.mi == lv2_mi) || {}
        lv2_mi_info = {
            ...lv2_mi_info,
            "category": 1,
            "csid": current_menu.csid,
            "collect": 1,
            apiType,
            md: (match_list_api_config.match_list || {}).params.md,
        }
    } else if (menu_root == 500) {
        euid = mid_menu_result.euid
        // 没有就重新获取
        if (!mid_menu_result.euid) {
            // 热门默认赛事
            let mi_500_obj = BaseData.mew_menu_list_res.find((x) => x.mi == 500) || {
                sl: [],
            };
            // 热门赛事有值的
            let { mi } = mi_500_obj['sl'].find(item => item.ct)
            let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
            euid = mi_info.euid
        }
        // 热门赛事
        lv2_mi_info = {
            ...lv2_mi_info,
            apiType,
            hotMatches: euid == "30199" ? '1' : '', // 热门赛事 全部/赛事 才是1
            euid,
            "orpt": euid == "30101" ? '12' : '-1',  // 热门赛事 竞足 12，其他-1
            pids: euid == "30101" ? -999 : '',
        }
    } else if (root == 1) {
        // 滚球赛事
        let { mid_menu_result } = menu_config
        lv2_mi_info = {
            ...lv2_mi_info,
            apiType,
            euid: mid_menu_result.euid,
            "orpt": "-1",
            tid: ""
        }
    }
    let config = {
        begin_request: true,
        is_collect,
        route: "list",
        root: "",
        sports: "",
        guanjun,  // 常规赛种下 冠军
        match_list: {
            api_name,
            params: {
                "cuid": UserCtr.get_uid() || '',
                "sort": UserCtr.sort_type,
                "selectionHour": filterHeader.open_select_time,
                ...lv2_mi_info,
            },
        }
    }
    return config
}

/**
 * @description 热门菜单请求参数
 *
 */
function match_list_hot_params(mi) {
    let guanjun = "";
    let sports = "";
    let route = "list";
    // is_collect是否收藏
    let { mid_menu_result, is_collect } = MenuData
    let { mi, } = mid_menu_result
    // 列表队列 接口
    let match_list = {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
    };
    // bymids 接口  基本参数
    let bymids = {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
    };
    let base_params = {
        cuid: UserCtr.get_uid(),
        // selectionHour: this.$store.state.filter.open_select_time,
        sort: UserCtr.sort_type, //this.vx_match_sort,
        apiType: 1,
        orpt: -1,
    };
    if (mi == 50101) {
        //hot-jingzu  热门 竟足 50101
        sports = "hot-jingzu";
        match_list = {
            api_name: "post_fetch_match_list",
            params: {
                ...base_params,
                euid: "30101",
                pids: -999,
                orpt: 12,
            },
        };
    } else if (mi == 50199) {
        //  hot-saishi 热门   赛事 50199
        sports = "hot-saishi";
        match_list = {
            api_name: "post_fetch_match_list",
            params: {
                ...base_params,
                euid: "30199",
                orpt: -1,
            },
        };
    } else {
        //hot-liansai  热门 联赛
        sports = "hot-liansai";
        let c_euid = "";
        let api_name = "post_fetch_match_list";
        if (mi.length > 10) {
            // mi大于10为 是电竞
            api_name = "post_fetch_esports_matchs";
            match_list = {
                api_name,
                params: {
                    ...base_params,
                },
            };
        } else {
            //常规联赛原菜单ID：301+联赛ID、新菜单：502+菜单ID；电竞联赛原菜单：30+联赛ID、新菜单ID：联赛ID
            if (mi.startsWith("502")) {
                // 旧菜单ID还有有个规则：301+联赛ID 如果长度是10位，则菜单ID为101+联赛ID 后端逻辑
                let prefix = mi.length == 10 ? "101" : "301";
                c_euid = prefix + mi.substring(3);
            } else {
                c_euid = "30" + mi;
            }
            params.euid = c_euid;
            match_list = {
                api_name,
                params: {
                    ...base_params,
                    euid: c_euid,
                    tid: "",
                    // orpt: '0',
                },
            };
        }
    }
    let config = {
        begin_request: true,
        is_collect,
        route,
        root,
        sports,
        guanjun,
        match_list,
        bymids,
    };
    // 设置   请求  列表结构  API 参数的  值
    return config
}
//常规体育
function matc_list_common_params(detail) {
    // 是否收藏

    let { mid_menu_result, is_collect } = MenuData
    // let { mi, } = mid_menu_result
    let {
        mi, //当前的菜单
        root, //root 菜单
        sports,
        guanjun,
    } = detail;
    let route = "list";
    let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
    current_menu.value = mi;
    let params = {
        ...detail,
        mi,
    };
    let base_params = {
        cuid: UserCtr.get_cuid(),
        selectionHour: null,
        sort: GlobalAccessConfig.get_sortCut(),
        apiType: 1,
        orpt: -1,
        orpt: 18,
        sportId: "",
    };
    // 列表队列 接口
    let match_list = {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
    };
    // bymids 接口  基本参数
    let bymids = {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
    };
    //冠军   全部
    if (mi == 400) {
        // 全部
        params = {
            mi: 400,
            sportId: "",
            orpt: 18,
            cuid: UserCtr.get_cuid(),
            selectionHour: null,
            apiType: 1,
            sort: GlobalAccessConfig.get_sortCut(),
        };
        // 冠军全部后端没有做过滤 前端进行过滤处理
        // let sportId = this.mi_400_obj['sl'].map(item=> (1 * item.mi - 400)) || []
        // // 当前有冠军赛事的赛种id集合
        // params.sportId = sportId.join(',')
        // 注释上面代码 前端增加对应球种参数，返回的结果排序是乱的 后端为冠军全部做赛事过滤
        match_list = {
            api_name: "post_champion_list",
            params: {
                ...params,
            },
        };
    } else {
        let csid = "" + (1 * mi - 400);
        params = {
            ...mi_info,
            mi,
            csid: "" + (1 * mi - 400), //冠军常规体育类型的 菜单计算覆写
            orpt: 18,
            root: 400,
        };
        match_list = {
            api_name: "post_champion_list",
            params: {
                ...base_params,
                sportId: csid,
            },
        };
    }
    return {
        begin_request: true,
        is_collect,
        route,
        root,
        sports,
        guanjun,
        match_list,
        bymids,
    };;
}

/**
 * 单个菜单按钮点击 滚球 的
 */
function handle_click_menu_mi_1(detail = {}) {
    handle_click_menu_mi_pre_process();
    // { mi:'',   root:'',   sports:'',  guanjun:'' }
    // let {
    //     mif,
    //     mi, //当前的菜单
    //     root, //root 菜单
    //     sports,
    //     menu,
    //     guanjun,
    // } = detail;
    let { mid_menu_result,menu_root, is_collect } = MenuData
    // resolve_mew_menu_res_mi_100_2000();
    // // 滚球全部关闭的情况下 顺移到下一个
    // if (mi == 1 && !GlobalAccessConfig.get_playAllShow()) {
    //     // resolve_mew_menu_res_mi_100_2000();
    //     mi = (mi_100_arr.value[0] || {}).mi;
    //     sports = "common";
    // }
 
    let route = "list";
    let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
    //     请求  列表结构  API 参数的   模板
    let params = {};
    let obj = {};
    //全部
    if (GlobalAccessConfig.get_playAllShow()) {
        obj = compute_quanbu_euid();
    } else {
        BaseData.mi_info_map[`mi_${mi}`] || {};
    }
    //滚球
    if (mi == 1) {
        params = {
            csid: obj.csid,
            quanbu: obj,
            mi: 1,
            is_quanbu: 1,
            euid: obj.euid,
            root, //root 菜单
            sports,
            route,
            guanjun: "",
        };
    } else {
        params = {
            ...mi_info,
            root, //root 菜单
            sports,
            route,
            mi,
            mif,
            guanjun: "",
        };
    }
    //发起请求
    let begin_request = true;
    // 列表队列 接口
    let match_list = {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
    };
    // bymids 接口  基本参数
    let bymids = {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
    };
    //基础参数
    let base_params = {
        cuid: UserCtr.get_cuid(),
        selectionHour: null,
        sort: GlobalAccessConfig.get_sortCut(),
        apiType: 1,
        orpt: -1,
        tid: "",
    };
    if (sports == "quanbu-gunqiu") {
        //滚球    全部
        match_list = {
            api_name: "post_fetch_match_list",
            params: {
                ...base_params,
                euid: obj.euid,
            },
        };
    } else if (sports == "common") {
        //滚球    常规体育
        match_list = {
            api_name: "post_fetch_match_list",
            params: {
                ...base_params,
                apiType: 1,
                orpt: -1,
                euid: mi_info.euid,
            },
        };
    } else if (sports == "dianjing") {
        //滚球    电竞
        match_list = {
            api_name: "post_fetch_esports_play_matchs",
            params: {
                ...base_params,
                category: 1,
                csid: ("" + mif).substring(1),
                isLive: 1,
            },
        };
    } else if (sports == "vr") {
        //滚球    虚拟体育
        let vr_obj = BaseData.vr_mi_config.find((item) => mi == item.menuId) || {};
        let vr_tid = vr_obj.subList[0].field1 || "";
        match_list = {
            api_name: "post_fetch_virtual_matchs",
            params: {
                csid: vr_obj.menuId,
                isLive: 1,
                selectionHour: null,
                tid: vr_tid,
            },
        };
    }
        // 设置      中间 菜单输出
        menu_config.set_mid_menu_result(params);

    return {
        begin_request,
        is_collect,
        route,
        root,
        sports,
        guanjun: guanjun || "",
        match_list,
        bymids,
    };
}
function get_match_list() {
    // MenuData.set_match_list_api_config(config);
}
export {
    match_list_today_params, match_list_all_params
}
export default get_match_list