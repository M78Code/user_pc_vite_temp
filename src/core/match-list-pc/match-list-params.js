import { MenuData, GlobalAccessConfig, UserCtr, useMittEmit, MITT_TYPES, t } from 'src/core/index.js'
import filterHeader from "src/core/filter-header/filter-header.js";
import BaseData from "src/core/base-data/base-data.js";


//请求 参数的说明
//     begin_request:
//       "是否发起请求 默认 true ，如果有联赛层级的菜单需要在联赛点击 ,赛种点击不生效。也就是中间列表 如果存在多层菜单，非最终一层菜单点击是不发起请求的",
//     is_collect: "是否是收藏模式 ，布尔值",
//     route: "detail 常规详情页面 , list 常规列表页  ",
//     root: "  1 滚球 , 2 今日  , 3  早盘 ,  500 热门赛事 , 400 冠军  , 300 VR , 电竞 2000   ",
//     sports:
//       "hot-jingzu  热门 竟足 50101  , hot-saishi 热门   赛事 50199  ,  hot-liansai  热门 联赛 ,  quanbu-gunqiu  全部滚球 ,  quanbu-guanjun  全部冠军, dianjing 电竞 , vr 虚拟体育 ,common 常规体育    common-date 常规体育早盘    ",
//     guanjun:
//       "common-guanjun 常规体育菜单下的 冠军玩法 ,  guanjun-common  冠军单页下的常规赛事   dianjing-guanjun 电竞 体育菜单下的 冠军玩法  '' 空 不是冠军",
//     // 列表队列 接口
//     match_list: {
//       api_name: "api 方法名字   api_match 的 子方法名字",
//       params: {},
//     },
//     // bymids 接口  基本参数
//     bymids: {
//       api_name: "api 方法名字   api_match 的 子方法名字",
//       params: {},
//     }
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
        colloet: "post_fetch_collect_list",
        home: "get_home_matches",
    }
}
/**
 * @description 切换列表展示是的收藏还是非收藏
 *
 * @param  {string} type
 * @return {undefined} undefined
 */
function match_list_all_params() {
    // menu_root 一级菜单类型
    // left_menu_result  记录的左侧菜单数据 
    // mid_menu_result 记录的中间菜单数据
    // is_collect 是否收藏
    // menu_current_mi 当前选中的菜单id----终极菜单id 根据此id获取对应的旧菜单id 
    // get_mid_for_euid 通过当前选中的菜单id获取对应的旧菜单id
    const { menu_root, left_menu_result, mid_menu_result, is_collect, get_mid_for_euid, menu_current_mi,current_ball_type } = MenuData
    // mid_menu_mi 中间键 赛种菜单id 
    // md 中间键 时间id
    // tid 中间键 联赛id  // vr体育 下的赛种对应的联赛
    // csid 赛种id  // 电竞 下的赛种id
    let { mid_menu_mi, md, tid, csid } = mid_menu_result || {};
    // lv1_mi 一级 赛种菜单id
    // lv2_mi 二级玩法菜单id 
    let { lv1_mi, lv2_mi } = left_menu_result || {};
    let apiType = 1;
     // 父级euid
    let euid = ''
    let api_name = api_params[menu_root]?.match ||api_params.other.match
    // 前端控制是否禁用收藏功能
    // 前端配置写死，世界杯后删除
    // 前端开    后台开       >开
    // 前端开    后台关       >关
    // 前端关    后台开       >关
    // 前端关    后台关       >关
    const enable_collect_api = window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.ENABLE_COLLECT_API;
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
        api_name = api_params[menu_root] ? api_params[menu_root].colloet : api_params.other.colloet
    }
   
    let config = {
        is_collect,
        root: menu_root,
        match_list: {
            api_name,
            params: {
                "cuid": UserCtr.get_uid() || '',
                "sort": UserCtr.sort_type,
                // "selectionHour": filterHeader.open_select_time, // 需要的自己在下面加
            },
        }
    }
   
    // 当前 pid 和 orpt
    let lv2_mi_info = BaseData.mi_info_map[`mi_${menu_current_mi}`] || {};
    delete lv2_mi_info.h5_euid
    if ([2, 3, 202, 203].includes(Number(menu_root))) {
        // 今日 早盘 常规赛事
        if (lv1_mi == 118) {
            // 娱乐下只有冠军 直接写死
            euid = [3,203].includes(menu_root)  ? '3020212' : '3020112'
        } else {
            euid = get_mid_for_euid(menu_current_mi)
        }
        lv2_mi_info = {
            apiType,
            "orpt": "0",
            "pids": "",
            ...lv2_mi_info,
            euid,
        }
        if ([3,203].includes(menu_root*1)) {
            // 早盘获取选中的时间
            lv2_mi_info.md = md+''
            lv2_mi_info.tid = ''
            lv2_mi_info.orpt ='0'
            // lv2_mi_info.index = index || 0 // 早盘收藏 切换后回到原来的
        }
    } else if (menu_root == 400) {
        // 冠军
        lv2_mi_info = {
            selectionHour: null,
            "sportId": current_ball_type,
            "outrightMatches": 1,
            tid: '',
            "orpt": 18,
        }
    } else if (menu_root == 2000) {
        // 电子竞技
        lv2_mi_info = {
            ...lv2_mi_info,
            "category": 1,
            "csid": csid,
            "collect": 1,
            apiType,
            md,
        }
    } else if (menu_root == 500) {
        // euid = get_mid_for_euid(menu_current_mi)
        // // 没有就重新获取
        // if (!euid) {
        //     // 热门默认赛事
        //     let mi_500_obj = BaseData.mew_menu_list_res.find((x) => x.mi == 500) || {
        //         sl: [],
        //     };
        //     // 热门赛事有值的
        //     let { mi } = mi_500_obj['sl'].find(item => item.ct)
        //     let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
        //     euid = mi_info.euid
        // }
        // 热门赛事
        lv2_mi_info = {
            // ...lv2_mi_info,
            apiType,
            // hotMatches: euid == "30199" ? '1' : '', // 热门赛事 全部/赛事 才是1
            euid:'30199',
            "orpt": '-1',  // 热门赛事 竞足 12，其他-1
            pids: '',
            csid: current_ball_type,
        }
    } else if (menu_root == 1) {
        lv2_mi_info = {
            ...lv2_mi_info,
            apiType,
            euid: get_mid_for_euid(menu_current_mi),
            "orpt": "-1",
            tid: ""
        }
    } else if (menu_root == 300) {
        sports = "vr";
        lv2_mi_info = {
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
    // 收藏点击冠军时，修改orpt为18
    if(menu_current_mi == 30401){
        lv2_mi_info.orpt = '18'
        lv2_mi_info.sportId = ''
        lv2_mi_info.outrightMatches = 1
    }

    lodash.merge(
        config.match_list,
        {
            params: lv2_mi_info
        }
    )
    console.log('asdasbdahsfgbdhfbdf', config);
    return config
}
export function get_collet_match_list_params(){
    return {}
}
//请求 参数的说明
//     begin_request:
//       "是否发起请求 默认 true ，如果有联赛层级的菜单需要在联赛点击 ,赛种点击不生效。也就是中间列表 如果存在多层菜单，非最终一层菜单点击是不发起请求的",
//     is_collect: "是否是收藏模式 ，布尔值",
//     route: "detail 常规详情页面 , list 常规列表页  ",
//     root: "  1 滚球 , 2 今日  , 3  早盘 ,  500 热门赛事 , 400 冠军  , 300 VR , 电竞 2000   ",
//     sports:
//       "hot-jingzu  热门 竟足 50101  , hot-saishi 热门   赛事 50199  ,  hot-liansai  热门 联赛 ,  quanbu-gunqiu  全部滚球 ,  quanbu-guanjun  全部冠军, dianjing 电竞 , vr 虚拟体育 ,common 常规体育    common-date 常规体育早盘    ",
//     guanjun:
//       "common-guanjun 常规体育菜单下的 冠军玩法 ,  guanjun-common  冠军单页下的常规赛事   dianjing-guanjun 电竞 体育菜单下的 冠军玩法  '' 空 不是冠军",
//     // 列表队列 接口
//     match_list: {
//       api_name: "api 方法名字   api_match 的 子方法名字",
//       params: {},
//     },
//     // bymids 接口  基本参数
//     bymids: {
//       api_name: "api 方法名字   api_match 的 子方法名字",
//       params: {},
//     },

function get_match_list_params() {
    //侧菜单的 root 节点   root ：  1 滚球  2 今日   3  早盘   500 热门赛事  400 冠军   300 VR  电竞 2000
    let params = match_list_all_params();
    // MenuData.set_match_list_api_config(params)
    return params
}
export default get_match_list_params