
import { ref, watch } from "vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
import BaseData from "src/core/base-data/base-data.js";

const current_menu = ref({});
const mi_100_arr = ref([]);
const menu_mi = ref(1);
const mi_2000_arr = ref([]);
const mi_400_obj = ref([]);
const mi_500_obj = ref([]);
const vr_menu_obj = ref([]);

resolve_mew_menu_res();

watch(MenuData.menu_data_version, () => {
    resolve_mew_menu_res();
})

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
    if (MenuData.menu_root == 500) {
        //热门
        resolve_mew_menu_res_mi_500();
    } else if (MenuData.menu_root == 1) {
        //滚球  常规 +电竞
        resolve_mew_menu_res_mi_100_2000();
    } else if (MenuData.menu_root == 400) {
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
    let obj = {
        // 当前赛种 菜单id
        mid_menu_mi: detail.mi,  
        // 当前菜单的赛种id
        csid: (detail.mif*1 - 100), 
        current_mi: detail.mi,  
    } 
    set_menu_config(obj)
}
/**
 * 单个菜单按钮点击  冠军的
 */
function handle_click_menu_mi_400(detail = {}) {
    let obj = {
        // 当前赛种 菜单id
        mid_menu_mi: detail.mi,  
        // 当前菜单的赛种id
        csid: (detail.mif*1 - 400), 
        current_mi: detail.mi,  
    }
    set_menu_config(obj)
}

function set_menu_config(obj = {}) {
    console.error('asdad')
    // 设置 中间 菜单输出
    MenuData.set_mid_menu_result(obj);
    // 设置   请求  列表结构  API 参数的  值
    // MenuData.set_match_list_api_config(obj);
    // 设置终极菜单id
    MenuData.set_menu_current_mi(obj.current_mi)
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