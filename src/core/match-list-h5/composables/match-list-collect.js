import MatchCtr from "src/core/match-list-h5/match-class/match-ctr.js";
import {  MenuData  } from "src/output/project/index.js";
import  PageSourceData from  "src/core/page-source/page-source.js"


import { ref} from "vue"

// 接口出错时，uid的 字符串
const match_is_empty= ref(true)
/**
 * @description: 删除收藏赛事列表的赛事
 * @param {String} k 收藏类型赛事('mf')与联赛('tf')
 * @param {Number} index 赛事下标
 * @return {Undefined} Undefined
 */
const del_collect = (k, index) => {
  if (k == "tf") {
    // 冠军收藏时,mid是唯一的,tn不一定有值
    // get_current_menu.date_menu.menuType == 100 电竞冠军
    if (_.get(MenuData.current_menu, "date_menu.menuType") == 100) {
      MatchCtr.clearMidObj(MatchCtr.list[index]);
    } else {
      let tid = MatchCtr.list[index].tid;
      MatchCtr.list.forEach((item) => {
        if (item.tid == tid) {
          MatchCtr.clearMidObj(item);
        }
      });
    }
  } else {
    MatchCtr.clearMidObj(MatchCtr.list[index]);
  }
  if (MatchCtr.list.length == 0) {
   match_is_empty.value = true;
  }
  //列表页移除赛事
  this.run_process_when_need_recompute_container_list &&
    this.run_process_when_need_recompute_container_list(true);
};


/**
 * @description: 改变收藏图标状态
 * @param {Object} params
 * @return {Undefined} Undefined
 */
export const change_favorite_state = (params) => {
    let match = MatchCtr.list[params.index];
    // 联赛收藏图标状态样式更新
    if (match && match.mid) {
      if (params.item === "tf") {
        MatchCtr.list.forEach((match_iterate) => {
          let match_dic = MatchCtr.mid_obj[match_iterate.mid];
          //冠军玩法的mid是唯一的
      let  main_menu_type =  +MenuData.get_menu_type()
          let flag =
            ([100, 3000].includes(main_menu_type) &&
              match_iterate.mid == match.mid) ||
            (match_iterate.tid == match.tid && ![100].includes( main_menu_type));
          if (flag) {
            if (match_dic) {
              match_dic.mf = params.bool;
              match_dic.tf = params.bool;
            }
            match_iterate.mf = params.bool;
            match_iterate.tf = params.bool;
          }
        });
        match.mf = params.bool;
        match.tf = params.bool;
      }
    }
  
    // 收藏列表点击取消收藏后移除该赛事
    if (MatchCtr.mid_obj[match.mid]) {
      MatchCtr.mid_obj[match.mid][params.item] = params.bool;
    }
    for (let i = 0, l = MatchCtr.list.length; i < l; i++) {
      let m = MatchCtr.list[i];
      if (m.mid == match.mid) {
        m[params.item] = params.bool;
        break;
      }
    }
    // 取消收藏
    if (!params.bool) {
      if (PageSourceData.is_show_favorite_list()) {
        del_collect(params.item, params.index);
      }
    }
  };


  return {
    match_is_empty
  }