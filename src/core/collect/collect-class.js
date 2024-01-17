import lodash_ from "lodash"
import { api_common } from "src/api/index.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import { MenuData } from "src/output/index.js";
import BaseData from "src/core/base-data/base-data.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { PROJECT_NAME,BUILD_VERSION,IS_FOR_NEIBU_TEST } = BUILDIN_CONFIG ;

// 获取收藏数量
const get_collect_count = () => {
  let type_ = {
    1:1,
    2:3,
    3:4,
    400:100,
  }
  // 移动端 才会走这里
  // if(!PROJECT_NAME.includes('h5')){
  //   return
  // }
  //目前只有复刻版
  if(!["app-h5"].includes(PROJECT_NAME)){
    return
  }
  // 获取到当前 tab的赛种
  let list = MenuData.is_esports()?BaseData.dianjing_sublist:MenuData.get_menu_lvmi_list(MenuData.current_lv_1_menu_i);
  // let list = MenuData.is_esports()?BaseData.dianjing_sublist:lodash_.get(MenuData,'menu_lv_mi_lsit', [])
  let type = lodash_.get(MenuData,'current_lv_1_menu_i', 2)
  let euid_list = ''
  // 获取对应的旧菜单id    
  list.forEach(item =>{
    const euid = item.mi? MenuData.get_euid(item.mi):"";
      if(item.ct && euid){
        euid_list += euid + ','
      }
  })
  let parmas = {
    //20001 冠军 的收藏id 传固定的
    euid: type == 400 ? 20001 : euid_list,
    //排序	 int 类型 1 按热门排序 2 按时间排序
    sort: 1,
    //1：滚球，2：即将开赛，3：今日赛事，4：早盘，100：冠军
    type: type_[type], 
    cuid: UserCtr.get_cuid(),
  }
  api_common.get_collect_menu_count_pc(parmas).then( (res={}) => {
    if(res.code == 200){
      let collect_obj = lodash_.get(res, 'data[0]', {})
      // 获取到数据后 更新菜单上收藏数量
      MenuData.set_collect_count(collect_obj.count)
    }
  })
}

export {
  get_collect_count
}