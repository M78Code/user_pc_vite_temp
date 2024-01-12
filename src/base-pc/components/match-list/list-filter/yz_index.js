
import { onUnmounted, reactive, ref, watch } from "vue";
import lodash_ from "lodash"
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import MenuData from "src/core/menu-pc-yazhou/menu-data-class.js";
import BaseData from "src/core/base-data/base-data.js";
import { functions } from "lodash";
import { api_match_list,api_common } from "src/api/index.js";
import PageSourceData from "src/core/page-source/page-source.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { IS_FOR_NEIBU_TEST,BUILD_VERSION } = BUILDIN_CONFIG ;

const current_menu = ref({});
const mi_100_arr = ref([]);
const menu_mi = ref(1);
const mi_2000_arr = ref([]);
const mi_400_obj = ref([]);
const mi_500_obj = ref([]);
const vr_menu_obj = ref([]);

const ref_data = reactive({
    time_out_1:null,
    time_out_ :null,
    time_type:1,
    time_list: [],
    time_count:0,
}) 

// resolve_mew_menu_res();

// watch(MenuData.menu_data_version, () => {
//         resolve_mew_menu_res();
// })

// onUnmounted(()=>{
//     clearInterval(ref_data.time_out_1)
//     clearInterval(ref_data.time_out_)

//     ref_data.time_out_ = null
//     ref_data.time_out_1 = null
// })

function un_mounted() {
    clearInterval(ref_data.time_out_1)
    clearInterval(ref_data.time_out_)

    ref_data.time_out_ = null
    ref_data.time_out_1 = null
}

/**
 *全部 数量计算 滚球
 */
function compute_quanbu_num_mi_1() {
    // 常规的计算
    let num = 0;
    MenuData.in_play_list.map((x) => {
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
 *全部 数量计算 冠军
  */
function compute_quanbu_num_mi_400() { 
    let num = 0;
    MenuData.kemp_list.map((x) => {
        if (x.ct) {
            num += x.ct;
        }
    });
    return num;
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
        lv1_mi:1
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
        csid: (detail.mi*1 - 400), 
        current_mi: detail.mi,  
        lv1_mi:400
    }
    set_menu_config(obj)
}

function set_menu_config(obj = {}) {
    // 设置 中间 菜单输出
    const obj_config = {
        ...MenuData.mid_menu_result,
        ...obj
    }
    const left_menu_result = {
        lv1_mi: obj.current_mi,
        lv2_mi: "",
        root:obj.lv1_mi
    }
    current_menu.value= obj.current_mi;
    MenuData.set_current_ball_type(obj.csid);
    MenuData.set_left_menu_result(left_menu_result)
    MenuData.set_mid_menu_result(obj_config);
    // 设置   请求  列表结构  API 参数的  值
    // MenuData.set_match_list_api_config(obj);
    // 设置终极菜单id
    MenuData.set_menu_current_mi(obj.current_mi)
    
}

/**
   * @description 获取欧洲版联赛数量统计
   */
const get_ouzhou_leagues_data = async (date, sportId) => {
    const res = await api_match_list.get_leagues_list({
      sportId: sportId ?? (MenuData.current_ball_type ? Number(MenuData.current_ball_type) : 1),
      selectionHour: date
    })
    // console.log('rewrewrwerwerw', res);
    const list = lodash.get(res, 'data', [])
    return list
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
    get_ouzhou_leagues_data,
    un_mounted
}