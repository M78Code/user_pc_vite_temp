import { UserCtr,MenuData } from 'src/core/index.js'
import BaseData from "src/core/base-data/base-data.js";
import { api_common } from "src/api/index.js";






class DateTabClass {

    /**
 * 计算 日期 接口 请求参数
 */
  compute_get_date_menu_list_params () {
    let params = {};
    let left_menu_result = MenuData.left_menu_result;
    let {
      lv1_mi,
      lv2_mi,
      euid,
      tid = "",
    } = left_menu_result;
    if (lv1_mi == 2000) {
      //  早盘 或者 今日的  电竞
      let csid = parseInt(lv2_mi) - 2000;
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
 handle_click_menu_mi_3_date (detail = {}) {
    let { md } = detail;
    let root = MenuData.menu_root;
    let { lv2_mi, lv1_mi } = MenuData.left_menu_result
    // 当前 pid 和 orpt
    let lv2_mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`];
    // 父级euid
    let euid;
    if (root != 2000) {
      // 娱乐
      if (lv1_mi == 118) {
        euid = '3020212' || BaseData.mi_info_map[`mi_${lv2_mi}`].euid;
      } else {
        euid = BaseData.mi_info_map[`mi_${lv1_mi}${root}`].euid
      }
    }
    let params = { ...lv2_mi_info, lv2_mi, md, euid };
    // 设置      中间 菜单输出
    MenuData.set_mid_menu_result(params);
  }

}

export default new DateTabClass()