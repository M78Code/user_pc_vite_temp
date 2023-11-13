
import { ref, watch } from "vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import BaseData from "src/core/base-data/base-data.js";

const current_menu = ref({});
const mi_100_arr = ref([]);
const menu_mi = ref(1);
const mi_2000_arr = ref([]);
const mi_400_obj = ref([]);
const mi_500_obj = ref([]);
const vr_menu_obj = ref([]);

set_init();
resolve_mew_menu_res();

watch(menu_config.menu_data_version, () => {
    resolve_mew_menu_res();
})

function set_init() {
    let mif = "",
        rootf = "";
    if (menu_config.menu_root == 1) {
        mif = 1;
        rootf = 1;
    } else {
        mif = 400;
        rootf = 400;
    }
    const { mi = mif, root = rootf } = menu_config.mid_menu_result;
    let obj = { mi, root };
    if (menu_config.menu_root == 400) {
        return handle_click_menu_mi_400({ ...obj, guanjun: "guanjun" });
    } else if (menu_config.menu_root == 1) {
        let sports = menu_mi.value == 1 ? "quanbu-gunqiu" : "common";
        console.log("menu_config.menu_root", obj, menu_mi);
        handle_click_menu_mi_1({ ...obj, sports });
    }
}
/**
 *全部 数量计算 滚球
 */
function compute_quanbu_num_mi_1() {
    // 常规的计算
    let num = 0;
    mi_100_arr.value.map((x) => {
        if (x.ct) {
            num += x.ct;
        }
    });
    //这个全部数量，应该只统计常规赛事的数量，不包含电子竞技和虚拟体育，
    //电竞
    // this.mi_2000_arr.map((x) => {
    //   num += x.ct;
    // });

    // vr 的计算
    // vr 数量是固定的
    // num += 19
    // let vr_sl = this.vr_menu_obj || [];
    // let vr_num = 0;
    // vr_sl.map((x) => {
    //   num += x.ct;
    // });
    return num;
}

/**
 * @Description:球种菜单切换  前置检查进程
 */
function handle_click_menu_mi_pre_process() {
    // if (drag_scroll && drag_scroll.is_move()) {
    //   return;
    // }
}

/**
 * 解析菜单数据
 */
function resolve_mew_menu_res() {
    if (menu_config.menu_root == 500) {
        //热门
        resolve_mew_menu_res_mi_500();
    } else if (menu_config.menu_root == 1) {
        //滚球  常规 +电竞
        resolve_mew_menu_res_mi_100_2000();
    } else if (menu_config.menu_root == 400) {
        // 冠军
        resolve_mew_menu_res_mi_400();
    }
}
/**
 * 解析 新接口返回值     常规 +电竞
 */
function resolve_mew_menu_res_mi_100_2000() {
    //过滤常规球类
    let mi_100_list = [];
    let mi_2000_list = [];
    // 遍历 新菜单数据
    BaseData.mew_menu_list_res.map((x) => {
        // 拿到 基础赛种 id
        let mif = 1 * x.mi;
        //常规体育
        if (BaseData.left_menu_base_mi_arr.includes(mif)) {
            // 滚球对象
            let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
            item.mif = mif;
            mi_100_list.push(item);
        }
        //电竞
        if (BaseData.sports_mi.includes(mif)) {
            // 滚球对象
            let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
            item.mif = mif;
            mi_2000_arr.value.push(item);
        }
    });
    //常规体育
    mi_100_arr.value = mi_100_list;
    //电竞
    mi_2000_arr.value = mi_2000_list;
    //  VR  体育的
    vr_menu_obj.value = BaseData.vr_mi_config || [];
}

/**
 * 解析 新接口返回值  热门
 */
function resolve_mew_menu_res_mi_500() {
    mi_500_obj.value = BaseData.mew_menu_list_res.find((x) => x.mi == 500) || {
        sl: [],
    };
}
/**
 * 滚球 全部 euid 计算
 */
function compute_quanbu_euid() {
    //  console.warn('BaseData',BaseData)
    //  console.warn('mi_100_arr',this.mi_100_arr)
    //全部 euid
    let euids = [];
    //全部 csid
    let csids = [];
    // 常规的计算

    mi_100_arr.value.map((x) => {
        let obj = BaseData.mi_info_map[`mi_${x.mi}`] || {};
        euids.push(obj.euid);
    });
    //电竞
    mi_2000_arr.value.map((x) => {
        let obj = BaseData.mi_info_map[`mi_${x.mi}`] || {};
        euids.push(obj.euid);
    });
    euids = euids.filter((item) => item);
    return {
        csids: euids,
        csid: euids.join(","),
        euids: euids,
        euid: euids.join(","),
    };
}
/**
 * 解析 新接口返回值  冠军页面
 */
function resolve_mew_menu_res_mi_400() {
    mi_400_obj.value = BaseData.mew_menu_list_res.find((x) => x.mi == 400) || {
        sl: [],
    };
}
/**
 *全部 数量计算 冠军
  */
function compute_quanbu_num_mi_400() {
    return mi_400_obj.value["ct"];
    //  赛种过滤
    //  return vr_num + changgui_num;
}
/**
 * 冠军赛事的 CSID 计算  ，这里理论上是常规体育冠军
 * 电竞的冠军 和娱乐 目前都是分离的
 *
 * 确保一下冠军 有没有其他球类 例如 电竞等
 */
function compute_mi_400_sl_mi_csid(mi) {
    return parseInt(mi) - 400;
}
/**
 * 单个菜单按钮点击   滚球 的
 */
function handle_click_menu_mi_1(detail = {}) {
    handle_click_menu_mi_pre_process();
    // { mi:'',   root:'',   sports:'',  guanjun:'' }
    let {
        mif,
        mi, //当前的菜单
        root, //root 菜单
        sports,
        menu,
        guanjun,
    } = detail;
    resolve_mew_menu_res_mi_100_2000();
    // 滚球全部关闭的情况下 顺移到下一个
    if (mi == 1 && !GlobalAccessConfig.get_playAllShow()) {
        // resolve_mew_menu_res_mi_100_2000();
        mi = (mi_100_arr.value[0] || {}).mi;
        sports = "common";
    }
    current_menu.value = mi;
    // vr 使用 自定义 mi
    if (root == 300) {
        current_menu.value = menu;
    }
    if (mi != 1) {
        menu_mi.value = mi;
    }
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
    // 是否收藏
    let is_collect = false;
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
    let config = {
        begin_request,
        is_collect,
        route,
        root,
        sports,
        guanjun: guanjun || "",
        match_list,
        bymids,
    };
    // 设置      中间 菜单输出
    menu_config.set_mid_menu_result(params);
    // 设置   请求  列表结构  API 参数的  值
    menu_config.set_match_list_api_config(config);
}
/**
 * 单个菜单按钮点击  冠军的
 */
function handle_click_menu_mi_400(detail = {}) {
    handle_click_menu_mi_pre_process();
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
    // 是否收藏
    let is_collect = false;
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
            guanjun,
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
            guanjun,
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
    // 设置      中间 菜单输出
    menu_config.set_mid_menu_result(params);
    // 设置   请求  列表结构  API 参数的  值
    menu_config.set_match_list_api_config(config);
}

export {
    current_menu,
    mi_100_arr,
    mi_2000_arr,
    mi_400_obj,
    vr_menu_obj,
    menu_mi,
    compute_quanbu_num_mi_1,
    handle_click_menu_mi_400, handle_click_menu_mi_1, compute_mi_400_sl_mi_csid, compute_quanbu_num_mi_400,
}