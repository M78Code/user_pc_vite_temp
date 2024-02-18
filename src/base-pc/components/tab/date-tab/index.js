import { MenuData } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import BaseData from "src/core/base-data/base-data.js";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { ref } from 'vue';
import { api_common } from "src/api/index.js";

const final_index = ref(0) //下划线left
const date_menu_version = ref(1) //日期菜单数据版本
const item_wrap_left = ref(0) //item包裹left
const list = ref([]) //tab模板文件key


// matches日期
const current_filter_list = ref([{label: i18n_t("menu.match_today"),value:""}])

/**
 * 计算 日期 接口 请求参数
*/
const compute_get_date_menu_list_params = () => {
    let params = {};
    let left_menu_result = MenuData.left_menu_result;
    let {
        lv1_mi,
        lv2_mi,
        euid,
        tid = "",
    } = left_menu_result;
    if (lv1_mi == 2000) {
        const { filter_tab } = MenuData.mid_menu_result
        //  早盘 或者 今日的  电竞
        let csid = parseInt(filter_tab) - 2000;
        params = {
        csid,
        device: "PC_PRO",
        };
    } else {
        // 早盘 的 请求 euid 是 赛种  +3 对应的 euid 不是 玩法对应的
        let mi_euid = BaseData.mi_info_map[`mi_${lv1_mi}3`] || {};
        // orpt // pis
        let mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`] || {};
        if (lv1_mi == 118) {
        euid = '3020212'
        }
        // 早盘的 其他 常规赛种
        params = {
        apiType: 1,
        cuid: UserCtr.get_uid(), //用户 id
        device: "PC",
        ...mi_info,
        euid: mi_euid.euid || euid, // lv2_mi 找到 euid
        md: undefined,
        selectionHour: null,
        sort: 1,
        tid,
        };
    }
    return params;
}
/**
 *  早盘 的 日期 菜单点击
*/
const handle_click_menu_mi_3_date = (detail = {}) => {
    let { label,type } = detail;
    const { mid_menu_result,left_menu_result } = MenuData
    let params = {
      ...mid_menu_result,
      md: label,
    }

    let current_menu = mid_menu_result.current_mi

    if(!MenuData.is_esports()){
      // type 早盘 今日 对赛种进行拼接
      current_menu = left_menu_result.lv1_mi +''+ type
      let menu_root = 20 + '' + type
      // 设置当前的一级菜单类型
      MenuData.set_menu_root(menu_root)
    }
    // 设置      中间 菜单输出
    MenuData.set_mid_menu_result(params);
    MenuData.set_menu_current_mi(current_menu)
}

// 获取日期菜单数据
const get_data_menu_result = async () => {
    let params = compute_get_date_menu_list_params();
    let api_fn_name = ''
    if (MenuData.is_esports()) {
      //电竞
      api_fn_name = "get_esports_date_menu"
    } else {
      api_fn_name = "post_date_menu"
    }
    let res = await api_common[api_fn_name](params);
    let data = res.data;
    let arr = [];
    if (Array.isArray(data)) {
      data.map((x) => {
        arr.push({
          count: x.count,
          // md: x.menuType == 100 ? '' : x.field1,  // 冠军的md为空
          md: x.menuType == 100 ? '100' : x.field1,  // 冠军的md为100
          menuName: x.menuName,
        });
      });
    }
    return arr
}

/**
* 获取 日期 菜单
* nu/getDateMenuList
*/
const get_date_menu_list = async () => {
    list.value = await get_data_menu_result();
    date_menu_version.value = Date.now()
    let index_info = 0, md_info = ''
    const { left_menu_result, match_list_api_config = {} } = MenuData
    // 收藏返回还是当前数据
    if (left_menu_result.root == 3) {
      // 早盘获取选中的时间
      const { match_list = {} } = match_list_api_config
      md_info = (match_list.params || {}).md || ''
      index_info = (match_list.params || {}).index || 0
      final_index.value = index_info
    }
    final_index.value = index_info;
    handle_click_menu_mi_3_date({ md: md_info })
}

/**
* 获取 日期 菜单
* nu/getDateMenuList
*/
const get_date_menu_matches_list = async () => {
    let data = await get_data_menu_result();
    console.log(data, 'data')
    let arr = [];
    if (Array.isArray(data)) {
      data.map((x) => {
        if(x.md){
          arr.push({
            count: x.count,
            value: x.md,
            label: x.menuName,
          });
       }
      });
    }
    current_filter_list.value = [{label:"Today",value:""}, ...arr]
    final_index.value = current_filter_list.value[0].value
    handle_click_menu_mi_3_date(current_filter_list.value[0])
}



/**
 * 设置 中间菜单的输出
 */
const set_mid_menu_result = () => {
    //     请求  列表结构  API 参数的   模板
    let { config, description } =
      MenuData.get_match_list_api_config_tepmlate_and_description();
    let params = {};
    let left_menu_result = MenuData.left_menu_result;
    let { lv1_mi, lv2_mi, euid } = left_menu_result;
    if (lv1_mi == 2000) {
      //  早盘 或者 今日的  电竞
      let csid = parseInt(lv2_mi) - 2000;
      //电竞
      params = {
        mi: lv2_mi,
        csid,
      };
    } else {
      // 早盘的 其他 常规赛种
      params = {
        mi: lv2_mi,
        euid: euid, // lv2_mi 找到 euid
        md: final_date_menu.value.field1,
        index: final_index.value, // 当前选中的时间 接口用不上 只是存储下一使用
      };
    }
    console.log('params', config);
    // 设置      中间 菜单输出
    MenuData.set_mid_menu_result(params);
    // 设置   请求  列表结构  API 参数的  值
    MenuData.get_match_list_api_config_tepmlate_and_description(config);
}

const hand_cilck_move = (left) => {
    if (!props.is_drag) return;
    let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50);
    if (left >= 0) {
      left = 0;
    } else if (left < max_left) {
      left = max_left;
    }
    item_wrap_left.value = left;
}

export {
    compute_get_date_menu_list_params,
    handle_click_menu_mi_3_date,
    get_data_menu_result,
    get_date_menu_list,
    set_mid_menu_result,
    hand_cilck_move,
    final_index,
    date_menu_version,
    item_wrap_left,
    list,
    get_date_menu_matches_list,
    current_filter_list
}