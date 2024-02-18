import { ref } from "vue";
import BaseData from "src/core/base-data/base-data.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import UserCtr from "src/core/user-config/user-ctr.js";






class SportsDataClass {
    constructor() {
        this.init()
    }
    init () {
     this.current_menu = ref({});
     this.menu_mi = ref(1);
    }

    /**
     * 解析 新接口返回值     常规 +电竞
     */
    resolve_mew_menu_res_mi_100_2000 () {
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
            mi_2000_list.push(item);
        }
        });
        return {
            //常规体育
            mi_100_list,
            //电竞
            mi_2000_list,
            //  VR  体育的
            vr_menu_obj: BaseData.vr_mi_config || []
        }
    }

    /**
     * 单个菜单按钮点击   滚球 的
     */
    handle_click_menu_mi_1(detail = {}) {
        // { mi:'',   root:'',   sports:'',  guanjun:'' }
      let {
        mif,
        mi, //当前的菜单
        root, //root 菜单
        sports,
        menu,
        guanjun,
      } = detail;
      const { mi_100_list, mi_2000_list} = this.resolve_mew_menu_res_mi_100_2000();
        // 滚球全部关闭的情况下 顺移到下一个
      if (mi == 1 && !GlobalAccessConfig.get_playAllShow()) {
        mi = (mi_100_arr.value[0] || {}).mi;
        sports = "common";
      }
        this.current_menu.value = mi;
        // vr 使用 自定义 mi
        if (root == 300) {
            this.current_menu.value = menu;
        }
        if (mi != 1) {
            this.menu_mi.value = mi;
        }
        let route = "list";
        let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
        //     请求  列表结构  API 参数的   模板
        let params = {};
        let obj = {};
        //全部
        if (GlobalAccessConfig.get_playAllShow()) {
            obj = this.compute_quanbu_euid(mi_100_list, mi_2000_list);
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
            guanjun: guanjun,
        };
        } else {
        params = {
            ...mi_info,
            root, //root 菜单
            sports,
            route,
            mi,
            mif,
            guanjun: guanjun,
        };
        }
        // 设置      中间 菜单输出
        menu_config.set_mid_menu_result(params);
  }
    /**
     * 滚球 全部 euid 计算
     */
    compute_quanbu_euid (mi_100_arr, mi_2000_arr) {
    //  console.warn('BaseData',BaseData)
    //  console.warn('mi_100_arr',this.mi_100_arr)
    //全部 euid
    let euids = [];
    //全部 csid
    let csids = [];
    // 常规的计算
  
    mi_100_arr.map((x) => {
      let obj = BaseData.mi_info_map[`mi_${x.mi}`] || {};
      euids.push(obj.euid);
    });
    //电竞
    mi_2000_arr.map((x) => {
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
}

export default new SportsDataClass();