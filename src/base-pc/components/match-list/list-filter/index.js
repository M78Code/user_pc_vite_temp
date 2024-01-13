
import { onUnmounted, reactive, ref, watch } from "vue";
import lodash_ from "lodash"
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
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
    // console.error('resolve_mew_menu_res')

    if(MenuData.is_top_events()){
        resolve_mew_menu_res_mi_5000()
    }else if (MenuData.menu_root == 500) {
        //热门
        resolve_mew_menu_res_mi_500();
    } else if ([1,301].includes(MenuData.menu_root*1) || ([2,3].includes(MenuData.menu_root) && MenuData.is_collect*1)) {
        let type = 1
        if(MenuData.is_collect){
            if( MenuData.mid_menu_result.filter_tab  == 3002){
                type = 2
            }
            if( MenuData.mid_menu_result.filter_tab  == 3003){
                type = 3
            }
            if( MenuData.mid_menu_result.filter_tab  == 3004){
                resolve_mew_menu_res_mi_400()
            }
        }
        ref_data.time_type = type
        //滚球  常规 +电竞
        resolve_mew_menu_res_mi_100_2000(type);
    } else if (MenuData.menu_root == 400) {
        // 冠军
        resolve_mew_menu_res_mi_400();
    }
}
function resolve_mew_menu_res_mi_5000() {
    let mi_5000_list = {};
    let mi_5000_all = []
    // 热门赛种
    mi_5000_list = BaseData.mew_menu_list_res.find(item => item.mi == 5000) || {}
    // top _events 
    mi_5000_all = mi_5000_list.sl || [];
    let mi_5_list = []
    mi_5000_all.forEach(item => {
        if(!IS_FOR_NEIBU_TEST){
            let csid_ = [5001,5002]
            if(csid_.includes(item.mi*1)){
                item.mif = (item.mi - 5000 + 100)
                mi_5_list.push(item)
            }
        }else{
            item.mif = (item.mi - 5000 + 100)
            mi_5_list.push(item) 
        }
    })
    mi_100_arr.value = mi_5_list
}

/**
 * 解析 新接口返回值     常规 +电竞
 */
async function resolve_mew_menu_res_mi_100_2000(type) {
    //过滤常规球类
    let mi_100_list = [];
    let mi_2000_list = [];
    let mew_menu_list_res = lodash_.cloneDeep(BaseData.mew_menu_list_res)
    // 遍历 新菜单数据
    mew_menu_list_res.map((x) => {
        // 拿到 基础赛种 id
        let mif = 1 * x.mi;
        //常规体育
        if (BaseData.left_menu_base_mi_arr.includes(mif)) {
            // 滚球对象
            let item = (x["sl"] || []).find((y) => y.mi == `${mif}${type}`) || {};
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
    // 收藏
    if(MenuData.is_collect){
        ref_data.time_list = lodash_.cloneDeep(mi_100_list)
        mi_100_list = await get_menu_of_favorite_count(mi_100_list,type)
    }
   
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


// 收藏切换获取最新的赛种数量数据
async function  get_menu_of_favorite_count(list,type) {
    return list
    let euid_list = ''
    // 获取对应的旧菜单id    
    list.forEach(item =>{
        euid_list += MenuData.get_mid_for_euid(item.mi) + ','
        item.ct = 0
    })
  
    clearInterval(ref_data.time_out_)
    clearInterval(ref_data.time_out_1)

      ref_data.time_out_ = null
    ref_data.time_out_1 = null

    let type_ = {
        1:1,
        2:3,
        3:4,
        400:100,
    }
    let parmas = {
        //20001 冠军 的收藏id 传固定的
        euid: type == 400 ? 20001 : euid_list,
        //排序	 int 类型 1 按热门排序 2 按时间排序
        sort: 1,
        //1：滚球，2：即将开赛，3：今日赛事，4：早盘，100：冠军
        type: type_[type], 
        cuid: UserCtr.get_cuid(),
    }
    try{
        // const { code,data } = await api_common.get_collect_menu_count_pc(parmas)
        // ref_data.time_count = 0
        // if(code == 200){
        //     let collect_list = data || []
           
        //     list = list.map(item=>{
        //         item.ct = 0
        //         collect_list.forEach(obj=>{
        //             if(obj.sportId){
        //                 if(type == 400){
        //                     if(item.mi == (type + obj.sportId*1)){
        //                         item.ct = obj.count
        //                     }
        //                 }else{
        //                     if(item.mi == (100 + obj.sportId*1)+''+type){
        //                         item.ct = obj.count
        //                     }
        //                 }
        //             }
        //         })
        //         return item
        //     })
        // }
        // mi_100_arr.value = list

        // ref_data.time_out_ = setInterval(()=>{
        //     if(MenuData.is_collect){
        //         get_menu_of_favorite_count(ref_data.time_list,ref_data.time_type)
        //     }else{
        //         clearInterval(ref_data.time_out_)
        //     }
            
        // },5000)
       
        return list
    } catch(error){
        ref_data.time_count += 1
        mi_100_arr.value = list
        ref_data.time_out_1 = setInterval(()=>{
            if(MenuData.is_collect && ref_data.time_count < 3){
                get_menu_of_favorite_count(ref_data.time_list,ref_data.time_type)
            }else{
                clearInterval(ref_data.time_out_)
            }
           
        },5000)
      
        return list
    }
}

/**
 * 解析 新接口返回值  冠军页面
 */
function resolve_mew_menu_res_mi_400() {
    let mew_menu_list_res = lodash_.cloneDeep(BaseData.mew_menu_list_res)
    let mi_400_obj = mew_menu_list_res.find((x) => x.mi == 400) || {
        sl: [],
    };
    let mi_400_arr = mi_400_obj.sl.filter( item=>{
        item.mif = item.mi*1 - 400 + 100
        return item
    })
    // 后期删除 
    if(!IS_FOR_NEIBU_TEST){
        let csid_ = BaseData.left_menu_base_mi_arr;
        mi_400_arr = mi_400_arr.filter( item=>csid_.includes(+item.mif))
    }
   
    mi_400_obj.value = mi_400_arr

    // 收藏
    if(MenuData.is_collect){
        ref_data.time_list = lodash_.cloneDeep(mi_400_arr)
        ref_data.time_type = 400
        mi_100_arr.value = get_menu_of_favorite_count(mi_400_arr,400)
    }

    mi_100_arr.value = mi_400_arr
   
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
    console.error('detail',detail)
    let obj = {
        // 当前赛种 菜单id
        mid_menu_mi: detail.mi,  
        // 当前菜单的赛种id
        csid: (detail.mi*1 - 100), 
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
        csid: (detail.mi*1 - 400), 
        current_mi: detail.mi,  
    }
    set_menu_config(obj)
}

function set_menu_config(obj = {}) {
    // 设置 中间 菜单输出
    const obj_config = {
        ...MenuData.mid_menu_result,
        ...obj
    }
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
    resolve_mew_menu_res,
    compute_quanbu_num_mi_1,
    handle_click_menu_mi_400, handle_click_menu_mi_1, compute_mi_400_sl_mi_csid, compute_quanbu_num_mi_400,
    get_ouzhou_leagues_data,
    un_mounted
}